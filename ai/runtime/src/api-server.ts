import { createServer, type IncomingMessage, type ServerResponse } from "node:http"; import { executeConversation } from "./conversation-service.js"; import { validateActionRequirements, validateTutorRequest } from "./request-validation.js"; import { API_VERSION, type ApiError, type ApiResponse } from "./api-contracts.js"; import { searchQuestions } from "./question-search.js"; import { runChat } from "./chat-service.js"; import { handleWebRoute } from "./web-routes.js"; import type { ChatEvent, ChatRequest, ChatTurn } from "./chat-contracts.js"; import { REPOSITORY_ROOT } from "./question-indexer.js"; import { readFile } from "node:fs/promises"; import { extname, isAbsolute, relative as relativePosix, resolve as resolvePath } from "node:path"; const HOST=process.env.TUTOR_HOST??"127.0.0.1"; const PORT=Number(process.env.TUTOR_PORT??"8787"); const MAX_BODY=1024*1024; /** Cross-origin access is off unless TUTOR_CORS_ORIGIN names an origin: the app is served from this server, and an open /chat would let any website spend the API key. */
const CORS_ORIGIN=process.env.TUTOR_CORS_ORIGIN?.trim()??"";
const corsHeaders=():Record<string,string>=>CORS_ORIGIN?{"access-control-allow-origin":CORS_ORIGIN,"access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type"}:{};
/** When bound to this machine only, answer only requests addressed to it (blocks DNS-rebinding pages). Extra names: TUTOR_ALLOWED_HOSTS=a.example,b.example */
const LOOPBACK_BIND=/^(127\.\d+\.\d+\.\d+|localhost|::1)$/i.test(HOST);
const ALLOWED_HOSTS=new Set(["127.0.0.1","localhost","[::1]",...(process.env.TUTOR_ALLOWED_HOSTS??"").split(",").map(item=>item.trim().toLowerCase()).filter(Boolean)]);
export function hostAllowed(hostHeader:string|undefined):boolean{if(!LOOPBACK_BIND) return true;const host=(hostHeader??"").toLowerCase().replace(/:\d+$/,"");return ALLOWED_HOSTS.has(host);}
/** /chat requests per client per minute (TUTOR_CHAT_RATE_LIMIT, 0 = no limit). Each answer can cost API tokens. */
const CHAT_LIMIT=Number(process.env.TUTOR_CHAT_RATE_LIMIT??"20");
const chatHits=new Map<string,number[]>();
export function chatAllowed(client:string,now=Date.now()):boolean{if(!(CHAT_LIMIT>0)) return true;const recent=(chatHits.get(client)??[]).filter(time=>now-time<60000);if(recent.length>=CHAT_LIMIT){chatHits.set(client,recent);return false;}recent.push(now);chatHits.set(client,recent);if(chatHits.size>5000) chatHits.clear();return true;} let ready=false; function send<T>(response:ServerResponse,status:number,payload:T):void{response.statusCode=status;response.setHeader("content-type","application/json; charset=utf-8");for(const [name,value] of Object.entries(corsHeaders())) response.setHeader(name,value);response.setHeader("x-tutor-api-version",API_VERSION);response.end(JSON.stringify(payload)+"\n");} function error(response:ServerResponse,status:number,code:string,message:string):void{const payload:ApiError={version:API_VERSION,error:{code,message}};send(response,status,payload);} async function readBody(request:IncomingMessage):Promise<string>{return await new Promise((resolve,reject)=>{let data="";request.on("data",chunk=>{data+=chunk.toString();if(Buffer.byteLength(data,"utf8")>MAX_BODY){reject(new Error("Request body is too large."));request.destroy();}});request.on("end",()=>resolve(data));request.on("error",reject);});} /** GET /search?q=...&limit=8&topic=java  or  POST /search {"query":"...","limit":8,"topic":"java"} */
async function handleSearch(request:IncomingMessage,response:ServerResponse):Promise<void>{
  let input:Record<string,unknown>;
  if(request.method==="GET"){const params=new URL(request.url??"/search","http://localhost").searchParams;input={query:params.get("q")??"",limit:params.has("limit")?Number(params.get("limit")):undefined,topic:params.get("topic")??undefined};}
  else if(request.method==="POST"){
    if(!(request.headers["content-type"]??"").toLowerCase().includes("application/json")){error(response,415,"UNSUPPORTED_MEDIA_TYPE","Content-Type must be application/json.");return;}
    try{const parsed=JSON.parse((await readBody(request))||"{}");if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)){error(response,400,"INVALID_REQUEST","Request body must be a JSON object.");return;}input=parsed as Record<string,unknown>;}
    catch{error(response,400,"INVALID_JSON","Request body is not valid JSON.");return;}
  }
  else{error(response,405,"METHOD_NOT_ALLOWED","Use GET or POST for /search.");return;}
  const {query,limit,topic}=input;
  if(typeof query!=="string"||!query.trim()){error(response,400,"INVALID_REQUEST","query is required.");return;}
  if(query.length>300){error(response,400,"INVALID_REQUEST","query must be 300 characters or fewer.");return;}
  if(limit!==undefined&&(typeof limit!=="number"||!Number.isInteger(limit)||limit<1||limit>50)){error(response,400,"INVALID_REQUEST","limit must be a whole number from 1 to 50.");return;}
  if(topic!==undefined&&(typeof topic!=="string"||topic.length>100)){error(response,400,"INVALID_REQUEST","topic must be a string of 100 characters or fewer.");return;}
  const payload:ApiResponse<ReturnType<typeof searchQuestions>>={version:API_VERSION,data:searchQuestions(query,{limit:limit as number|undefined,topic:topic as string|undefined})};
  send(response,200,payload);
}
/** Validates a /chat body; returns an error message or the request. */
export function validateChatRequest(value:unknown):ChatRequest|string{
  if(!value||typeof value!=="object"||Array.isArray(value)) return "Request body must be a JSON object.";
  const {message,history,topic}=value as Record<string,unknown>;
  if(typeof message!=="string"||!message.trim()) return "message is required.";
  if(message.length>2000) return "message must be 2000 characters or fewer.";
  if(topic!==undefined&&(typeof topic!=="string"||topic.length>100)) return "topic must be a string of 100 characters or fewer.";
  if(history!==undefined){
    if(!Array.isArray(history)||history.length>40) return "history must be a list of at most 40 turns.";
    for(const turn of history){
      const item=turn as Record<string,unknown>;
      if(!item||(item.role!=="user"&&item.role!=="assistant")||typeof item.content!=="string"||!item.content.trim()||item.content.length>12000) return "each history turn needs role user|assistant and content up to 12000 characters.";
    }
    if((history as ChatTurn[]).reduce((total,turn)=>total+turn.content.length,0)>60000) return "history must be 60000 characters or fewer in total.";
  }
  return {message:message.trim(),history:(history as ChatTurn[]|undefined)?.map(turn=>({role:turn.role,content:turn.content})),topic:topic as string|undefined};
}

