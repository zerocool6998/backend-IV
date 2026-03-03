import { Helmet } from 'react-helmet-async';
import { Clock } from 'lucide-react';

export function RefundPage() {
  return (
    <>
      <Helmet>
        <title>Refund Policy - Academic Press</title>
        <meta name="description" content="Refund Policy for Academic Press digital products and subscriptions." />
      </Helmet>

      <div className="py-20">
        <div className="mx-auto max-w-[65ch] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 border-b border-border-light pb-8">
            <h1 className="mb-4 text-4xl sm:text-5xl">Refund Policy</h1>
            <div className="flex items-center gap-2 text-sm text-[#7f8ea8]">
              <Clock size={18} />
              <p>Last updated: October 24, 2023</p>
            </div>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="mb-4 text-2xl">Overview</h2>
              <p className="text-[17px] text-text-muted">
                At Academic Press, we want you to be completely satisfied with your purchase. As our payments are
                processed by Paddle, our Merchant of Record, this policy outlines how refunds are handled in
                compliance with their standards and consumer protection laws. We strive to make our refund process
                transparent and fair for all our readers.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl">Digital Products Guarantee</h2>
              <p className="text-[17px] text-text-muted">
                We stand behind the quality of our digital content. If you are not satisfied with your purchase of any
                eBook, course, or digital subscription, we offer a <strong className="text-primary">30-day
                money-back guarantee</strong>.
              </p>
              <p className="mt-4 text-[17px] text-text-muted">
                This guarantee allows you to explore our library risk-free. If the content does not meet your
                expectations or educational needs, you can request a full refund within 30 days of the transaction
                date, no questions asked.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl">Conditions for Refund</h2>
              <ul className="list-disc space-y-2 pl-5 text-[17px] text-text-muted marker:text-primary">
                <li>The refund request must be made within 30 days of the original purchase date.</li>
                <li>For subscription services, refunds are available for the current billing cycle only.</li>
                <li>We reserve the right to deny refund requests in cases of suspected abuse of our refund policy.</li>
                <li>Refunds will be issued to the original payment method used during the purchase.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl">How to Request a Refund</h2>
              <p className="mb-6 text-[17px] text-text-muted">
                To initiate a refund, please follow these simple steps:
              </p>

              <div className="rounded-[4px] border border-border-light bg-white p-6 shadow-sm">
                <ol className="relative ml-3 space-y-8 border-l border-border-light">
                  <li className="mb-2 ml-6">
                    <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white ring-4 ring-background-light">1</span>
                    <h3 className="mb-1 text-lg">Contact Support</h3>
                    <p className="text-sm text-[#6d7b91]">
                      Email our support team at <a className="text-primary hover:underline" href="mailto:support@academicpress.com">support@academicpress.com</a> with your order number.
                    </p>
                  </li>
                  <li className="mb-2 ml-6">
                    <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary ring-4 ring-background-light">2</span>
                    <h3 className="mb-1 text-lg">Review</h3>
                    <p className="text-sm text-[#6d7b91]">
                      Our team will review your request to ensure it meets the policy conditions (usually within 24 hours).
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary ring-4 ring-background-light">3</span>
                    <h3 className="mb-1 text-lg">Processing</h3>
                    <p className="text-sm text-[#6d7b91]">
                      Once approved, the refund will be processed immediately by Paddle. It may take 5-10 business days to appear on your statement.
                    </p>
                  </li>
                </ol>
              </div>

              <p className="mt-6 text-sm italic text-[#6d7b91]">
                Note: If you have any issues regarding a charge or a refund that has not been received, please contact
                Paddle directly as they handle all financial transactions for Academic Press.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
