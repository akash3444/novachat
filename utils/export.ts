import { toPng } from "html-to-image";

export function exportMarkdown(content: string, filename = "content.md") {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export async function exportNodeAsImage(
  node: HTMLElement,
  filename = "content.png"
) {
  const dataUrl = await toPng(node);
  var link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