/** POST /chat {message, history?, topic?, stream?}: Server-Sent Events by default; {"stream":false} returns one JSON object. */
async function handleChat(request:IncomingMessage,response:ServerResponse):Promise<void>{
  if(request.method!=="POST"){error(response,405,"METHOD_NOT_ALLOWED","Use POST for /chat.");return;}
  if(!chatAllowed(request.socket.remoteAddress??"unknown")){response.setHeader("retry-after","60");error(response,429,"RATE_LIMITED","Too many chat requests. Try again in a minute.");return;}
  if(!(request.headers["content-type"]??"").toLowerCase().includes("application/json")){error(response,415,"UNSUPPORTED_MEDIA_TYPE","Content-Type must be application/json.");return;}
  let parsed:unknown;
  try{parsed=JSON.parse((await readBody(request))||"{}");}catch{error(response,400,"INVALID_JSON","Request body is not valid JSON.");return;}
  const validated=validateChatRequest(parsed);
  if(typeof validated==="string"){error(response,400,"INVALID_REQUEST",validated);return;}
  const streaming=(parsed as Record<string,unknown>).stream!==false;
  const abort=new AbortController();
  // The browser closed the connection before the answer finished: stop the model call.
  response.on("close",()=>{if(!response.writableEnded) abort.abort();});
  if(!streaming){
    const events:ChatEvent[]=[];
    for await(const event of runChat(validated,{signal:abort.signal})) events.push(event);
    const answer=events.flatMap(event=>event.type==="delta"?[event.text]:[]).join("");
    send(response,200,{version:API_VERSION,data:{meta:events.find(event=>event.type==="meta")??null,answer,done:events.find(event=>event.type==="done")??null}});
    return;
  }
  response.writeHead(200,{"content-type":"text/event-stream; charset=utf-8","cache-control":"no-cache, no-transform","connection":"keep-alive","x-accel-buffering":"no",...corsHeaders(),"x-tutor-api-version":API_VERSION});
  const write=(event:ChatEvent)=>{if(!response.writableEnded) response.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);};
  try{for await(const event of runChat(validated,{signal:abort.signal})) write(event);}
  catch(exception){write({type:"error",code:"INTERNAL_ERROR",message:exception instanceof Error?exception.message:"Unexpected server error."});}
  response.end();
}

