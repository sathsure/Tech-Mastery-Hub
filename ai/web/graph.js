// "How it connects": a small radial map of the question, the topics it touches and the sources found.
import { escapeHtml } from "./render.js";

const KIND_CLASS = { question: "k-question", "follow-up": "k-follow", note: "k-note", role: "k-role", term: "k-term", roadmap: "k-roadmap" };
const W = 320;
const H = 230;
const CX = W / 2;
const CY = H / 2;

function polar(radius, angle) {
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle) * 0.82];
}

/**
 * evidence: [{n, kind, question, topics}], labels: topic id → display name.
 * Returns an SVG string; nodes carry data-n so the caller can link them to source cards.
 */
export function connectionMap(evidence, labels) {
  if (!evidence.length) return "";
  const topics = [...new Set(evidence.map(item => item.topics[0]).filter(Boolean))].slice(0, 5);
  const topicPos = new Map(topics.map((topic, i) => [topic, polar(58, -Math.PI / 2 + (i * 2 * Math.PI) / topics.length + (topics.length === 1 ? 0 : 0.35))]));
  const sources = evidence.map((item, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / evidence.length + 0.2;
    return { ...item, pos: polar(104, angle), anchor: topicPos.get(item.topics[0]) ?? [CX, CY] };
  });

  const edges = [
    ...topics.map(topic => {
      const [x, y] = topicPos.get(topic);
      return `<line class="edge edge-topic" x1="${CX}" y1="${CY}" x2="${x}" y2="${y}"/>`;
    }),
    ...sources.map(source => `<line class="edge" data-n="${source.n}" x1="${source.anchor[0]}" y1="${source.anchor[1]}" x2="${source.pos[0]}" y2="${source.pos[1]}"/>`),
  ];
  const topicNodes = topics.map(topic => {
    const [x, y] = topicPos.get(topic);
    const label = escapeHtml(labels[topic] ?? topic);
    const width = Math.max(44, label.length * 6.4 + 16);
    return `<g class="node-topic" transform="translate(${x} ${y})"><rect x="${-width / 2}" y="-10" width="${width}" height="20" rx="10"/><text text-anchor="middle" dy="4">${label}</text></g>`;
  });
  const sourceNodes = sources.map(source => `<g class="node-source ${KIND_CLASS[source.kind] ?? ""}" data-n="${source.n}" transform="translate(${source.pos[0]} ${source.pos[1]})" tabindex="0" role="button" aria-label="Source ${source.n}: ${escapeHtml(source.question)}"><title>${escapeHtml(source.question)}</title><circle r="12"/><text text-anchor="middle" dy="4">${source.n}</text></g>`);

  return `<svg class="connection-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="How the sources connect">
    <defs><radialGradient id="core-glow"><stop offset="0%" stop-color="#22d3ee" stop-opacity=".55"/><stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/></radialGradient></defs>
    <circle cx="${CX}" cy="${CY}" r="34" fill="url(#core-glow)"/>
    ${edges.join("")}
    <g class="node-core" transform="translate(${CX} ${CY})"><circle r="15"/><text text-anchor="middle" dy="4">?</text></g>
    ${topicNodes.join("")}
    ${sourceNodes.join("")}
  </svg>`;
}
