
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_uk_budget_source.md';
const outputPath = 'scripts/uk_budget_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata and Intro Link
const titleHeader = '# UK Budget 2026';
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
// ## Executive Summary
// ...
// Key Takeaways:
// • ...
const execStart = html.indexOf('<h2>Executive Summary');
if (execStart !== -1) {
    const keyTakeawaysIndex = html.indexOf('Key Takeaways:', execStart);
    if (keyTakeawaysIndex !== -1) {
        // Find end of Key Takeaways list (next double newline or header)
        // Actually, let's wrap the Key Takeaways in a box.
        // The list format is "• text".

        // Find the block starting at "Key Takeaways:" until next double newline
        const takeawaysRegex = /(Key Takeaways:\n\n(?:• .*\n)+)/;
        html = html.replace(takeawaysRegex, (match, content) => {
            const lines = content.replace('Key Takeaways:\n\n', '').split('\n').filter(l => l.trimStart().startsWith('• '));
            const listItems = lines.map(l => `<li class="mb-2 pl-2 border-l-4 border-red-500 bg-red-50 p-2 rounded-r">${l.replace('• ', '').trim()}</li>`).join('\n');

            return `<div class="bg-white border border-gray-200 rounded-xl p-6 my-8 shadow-sm">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span class="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded mr-3 uppercase tracking-wide">Key Takeaways</span>
                </h3>
                <ul class="list-none text-gray-700">
                    ${listItems}
                </ul>
            </div>`;
        });
    }
}

