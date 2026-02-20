
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_travel_deals_source.md';
const outputPath = 'scripts/travel_deals_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata and Intro Link
const titleHeader = '# Unlocking Travel Deals';
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
const tldrStart = html.indexOf('<h2>TL;DR');
const tldrEnd = html.indexOf('Resources: Check UK Foreign Travel Advice');
// The resources line is just text, not a header.
// Let's find the end by looking for the paragraph after red flags.
// Source:
// #### Avoid These Traps:
// ...
// Resources: ...
//
// The Resources line is separate.
// Let's grab until "Resources: "

if (tldrStart !== -1) {
    const resourcesIndex = html.indexOf('Resources:', tldrStart);
    if (resourcesIndex !== -1) {
        const tldrBlock = html.substring(tldrStart, resourcesIndex);

        const parts = tldrBlock.split('<h4>');
        // parts[1] Money Saving, parts[2] Avoid Traps

        if (parts.length >= 3) {
            const extractBullets = (text) => {
                return text.match(/[•] [✓✗] (.*)/g)?.map(p => {
                    const cleanText = p.replace(/[•] [✓✗] /, '').trim();
                    const icon = p.includes('✓') ? '✓' : '✗';
                    const color = p.includes('✓') ? 'text-green-500' : 'text-red-500';
                    return `<li class="flex items-start"><span class="${color} mr-2 font-bold">${icon}</span><span class="text-gray-700">${cleanText}</span></li>`;
                }) || [];
            };

            const strategies = extractBullets(parts[1]);
            const traps = extractBullets(parts[2]);

            const gridHtml = `
<div class="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">TL;DR — At-a-Glance Summary</h2>
    <div class="grid md:grid-cols-2 gap-8">
        <div>
            <h4 class="font-bold text-green-800 mb-4 flex items-center bg-green-50 p-2 rounded-lg">
                <span class="mr-2">💰</span> Money-Saving Strategies
            </h4>
            <ul class="space-y-3">
                ${strategies.join('\n')}
            </ul>
        </div>
        <div>
            <h4 class="font-bold text-red-800 mb-4 flex items-center bg-red-50 p-2 rounded-lg">
                <span class="mr-2">⚠️</span> Avoid These Traps
            </h4>
            <ul class="space-y-3">
                ${traps.join('\n')}
            </ul>
        </div>
    </div>
</div>`;

            html = html.substring(0, tldrStart) + gridHtml + html.substring(resourcesIndex);
        }
    }
}

// 4. Resources Box
html = html.replace(/Resources: Check UK Foreign Travel Advice(.*)/,
    `<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-sm text-blue-800">
        <span class="font-bold">ℹ️ Resources:</span> Check UK Foreign Travel Advice$1
    </div>`);


// 5. Tables
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    // Check if it's the "Booking Methods Compared" "Pros/Cons" type tables? 
    // Wait, the prompt shows "Booking Methods Compared" as text headings "Pros:", "Cons:", not a markdown table.
    // The actual markdown tables are: "Booking Strategy Effectiveness", "Package vs Independent: Decision Matrix", "Travel Insurance Options Compared", "Daily Budget Allocation".

    let tableHtml = '<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm">\n<thead>\n<tr class="bg-teal-700 text-white">\n';
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold whitespace-nowrap">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row, i) => {
        const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHtml += `<tr class="${bgClass} border-b border-gray-100 hover:bg-teal-50 transition-colors">\n`;
        row.forEach(cell => {
            // Visualize ticks/crosses/scales in tables
            let cellContent = cell;
            if (cell.includes('✅')) cellContent = '<span class="text-green-500 text-xl">✅</span>';
            if (cell.includes('❌')) cellContent = '<span class="text-red-500 text-xl">❌</span>';
            if (cell.includes('⚖️')) cellContent = '<span class="text-yellow-600 text-xl">⚖️</span>';

            tableHtml += `<td class="p-3 text-gray-700">${cellContent}</td>\n`;
        });
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 6. Booking Methods Compared (Pros/Cons lists)
// Structure: "#### Direct Hotel Booking", "Pros:", bullets, "Cons:", bullets, "Best For:", bullets
// We can grid these or style the blocks.
// Let's style the Pros/Cons lists specifically if we can target them.

