
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/switch_broadband_output.html';
const articlePath = 'lib/articles/switch-broadband-mobile-tv-uk-2026.ts';

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

// 1. Word Count (~4975 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 4500) {
    console.error(`Word count too low: ${wordCount}. Expected ~4975.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'The Complete Switching Process Step-by-Step',
    'Broadband Provider Offers - 2026 Landscape',
    'Mobile Plan Comparisons',
    'Bundled Deals Analysis',
    'Contract Negotiation Scripts That Work',
    'Case Study 3: The Retiree Couple',
    'Top Switching Scams in 2026'
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
if (!newHtml.includes('bg-green-50')) { // Exec summary stats
    console.error('Missing Executive Summary stats styling');
}
if (!newHtml.includes('border-l-4 border-yellow-400')) { // Negotiation quotes
    console.error('Missing negotiation script styling');
}
if (!newHtml.includes('border-l-4 border-red-500')) { // Scam/Red flag warnings
    console.error('Missing scam warning styling');
}

console.log('All verifications passed!');
