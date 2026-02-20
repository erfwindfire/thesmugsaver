
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_best_budgeting_apps_source.md';
const outputPath = 'scripts/best_budgeting_apps_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Link for Homepage
// [Back to Homepage](/) handled by general link replacement or manual strip?
if (html.startsWith('[Back')) {
    html = html.substring(html.indexOf('\n')); // Skip first line
}

// 2. Headings
html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');

// 3. Stats Grid (50+ Apps Evaluated)
// 50+
// Apps Evaluated
// 12
// Key Categories
// 2026
// Updated Analysis
const statsMatch = html.match(/50\+\nApps Evaluated\n12\nKey Categories\n2026\nUpdated Analysis/);
if (statsMatch) {
    const newStats = `
<div class="grid grid-cols-3 gap-4 my-8 text-center">
    <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-blue-600">50+</div>
        <div class="text-sm text-gray-600">Apps Evaluated</div>
    </div>
    <div class="bg-indigo-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-indigo-600">12</div>
        <div class="text-sm text-gray-600">Key Categories</div>
    </div>
    <div class="bg-purple-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-purple-600">2026</div>
        <div class="text-sm text-gray-600">Updated Analysis</div>
    </div>
</div>`;
    html = html.replace(statsMatch[0], newStats);
}

// 4. Executive Summary
// ### Executive Summary
// ...
// 50+ (Start of stats, handled above, or end?)
const summaryStart = html.indexOf('<h3>Executive Summary');
if (summaryStart !== -1) {
    // End is before the Stats Grid ideally
    let summaryEnd = html.indexOf('<div class="grid', summaryStart); // Use the grid we just made
    if (summaryEnd === -1) summaryEnd = html.indexOf('<h2>The Digital Finance', summaryStart);

    // Actually the logic above replaced stats grid in place.
    // So the sequence is: Summary ... Stats Grid ... H2
    // We can wrap the Summary content in a box.
    const summaryHeader = '<h3>Executive Summary</h3>';
    const summaryContentStart = summaryStart + summaryHeader.length;
    const summaryContentEnd = html.indexOf('<div class="grid', summaryStart);

    if (summaryContentEnd !== -1) {
        const summaryText = html.substring(summaryContentStart, summaryContentEnd).trim();
        const newSummary = `
<div class="bg-blue-600 text-white p-8 rounded-xl shadow-lg mb-8">
    <h3 class="text-2xl font-bold mb-4 text-white">Executive Summary</h3>
    <div class="text-blue-50 leading-relaxed font-medium">
        ${summaryText}
    </div>
</div>`;
        html = html.substring(0, summaryStart) + newSummary + html.substring(summaryContentEnd);
    }
}

// 5. Tables
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    // Styling based on content
    const isSecurity = headers.includes('Security Feature');
    const isComparison = headers.includes('Feature');
    const isPrivacy = headers.includes('Privacy Rating');

    let headerColor = 'bg-gray-800';
    if (isSecurity) headerColor = 'bg-green-700';
    if (isComparison) headerColor = 'bg-blue-800';
    if (isPrivacy) headerColor = 'bg-purple-800';

    let tableHtml = `<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm">\n<thead>\n<tr class="${headerColor} text-white">\n`;
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold whitespace-nowrap border-b border-opacity-20 border-white">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row, i) => {
        const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHtml += `<tr class="${bgClass} border-b border-gray-100 hover:bg-gray-100 transition-colors">\n`;
        row.forEach(cell => {
            let content = cell;
            content = content.replace(/✓/g, '<span class="text-green-500 font-bold">✓</span>');
            content = content.replace(/❌|✗/g, '<span class="text-red-500 font-bold">✗</span>');
            content = content.replace(/⚠️/g, '<span class="text-amber-500 font-bold">⚠️</span>');
            content = content.replace(/⭐/g, '<span class="text-amber-400">★</span>'); // Replace emoji with star char or styled span? Emoji is fine.

            tableHtml += `<td class="p-3 text-gray-700">${content}</td>\n`;
        });
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 6. Check/Cross Lists
// • • FCA authorization...
// • • Requesting banking passwords...
// The source uses • •
html = html.replace(/^[•] [•] (.*$)/gm, '<li class="flex items-start mb-2"><span class="mr-2">•</span>$1</li>');

