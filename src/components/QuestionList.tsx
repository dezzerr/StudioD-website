interface Question {
  question: string;
  answer: string;
}

export function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {questions.map(({ question, answer }) => (
        <details key={question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-light text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:text-lg">
            <span>{question}</span>
            <span aria-hidden="true" className="text-2xl leading-none text-accent-strong transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-3xl pt-4 text-sm leading-relaxed text-white/65 md:text-base">{answer}</p>
        </details>
      ))}
    </div>
  );
}
