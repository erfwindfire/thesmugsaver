import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | The Smug Saver',
  description: 'Learn how The Smug Saver uses cookies, how long they are stored, and how to manage your cookie preferences in accordance with UK GDPR.',
  alternates: {
    canonical: 'https://www.thesmugsaver.com/cookie-policy',
  },
};

export default function CookiePolicy() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="text-teal-700 hover:underline mb-4 inline-block">
          &larr; Back to Homepage
        </Link>
        <h1 className="font-serif text-4xl font-bold text-teal-900 mb-4">Cookie Policy</h1>
        <p className="text-gray-600">Last Updated: 21 February 2026</p>
      </div>

      <div className="prose prose-lg max-w-none space-y-10">

        <section>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device (computer, smartphone, or tablet) when you visit a website. They help websites recognise your device on subsequent visits, remember your preferences, and collect information about how you interact with the site. Cookies are widely used to make websites work more efficiently and to provide site owners with analytics information.
          </p>
          <p>
            Similar technologies, including web beacons, pixel tags, and local storage, work in comparable ways. References to &quot;cookies&quot; in this policy include these similar technologies unless stated otherwise.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">2. Our Legal Basis for Using Cookies</h2>
          <p>
            Under the UK Privacy and Electronic Communications Regulations (PECR) and UK GDPR, we are required to obtain your consent before placing non-essential cookies on your device. Strictly necessary cookies do not require consent.
          </p>
          <p>
            Where we rely on your consent to set cookies, you are free to withdraw that consent at any time by adjusting your browser settings or using our cookie preference options (where available). Withdrawing consent will not affect any processing that took place before withdrawal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">3. Types of Cookies We Use</h2>

          <h3 className="text-xl font-semibold text-teal-700 mt-6 mb-2">3.1 Strictly Necessary Cookies</h3>
          <p>
            These cookies are essential for the Website to function and cannot be switched off. They are usually set in response to actions you take, such as setting your privacy preferences or navigating between pages. Without these cookies, certain services cannot be provided.
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Cookie Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Purpose</th>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">_session</td>
                  <td className="px-4 py-2">Maintains your session state during your visit</td>
                  <td className="px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">cookie_consent</td>
                  <td className="px-4 py-2">Stores your cookie consent preferences</td>
                  <td className="px-4 py-2">12 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-teal-700 mt-8 mb-2">3.2 Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our Website by collecting and reporting information anonymously. They allow us to count visits, understand traffic sources, and see which pages are most popular. This helps us improve how the Website works and the content we produce. All analytics data is anonymised or aggregated before use.
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Cookie Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Provider</th>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Purpose</th>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">_ga</td>
                  <td className="px-4 py-2">Google Analytics</td>
                  <td className="px-4 py-2">Distinguishes unique users by assigning a randomly generated number</td>
                  <td className="px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">_ga_*</td>
                  <td className="px-4 py-2">Google Analytics</td>
                  <td className="px-4 py-2">Stores and counts page views</td>
                  <td className="px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">_gid</td>
                  <td className="px-4 py-2">Google Analytics</td>
                  <td className="px-4 py-2">Distinguishes users for short-term tracking</td>
                  <td className="px-4 py-2">24 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            We have configured Google Analytics with IP anonymisation enabled to prevent storage of full IP addresses.
          </p>

          <h3 className="text-xl font-semibold text-teal-700 mt-8 mb-2">3.3 Functionality Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalisation. They may be set by us or by third-party providers whose services we have added to our pages. Without these cookies, some features may not work correctly.
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Cookie Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Purpose</th>
                  <th className="px-4 py-2 text-left font-semibold text-teal-800">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">user_prefs</td>
                  <td className="px-4 py-2">Stores display preferences such as text size or reading mode</td>
                  <td className="px-4 py-2">6 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-teal-700 mt-8 mb-2">3.4 Third-Party and Advertising Cookies</h3>
          <p>
            We may use third-party services such as affiliate networks or social media plugins that set their own cookies. These cookies are governed by the respective third parties&apos; privacy and cookie policies. We recommend reviewing those policies directly. Current third parties that may set cookies include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Google</strong> — analytics and advertising (see <a href="https://policies.google.com/privacy" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>)</li>
            <li><strong>Netlify</strong> — hosting and form processing (see <a href="https://www.netlify.com/privacy/" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">Netlify Privacy Policy</a>)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">4. How Long Do Cookies Last?</h2>
          <p>Cookies are either:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Session cookies</strong> — temporary cookies that are deleted when you close your browser.</li>
            <li><strong>Persistent cookies</strong> — remain on your device for a set period (as listed in the tables above) or until you delete them manually.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">5. Managing and Refusing Cookies</h2>
          <p>You have several options for managing cookies:</p>

          <h3 className="text-xl font-semibold text-teal-700 mt-6 mb-2">5.1 Browser Settings</h3>
          <p>
            Most browsers allow you to view, manage, delete, and block cookies. Note that if you delete or block cookies, some features of the Website may not function as intended. To manage cookies via your browser:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h3 className="text-xl font-semibold text-teal-700 mt-6 mb-2">5.2 Opt-Out Tools</h3>
          <p>You can also opt out of specific analytics and advertising cookies using the following tools:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out</a> — install the browser add-on to prevent Google Analytics from collecting your data.</li>
            <li><a href="https://www.youronlinechoices.com/" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">Your Online Choices</a> — manage interest-based advertising cookies across participating companies.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">6. Your Rights</h2>
          <p>
            As set out in our <a href="/privacy-policy" className="text-teal-700 underline">Privacy Policy</a>, you have rights under UK GDPR in relation to personal data processed via cookies. You may withdraw your consent to non-essential cookies at any time. To exercise your rights, contact us at <a href="mailto:hello@thesmugsaver.com" className="text-teal-700 underline">hello@thesmugsaver.com</a>.
          </p>
          <p>
            You also have the right to complain to the ICO at <a href="https://ico.org.uk" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a> if you believe your privacy rights have been infringed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">7. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy periodically to reflect changes in the cookies we use, applicable law, or our services. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date. We encourage you to review this page regularly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-teal-800 mb-3">8. Contact Us</h2>
          <p>
            If you have questions about our use of cookies or this policy, please contact us:
          </p>
          <p className="mt-3">
            <strong>Email:</strong> <a href="mailto:hello@thesmugsaver.com" className="text-teal-700 underline">hello@thesmugsaver.com</a><br />
            <strong>Website:</strong> <a href="https://www.thesmugsaver.com" className="text-teal-700 underline">www.thesmugsaver.com</a>
          </p>
        </section>

      </div>

      <div className="mt-12 border-t pt-8">
        <Link href="/" className="text-teal-700 hover:underline font-semibold">
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}
