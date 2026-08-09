// Turns an Augur conversation (or a single Professor answer) into a clean,
// printable PDF the student can keep or share.
import jsPDF from "jspdf";

export type PdfMessage = { role: string; content: string; created_at?: string };

const MARGIN = 46;
const LINE = 15;

function wrap(doc: jsPDF, text: string, width: number) {
  return doc.splitTextToSize(text.replace(/\r/g, ""), width) as string[];
}

export function messagesToPdf(opts: {
  title: string;
  subtitle?: string;
  messages: PdfMessage[];
  fileName: string;
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const width = pageW - MARGIN * 2;
  let y = MARGIN;

  const nextPage = (needed = LINE) => {
    if (y + needed > pageH - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(wrap(doc, opts.title, width), MARGIN, y);
  y += LINE + 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(
    opts.subtitle ??
      `Augur.edu · generated ${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}`,
    MARGIN,
    y,
  );
  y += LINE + 6;
  doc.setDrawColor(210);
  doc.line(MARGIN, y, pageW - MARGIN, y);
  y += LINE;

  for (const m of opts.messages) {
    if (m.role === "system" || !m.content?.trim()) continue;
    const who = m.role === "user" ? "You" : "Professor Augur";

    nextPage(LINE * 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(m.role === "user" ? 60 : 25);
    doc.text(who, MARGIN, y);
    y += LINE;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30);
    for (const line of wrap(doc, m.content, width)) {
      nextPage();
      doc.text(line, MARGIN, y);
      y += LINE;
    }
    y += 8;
  }

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Augur.edu · page ${p} of ${pages}`, MARGIN, pageH - 22);
  }

  doc.save(opts.fileName.endsWith(".pdf") ? opts.fileName : `${opts.fileName}.pdf`);
}

export function slugForFile(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "augur-chat"
  );
}