// 7. App Ranking Cards (Best Overall, etc.)
// #### YNAB
// £84/year
// ...
// Best for: ...
// We can try to detect these blocks.
// They start with H4, have some lines, then "Best for:".
// Let's rely on standard markdown flow but wrap the content in styling if possible.
// For now, let's just style H4s nicely.
html = html.replace(/<h4>(.*?)<\/h4>/g, '<h4 class="text-xl font-bold text-indigo-700 mt-6 mb-2 border-b border-indigo-100 pb-1">$1</h4>');

// 8. 5-Step Selection Process Grid
// 1
// #### Assess Current State
// ...
// 5
// #### Trial & Evaluate
const selectionBlockRegex = /(?:^\d\n\n#### .*\n\n?){5}/m; // 5 steps
// Not matching well because of potential newlines.
// Let's just create a styled list for the steps if we can identify them.
// Actually, standard formatting is okay for now given time constraints, but let's see if we can catch the numbers.
html = html.replace(/^(\d)\n\n#### (.*)/gm, '<div class="flex items-center mb-4"><div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">$1</div><h4 class="font-bold text-gray-900">$2</h4></div>');

// 9. Lists
// "• " bullets
html = html.replace(/^[•] (.*$)/gm, '<li>$1</li>');

// Wrap lists
html = html.split('\n').reduce((acc, line) => {
    if (line.trim().startsWith('<li')) {
        if (!acc.inList) {
            acc.text += '<ul class="list-none mb-4 space-y-2 text-gray-700 pl-4">\n';
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

// 10. FAQs
// ## Frequently Asked Questions
// ### Are budgeting apps safe...?
// ...
const faqStart = html.indexOf('<h2>Frequently Asked Questions');
if (faqStart !== -1) {
    const faqEnd = html.indexOf('<h3>Start Saving', faqStart);
    let faqSection = html.substring(faqStart, faqEnd === -1 ? html.length : faqEnd);

    // Replace H3s with details
    const parts = faqSection.split('<h3>');
    let newFaqHtml = parts[0];

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const endHeader = part.indexOf('?');
        // Header ends at ? usually or newline
        const headerText = part.substring(0, part.indexOf('\n')).trim(); // Assume single line header
        const bodyText = part.substring(part.indexOf('\n')).trim(); // Rest is body (which is likely empty in the source for FAQs?)
        // Wait, the user request has empty FAQs?
        // "### Are budgeting apps safe to use with UK bank accounts?"
        // There is NO body text in the source?
        // "### Which apps work best...?"
        // "### What's the difference...?"
        // Ah, the source provided DOES NOT have answers! It just lists questions?
        // "COMPLETE BODY CONTENT (replace everything...)"
        // Looking at source...
        // ### Are budgeting apps safe to use with UK bank accounts?
        // ### Which apps work best with all major UK banks?
        // ...
        // ### Start Saving Money Daily
        //
        // It seems the FAQs are just Headers? Or truncated?
        // "Replace its ENTIRE body content ... complete original below."
        // If the provided text has no answers, I cannot invent them.
        // I will just format them as a list of questions then, or maybe they are placeholders?
        // I'll render them as H3s as is, or maybe a list.
        // Since they are H3s in my regex logic, they are currently <h3>Question?</h3>

        // Let's leave them as H3s but maybe style the section to look like "Coming soon" or just list?
        // Actually, looking at previous articles, usually FAQs have answers. 
        // If this source text has no answers, I should probably check if I missed something or if the input is weird.
        // But adhering to "replace with complete original below", I must use what is given.
        // I will just leave them as H3s.

    }
    // No specific FAQ transformation needed if no answers exist.
}

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

// 12. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 13. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors my-6 shadow-lg">Subscribe</button>');

// 14. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
