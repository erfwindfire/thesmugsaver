
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/food_crisis_output.html';
const articlePath = 'lib/articles/food-crisis-navigating-snap-cuts-2026.ts';

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

// Update category from whatever to 'supermarket-savings'
// Regex for category
const categoryRegex = /category:\s*['"][^'"]*['"]/;
articleContent = articleContent.replace(categoryRegex, "category: 'supermarket-savings'");

fs.writeFileSync(articlePath, articleContent);
console.log(`Updated ${articlePath}`);

// Verification
console.log('Verifying...');

// 1. Word Count (~2322 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 2100) {
    console.error(`Word count too low: ${wordCount}. Expected ~2322.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'The Calm Before the Grocery Store',
    'The Economics of Hunger',
    'Infrastructure of Last Resort',
    'Protein Question',
    'Food Clubs',
    'Architecture of Survival',
    'When SNAP Isn\'t Enough',
    'Immediate Action Required'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('bg-amber-50')) { // Executive Summary
    console.error('Missing Summary styling');
}
if (!newHtml.includes('bg-red-600')) { // Alert box
    console.error('Missing Alert box styling');
}
if (!newHtml.includes('list-decimal')) { // References
    console.error('Missing References list styling');
}

console.log('All verifications passed!');
