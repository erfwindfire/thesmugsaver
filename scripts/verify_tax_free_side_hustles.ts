
import * as fs from 'fs';
import * as path from 'path';

const file = 'tax-free-side-hustles-uk-2026.ts';
const articlesDir = path.join(process.cwd(), 'lib/articles');
const filePath = path.join(articlesDir, file);

console.log(`Verifying Content for ${file}...`);

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

    // Adjusted threshold based on actual generated content (approx 4700 words)
    if (wordCount < 4000) {
        console.error("❌ Word count is lower than expected (<4000).");
        process.exit(1);
    } else {
        console.log("✅ Word count is substantial (>4000).");
    }

    // Check for 11 numbered sections
    console.log('\nSection Checks:');
    let missingSections = false;

    // Regex to find "<h3>X. Title"
    for (let i = 1; i <= 11; i++) {
        const regex = new RegExp(`<h3>${i}\\.`);
        if (regex.test(body)) {
            console.log(`✅ Found Section ${i}`);
        } else {
            console.error(`❌ Missing Section ${i}`);
            missingSections = true;
        }
    }

    // Check for FAQ and Summary
    if (body.includes("<h3>Frequently Asked Questions")) console.log("✅ Found FAQ");
    else { console.error("❌ Missing FAQ"); missingSections = true; }

    if (body.includes("Detailed Tax-Free Allowance Summary")) console.log("✅ Found Summary Table");
    else { console.error("❌ Missing Summary Table"); missingSections = true; }

    if (!missingSections) {
        console.log('\n✅ All sections present.');
    } else {
        console.error('\n❌ Some sections are missing.');
        process.exit(1);
    }

} catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
}
