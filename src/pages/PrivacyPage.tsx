import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare, 
  Shield, 
  TrendingUp, 
  Megaphone, 
  Mail, 
  ArrowRight 
} from 'lucide-react';

export function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Academic Press</title>
        <meta name="description" content="Privacy Policy and Terms of Service for Academic Press." />
      </Helmet>

      <div className="flex-grow bg-white dark:bg-background-dark">
        <div className="mx-auto max-w-[960px] px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex text-sm text-slate-500 dark:text-slate-400">
            <ol className="flex items-center space-x-2">
              <li><Link className="hover:text-primary transition-colors" to="/">Home</Link></li>
              <li><span className="mx-1">/</span></li>
              <li><span className="font-medium text-slate-900 dark:text-slate-100">Privacy Policy</span></li>
            </ol>
          </nav>

          {/* Page Title Area */}
          <div className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800">
            <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">Privacy Policy</h1>
            <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar size={18} />
                <span>Last updated: October 24, 2023</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block dark:bg-slate-700"></div>
              <div className="flex items-center gap-1">
                <ShieldCheck size={18} />
                <span>Paddle MoR Compliant</span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="max-w-none">
            <div className="mb-10 rounded-r-lg border-l-4 border-primary bg-blue-50 p-6 dark:bg-slate-800/50">
              <p className="m-0 font-medium text-slate-700 dark:text-slate-300">
                At Academic Press, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website. We act as a vendor for Paddle, our Merchant of Record.
              </p>
            </div>

            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">1</span>
                  Personal Information We Collect
                </h2>
                <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">
                  When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information.”
                </p>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  We collect Device Information using the following technologies:
                </p>
                <ul className="ml-2 mt-4 list-none space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 text-primary" size={20} />
                    <span className="text-slate-600 dark:text-slate-300"><strong>Cookies:</strong> Data files that are placed on your device or computer and often include an anonymous unique identifier.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 text-primary" size={20} />
                    <span className="text-slate-600 dark:text-slate-300"><strong>Log files:</strong> Track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</span>
                  </li>
                </ul>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">2</span>
                  How We Use Your Personal Information
                </h2>
                <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">
                  We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <MessageSquare className="mb-2 text-primary" size={24} />
                    <h3 className="mb-1 font-bold text-slate-900 dark:text-slate-100">Communicate with you</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Send updates about your submissions or subscriptions.</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <Shield className="mb-2 text-primary" size={24} />
                    <h3 className="mb-1 font-bold text-slate-900 dark:text-slate-100">Screen for risk</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Protect our orders against potential risk or fraud.</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <TrendingUp className="mb-2 text-primary" size={24} />
                    <h3 className="mb-1 font-bold text-slate-900 dark:text-slate-100">Improve Optimization</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Understand how our customers browse and interact with the Site.</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <Megaphone className="mb-2 text-primary" size={24} />
                    <h3 className="mb-1 font-bold text-slate-900 dark:text-slate-100">Marketing</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Provide information or advertising relating to our products.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">3</span>
                  Sharing Your Personal Information
                </h2>
                <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">
                  We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Paddle as our Merchant of Record to handle payments and tax compliance globally.
                </p>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">4</span>
                  Do Not Track
                </h2>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">5</span>
                  Contact Us
                </h2>
                <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-300">
                  For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at privacy@academicpress.com or by mail using the details provided below:
                </p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
                  <address className="not-italic text-slate-600 dark:text-slate-300">
                    <p className="mb-2 font-bold text-slate-900 dark:text-slate-100">Academic Press Compliance Dept.</p>
                    <p>123 Research Boulevard</p>
                    <p>Suite 400</p>
                    <p>Cambridge, MA 02142</p>
                    <p className="mt-4 flex items-center gap-2">
                      <Mail size={18} />
                      <a className="text-primary hover:underline" href="mailto:privacy@academicpress.com">privacy@academicpress.com</a>
                    </p>
                  </address>
                </div>
              </section>
            </div>
          </div>

          {/* FAQ Teaser */}
          <div className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
            <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Link className="group block rounded-lg border border-slate-200 p-5 transition-all hover:border-primary/50 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50" to="/support">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="mb-2 font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">How do I request data deletion?</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Learn about your rights under GDPR and CCPA regarding data erasure.</p>
                  </div>
                  <ArrowRight className="text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
              <Link className="group block rounded-lg border border-slate-200 p-5 transition-all hover:border-primary/50 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50" to="/support">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="mb-2 font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">What is Paddle?</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Understand our partnership with Paddle as our Merchant of Record.</p>
                  </div>
                  <ArrowRight className="text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
