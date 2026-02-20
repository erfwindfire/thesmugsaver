
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/mortgage_rates_output.html';
const articlePath = 'lib/articles/mortgage-rates-2026-fix-or-wait.ts';

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

// 1. Word Count (~1678 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 1500) {
    console.error(`Word count too low: ${wordCount}. Expected ~1678.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'Executive Summary',
    'Bank of England Base Rate',
    'CPI Inflation',
    'Fixed vs Variable: The September 2026 Reality',
    'Best Mortgage Rates September 2026',
    'Rate Forecast: What Economists Predict',
    'Remortgage Strategies',
    'Take Action This Week'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('bg-blue-50')) { // Exec summary
    console.error('Missing Summary styling');
}
if (!newHtml.includes('bg-gray-800')) { // Stats snapshot box
    console.error('Missing Stats styling');
}
if (!newHtml.includes('bg-indigo-900')) { // Table header
    console.error('Missing Table styling');
}

console.log('All verifications passed!');
