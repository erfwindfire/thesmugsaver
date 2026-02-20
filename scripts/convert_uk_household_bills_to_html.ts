
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_uk_household_bills_source.md';
const outputPath = 'scripts/uk_household_bills_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata and Intro Link
const titleHeader = '# Ultimate Guide';
const titleIndex = html.indexOf(titleHeader);
if (titleIndex !== -1) {
    html = html.substring(titleIndex);
}

// 2. Headings
html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');

// 3. Quick Summary Box
// Starts at ## Quick Summary
const summaryStart = html.indexOf('<h2>Quick Summary');
if (summaryStart !== -1) {
    const summaryEnd = html.indexOf('<h2>The UK Household Bills', summaryStart);
    if (summaryEnd !== -1) {
        let summaryContent = html.substring(summaryStart, summaryEnd);
        summaryContent = summaryContent.replace(/^• (.*$)/gm, '<li class="flex items-start mb-2"><span class="text-green-500 mr-2 font-bold">✓</span>$1</li>');
        summaryContent = summaryContent.replace(/<li/g, '<ul class="list-none space-y-1 mb-4">') + '</ul>'; // Rough wrap, refined below

        // Clean up: just wrap the whole list
        const items = summaryContent.match(/<li[\s\S]*?<\/li>/g);
        if (items) {
            const listHtml = `<ul class="list-none space-y-2 text-gray-700">${items.join('\n')}</ul>`;
            const newSummary = `
<div class="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
    <h2 class="text-xl font-bold text-blue-900 mb-4 flex items-center">
        <span class="mr-2">⚡</span> Quick Summary: What You'll Learn
    </h2>
    ${listHtml}
</div>`;
            html = html.substring(0, summaryStart) + newSummary + html.substring(summaryEnd);
        }
    }
}

// 4. Regional Breakdown Lists (Double bullets)
// "• • "
html = html.replace(/^[•] [•] (.*$)/gm, '<li class="ml-4 list-disc marker:text-blue-500">$1</li>');

// 5. Tables
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    let tableHtml = '<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm">\n<thead>\n<tr class="bg-indigo-900 text-white">\n';
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold whitespace-nowrap">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row, i) => {
        const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHtml += `<tr class="${bgClass} border-b border-gray-100 hover:bg-indigo-50 transition-colors">\n`;
        row.forEach(cell => tableHtml += `<td class="p-3 text-gray-700">${cell}</td>\n`);
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 6. Support Schemes (Numbered Blocks)
// 1
// #### Enhanced Warm Home Discount
// ...
// 2
// ...
const schemesRegex = /(\n\d\n\n#### .*\n\n[\s\S]*?)(?=\n\n##|\n\d\n|$)/g;
// Actually the source format is:
// 1
// #### Title
// content
// 2
// ...
// Let's look for this pattern specifically
// <p>1</p> (if processed) or just "1\n"
// We are processing markdown before paragraphs.

// Let's handle the grid of 3 schemes first
// 1\n\n#### ...
// We can wrap these in a grid?
// The text block:
// 1
// #### Enhanced Warm Home Discount
// £200 annual discount extended to 3 million households
// 2...
// 3...

// We can create a grid container manually for these 3 items if we detect them sequence
const supportBlock = html.match(/(?:^\d\n\n#### .*\n\n.*\n\n?){3}/m);
if (supportBlock) {
    const blockContent = supportBlock[0];
    const cards = blockContent.split(/\n\n(?=\d\n)/).map(card => {
        const lines = card.trim().split('\n\n');
        // lines[0] = number
        // lines[1] = header (#### ...)
        // lines[2] = text
        const num = lines[0];
        const title = lines[1].replace('#### ', '');
        const desc = lines[2];
        return `
        <div class="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="bg-indigo-100 text-indigo-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">${num}</div>
            <h4 class="font-bold text-gray-900 mb-2">${title}</h4>
            <p class="text-gray-600 text-sm">${desc}</p>
        </div>`;
    });

    html = html.replace(blockContent, `<div class="grid md:grid-cols-3 gap-6 my-8">${cards.join('')}</div>`);
}

// 7. Lists
// Clean up single bullets
html = html.replace(/^[•] (.*$)/gm, '<li>$1</li>');

// Wrap lists
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

// 8. Paragraphs
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

// 9. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 10. FAQs
// ## Frequently Asked Questions
// ### 1. Question?
// Answer...
const faqStart = html.indexOf('<h2>Frequently Asked Questions');
const relatedStart = html.indexOf('<h2>Related Money');

if (faqStart !== -1 && relatedStart !== -1) {
    let faqSection = html.substring(faqStart, relatedStart);
    // Replace H3s with <details>
    // The format is <h3>1. Question?</h3>\n<p>Answer...</p>

    // We need to iterate through H3s and wrap content until next H3
    const parts = faqSection.split('<h3>');
    // parts[0] = <h2>FAQs</h2>
    // parts[1..] = 1. Question?</h3><p>...</p>...

    let newFaqHtml = parts[0];

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const endHeader = part.indexOf('</h3>');
        const question = part.substring(0, endHeader);
        const answer = part.substring(endHeader + 5);

        newFaqHtml += `
        <details class="group bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden">
            <summary class="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <h3 class="font-bold text-gray-900">${question}</h3>
                <span class="transform group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div class="p-4 bg-white text-gray-700 border-t border-gray-100">
                ${answer}
            </div>
        </details>`;
    }

    html = html.substring(0, faqStart) + newFaqHtml + html.substring(relatedStart);
}

// 11. Subscribe Button
html = html.replace(/<p>Subscribe Free<\/p>/, '<button class="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 12. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
