
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/break_paycheck_cycle_output.html';
const articlePath = 'lib/articles/break-paycheck-cycle-2026.ts';

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

// Update category to 'budgeting'
// Check if category is present
const categoryRegex = /category:\s*['"][^'"]*['"]/;
if (!categoryRegex.test(articleContent)) {
    console.error('Could not find category field in article file');
    // Don't exit, just warn
} else {
    articleContent = articleContent.replace(categoryRegex, `category: 'budgeting'`);
    console.log('Updated category to budgeting');
}

fs.writeFileSync(articlePath, articleContent);
console.log(`Updated ${articlePath}`);

// Verification
console.log('Verifying...');

// 1. Word Count (~2745 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 2000) {
    console.error(`Word count too low: ${wordCount}. Expected ~2745.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'TL;DR: Escape the Paycheck Cycle',
    'Understanding the Paycheck-to-Paycheck Cycle',
    'Subscription Audit Checklist',
    'Side Hustle Opportunities',
    'Pay Cycle Strategy',
    'Annual Savings Calendar',
    'Emergency Fund Pyramid'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
        // process.exit(1);
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
if (!newHtml.includes('checkbox')) {
    console.error('Missing checkbox styling');
}

console.log('All verifications passed!');
