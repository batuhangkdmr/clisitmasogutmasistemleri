export const serviceSummaryLimit = 300;

export function articleBlocks(content) {
  return content.replace(/^(## .+)$/gm, "\n\n$1\n\n").split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim()).filter(Boolean)
    .map((text, index) => ({ text, id: `bolum-${index + 1}`, heading: text.startsWith("## ") ? text.slice(3) : "" }));
}
