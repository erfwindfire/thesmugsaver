'use client';

import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import TldrBox from './TldrBox';
import FaqAccordion from './FaqAccordion';
import DataTable from './DataTable';
import CalloutBox from './CalloutBox';
import StepProcess from './StepProcess';
import Checklist from './Checklist';
import ComparisonCards from './ComparisonCards';
import ResourceLinks from './ResourceLinks';
import Timeline from './Timeline';
import ContactCard from './ContactCard';
import ActionPlan from './ActionPlan';
import React from 'react';

interface ArticleContentProps {
    content: string;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
    let processedContent = content;

    // Debugging (will appear in footer or source)
    // console.log("ArticleContent processing...");

    // Debugging (will appear in footer or source)
    // console.log("ArticleContent processing...");

    const options = {
        replace: (domNode: DOMNode) => {
            if (domNode instanceof Element && domNode.name === 'h2') {
                const text = (domNode.children[0] as any)?.data;

                // 1. TL;DR Component Injection
                if (text && text.includes('TL;DR — At-a-Glance Summary')) {
                    // We need to capture the next sibling elements until the next H2 or end of section
                    // However, html-react-parser processes node by node. 
                    // A common strategy for "section replacement" in this context is tricky.
                    // ALTERNATIVE: The current article HTML structure likely has the summary text immediately following.
                    // Let's assume the user wants us to find specific "features" locally or we might need a pre-processing step
                    // if the content isn't grouped.

                    // Looking at the "Good Budgeting" article (which likely has this), it's probably:
                    // <h2>TL;DR...</h2>
                    // <p><strong>Bottom Line:</strong> ...</p>
                    // <p><strong>Key Actions:</strong></p>
                    // <ul>...</ul>

                    // Since `html-react-parser` visits nodes, we can't easily "look ahead" and consume siblings
                    // without a custom traverser or pre-grouping.

                    // FOR NOW: Let's implement a robust way. 
                    // We will hide the original H2.
                    // But we need the CONTENT. 

                    // STRATEGY ADJUSTMENT: 
                    // Instead of simple replacement, we might need to pre-process the HTML string 
                    // to group these sections into a custom <tldr-box> tag, then replace THAT.
                    return <></>; // Hiding the H2 for now while we test the pre-processor approach below.
                }
            }
        }
    };

    // 0. Pre-processing: Convert <p> with manual bullets/br to <ul>
    // Pattern: <p>• ...<br>• ...</p> or <p>• • ...<br>• • ...</p>
    // We regex replace these blocks into <ul><li>...</li></ul>

    // Regex for a line starting with a bullet/check/box
    // Bullets: •, -, –, —
    // Checks: ✓, ✅
    // Boxes: □, [ ]
    // We look for <p> content that starts with one of these (maybe after space)
    // AND contains <br> or <br/>

    // Simplistic approach: Find <p> tags, check content. 
    // Since regex replacement on full string is risky for nesting, and we want to change STRUCTURE.
    // Let's iterate matchAll on <p>...</p>

    const pTagRegex = /<p>(.*?)<\/p>/gs;
    let newContent = processedContent;

    // We use a temporary string to build replacements to avoid index issues if we replaced in-place during loop?
    // Actually, string.replace with callback is best.

