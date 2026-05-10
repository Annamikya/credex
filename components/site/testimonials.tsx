import { Card } from '../ui/card';

const reviews = [
  {
    quote: 'The AI audit surfaced savings we had not seen across ChatGPT and OpenAI API spend.',
    author: 'Maya Patel, Founder'
  },
  {
    quote: 'It felt like a polished finance deck sample I could share with my investors.',
    author: 'Jordan Kim, COO'
  },
  {
    quote: 'The recommendations were practical and easy to act on during bootstrapped growth.',
    author: 'Lina Ortiz, Head of Operations'
  }
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-5 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Customer stories</p>
        <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Trusted by early-stage teams and finance leaders.</h2>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.author} className="rounded-[2rem] p-8 transition hover:-translate-y-1 hover:bg-slate-900/95">
            <p className="text-lg leading-8 text-slate-100">“{review.quote}”</p>
            <p className="mt-6 text-sm font-semibold text-white">{review.author}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
