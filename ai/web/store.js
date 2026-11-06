// Conversations are kept in this browser only (localStorage).

const KEY = "tmh.conversations.v1";
const MAX_CONVERSATIONS = 30;

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_CONVERSATIONS)));
  } catch {
    // Storage full or disabled: the chat still works, it just isn't saved.
  }
}

export function listConversations() {
  return read().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getConversation(id) {
  return read().find(item => item.id === id) ?? null;
}

export function newConversation() {
  const id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  return { id, title: "New chat", topic: null, createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
}

export function saveConversation(conversation) {
  if (!conversation.messages.length) return;
  const list = read().filter(item => item.id !== conversation.id);
  list.unshift({ ...conversation, updatedAt: Date.now() });
  write(list);
}

export function deleteConversation(id) {
  write(read().filter(item => item.id !== id));
}
