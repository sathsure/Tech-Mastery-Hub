/** Small string helpers that run in linear time (no regex backtracking on user input). */

/** Removes any of `chars` from the end of `text`. */
export function trimEndChars(text: string, chars: string): string {
  let end = text.length;
  while (end > 0 && chars.includes(text[end - 1])) end--;
  return text.slice(0, end);
}

/** Removes any of `chars` from both ends of `text`. */
export function trimChars(text: string, chars: string): string {
  let start = 0;
  while (start < text.length && chars.includes(text[start])) start++;
  return trimEndChars(text.slice(start), chars);
}

/** Sort comparator for plain strings, stable across machines. */
export const byText = (a: string, b: string): number => a.localeCompare(b, "en");

/** The value after "LABEL:" on the first line that starts with it, or null. */
export function labelledLine(text: string, label: string): string | null {
  const prefix = `${label}:`;
  const line = text.split(/\r?\n/).find(item => item.startsWith(prefix));
  const value = line?.slice(prefix.length).trim();
  return value || null;
}

/** Removes characters from the end of `text` while `test` holds. */
export function trimEndWhere(text: string, test: (char: string) => boolean): string {
  let end = text.length;
  while (end > 0 && test(text[end - 1])) end--;
  return text.slice(0, end);
}

/** Removes characters from the start of `text` while `test` holds. */
export function trimStartWhere(text: string, test: (char: string) => boolean): string {
  let start = 0;
  while (start < text.length && test(text[start])) start++;
  return text.slice(start);
}

/** Replaces every "( … )" group with `replacement`; an unclosed "(" is left as it is. */
export function replaceParenGroups(text: string, replacement: string): string {
  let out = "";
  let at = 0;
  while (at < text.length) {
    const open = text.indexOf("(", at);
    if (open < 0) break;
    const close = text.indexOf(")", open + 1);
    if (close < 0) break;
    out += text.slice(at, open) + replacement;
    at = close + 1;
  }
  return out + text.slice(at);
}

/** Removes HTML tags ("<b>", "</a>"); a lone "<" or "<>" stays. */
export function stripTags(text: string): string {
  let out = "";
  let at = 0;
  while (at < text.length) {
    const open = text.indexOf("<", at);
    if (open < 0) break;
    const close = text.indexOf(">", open + 1);
    if (close < 0) break;
    if (close === open + 1) {
      out += text.slice(at, open + 1);
      at = open + 1;
      continue;
    }
    out += text.slice(at, open);
    at = close + 1;
  }
  return out + text.slice(at);
}

/** Markdown links "[text](url)" → "text". */
export function unlinkMarkdown(text: string): string {
  let out = "";
  let at = 0;
  let from = 0;
  while (from < text.length) {
    const open = text.indexOf("[", from);
    if (open < 0) break;
    const close = text.indexOf("]", open + 1);
    const urlEnd = close > open + 1 && text[close + 1] === "(" ? text.indexOf(")", close + 2) : -1;
    if (urlEnd < 0) {
      from = open + 1;
      continue;
    }
    out += text.slice(at, open) + text.slice(open + 1, close);
    at = urlEnd + 1;
    from = at;
  }
  return out + text.slice(at);
}

/** A Markdown heading line ("## Title") → its level and text, or null. */
export function parseHeading(line: string): { level: number; raw: string } | null {
  let level = 0;
  while (line[level] === "#") level++;
  if (level < 1 || level > 6 || !/\s/.test(line[level] ?? "")) return null;
  return { level, raw: line.slice(level).trimStart() };
}
