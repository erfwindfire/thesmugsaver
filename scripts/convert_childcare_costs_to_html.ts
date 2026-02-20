
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_childcare_costs_source.md';
const outputPath = 'scripts/childcare_costs_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata
const tlDrStart = html.indexOf('## TL;DR');
html = html.substring(tlDrStart);

// 2. TL;DR Grid
// "## TL;DR: ... \n\n• Point 1\n• Point 2..."
// Next header is "## The UK Childcare Cost Challenge in 2026"
const nextHeader = '## The UK Childcare Cost Challenge in 2026';
const nextHeaderIndex = html.indexOf(nextHeader);
const tlDrBlock = html.substring(0, nextHeaderIndex);
html = html.substring(nextHeaderIndex);

// Process TL;DR bullet points
const tlDrPoints = tlDrBlock.match(/• (.*)/g)?.map(p => p.replace('• ', '').trim()) || [];

// Build TL;DR Grid HTML
let tlDrHtml = `
<div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 mb-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-4">TL;DR: Navigate UK Childcare Costs in 2026</h2>
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
        ${tlDrPoints.map(point => `<li class="flex items-start"><span class="text-blue-500 mr-2">✓</span><span class="text-gray-700">${point}</span></li>`).join('\n')}
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

// 4. Step-by-Step Blocks (Application Process, Expanded Free Hours Timeline)
// These look like: "1\n\n#### Title\n\nText"
// Regex to catch digit followed by h4
html = html.replace(/^(\d)\n\n<h4>(.*)<\/h4>\n\n(.*)$/gm, (match, stepNum, title, text) => {
    return `
<div class="flex flex-col md:flex-row gap-4 bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
    <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold font-outfit">
            ${stepNum}
        </div>
    </div>
    <div>
        <h4 class="text-lg font-bold text-gray-900 mb-2">${title}</h4>
        <p class="text-gray-600">${text}</p>
    </div>
</div>`;
});


// 5. Tables
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

// 6. Cost Planning Calculator Template
// "Weekly nursery/childminder fees:\n£____\n..."
// We can turn this into a styled "worksheet" box
const calculatorHeader = '<h3>Cost Planning Calculator Template</h3>';
const calculatorIndex = html.indexOf(calculatorHeader);
if (calculatorIndex !== -1) {
    // Ends at next header "<h2>2. New Government Schemes for 2026</h2>"
    const nextSection = '<h2>2. New Government Schemes for 2026</h2>';
    const nextSectionIndex = html.indexOf(nextSection);

    if (nextSectionIndex !== -1) {
        let calcContent = html.substring(calculatorIndex + calculatorHeader.length, nextSectionIndex).trim();
        // Replace newlines with breaks or input-like lines
        calcContent = calcContent.split('\n').filter(l => l.trim()).map(line => {
            if (line.includes('£____')) {
                return `<div class="border-b-2 border-gray-300 py-2 mb-2 font-mono text-gray-500 bg-white px-2">£____________________</div>`;
            }
            return `<div class="font-bold text-gray-700 mt-2">${line}</div>`;
        }).join('\n');

        const calcHtml = `
<div class="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm my-8">
    <h3 class="text-xl font-bold text-yellow-900 mb-4">📝 Cost Planning Worksheet</h3>
    <div class="space-y-2">
        ${calcContent}
    </div>
</div>`;

        // We replace the original content with our styled block
        // Be careful with exact string replacement if we modified it
        // Simpler: Just reconstruct the part of HTML
        html = html.substring(0, calculatorIndex) + calcHtml + '\n\n' + html.substring(nextSectionIndex);
    }
}

// 7. Lists
html = html.replace(/^[•] [•]? (.*$)/gm, '<li>$1</li>');
// Checkmarks
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

// 8. FAQs
const faqHeader = '<h2>Frequently Asked Questions About UK Childcare Costs</h2>';
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

        // "Related Money-Saving Guides" & "Stay Updated" at the end
        if (title.startsWith('Related Money-Saving') || title.startsWith('Stay Updated')) {
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

// 9. Subscribe Button
html = html.replace(/<p>Subscribe Free<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 10. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 11. Paragraphs
const blocks = html.split(/\n\n+/);
const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.match(/^<(h\d|ul|li|div|p|details|summary|button|table|thead|tbody|tr|td|a)/)) {
        return trimmed;
    }

    // Check for calculation template blocks if not caught above (unlikely due to wrapper)

    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 12. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
