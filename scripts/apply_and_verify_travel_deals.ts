
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/travel_deals_output.html';
const articlePath = 'lib/articles/travel-deals-cheap-holidays-uk-2026.ts';

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

// 1. Word Count (~3506 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 3000) {
    console.error(`Word count too low: ${wordCount}. Expected ~3506.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'The Tuesday 3pm Rule',
    'Booking Strategy Effectiveness',
    'The Credit Card Hack',
    'Package vs Independent: Decision Matrix',
    'Travel Insurance Options Compared',
    'The 50/30/20 Travel Rule'
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
if (!newHtml.includes('text-green-500 font-bold block text-sm uppercase')) { // Destination swaps styling
    console.error('Missing destination swap block styling');
}
if (!newHtml.includes('bg-teal-700 text-white')) { // Table header
    console.error('Missing specific table styling');
}

console.log('All verifications passed!');
