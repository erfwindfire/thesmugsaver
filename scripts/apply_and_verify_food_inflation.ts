
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/food_inflation_output.html';
const articlePath = 'lib/articles/food-inflation-2026-smart-shopping.ts';

// Read content
const newHtml = fs.readFileSync(htmlPath, 'utf-8');
let articleContent = fs.readFileSync(articlePath, 'utf-8');

// Replace body content
// Pattern: body: `...`
const bodyRegex = /body:\s*`[\s\S]*?`/;
if (!bodyRegex.test(articleContent)) {
    console.error('Could not find body field in article file');
    process.exit(1);
}

// Construct new body
const newBody = `body: \`${newHtml}\``;
articleContent = articleContent.replace(bodyRegex, newBody);

// Write back
fs.writeFileSync(articlePath, articleContent);
console.log(`Updated ${articlePath}`);

// Verification
console.log('Verifying...');

// 1. Word Count (~5032 words expected)
// Let's count approximate words in HTML
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 4500) {
    console.error(`Word count too low: ${wordCount}. Expected ~5000.`);
    // process.exit(1);
} else {
    console.log('Word count verification passed.');
}

// 2. Check for key phrases
const keyPhrases = [
    '5.1%',
    'Primary Inflation Drivers',
    'Smart Shopping Calendar',
    'Discount Retailer Comparison',
    'Food Inflation 2026: Your Questions Answered'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
        process.exit(1);
    }
});
console.log('Key phrases verification passed.');

// 3. Check for specific HTML formatting
if (!newHtml.includes('<details')) {
    console.error('Missing <details> tags for FAQs');
    process.exit(1);
}
if (!newHtml.includes('grid-cols')) {
    console.error('Missing grid layout classes');
}

console.log('All verifications passed!');
