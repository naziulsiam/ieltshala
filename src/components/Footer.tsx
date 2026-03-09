const footerLinks = {
  Product: ["Features", "Pricing", "Mock Tests", "Success Stories", "Blog"],
  Support: ["Help Center", "Contact Us", "Feedback", "Report a Bug"],
  Legal: ["Privacy Policy", "Terms of Service", "Refund Policy"],
};

const Footer = () => (
  <footer className="py-16 bg-foreground text-primary-foreground">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        <div className="col-span-2 md:col-span-1">
          <p className="text-2xl font-extrabold mb-3">
            IELTS<span className="text-accent">hala</span>
          </p>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Bangladesh's #1 AI-powered IELTS preparation platform. Practice smarter, score higher.
          </p>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-semibold text-sm mb-4">{title}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-primary-foreground/40">
          © 2024 IELTShala. Made with ❤️ in Bangladesh
        </p>
        <div className="flex gap-4 text-xs text-primary-foreground/40">
          <span>English</span>
          <span>|</span>
          <span>বাংলা</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
