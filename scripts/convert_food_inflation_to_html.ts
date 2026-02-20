// @ts-nocheck
import fs from 'fs';
import path from 'path';

const sourcePath = 'temp_food_inflation_source.md';
const outputPath = 'scripts/food_inflation_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata (Title and below are handled, but initial lines need removal)
// The file starts with:
// [Back to Homepage](/)
// Daily Savings
// Updated January 2026
//
// # Title ...
//
// [View Smart Strategies](#smart-strategies)
// ...
// 
// ### 5.1% ...

// Find the start of the Stats Grid (### 5.1%)
const statsStart = html.indexOf('### 5.1%');
if (statsStart === -1) {
    console.error('Could not find Stats start');
    process.exit(1);
}

// Extract content from Stats Start
html = html.substring(statsStart);

// 2. Stats Grid
// Format:
// ### Value
// Label
//
// We want to capture these 4 items and put them in a grid.
// Text:
// ### 5.1%
// Food Price Inflation 2026
// ### £360+
// Extra Annual Cost Per Family
// ### 30-40%
// Potential Savings With Strategy
// ### 2 Hours
// Weekly Time Investment

// We can look for the block of stats.
// It ends before "## Your Grocery Budget..."
const statsEndIndex = html.indexOf('## Your Grocery Budget');
const statsBlock = html.substring(0, statsEndIndex);
html = html.substring(statsEndIndex); // Remove stats from main flow, we will prepend grid

