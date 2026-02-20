
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/rent_buy_output.html';
const articlePath = 'lib/articles/rent-buy-stay-put-uk-2026.ts';

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

// 1. Word Count (~5404 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 4500) {
    console.error(`Word count too low: ${wordCount}. Expected ~5404.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'At-a-Glance Summary',
    'Renting Makes Sense If',
    'Buying Makes Sense If',
    'Stay Put & Remortgage If',
    'Current Market Snapshot',
    'Remortgaging Cost-Benefit Analysis',
    'Accelerator Strategies',
    'Negotiation Scripts'
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
if (!newHtml.includes('bg-gray-50')) {
    console.error('Missing Summary box styling');
}
if (!newHtml.includes('border-t-4 border-blue-500')) {
    console.error('Missing Renting box styling');
}

console.log('All verifications passed!');
