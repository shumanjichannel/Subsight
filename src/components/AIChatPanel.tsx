import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const EMPTY_STATE = "Ask me about your subscriptions — try 'How much do I spend monthly?' or 'What increased this month?'";

const SUGGESTIONS = [
  "How much do I spend monthly?",
  "What's my biggest expense?",
  "Any duplicate subscriptions?",
  "How can I save money?",
  "What's coming up this month?",
];

export default function AIChatPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json();
      const reply = data.reply ?? "Sorry, I couldn't process that.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating toggle button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
            aria-label="Open AI assistant"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">SubSight AI</p>
                  <p className="text-xs text-muted-foreground">Financial assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
                aria-label="Close AI assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{EMPTY_STATE}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex max-w-[85%] flex-col gap-1 rounded-2xl px-3.5 py-2.5 text-sm",
                        msg.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted text-foreground",
                      )}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex max-w-[85%] items-center gap-1.5 rounded-2xl bg-muted px-3.5 py-3 text-sm">
                      <span className="flex gap-1">
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
                          className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/40"
                        />
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                          className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/40"
                        />
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                          className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/40"
                        />
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your subscriptions..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || loading}
                  className="h-9 w-9 shrink-0 rounded-xl"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
