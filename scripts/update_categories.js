import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesPath = path.join(__dirname, '../lib/articles.ts');
let content = fs.readFileSync(articlesPath, 'utf8');

const CATEGORY_MAPPING = {
    'budgeting': [
        'good-budgeting-techniques-2026',
        'cash-envelope-vs-digital-pots-uk-2026',
        'money-manager-tools',
        'flexible-budgets-irregular-income-uk-2026',
        'break-paycheck-cycle-2026',
        'automate-savings-2026',
        'best-budgeting-money-apps-uk-2026',
        'budget-rule-article'
    ],
    'savings-and-investing': [
        'uk-bank-account-hacks-2026',
        'lock-in-48-percent-bonds-vs-savings-2026',
        'best-high-yield-savings-uk-2026',
        'warren-buffett-etf-500-to-1m',
        'top-savings-accounts-beating-inflation-uk-2026',
        'how-to-save-100k-in-8-years'
    ],
    'energy-bills': [
        'how-to-negotiate-bills-uk-2026',
        'energy-bills-rising-october-2026',
        'uk-household-bills-2026'
    ],
    'broadband-and-subscriptions': [
        'switch-broadband-mobile-tv-uk-2026',
        'streaming-subscriptions-audit-uk-2026'
    ],
    'earning-and-benefits': [
        'student-finance-survival-uk-2026',
        'tax-free-side-hustles-uk-2026',
        'student-loan-repayment-uk-2026',
        'uk-budget-2026-rachel-reeves-autumn-statement',
        'open-banking-uk-2026-impact',
        'employer-ni-changes-uk-2026',
        'cost-of-living-payment-2026-dwp-support'
    ],
    'cost-of-living': [
        'cost-of-living-2026',
        'cost-of-living-uk-2026-survival-guide',
        'saving-tips-news-guide-2026'
    ],
    'supermarket-savings': [
        'food-inflation-2026-smart-shopping',
        'grocery-savings-2026',
        'us-families-fight-inflation-2026-smart-shopping',
        'beat-food-price-hikes-uk-2026',
        'christmas-super-savings-2026-supermarkets-ranked',
        'food-crisis-navigating-snap-cuts-2026'
    ],
    'credit-cards-and-debt': [
        'conquer-your-debt-2026',
        'bnpl-vs-credit-cards-uk-2026'
    ],
    'housing': [
        'first-time-home-buyer-schemes-uk-2026',
        'rent-buy-stay-put-uk-2026',
        'mortgage-rates-2026-fix-or-wait'
    ],
    'insurance': [
        'premium-vs-budget-insurance-uk-2026',
        'car-trading-selling-uk-2026'
    ],
    'family-and-lifestyle': [
        'travel-deals-cheap-holidays-uk-2026',
        'back-to-school-costs-uk-2026',
        'childcare-costs-uk-2026',
        'travel-deals-worldwide-2026'
    ]
};

// Create a reverse mapping for easy lookup
const articleToCategory = {};
for (const [category, articles] of Object.entries(CATEGORY_MAPPING)) {
    articles.forEach(slug => {
        articleToCategory[slug] = category;
    });
}

// We rely on the imports in lib/articles.ts. 
// The file imports article objects and then exports an `articles` array.
// Example content:
// import { article1 } from './articles/article1';
// ...
// export const articles: Article[] = [
//   article1,
//   ...
// ];

// However, the category property is defined INSIDE the individual article files.
// So we need to update the individual files in lib/articles/*.ts

const articlesDir = path.join(__dirname, '../lib/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');

    // Find slug
    const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
    if (!slugMatch) return;

    const slug = slugMatch[1];
    const newCategory = articleToCategory[slug];

    if (newCategory) {
        // Replace category
        // Regex for category: 'some-category'
        const categoryRegex = /category:\s*['"][^'"]*['"]/;
        if (categoryRegex.test(content)) {
            const newContent = content.replace(categoryRegex, `category: '${newCategory}'`);
            if (newContent !== content) {
                fs.writeFileSync(path.join(articlesDir, file), newContent);
                console.log(`Updated ${slug} to category: ${newCategory}`);
            }
        } else {
            console.warn(`Could not find category property in ${file}`);
        }
    } else {
        // Article not in our mapping?
        // User provided a mapping for 46 articles. If we have more, we should warn.
        console.warn(`Article ${slug} not in new mapping!`);
    }
});
