import { BLOCKS, INLINES, type Document } from "@contentful/rich-text-types";
export function richText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const node = value as { value?: unknown; content?: unknown[] };
  if (typeof node.value === "string") return node.value;
  return Array.isArray(node.content)
    ? node.content.map(richText).filter(Boolean).join(" ")
    : "";
}
export function imageUrl(value: unknown) {
  const url = typeof value === "string" ? value : "";
  return url.startsWith("//")
    ? `https:${url}`
    : url.startsWith("https://")
      ? url
      : "/assets/images/logos/logo-zoodoo-green.png";
}
export function positivePage(value: unknown) {
  const n =
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : 1;
  return Number.isSafeInteger(n) && n > 0 && n <= 10000 ? n : 1;
}

const nodeTypes = new Set<string>([
  ...Object.values(BLOCKS),
  ...Object.values(INLINES),
  "text",
]);
export function richDocument(value: unknown): Document {
  function valid(node: unknown): boolean {
    if (!node || typeof node !== "object") return false;
    const n = node as Record<string, unknown>;
    if (
      typeof n.nodeType !== "string" ||
      !nodeTypes.has(n.nodeType) ||
      !n.data ||
      typeof n.data !== "object"
    )
      return false;
    if (n.nodeType === "text")
      return (
        typeof n.value === "string" &&
        Array.isArray(n.marks) &&
        n.marks.every(
          (m) =>
            !!m &&
            typeof m === "object" &&
            typeof (m as { type?: unknown }).type === "string",
        )
      );
    return Array.isArray(n.content) && n.content.every(valid);
  }
  return valid(value) &&
    (value as { nodeType: string }).nodeType === BLOCKS.DOCUMENT
    ? (value as Document)
    : { nodeType: BLOCKS.DOCUMENT, data: {}, content: [] };
}
export function validSlug(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 200 &&
    /^[\p{L}\p{N}._-]+$/u.test(value)
  );
}
