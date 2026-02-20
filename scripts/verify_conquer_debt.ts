import * as fs from 'fs';
import * as path from 'path';

const file = 'conquer-your-debt-2026.ts';
const articlesDir = path.join(process.cwd(), 'lib/articles');
const filePath = path.join(articlesDir, file);

console.log(`Verifying Word Count for ${file}:`);
console.log('--------------------------------');

if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const bodyMatch = content.match(/body:\s*\`([\s\S]*?)\`/);

    if (bodyMatch) {
        const body = bodyMatch[1];
        // Strip HTML tags and normalize whitespace
        const plainText = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const wordCount = plainText.split(' ').length;
        console.log(`${file}: ${wordCount} words`);
    } else {
        console.error(`${file}: Failed to parse body`);
    }
} else {
    console.error(`${file}: File not found`);
}
