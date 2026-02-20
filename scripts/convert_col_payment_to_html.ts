
// @ts-nocheck
import fs from 'fs';

const sourcePath = 'temp_col_payment_source.md';
const outputPath = 'scripts/col_payment_output.html';

let markdown = fs.readFileSync(sourcePath, 'utf-8');

// Helper to wrap content in HTML structure
let html = markdown;

// 1. Remove Top Metadata
const tlDrStart = html.indexOf('## TL;DR — At-a-Glance Summary');
html = html.substring(tlDrStart);

// 2. TL;DR Grid
// Format:
// ## TL;DR — At-a-Glance Summary
// Bottom Line: ...
// Key Actions: ...
// [Back to Homepage](/)

const bodyStart = html.indexOf('[Back to Homepage](/)\n\n');
const tlDrBlock = html.substring(0, bodyStart);
html = html.substring(bodyStart + '[Back to Homepage](/)\n\n'.length);

// Extract content
const bottomLine = tlDrBlock.match(/Bottom Line: (.*)/)?.[1] || '';
const keyActions = tlDrBlock.match(/Key Actions: (.*)/)?.[1] || '';

// Build TL;DR Grid HTML
let tlDrHtml = `
<div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 mb-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-4">TL;DR — At-a-Glance Summary</h2>
    <p class="text-gray-700 font-medium mb-4">${bottomLine}</p>
    ${keyActions ? `<div class="bg-white p-4 rounded-lg border border-blue-100"><strong class="text-blue-800">Key Actions:</strong> <span class="text-gray-700">${keyActions}</span></div>` : ''}
</div>
`;

// Prepend TL;DR
html = tlDrHtml + html;

// 3. Headings
html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

// 4. Payment Dates & Timeline
// Section: "## Payment Dates & Timeline"
// Content:
// Qualifying Date
// Must be claiming on this date
// 26 September 2026
// ...
// This looks like implicit groups of 3 lines.
// We can find this section and format it manually.

const timelineHeader = '<h2>Payment Dates & Timeline</h2>';
const timelineIndex = html.indexOf(timelineHeader);

if (timelineIndex !== -1) {
    const nextHeader = '<h2>Application Process: What You Need to Do</h2>'; // Next section
    const nextHeaderIndex = html.indexOf(nextHeader);

    // Extract the timeline section content
    const fullTimelineSection = html.substring(timelineIndex, nextHeaderIndex !== -1 ? nextHeaderIndex : undefined);

    // We want to keep the header but format the content
    // The content starts after "### September 2026 Payment Schedule"
    const scheduleHeader = '<h3>September 2026 Payment Schedule</h3>';
    const scheduleIndex = fullTimelineSection.indexOf(scheduleHeader);

    if (scheduleIndex !== -1) {
        const scheduleContent = fullTimelineSection.substring(scheduleIndex + scheduleHeader.length).trim();

        // Parse the lines
        const lines = scheduleContent.split('\n').map(l => l.trim()).filter(l => l);

        // Groups of 3: Title, Subtitle, Date
        let timelineHtml = `<div class="my-8 space-y-4">`;

        for (let i = 0; i < lines.length; i += 3) {
            if (i + 2 < lines.length) {
                const title = lines[i];
                const subtitle = lines[i + 1];
                const date = lines[i + 2];

                timelineHtml += `
            <div class="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div>
                    <h4 class="font-bold text-lg text-gray-800">${title}</h4>
                    <p class="text-gray-600 text-sm">${subtitle}</p>
                </div>
                <div class="mt-2 md:mt-0 bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-md text-center">
                    ${date}
                </div>
            </div>`;
            }
        }
        timelineHtml += `</div>`;

        // Replace in original html
        html = html.replace(scheduleContent, timelineHtml);
    }
}

// 5. Quick Eligibility Checker
// Section: "## Quick Eligibility Checker"
// Step 1: ...
// Step 2: ...
// Step 3: ...
// These steps are distinct blocks.
// We can wrap them in a styled list or steps container.

// 6. Lists
html = html.replace(/^[•] [•]? (.*$)/gm, '<li>$1</li>');
// Checkmarks
html = html.replace(/^✓ (.*$)/gm, '<li class="marker:content-[\'✓\'] marker:text-green-500 pl-2">$1</li>');

// Wrap <li> in <ul>
html = html.split('\n').reduce((acc, line) => {
    if (line.trim().startsWith('<li')) {
        if (!acc.inList) {
            acc.text += '<ul class="list-disc pl-5 mb-4 space-y-2 text-gray-700">\n';
            acc.inList = true;
        }
        acc.text += line + '\n';
    } else {
        if (acc.inList) {
            acc.text += '</ul>\n';
            acc.inList = false;
        }
        acc.text += line + '\n';
    }
    return acc;
}, { text: '', inList: false }).text;

// 7. FAQs
const faqHeader = '<h2>Frequently Asked Questions</h2>';
const faqIndex = html.indexOf(faqHeader);

if (faqIndex !== -1) {
    const beforeFaq = html.substring(0, faqIndex + faqHeader.length);
    let afterFaq = html.substring(faqIndex + faqHeader.length);

    // Split by <h3>
    const parts = afterFaq.split('<h3>');
    let processedFaqs = parts[0];

    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        const endHeader = part.indexOf('</h3>');
        const title = part.substring(0, endHeader).trim();
        let content = part.substring(endHeader + 5).trim();

        if (title.startsWith('Official Resources') || title.startsWith('Stay Updated')) {
            // Handle these separate sections at the end
            if (title.startsWith('Official Resources')) {
                processedFaqs += `<h3>${title}</h3>\n${content}\n\n`;
            } else if (title.startsWith('Stay Updated')) {
                processedFaqs += `<h3>${title}</h3>\n${content}\n\n`;
            }
            continue;
        }

        const detailsBlock = `
<details class="group mb-4">
<summary class="flex justify-between items-center font-bold cursor-pointer bg-gray-50 p-4 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors">
    <span>${title}</span>
    <span class="text-blue-600 transition-transform group-open:rotate-180">▼</span>
</summary>
<div class="p-4 text-gray-700 bg-white border border-t-0 border-gray-100 rounded-b-lg">
${content}
</div>
</details>`;
        processedFaqs += detailsBlock + '\n\n';
    }

    html = beforeFaq + '\n\n' + processedFaqs;
}

// 8. Subscribe Button
html = html.replace(/<p>Subscribe to Money Updates<\/p>/, '<button class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors my-6 shadow-lg">Subscribe to Money Updates</button>');

// 9. Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">$1</a>');

// 10. Paragraphs
const blocks = html.split(/\n\n+/);
const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.match(/^<(h\d|ul|li|div|p|details|summary|button|table|thead|tbody|tr|td|a)/)) {
        return trimmed;
    }

    // Check for "Step X" blocks in Eligibility Checker
    if (trimmed.startsWith('Step ')) {
        return `<div class="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500 mb-4 font-medium text-gray-800">${trimmed}</div>`;
    }

    return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmed}</p>`;
});
html = processedBlocks.join('\n\n');

// 11. Cleanups
html = html.replace(/<p>\s*<\/p>/g, '');
html = html.replace(/---END OF ARTICLE---/, '');

fs.writeFileSync(outputPath, html);
console.log(`Written to ${outputPath}`);
