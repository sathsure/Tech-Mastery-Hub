export interface MergeVerification {
  verified: boolean;
  merged: boolean;
  baseBranch: string;
  humanApprovalConfirmed: boolean;
  reason: string;
}
