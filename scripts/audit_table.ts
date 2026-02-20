
// @ts-nocheck
import fs from 'fs';
import path from 'path';

const articlesDir = path.join(process.cwd(), 'lib/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

console.log('--- TABLE STARTS ---');
console.log('| Slug | Title | Category | Words | H2s | FAQs | Read Time |');
console.log('|---|---|---|---|---|---|---|');

const sortedFiles = files.sort();

sortedFiles.forEach(file => {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');

    // Extract metadata
    const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
    const slug = slugMatch ? slugMatch[1] : 'MISSING';

    const titleMatch = content.match(/title:\s*(?:"([^"]+)"|'([^']+)')/);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]).replace(/\|/g, '-') : 'MISSING'; // Escape pipes

    const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
    const category = categoryMatch ? categoryMatch[1] : 'MISSING';

    // Extract Body
    const bodyMatch = content.match(/body:\s*`([\s\S]*?)`/);
    const body = bodyMatch ? bodyMatch[1] : '';

    // Check H2s
    const h2Count = (body.match(/<h2>/g) || []).length;

    // Check FAQs
    // Usually H3s under "Frequently Asked Questions"
    // Let's count all H3s for now as a proxy, or check specifically.
    // Assuming FAQs are H3s. Let's count them if "Frequently Asked Questions" is present.
    let faqCount = 0;
    if (body.includes('Frequently Asked Questions')) {
        // Count H3s after the FAQ header position?
        // Or just count total H3s?
        // Let's count total H3s as FAQs usually dominate H3 usage in these articles.
        // Actually, let's count only H3s to match typical structure.
        faqCount = (body.match(/<h3>/g) || []).length;
        // If there are subheaders in exec summary or other sections (H3), they will be included.
        // Let's refine: "FAQs" often requested as Yes/No or Count.
        // Let's stick to H3 count as a rough metric for "FAQs + Subsections".
        // IF the user specifically wants number of FAQs, it might be tricky without parsing.
        // However, looking at previous tables, "FAQs" column usually listed count.
    } else {
        faqCount = 0; // If no FAQ section, assume 0 relevant questions.
    }

    // Word Count
    // Strip HTML tags
    const text = body.replace(/<[^>]*>/g, ' ');
    const wordCount = text.split(/\s+/).filter(w => w.trim().length > 0).length;

    // Read Time (200 wpm)
    const readTime = Math.ceil(wordCount / 200) + ' min';

    console.log(`| ${slug} | ${title.substring(0, 50)}${title.length > 50 ? '...' : ''} | ${category} | ${wordCount} | ${h2Count} | ${faqCount} | ${readTime} |`);
});
console.log('--- TABLE ENDS ---');
