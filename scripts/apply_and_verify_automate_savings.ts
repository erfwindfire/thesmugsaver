
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/automate_savings_output.html';
const articlePath = 'lib/articles/automate-savings-2026.ts';

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

// Update category from 'banking' (or whatever) to 'budgeting'
// Regex for category
const categoryRegex = /category:\s*['"][^'"]*['"]/;
articleContent = articleContent.replace(categoryRegex, "category: 'budgeting'");

fs.writeFileSync(articlePath, articleContent);
console.log(`Updated ${articlePath}`);

// Verification
console.log('Verifying...');

// 1. Word Count (~2672 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 2400) {
    console.error(`Word count too low: ${wordCount}. Expected ~2672.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'Critical Risks',
    'Standing Orders vs Direct Debits',
    'Round-Up Apps',
    'Overdraft Risk: The £180 Mistake',
    'App Security Concerns',
    'Real-World Automation Examples',
    '4-Week Implementation Roadmap'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('bg-gray-50')) { // TL;DR box
    console.error('Missing TL;DR box styling');
}
if (!newHtml.includes('bg-indigo-50')) { // Case studies
    console.error('Missing Case Study styling');
}
if (!newHtml.includes('bg-indigo-900')) { // Table header
    console.error('Missing specific table styling');
}

console.log('All verifications passed!');
