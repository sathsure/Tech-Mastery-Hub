/**
 * Links tutor role cards to the Atlas Role Readiness Test (served at /atlas/). The list of roles with a test is read
 * from the Atlas question bank itself, so a role gets the link as soon as its test is added there.
 */
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { REPOSITORY_ROOT } from "./question-indexer.js";

const ATLAS_PAGE = "/atlas/IT_Roles_Terminology_Atlas.html";
const BANK_FILE = resolve(REPOSITORY_ROOT, "IT_Roles_Terminology_Atlas/role-test-data-5.js");

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(?:^-)|(?:-$)/g, "");
/** "Forward Deployed Engineer (FDE)" and "Forward Deployed Engineer" match. */
const key = (name: string) => slug(name.replace(/\s*\([^)]*\)\s*$/, ""));

let tested: Map<string, string> | null = null;

function testedRoles(): Map<string, string> {
  if (tested) return tested;
  tested = new Map();
  try {
    const bank = createRequire(import.meta.url)(BANK_FILE) as { roles?: Array<{ name: string }> };
    for (const role of bank.roles ?? []) tested.set(key(role.name), slug(role.name));
  } catch {
    // No Atlas next to the tutor: role cards simply have no test link.
  }
  return tested;
}

/** The Role Test link for this role, or null when the role has no test yet. */
export function roleTestHref(roleName: string): string | null {
  const roleSlug = testedRoles().get(key(roleName));
  return roleSlug ? `${ATLAS_PAGE}#roletest/${roleSlug}` : null;
}
