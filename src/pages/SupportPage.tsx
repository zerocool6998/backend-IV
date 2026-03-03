import { Helmet } from 'react-helmet-async';
import { ChevronDown, Send, ShieldCheck } from 'lucide-react';

const faqs = [
  {
    question: 'How do I access my digital purchase?',
    answer:
      'After your payment is confirmed, you will receive an email containing a secure download link for your PDF or ePub file. You can also access your library at any time by logging into your account on our website.',
  },
  {
    question: 'Why does my bank statement say "PADDLE.NET"?',
    answer:
      'We use Paddle as our Merchant of Record to handle payments, taxes, and compliance globally. "PADDLE.NET" is the descriptor that will appear on your bank statement.',
  },
  {
    question: 'Can I get a refund on a digital product?',
    answer:
      'If you experience technical issues with the file that we cannot resolve, or if you accidentally purchased the wrong title, please contact us within 14 days of purchase.',
  },
  {
    question: 'Do you offer institutional or bulk licensing?',
    answer:
      'Yes, we offer special pricing and licensing agreements for universities, libraries, and research institutions.',
  },
];

export function SupportPage() {
  return (
    <>
      <Helmet>
        <title>Support & FAQ - Academic Press</title>
      </Helmet>

      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-[#173a73]">Support</span>
            <h1 className="font-serif text-4xl font-bold text-[#0e1731] sm:text-5xl">Support &amp; FAQ</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-[#4d5f7b]">
              Need assistance with your digital order or have questions about billing? We are here to help ensure a smooth experience.
            </p>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="w-full lg:w-5/12 xl:w-1/3">
              <div className="rounded-md border border-[#e3e9f0] bg-white p-6">
                <div className="mb-6 border-b border-[#e3e9f0] pb-4">
                  <h2 className="text-2xl font-bold text-[#121d37]">Send us a message</h2>
                  <p className="mt-2 text-sm text-[#6d7b91]">Our support team usually responds within 24 hours.</p>
                </div>
                <form className="flex flex-col gap-5">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[#243550]">Full Name</span>
                    <input className="w-full rounded-[3px] border border-[#d5dde7] bg-[#f9fbfd] px-3 py-2.5 text-sm text-[#243550] outline-none focus:border-[#173a73]" placeholder="Dr. Jane Smith" type="text" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[#243550]">Email Address</span>
                    <input className="w-full rounded-[3px] border border-[#d5dde7] bg-[#f9fbfd] px-3 py-2.5 text-sm text-[#243550] outline-none focus:border-[#173a73]" placeholder="jane@university.edu" type="email" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[#243550]">Subject</span>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-[3px] border border-[#d5dde7] bg-[#f9fbfd] px-3 py-2.5 text-sm text-[#243550] outline-none focus:border-[#173a73]">
                        <option>General Inquiry</option>
                        <option>Order Issue / Refund</option>
                        <option>Technical Support</option>
                        <option>Billing Question (Paddle)</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-2.5 text-[#7f8ea8]" size={18} />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[#243550]">Message</span>
                    <textarea className="w-full resize-none rounded-[3px] border border-[#d5dde7] bg-[#f9fbfd] px-3 py-2.5 text-sm text-[#243550] outline-none focus:border-[#173a73]" placeholder="Please describe your issue..." rows={4} />
                  </label>
                  <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-[3px] bg-[#0d3874] py-3 text-sm font-bold text-white transition-colors hover:bg-[#0a2d5e]" type="button">
                    <span>Send Message</span>
                    <Send size={16} />
                  </button>
                </form>
                <div className="mt-6 border-t border-[#e3e9f0] pt-6">
                  <div className="flex items-center gap-3 text-sm text-[#6d7b91]">
                    <ShieldCheck size={18} className="text-[#173a73]" />
                    <p>Secure transactions processed by Paddle.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-7/12 xl:w-2/3">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#121d37]">Frequently Asked Questions</h2>
                <p className="mt-2 text-[#6d7b91]">Find quick answers about downloading your books and payment processing.</p>
              </div>
              <div className="flex flex-col gap-4">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-md border border-[#e3e9f0] bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-lg font-medium text-[#121d37]">
                      <span>{faq.question}</span>
                      <ChevronDown className="text-[#7f8ea8] transition-transform duration-300 group-open:rotate-180" size={22} />
                    </summary>
                    <div className="border-t border-[#e3e9f0] px-6 pb-6 pt-4 leading-8 text-[#5a6981]">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-8 rounded-md border border-[#dbe6f2] bg-[#edf3fa] p-6">
                <h3 className="text-xl font-bold text-[#121d37]">Still need help?</h3>
                <p className="mt-3 text-sm leading-8 text-[#5a6981]">
                  If you could not find the answer you were looking for, please reach out. For specific inquiries about tax or billing, you can also visit <a className="font-semibold text-[#173a73] hover:underline" href="#">Paddle&apos;s Buyer Support</a> directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
