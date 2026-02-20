
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/uk_budget_output.html';
const articlePath = 'lib/articles/uk-budget-2026-rachel-reeves-autumn-statement.ts';

// Read content
const newHtml = fs.readFileSync(htmlPath, 'utf-8');
let articleContent = fs.readFileSync(articlePath, 'utf-8');

// Replace body content
const bodyRegex = /body:\s*`[\s\S]*?`/;
if (!bodyRegex.test(articleContent)) {
    console.error('Could not find body field in article file');
    process.exit(1);
}

const newBody = `body: \`${newHtml}\``;
articleContent = articleContent.replace(bodyRegex, newBody);

fs.writeFileSync(articlePath, articleContent);
console.log(`Updated ${articlePath}`);

// Verification
console.log('Verifying...');

// 1. Word Count (~4630 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 4000) {
    console.error(`Word count too low: ${wordCount}. Expected ~4630.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'Fiscal Drag Impact',
    'Capital Gains Tax: The Investor\'s Nightmare',
    'Inheritance Tax: Estate Planning Under Siege',
    'Winners 🎯',
    'Losers 📉',
    'Your Action Plan: What to Do Before April 2026'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('bg-red-50')) { // Key Takeaways or Losers
    console.error('Missing specific box styling (Key Takeaways/Losers)');
}
if (!newHtml.includes('bg-slate-800 text-white')) { // Table header
    console.error('Missing specific table styling');
}
if (!newHtml.includes('💡 Action Step')) { // Action steps
    console.error('Missing Action Step styling');
}

console.log('All verifications passed!');
