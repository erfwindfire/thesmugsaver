import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'lib/articles/good-budgeting-techniques-2026.ts');
const content = fs.readFileSync(filePath, 'utf-8');
const bodyMatch = content.match(/body:\s*\`([\s\S]*?)\`/);

if (bodyMatch) {
    const body = bodyMatch[1];
    // Strip HTML tags and normalize whitespace
    const plainText = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainText.split(' ').length;
    console.log(`Word Count: ${wordCount}`);
} else {
    console.error('Failed to parse body');
}
