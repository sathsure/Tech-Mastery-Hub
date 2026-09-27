import {
  createAuthoritativeReindexTrigger
} from "./github-provider.js";
import {
  executePostMergeReindex
} from "./post-merge-reindex.js";

export interface GitHubPostMergeReindexResult {
  trigger: Awaited<
    ReturnType<typeof createAuthoritativeReindexTrigger>
  >;
  reindex: Awaited<
    ReturnType<typeof executePostMergeReindex>
  >;
}

export async function processVerifiedGitHubMerge(
  merge: Parameters<
    typeof createAuthoritativeReindexTrigger
  >[0]
): Promise<GitHubPostMergeReindexResult> {
  const trigger =
    await createAuthoritativeReindexTrigger(merge);

  const reindex =
    await executePostMergeReindex(merge);

  return {
    trigger,
    reindex
  };
}
