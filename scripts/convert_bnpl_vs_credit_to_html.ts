
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_bnpl_vs_credit_source.md';
const outputPath = 'scripts/bnpl_vs_credit_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata
const tlDrStart = html.indexOf('## TL;DR — At-a-Glance Summary');
html = html.substring(tlDrStart);

// 2. TL;DR Grid
const bodyStart = html.indexOf('[Back to Homepage](/)\n\n'); // Wait, source has [Back to Homepage](/) at top?
// Checking source: Yes, at the very top. But that was removed.
// Check actual content structure in file.
// "## TL;DR ... \n\nBottom Line: ...\nKey Decision: ..."
// Next header is "### What is BNPL (Buy Now, Pay Later)?"

const nextHeader = '### What is BNPL (Buy Now, Pay Later)?';
const nextHeaderIndex = html.indexOf(nextHeader);
const tlDrBlock = html.substring(0, nextHeaderIndex);
html = html.substring(nextHeaderIndex);

// Extract content
const bottomLine = tlDrBlock.match(/Bottom Line: (.*)/)?.[1] || '';
const keyDecision = tlDrBlock.match(/Key Decision: (.*)/)?.[1] || '';

// Build TL;DR Grid HTML
let tlDrHtml = `
<div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 mb-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-4">TL;DR — At-a-Glance Summary</h2>
    <p class="text-gray-700 font-medium mb-4">${bottomLine}</p>
    <div class="bg-white p-4 rounded-lg border border-blue-100">
        <strong class="text-blue-800">Key Decision:</strong> 
        <span class="text-gray-700">${keyDecision}</span>
    </div>
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
// Bullet points: "• Text" or "• • Text" or "✓ Text"
html = html.replace(/^[•] [•]? (.*$)/gm, '<li>$1</li>');
// Checkmarks styling
html = html.replace(/^✓ (.*$)/gm, '<li class="marker:content-[\'✓\'] marker:text-green-500 pl-2">$1</li>');

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


// 6. Quick Decision Flowchart
// Step 1: ...
// Step 2: ...
// These are distinct blocks.
const flowchartHeader = '<h3>Quick Decision Flowchart</h3>';
const flowchartIndex = html.indexOf(flowchartHeader);

if (flowchartIndex !== -1) {
    // Ends at next header "<h2>Integration with Overall Financial Strategy</h2>"
    const nextSection = '<h2>Integration with Overall Financial Strategy</h2>';
    const nextSectionIndex = html.indexOf(nextSection);

    // Process this block
    // We can just rely on standard paragraph formatting or wrap it.
    // The "Step X" logic below handles it.
}

// 7. FAQs
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

        // Handle "Start Saving Money Daily" subscription box at end
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

// 8. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe</button>');

// 9. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 10. Paragraphs
const blocks = html.split(/\n\n+/);
const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.match(/^<(h\d|ul|li|div|p|details|summary|button|table|thead|tbody|tr|td|a)/)) {
        return trimmed;
    }

    // Step X blocks
    if (trimmed.startsWith('Step ')) {
        return `<div class="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500 mb-4 font-medium text-gray-800">${trimmed}</div>`;
    }

    // "Scenario:" blocks
    if (trimmed.startsWith('Scenario:')) {
        return `<h4 class="font-bold text-gray-800 mt-4">${trimmed}</h4>`;
    }
    if (trimmed.startsWith('Credit Card:') || trimmed.startsWith('BNPL:')) {
        return `<div class="ml-4 pl-4 border-l-2 border-gray-200 mb-2 text-gray-700">${trimmed}</div>`;
    }

    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 11. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
