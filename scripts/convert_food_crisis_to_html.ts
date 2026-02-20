
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_food_crisis_source.md';
const outputPath = 'scripts/food_crisis_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Link for Homepage
// [Back to Homepage](/) handled by general link replacement or manual strip?
// Source starts with: # When the Safety Net Tears...
// Check if "[Back to Homepage]" exists.
if (html.startsWith('[Back')) {
    html = html.substring(html.indexOf('\n')); // Skip first line
}

// 2. Headings
html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');

// 3. Summary Box
// ## Summary
// ...
// ## The Calm Before the Grocery Store
const summaryStart = html.indexOf('<h2>Summary');
if (summaryStart !== -1) {
    const summaryEnd = html.indexOf('<h2>The Calm', summaryStart);
    if (summaryEnd !== -1) {
        let summaryContent = html.substring(summaryStart, summaryEnd);
        // Remove header from content or keep it styled
        summaryContent = summaryContent.replace('<h2>Summary</h2>', '');

        // Wrap in styled box
        const newSummary = `
<div class="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r-lg shadow-sm">
    <h2 class="text-xl font-bold text-amber-900 mb-4 uppercase tracking-wide">Executive Summary</h2>
    <div class="text-gray-800 text-lg leading-relaxed italic">
        ${summaryContent.trim()}
    </div>
</div>`;
        html = html.substring(0, summaryStart) + newSummary + html.substring(summaryEnd);
    }
}

// 4. Unit Economics Lists
// ### The Base Unit Economics:
// • Bean and rice bowl...
// ### The Strategic Framework:
// ...
const baseUnitSection = html.indexOf('<h3>The Base Unit Economics:');
if (baseUnitSection !== -1) {
    // We can style these lists specifically if we want, or just generic list styling.
    // Let's use generic list styling first.
}

// 5. Lists
// "• " bullets
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

// 6. Action Alert
// 📞 Immediate Action Required
// ...
const alertStart = html.indexOf('📞 Immediate Action Required');
if (alertStart !== -1) {
    const alertEnd = html.indexOf('## Frequently Asked Questions', alertStart);
    if (alertEnd === -1) { // Maybe references or end of file?
        // Check if FAQs exist
    }

    // Let's find end of block. It's followed by ## Frequently Asked Questions usually
    let contentEnd = alertEnd;
    if (contentEnd === -1) contentEnd = html.length;

    let alertContent = html.substring(alertStart, contentEnd);
    // Remove "📞 Immediate Action Required" text from content to put in header
    alertContent = alertContent.replace('📞 Immediate Action Required', '');

    const newAlert = `
<div class="bg-red-600 text-white p-6 rounded-xl shadow-lg my-8 transform hover:scale-[1.01] transition-transform">
    <h2 class="text-2xl font-bold mb-4 flex items-center">
        <span class="text-3xl mr-3">📞</span> Immediate Action Required
    </h2>
    <div class="text-white text-lg font-medium">
        ${alertContent.trim()}
    </div>
</div>`;

    html = html.substring(0, alertStart) + newAlert + html.substring(contentEnd);
}

// 7. References
// ## References
// 1. ...
// 2. ...
const refStart = html.indexOf('<h2>References');
if (refStart !== -1) {
    // Content after references is likely Footer stuff
    // Let's grab until "### Start Saving Money Daily" or footer
    let refEnd = html.indexOf('<h3>Start Saving', refStart);
    if (refEnd === -1) refEnd = html.length;

    let refContent = html.substring(refStart, refEnd);
    // It's a numbered list "1. ..."
    // We can regex replace the numbers with list items
    refContent = refContent.replace(/^\d+\. (.*$)/gm, '<li class="text-sm text-gray-600 mb-1 break-words pl-2">$1</li>');
    refContent = refContent.replace(/<li/g, '<ol class="list-decimal pl-5 space-y-2 marker:text-gray-400">') + '</ol>';

    // Clean up the OL wrapping (similar to UL logic but for specific block)
    // Actually simpler:
    const refs = refContent.match(/<li[\s\S]*?<\/li>/g);
    if (refs) {
        const listHtml = `<ol class="list-decimal pl-5 space-y-2 marker:text-gray-400 mt-4">${refs.join('\n')}</ol>`;
        const newRefSection = `
<div class="mt-12 pt-8 border-t border-gray-200">
    <h2 class="text-xl font-bold text-gray-900 mb-4">References & Further Reading</h2>
    ${listHtml}
</div>`;
        html = html.substring(0, refStart) + newRefSection + html.substring(refEnd);
    }
}

// 8. Paragraphs
const blocks = html.split(/\n\n+/);
const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.match(/^<(h\d|ul|li|ol|div|p|details|summary|button|table|thead|tbody|tr|td|a)/)) {
        return trimmed;
    }
    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 9. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 10. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-amber-600 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-700 transition-colors my-6 shadow-lg">Subscribe</button>');

// 11. Footer / Disclaimer styling
// Disclaimer: ...
const disclaimerIdx = html.indexOf('Disclaimer:');
if (disclaimerIdx !== -1) {
    const disclaimerContent = html.substring(disclaimerIdx);
    const validContent = html.substring(0, disclaimerIdx);

    const styledFooter = `
<footer class="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center">
    <p class="mb-4">${disclaimerContent.replace(/<p>|<\/p>/g, '')}</p>
</footer>`;

    html = validContent + styledFooter;
}

// 12. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
