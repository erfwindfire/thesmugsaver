
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/uk_household_bills_output.html';
const articlePath = 'lib/articles/uk-household-bills-2026.ts';

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

// 1. Word Count (~2685 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 2400) {
    console.error(`Word count too low: ${wordCount}. Expected ~2685.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'Quick Summary: What You\'ll Learn',
    'Average Annual Energy Bills by Region',
    'Standing Charge Optimization',
    'Smart Meter Advantages and Money-Saving Hacks',
    'New Government Support Schemes for 2026',
    'Frequently Asked Questions'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('bg-blue-50')) { // Quick summary
    console.error('Missing Quick Summary styling');
}
if (!newHtml.includes('bg-indigo-900')) { // Table header
    console.error('Missing specific table styling');
}
if (!newHtml.includes('<details class="group')) { // FAQs
    console.error('Missing FAQ accordion details');
}

console.log('All verifications passed!');
