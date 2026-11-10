// Talks to the tutor API served from the same origin.

async function getJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message ?? `Request failed (${response.status})`);
  return body.data;
}

/**
 * True when the Career Atlas profile is filled in (it lives in this browser). Salary and work-abroad
 * details are shown only then, as in the Atlas.
 */
export function hasProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem("atlas-profile") ?? "null");
    return Boolean(profile && !profile.skipped && profile.role);
  } catch {
    return false;
  }
}
const profileParam = () => (hasProfile() ? "&profile=1" : "");

export const fetchCatalog = () => getJson("/catalog");
export const fetchEntry = id => getJson(`/entry?id=${encodeURIComponent(id)}${profileParam()}`);
export const suggestQuestions = query => getJson(`/suggest?q=${encodeURIComponent(query)}${profileParam()}`);
export const searchNotes = (query, limit = 8) => getJson(`/search?q=${encodeURIComponent(query)}&limit=${limit}${profileParam()}`);

/**
 * POST /chat and read the Server-Sent Events stream.
 * Calls onEvent for each event ({type: "meta"|"status"|"delta"|"done"|"error", ...}).
 */
export async function streamChat({ message, history, topic, plan, overview, mock }, onEvent, signal) {
  const profile = hasProfile();
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "text/event-stream" },
    body: JSON.stringify({ message, history, topic: topic || undefined, plan, overview: overview || undefined, mock, ...(profile ? { profile } : {}) }),
    signal,
  });
  if (!response.ok || !response.body) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Chat failed (${response.status})`);
  }
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let boundary;
    while ((boundary = buffer.indexOf("\n\n")) >= 0) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const data = block.split("\n").filter(line => line.startsWith("data: ")).map(line => line.slice(6)).join("\n");
      if (data) onEvent(JSON.parse(data));
    }
  }
}
