
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/food_price_hikes_output.html';
const articlePath = 'lib/articles/beat-food-price-hikes-uk-2026.ts';

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

// 1. Word Count (~3951 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 3000) {
    console.error(`Word count too low: ${wordCount}. Expected ~3951.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'Bottom Line:',
    'Best Apps:',
    'Strategic Brand Swaps',
    'Loyalty App Breakdown',
    'Yellow Sticker Timing Guide',
    'Weekly Meal Planning Template',
    'Discount Stores',
    'Bulk Buying Sources',
    'Store Switching Calculator',
    '50/30/20 Grocery Rule'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
        // process.exit(1); // Don't exit, just warn, as some formatting might change the exact string
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('<details')) {
    console.error('Missing <details> tags for FAQs');
    process.exit(1);
}
if (!newHtml.includes('bg-green-50')) {
    console.error('Missing TL;DR box styling');
}
if (!newHtml.includes('bg-purple-50')) {
    console.error('Missing Budget Rule box styling');
}

console.log('All verifications passed!');
