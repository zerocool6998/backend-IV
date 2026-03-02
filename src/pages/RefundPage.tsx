import { Helmet } from 'react-helmet-async';
import { Clock } from 'lucide-react';

export function RefundPage() {
  return (
    <>
      <Helmet>
        <title>Refund Policy - Academic Press</title>
        <meta name="description" content="Refund Policy for Academic Press digital products and subscriptions." />
      </Helmet>

      <div className="flex-grow bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-background-dark">
        <div className="mx-auto max-w-[65ch]">
          {/* Page Header */}
          <div className="mb-12 border-b border-slate-200 pb-8 dark:border-slate-800">
            <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Refund Policy
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Clock size={18} />
              <p>Last updated: October 24, 2023</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-slate prose-lg hover:prose-a:underline prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline dark:prose-invert">
            <h2 className="mb-4 mt-8 text-2xl text-slate-900 dark:text-white">Overview</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              At Academic Press, we want you to be completely satisfied with your purchase. As our payments are processed by Paddle, our Merchant of Record, this policy outlines how refunds are handled in compliance with their standards and consumer protection laws. We strive to make our refund process transparent and fair for all our readers.
            </p>

            <h2 className="mb-4 mt-10 text-2xl text-slate-900 dark:text-white">Digital Products Guarantee</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              We stand behind the quality of our digital content. If you are not satisfied with your purchase of any eBook, course, or digital subscription, we offer a <strong className="font-semibold text-primary">30-day money-back guarantee</strong>.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              This guarantee allows you to explore our library risk-free. If the content doesn't meet your expectations or educational needs, you can request a full refund within 30 days of the transaction date, no questions asked.
            </p>

            <h2 className="mb-4 mt-10 text-2xl text-slate-900 dark:text-white">Conditions for Refund</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-600 marker:text-primary dark:text-slate-300">
              <li>The refund request must be made within 30 days of the original purchase date.</li>
              <li>For subscription services, refunds are available for the current billing cycle only.</li>
              <li>We reserve the right to deny refund requests in cases of suspected abuse of our refund policy (e.g., repeated refunds for the same product).</li>
              <li>Refunds will be issued to the original payment method used during the purchase.</li>
            </ul>

            <h2 className="mb-4 mt-10 text-2xl text-slate-900 dark:text-white">How to Request a Refund</h2>
            <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-300">
              To initiate a refund, please follow these simple steps:
            </p>

            <div className="not-prose mb-8 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
              <ol className="relative ml-3 space-y-8 border-l border-slate-200 dark:border-slate-700">
                <li className="mb-2 ml-6">
                  <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white ring-4 ring-white dark:ring-background-dark">1</span>
                  <h3 className="mb-1 font-bold text-slate-900 dark:text-white">Contact Support</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Email our support team at <a className="text-primary hover:underline" href="mailto:support@academicpress.com">support@academicpress.com</a> with your order number.</p>
                </li>
                <li className="mb-2 ml-6">
                  <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 ring-4 ring-white dark:bg-slate-700 dark:text-slate-300 dark:ring-background-dark">2</span>
                  <h3 className="mb-1 font-bold text-slate-900 dark:text-white">Review</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Our team will review your request to ensure it meets the policy conditions (usually within 24 hours).</p>
                </li>
                <li className="ml-6">
                  <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 ring-4 ring-white dark:bg-slate-700 dark:text-slate-300 dark:ring-background-dark">3</span>
                  <h3 className="mb-1 font-bold text-slate-900 dark:text-white">Processing</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Once approved, the refund will be processed immediately by Paddle. It may take 5-10 business days to appear on your statement.</p>
                </li>
              </ol>
            </div>

            <p className="text-sm italic text-slate-600 dark:text-slate-300">
              Note: If you have any issues regarding a charge or a refund that has not been received, please contact Paddle directly as they handle all financial transactions for Academic Press.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
