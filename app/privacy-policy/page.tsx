import { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Smug Saver',
  description: 'Our privacy policy explains how we collect, use, and protect your personal data in accordance with UK GDPR and the Data Protection Act 2018.',
  alternates: {
    canonical: 'https://www.thesmugsaver.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    url: 'https://www.thesmugsaver.com/privacy-policy',
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-teal-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: 21 February 2026</p>

        <div className="prose prose-lg prose-teal max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">1. Introduction and Who We Are</h2>
            <p>
              Welcome to The Smug Saver (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit <strong>www.thesmugsaver.com</strong>.
            </p>
            <p>
              The Smug Saver is the data controller responsible for your personal data. For all data-related enquiries, please contact us at: <a href="mailto:hello@thesmugsaver.com" className="text-teal-700 underline">hello@thesmugsaver.com</a>.
            </p>
            <p>
              This policy is written in accordance with the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>. If you are located in the European Economic Area (EEA), the EU GDPR also applies to our processing of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">2. What Personal Data We Collect</h2>
            <p>We may collect and process the following categories of personal data:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Email address</strong> — if you submit our email sign-up form to receive money-saving content.</li>
              <li><strong>Usage data</strong> — including IP address (anonymised), browser type, operating system, pages visited, time spent on pages, referring URLs, and other diagnostic data collected automatically through analytics tools.</li>
              <li><strong>Cookie data</strong> — technical and analytics data stored via cookies and similar technologies. See our Cookie Policy for full details.</li>
              <li><strong>Communications data</strong> — any information you provide if you contact us directly by email.</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> collect sensitive personal data (e.g. health, financial account, biometric, or racial/ethnic data) and we do not knowingly collect data from children under the age of 13.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">3. How We Collect Your Data</h2>
            <p>We collect data in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Directly from you</strong> — when you submit your email address via our sign-up form or contact us by email.</li>
              <li><strong>Automatically</strong> — when you visit our website, we automatically collect usage and cookie data via analytics tools (e.g. Google Analytics or similar).</li>
              <li><strong>Third parties</strong> — we may receive anonymised traffic or behavioural data from advertising networks or analytics providers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">4. Legal Basis for Processing</h2>
            <p>Under UK GDPR, we rely on the following legal bases to process your personal data:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Consent (Article 6(1)(a))</strong> — where you have opted in to receive emails from us or accepted non-essential cookies. You may withdraw consent at any time.</li>
              <li><strong>Legitimate interests (Article 6(1)(f))</strong> — for analytics and website improvement, provided your rights and interests do not override ours. We conduct a Legitimate Interests Assessment (LIA) before relying on this basis.</li>
              <li><strong>Legal obligation (Article 6(1)(c))</strong> — where processing is necessary to comply with a legal or regulatory obligation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">5. How We Use Your Data</h2>
            <p>We use the personal data we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Send you money-saving tips, budgeting guides, and financial content by email (if you have subscribed).</li>
              <li>Analyse website traffic and user behaviour to improve our content and user experience.</li>
              <li>Ensure the technical security and performance of the website.</li>
              <li>Respond to enquiries or requests you send to us.</li>
              <li>Comply with applicable legal and regulatory requirements.</li>
              <li>Detect and prevent fraudulent, abusive, or unlawful use of the website.</li>
            </ul>
            <p className="mt-3">We will <strong>never sell, rent, or trade</strong> your personal data to third parties for their own marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">6. Data Sharing and Third Parties</h2>
            <p>We may share your personal data with trusted third-party service providers who assist us in operating the website and delivering our services, including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Netlify</strong> (hosting and form data collection) — our website is hosted on Netlify. Form submissions (including email addresses) are processed and stored by Netlify in accordance with their privacy policy.</li>
              <li><strong>Analytics providers</strong> — such as Google Analytics, to help us understand how users interact with our site. Analytics data is anonymised wherever possible.</li>
              <li><strong>Email service providers</strong> — if we use a third-party tool to send marketing emails, your email address will be shared with that provider solely for that purpose.</li>
            </ul>
            <p className="mt-3">All third-party processors are bound by data processing agreements and are required to handle your data in accordance with UK GDPR. Where data is transferred outside the UK or EEA, we ensure appropriate safeguards are in place (e.g. Standard Contractual Clauses, UK adequacy decisions).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">7. Data Retention</h2>
            <p>We retain your personal data only for as long as necessary for the purposes it was collected:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Email subscribers</strong> — we retain your email address until you unsubscribe or request deletion. We review our subscriber list annually and remove inactive subscribers.</li>
              <li><strong>Analytics data</strong> — typically retained for up to 26 months in aggregated or anonymised form.</li>
              <li><strong>Communication data</strong> — emails and enquiries are retained for up to 2 years, then securely deleted.</li>
            </ul>
            <p className="mt-3">When data is no longer needed, it is securely deleted or anonymised.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">8. Your Rights Under UK GDPR</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Right of access</strong> — you may request a copy of the personal data we hold about you (Subject Access Request).</li>
              <li><strong>Right to rectification</strong> — you may ask us to correct inaccurate or incomplete data.</li>
              <li><strong>Right to erasure</strong> (&quot;right to be forgotten&quot;) — you may ask us to delete your personal data in certain circumstances.</li>
              <li><strong>Right to restrict processing</strong> — you may ask us to stop processing your data in certain circumstances.</li>
              <li><strong>Right to data portability</strong> — you may request a copy of your data in a structured, machine-readable format.</li>
              <li><strong>Right to object</strong> — you may object to processing based on legitimate interests or for direct marketing purposes.</li>
              <li><strong>Rights related to automated decision-making</strong> — we do not carry out solely automated decision-making with legal or significant effects.</li>
              <li><strong>Right to withdraw consent</strong> — where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us at <a href="mailto:hello@thesmugsaver.com" className="text-teal-700 underline">hello@thesmugsaver.com</a>. We will respond within <strong>30 days</strong>. There is no charge for exercising your rights in most circumstances.</p>
            <p className="mt-3">You also have the right to lodge a complaint with the <strong>Information Commissioner's Office (ICO)</strong> at <a href="https://ico.org.uk" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a> or by calling 0303 123 1113.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">9. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience and gather analytics. Please refer to our <a href="/cookie-policy" className="text-teal-700 underline">Cookie Policy</a> for full details of the cookies we use, why we use them, and how you can manage your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">10. Data Security</h2>
            <p>
              We take the security of your personal data seriously. We implement appropriate technical and organisational measures to protect your data against unauthorised access, accidental loss, destruction, or disclosure. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>HTTPS encryption on all pages of the website.</li>
              <li>Access controls limiting who can view collected form data.</li>
              <li>Regular review of our data handling practices.</li>
              <li>Use of reputable, compliant third-party processors (Netlify, etc.).</li>
            </ul>
            <p className="mt-3">Despite these measures, no transmission of data over the internet is 100% secure. If you believe your data has been compromised, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">11. Links to Third-Party Websites</h2>
            <p>
              Our website may contain links to external websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party website you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or services. Any updates will be posted on this page with a revised &quot;Last Updated&quot; date. Where changes are significant, we will take reasonable steps to notify affected users (e.g. via email to subscribers). Your continued use of the website following any update constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">13. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <p className="mt-3">
              <strong>Email:</strong> <a href="mailto:hello@thesmugsaver.com" className="text-teal-700 underline">hello@thesmugsaver.com</a><br />
              <strong>Website:</strong> <a href="https://www.thesmugsaver.com" className="text-teal-700 underline">www.thesmugsaver.com</a>
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
