import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickPrompts = ["Check my essay", "Practice speaking", "Explain this question", "Study plan help"];

const HalaChatButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "hala", text: "Hi! I'm Hala, your IELTS AI coach 🤖 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "hala", text: "Thanks for your question! This feature will be fully powered with AI soon. For now, try the Practice section! 📚" },
    ]);
    setInput("");
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 z-50 w-12 h-12 rounded-full bg-accent text-accent-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition-transform press pulse-glow"
          aria-label="Open AI Tutor Chat"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[320px] max-h-[440px] bg-card border rounded-2xl shadow-modal flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <span className="text-base">🤖</span>
              <div>
                <p className="text-sm font-semibold leading-tight">Hala</p>
                <p className="text-[10px] opacity-70">Your IELTS AI Coach</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="press">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-64">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-[10px] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full hover:bg-secondary/80 transition-colors press"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask Hala anything..."
              className="flex-1 text-xs bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button variant="coral" size="icon" className="shrink-0 w-8 h-8" onClick={() => send(input)}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default HalaChatButton;
