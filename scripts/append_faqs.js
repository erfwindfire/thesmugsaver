const fs = require('fs');
const path = require('path');

const faqsFile = process.argv[2];
if (!faqsFile) {
  console.error("Usage: node scripts/append_faqs.js <faqs_json_file>");
  process.exit(1);
}

const faqsData = JSON.parse(fs.readFileSync(faqsFile, 'utf8'));
const articlesDir = path.join(__dirname, '../lib/articles');

Object.entries(faqsData).forEach(([slug, faqs]) => {
  const filePath = path.join(articlesDir, `${slug}.ts`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Safety check: existing formatted FAQs
  if (content.includes('<details')) {
    console.log(`Skipping ${slug}: Formatted FAQs (details tags) already exist.`);
    return;
  }

  // Generate HTML
  let faqHtml = `<h2>Frequently Asked Questions</h2>\n<div class="space-y-4 my-8">\n`;

  faqs.forEach((item, index) => {
    faqHtml += `  <details class="group border-b border-gray-200 pb-4">
    <summary class="flex justify-between items-center font-bold cursor-pointer text-lg text-gray-800 hover:text-blue-600 transition-colors">
      <span>${item.q}</span>
      <span class="text-blue-600 transition-transform group-open:rotate-180">▼</span>
    </summary>
    <div class="mt-4 text-gray-700 leading-relaxed">
      ${item.a}
    </div>
  </details>\n`;
  });

  faqHtml += `</div>\n`;

  // Logic to replace or append
  const faqHeader = '<h2>Frequently Asked Questions</h2>';
  const faqIdx = content.indexOf(faqHeader);

  if (faqIdx !== -1) {
    // Found existing header (likely stubbed). Replace until next <h2> or end of body.

    // Find the end of this section.
    // We start searching for the NEXT <h2> after the header we found.
    const searchStart = faqIdx + faqHeader.length;
    const nextHeaderIdx = content.indexOf('<h2>', searchStart);

    // Also find the end of the body (last backtick) to ensure we don't go out of bounds
    const lastBacktickIdx = content.lastIndexOf('`');

    let endIdx;
    if (nextHeaderIdx !== -1 && nextHeaderIdx < lastBacktickIdx) {
      endIdx = nextHeaderIdx;
    } else {
      endIdx = lastBacktickIdx;
    }

    // Replace the range [faqIdx, endIdx] with new HTML
    // Note: If we found next header, we want to keep it.
    // So we replace up to endIdx.
    const preFaq = content.substring(0, faqIdx);
    const postFaq = content.substring(endIdx);

    const newContent = preFaq + faqHtml + '\n' + postFaq;
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${slug}: Replaced stubbed FAQs.`);

  } else {
    // Header not found. Append to end of body.
    const lastBacktickIndex = content.lastIndexOf('`');
    if (lastBacktickIndex === -1) {
      console.error(`Could not find body closing backtick in ${slug}`);
      return;
    }

    // Add some spacing before the new section
    const newContent = content.substring(0, lastBacktickIndex) + '\n\n' + faqHtml + content.substring(lastBacktickIndex);
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${slug}: Appended FAQs.`);
  }
});
