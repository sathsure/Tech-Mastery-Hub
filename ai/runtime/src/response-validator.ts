import type { GeneratedTutorResponse } from "./response-generator.js";

export interface ResponseValidationResult {
  valid:boolean;
  errors:string[];
}

function hasRepositoryProvenance(response:GeneratedTutorResponse,path:string):boolean {
  return response.provenance.includes(`repository:${path}`);
}

export function validateTutorResponse(response:GeneratedTutorResponse):ResponseValidationResult {
  const errors:string[]=[];

  if(!response.title.trim()) errors.push("Response title is required.");
  if(!response.message.trim()) errors.push("Response message is required.");
  if(!Array.isArray(response.sections)) errors.push("Response sections must be an array.");
  if(!Array.isArray(response.provenance)) errors.push("Response provenance must be an array.");

  if(response.repositoryBacked===response.repositoryGap) {
    errors.push("repositoryBacked and repositoryGap must be complementary.");
  }

  if(response.repositoryGap&&response.provenance.length>0) {
    errors.push("Repository-gap responses must not claim repository provenance.");
  }

  if(response.repositoryBacked&&!response.provenance.some(item=>item.startsWith("repository:"))) {
    errors.push("Repository-backed responses require repository provenance.");
  }

  for(const section of response.sections) {
    if(!section.type.trim()) errors.push("Every response section requires a type.");
    if(!section.title.trim()) errors.push(`Section "${section.type}" requires a title.`);
    if(!section.content.trim()) errors.push(`Section "${section.type}" requires content.`);
    if(section.sourcePath!==null&&!hasRepositoryProvenance(response,section.sourcePath)) {
      errors.push(`Section "${section.type}" references "${section.sourcePath}" without matching repository provenance.`);
    }
    if(response.repositoryGap&&section.sourcePath!==null) {
      errors.push(`Repository-gap response cannot contain source path "${section.sourcePath}".`);
    }
  }

  const visual=response.visual;

  if(visual.selectedKind===null) {
    if(visual.sourcePath!==null) errors.push("A response without a selected visual cannot have a visual source path.");
    if(visual.repositoryBacked) errors.push("A response without a selected visual cannot mark the visual as repository-backed.");
  }

  if(visual.selectedKind!==null&&!visual.required) {
    errors.push("A selected visual must be marked required.");
  }

  if(visual.repositoryBacked&&visual.sourcePath===null) {
    errors.push("A repository-backed visual requires a repository source path.");
  }

  if(visual.sourcePath!==null&&!hasRepositoryProvenance(response,visual.sourcePath)) {
    errors.push(`Visual source "${visual.sourcePath}" has no matching repository provenance.`);
  }

  if(response.repositoryGap&&visual.repositoryBacked) {
    errors.push("Repository-gap response cannot contain a repository-backed visual.");
  }

  return {valid:errors.length===0,errors};
}

export function assertValidTutorResponse(response:GeneratedTutorResponse):GeneratedTutorResponse {
  const result=validateTutorResponse(response);
  if(!result.valid) throw new Error(`Response validation failed: ${result.errors.join(" | ")}`);
  return response;
}
