/**
 * Salary and work-abroad details need the user's profile, as in the Career Atlas (My path, Salary (India)
 * and Work abroad are locked there until the profile is filled in). The profile is kept in the browser,
 * which tells the server whether one exists; without it, these notes are left out of chat answers,
 * suggestions, search and the source viewer.
 *
 * This keeps the tutor consistent with the Atlas. It is not access control: the notes are public in
 * the repository.
 */

const ATLAS_NOTES = "IT_Roles_Terminology_Atlas/IT_Roles_Terminology_Atlas.md";
const PROFILE_ONLY = /^(Skills vs Salary|Expected Pay Abroad|Working Abroad from India)/;

/** True for an Atlas salary or working-abroad note. */
export function needsProfile(path: string, question: string): boolean {
  return path === ATLAS_NOTES && PROFILE_ONLY.test(question);
}

/** Chips that would ask for salary or work-abroad details. */
const PROFILE_CHIP = /salary in india|\(lpa\)|\bwork(ing)? (in|abroad)\b|countries can i work|interview abroad/i;

export function withoutProfileChips(chips: string[]): string[] {
  return chips.filter(chip => !PROFILE_CHIP.test(chip));
}

/** The answer when a question needs the profile. `#atlas:mypath` opens the Atlas, which offers the profile form. */
export const PROFILE_NEEDED_MARKDOWN = [
  "**This needs your profile.**",
  "",
  "Salary figures and work-abroad details unlock once you fill in your profile in the Career Atlas — your role, experience and skills.",
  "",
  "[Set up your profile →](#atlas:mypath)",
].join("\n");
