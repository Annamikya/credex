import { Card } from '../ui/card';

const faqs = [
  {
    question: 'Can I audit tools like ChatGPT and OpenAI API together?',
    answer: 'Yes. The form supports both platform subscriptions and developer API spend in the same audit.'
  },
  {
    question: 'Is the savings logic AI-generated?',
    answer: 'No. Audit recommendations are rule-based using plan, team size, and spend patterns to identify likely optimization opportunities.'
  },
  {
    question: 'Will the public audit page share confidential data?',
    answer: 'No. Shareable links only show non-sensitive tool recommendations and savings summaries.'
  }
];

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">FAQ</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Answers for founders and finance teams.</h2>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {faqs.map((faq) => (
          <Card key={faq.question} className="p-6 transition hover:-translate-y-1 hover:bg-slate-900/95">
            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