// 4. Tables with styling
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    // Choose table color theme based on context? Default to blue/slate.
    let tableHtml = '<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm text-sm md:text-base">\n<thead>\n<tr class="bg-slate-800 text-white">\n';
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold whitespace-nowrap">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row, i) => {
        const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-slate-50';
        tableHtml += `<tr class="${bgClass} border-b border-gray-100 hover:bg-blue-50 transition-colors">\n`;
        row.forEach(cell => {
            // Money values bold
            let content = cell;
            if (cell.includes('£')) content = `<span class="font-medium text-slate-900">${cell}</span>`;
            if (cell.includes('+£')) content = `<span class="font-bold text-red-600">${cell}</span>`; // Cost increases
            if (cell.includes('-£')) content = `<span class="font-bold text-red-600">${cell}</span>`; // Losses (negative money)

            tableHtml += `<td class="p-3 text-gray-700">${content}</td>\n`;
        });
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 5. Action Steps
// "💡 Action Step:"
html = html.replace(/💡 Action Step:\n\n([\s\S]*?)(?=\n\n|\n##|$)/g,
    `<div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-r-lg shadow-sm">
        <h4 class="text-lg font-bold text-yellow-800 mb-3 flex items-center">
            <span class="mr-2 text-2xl">💡</span> Action Step
        </h4>
        <div class="text-gray-800 leading-relaxed">$1</div>
    </div>`);

// 6. Winners and Losers Lists
// "### Winners 🎯" ... list
// "### Losers 📉" ... list
// Can we put them side-by-side or styled blocks?
// The source order is sequential.
const winnersRegex = /### Winners 🎯\n\n((?:• .*\n)+)/;
const losersRegex = /### Losers 📉\n\n((?:• .*\n)+)/;

html = html.replace(winnersRegex, (match, list) => {
    const items = list.split('\n').filter(l => l.trim()).map(l => `<li class="flex items-start mb-2"><span class="text-green-500 mr-2 font-bold">✓</span><span>${l.replace('• ✓ ', '').trim()}</span></li>`).join('\n');
    return `<div class="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
        <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">Winners 🎯</h3>
        <ul class="list-none space-y-2 text-gray-700">
            ${items}
        </ul>
    </div>`;
});

html = html.replace(losersRegex, (match, list) => {
    const items = list.split('\n').filter(l => l.trim()).map(l => `<li class="flex items-start mb-2"><span class="text-red-500 mr-2 font-bold">✗</span><span>${l.replace('• ✗ ', '').trim()}</span></li>`).join('\n');
    return `<div class="bg-red-50 rounded-xl p-6 border border-red-200 mb-6">
        <h3 class="text-xl font-bold text-red-800 mb-4 flex items-center">Losers 📉</h3>
        <ul class="list-none space-y-2 text-gray-700">
            ${items}
        </ul>
    </div>`;
});

// 7. Lists
// Clean up bullets "• " to <li>
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

// 9. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 10. FAQs
const faqHeader = '<h2>Frequently Asked Questions</h2>'; // Note: Source uses H2 for FAQs here usually? Or H3?
// Source: "## Frequently Asked Questions" -> H2
const faqIndex = html.indexOf('<h2>Frequently Asked Questions</h2>');

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + 35); // + Length of header
    let afterFaq = html.substring(faqIndex + 35);

    // Split by questions? The source just lists questions as lines?
    // "Will income tax rates change...?"
    // "How will Capital Gains..."
    // They don't have answers in the source text provided in the prompt?
    // Wait, looking at the COMPLETE BODY CONTENT provided:
    // ...
    // ## Frequently Asked Questions
    //
    // Will income tax rates change in the 2026 UK Budget?
    // How will Capital Gains Tax (CGT) changes affect me?
    // ...
    // 
    // Is that it? Are there answers?
    // The provided text ends with the list of questions, then "## Related Money Guides".
    // Unlike previous articles, this one seems to have MISSING ANSWERS for the FAQs in the provided source text?
    // "COMPLETE BODY CONTENT (replace everything between the body quotes for this article):"
    // The prompt says "Do NOT summarise or shorten — this is the full article and every word must be preserved."
    // If the provided text effectively lists questions without answers, I must preserve that structure (a list of questions?).
    // Or did I miss them?
    // Let's re-read the prompt text carefully.
    // ...
    // ## Frequently Asked Questions
    //
    // Will income tax rates change in the 2026 UK Budget?
    // How will Capital Gains Tax (CGT) changes affect me?
    // ...
    // Should I adjust my budget for April 2026 changes?
    //
    // ## Related Money Guides

    // It seems the FAQs are indeed just a list of questions in the source provided. This might be a "teaser" style or simply the content provided.
    // I will render them as a list of questions, perhaps as a list? Or just paragraphs?
    // Since they are questions, a list seems appropriate.
    // OR, I can convert them to simple list items.

    // Let's check if they are already wrapped in <p> tags by the paragraph processor.
    // Yes, they would be <p>Question?</p>.

    // I will wrap this section in a styled box or just leave as is?
    // Given it's just a list of questions, maybe a bulleted list is better.
    // But I can't invent answers.
    // I'll leave them as is (paragraphs or list), but maybe group them.
    // Actually, looking closely, they are just lines.
    // I'll wrap them in a <ul> if I can detect them.

    // Regex for this block of questions?
    // It's strictly between "## Frequently Asked Questions" and "## Related Money Guides".
    const relatedIndex = html.indexOf('<h2>Related Money Guides</h2>');
    if (relatedIndex !== -1) {
        const faqContent = html.substring(faqIndex + 35, relatedIndex);
        // It's likely <p>Question?</p>\n<p>Question?</p>...
        // Let's replace the inner <p>s with <li>s and wrap in <ul>.
        const newFaqContent = faqContent.replace(/<p>(.*?)<\/p>/g, '<li class="mb-2 text-blue-800 font-medium hover:underline cursor-pointer">❓ $1</li>');
        html = html.substring(0, faqIndex + 35) + '<ul class="list-none pl-0 mt-4">' + newFaqContent.replace(/<p>|<div|<ul/g, '') + '</ul>' + html.substring(relatedIndex);
        // Wait, the replace logic is a bit fragile.
        // The processedBlocks step happens AFTER this? No, I put step 10 AFTER step 8.
        // So paragraph tags are already present.
        // Let's just create a nice list style.

        const faqsSection = html.substring(faqIndex + 35, relatedIndex);
        const questions = faqsSection.match(/<p>(.*?)<\/p>/g);

        if (questions) {
            const listHtml = `<div class="grid md:grid-cols-2 gap-4 mt-6">` +
                questions.map(q => {
                    const text = q.replace(/<\/?p>/g, '');
                    return `<div class="bg-gray-50 p-4 rounded-lg text-gray-700 font-medium flex items-start"><span class="mr-2 text-blue-500">?</span>${text}</div>`;
                }).join('') + `</div>`;

            html = html.substring(0, faqIndex + 35) + listHtml + html.substring(relatedIndex);
        }
    }
}

// 11. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 12. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
