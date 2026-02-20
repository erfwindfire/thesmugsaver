
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_car_selling_source.md';
const outputPath = 'scripts/car_selling_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata
const tlDrStart = html.indexOf('## TL;DR — At-a-Glance Summary');
html = html.substring(tlDrStart);

// 2. TL;DR Grid
// Format:
// ## TL;DR — At-a-Glance Summary
// Bottom Line: ...
// ## The Harsh Reality...

const harshRealityStart = html.indexOf('## The Harsh Reality');
const tlDrBlock = html.substring(0, harshRealityStart);
html = html.substring(harshRealityStart);

// Extract content
const bottomLine = tlDrBlock.match(/Bottom Line: (.*)/)?.[1] || '';

// Build TL;DR Grid HTML
let tlDrHtml = `
<div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 mb-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-4">TL;DR — At-a-Glance Summary</h2>
    <p class="text-gray-700 font-medium">${bottomLine}</p>
</div>
`;

// Prepend TL;DR
html = tlDrHtml + html;

// 3. Headings
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

// 4. Tables
// Standard Markdown tables
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    let tableHtml = '<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse">\n<thead>\n<tr class="bg-gray-100 border-b-2 border-gray-200">\n';
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold text-gray-700 whitespace-nowrap">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach(row => {
        tableHtml += '<tr class="border-b border-gray-100 hover:bg-gray-50">\n';
        row.forEach(cell => tableHtml += `<td class="p-3 text-gray-700">${cell}</td>\n`);
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 5. Lists
// Bullet points: "• Text" or "• • Text"
// The source uses "• •" for sub-bullets often, or just bullets.
html = html.replace(/^[•] [•]? (.*$)/gm, '<li>$1</li>');

// Wrap <li> in <ul>
html = html.split('\n').reduce((acc, line) => {
    if (line.trim().startsWith('<li>')) {
        if (!acc.inList) {
            acc.text += '<ul class="list-disc pl-5 mb-4 space-y-2 text-gray-700">\n';
            acc.inList = true;
        }
        acc.text += line + '\n';
    } else {
        if (acc.inList) {
            acc.text += '</ul>\n';
            acc.inList = false;
        }
        acc.text += line + '\n';
    }
    return acc;
}, { text: '', inList: false }).text;

// 6. Professional Valuation Tools Grid
// ### Professional Valuation Tools (Use All Three)
// #### CAP HPI
// Industry standard...
// #### Parkers
// Consumer-friendly...
// #### What Car?
// Market average...

// We can target specific sections and wrap them in a grid
const valuationHeader = '<h3>Professional Valuation Tools (Use All Three)</h3>';
const valuationIndex = html.indexOf(valuationHeader);
if (valuationIndex !== -1) {
    // End is next header "<h3>Real-World Market Research</h3>"
    // Actually the next header is "<h3>Real-World Market Research</h3>" in the source. 
    // Wait, the source has "### Real-World Market Research" which becomes <h3>

    // We can't easily validly regex replace strict blocks without strict limits.
    // However, the structure is usually:
    // <h4>Title</h4>
    // <p>Desc</p>
    // <p>Desc</p>

    // Let's rely on standard formatting for now. It renders fine vertically.
}

// 7. Winning Ad Template
// Headline: ...
// Opening: ...
// Condition: ...
// This section might benefit from a styled box.
const adTemplateHeader = '<h3>Winning Ad Template</h3>';
const adIndex = html.indexOf(adTemplateHeader);
if (adIndex !== -1) {
    // It ends at "<h3>9. Managing Buyer Inspections</h3>" which is next section.
    // The content is: <p>Headline: ...</p> <p>Opening: ...</p>
    // We can wrap this whole area in a code-like block or card.

    // For now, let's leave as standard text, maybe bold the labels.
    html = html.replace(/(Headline|Opening|Condition|Features|Viewing|Contact):/g, '<strong>$1:</strong>');
}


// 8. FAQs
const faqHeader = '<h3>Frequently Asked Questions</h3>';
const faqIndex = html.indexOf(faqHeader);

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + faqHeader.length);
    let afterFaq = html.substring(faqIndex + faqHeader.length);

    // Split by <h3> (the questions)
    const parts = afterFaq.split('<h3>');
    let processedFaqs = parts[0];

    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        const endHeader = part.indexOf('</h3>');
        const title = part.substring(0, endHeader).trim();
        let content = part.substring(endHeader + 5).trim();

        if (title.startsWith('Related Money-Saving Guides') || title.startsWith('Get More Money')) {
            if (title.startsWith('Related Money-Saving')) {
                // Format links
                // [Text](Link) -> <a ...>
                content = content.replace(/\[((?:[^\]]+))\]\(([^)]+)\)/g, '<li class="mb-2"><a href="$2" class="text-blue-600 font-medium hover:underline">$1</a></li>');
                processedFaqs += `<h3>${title}</h3>\n<ul class="list-none pl-0">\n${content}\n</ul>\n\n`;
            } else {
                processedFaqs += `<h3>${title}</h3>\n${content}\n\n`;
            }
            continue;
        }

        const detailsBlock = `
<details class="group mb-4">
<summary class="flex justify-between items-center font-bold cursor-pointer bg-gray-50 p-4 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors">
    <span>${title}</span>
    <span class="text-blue-600 transition-transform group-open:rotate-180">▼</span>
</summary>
<div class="p-4 text-gray-700 bg-white border border-t-0 border-gray-100 rounded-b-lg">
${content}
</div>
</details>`;
        processedFaqs += detailsBlock + '\n\n';
    }

    html = beforeFaq + '\n\n' + processedFaqs;
}

// 9. Subscribe Button
html = html.replace(/<p>Subscribe Free<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 10. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 11. Paragraphs
const blocks = html.split(/\n\n+/);
const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.match(/^<(h\d|ul|li|div|p|details|summary|button|table|thead|tbody|tr|td|a)/)) {
        return trimmed;
    }
    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 12. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
