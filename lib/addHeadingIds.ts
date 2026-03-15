/**
 * Injects stable, slug-based `id` attributes into every <h2> and <h3> tag
 * in an HTML string. IDs are derived from the heading text content so they
 * are human-readable and stable across rebuilds.
 *
 * Runs server-side (called from page.tsx) so the IDs are present in the
 * initial HTML delivered to the browser and to Googlebot — no JS required.
 */

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/<[^>]+>/g, '')          // strip inner HTML tags
        .replace(/[^a-z0-9\s-]/g, '')     // remove special characters
        .trim()
        .replace(/\s+/g, '-')             // spaces → hyphens
        .replace(/-{2,}/g, '-')           // collapse multiple hyphens
        .slice(0, 80);                    // cap length
}

export function addHeadingIds(html: string): string {
    const used = new Map<string, number>();

    return html.replace(
        /<(h[23])(\s[^>]*)?>([^<]*(?:<(?!\/h[23]>)[^>]*>[^<]*)*)<\/h[23]>/gi,
        (match, tag, attrs = '', inner) => {
            // Skip if already has an id
            if (/\bid\s*=/i.test(attrs)) return match;

            let base = slugify(inner);
            if (!base) return match;

            // Deduplicate
            const count = used.get(base) ?? 0;
            used.set(base, count + 1);
            const id = count === 0 ? base : `${base}-${count}`;

            return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
        }
    );
}
