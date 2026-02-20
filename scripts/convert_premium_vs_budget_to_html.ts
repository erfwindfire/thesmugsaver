
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_premium_vs_budget_source.md';
const outputPath = 'scripts/premium_vs_budget_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata and Intro Link
const titleHeader = '# Premium vs Budget Insurance';
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

// 3. TL;DR Grid
// Starts at ## TL;DR
// Ends before ### What is Insurance Excess
const tldrStart = html.indexOf('<h2>TL;DR');
const tldrEnd = html.indexOf('<h3>What is Insurance Excess');

if (tldrStart !== -1 && tldrEnd !== -1) {
    const tldrBlock = html.substring(tldrStart, tldrEnd);

    // Extract "Key Findings" and "Red Flags" lists
    // They are separated by "#### Key Findings:" and "#### Red Flags:"
    // And contain bullet points

    // Simplest way: Split by <h4>, process each, then wrap in grid
    const parts = tldrBlock.split('<h4>');
    // parts[0] is header, parts[1] is Key Findings, parts[2] is Red Flags

    if (parts.length >= 3) {
        let findings = parts[1].replace('Key Findings:</h2>', '').trim(); // Regex replace might be safer if H4 handling differs
        // Actually, we replaced #### with <h4> already.
        // So parts[1] starts with "Key Findings:</h4>\n\n• ..."

        const extractBullets = (text) => {
            return text.match(/• (.*)/g)?.map(p => p.replace('• ', '').trim()) || [];
        };

        const findingsList = extractBullets(parts[1]);
        const redFlagsList = extractBullets(parts[2]);

        const gridHtml = `
<div class="bg-gray-50 rounded-xl p-8 mb-12 border border-gray-200">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">TL;DR — At-a-Glance Summary</h2>
    <div class="grid md:grid-cols-2 gap-8">
        <div>
            <h4 class="font-bold text-blue-800 mb-4 flex items-center">
                <span class="bg-blue-100 p-1 rounded mr-2">🔍</span> Key Findings
            </h4>
            <ul class="space-y-3">
                ${findingsList.map(item => `<li class="flex items-start"><span class="text-blue-500 mr-2">✓</span><span class="text-gray-700">${item}</span></li>`).join('')}
            </ul>
        </div>
        <div>
            <h4 class="font-bold text-red-800 mb-4 flex items-center">
                <span class="bg-red-100 p-1 rounded mr-2">🚩</span> Red Flags
            </h4>
            <ul class="space-y-3">
                ${redFlagsList.map(item => `<li class="flex items-start"><span class="text-red-500 mr-2">!</span><span class="text-gray-700">${item}</span></li>`).join('')}
            </ul>
        </div>
    </div>
</div>`;

        html = html.substring(0, tldrStart) + gridHtml + html.substring(tldrEnd);
    }
}

// 4. Quick Answers (Accordion/Details)
// Starts at ## Quick Answers
// Ends before Let me be brutally honest
const qaStart = html.indexOf('<h2>Quick Answers');
// Finding end is tricky as next section text starts with "Let me be brutally honest" (paragraph)
// Let's look for the intro paragraph after the generated QAs
// The QAs in source act as headers "### Is premium...?" followed by empty content? 
// Wait, the source text provided in the prompt says:
// ### Is premium insurance always better than budget insurance?
// [Empty line?]
// ### How much should I pay...
// It seems these are just headers in the source text provided! 
// "Quick Answers: Insurance Essentials" 
// followed by H3 questions. But where are the answers? 
// Looking at the provided source text:
// ...
// ### Do I need legal cover included in my insurance?
// 
// Let me be brutally honest: ...
//
// It seems the "Quick Answers" section in the source is just a list of questions *without* answers immediately following?
// Or maybe they are intended to be anchor links?
// "Quick Answers" usually implies the answers are there. 
// However, reading the prompt's source text carefully: 
// The questions are listed, but no text follows them until "Let me be brutally honest".
// This suggests they might be a "Table of Contents" / "Jump Links" style section, OR the answers were truncated in the *original* but the prompt says "COMPLETE BODY CONTENT".
// If the user provided text has no answers, I cannot invent them. 
// BUT, looking at the pattern of these articles, "Quick Answers" often serve as a TOC or highlighted questions answered later? 
// Actually, in previous articles, Quick Answers were followed by short answers.
// Here they look empty.
// Let's treat them as a "What You'll Learn" section / TOC.
// We can format them as a list of questions.

