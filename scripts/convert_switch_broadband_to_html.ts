
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_switch_broadband_source.md';
const outputPath = 'scripts/switch_broadband_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata and Intro Link
const titleHeader = '# How to Switch Broadband';
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

// 3. Executive Summary
const execStart = html.indexOf('<h2>Executive Summary');
const execEnd = html.indexOf('<h3>1Audit Your Current Services'); // Actually "The Complete Switching Process" is H2

// Wait, looking at structure:
// ## Executive Summary
// ...
// ... Core Process Stages
//
// ## The Complete Switching Process Step-by-Step
const processStart = html.indexOf('<h2>The Complete Switching Process');

if (execStart !== -1 && processStart !== -1) {
    const execBlock = html.substring(execStart, processStart);

    // Extract stats
    // £540\nAverage Annual Saving...
    const statsRegex = /£540\nAverage Annual Saving\n7 Days\nTypical Switch Duration\n3 Steps\nCore Process Stages/;

    if (statsRegex.test(execBlock)) {
        const statsHtml = `
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
    <div class="bg-green-50 p-4 rounded-lg text-center border border-green-100">
        <div class="text-3xl font-bold text-green-700">£540</div>
        <div class="text-sm text-green-800 uppercase tracking-wide">Average Annual Saving</div>
    </div>
    <div class="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
        <div class="text-3xl font-bold text-blue-700">7 Days</div>
        <div class="text-sm text-blue-800 uppercase tracking-wide">Typical Switch Duration</div>
    </div>
    <div class="bg-indigo-50 p-4 rounded-lg text-center border border-indigo-100">
        <div class="text-3xl font-bold text-indigo-700">3 Steps</div>
        <div class="text-sm text-indigo-800 uppercase tracking-wide">Core Process Stages</div>
    </div>
</div>`;

        let newExecBlock = execBlock.replace(statsRegex, statsHtml);

        // Wrap the text parts in a intro box style?
        // "The Reality:", "The Opportunity:", "This Guide Delivers:"
        // Let's style these bold starts
        newExecBlock = newExecBlock.replace(/(The Reality:|The Opportunity:|This Guide Delivers:)/g, '<span class="font-bold text-indigo-900">$1</span>');

        html = html.substring(0, execStart) + newExecBlock + html.substring(processStart);
    }
}

// 4. Process Steps (1Audit, 2Research, etc.)
// They appear as "### 1Audit Your Current Services (Week 1: Day 1-2)"
// Note the missing space in source "1Audit"
html = html.replace(/<h3>(\d+)(.*?) \((.*?)\)<\/h3>/g,
    `<div class="flex items-center mt-12 mb-6">
        <div class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">$1</div>
        <div>
            <h3 class="text-2xl font-bold text-gray-900 m-0">$2</h3>
            <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">$3</span>
        </div>
    </div>`);

// 5. Tables
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    let tableHtml = '<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse shadow-sm rounded-lg overflow-hidden">\n<thead>\n<tr class="bg-blue-900 text-white">\n';
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold whitespace-nowrap">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row, i) => {
        const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHtml += `<tr class="${bgClass} border-b border-gray-100 hover:bg-blue-50 transition-colors">\n`;
        row.forEach(cell => tableHtml += `<td class="p-3 text-gray-700">${cell}</td>\n`);
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 6. Negotiation Scripts
// Headers are "### [Type] Retention Call Script"
// Content has "Opening...", "Present Competition...", "Handle Pushback..."
// We want to wrap these sections in a distinct box.

const scriptHeaders = [
    'Broadband Retention Call Script',
    'Mobile Retention Call Script',
    'TV Service Negotiation Script'
];

// This is tricky because the content isn't nicely blocked.
// We can look for the H3, then the content until the next H3 or H2.
// And inside, style the "Opening (Set the Frame):" parts.

