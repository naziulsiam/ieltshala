const universities = [
  "University of Toronto",
  "University of Melbourne",
  "Manchester University",
  "BRAC University",
  "North South University",
  "McGill University",
  "UNSW Sydney",
];

const SocialProofBar = () => (
  <section className="py-10 bg-background border-b">
    <div className="container">
      <p className="text-center text-sm text-muted-foreground mb-6">
        Our students achieved their dreams at
      </p>
      <div className="flex gap-8 overflow-x-auto pb-2 justify-start md:justify-center scrollbar-hide">
        {universities.map((u) => (
          <span
            key={u}
            className="shrink-0 text-muted-foreground/50 font-bold text-lg tracking-tight whitespace-nowrap"
          >
            {u}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofBar;
