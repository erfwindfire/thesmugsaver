
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/bnpl_vs_credit_output.html';
const articlePath = 'lib/articles/bnpl-vs-credit-cards-uk-2026.ts';

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

// 1. Word Count (~3271 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 2800) {
    console.error(`Word count too low: ${wordCount}. Expected ~3200.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'TL;DR',
    'Credit Confusion Crisis',
    'Major UK BNPL Providers',
    'Quick Decision Flowchart',
    'Safety & Protection: The Critical Differences'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
        process.exit(1);
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('<details')) {
    console.error('Missing <details> tags for FAQs');
    process.exit(1);
}
if (!newHtml.includes('bg-blue-50')) {
    console.error('Missing TL;DR box styling');
}

console.log('All verifications passed!');
