import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import MarkdownIt from 'markdown-it';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
});

const sourcePath = path.join(__dirname, '../temp_negotiate_bills_source.md');
const outputPath = path.join(__dirname, '../temp_negotiate_bills_output.html');

const markdown = fs.readFileSync(sourcePath, 'utf8');

// Custom render rules
md.renderer.rules.table_open = () => '<div class="overflow-x-auto my-8"><table class="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">';
md.renderer.rules.table_close = () => '</table></div>';
md.renderer.rules.thead_open = () => '<thead class="bg-blue-600 text-white">';
md.renderer.rules.thead_close = () => '</thead>';
md.renderer.rules.th_open = () => '<th class="py-3 px-4 text-left font-semibold uppercase tracking-wider">';
md.renderer.rules.th_close = () => '</th>';
md.renderer.rules.td_open = () => '<td class="py-3 px-4 border-b border-gray-200 text-gray-700">';
md.renderer.rules.td_close = () => '</td>';

let html = md.render(markdown);

// Post-processing for specific elements

// 1. Quick Takeaways (Blue Box)
html = html.replace(
    /<h2>Quick Takeaways<\/h2>\s*<ul>/g,
    '<div class="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg shadow-sm">\n<h2 class="text-2xl font-bold text-blue-800 mb-4">Quick Takeaways</h2>\n<ul class="space-y-3">'
);
html = html.replace(
    /<li>✓ (.*?)<\/li>/g,
    '<li class="flex items-start"><span class="text-blue-600 mr-2 font-bold">✓</span><span class="text-gray-700">$1</span></li>'
);
html = html.replace(/(<ul class="space-y-3">[\s\S]*?<\/ul>)/, '$1\n</div>');


// 2. Alert/Warning Boxes (Yellow/Red)
html = html.replace(
    /<h4>⚠️ (.*?)<\/h4>/g,
    '<div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 rounded-r-lg shadow-sm">\n<h4 class="text-lg font-bold text-yellow-800 mb-2">⚠️ $1</h4>'
);

// 3. Info/Audit Boxes (Blue)
html = html.replace(
    /<h4>🔍 (.*?)<\/h4>/g,
    '<div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg shadow-sm">\n<h4 class="text-lg font-bold text-blue-800 mb-2">🔍 $1</h4>'
);

// 4. Checklist/Prep Boxes (Green)
html = html.replace(
    /<h4>📋 (.*?)<\/h4>/g,
    '<div class="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg shadow-sm">\n<h4 class="text-lg font-bold text-green-800 mb-2">📋 $1</h4>'
);

// 5. Money/Value Boxes (Green)
html = html.replace(
    /<h4>💰 (.*?)<\/h4>/g,
    '<div class="bg-green-50 border-l-4 border-green-600 p-6 my-8 rounded-r-lg shadow-sm">\n<h4 class="text-lg font-bold text-green-800 mb-2">💰 $1</h4>'
);

// 6. Target/Success Boxes (Red/Pink)
html = html.replace(
    /<h4>🎯 (.*?)<\/h4>/g,
    '<div class="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg shadow-sm">\n<h4 class="text-lg font-bold text-red-800 mb-2">🎯 $1</h4>'
);

// Better approach for the inputs like "• □ Research..."
html = html.replace(
    /<li>□ (.*?)<\/li>/g,
    '<li class="flex items-start"><input type="checkbox" class="mt-1 mr-2" disabled> <span class="text-gray-700">$1</span></li>'
);

// Style standard bullets in these contexts
html = html.replace(
    /<li>• (.*?)<\/li>/g,
    '<li class="flex items-start"><span class="text-gray-400 mr-2">•</span><span class="text-gray-700">$1</span></li>'
);

// Fix "UK Consumer Rights" list which uses "• •" in source
html = html.replace(
    /<li>• • (.*?)<\/li>/g,
    '<li class="flex items-start"><span class="text-blue-500 mr-2">•</span><span class="text-gray-700">$1</span></li>'
);

const faqStartIndex = html.indexOf('<h2>Complete Bill Negotiation FAQ');
if (faqStartIndex !== -1) {
    let faqSection = html.substring(faqStartIndex);
    const preFaq = html.substring(0, faqStartIndex);

    const chunks = faqSection.split('<h3>');
    let newFaqSection = chunks[0];

    for (let i = 1; i < chunks.length; i++) {
        const chunk = chunks[i];
        const endOfHeader = chunk.indexOf('</h3>');
        const question = chunk.substring(0, endOfHeader);
        const answer = chunk.substring(endOfHeader + 5);

        newFaqSection += `
    <details class="group mb-4">
      <summary class="flex justify-between items-center font-bold cursor-pointer bg-gray-50 p-4 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors">
        <span>${question}</span>
        <span class="text-blue-600 transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div class="p-4 text-gray-700 bg-white border border-t-0 border-gray-100 rounded-b-lg">
        ${answer}
      </div>
    </details>`;
    }

    html = preFaq + newFaqSection;
}

fs.writeFileSync(outputPath, html);
console.log('Conversion complete. Check temp_negotiate_bills_output.html');
