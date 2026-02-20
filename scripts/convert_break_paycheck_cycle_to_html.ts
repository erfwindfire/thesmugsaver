
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_break_paycheck_cycle_source.md';
const outputPath = 'scripts/break_paycheck_cycle_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata
const tlDrHeader = '## TL;DR';
const tlDrIndex = html.indexOf(tlDrHeader);
if (tlDrIndex !== -1) {
    html = html.substring(tlDrIndex);
}

// 2. TL;DR Grid
const nextSection = '## Understanding the Paycheck-to-Paycheck Cycle';
const nextSectionIndex = html.indexOf(nextSection);
const tlDrBlock = html.substring(0, nextSectionIndex);
html = html.substring(nextSectionIndex);

// Extract bullet points
const tlDrPoints = tlDrBlock.match(/• (.*)/g)?.map(p => p.replace('• ', '').trim()) || [];

// Build TL;DR HTML
let tlDrHtml = `
<div class="bg-blue-50 p-8 rounded-xl border border-blue-200 mb-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-6">TL;DR: Escape the Paycheck Cycle</h2>
    <ul class="space-y-3">
        ${tlDrPoints.map(point => `
        <li class="flex items-start">
            <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 shrink-0">✓</span>
            <span class="text-gray-800">${point}</span>
        </li>`).join('')}
    </ul>
</div>
`;

// Prepend TL;DR
html = tlDrHtml + html;

// 3. Headings
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');

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

// 5. Checklists (Subscription Audit)
// "• □ Netflix..." -> Styled checkboxes
html = html.replace(/• □ (.*$)/gm, (match, text) => {
    return `<div class="flex items-center mb-2"><input type="checkbox" class="w-5 h-5 text-blue-600 mr-3 rounded border-gray-300 focus:ring-blue-500" disabled> <span class="text-gray-700">${text}</span></div>`;
});

// 6. Side Hustle Opportunities Grid
const sideHustleHeader = '<h3>2026 UK Side Hustle Opportunities</h3>';
const sideHustleIndex = html.indexOf(sideHustleHeader);
if (sideHustleIndex !== -1) {
    // Find end of this section - roughly before "### Remote Work Strategies"
    const nextH3 = '### Remote Work Strategies';
    const nextH3Index = html.indexOf(nextH3);

    // We can just rely on standard block formatting for now, but maybe wrap the lists in a grid
    // For simplicity, let's keep them as lists but ensure they are styled nicely later
}

// 7. Pay Cycle Strategy (Days 1-7, etc.)
// "Days 1-7: Bill Payment Week"
html = html.replace(/^(Day[s]? \d+(?:-\d+)?|Week \d+): (.*$)/gm, '<div class="font-bold text-blue-800 mt-4 mb-2">$1: $2</div>');

// 8. Annual Savings Calendar (Q1, Q2, etc.)
html = html.replace(/^##### (Q\d.*$)/gm, '<h5 class="text-lg font-bold text-green-800 mt-4 mb-2 border-b border-green-200 pb-1">$1</h5>');

// 9. Emergency Fund Pyramid
// Level 1, Level 2, Level 3
html = html.replace(/^#### (Level \d.*$)/gm, '<div class="bg-gray-50 p-6 rounded-lg border border-gray-200 my-6 shadow-sm"><h4 class="text-xl font-bold text-purple-900 mb-4">$1</h4>');
// Close the divs? 
// It's tricky with regex global replace.
// Let's close the previous div before opening a new one, except the first one.
// Actually, easier to just style the header and let the content flow, or wrap manually if we parsed the DOM.
// Let's stick to styling the header for now to avoid broken HTML.
html = html.replace(/<div class="bg-gray-50/g, '</div><div class="bg-gray-50'); // This is risky if not careful.
// Let's Undo that.
html = html.replace(/<div class="bg-gray-50 p-6 rounded-lg border border-gray-200 my-6 shadow-sm"><h4 class="text-xl font-bold text-purple-900 mb-4">/g, '<h4 class="text-xl font-bold text-purple-900 mt-8 mb-4 border-l-4 border-purple-500 pl-4 py-1 bg-purple-50">');


// 10. Email Templates
// "Email Template:\n\n"Hi [Manager]..."
html = html.replace(/"Hi \[Manager\][\s\S]*?\.\.\."/, (match) => {
    return `<div class="bg-gray-100 p-6 rounded-lg border-l-4 border-blue-500 font-mono text-sm text-gray-700 my-4 whitespace-pre-wrap">${match.replace(/^"|"$/g, '')}</div>`;
});


// 11. Lists
html = html.replace(/^[•] [•]? (.*$)/gm, '<li>$1</li>');
// Checkmarks (already handled □ above, but check for others)

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

// 12. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 13. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 14. Paragraphs
// Special handling for the checkboxes div wrapper if needed, but we used div above
const blocks = html.split(/\n\n+/);
const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.match(/^<(h\d|ul|li|div|p|details|summary|button|table|thead|tbody|tr|td|a|input)/)) {
        return trimmed;
    }

    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 15. FAQs
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

        // "Start Saving Money Daily" at the end
        if (title.startsWith('Start Saving Money')) {
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

// 16. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
