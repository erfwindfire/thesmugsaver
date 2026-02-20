
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_energy_bills_rising_source.md';
const outputPath = 'scripts/energy_bills_rising_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata and Intro Link
const titleHeader = '# Energy Bills Rising';
const titleIndex = html.indexOf(titleHeader);
if (titleIndex !== -1) {
    // Keep the title, remove the "[Back to Homepage](...)" and "Energy Crisis Alert" lines if they are before
    // But usually we just strip before the title for clean HTML body
    html = html.substring(titleIndex);
}

// 2. Headings
html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');

// 3. Executive Summary Box
// Starts at <h3>Executive Summary...
// Ends before ## The Harsh Reality...
const execSumStart = html.indexOf('<h3>Executive Summary');
const execSumEnd = html.indexOf('<h2>The Harsh Reality');

if (execSumStart !== -1 && execSumEnd !== -1) {
    const execSumBlock = html.substring(execSumStart, execSumEnd);

    // Style the block
    let styledExecSum = execSumBlock.replace('<h3>', '<div class="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8 shadow-sm"><h3>');
    // We need to close the div at the end of the block
    styledExecSum += '</div>';

    html = html.substring(0, execSumStart) + styledExecSum + html.substring(execSumEnd);
}

// 4. Alerts and Special Blocks
const alerts = [
    { label: 'Critical:', color: 'red', icon: '🚨' },
    { label: 'Reality Check:', color: 'blue', icon: 'ℹ️' },
    { label: 'Pro Tip:', color: 'green', icon: '💡' },
    { label: 'Switching Window:', color: 'yellow', icon: '⚠️' },
    { label: 'Low Usage Penalty:', color: 'red', icon: '⚠️' },
    { label: 'Forced Installation Protection:', color: 'red', icon: '🛡️' },
    { label: 'Key Protection:', color: 'green', icon: '🛡️' },
    { label: 'Free Installation Reminder:', color: 'blue', icon: '📅' },
    { label: 'Installation Priority:', color: 'yellow', icon: 'Construct' },
    { label: 'Switching Protection:', color: 'blue', icon: 'shield' }
];

alerts.forEach(({ label, color, icon }) => {
    // Regex to match "Label:\nContent" or "Label: Content"
    // The content usually ends at the next double newline or next header
    const regex = new RegExp(`(${label})\\s*([\\s\\S]*?)(?=\\n\\n|<h)`, 'g');

    html = html.replace(regex, (match, lbl, content) => {
        const bg = `bg-${color}-50`;
        const border = `border-${color}-200`;
        const text = `text-${color}-900`;

        return `<div class="${bg} border-l-4 ${border} p-4 my-6 rounded-r-lg">
            <div class="flex items-start">
                <span class="text-2xl mr-3">${icon}</span>
                <div>
                    <span class="font-bold ${text} block mb-1">${lbl}</span>
                    <div class="text-gray-700">${content.trim()}</div>
                </div>
            </div>
        </div>`;
    });
});

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

// 6. Lists
// Checkmarks
html = html.replace(/^• ✓ (.*$)/gm, '<li class="flex items-start mb-2"><span class="text-green-600 font-bold mr-2">✓</span> $1</li>');
// Bullets
html = html.replace(/^[•] [•]? (.*$)/gm, '<li>$1</li>');

// Wrap <li> in <ul>
html = html.split('\n').reduce((acc, line) => {
    if (line.trim().startsWith('<li')) {
        if (!acc.inList) {
            acc.text += '<ul class="list-none pl-0 mb-6 space-y-2 text-gray-700">\n'; // Using list-none because we have custom icons
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

// 7. Quick Win: The 1% Rule
// "<h4>Quick Win: The 1% Rule</h4>" -> Styled Box
html = html.replace(/<h4>Quick Win: The 1% Rule<\/h4>/,
    '<div class="bg-yellow-50 p-6 rounded-lg my-6 border border-yellow-200"><h4 class="text-yellow-900 font-bold mb-4">Quick Win: The 1% Rule</h4>');
// Close it. It contains a list, then ends.
// We need to find where it ends. It's followed by "### Smart Meter Optimization"
html = html.replace(/(<h3>Smart Meter Optimization)/, '</div>\n\n$1');

// 8. Total Expected Annual Savings Box
// "#### Total Expected Annual Savings: £300-450"
html = html.replace(/<h4>Total Expected Annual Savings: £300-450<\/h4>/,
    '<div class="bg-green-50 p-6 rounded-lg my-8 border border-green-200 text-center"><h4 class="text-2xl font-bold text-green-900 mb-6">Total Expected Annual Savings: £300-450</h4>');
// Close before "### Related Money-Saving Guides"
html = html.replace(/(<h3>Related Money-Saving Guides)/, '</div>\n\n$1');


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

// 11. Subscribe Button
html = html.replace(/<p>Subscribe<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe Free</button>');

// 12. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
