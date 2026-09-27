import { assertValidTutorResponse, validateTutorResponse } from "./response-validator.js";
import type { GeneratedTutorResponse } from "./response-generator.js";

function baseResponse():GeneratedTutorResponse {
  return {
    title:"Tech-Mastery-Hub AI Tutor - typescript",
    message:"Response generated from trusted repository evidence.",
    sections:[
      {
        type:"explanation",
        title:"Explanation",
        content:"TypeScript explanation.",
        sourcePath:"knowledge/concepts/typescript/README.md"
      }
    ],
    repositoryBacked:true,
    repositoryGap:false,
    provenance:["repository:knowledge/concepts/typescript/README.md"],
    nextStep:"practice",
    mastery:"learning",
    visual:{
      required:false,
      selectedKind:null,
      purpose:null,
      sourcePath:null,
      repositoryBacked:false,
      reason:"Visual teaching was not selected by the teaching strategy."
    }
  };
}

const valid=validateTutorResponse(baseResponse());
if(!valid.valid) throw new Error(`Valid response rejected: ${valid.errors.join(" | ")}`);

const gap=baseResponse();
gap.repositoryBacked=false;
gap.repositoryGap=true;
gap.sections=[{
  type:"repository-gap",
  title:"Repository Gap",
  content:"No trusted repository evidence was found.",
  sourcePath:null
}];
gap.provenance=[];
if(!validateTutorResponse(gap).valid) throw new Error("Valid repository-gap response rejected.");

const mismatch=baseResponse();
mismatch.repositoryBacked=true;
mismatch.repositoryGap=true;
if(validateTutorResponse(mismatch).valid) throw new Error("Invalid repository state was accepted.");

const missingProvenance=baseResponse();
missingProvenance.provenance=[];
if(validateTutorResponse(missingProvenance).valid) throw new Error("Missing repository provenance was accepted.");

const badSource=baseResponse();
badSource.sections[0].sourcePath="knowledge/concepts/css/README.md";
if(validateTutorResponse(badSource).valid) throw new Error("Unattributed source path was accepted.");

const badVisual=baseResponse();
badVisual.visual.selectedKind="repository-image";
badVisual.visual.required=false;
if(validateTutorResponse(badVisual).valid) throw new Error("Invalid visual state was accepted.");

assertValidTutorResponse(baseResponse());
process.stdout.write("RESPONSE VALIDATOR TEST: PASS`n");

