
// @ts-nocheck
import fs from 'fs';
import path from 'path';

const articlesDir = path.join(process.cwd(), 'lib/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

console.log(`Found ${files.length} article files.`);

let totalErrors = 0;
let totalWarnings = 0;

const simplifiedAudit = files.map(file => {
  const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');

  // Extract Slug
  const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
  const slug = slugMatch ? slugMatch[1] : 'MISSING';

  // Extract Body
  const bodyMatch = content.match(/body:\s*`([\s\S]*?)`/);
  const body = bodyMatch ? bodyMatch[1] : '';

  // Extract Category
  const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
  const category = categoryMatch ? categoryMatch[1] : 'MISSING';

  const issues = [];

  // Checks
  if (slug === 'MISSING') issues.push('Missing slug');
  if (category === 'MISSING') issues.push('Missing category');

  const wordCount = body.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0).length;

  if (wordCount < 500) {
    issues.push(`LOW WORD COUNT: ${wordCount} (Possible Truncation)`);
    totalErrors++;
  } else if (wordCount < 1000) {
    // Some articles might be short, but generally we expect >1000 for these guides
    // issues.push(`Warning: Low word count ${wordCount}`);
    // Let's keep it strict only for very low.
  }

  if (!body.includes('<h')) {
    issues.push('No HTML headers found (Raw markdown?)');
    totalErrors++;
  }

  if (body.includes('[Back to Homepage]')) {
    issues.push('Contains "[Back to Homepage]" link (Cleanup missed)');
    totalWarnings++;
  }

  return {
    file,
    slug,
    category,
    wordCount,
    issues
  };
});

// Report
console.log('\n--- AUDIT RESULTS ---\n');

const problematic = simplifiedAudit.filter(a => a.issues.length > 0);
const clean = simplifiedAudit.filter(a => a.issues.length === 0);

if (problematic.length > 0) {
  console.log(`❌ ${problematic.length} Articles with Issues:`);
  problematic.forEach(p => {
    console.log(`\n📄 ${p.file} (${p.slug})`);
    console.log(`   Word Count: ${p.wordCount}`);
    p.issues.forEach(i => console.log(`   ⚠️ ${i}`));
  });
} else {
  console.log('✅ No critical issues found in any article.');
}

console.log(`\n✅ ${clean.length} Articles Verified Clean.`);
console.log('\n--- STATS ---');
console.log(`Total Files: ${files.length}`);
const totalWords = simplifiedAudit.reduce((sum, a) => sum + a.wordCount, 0);
console.log(`Total Words: ${totalWords}`);
console.log(`Average Words: ${Math.round(totalWords / files.length)}`);

// Check against expected count of 35
if (files.length < 35) {
  console.log(`\n⚠️ WARNING: Found ${files.length} files, expected 35.`);
}
