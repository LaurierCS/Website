import type { FAQItem, SubmissionRequirement } from './hackathonData';
import { ExpandablePanel } from './ExpandablePanel';

interface SubmissionsFaqSectionProps {
  submissions: SubmissionRequirement[];
  technicalDetails: string[];
  devpostChecklist: string[];
  faqs: FAQItem[];
}

export function SubmissionsFaqSection({
  submissions,
  technicalDetails,
  devpostChecklist,
  faqs,
}: SubmissionsFaqSectionProps) {
  const requiredSubmissions = submissions.filter((item) => item.required);
  const optionalSubmissions = submissions.filter((item) => !item.required);

  return (
    <section id="submission-guide" className="max-w-6xl mx-auto mt-10 md:mt-14 grid lg:grid-cols-12 gap-4 md:gap-6">
      <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-white/6 backdrop-blur-md p-4 sm:p-6 md:p-7">
        <h2 className="text-white text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-dosis)' }}>
          Submission Guide
        </h2>
        <p className="mt-2 text-white/75 text-sm sm:text-base" style={{ fontFamily: 'var(--font-montserrat)' }}>
          All submissions are due Sunday, March 29 by 1:30 PM through Devpost.
        </p>

        <div className="mt-5 space-y-3">
          <ExpandablePanel title="Required Submissions" subtitle="What every team must provide" defaultOpen={true}>
            <div className="space-y-3">
              {requiredSubmissions.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/12 bg-black/25 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-dosis)' }}>
                      {item.title}
                    </h4>
                    <span className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] border text-(--color-accent-yellow) border-(--color-accent-yellow)/60 w-fit">
                      Required
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {item.points.map((point) => (
                      <li key={`${item.title}-${point}`} className="text-sm leading-relaxed text-white/80" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        - {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Optional Add-ons" subtitle="Extras that can strengthen your project page">
            <div className="space-y-3">
              {optionalSubmissions.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/12 bg-black/25 p-4">
                  <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-dosis)' }}>
                    {item.title}
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {item.points.map((point) => (
                      <li key={`${item.title}-${point}`} className="text-sm leading-relaxed text-white/80" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        - {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Technical Details" subtitle="Quick rules and constraints">
            <ul className="space-y-2">
              {technicalDetails.map((detail) => (
                <li key={detail} className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  - {detail}
                </li>
              ))}
            </ul>
          </ExpandablePanel>

          <ExpandablePanel title="Devpost Submission Fields" subtitle="Checklist for your final upload">
            <ul className="space-y-2">
              {devpostChecklist.map((field) => (
                <li key={field} className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  - {field}
                </li>
              ))}
            </ul>
          </ExpandablePanel>
        </div>
      </div>

      <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-white/6 backdrop-blur-md p-4 sm:p-6 md:p-7">
        <h2 className="text-white text-3xl font-bold" style={{ fontFamily: 'var(--font-dosis)' }}>
          FAQ
        </h2>
        <p className="text-white/70 text-sm mt-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Fast answers before you start building.
        </p>

        <div className="mt-4 space-y-3">
          {faqs.map((faq, index) => (
            <ExpandablePanel key={faq.question} title={faq.question} defaultOpen={index === 0}>
              <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)' }}>
                {faq.answer}
              </p>
            </ExpandablePanel>
          ))}
        </div>
      </div>
    </section>
  );
}