    newContent = newContent.replace(pTagRegex, (match, innerText) => {
        // Check if innerText looks like a list.
        // It should have at least one <br> (or be a single item list?) usually <br>.
        // And lines should start with markers.

        // Split by <br> tags
        const lines = innerText.split(/<br\s*\/?>/i);

        // Check if majority of lines start with a marker
        let markerCount = 0;
        const cleanedLines = [];

        const markerRegex = /^(\s*[•\-–—]\s*[•\-–—]?|\s*[✓✅□]\s*|\s*\[[ x]\]|\s*\d+\.\s*)/;
        // extended to catch double bullets "• •" or "• ✓"
        const doubleMarkerRegex = /^(\s*[•\-–—]\s*)+([✓✅□]\s*|\[[ x]\]\s*)?/;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue; // skip empty lines

            if (line.match(doubleMarkerRegex)) {
                markerCount++;
                // Clean the line
                let cleanLine = line.replace(doubleMarkerRegex, '').trim();
                // If double marker regex missed "• ", try generic cleaner again just in case
                // cleanLine = cleanLine.replace(/^[\s•\-–—✓✅□\d\.]+(?:\s*\[[ x]\])?\s*/u, '').trim();
                cleanedLines.push(cleanLine);
            } else {
                cleanedLines.push(line);
            }
        }

        // Threshold: if > 50% lines had markers, convert to UL
        if (markerCount > 0 && markerCount >= lines.filter(l => l.trim().length > 0).length * 0.5) {
            const listItems = cleanedLines.map(l => `<li>${l}</li>`).join('');
            return `<ul>${listItems}</ul>`;
        }

        return match; // return original <p>
    });

    processedContent = newContent;

    // 1. TL;DR / Quick Takeaways Detection
    // We explicitly look for "Quick Takeaways" or "TL;DR" followed by a <p> with bullets OR a <ul>
    const tldrHeaderRegex = /<h2[^>]*>[\s\S]*?(?:TL;DR|Quick Takeaways)[\s\S]*?<\/h2>/g;
    let tldrMatch;

    // We use a loop or just find the first one (usually one per article)
    while ((tldrMatch = tldrHeaderRegex.exec(processedContent)) !== null) {
        const headerIndex = tldrMatch.index;
        const headerEnd = headerIndex + tldrMatch[0].length;

        // Check what follows: whitespace + <p> OR <ul>
        // We capture until the next H2 or component end
        const contentSlice = processedContent.slice(headerEnd);
        const nextH2 = contentSlice.search(/<h[234]/);
        const endIndex = nextH2 === -1 ? processedContent.length : headerEnd + nextH2;

        const sectionHtml = processedContent.slice(headerEnd, endIndex);

        const actions = [];
        const summaryText = tldrMatch[0].includes('Quick') ? "Quick Takeaways" : "Key Takeaways";

        // Strategy: Parse ANY list-like items (<li> or lines in <p> starting with bullets)

        // 1. Try <ul><li>...
        const ulMatches = [...sectionHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)];
        if (ulMatches.length > 0) {
            ulMatches.forEach(m => actions.push(cleanText(m[1])));
        } else {
            // 2. Try <p> with <br>
            // Extract text inside <p>...</p>
            const pMatch = sectionHtml.match(/<p>(.*?)<\/p>/s);
            if (pMatch) {
                const lines = pMatch[1].split(/(?:<br\s*\/?>|\n)/i);
                lines.forEach(line => {
                    if (line.trim().length > 0) {
                        const cleaned = cleanText(line);
                        // Check if it was a list item (had a marker). 
                        // If we are in "Quick Takeaways", almost lines are items.
                        if (cleaned) actions.push(cleaned);
                    }
                });
            }
        }

        if (actions.length > 0) {
            const actionsJson = JSON.stringify(actions).replace(/"/g, '&quot;');
            const replacementTag = `<div data-component="tldr" data-summary="${summaryText}" data-actions="${actionsJson}"></div>`;

            // Replace header + section
            processedContent = processedContent.slice(0, headerIndex) + replacementTag + processedContent.slice(endIndex);
            // Adjust regex index if needed, but since we modify str, we should break or restart. 
            // Usually 1 TLDR per article.
            break;
        }
    }

    // LIST CLEANER UTILITY
    function cleanText(text: string) {
        // Strip tags
        text = text.replace(/<[^>]*>/g, '');
        // Strip markers: bullets, checks, boxes, numbers, "Step X:"
        text = text.replace(/^(\s*[•\-–—]\s*)+([✓✅□]\s*|\[[ x]\]\s*)?/, '');
        text = text.replace(/^\d+\.\s*/, '');
        text = text.replace(/^Step\s*\d+:?\s*/i, '');
        return text.trim();
    }

    // 2. CHECKLIST COMPONENT DETECTION (Targeted)
    // Look for div with "Checklist" in header, then parse list
    // Example: <div class="..."><h4>...Checklist</h4><p>...</p></div>
    // OR just H4 "Checklist" followed by <p>

    // We'll traverse via regex for pattern: <h4>.*?Checklist.*?</h4> followed by <p> or <ul>
    const checklistRegex = /<h4[^>]*>(.*?[Cc]hecklist.*?)<\/h4>\s*(?:<p>([\s\S]*?)<\/p>|<ul>([\s\S]*?)<\/ul>)/g;

    processedContent = processedContent.replace(checklistRegex, (match, title, pContent, ulContent) => {
        const items = [];
        const rawContent = pContent || ulContent;

        if (pContent) {
            const lines = pContent.split(/<br\s*\/?>/i);
            lines.forEach(l => {
                const cleaned = cleanText(l);
                if (cleaned && (l.match(/[•\-–—✓✅□]/) || l.includes('input'))) items.push(cleaned);
            });
        } else if (ulContent) {
            const lis = [...ulContent.matchAll(/<li>(.*?)<\/li>/g)];
            lis.forEach(m => items.push(cleanText(m[1])));
        }

        if (items.length > 0) {
            const itemsJson = JSON.stringify(items).replace(/"/g, '&quot;');
            // We return the component marker
            // Note: match included H4 + Content. We replace all that.
            // We strip HTML from title for safety
            const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
            return `<div data-component="checklist" data-title="${cleanTitle}" data-items="${itemsJson}"></div>`;
        }
        return match;
    });

    // 2. FAQ Accordion Detection and Replacement
    // Pattern: <h3>Frequently Asked Questions</h3> followed by h4 (question) and p (answer) pairs
    // Or sometimes just "Frequently Asked Questions" H2/H3
    const faqHeaderRegex = /<(h[23])>Frequently Asked Questions<\/\1>/;
    const faqMatch = processedContent.match(faqHeaderRegex);

    if (faqMatch) {
        // We found the header. Now we need to grab the subsequent Q&A pairs.
        // Assuming structure: <h4>Question?</h4> <p>Answer</p> ...
        // We will extract everything from the header until the next H2 or end of string

        const headerIndex = faqMatch.index!;
        const headerLength = faqMatch[0].length;

        // Find next H2 to delimit section (or end of content)
        const nextH2Index = processedContent.indexOf('<h2', headerIndex + headerLength);
        const endIndex = nextH2Index === -1 ? processedContent.length : nextH2Index;

        const faqSectionHtml = processedContent.substring(headerIndex + headerLength, endIndex);

        // Parse Q&A pairs from this section
        // Pattern: <h4>Question</h4> <p>Answer</p>
        const qaPairs = [];
        const qaRegex = /<h4>(.*?)<\/h4>\s*<p>(.*?)<\/p>/gs;
        let qaMatch;

        while ((qaMatch = qaRegex.exec(faqSectionHtml)) !== null) {
            qaPairs.push({
                question: qaMatch[1],
                answer: qaMatch[2]
            });
        }

        if (qaPairs.length > 0) {
            const faqJson = JSON.stringify(qaPairs).replace(/"/g, '&quot;');
            const replacementTag = `<div data-component="faq" data-items="${faqJson}"></div>`;

            // Replace the entire section (Header + Q&A content) with the component marker
            // We construct the "to replace" string carefully
            const fullSectionToReplace = processedContent.substring(headerIndex, endIndex);

            // However, regex replacement on the substring is safer if we just standard replace the range
            processedContent = processedContent.slice(0, headerIndex) + replacementTag + processedContent.slice(endIndex);
        }
    }

    // 5. Step Process Detection
    // Pattern: H3/H4 starting with "Step X:" followed by content until next Step or H2/H3
    // We look for consecutive steps.

    const stepHeaderRegex = /<(h[34])>Step\s+\d+:/;
    // This is trickier to detect purely by node traversal in replace...
    // But we can check if the *current* node is a "Step 1" header.
    // If it is, we need to gather all subsequent steps.
    // Current `replace` iteration doesn't easily allow consuming siblings.

    // ALTERNATIVE: Pre-process steps like we did for FAQ.

    // Let's do that in the pre-processing section below `match` block.

    // 3. Step Process Reconstruction
    // Find sequences of <h3>Step 1:...</h3><p>...</p> <h3>Step 2:...</h3>...
    // Regex: ((?:<h[34]>Step\s+\d+:.*?<\/h[34]>[\s\S]*?)+)(?=<h[234]|$)
    // This is complex. Let's simplify.
    // Find "Step 1:" header. Then find "Step 2:" header. 

    // We will iterate through matchAll of "Step X:" headers and build groups.
    const stepRegex = /<(h[34])>(Step\s+\d+:.*?)(?::\s*(.*?))?<\/\1>/g;

    // Actually, we want to capture the content AFTER the header too.
    // Let's look for a block that *starts* with Step 1.

    // New strategy: If we encounter "Step 1:", we start a collection.
    // If we encounter "Step N:", we add to collection.
    // If we encounter something else (H2, or non-step H3/H4), we stop.

    // Implementation in `replace` is hard. 
    // Implementation in pre-processing string is better.

    // Let's find the FIRST step "Step 1:"
    const firstStepRegex = /<(h[34])>Step\s+1:/i;
    const stepMatch = processedContent.match(firstStepRegex);

    if (stepMatch) {
        // Found a Step 1. 
        const startIndex = stepMatch.index!;

        // Determine the tag type (h3 or h4) to know what level we are at
        const tag = stepMatch[1];

        // Now let's try to extract the whole sequence of steps. 
        // We assume steps are consecutive siblings in HTML (headings + paragraphs).

        // We will slice from Step 1 onwards and find where the sequence breaks.
        // A break is: A header of same or higher level that DOES NOT start with "Step \d+:"

        const contentFromStep1 = processedContent.substring(startIndex);

        // We split by standard headers to inspect them
        const headerSplitRegex = new RegExp(`(<${tag}>.*?</${tag}>)`, 'g');
        const segments = contentFromStep1.split(headerSplitRegex);

        const steps = [];
        let currentStepTitle = '';
        let currentStepContent = '';
        let lastIndexProcessed = 0;
        let bufferLength = 0;

        // The split consumes the headers.
        // segments[0] is empty (if starts with header)
        // segments[1] is Header 1
        // segments[2] is Content 1
        // segments[3] is Header 2 ...

        // We need to re-assemble carefully to find the replacement range in original string.
        // Easier check: regex for "Step \d+:"

        const stepTitleRegex = new RegExp(`^<${tag}>Step\\s+\\d+:\\s*(.*?)<\\/${tag}>$`);

        // We need to iterate the actual string to get positions.
        // Let's use a simpler approach: extract all consecutive steps.

        // Let's assume for now there is only ONE process flow per article or they are well separated.
        // We will capture ONE group of steps.

        // Loop to capture steps
        let cursor = startIndex;
        let validSteps = true;
        let stepCounter = 1;
        let collectedSteps = [];

        while (validSteps) {
            // Look for Step N
            const nextStepRegex = new RegExp(`<${tag}>Step\\s+${stepCounter}:\\s*(.*?)<\\/${tag}>`);
            const match = processedContent.slice(cursor).match(nextStepRegex);

            if (match && match.index !== undefined) {
                // We found the header.
                // Is it "immediate"? There might be content between Step 1 and Step 2.
                // But validSteps implies we are consuming the intervening content as "Description of Step N-1".

                // Wait, for Step 1, its description is AFTER it.
                // For Step 2, it is AFTER Step 1 breakdown.

                // So:
                // Find Step 1 Header.
                // Find Step 2 Header.
                // Content between is Step 1 Desc.

                // This logic requires finding NEXT step or End of Section.

                const headerFull = match[0];
                let title = match[1];
                const headerLocalIndex = match.index; // relative to cursor

                // If this is not the first step, the content before this header belongs to stats[n-1]
                if (stepCounter > 1) {
                    const content = processedContent.slice(cursor, cursor + headerLocalIndex);
                    collectedSteps[collectedSteps.length - 1].description = content;
                }

                // Clean title of potential double numbering, bullets, OR "Step X:" prefix
                // Regex: 
                // 1. Strip leading bullets/numbers: ^[\s•\-–—\d\.]+\s*
                // 2. Strip "Step X:" (case insensitive): ^Step\s*\d+:?\s*
                // We run them sequentially.

                title = title.replace(/^[\s•\-–—\d\.]+\s*/, '');
                title = title.replace(/^Step\s*\d+:?\s*/i, '');
                title = title.trim();

                // Start new step
                collectedSteps.push({ title, description: '' });

                // Advance cursor past this header
                cursor += headerLocalIndex + headerFull.length;
                stepCounter++;
            } else {
                // No more next step.
                // The content from cursor until Next H or End of Doc is the last description.
                // Find next header of any kind common in articles: h2, h3, h4
                const nextHeader = processedContent.slice(cursor).match(/<h[234]/);
                let endIndex = processedContent.length;
                if (nextHeader && nextHeader.index !== undefined) {
                    endIndex = cursor + nextHeader.index;
                }

                const content = processedContent.slice(cursor, endIndex);
                if (collectedSteps.length > 0) {
                    collectedSteps[collectedSteps.length - 1].description = content;
                }

                cursor = endIndex;
                validSteps = false;
            }
        }

        if (collectedSteps.length > 0) {
            const stepsJson = JSON.stringify(collectedSteps).replace(/"/g, '&quot;');
            const replacementTag = `<div data-component="steps" data-items="${stepsJson}"></div>`;

            processedContent = processedContent.slice(0, startIndex) + replacementTag + processedContent.slice(cursor);
        }
    }

    // 6. Comparison Detection
    // Pattern: <h3>Option A vs Option B</h3> detected. 
    // Content structure usually: 
    // <p><strong>Option A</strong></p> <ul>...</ul> <p><strong>Best for:</strong> ...</p>
    // <p><strong>Option B</strong></p> <ul>...</ul> <p><strong>Best for:</strong> ...</p>

    // As this is highly structure-dependent and complex to regex cleanly without more structure constants,
    // we will look for a simpler marker in the user's content strategy or enforce one.
    // Assuming standard "vs" header.

    const vsHeaderRegex = /<(h[234])>(.*?\s+vs\s+.*?)<\/\1>/i;
    const vsMatch = processedContent.match(vsHeaderRegex);

    if (vsMatch) {
        const headerIndex = vsMatch.index!;
        const headerLength = vsMatch[0].length;

        // Assume the Comparison section ends at the next H2 or end of doc
        const nextH2Index = processedContent.indexOf('<h2', headerIndex + headerLength);
        const endIndex = nextH2Index === -1 ? processedContent.length : nextH2Index;

        const sectionHtml = processedContent.substring(headerIndex + headerLength, endIndex);

        // We need to find two options. 
        // Look for H4 headers which likely denote the options
        const optionHeaders = [...sectionHtml.matchAll(/<h4.*?>(.*?)<\/h4>/g)];

        if (optionHeaders.length >= 2) {
            const options = [];

            for (let i = 0; i < 2; i++) {
                const header = optionHeaders[i];
                const name = header[1];
                const startIndex = header.index! + header[0].length;

                // End index is start of next header or end of section
                const nextHeaderIndex = (i === 0) ? optionHeaders[1].index! : sectionHtml.length;
                const content = sectionHtml.substring(startIndex, nextHeaderIndex);

                // Extract features from UL
                const features = [];
                const ulMatch = content.match(/<ul>(.*?)<\/ul>/s);
                if (ulMatch) {
                    const lis = ulMatch[1].matchAll(/<li>(.*?)<\/li>/g);
                    for (const li of lis) {
                        features.push(li[1]);
                    }
                }

                // Extract "Best For"
                // Pattern: Best for: ...
                let bestFor = '';
                const bestForMatch = content.match(/Best for:\s*<\/strong>\s*(.*?)<\/p>/) || content.match(/Best for:\s*(.*?)<\/p>/);
                if (bestForMatch) {
                    bestFor = bestForMatch[1];
                }

                options.push({
                    name,
                    features,
                    bestFor,
                    isRecommended: i === 0 // Logic to determine winner? For now assume first is winner if not specified.
                    // Or maybe look for "Winner" text?
                });
            }

            // Refine Winner Logic: Check if one has "Winner" in the name or content
            const winnerIndex = options.findIndex(o => o.name.toLowerCase().includes('winner') || o.features.some(f => f.toLowerCase().includes('winner')));
            if (winnerIndex !== -1) {
                options.forEach((o, idx) => o.isRecommended = idx === winnerIndex);
            }

            const optionsJson = JSON.stringify(options).replace(/"/g, '&quot;');
            const replacementTag = `<div data-component="comparison" data-items="${optionsJson}"></div>`;

            processedContent = processedContent.slice(0, headerIndex) + replacementTag + processedContent.slice(endIndex);
        }
    }

    // 7. Resource Links Detection
    // Pattern: <h3>Recommended Resources</h3> or similar. 
    // Followed by UL with Links. 

    // We can reuse the structure detection similar to Comparison or just regex replace
    // specific headers + lists if they are marked.

    // Common header: "Resources", "Further Reading", "Useful Links"
    const resourceHeaderRegex = /<(h[34])>(?:Recommended Resources|Further Reading|Useful Links)<\/\1>/i;
    const resourceMatch = processedContent.match(resourceHeaderRegex);

    if (resourceMatch) {
        const headerIndex = resourceMatch.index!;
        const headerLength = resourceMatch[0].length;

        // Find end (next header or end of doc)
        const nextHeaderMatch = processedContent.slice(headerIndex + headerLength).match(/<h[234]/);
        const endIndex = nextHeaderMatch && nextHeaderMatch.index !== undefined
            ? headerIndex + headerLength + nextHeaderMatch.index
            : processedContent.length;

        const sectionHtml = processedContent.substring(headerIndex + headerLength, endIndex);

        // Extract Links from UL/LI/A
        // Pattern: <li><a href="...">Title</a> ...desc... </li>

        const links = [];
        const linkRegex = /<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>(.*?)<\/li>/gis;
        // Note: Parsing HTML with regex is brittle. 
        // But we are targeting specific markdown-generated structures.

        const lis = sectionHtml.matchAll(/<li>(.*?)<\/li>/gis);

        for (const li of lis) {
            const liContent = li[1];
            const aMatch = liContent.match(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>(.*)/s);

            if (aMatch) {
                const url = aMatch[1];
                const title = aMatch[2].replace(/<[^>]+>/g, ''); // strip tags from title
                const description = aMatch[3].replace(/^[-\s:–—]+/, '').replace(/<[^>]+>/g, '').trim();

                links.push({ title, url, description });
            }
        }

        if (links.length > 0) {
            const linksJson = JSON.stringify(links).replace(/"/g, '&quot;');
            const title = resourceMatch[0].replace(/<[^>]+>/g, '');
            const replacementTag = `<div data-component="resources" data-title="${title}" data-items="${linksJson}"></div>`;

            processedContent = processedContent.slice(0, headerIndex) + replacementTag + processedContent.slice(endIndex);
        }
    }

    // 8. Timeline Detection
    // Pattern: <h3>Timeline</h3> or "History" etc.
    // Structure: <h4>Date: Title</h4> <p>Desc</p> 
    // OR <strong>Date</strong>: Title ...

    // Let's assume a structure similar to FAQ/Steps:
    // Header: Timeline ...
    // Items: 
    // <p><strong>2024:</strong> Event description...</p>
    // OR
    // <h4>2024</h4> <p>Desc</p>

    // We'll target the pattern: H3 "Timeline", followed by bold dates or H4 dates.

    const timelineHeaderRegex = /<(h[34])>.*?(?:Timeline|Schedule|Key Dates).*?<\/\1>/i;
    const timelineMatch = processedContent.match(timelineHeaderRegex);

    if (timelineMatch) {
        const headerIndex = timelineMatch.index!;
        const headerLength = timelineMatch[0].length;

        const nextHeaderMatch = processedContent.slice(headerIndex + headerLength).match(/<h[23]/);
        const endIndex = nextHeaderMatch && nextHeaderMatch.index !== undefined
            ? headerIndex + headerLength + nextHeaderMatch.index
            : processedContent.length;

        const sectionHtml = processedContent.substring(headerIndex + headerLength, endIndex);

        const items = [];

        // Try to parse items. 
        // Pattern 1: <p><strong>Date:</strong> Title - Desc</p>
        // Pattern 2: <h4>Date</h4> <p>Desc</p>

        // Let's look for Pattern 2 first as it's cleaner.
        const itemsV2 = sectionHtml.matchAll(/<h4>(.*?)<\/h4>\s*<p>(.*?)<\/p>/gs);
        for (const match of itemsV2) {
            items.push({
                date: match[1], // Assuming H4 is the date/title
                title: '',
                description: match[2]
            });
        }

        // If V2 didn't find much, try matching "Date: Title" pattern in paragraphs
        if (items.length === 0) {
            const itemsV1 = sectionHtml.matchAll(/<p><strong>(.*?):?<\/strong>\s*(.*?)<\/p>/g);
            for (const match of itemsV1) {
                items.push({
                    date: match[1],
                    title: '', // In this format, title might be part of desc or date
                    description: match[2]
                });
            }
        }

        if (items.length > 0) {
            const itemsJson = JSON.stringify(items).replace(/"/g, '&quot;');
            const replacementTag = `<div data-component="timeline" data-items="${itemsJson}"></div>`;

            processedContent = processedContent.slice(0, headerIndex) + replacementTag + processedContent.slice(endIndex);
        }
    }

    // 9. Contact Card Detection
    // Pattern: <h3>Contact ...</h3> or "Author"
    // Structure: Name, Role, and list of Email, Phone, Website.

    // Simplistic detection:
    // H3: Contact [Name]
    // or just H3: Contact Us
    // followed by textual contact info.

    // Regex for specific contact section
    const contactHeaderRegex = /<(h[34])>(?:Contact|Get in Touch|Author).*?<\/\1>/i;
    const contactMatch = processedContent.match(contactHeaderRegex);

    if (contactMatch) {
        const headerIndex = contactMatch.index!;
        const headerLength = contactMatch[0].length;

        const nextHeaderMatch = processedContent.slice(headerIndex + headerLength).match(/<h[23]/);
        const endIndex = nextHeaderMatch && nextHeaderMatch.index !== undefined
            ? headerIndex + headerLength + nextHeaderMatch.index
            : processedContent.length;

        const sectionHtml = processedContent.substring(headerIndex + headerLength, endIndex);

        // Extract info
        // Name might be in the header or first paragraph
        let name = "Expert";
        let role = "Contributor";
        let email, phone, website, address;

        // Try to find email
        const emailMatch = sectionHtml.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
        if (emailMatch) email = emailMatch[1];

        // Try to find phone (basic UK/Intl regex)
        const phoneMatch = sectionHtml.match(/(\+?\d[\d\s-]{8,})/);
        if (phoneMatch && phoneMatch[1].length < 20) phone = phoneMatch[1].trim(); // sanity check length

        // Website
        const webMatch = sectionHtml.match(/https?:\/\/[^\s"<]+/);
        if (webMatch) website = webMatch[0];

        // Name/Role from header (if "Contact [Name]")
        const headerText = contactMatch[0].replace(/<[^>]+>/g, '');
        if (headerText.includes('Contact ') && headerText.length > 8) {
            name = headerText.replace('Contact ', '').trim();
        }

        if (email || phone || website) {
            const itemsJson = JSON.stringify({ name, role, email, phone, website, address }).replace(/"/g, '&quot;');
            const replacementTag = `<div data-component="contact" data-items="${itemsJson}"></div>`;

            processedContent = processedContent.slice(0, headerIndex) + replacementTag + processedContent.slice(endIndex);
        }
    }

    // 10. Action Plan Detection
    // Pattern: <h3>Action Plan</h3> or "Your Next Steps"
    // Followed by numbered list or detailed steps.

    const actionHeaderRegex = /<(h[34])>(?:Action Plan|Your Next Steps|Key Takeaways).*?<\/\1>/i;
    const actionMatch = processedContent.match(actionHeaderRegex);

    if (actionMatch) {
        const headerIndex = actionMatch.index!;
        const headerLength = actionMatch[0].length;

        const nextHeaderMatch = processedContent.slice(headerIndex + headerLength).match(/<h[23]/);
        const endIndex = nextHeaderMatch && nextHeaderMatch.index !== undefined
            ? headerIndex + headerLength + nextHeaderMatch.index
            : processedContent.length;

        const sectionHtml = processedContent.substring(headerIndex + headerLength, endIndex);

        const items = [];

        // Parse list items
        // 1. Check for OL/LI
        const olMatch = sectionHtml.match(/<ol>(.*?)<\/ol>/s);
        if (olMatch) {
            const lis = olMatch[1].matchAll(/<li>(.*?)<\/li>/gs);
            for (const li of lis) {
                // Try to split title and desc if bolded
                const content = li[1];
                const boldMatch = content.match(/<strong>(.*?)<\/strong>(.*)/s);
                if (boldMatch) {
                    items.push({
                        title: boldMatch[1].replace(/:$/, ''),
                        description: boldMatch[2].trim()
                    });
                } else {
                    items.push({
                        title: content.replace(/<[^>]+>/g, '').substring(0, 50) + (content.length > 50 ? '...' : ''),
                        description: content
                    });
                }
            }
        }

        // 2. Check for H4 + P structure
        if (items.length === 0) {
            const h4Matches = sectionHtml.matchAll(/<h4>(.*?)<\/h4>\s*<p>(.*?)<\/p>/gs);
            for (const m of h4Matches) {
                items.push({
                    title: m[1],
                    description: m[2]
                });
            }
        }

        if (items.length > 0) {
            const title = actionMatch[0].replace(/<[^>]+>/g, '');
            const itemsJson = JSON.stringify(items).replace(/"/g, '&quot;');
            const replacementTag = `<div data-component="action-plan" data-title="${title}" data-items="${itemsJson}"></div>`;

            processedContent = processedContent.slice(0, headerIndex) + replacementTag + processedContent.slice(endIndex);
        }
    }

    // 11. Checklist Detection (Existing Logic)
    // Pattern: UL where LIs start with ✓, □, ✅, [ ], [x]

    // 3. Data Table Detection and Replacement
    // Tables in markdown often come through as <table>...</table>
    // regex to capture full table
    const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/g;
    let tableMatch;

    // We need to loop because there might be multiple tables
    // IMPORTANT: Since we are modifying 'processedContent' inside the loop, 
    // regex indexes will be off if we use `exec` on the changing string.
    // Instead, we can use a placeholder strategy or matchAll on the initial string 
    // and then replace.

    // NOTE: html-react-parser handles <table> tags naturally. 
    // We can just INTERCEPT the <table> element in the replace function 
    // without string manipulation if the HTML structure is standard.
    // However, extracting headers and rows from the DOMNode is cleaner.

    // LET'S USE THE PARSER for this one, as it's structurally simple.
    // No string replacement needed for tables, we can just transform the node.

    const parseOptions = {
        replace: (domNode: DOMNode) => {
            const safeJsonParse = (str: string, fallback: any) => {
                try {
                    // Check if the string needs unescaping (if it was somehow double-escaped or parser behavior varied)
                    // The standard html-react-parser should have decoded entities in attribs.
                    // But our construction used &quot;, which decodes to " in the attribute value.
                    // However, if we blindly replace &quot; with ", we might be doing nothing if it's already ".
                    // Or if we need to handle specific edge cases. 
                    // Let's just try parsing.
                    return JSON.parse(str);
                } catch (e) {
                    // Fallback try: replace &quot; if appropriate (legacy logic)
                    try {
                        return JSON.parse(str.replace(/&quot;/g, '"'));
                    } catch (e2) {
                        console.error('JSON Parse Error:', e2, str);
                        return fallback;
                    }
                }
            };

            if (domNode instanceof Element && domNode.attribs) {
                if (domNode.attribs['data-component'] === 'tldr') {
                    const summary = domNode.attribs['data-summary'];
                    const actions = safeJsonParse(domNode.attribs['data-actions'], []);
                    return <TldrBox summary={summary} actions={actions} />;
                }
                if (domNode.attribs['data-component'] === 'faq') {
                    const items = safeJsonParse(domNode.attribs['data-items'], []);
                    return <FaqAccordion items={items} />;
                }
                if (domNode.attribs['data-component'] === 'steps') {
                    const items = safeJsonParse(domNode.attribs['data-items'], []);
                    return <StepProcess steps={items} />;
                }
                if (domNode.attribs['data-component'] === 'comparison') {
                    const items = safeJsonParse(domNode.attribs['data-items'], []);
                    return <ComparisonCards options={items} />;
                }
                if (domNode.attribs['data-component'] === 'resources') {
                    const title = domNode.attribs['data-title'];
                    const items = safeJsonParse(domNode.attribs['data-items'], []);
                    return <ResourceLinks title={title} links={items} />;
                }
                if (domNode.attribs['data-component'] === 'timeline') {
                    const items = safeJsonParse(domNode.attribs['data-items'], []);
                    return <Timeline items={items} />;
                }
                if (domNode.attribs['data-component'] === 'contact') {
                    const items = safeJsonParse(domNode.attribs['data-items'], {});
                    return <ContactCard {...items} />;
                }
                if (domNode.attribs['data-component'] === 'action-plan') {
                    const title = domNode.attribs['data-title'];
                    const items = safeJsonParse(domNode.attribs['data-items'], []);
                    return <ActionPlan title={title} items={items} />;
                }
            }

            // 4. Callout Box Detection
            // Logic: P tags starting with "Important:", "Warning:", "Good news:", "Tip:", "Pro tip:", "Note:"
            // We will intercept P tags and check their content
            if (domNode instanceof Element && domNode.name === 'p') {
                const text = (domNode.children[0] as any)?.data;
                if (text && typeof text === 'string') {
                    let type: any = null;
                    let title = '';
                    let content = text;

                    if (text.startsWith('Important:')) { type = 'important'; title = 'Important'; content = text.replace('Important:', '').trim(); }
                    else if (text.startsWith('Warning:')) { type = 'warning'; title = 'Warning'; content = text.replace('Warning:', '').trim(); }
                    else if (text.startsWith('Good news:')) { type = 'tip'; title = 'Good News'; content = text.replace('Good news:', '').trim(); }
                    else if (text.startsWith('Tip:')) { type = 'tip'; title = 'Tip'; content = text.replace('Tip:', '').trim(); }
                    else if (text.startsWith('Pro tip:')) { type = 'pro-tip'; title = 'Pro Tip'; content = text.replace('Pro tip:', '').trim(); }
                    else if (text.startsWith('Note:')) { type = 'note'; title = 'Note'; content = text.replace('Note:', '').trim(); }

                    if (type) {
                        // Clean content of emojis and extra prefixes
                        content = content.replace(/^[\s\p{Emoji}]+/u, '').trim();
                        return (
                            <CalloutBox type={type} title={title}>
                                {content}
                            </CalloutBox>
                        );
                    }
                }
            }

            // 6. Checklist Detection & List Item Cleaning
            // Pattern: UL where LIs start with ✓, □, ✅, [ ], [x]
            if (domNode instanceof Element && domNode.name === 'ul') {
                // Check children LIs
                const lis = domNode.children.filter(c => c instanceof Element && c.name === 'li') as Element[];
                if (lis.length > 0) {
                    const firstChild = lis[0].children[0];
                    const firstLiText = (firstChild && (firstChild as any).type === 'text') ? (firstChild as any).data : '';

                    if (firstLiText && typeof firstLiText === 'string') {
                        if (firstLiText.match(/^([✓✅□]|\s*\[[ x]\])/)) {
                            // It's a checklist!
                            const items: string[] = [];
                            lis.forEach(li => {
                                // Extract and clean text
                                let text = '';
                                const getText = (node: any): string => {
                                    if (node.type === 'text') return node.data;
                                    if (node.children) return node.children.map(getText).join('');
                                    return '';
                                };
                                text = getText(li);
                                // Clean up the marker
                                text = text.replace(/^([✓✅□]|\s*\[[ x]\])\s*/, '').trim();
                                items.push(text);
                            });

                            return <Checklist items={items} />;
                        }
                    }
                }
            }

            // General List Item Cleaning (for non-checklists)
            // Strip •, -, 1. from normal lists if they were hardcoded
            if (domNode instanceof Element && domNode.name === 'li') {
                const child = domNode.children[0];
                if (child && (child as any).type === 'text') {
                    const text = (child as any).data;
                    // Regex to match common markdown export artifacts: 
                    // • Item
                    // - Item
                    // 1. Item
                    // 1.1 Item
                    // AND double bullets "• ✓", "• •"
                    const cleanText = text.replace(/^(\s*[•\-–—]\s*)+([✓✅□]\s*|\[[ x]\]\s*)?/, '').replace(/^\d+\.\s*/, '');
                    if (cleanText !== text) {
                        (child as any).data = cleanText;
                    }
                }
            }

            // Table Replacement
            if (domNode instanceof Element && domNode.name === 'table') {
                const headers: string[] = [];
                const rows: string[][] = [];

                // We need to traverse the children to find thead and tbody
                // This is a bit manual with html-react-parser's DOMNode structure

                // Helper to get text from a node
                const getText = (node: any): string => {
                    if (node.type === 'text') return node.data;
                    if (node.children) return node.children.map(getText).join('');
                    return '';
                };

                const thead = domNode.children.find(c => c instanceof Element && c.name === 'thead') as Element;
                const tbody = domNode.children.find(c => c instanceof Element && c.name === 'tbody') as Element;

                if (thead) {
                    const tr = thead.children.find(c => c instanceof Element && c.name === 'tr') as Element;
                    if (tr) {
                        headers.push(...tr.children.filter(c => c instanceof Element && c.name === 'th').map(getText));
                    }
                }

                if (tbody) {
                    const trs = tbody.children.filter(c => c instanceof Element && c.name === 'tr') as Element[];
                    trs.forEach(tr => {
                        const row = tr.children.filter(c => c instanceof Element && c.name === 'td').map(getText);
                        rows.push(row);
                    });
                }

                if (headers.length > 0 && rows.length > 0) {
                    return <DataTable headers={headers} rows={rows} />;
                }
            }
        }
    };

    // FINAL CLEANUP of artifacts (Run AFTER components have extracted their data)
    // This ensures we don't break detection logic that relies on markers, but we clean up any remaining artifacts in the standard prose.
    processedContent = processedContent.replace(/(&bull;|&#8226;|•)\s*([✓✅□]|&check;|&#10003;)\s*/g, '');
    processedContent = processedContent.replace(/((&bull;|&#8226;|•)\s*){2,}([✓✅□]\s*)?/g, '');
    processedContent = processedContent.replace(/<p>\s*[•\-–—]\s*/g, '<p>');

    return <>{parse(processedContent, parseOptions)}</>;
};

export default ArticleContent;