// Find sections starting with Pros:/Cons:
// "Pros:\n\n• • ..."
html = html.replace(/Pros:\n\n((?:[•] .*\n)+)/g, '<div class="mb-4"><span class="font-bold text-green-700 block mb-2">✅ Pros:</span><ul class="list-none space-y-1 pl-4 border-l-2 border-green-200">$1</ul></div>');
html = html.replace(/Cons:\n\n((?:[•] .*\n)+)/g, '<div class="mb-4"><span class="font-bold text-red-700 block mb-2">❌ Cons:</span><ul class="list-none space-y-1 pl-4 border-l-2 border-red-200">$1</ul></div>');
html = html.replace(/Best For:\n\n((?:[•] .*\n)+)/g, '<div class="mb-4 bg-gray-100 p-3 rounded"><span class="font-bold text-gray-800 block mb-2">🎯 Best For:</span><ul class="list-disc pl-5">$1</ul></div>');

// 7. Alternative Destination Swaps
// "##### Instead of ..."
html = html.replace(/<h5>Instead of (.*):<\/h5>\n+<p>Try (.*)<\/p>/g,
    `<div class="flex flex-col md:flex-row items-center bg-white border rounded-lg p-4 mb-4 shadow-sm">
        <div class="flex-1">
            <span class="text-red-500 font-bold block text-sm uppercase">Expensive</span>
            <span class="text-lg font-semibold text-gray-800">$1</span>
        </div>
        <div class="px-4 text-2xl text-gray-400">→</div>
        <div class="flex-1">
            <span class="text-green-500 font-bold block text-sm uppercase">Budget</span>
            <span class="text-lg font-semibold text-gray-800">$2</span>
        </div>
    </div>`);


// 8. Lists Cleanups
// "• • " double bullets
html = html.replace(/^[•] [•] (.*$)/gm, '<li>$1</li>');
// Single bullets
html = html.replace(/^[•] (.*$)/gm, '<li>$1</li>');

// Wrap <li> not already wrapped
html = html.split('\n').reduce((acc, line) => {
    if (line.trim().startsWith('<li')) {
        if (!acc.inList) {
            // Check if inside our special divs (which use <ul> already manualy? No, regex up there uses <ul> but puts text inside $1 which are raw bullets. 
            // Wait, pure regex replacement above: `ul class... $1`. $1 contains `• item`. We changed `• item` to `<li>item</li>` globally after.
            // So we just need to wrap groups of <li> that are NOT inside <ul>.
            // But strict state machine needed.
            // Simplification: Standard lists are just lines.
            // The Pros/Cons regex produced `<ul>...bullets...</ul>`. The bullets inside are `• ...`.
            // The global replace changed `• ...` to `<li>...</li>`.
            // So `<ul...><li>...</li></ul>` structure should be valid, EXCEPT the regex above might capture multiple lines.
            // Actually `((?:[•] .*\n)+)` captures the block. 
            // So $1 is `<li>...</li>\n<li>...</li>`. 
            // Correct.

            // However, main body lists need wrapping.
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

// Clean up nested ULs if any accidents happened (unlikely with this logic order)

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
const faqHeader = '<h3>Frequently Asked Questions</h3>';
const faqIndex = html.indexOf(faqHeader);

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + faqHeader.length);
    let afterFaq = html.substring(faqIndex + faqHeader.length);

    // Split by <h3> (questions)
    // Be careful not to capture following sections
    const relatedIndex = afterFaq.indexOf('<h3>Take Control of Your Travel Spending</h3>'); // Not a header in this text? 
    // "### Take Control..." is H3.
    // Wait, prompt text: "### Take Control of Your Travel Spending"

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

// 12. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-teal-600 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 13. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
