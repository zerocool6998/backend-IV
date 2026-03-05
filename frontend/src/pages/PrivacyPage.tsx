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
  ArrowRight,
} from 'lucide-react';

export function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Academic Press</title>
        <meta name="description" content="Privacy Policy and Terms of Service for Academic Press." />
      </Helmet>

      <div className="py-20">
        <div className="mx-auto max-w-[65ch] px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex text-sm text-[#7f8ea8]">
            <ol className="flex items-center space-x-2">
              <li>
                <Link className="transition-colors hover:text-primary" to="/">
                  Home
                </Link>
              </li>
              <li><span className="mx-1">/</span></li>
              <li><span className="font-medium text-primary">Privacy Policy</span></li>
            </ol>
          </nav>

          <div className="mb-10 border-b border-border-light pb-8">
            <h1 className="mb-4 text-4xl sm:text-5xl">Privacy Policy</h1>
            <div className="flex flex-col gap-4 text-sm text-[#7f8ea8] sm:flex-row sm:items-center">
              <div className="flex items-center gap-1">
                <Calendar size={18} />
                <span>Last updated: October 24, 2023</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-[#c6d0dd] sm:block" />
              <div className="flex items-center gap-1">
                <ShieldCheck size={18} />
                <span>Paddle MoR Compliant</span>
              </div>
            </div>
          </div>

          <div className="max-w-none">
            <div className="mb-10 rounded-r-[4px] border-l-4 border-primary bg-primary-light p-6">
              <p className="m-0 font-medium text-[#42546f]">
                At Academic Press, we take your privacy seriously. This Privacy Policy describes how your personal
                information is collected, used, and shared when you visit or make a purchase from our website. We act
                as a vendor for Paddle, our Merchant of Record.
              </p>
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm text-primary">1</span>
                  Personal Information We Collect
                </h2>
                <p className="mb-4 text-[17px] text-text-muted">
                  When you visit the Site, we automatically collect certain information about your device, including
                  information about your web browser, IP address, time zone, and some of the cookies that are
                  installed on your device. Additionally, as you browse the Site, we collect information about the
                  individual web pages or products that you view, what websites or search terms referred you to the
                  Site, and information about how you interact with the Site. We refer to this automatically-collected
                  information as “Device Information.”
                </p>
                <p className="text-[17px] text-text-muted">
                  We collect Device Information using the following technologies:
                </p>
                <ul className="ml-2 mt-4 list-none space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 text-primary" size={20} />
                    <span className="text-[17px] text-text-muted">
                      <strong>Cookies:</strong> Data files that are placed on your device or computer and often
                      include an anonymous unique identifier.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 text-primary" size={20} />
                    <span className="text-[17px] text-text-muted">
                      <strong>Log files:</strong> Track actions occurring on the Site, and collect data including your
                      IP address, browser type, Internet service provider, referring/exit pages, and date/time
                      stamps.
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm text-primary">2</span>
                  How We Use Your Personal Information
                </h2>
                <p className="mb-4 text-[17px] text-text-muted">
                  We use the Order Information that we collect generally to fulfill any orders placed through the Site
                  (including processing your payment information, arranging for shipping, and providing you with
                  invoices and/or order confirmations). Additionally, we use this Order Information to:
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[4px] border border-border-light bg-white p-4 shadow-sm">
                    <MessageSquare className="mb-2 text-primary" size={24} />
                    <h3 className="mb-1 text-xl">Communicate with you</h3>
                    <p className="text-sm text-[#6d7b91]">Send updates about your submissions or subscriptions.</p>
                  </div>
                  <div className="rounded-[4px] border border-border-light bg-white p-4 shadow-sm">
                    <Shield className="mb-2 text-primary" size={24} />
                    <h3 className="mb-1 text-xl">Screen for risk</h3>
                    <p className="text-sm text-[#6d7b91]">Protect our orders against potential risk or fraud.</p>
                  </div>
                  <div className="rounded-[4px] border border-border-light bg-white p-4 shadow-sm">
                    <TrendingUp className="mb-2 text-primary" size={24} />
                    <h3 className="mb-1 text-xl">Improve Optimization</h3>
                    <p className="text-sm text-[#6d7b91]">Understand how our customers browse and interact with the Site.</p>
                  </div>
                  <div className="rounded-[4px] border border-border-light bg-white p-4 shadow-sm">
                    <Megaphone className="mb-2 text-primary" size={24} />
                    <h3 className="mb-1 text-xl">Marketing</h3>
                    <p className="text-sm text-[#6d7b91]">Provide information or advertising relating to our products.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm text-primary">3</span>
                  Sharing Your Personal Information
                </h2>
                <p className="mb-4 text-[17px] text-text-muted">
                  We share your Personal Information with third parties to help us use your Personal Information, as
                  described above. For example, we use Paddle as our Merchant of Record to handle payments and tax
                  compliance globally.
                </p>
                <p className="text-[17px] text-text-muted">
                  Finally, we may also share your Personal Information to comply with applicable laws and regulations,
                  to respond to a subpoena, search warrant or other lawful request for information we receive, or to
                  otherwise protect our rights.
                </p>
              </section>

              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm text-primary">4</span>
                  Do Not Track
                </h2>
                <p className="text-[17px] text-text-muted">
                  Please note that we do not alter our Site’s data collection and use practices when we see a Do Not
                  Track signal from your browser.
                </p>
              </section>

              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm text-primary">5</span>
                  Contact Us
                </h2>
                <p className="mb-6 text-[17px] text-text-muted">
                  For more information about our privacy practices, if you have questions, or if you would like to
                  make a complaint, please contact us by e-mail at privacy@academicpress.com or by mail using the
                  details provided below:
                </p>
                <div className="rounded-[4px] border border-border-light bg-white p-6 shadow-sm">
                  <address className="not-italic text-[17px] text-text-muted">
                    <p className="mb-2 font-bold text-primary">Academic Press Compliance Dept.</p>
                    <p>123 Research Boulevard</p>
                    <p>Suite 400</p>
                    <p>Cambridge, MA 02142</p>
                    <p className="mt-4 flex items-center gap-2">
                      <Mail size={18} />
                      <a className="text-primary hover:underline" href="mailto:privacy@academicpress.com">
                        privacy@academicpress.com
                      </a>
                    </p>
                  </address>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-16 border-t border-border-light pt-10">
            <h3 className="mb-6 text-xl">Frequently Asked Questions</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Link className="group block rounded-[4px] border border-border-light bg-white p-5 shadow-sm transition-all hover:border-primary/40" to="/support">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="mb-2 text-lg">How do I request data deletion?</h4>
                    <p className="text-sm text-[#6d7b91]">Learn about your rights under GDPR and CCPA regarding data erasure.</p>
                  </div>
                  <ArrowRight className="text-[#7f8ea8] transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
              <Link className="group block rounded-[4px] border border-border-light bg-white p-5 shadow-sm transition-all hover:border-primary/40" to="/support">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="mb-2 text-lg">What is Paddle?</h4>
                    <p className="text-sm text-[#6d7b91]">Understand our partnership with Paddle as our Merchant of Record.</p>
                  </div>
                  <ArrowRight className="text-[#7f8ea8] transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
