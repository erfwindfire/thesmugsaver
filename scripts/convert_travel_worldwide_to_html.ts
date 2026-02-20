
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_travel_worldwide_source.md';
const outputPath = 'scripts/travel_worldwide_output.html';

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
// Starts at ## TL;DR
// Ends before 'Resources:' or next paragraph
const tldrStart = html.indexOf('<h2>TL;DR');
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
<div class="bg-indigo-50 rounded-xl p-8 mb-8 border border-indigo-200 shadow-sm">
    <h2 class="text-2xl font-bold text-indigo-900 mb-6 border-b border-indigo-200 pb-2">TL;DR — At-a-Glance Summary</h2>
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
html = html.replace(/Resources: Check government travel advisories(.*)/,
    `<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-sm text-blue-800">
        <span class="font-bold">ℹ️ Resources:</span> Check government travel advisories$1
    </div>`);


// 5. Tables
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    let tableHtml = '<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm">\n<thead>\n<tr class="bg-purple-900 text-white">\n';
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold whitespace-nowrap">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row, i) => {
        const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHtml += `<tr class="${bgClass} border-b border-gray-100 hover:bg-purple-50 transition-colors">\n`;
        row.forEach(cell => tableHtml += `<td class="p-3 text-gray-700">${cell}</td>\n`);
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 6. Booking Methods Compared
// Target Pros/Cons/Best For blocks
html = html.replace(/Pros:\n\n((?:[•] .*\n)+)/g, '<div class="mb-4"><span class="font-bold text-green-700 block mb-2">✅ Pros:</span><ul class="list-none space-y-1 pl-4 border-l-2 border-green-200">$1</ul></div>');
html = html.replace(/Cons:\n\n((?:[•] .*\n)+)/g, '<div class="mb-4"><span class="font-bold text-red-700 block mb-2">❌ Cons:</span><ul class="list-none space-y-1 pl-4 border-l-2 border-red-200">$1</ul></div>');
html = html.replace(/Best For:\n\n((?:[•] .*\n)+)/g, '<div class="mb-4 bg-gray-100 p-3 rounded"><span class="font-bold text-gray-800 block mb-2">🎯 Best For:</span><ul class="list-disc pl-5">$1</ul></div>');

// 7. Lists Cleanups
// "• • " double bullets
html = html.replace(/^[•] [•] (.*$)/gm, '<li>$1</li>');
// Single bullets
html = html.replace(/^[•] (.*$)/gm, '<li>$1</li>');

// Wrap non-UL lists
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

// 8. Paragraphs
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

// 9. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 10. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