scriptHeaders.forEach(header => {
    const regex = new RegExp(`<h3>${header}<\/h3>([\\s\\S]*?)(?=<h[23]|$)`, 'g');
    html = html.replace(regex, (match, content) => {
        // Style the sub-parts
        // "Opening (Set the Frame):" -> Bold and maybe colored
        let styledContent = content.replace(/([A-Za-z ]+ \([A-Za-z -]+\):)/g, '<h4 class="font-bold text-indigo-700 mt-4 mb-2">$1</h4>');

        // Wrap quotes in distinctive styling
        styledContent = styledContent.replace(/"([^"]+)"/g, '<div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 my-2 italic text-gray-700">"$1"</div>');

        return `<div class="bg-white border-2 border-indigo-100 rounded-xl p-6 my-8 shadow-sm">
            <h3 class="text-xl font-bold text-indigo-900 mb-4 flex items-center">
                <span class="mr-2">📞</span> ${header}
            </h3>
            ${styledContent}
        </div>`;
    });
});

// 7. Case Studies
// "### Case Study X: ..."
html = html.replace(/<h3>Case Study (\d+): (.*?)<\/h3>([\s\S]*?)(?=<h[23]|$) /g,
    `<div class="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Case Study $1: $2</h3>
        $3
    </div>`);
// The previous regex might miss because of the lookahead consumption or greediness.
// Let's accept simpler structure for Case Studies now that we handled scripts.
// The Case Studies are likely just sections like others.
// But we want to style the "Before/After" lists.

// 8. Styling "Before Switch" and "After Switch" blocks in Case Studies
html = html.replace(/<h4>Before Switch:<\/h4>/g, '<h4 class="font-bold text-red-700 mt-4 mb-2 border-b border-red-200 pb-1">Before Switch:</h4>');
html = html.replace(/<h4>After Switch:<\/h4>/g, '<h4 class="font-bold text-green-700 mt-4 mb-2 border-b border-green-200 pb-1">After Switch:</h4>');

// 9. Scam Avoidance Boxes
// "#### 1. Fake Provider Representatives"
// "The Scam: ... ✓ Protection: ..."
html = html.replace(/#### (\d+)\. (.*?)<\/h4>\n+<p>The Scam: (.*?)<\/p>\n+<p>✓ Protection: (.*?)<\/p>/g,
    `<div class="bg-red-50 p-4 rounded-lg mb-4 border-l-4 border-red-500">
        <h4 class="font-bold text-red-900 mb-2">$1. $2</h4>
        <p class="mb-2"><span class="font-bold text-red-800">The Scam:</span> <span class="text-gray-700">$3</span></p>
        <p><span class="font-bold text-green-700">✓ Protection:</span> <span class="text-gray-700">$4</span></p>
    </div>`);

// 10. Checklists (Before/During/After Switch)
// "### ✅ Before You Switch"
// List items follow
// Let's ensure lists are styled
html = html.split('\n').reduce((acc, line) => {
    if (line.trim().startsWith('• ')) {
        if (!acc.inList) {
            acc.text += '<ul class="list-disc pl-5 mb-4 space-y-2 text-gray-700">\n';
            acc.inList = true;
        }
        acc.text += line.replace('• ', '<li>') + '</li>\n';
    } else if (line.trim().startsWith('• • ')) { // Double bullet handling
        if (!acc.inList) {
            acc.text += '<ul class="list-disc pl-5 mb-4 space-y-2 text-gray-700">\n';
            acc.inList = true;
        }
        acc.text += line.replace('• • ', '<li>') + '</li>\n';
    } else {
        if (acc.inList) {
            acc.text += '</ul>\n';
            acc.inList = false;
        }
        acc.text += line + '\n';
    }
    return acc;
}, { text: '', inList: false }).text;


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

// 13. FAQs
const faqHeader = '<h3>Frequently Asked Questions</h3>';
const faqIndex = html.indexOf(faqHeader);

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + faqHeader.length);
    let afterFaq = html.substring(faqIndex + faqHeader.length);

    // Split by <h3> (questions)
    // Be careful not to capture following sections (Related Money-Saving Guides)
    const relatedIndex = afterFaq.indexOf('<h3>Related Money-Saving Guides</h3>');
    let faqSection = afterFaq;
    let remainder = '';

    if (relatedIndex !== -1) {
        faqSection = afterFaq.substring(0, relatedIndex);
        remainder = afterFaq.substring(relatedIndex);
    }

    const parts = faqSection.split('<h3>');
    let processedFaqs = parts[0];

    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        const endHeader = part.indexOf('</h3>');
        const title = part.substring(0, endHeader).trim();
        let content = part.substring(endHeader + 5).trim();

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

    html = beforeFaq + '\n\n' + processedFaqs + '\n\n' + remainder;
}

// 14. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 15. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