const statMatches = [...statsBlock.matchAll(/### (.*?)\n(.*?)(?=\n|$)/g)];
let statsHtml = '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">\n';
statMatches.forEach(match => {
    const value = match[1].trim();
    const label = match[2].trim();
    statsHtml += `
    <div class="bg-blue-50 p-4 rounded-xl text-center">
        <div class="text-3xl font-bold text-blue-600">${value}</div>
        <div class="text-sm text-gray-600 font-medium">${label}</div>
    </div>`;
});
statsHtml += '</div>\n\n';

html = statsHtml + html;

// 3. Headings
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

// 4. Tables
// There are correct Markdown tables:
// | Retailer | ... |
// | --- | ... |
// ...

// And "Implied" tables/lists:
// Energy & Transport Costs
// Diesel...
// +35% impact

// Let's handle explicit Markdown tables first.
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    let tableHtml = '<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse">\n<thead>\n<tr class="bg-gray-100 border-b-2 border-gray-200">\n';
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold text-gray-700">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach(row => {
        tableHtml += '<tr class="border-b border-gray-100 hover:bg-gray-50">\n';
        row.forEach(cell => tableHtml += `<td class="p-3 text-gray-700">${cell}</td>\n`);
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 5. Implied Tables / Data Grids
// Example: Primary Inflation Drivers
// Pattern: Line, Line, Line (percentage)
// We might not be able to reliably blindly replace.
// But we can look for "### Primary Inflation Drivers" and format the text following it until the next Header.

function formatDataValues(sectionText) {
    // Looks for blocks of 3 lines where the 3rd starts with + or contains %?
    // Actually provided text has: 
    // Energy & Transport Costs
    // Diesel, fertilizer, processing energy
    // +35% impact
    // 
    // Empty line

    // Let's split by double newlines
    const chunks = sectionText.split(/\n\n+/);
    let output = '<div class="grid md:grid-cols-2 gap-4 my-6">\n';
    let isGrid = false;

    // Check if chunks look like data points
    // A data point usually has a title, description, and a value line
    // Or just check if we are in specific sections.

    // Let's rely on specific section headers to apply specific formatting.
    // Instead of generic function, let's target sections in the main flow.
    return sectionText;
}

// Target "Primary Inflation Drivers" section
// Content between "<h3>Primary Inflation Drivers...</h3>" and "<h2>...</h2>" or next "<h3>"
// But the text structure is:
// <h3>Primary Inflation Drivers...</h3>
// <p>Table showing...</p>
// <p>Energy & Transport Costs</p>
// <p>Diesel...</p>
// <p>+35% impact</p>
// ...

// Actually, paragraph processing happens later. Right now we have text.
// Let's process "Primary Inflation Drivers" specifically.
const driversHeader = '<h3>Primary Inflation Drivers (January 2026)</h3>';
const driversIndex = html.indexOf(driversHeader);
if (driversIndex !== -1) {
    // End is roughly next header "<h2>" or "Strategic Insight"
    // Actually next is "Strategic Insight" which isn't a header yet?
    // "Strategic Insight" is text.
    // Next header is "<h2>2026 Food Price Outlook..."

    // Let's assume the list ends at "Strategic Insight" or standard double newline gap before next section.
    // The text has:
    // ...
    // +2% impact
    //
    // Notice how...

    // We can regex replace the data blocks.
    // Pattern:
    // (Title)\n(Description)\n(\+\d+% impact)

    // Note: The input text in `html` at this point has newlines preserved.
    // Heading replacements are done.

    // Let's try to match the specific content structure for this table.
    // It's a list effectively.

    // We can manually build this table/grid.
}

// 6. Lists
// Bullet points: "• • Text"
html = html.replace(/^• • (.*$)/gm, '<li>$1</li>');
// Wrap <li> in <ul>
html = html.split('\n').reduce((acc, line) => {
    if (line.trim().startsWith('<li>')) {
        if (!acc.inList) {
            acc.text += '<ul class="list-disc pl-5 mb-4 space-y-2">\n';
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

// 7. FAQs
// Located at end: "<h2>Food Inflation 2026: Your Questions Answered</h2>"
const faqHeader = '<h2>Food Inflation 2026: Your Questions Answered</h2>';
const faqIndex = html.indexOf(faqHeader);

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + faqHeader.length);
    let afterFaq = html.substring(faqIndex + faqHeader.length);

    // Split by <h3> (the questions)
    // Actually the questions in source are:
    // ### How much has food inflation...
    // But we already converted ### to <h3>.

    const parts = afterFaq.split('<h3>');
    let processedFaqs = parts[0]; // Preamble (empty usually)

    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        // Part starts with title, then </h3>, then content
        const endHeader = part.indexOf('</h3>');
        const title = part.substring(0, endHeader).trim();
        let content = part.substring(endHeader + 5).trim();

        // Stop at "<h3>Related Money Guides</h3>" or similar if it exists
        // The source has:
        // ...
        // ### Related Money Guides

        if (title === 'Related Money Guides' || title === 'Start Saving Money Daily') {
            processedFaqs += `<h3>${title}</h3>\n${content}\n\n`;
            continue;
        }

        // It's an FAQ
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
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe for Daily Savings</button>');

// 9. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 10. Paragraphs
// Split by double newline, wrap non-tags
const blocks = html.split(/\n\n+/);
const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    // If it's a tag, return as is
    if (trimmed.match(/^<(h\d|ul|li|div|p|details|summary|button|table|thead|tbody|tr|td|a)/)) {
        return trimmed;
    }
    // Specific sections to wrap in special divs?
    if (trimmed.startsWith('Strategic Insight') || trimmed.startsWith('Critical Warning') || trimmed.startsWith('Nutrition Strategy')) {
        const [title, ...rest] = trimmed.split('\n');
        return `
        <div class="bg-blue-50 border-l-4 border-blue-600 p-4 my-6 rounded-r-lg">
            <h4 class="text-blue-800 font-bold mb-2">${title}</h4>
            <p class="text-blue-900">${rest.join(' ')}</p>
        </div>`;
    }

    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 11. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

// Apply specific formatting for "Primary Inflation Drivers" "implied table"
// We can use a regex to transform the text block if it was wrapped in <p>
// The text was:
// Energy & Transport Costs
// Diesel, fertilizer, processing energy
// +35% impact
//
// Because we processed paragraphs, this might be a single <p>:
// <p>Energy & Transport Costs\nDiesel...\n+35% impact</p>
//
// Let's create a visual grid for these.

html = html.replace(
    /<p>Energy & Transport Costs\nDiesel, fertilizer, processing energy\n\+35% impact<\/p>/,
    `<div class="grid md:grid-cols-2 gap-4 my-4">
        <div class="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h4 class="font-bold text-gray-800">Energy & Transport Costs</h4>
            <p class="text-sm text-gray-600 mb-2">Diesel, fertilizer, processing energy</p>
            <div class="text-xl font-bold text-red-600">+35% impact</div>
        </div>
        <!-- Matches follow -->
    </div>`
);
// Actually replacing one by one is tedious. 
// We know the pattern:
// <p>(Name)\n(Desc)\n(\+\d+% impact)<\/p>
// Let's regex replace all of them.
html = html.replace(
    /<p>([^\n]+)\n([^\n]+)\n(\+\d+% impact)<\/p>/g,
    `<div class="bg-white p-4 rounded shadow-sm border border-gray-200 mb-4">
        <div class="font-bold text-gray-800 text-lg">$1</div>
        <p class="text-sm text-gray-600">$2</p>
        <div class="text-xl font-bold text-red-600 mt-2">$3</div>
    </div>`
);
// We might want to wrap these in a grid container if they are sequential.
// But mostly they will appear as blocks. That's fine.

// Same for "Food Category Inflation Rates"
// Red Meat & Poultry
// Beef...
// +8.2%
html = html.replace(
    /<p>([^\n]+)\n([^\n]+)\n(\+\d+\.\d+%?)<\/p>/g,
    `<div class="flex justify-between items-center bg-gray-50 p-3 rounded mb-2">
        <div>
            <div class="font-bold text-gray-800">$1</div>
            <div class="text-xs text-gray-500">$2</div>
        </div>
        <div class="text-lg font-bold text-red-600">$3</div>
    </div>`
);

// "Price-Per-Nutrition Framework"
// Protein Cost Analysis (per 25g protein)
// Dried beans/lentils
// £0.15-0.25
// ...
// This looks like <p>Item\nPrice</p>
html = html.replace(
    /<p>([^\n]+)\n(£\d+\.\d+-\d+\.\d+)<\/p>/g,
    `<div class="flex justify-between border-b border-gray-100 py-2">
        <span class="text-gray-700">$1</span>
        <span class="font-bold text-gray-900">$2</span>
    </div>`
);

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
