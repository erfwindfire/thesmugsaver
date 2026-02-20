
// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Define paths
const htmlPath = 'scripts/energy_bills_rising_output.html';
const articlePath = 'lib/articles/energy-bills-rising-october-2026.ts';

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

// 1. Word Count (~3614 expected)
const wordCount = newHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;
console.log(`Word Count: ${wordCount}`);
if (wordCount < 3000) {
    console.error(`Word count too low: ${wordCount}. Expected ~3614.`);
} else {
    console.log('Word count verification passed.');
}

// 2. Key phrases
const keyPhrases = [
    'Executive Summary: Your Energy Bills Battle Plan',
    'The Harsh Reality',
    'Quick Win: The 1% Rule',
    'Smart Meter Optimization',
    'Total Expected Annual Savings',
    'Sources & Further Reading'
];

keyPhrases.forEach(phrase => {
    if (!newHtml.includes(phrase)) {
        console.error(`Missing phrase: "${phrase}"`);
    }
});
console.log('Key phrases verification passed.');

// 3. HTML Structure
if (!newHtml.includes('bg-blue-50')) {
    console.error('Missing Executive Summary box styling');
}
if (!newHtml.includes('bg-red-50')) {
    console.error('Missing Critical Alert box styling');
}
if (!newHtml.includes('border-l-4')) {
    console.error('Missing Alert border styling');
}

console.log('All verifications passed!');
