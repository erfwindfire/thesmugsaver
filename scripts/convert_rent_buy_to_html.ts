
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_rent_buy_source.md';
const outputPath = 'scripts/rent_buy_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata
const summaryHeader = '## At-a-Glance Summary';
const summaryIndex = html.indexOf(summaryHeader);
if (summaryIndex !== -1) {
    html = html.substring(summaryIndex);
}

// 2. TL;DR Grid
// Structure:
// ## At-a-Glance Summary
// ... rent ...
// ### Renting Makes Sense If:
// ...
// ### Buying Makes Sense If:
// ...
// ### Stay Put & Remortgage If:
// ...
// Next main header: "### What is LTV (Loan-to-Value Ratio)?" or "## Quick Answers: Housing Decisions"
// Actually "Key 2026 Reality: ..." is text after the bullet points.
// Let's parse the bullet points for the 3 categories.

const nextSection = '### What is LTV';
const nextSectionIndex = html.indexOf(nextSection);
const summaryBlock = html.substring(0, nextSectionIndex);
html = html.substring(nextSectionIndex);

// Extract lists
const rentingPoints = summaryBlock.match(/### Renting Makes Sense If:[\s\S]*?###/)?.[0].match(/• • (.*)/g)?.map(p => p.replace('• • ', '').trim()) || [];
const buyingPoints = summaryBlock.match(/### Buying Makes Sense If:[\s\S]*?###/)?.[0].match(/• • (.*)/g)?.map(p => p.replace('• • ', '').trim()) || [];
// The last one might go until end of block or "Key 2026 Reality"
const stayPutMatch = summaryBlock.match(/### Stay Put & Remortgage If:[\s\S]*?Key 2026 Reality/)?.[0] || '';
const stayPutPoints = stayPutMatch.match(/• • (.*)/g)?.map(p => p.replace('• • ', '').trim()) || [];

const keyRealityMatch = summaryBlock.match(/Key 2026 Reality: (.*)/)?.[1] || '';

// Build TL;DR Grid HTML
let tlDrHtml = `
<div class="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">At-a-Glance Summary</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-4 rounded-lg shadow-sm border-t-4 border-blue-500">
            <h3 class="font-bold text-lg text-blue-900 mb-3">Renting Makes Sense If:</h3>
            <ul class="space-y-2 text-sm text-gray-700">
                ${rentingPoints.map(p => `<li class="flex items-start"><span class="text-blue-500 mr-2">•</span>${p}</li>`).join('')}
            </ul>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border-t-4 border-green-500">
            <h3 class="font-bold text-lg text-green-900 mb-3">Buying Makes Sense If:</h3>
            <ul class="space-y-2 text-sm text-gray-700">
                ${buyingPoints.map(p => `<li class="flex items-start"><span class="text-green-500 mr-2">•</span>${p}</li>`).join('')}
            </ul>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border-t-4 border-purple-500">
            <h3 class="font-bold text-lg text-purple-900 mb-3">Stay Put & Remortgage If:</h3>
            <ul class="space-y-2 text-sm text-gray-700">
                ${stayPutPoints.map(p => `<li class="flex items-start"><span class="text-purple-500 mr-2">•</span>${p}</li>`).join('')}
            </ul>
        </div>
    </div>
    <div class="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        <strong>Key 2026 Reality:</strong> ${keyRealityMatch}
    </div>
</div>
`;

// Prepend TL;DR
html = tlDrHtml + html;

// 3. Headings
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

// 4. Tables with overflow wrapper
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

// 5. Step-by-Step Blocks (Remortgaging Process, Accelerator Strategies, Action Plan)
// Regex to catch digit followed by h4
html = html.replace(/^(\d)\n\n<h4>(.*)<\/h4>\n\n(.*)$/gm, (match, stepNum, title, text) => {
    return `
<div class="flex flex-col md:flex-row gap-4 bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
    <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold font-outfit">
            ${stepNum}
        </div>
    </div>
    <div>
        <h4 class="text-lg font-bold text-gray-900 mb-2">${title}</h4>
        <p class="text-gray-600">${text}</p>
    </div>
</div>`;
});

// 6. Navigation/Decision Tree logic (Question 1... YES: ... NO: ...)
// We can wrap these in a styled container
// "#### Question 1: ... \n\nYES: ... \nNO: ..."
// Let's rely on standard block formatting but maybe highlight the YES/NO logic with regex if needed.
// For now, let's just style the YES/NO text if it appears at start of line
html = html.replace(/^(YES|NO): (.*)$/gm, '<div class="font-bold my-2"><span class="$1 text-white px-2 py-1 rounded text-sm min-w-[50px] inline-block text-center mr-2">$1</span> $2</div>');
html = html.replace('class="YES', 'class="bg-green-600');
html = html.replace('class="NO', 'class="bg-red-600');

// 7. Scripts (Negotiation Scripts)
// "Script 1: ... \n\n"Hi [Landlord]...""
// Wrap quote blocks in a distinct style
html = html.replace(/"Hi \[.*?\n\n.*?"/gs, (match) => {
    // Remove outer quotes if present or just style the block
    const content = match.replace(/^"|"$/g, '');
    return `<div class="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500 font-mono text-sm text-gray-700 my-4 whitespace-pre-wrap">${content}</div>`;
});

// 8. Lists
html = html.replace(/^[•] [•]? (.*$)/gm, '<li>$1</li>');
// Checkmarks
html = html.replace(/^✓ (.*$)/gm, '<li class="marker:content-[\'✓\'] marker:text-green-500 pl-2">$1</li>');
// Crosses
html = html.replace(/^✗ (.*$)/gm, '<li class="marker:content-[\'✗\'] marker:text-red-500 pl-2">$1</li>');


// Wrap <li> in <ul>
html = html.split('\n').reduce((acc, line) => {
    if (line.trim().startsWith('<li')) {
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

// 9. FAQs
const faqHeader = '<h2>Frequently Asked Questions</h2>';
const faqIndex = html.indexOf(faqHeader);

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + faqHeader.length);
    let afterFaq = html.substring(faqIndex + faqHeader.length);

    // Split by <h3>
    const parts = afterFaq.split('<h3>');
    let processedFaqs = parts[0];

    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        const endHeader = part.indexOf('</h3>');
        const title = part.substring(0, endHeader).trim();
        let content = part.substring(endHeader + 5).trim();

        // "Related Housing & Money Guides" & "Get UK Housing & Money Insights" at the end
        if (title.startsWith('Related Housing') || title.startsWith('Get UK Housing')) {
            processedFaqs += `<h3>${title}</h3>\n${content}\n\n`;
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

// 10. Subscribe Button
html = html.replace(/<p>Subscribe Free<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 11. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 12. Paragraphs
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

// 13. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
