// Shared output cleaner for Augur AI responses.
// Students asked for plain, human-looking text: no markdown asterisks and no
// em/en dashes. This runs on the server before a reply is stored, and again on
// the client for older stored messages.

export function cleanAugurText(input: string): string {
  if (!input) return "";
  let out = input;

  // Bold / italic markers -> plain text
  out = out.replace(/\*\*\*(.+?)\*\*\*/g, "$1");
  out = out.replace(/\*\*(.+?)\*\*/g, "$1");
  out = out.replace(/\*(.+?)\*/g, "$1");
  out = out.replace(/__(.+?)__/g, "$1");

  // Asterisk bullets -> simple dashes
  out = out.replace(/^[ \t]*\*[ \t]+/gm, "- ");

  // Any stray asterisk left over
  out = out.replace(/\*/g, "");

  // Em / en dashes -> normal punctuation
  out = out.replace(/\s*[—–]\s*/g, ", ");

  // Tidy the punctuation the replacement can create
  out = out.replace(/,\s*,/g, ",");
  out = out.replace(/,\s*([.;:!?])/g, "$1");
  out = out.replace(/\s+,/g, ",");
  out = out.replace(/[ \t]{2,}/g, " ");

  return out.trim();
}

export const STYLE_RULES = `Formatting rules you must always follow:
1. Never use asterisks for any reason. No bold, no italics, no asterisk bullets.
2. Never use an em dash or en dash. Use a comma, a full stop or brackets instead.
3. Use plain headings on their own line and simple hyphen bullets.
4. Write like a human lecturer speaking clearly, not like a formatted document.`;
