import { Helmet } from 'react-helmet-async';
import { ChevronDown, Send, ShieldCheck } from 'lucide-react';

export function SupportPage() {
  return (
    <>
      <Helmet>
        <title>Support & FAQ - Academic Press</title>
      </Helmet>

      <div className="flex-grow">
        {/* Hero Section */}
        <div className="relative border-b border-border-light bg-surface-light pb-16 pt-12 dark:border-border-dark dark:bg-surface-dark">
          <div className="mx-auto max-w-[960px] px-6 text-center">
            <h1 className="mb-4 text-4xl font-black tracking-tight text-text-main sm:text-5xl dark:text-white">Support & FAQ</h1>
            <p className="mx-auto max-w-2xl text-lg text-text-muted dark:text-slate-400">
              Need assistance with your digital order or have questions about billing? 
              We are here to help ensure a smooth experience.
            </p>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-12 lg:flex-row">
          {/* Contact Form Section */}
          <div className="w-full lg:w-5/12 xl:w-1/3">
            <div className="sticky top-24 rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
              <div className="mb-6 border-b border-border-light pb-4 dark:border-border-dark">
                <h2 className="mb-2 text-xl font-bold text-text-main dark:text-white">Send us a message</h2>
                <p className="text-sm text-text-muted dark:text-slate-400">Our support team usually responds within 24 hours.</p>
              </div>
              <form className="flex flex-col gap-5">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-main dark:text-slate-200">Full Name</span>
                  <input className="w-full rounded-lg border-border-light bg-background-light px-3 py-2.5 text-sm text-text-main placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-white dark:placeholder-slate-500" placeholder="Dr. Jane Smith" type="text"/>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-main dark:text-slate-200">Email Address</span>
                  <input className="w-full rounded-lg border-border-light bg-background-light px-3 py-2.5 text-sm text-text-main placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-white dark:placeholder-slate-500" placeholder="jane@university.edu" type="email"/>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-main dark:text-slate-200">Subject</span>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-lg border-border-light bg-background-light px-3 py-2.5 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-white">
                      <option>General Inquiry</option>
                      <option>Order Issue / Refund</option>
                      <option>Technical Support</option>
                      <option>Billing Question (Paddle)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-2.5 text-lg text-text-muted dark:text-slate-500" size={20} />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-text-main dark:text-slate-200">Message</span>
                  <textarea className="w-full resize-none rounded-lg border-border-light bg-background-light px-3 py-2.5 text-sm text-text-main placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-white dark:placeholder-slate-500" placeholder="Please describe your issue..." rows={4}></textarea>
                </label>
                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark" type="button">
                  <span>Send Message</span>
                  <Send className="text-sm" size={16} />
                </button>
              </form>
              <div className="mt-6 border-t border-border-light pt-6 dark:border-border-dark">
                <div className="flex items-center gap-3 text-sm text-text-muted dark:text-slate-500">
                  <ShieldCheck className="text-lg" size={20} />
                  <p>Secure transactions processed by Paddle.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="w-full lg:w-7/12 xl:w-2/3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-main dark:text-white">Frequently Asked Questions</h2>
              <p className="mt-2 text-text-muted dark:text-slate-400">Find quick answers about downloading your books and payment processing.</p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                {
                  question: "How do I access my digital purchase?",
                  answer: "After your payment is confirmed, you will receive an email containing a secure download link for your PDF or ePub file. You can also access your library at any time by logging into your account on our website. Links are valid for 30 days, but your account access is permanent."
                },
                {
                  question: "Why does my bank statement say \"PADDLE.NET\"?",
                  answer: "We use Paddle as our Merchant of Record to handle payments, taxes, and compliance globally. This ensures your transaction is secure and tax-compliant regardless of where you are located. \"PADDLE.NET\" is the descriptor that will appear on your bank statement for this purchase."
                },
                {
                  question: "Can I get a refund on a digital product?",
                  answer: "We want you to be satisfied with your purchase. If you experience technical issues with the file that we cannot resolve, or if you accidentally purchased the wrong title, please contact us within 14 days of purchase. Due to the nature of digital goods, refunds for \"change of mind\" after downloading are reviewed on a case-by-case basis."
                },
                {
                  question: "Do you offer institutional or bulk licensing?",
                  answer: "Yes, we offer special pricing and licensing agreements for universities, libraries, and research institutions. Please use the contact form on this page and select \"General Inquiry\" to discuss your organization's needs with our sales team."
                },
                {
                  question: "How do I get a VAT invoice?",
                  answer: "A link to your invoice is included in the order confirmation email sent by Paddle immediately after purchase. If you need to update your VAT ID or business details on the invoice, the email provides a direct link to the Paddle self-service portal to make those adjustments."
                }
              ].map((faq, index) => (
                <details key={index} className="group rounded-xl border border-border-light bg-surface-light open:shadow-sm dark:border-border-dark dark:bg-surface-dark">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-lg font-medium text-text-main focus:outline-none dark:text-white">
                    <span>{faq.question}</span>
                    <ChevronDown className="text-text-muted transition-transform duration-300 group-open:rotate-180" size={24} />
                  </summary>
                  <div className="border-t border-border-light px-6 pb-6 pt-4 leading-relaxed text-text-muted dark:border-border-dark dark:text-slate-400">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            {/* Additional Help CTA */}
            <div className="mt-8 rounded-lg border border-primary/10 bg-primary/5 p-6 dark:border-primary/20 dark:bg-primary/10">
              <h3 className="mb-2 text-lg font-bold text-text-main dark:text-white">Still need help?</h3>
              <p className="mb-4 text-sm text-text-muted dark:text-slate-400">
                If you couldn't find the answer you were looking for, please don't hesitate to reach out. For specific inquiries about tax or billing, you can also visit <a className="font-medium text-primary hover:underline" href="#">Paddle's Buyer Support</a> directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
