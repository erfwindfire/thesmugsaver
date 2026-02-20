
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_automate_savings_source.md';
const outputPath = 'scripts/automate_savings_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata and Intro Link
const titleHeader = '# Automate Your Savings';
const titleIndex = html.indexOf(titleHeader);
if (titleIndex !== -1) {
    html = html.substring(titleIndex);
}

// 2. Headings
html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h5>$1</h5>'); // #### used for sub-sections like "Best Automation Tools" inside TL;DR
// Actually source uses #### for "Best Automation Tools" inside TL;DR. H4 is fine.
html = html.replace(/<h5>(.*)<\/h5>/g, '<h4>$1</h4>'); // Revert if needed or stick to H4. Let's keep H4 for ####.
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>'); // Wait, line above regex replaced #### with <h5>.
// Let's correct:
html = markdown; // Reset
if (titleIndex !== -1) {
    html = html.substring(titleIndex);
}
html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');


// 3. TL;DR Grid
// ## TL;DR
// ...
// ### Best Automation Tools
// ...
// ### Critical Risks
// ...
// Typical automation: ...
const tldrStart = html.indexOf('<h2>TL;DR');
if (tldrStart !== -1) {
    const tldrEnd = html.indexOf('<h2>Why Automation Is', tldrStart);
    if (tldrEnd !== -1) {
        let tldrContent = html.substring(tldrStart, tldrEnd);

        // Extract the two columns: Best Tools and Critical Risks
        // They are H3s.
        // ### Best Automation Tools
        // ... list
        // ### Critical Risks
        // ... list

        // Let's parse them
        const toolsMatch = tldrContent.match(/<h3>Best Automation Tools<\/h3>\n\n((?:• .*\n)+)/);
        const risksMatch = tldrContent.match(/<h3>Critical Risks<\/h3>\n\n((?:• .*\n)+)/);

        if (toolsMatch && risksMatch) {
            const toolsList = toolsMatch[1].split('\n').filter(l => l.trim()).map(l => `<li class="flex items-start mb-2"><span class="text-green-500 mr-2 font-bold">✓</span>${l.replace('• • ', '').trim()}</li>`).join('\n');
            const risksList = risksMatch[1].split('\n').filter(l => l.trim()).map(l => `<li class="flex items-start mb-2"><span class="text-red-500 mr-2 font-bold">⚠️</span>${l.replace('• • ', '').trim()}</li>`).join('\n');

            const summaryText = tldrContent.match(/Typical automation: .*/);

            const newTldr = `
<div class="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">TL;DR — At-a-Glance Summary</h2>
    <div class="grid md:grid-cols-2 gap-8">
        <div>
            <h3 class="font-bold text-green-800 mb-4 flex items-center bg-green-50 p-2 rounded-lg">
                <span class="mr-2">🛠️</span> Best Automation Tools
            </h3>
            <ul class="text-sm text-gray-700">
                ${toolsList}
            </ul>
        </div>
        <div>
            <h3 class="font-bold text-red-800 mb-4 flex items-center bg-red-50 p-2 rounded-lg">
                <span class="mr-2">🚨</span> Critical Risks
            </h3>
            <ul class="text-sm text-gray-700">
                ${risksList}
            </ul>
        </div>
    </div>
    ${summaryText ? `<div class="mt-6 pt-4 border-t border-gray-200 font-bold text-center text-indigo-700">${summaryText[0]}</div>` : ''}
</div>`;

            html = html.substring(0, tldrStart) + newTldr + html.substring(tldrEnd);
        }
    }
}

// 4. Tables
html = html.replace(/\|(.+)\|\n\|( *[-:]+[-| :]*)\|\n((?:\|.*\|\n?)*)/g, (match, header, separator, body) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const rows = body.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    // Check if it's the App cost table or Feature table
    const isCostTable = headers.includes('App Cost');
    const headerColor = isCostTable ? 'bg-green-700' : 'bg-indigo-900';

    let tableHtml = `<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm">\n<thead>\n<tr class="${headerColor} text-white">\n`;
    headers.forEach(h => tableHtml += `<th class="p-3 font-bold whitespace-nowrap">${h}</th>\n`);
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row, i) => {
        const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHtml += `<tr class="${bgClass} border-b border-gray-100 transition-colors">\n`;
        row.forEach(cell => {
            let content = cell;
            if (cell.includes('✓')) content = `<span class="text-green-600 font-bold">${cell}</span>`;
            if (cell.includes('❌')) content = `<span class="text-red-600 font-bold">${cell}</span>`;
            if (cell.includes('⚠️')) content = `<span class="text-yellow-600 font-bold">${cell}</span>`;
            tableHtml += `<td class="p-3 text-gray-700">${content}</td>\n`;
        });
        tableHtml += '</tr>\n';
    });

    tableHtml += '</tbody>\n</table></div>';
    return tableHtml;
});

// 5. Checklist Items (Security Checklist)
// "• ✓ Verify..."
html = html.replace(/^[•] [✓] (.*$)/gm, '<li class="flex items-start mb-2"><span class="text-green-500 mr-2 font-bold">✓</span><span>$1</span></li>');

// 6. Regular Lists
// "• •" double bullets -> single
html = html.replace(/^[•] [•] (.*$)/gm, '<li>$1</li>');
// Single bullets
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

// 7. Case Studies
// ### Case Study 1: ...
// ...
// ### Case Study 2: ...
html = html.replace(/(<h3>Case Study \d:.*?<\/h3>)([\s\S]*?)(?=<h3>|##|$)/g, (match, header, content) => {
    return `<div class="bg-indigo-50 border-l-4 border-indigo-500 p-6 my-6 rounded-r-lg">
        ${header}
        ${content}
    </div>`;
});

// 8. Implementation Roadmap (Numbered Weeks)
// ### 1Week 1: ...
// Source has typo "1Week 1".
html = html.replace(/### \dWeek (\d(-?12)?): (.*)/g, '<h3>Week $1: $3</h3>');

// 9. Paragraphs
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

// 10. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 11. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 12. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
