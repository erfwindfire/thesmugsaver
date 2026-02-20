import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, '../temp_negotiate_bills_output.html');
const tsPath = path.join(__dirname, '../lib/articles/how-to-negotiate-bills-uk-2026.ts');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
let tsContent = fs.readFileSync(tsPath, 'utf8');

// Replace body content
// Pattern: body: `...`
// We need to be careful with backticks in the HTML content, escaping them if necessary.
// The project usually uses backticks for the body strings.

const escapedHtml = htmlContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');

// We'll use a regex to replace the body.
// Assuming standard format: body: `...`
const regex = /body:\s*`[\s\S]*?`/;

if (regex.test(tsContent)) {
    tsContent = tsContent.replace(regex, `body: \`${escapedHtml}\``);
} else {
    console.error("Could not find body property in TS file");
    process.exit(1);
}

// Calculate word count of the NEW HTML content (stripping tags)
const plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const wordCount = plainText.split(/\s+/).length;

console.log(`New Word Count: ${wordCount}`);

// Update category if needed? User didn't ask, but provided "Category: energy-bills".
// Check if category needs update.
// Current file usage will determine if we need regex replace on category.
const categoryRegex = /category:\s*['"][^'"]*['"]/;
tsContent = tsContent.replace(categoryRegex, `category: 'energy-bills'`);

fs.writeFileSync(tsPath, tsContent);
console.log(`Updated ${tsPath}`);

// Verification
if (wordCount < 2000) {
    console.warn("WARNING: Word count is low. Check if truncation occurred.");
} else {
    console.log("SUCCESS: Word count looks good.");
}
