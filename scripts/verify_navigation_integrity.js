const fs = require('fs');
const path = require('path');

// Mock the imports since we can't easily import TS in JS without ts-node and config
// We will read the files directly or use a clever regex approach as before

const articlesDir = path.join(__dirname, '../lib/articles');
const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.ts'));

const CATEGORIES = [
    'budgeting',
    'savings-and-investing',
    'energy-bills',
    'supermarket-savings',
    'credit-cards-and-debt',
    'broadband-and-subscriptions',
    'insurance',
    'housing',
    'earning-and-benefits',
    'cost-of-living',
    'family-and-lifestyle',
];

let issues = [];
let articleCount = 0;
let categoryCounts = {};

CATEGORIES.forEach(c => categoryCounts[c] = 0);

articleFiles.forEach(file => {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');

    // Extract slug
    const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
    const slug = slugMatch ? slugMatch[1] : null;

    // Extract category
    const catMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
    const category = catMatch ? catMatch[1] : null;

    if (!slug) {
        issues.push(`File ${file} missing slug`);
        return;
    }

    if (!category) {
        issues.push(`Article ${slug} missing category`);
        return;
    }

    if (!CATEGORIES.includes(category)) {
        issues.push(`Article ${slug} has invalid category: ${category}`);
    } else {
        categoryCounts[category]++;
    }

    articleCount++;
});

console.log(`Total Articles Checked: ${articleCount}`);
console.log('--- Category Counts ---');
Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`${cat}: ${count}`);
});

if (issues.length > 0) {
    console.error('\n--- ISSUES FOUND ---');
    issues.forEach(i => console.error(i));
    process.exit(1);
} else {
    console.log('\nAll articles have valid categories.');
}