if (qaStart !== -1) {
    const nextParaIndex = html.indexOf('<p>Let me be brutally honest');
    if (nextParaIndex !== -1) {
        const qaBlock = html.substring(qaStart, nextParaIndex);
        // Extract questions
        const questions = qaBlock.match(/<h3>(.*?)<\/h3>/g)?.map(q => q.replace(/<\/?h3>/g, '')) || [];

        let qaHtml = `
<div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8">
    <h3 class="text-xl font-bold text-indigo-900 mb-4">In This Guide We Answer:</h3>
    <ul class="grid md:grid-cols-1 gap-2">
        ${questions.map(q => `<li class="flex items-center text-indigo-800 font-medium"><span class="mr-2">❓</span> ${q}</li>`).join('')}
    </ul>
</div>`;

        html = html.substring(0, qaStart) + qaHtml + html.substring(nextParaIndex);
    }
}


// 5. Tables
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

// 6. Special Boxes (Reality Check, Industry Truth Bomb, etc.)
// Format: content followed by blank line and "Label:\nText"
// OR "#### Label\n\nText"
// Let's handle specific headers that act as boxes

const boxHeaders = [
    { title: 'Industry Truth Bomb', color: 'red', icon: '💣' },
    { title: 'Reality Check:', color: 'blue', icon: '👁️' },
    { title: 'Smart move:', color: 'green', icon: '✅' },
    { title: 'Switching Protection:', color: 'yellow', icon: '🛡️' },
    { title: 'Loyalty Penalty Reality', color: 'red', icon: '📉' }
];

// Handle headers that should be boxes
// e.g. "#### Industry Truth Bomb"
boxHeaders.forEach(({ title, color, icon }) => {
    // Determine header level (could be h3 or h4)
    const regex = new RegExp(`<(h[34])>${title.replace(':', '')}:?<\/[34]>\n+([\\s\\S]*?)(?=<h|$)`, 'g'); // Simplified
    // Actually, "Industry Truth Bomb" is #### in source.
    // "Reality Check" often appears as its own paragraph or small header.

    // Let's use a generic approach for blocks starting with bold/header phrases

});

// Specific replacements based on content observation
// "#### Industry Truth Bomb"
html = html.replace(/<h4>Industry Truth Bomb<\/h4>\n+<p>([\s\S]*?)<\/p>/,
    `<div class="bg-red-50 p-6 rounded-lg my-6 border-l-4 border-red-500">
        <h4 class="font-bold text-red-900 mb-2 flex items-center"><span class="mr-2">💣</span> Industry Truth Bomb</h4>
        <p class="text-red-800">$1</p>
    </div>`);

// "Reality Check:" often appears inside tables or as standalone.
// If standalone paragraph starting with "Reality Check:":
html = html.replace(/<p>Reality Check:\s*([\s\S]*?)<\/p>/g,
    `<div class="bg-blue-50 p-4 rounded-lg my-4 border border-blue-200 flex items-start">
        <span class="text-xl mr-3">👁️</span>
        <div><span class="font-bold text-blue-900 block">Reality Check:</span><span class="text-blue-800">$1</span></div>
    </div>`);


// 7. Premium vs Budget Lists (What Premium Usually Means...)
// They appear as lists.
// We can wrap them in a grid if they are adjacent.
// "### What Premium Usually Means" ... list ... "### What Budget Usually Means" ... list ...
const premHeader = '<h3>What Premium Usually Means</h3>';
const budgHeader = '<h3>What Budget Usually Means</h3>';
if (html.includes(premHeader) && html.includes(budgHeader)) {
    // This is getting complex to regex. Let's rely on standard list styling for now, 
    // but maybe adding a class to the Uls if we can identify them.
    // We'll clean up the list markers first.
}

// 8. Lists Cleanups
// "• • " double bullets
html = html.replace(/^[•] [•] (.*$)/gm, '<li>$1</li>');
// Single bullets
html = html.replace(/^[•] (.*$)/gm, '<li>$1</li>');

// Steps "Step 1: ..."
html = html.replace(/^##### Step (\d+): (.*$)/gm, '<h5 class="font-bold text-indigo-700 mt-4 mb-2">Step $1: $2</h5>');

// Wrap <li>
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
    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 11. FAQs
// "### Frequently Asked Questions"
const faqHeader = '<h3>Frequently Asked Questions</h3>';
const faqIndex = html.indexOf(faqHeader);

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + faqHeader.length);
    let afterFaq = html.substring(faqIndex + faqHeader.length);

    // Split by <h3> (questions)
    // Be careful not to capture following sections (Related Money Management Guides)
    const relatedIndex = afterFaq.indexOf('<h3>Related Money Management Guides</h3>');
    let faqSection = afterFaq;
    let remainder = '';

    if (relatedIndex !== -1) {
        faqSection = afterFaq.substring(0, relatedIndex);
        remainder = afterFaq.substring(relatedIndex);
    }

    const parts = faqSection.split('<h3>');
    let processedFaqs = parts[0]; // Content between main header and first question (usually empty)

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

// 12. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 13. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
