import * as fs from 'fs';
import * as path from 'path';

const file = 'student-finance-survival-uk-2026.ts';
const articlesDir = path.join(process.cwd(), 'lib/articles');
const filePath = path.join(articlesDir, file);

console.log(`Verifying Word Count for ${file}...`);

try {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract body content
    const bodyMatch = content.match(/body:\s*`([\s\S]*?)`/);
    if (!bodyMatch) {
        console.error('❌ Could not find body content');
        process.exit(1);
    }

    const body = bodyMatch[1];

    // Count words (strip HTML tags first)
    const plainText = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainText.split(/\s+/).length;

    console.log(`Word Count: ${wordCount}`);

    // Check for specific sections to ensure full content
    const checks = [
        'Key Takeaways',
        'Student Budgeting Fundamentals',
        'The 50/30/20 Student Budget Rule',
        'Housing and Rent Strategies',
        'Part-Time Job Optimization',
        'Student Discount Mastery',
        'Food Shopping and Meal Prep Hacks',
        'Essential Money Apps for Students',
        'Student Loan and Maintenance Tips',
        'Crisis Grants and Emergency Support',
        'Side Hustle Ideas for Students',
        'Balancing Academic and Financial Priorities',
        'Cost Calculators and Planning Tools',
        'Money Management Templates',
        'Frequently Asked Questions',
        'Related Financial Guides'
    ];

    console.log('\nSection Checks:');
    let allPassed = true;
    checks.forEach(check => {
        if (body.includes(check)) {
            console.log(`✅ Found: "${check}"`);
        } else {
            console.error(`❌ Missing: "${check}"`);
            allPassed = false;
        }
    });

    if (allPassed) {
        console.log('\n✅ All sections present.');
    } else {
        console.error('\n❌ Some sections are missing.');
        process.exit(1);
    }

} catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
}
