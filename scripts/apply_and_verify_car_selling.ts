
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/car_selling_output.html';
const articlePath = 'lib/articles/car-trading-selling-uk-2026.ts';

// Read content
const newHtml = fs.readFileSync(htmlPath, 'utf-8');
let articleContent = fs.readFileSync(articlePath, 'utf-8');

// 1. Replace body content
const bodyRegex = /body:\s*`[\s\S]*?`/;
if (!bodyRegex.test(articleContent)) {
    console.error('Could not find body field in article file');
    process.exit(1);
}

const newBody = `body: \`${newHtml}\``;
articleContent = articleContent.replace(bodyRegex, newBody);

// 2. Fix Category
// Current: category: '...',
// Target: category: 'insurance',
const categoryRegex = /category:\s*['"][^'"]*['"]/;
if (!categoryRegex.test(articleContent)) {
    console.error('Could not find category field');
} else {
    articleContent = articleContent.replace(categoryRegex, "category: 'insurance'");
    console.log('Updated category to insurance');
}

// Write back
fs.writeFileSync(articlePath, articleContent);
console.log(`Updated ${articlePath}`);

// Verification
console.log('Verifying...');

// 1. Word Count (~3819 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 3000) {
    console.error(`Word count too low: ${wordCount}. Expected ~3800.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'TL;DR',
    'Professional Valuation Tools',
    'DIY Preparation Checklist',
    'Winning Ad Template',
    'Private Sale vs Dealer Trade-In'
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

console.log('All verifications passed!');
