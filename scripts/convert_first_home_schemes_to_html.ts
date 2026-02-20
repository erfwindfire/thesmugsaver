
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_first_home_schemes_source.md';
const outputPath = 'scripts/first_home_schemes_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata
const tlDrStart = html.indexOf('## TL;DR: Navigate 2026');
html = html.substring(tlDrStart);

// 2. TL;DR Grid
// Format:
// ## TL;DR: Navigate 2026 First-Time Buyer Schemes
// • Item 1
// • Item 2
// ...
// ## The Harsh Reality...

const harshRealityStart = html.indexOf('## The Harsh Reality');
const tlDrBlock = html.substring(0, harshRealityStart);
html = html.substring(harshRealityStart);

// Extract bullet points
const tlDrItems = [...tlDrBlock.matchAll(/• (.*)/g)].map(m => m[1].trim());

// Build TL;DR Grid HTML
let tlDrHtml = `
<div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 mb-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-4">TL;DR: Navigate 2026 First-Time Buyer Schemes</h2>
    <div class="grid md:grid-cols-2 gap-4">
`;

tlDrItems.forEach(item => {
    tlDrHtml += `
        <div class="flex items-start">
            <span class="text-blue-600 font-bold mr-2">✓</span>
            <span class="text-gray-700">${item}</span>
        </div>`;
});

tlDrHtml += `
    </div>
</div>
`;

// 3. Stats Section
// ### 2026 UK Housing Market Reality Check
// #### Market Statistics
// • • Average UK house price: £285,000...
// #### Regional Variations
// • • North East England...

const realityCheckHeader = '### 2026 UK Housing Market Reality Check';
const realityCheckIndex = html.indexOf(realityCheckHeader);

if (realityCheckIndex !== -1) {
    // We want to transform this whole section into a side-by-side grid
    // It ends before "## 1. New 2026 Government Schemes"
    const schemesHeader = '## 1. New 2026 Government Schemes';
    const schemesIndex = html.indexOf(schemesHeader);

    let statsSection = html.substring(realityCheckIndex, schemesIndex);
    html = html.substring(0, realityCheckIndex) + schemesIndex !== -1 ? html.substring(schemesIndex) : '';

    // Process statsSection manually
    // Extract Market Statistics items
    const marketStatsMatch = statsSection.match(/#### Market Statistics\n([\s\S]*?)(?=####|$)/);
    const regionalStatsMatch = statsSection.match(/#### Regional Variations\n([\s\S]*?)(?=$)/);

    const marketItems = marketStatsMatch ? [...marketStatsMatch[1].matchAll(/• • (.*)/g)].map(m => m[1].trim()) : [];
    const regionalItems = regionalStatsMatch ? [...regionalStatsMatch[1].matchAll(/• • (.*)/g)].map(m => m[1].trim()) : [];

    let statsHtml = `
    <div class="my-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">2026 UK Housing Market Reality Check</h3>
        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-gray-50 p-6 rounded-xl">
                <h4 class="text-xl font-bold text-gray-800 mb-4">Market Statistics</h4>
                <ul class="space-y-3">
                    ${marketItems.map(item => `<li class="flex items-center text-gray-700"><span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl">
                <h4 class="text-xl font-bold text-gray-800 mb-4">Regional Variations</h4>
                <ul class="space-y-3">
                    ${regionalItems.map(item => `<li class="flex items-center text-gray-700"><span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>
    `;

    // Insert after the intro text (which is now in `html` before schemesIndex)
    // Actually `html` was sliced. We need to re-assemble.
    // wait, I messed up the slice.
    // html = html.substring(0, realityCheckIndex) + (schemesIndex !== -1 ? html.substring(schemesIndex) : '');
    // This removes the section. Now I insert the specific HTML.

    // Let's create a placeholder
    html = html.replace('## 1. New 2026 Government Schemes', 'STATS_PLACEHOLDER\n\n## 1. New 2026 Government Schemes');
    html = html.replace('STATS_PLACEHOLDER', statsHtml);
}

// Prepend TL;DR
html = tlDrHtml + html;

// 4. Headings
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

// 5. Tables
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

// 6. Data Grids / "Implied" Tables
// Example: Shared Ownership Example
// #### 📊 Shared Ownership Example: £200,000 Property
// 25% Share Purchase
// £50,000
// Your deposit needed: £5,000 (10%)
// ...
// This structure is: Title -> Value -> List of details.

// We can catch these blocks. 
// 25% Share Purchase
// £50,000
// ...
// This looks like <p>Title\nValue\nDetails...</p> when processed as paragraphs later.

// Let's do paragraph processing first to simplify list/block handling?
// But formatting lists (bullet points) is easier on source text.

// 7. Lists
// Bullet points: "• • Text" or "• □ Text" (checkbox)
html = html.replace(/^[•] [•□] (.*$)/gm, '<li>$1</li>');

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

// 8. Special "Cards" formatting
// First Homes Scheme features:
// 30-50% Market Discount
// New build homes sold...
// Priority for Key Workers
// ...
// These appear as plain text/paragraphs headers.
// We can use regex to wrap them.
// Pattern: (Title)\n(Description)
// But difficult to distinguish from normal text.

// 9. FAQs
// Located at end
const faqHeader = '<h2>Complete First-Time Buyer FAQ: 25 Essential Questions Answered</h2>';
const faqIndex = html.indexOf(faqHeader);

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + faqHeader.length);
    let afterFaq = html.substring(faqIndex + faqHeader.length);

    const parts = afterFaq.split('<h3>');
    let processedFaqs = parts[0];

    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        const endHeader = part.indexOf('</h3>');
        const title = part.substring(0, endHeader).trim();
        let content = part.substring(endHeader + 5).trim();

        if (title.startsWith('Essential Reading') || title.startsWith('Start Saving')) {
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
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe for Tips</button>');

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
    // Check for "Implied Grid" items like "30-50% Market Discount\nNew build homes..."
    // If block has fewer than 200 chars and contains a newline, it MIGHT be a feature highlight
    if (trimmed.length < 300 && trimmed.includes('\n') && !trimmed.startsWith('•')) {
        const lines = trimmed.split('\n');
        if (lines.length === 2 || lines.length === 3) {
            return `<div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-4">
                <h4 class="font-bold text-lg text-gray-800 mb-2">${lines[0]}</h4>
                <p class="text-gray-600">${lines.slice(1).join('<br>')}</p>
             </div>`;
        }
    }

    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 13. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
