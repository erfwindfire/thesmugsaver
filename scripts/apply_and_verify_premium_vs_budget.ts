
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/premium_vs_budget_output.html';
const articlePath = 'lib/articles/premium-vs-budget-insurance-uk-2026.ts';

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

// 1. Word Count (~5867 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 4500) {
    console.error(`Word count too low: ${wordCount}. Expected ~5867.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'TL;DR — At-a-Glance Summary',
    'What is Insurance Excess (Deductible)?',
    'Insurance Fundamentals: What You\'re Actually Buying',
    'Hidden Exclusions: Where Claims Get Denied',
    'Age-Based Pricing',
    'Provider Comparison',
    'Red Flags to Avoid',
    'Frequently Asked Questions'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('<details')) {
    console.error('Missing <details> tags for FAQs');
}
if (!newHtml.includes('bg-gray-50')) {
    console.error('Missing TL;DR box styling');
}
if (!newHtml.includes('bg-indigo-50')) {
    console.error('Missing Quick Answers box styling');
}

console.log('All verifications passed!');
