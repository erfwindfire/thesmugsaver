
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_food_price_hikes_source.md';
const outputPath = 'scripts/food_price_hikes_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata
const summaryHeader = '## TL;DR';
const summaryIndex = html.indexOf(summaryHeader);
if (summaryIndex !== -1) {
    html = html.substring(summaryIndex);
}

// 2. TL;DR Grid
// Extract points for Bottom Line and Best Apps
const nextSection = '### Strategic Brand Swaps';
const nextSectionIndex = html.indexOf('## Strategic Brand Swaps');
const summaryBlock = html.substring(0, nextSectionIndex);
html = html.substring(nextSectionIndex);

const bottomLineMatch = summaryBlock.match(/Bottom Line: ([\s\S]*?)Best Apps/)?.[1].trim() || '';
const bestAppsMatch = summaryBlock.match(/Best Apps: ([\s\S]*?)(?=Your grocery bill|$)/)?.[1].trim() || '';

// Intro Text in TL;DR block
const introTextStart = summaryBlock.indexOf('Your grocery bill');
const introText = summaryBlock.substring(introTextStart).trim();

// Build TL;DR HTML
let tlDrHtml = `
<div class="bg-green-50 p-8 rounded-xl border border-green-200 mb-8">
    <h2 class="text-2xl font-bold text-green-900 mb-6">TL;DR — At-a-Glance Summary</h2>
    <div class="space-y-4 mb-6">
        <div class="flex items-start">
            <div class="bg-green-600 text-white font-bold px-3 py-1 rounded mr-3 mt-1 shrink-0">Bottom Line</div>
            <p class="text-gray-800">${bottomLineMatch}</p>
        </div>
        <div class="flex items-start">
            <div class="bg-blue-600 text-white font-bold px-3 py-1 rounded mr-3 mt-1 shrink-0">Best Apps</div>
            <p class="text-gray-800">${bestAppsMatch}</p>
        </div>
    </div>
</div>
<div class="prose max-w-none text-gray-700 mb-8">
    ${introText.split('\n\n').map(p => `<p class="mb-4">${p}</p>`).join('')}
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

// 5. Weekly Meal Planning Template
// Needs specific styling
const mealPlanBlockRegex = /### Weekly Meal Planning Template([\s\S]*?)(?=###)/;
html = html.replace(mealPlanBlockRegex, (match, content) => {
    const days = content.split('\n\n').filter(d => d.trim());
    let gridHtml = '<h3>Weekly Meal Planning Template</h3>\n<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">';

    days.forEach(dayBlock => {
        const lines = dayBlock.trim().split('\n');
        const dayName = lines[0].replace(':', '');
        const title = lines[1] || '';
        const desc = lines[2] || '';

        if (dayName && title) {
            gridHtml += `
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div class="font-bold text-blue-800 uppercase text-xs mb-1">${dayName}</div>
                <div class="font-bold text-gray-900 mb-2">${title}</div>
                <div class="text-sm text-gray-600">${desc}</div>
            </div>`;
        }
    });
    gridHtml += '</div>';
    return gridHtml;
});

// 6. Lists
// Safe Swaps (Checkmarks)
html = html.replace(/^### ✓ (.*$)/gm, '<h3 class="text-green-700">✓ $1</h3>');
html = html.replace(/^### ✗ (.*$)/gm, '<h3 class="text-red-700">✗ $1</h3>');


html = html.replace(/^[•] [•]? (.*$)/gm, '<li>$1</li>');

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

// 7. Store Switching Calculator
// "#### Calculate True Cost" ...
html = html.replace(/<h4>Calculate True Cost<\/h4>/, '<div class="bg-blue-50 p-6 rounded-lg my-6"><h4 class="font-bold text-blue-900 mb-4">Calculate True Cost</h4>');
html = html.replace(/<h4>Monthly Breakeven<\/h4>/, '<h4 class="font-bold text-blue-900 mb-4 mt-6">Monthly Breakeven</h4>');
// Close the div after the list following Monthly Breakeven
// We need to find where the box ends.
// It ends before "## Grocery Budgeting"
html = html.replace(/(## Grocery Budgeting)/, '</div>\n\n$1');


// 8. 50/30/20 Rule Box
html = html.replace('### The 50/30/20 Grocery Rule', '<div class="bg-purple-50 p-6 rounded-lg my-6 border border-purple-100"><h3 class="text-purple-900 font-bold mb-4">The 50/30/20 Grocery Rule</h3>');
html = html.replace('£50 essentials, £30 variety, £20 treats', '<div class="font-mono bg-white p-4 rounded text-center text-purple-800 font-bold mt-4">£50 essentials · £30 variety · £20 treats</div></div>');

// 9. Pre-Shop Checklist
html = html.replace('## Your Complete Pre-Shop Checklist', '<h2>Your Complete Pre-Shop Checklist</h2>\n<div class="bg-yellow-50 p-6 rounded-xl border border-yellow-200">');
// Close it before FAQ
html = html.replace('## Frequently Asked Questions', '</div>\n\n## Frequently Asked Questions');

// 10. FAQs
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

        // "Related Money-Saving Guides" at the end
        if (title.startsWith('Related Money-Saving')) {
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

// 11. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 12. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 13. Paragraphs
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

// 14. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