const VISUAL_TYPES:Record<string,string>={".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".gif":"image/gif",".webp":"image/webp",".svg":"image/svg+xml"};
/** GET /visuals/<path>: images from knowledge/visual-notes only. */
async function handleVisual(request:IncomingMessage,response:ServerResponse):Promise<void>{
  const root=resolvePath(REPOSITORY_ROOT,"knowledge/visual-notes");
  let relativePath:string;
  try{relativePath=decodeURIComponent((request.url??"").slice("/visuals/".length).split("?")[0]);}catch{error(response,400,"INVALID_REQUEST","Bad image path.");return;}
  const target=resolvePath(root,relativePath);
  const inside=relativePosix(root,target);
  const type=VISUAL_TYPES[extname(target).toLowerCase()];
  if(!relativePath||inside.startsWith("..")||isAbsolute(inside)||!type){error(response,404,"NOT_FOUND","Image not found.");return;}
  try{
    const data=await readFile(target);
    response.writeHead(200,{"content-type":type,"cache-control":"public, max-age=3600","x-content-type-options":"nosniff","content-security-policy":"default-src 'none'; style-src 'unsafe-inline'",...corsHeaders()});
    response.end(data);
  }catch{error(response,404,"NOT_FOUND","Image not found.");}
}

export function createTutorApiServer(){const server=createServer(async(request,response)=>{try{if(!hostAllowed(request.headers.host)){error(response,403,"FORBIDDEN_HOST","This server only answers requests addressed to it directly.");return;}if(request.method==="OPTIONS"){send(response,204,{});return;}if(await handleWebRoute(request,response)) return;if(request.method==="GET"&&request.url==="/health"){send(response,200,{version:API_VERSION,status:"ok",service:"tech-mastery-hub-ai-tutor"});return;}if(request.method==="GET"&&request.url==="/ready"){send(response,ready?200:503,{version:API_VERSION,ready,service:"tech-mastery-hub-ai-tutor"});return;}if(request.url==="/search"||request.url?.startsWith("/search?")){await handleSearch(request,response);return;}if(request.url==="/chat"){await handleChat(request,response);return;}if(request.method==="GET"&&request.url?.startsWith("/visuals/")){await handleVisual(request,response);return;}if(request.method!=="POST"||request.url!=="/tutor"){error(response,404,"NOT_FOUND","Route not found.");return;}const contentType=request.headers["content-type"]??"";if(!contentType.toLowerCase().includes("application/json")){error(response,415,"UNSUPPORTED_MEDIA_TYPE","Content-Type must be application/json.");return;}const raw=await readBody(request);let parsed:unknown;try{parsed=JSON.parse(raw||"{}");}catch{error(response,400,"INVALID_JSON","Request body is not valid JSON.");return;}const validated=validateTutorRequest(parsed);validateActionRequirements(validated);const result=await executeConversation(validated);const payload:ApiResponse<typeof result>={version:API_VERSION,data:result};send(response,200,payload);}catch(exception){const message=exception instanceof Error?exception.message:"Unexpected server error.";const validationMessages=new Set(["Request body must be a JSON object.","topic is required.","topic must be 300 characters or fewer.","sessionId must be a string of 100 characters or fewer.","action is invalid.","answer must be 5000 characters or fewer.","learningMode is invalid.","visualPreference is invalid.","depth is invalid.","answer is required for answer actions.","section must be a string of 100 characters or fewer."]);const isValidationError=validationMessages.has(message)||message.startsWith("Section cannot be completed yet:");error(response,isValidationError?400:500,isValidationError?"INVALID_REQUEST":"INTERNAL_ERROR",message);}});server.once("listening",()=>{ready=true;});return server;} export function startTutorApi(){const server=createTutorApiServer();const listenPort=PORT;server.listen(listenPort,HOST,()=>{process.stdout.write(`AI Tutor API listening on http://${HOST}:${listenPort}\n`);});const shutdown=()=>{ready=false;server.close(()=>process.exit(0));};process.once("SIGINT",shutdown);process.once("SIGTERM",shutdown);return server;} if(process.argv.includes("--serve")) startTutorApi();



