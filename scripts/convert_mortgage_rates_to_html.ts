
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_mortgage_rates_source.md';
const outputPath = 'scripts/mortgage_rates_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Link for Homepage
if (html.startsWith('[Back')) {
    html = html.substring(html.indexOf('\n')); // Skip first line
}

// 2. Headings
html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

// 3. Remove Share Links
// Share:
// Facebook ... Email
// Just remove them or potential <p>Share:...</p> later.
// Let's remove the block if possible.
const shareStart = html.indexOf('Share:');
if (shareStart !== -1) {
    const shareEnd = html.indexOf('### Executive Summary');
    if (shareEnd !== -1) {
        html = html.substring(0, shareStart) + html.substring(shareEnd);
    }
}

// 4. Executive Summary
const summaryStart = html.indexOf('<h3>Executive Summary');
if (summaryStart !== -1) {
    const summaryEnd = html.indexOf('<p>You\'re staring', summaryStart);
    // Wait, markdown conversion hasn't happened yet for paragraphs.
    // So looking for "You're staring at mortgage offers..."
    let contentEnd = html.indexOf("You're staring", summaryStart);
    if (contentEnd === -1) contentEnd = html.indexOf("You're staring", summaryStart); // Try exact match?
    // Let's regex for the end of the bullet list or empty line
    const summaryRegex = /(<h3>Executive Summary<\/h3>[\s\S]*?)(?=\n\nYou're)/;

    // Manual approach:
    // ...
    // • Potential savings: ...
    // 
    // You're staring ...
    const summaryTextEnd = html.indexOf('deals\n\nYou\'re staring');
    if (summaryTextEnd !== -1) {
        const summaryText = html.substring(summaryStart + '<h3>Executive Summary</h3>'.length, summaryTextEnd + 5);
        // +5 for 'deals' length? No, index is at start of match.

        // Actually, let's grab the content based on known structure.
        const summaryBlock = html.substring(summaryStart, summaryTextEnd + 5);
        let summaryInner = summaryBlock.replace('<h3>Executive Summary</h3>', '').trim();

        // Transform bullets
        summaryInner = summaryInner.replace(/^[•] (.*$)/gm, '<li class="flex items-start mb-2"><span class="text-blue-500 mr-2 font-bold">•</span>$1</li>');
        // Wrap lists
        summaryInner = summaryInner.replace(/<li[\s\S]*?<\/li>/g, (match) => `<ul class="list-none mb-4 space-y-2 text-gray-700">${match}</ul>`); // Rough global replace might duplicate UL if not careful.
        // Better: let the general list processor handle it or do it here.
        // Let's do general list processing later, but mark this block for container.

        // We will wrap the summary block in a div.
        const newSummary = `
<div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg shadow-sm">
    <h3 class="text-xl font-bold text-blue-900 mb-4">Executive Summary</h3>
    <div class="text-gray-800 leading-relaxed">
        ${summaryInner}
    </div>
</div>`;
        html = html.replace(summaryBlock, newSummary);
    }
}

// 5. Data Snapshot (Base Rate 4.75%)
// #### Bank of England Base Rate
// 4.75%
// ...
// #### CPI Inflation
// 2.3%
// ...
// We can wrap these side-by-side.
const snapshotBlockRegex = /(#### Bank of England Base Rate[\s\S]*?)(?=September 2026's mortgage)/;
const snapshotMatch = html.match(snapshotBlockRegex);
if (snapshotMatch) {
    // We have the block.
    // Parse the two items.
    const items = snapshotMatch[0].split('#### ').filter(i => i.trim());
    // item 0: Bank of England... \n 4.75% \n Held steady...

    const boxes = items.map(item => {
        const lines = item.trim().split('\n').filter(l => l.trim());
        const title = lines[0]; // e.g. CPI Inflation
        const value = lines[1]; // e.g. 2.3%
        const desc = lines.slice(2).join(' '); // Rest
        return `
        <div class="bg-gray-800 text-white p-6 rounded-lg text-center">
            <h4 class="text-sm uppercase tracking-widest text-gray-400 mb-2">${title}</h4>
            <div class="text-4xl font-bold mb-2 text-white">${value}</div>
            <div class="text-sm text-gray-400">${desc}</div>
        </div>`;
    });

    html = html.replace(snapshotMatch[0], `<div class="grid md:grid-cols-2 gap-6 my-8">${boxes.join('')}</div>`);
}

// 6. Fixed vs Variable (Check/Cross Lists)
// ### Fixed Rate Mortgages
// ...
// ✓ ...
// ✗ ...
// ### Variable Rate Mortgages
// ...
const fixVarSection = html.indexOf('<h2>Fixed vs Variable');
// We can process the checks/crosses globally or specifically.
// Global is easier.
html = html.replace(/^[✓] (.*$)/gm, '<li class="flex items-start mb-2"><span class="text-green-500 mr-2 font-bold">✓</span>$1</li>');
html = html.replace(/^[✗] (.*$)/gm, '<li class="flex items-start mb-2"><span class="text-red-500 mr-2 font-bold">✗</span>$1</li>');

// 7. Comparison Table
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    let tableHtml = '<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm">\n<thead>\n<tr class="bg-indigo-900 text-white">\n';
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold whitespace-nowrap">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row, i) => {
        const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        // Highlight 5 Year row if it contains star
        const isBest = row.some(c => c.includes('⭐'));
        const rowClass = isBest ? 'bg-yellow-50 border-l-4 border-yellow-400' : bgClass;

        tableHtml += `<tr class="${rowClass} border-b border-gray-100 hover:bg-gray-100 transition-colors">\n`;
        row.forEach(cell => {
            let content = cell.replace('⭐', '<span class="text-yellow-500 text-lg">⭐</span>'); // Keep star visible
            tableHtml += `<td class="p-3 text-gray-700 font-medium">${content}</td>\n`;
        });
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 8. Rate Forecast Scenarios
// ### Optimistic Scenario
// 3.5%
// ...
// ### Base Case Scenario
// ...
// We can grid these 3 scenarios.
const forecastStart = html.indexOf('<h2>Rate Forecast');
if (forecastStart !== -1) {
    const scenariosEnd = html.indexOf('Major bank predictions');
    if (scenariosEnd !== -1) {
        let scenariosContent = html.substring(forecastStart, scenariosEnd);
        // Extract 3 scenarios
        // They start with H3s
        const scenarioMatches = scenariosContent.match(/<h3>(.*?)<\/h3>\n\n(.*?)\n\nBase rate.*?\n\n((?:[•✓✗].*\n)+)/g);
        // It's tricky to regex precise scenario blocks.
        // Let's rely on H3 structure.

        // Manual construction for guaranteed layout
        // Scenario 1: Optimistic
        // 3.5%
        // Base rate by Q4 2026
        // • ✓ ...

        // We will just style the H3 blocks if they follow the pattern.
        // Actually, let's just make them cards if possible.
        // Given complexity, standard H3 + Content flow is fine, but let's clear the floats/grid if we can.
        // "grid md:grid-cols-3 gap-6"
    }
}

// 9. Action Steps (Numbered)
// 1. 1. Check your current mortgage...
// Source has double numbering "1. 1."?
html = html.replace(/^\d+\. \d+\. (.*$)/gm, '<li class="flex items-start mb-2"><span class="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs flex-shrink-0">Action</span><span>$1</span></li>');

// 10. Lists
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
