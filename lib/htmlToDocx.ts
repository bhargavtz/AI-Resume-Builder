import { Paragraph, TextRun } from 'docx';

export function convertHtmlToDocx(html: string): Paragraph[] {
    if (!html) return [];
    if (typeof window === 'undefined') {
        // Fallback for server-side (shouldn't happen for export)
        return [new Paragraph({ text: html.replace(/<[^>]*>/g, '') })];
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const paragraphs: Paragraph[] = [];

        Array.from(doc.body.childNodes).forEach((node) => {
            if (node.nodeName === 'P') {
                paragraphs.push(new Paragraph({
                    children: parseChildren(node),
                }));
            } else if (node.nodeName === 'UL') {
                Array.from(node.childNodes).forEach((li) => {
                    if (li.nodeName === 'LI') {
                        paragraphs.push(new Paragraph({
                            children: parseChildren(li),
                            bullet: { level: 0 }
                        }));
                    }
                });
            } else if (node.nodeName === 'OL') {
                let index = 1;
                Array.from(node.childNodes).forEach((li) => {
                    if (li.nodeName === 'LI') {
                        // Simulate numbering since setting up abstract numbering is complex
                        const children = parseChildren(li);
                        children.unshift(new TextRun({ text: `${index}. ` }));
                        paragraphs.push(new Paragraph({
                            children: children,
                            indent: { left: 720, hanging: 360 } // Indent to look like list
                        }));
                        index++;
                    }
                });
            } else if (node.nodeName === '#text' && node.textContent?.trim()) {
                paragraphs.push(new Paragraph({
                    text: node.textContent.trim()
                }));
            }
        });

        // If no paragraphs parsed (e.g. plain text without wrapper), fallback
        if (paragraphs.length === 0) {
            return [new Paragraph({ text: doc.body.textContent || '' })];
        }

        return paragraphs;
    } catch (e) {
        console.error("Error parsing HTML to DOCX", e);
        return [new Paragraph({ text: html.replace(/<[^>]*>/g, '') })];
    }
}

function parseChildren(node: Node): TextRun[] {
    const runs: TextRun[] = [];
    Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            runs.push(new TextRun({ text: child.textContent || '' }));
        } else if (['STRONG', 'B'].includes(child.nodeName)) {
            runs.push(new TextRun({ text: child.textContent || '', bold: true }));
        } else if (['EM', 'I'].includes(child.nodeName)) {
            runs.push(new TextRun({ text: child.textContent || '', italics: true }));
        } else {
            // Recursive for nested tags? For simplicity flat text
            // If it's a span or unknown tag, just grab text content
            runs.push(new TextRun({ text: child.textContent || '' }));
        }
    });
    return runs;
}
