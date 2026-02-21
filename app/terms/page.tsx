import { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';

export const metadata: Metadata = {
  title: 'Terms & Conditions | The Smug Saver',
  description: 'Read the Terms & Conditions governing your use of The Smug Saver website.',
  alternates: {
    canonical: 'https://www.thesmugsaver.com/terms',
  },
};

export default function TermsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms & Conditions',
    url: 'https://www.thesmugsaver.com/terms',
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-teal-900 mb-4">Terms &amp; Conditions</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: 21 February 2026</p>

        <div className="prose prose-lg prose-teal max-w-none space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using <strong>www.thesmugsaver.com</strong> (the &quot;Website&quot;), you confirm that you have read, understood, and agree to be bound by these Terms &amp; Conditions (&quot;Terms&quot;) and our <a href="/privacy-policy" className="text-teal-700 underline">Privacy Policy</a> and <a href="/cookie-policy" className="text-teal-700 underline">Cookie Policy</a>, which are incorporated herein by reference.
            </p>
            <p>
              If you do not agree to these Terms, you must cease using the Website immediately. We reserve the right to amend these Terms at any time. The &quot;Last Updated&quot; date above will reflect any changes. Your continued use of the Website after changes are posted constitutes your acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">2. About The Smug Saver</h2>
            <p>
              The Smug Saver is an independent UK money-saving and personal finance information website. We produce editorial content including articles, guides, tips, and commentary on financial topics for general informational purposes only. We are <strong>not</strong> a regulated financial services firm.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">3. No Financial Advice Disclaimer</h2>
            <p>
              <strong>Nothing on this Website constitutes financial advice.</strong> All content is provided for general information and educational purposes only. The Smug Saver is not authorised or regulated by the Financial Conduct Authority (FCA) or any other financial regulatory body.
            </p>
            <p>
              Before making any financial decision — including but not limited to investments, mortgages, insurance, credit, pensions, or savings — you should seek independent advice from a qualified financial adviser authorised by the FCA. You can find a regulated adviser at <a href="https://register.fca.org.uk" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">register.fca.org.uk</a>.
            </p>
            <p>
              Whilst we take reasonable care to ensure the accuracy and currency of information published, financial products, interest rates, tax rules, and regulations change frequently. You should independently verify all information before relying on it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">4. Intellectual Property</h2>
            <p>
              All content on this Website — including but not limited to articles, guides, text, graphics, logos, images, and software — is the property of The Smug Saver or its content suppliers and is protected by UK and international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may access and read Website content for personal, non-commercial use only. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Copy, reproduce, republish, upload, post, transmit, or distribute any content without our prior written permission.</li>
              <li>Use any content for commercial purposes without an explicit licence from us.</li>
              <li>Modify, adapt, or create derivative works from our content.</li>
              <li>Scrape, data-mine, or systematically extract content from the Website.</li>
            </ul>
            <p className="mt-3">Requests for republication or licensing should be directed to <a href="mailto:hello@thesmugsaver.com" className="text-teal-700 underline">hello@thesmugsaver.com</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">5. User Conduct</h2>
            <p>When using the Website, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Use the Website for any unlawful purpose or in any way that violates applicable law.</li>
              <li>Attempt to gain unauthorised access to any part of the Website, its servers, or any connected systems.</li>
              <li>Transmit any harmful, offensive, defamatory, or disruptive material.</li>
              <li>Use automated tools (bots, scrapers, crawlers) to extract data from the Website without our consent.</li>
              <li>Interfere with or disrupt the Website&apos;s operation or the servers or networks connected to it.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">6. External Links and Third-Party Content</h2>
            <p>
              The Website may contain links to external third-party websites, products, or services. These links are provided for your convenience and information only. We have no control over, and accept no responsibility for, the content, privacy practices, or availability of any linked external sites.
            </p>
            <p>
              A link to a third-party website does not constitute endorsement of that website or any products or services it offers. We encourage you to read the terms and privacy policies of any external websites you visit.
            </p>
            <p>
              Some links on this Website may be affiliate links. This means we may earn a commission if you click through and make a purchase. This does not affect the price you pay and does not influence our editorial recommendations. We only link to products and services we believe may be of genuine interest or value to our readers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, The Smug Saver and its owners, editors, contributors, and affiliates shall not be liable for any:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Direct, indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Website or its content.</li>
              <li>Financial losses or decisions made on the basis of content published on this Website.</li>
              <li>Errors, omissions, interruptions, or inaccuracies in the content.</li>
              <li>Loss of data, profits, goodwill, or other intangible losses.</li>
            </ul>
            <p className="mt-3">
              Nothing in these Terms limits our liability for death or personal injury caused by our negligence, fraud, or fraudulent misrepresentation, or any other liability that cannot be excluded under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">8. Accuracy and Currency of Information</h2>
            <p>
              We strive to ensure all content is accurate, up to date, and well-researched. However, the personal finance landscape changes rapidly and we cannot guarantee that all information is current or error-free at the time you access it. We reserve the right to update, correct, or remove content at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">9. Email Communications</h2>
            <p>
              If you subscribe to our email list, you agree to receive periodic money-saving content from us. You may unsubscribe at any time by clicking the unsubscribe link in any email we send, or by contacting us at <a href="mailto:hello@thesmugsaver.com" className="text-teal-700 underline">hello@thesmugsaver.com</a>. Please see our <a href="/privacy-policy" className="text-teal-700 underline">Privacy Policy</a> for how we handle your email address.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">10. Availability of the Website</h2>
            <p>
              We aim to keep the Website available at all times but do not guarantee uninterrupted or error-free access. We reserve the right to suspend, withdraw, or restrict access to all or part of the Website for business, operational, or maintenance reasons, without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">11. Governing Law and Jurisdiction</h2>
            <p>
              These Terms and any disputes arising from or related to them shall be governed by and construed in accordance with the laws of <strong>England and Wales</strong>. You and we both agree to submit to the exclusive jurisdiction of the courts of England and Wales, unless you are a consumer resident in Scotland or Northern Ireland, in which case you may also bring proceedings in your local courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">12. Severability</h2>
            <p>
              If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-800 mb-3">13. Contact Us</h2>
            <p>
              For questions or concerns relating to these Terms, please contact us:
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
