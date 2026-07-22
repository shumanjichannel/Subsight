import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Scan,
  BarChart3,
  Bell,
  Layers,
  Bot,
  Shield,
  Check,
  Star,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

// ---------- animation helpers ----------

function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
      }}
    >
      {children}
    </motion.div>
  );
}

// ---------- data ----------

const features = [
  {
    icon: Scan,
    title: "Auto-Detect Subscriptions",
    description:
      "Connect your bank and SubSight scans transactions to automatically identify every recurring subscription — Netflix, Spotify, SaaS tools, and more.",
  },
  {
    icon: BarChart3,
    title: "Smart Spending Insights",
    description:
      "Beautiful dashboards show exactly where your money goes each month. Spot trends, compare months, and find opportunities to save.",
  },
  {
    icon: Bell,
    title: "Price Increase Alerts",
    description:
      "Get notified the moment a subscription price goes up. We track changes across all your services so you're never surprised by a bill.",
  },
  {
    icon: Layers,
    title: "Duplicate Detection",
    description:
      "Paying for two streaming services you barely use? SubSight flags overlapping subscriptions so you can cut the waste.",
  },
  {
    icon: Bot,
    title: "AI Financial Assistant",
    description:
      'Ask questions like "How can I save €50 this month?" and get personalized recommendations based on your actual subscription data.',
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "We use read-only bank APIs with 256-bit encryption. Your credentials are never stored — we only see transaction metadata.",
  },
];

const tiers = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Perfect for getting started.",
    features: [
      "1 bank connection",
      "Up to 20 subscriptions",
      "Basic dashboard",
      "Manual refresh",
    ],
    cta: "Get Started Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "€7.99",
    period: "/month",
    description: "For power users who want full control.",
    features: [
      "Unlimited bank connections",
      "Unlimited subscriptions",
      "AI financial assistant",
      "Price-increase tracking",
      "Email & push notifications",
      "CSV export",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    featured: true,
  },
  {
    name: "Team",
    price: "€19",
    period: "/month",
    description: "For families and small businesses.",
    features: [
      "Everything in Pro",
      "Shared workspace",
      "Family / business subscriptions",
      "Admin controls",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    featured: false,
  },
];

const testimonials = [
  {
    quote:
      "SubSight found 4 subscriptions I had completely forgotten about. I saved over €30 in the first 10 minutes.",
    name: "Sarah Chen",
    role: "Freelancer",
    initials: "SC",
  },
  {
    quote:
      "The price-increase alerts have saved me so much money. I caught my internet provider raising rates twice and negotiated a better deal.",
    name: "Marcus Johansson",
    role: "Small business owner",
    initials: "MJ",
  },
  {
    quote:
      "As a student, every euro counts. SubSight helps me track my Spotify, cloud storage, and apps all in one place.",
    name: "Lena Müller",
    role: "Student",
    initials: "LM",
  },
];

const faqs = [
  {
    q: "How does SubSight find my subscriptions?",
    a: "SubSight connects to your bank through secure, read-only APIs (like PSD2 open banking). It scans your transaction history for recurring patterns — matching merchants, amounts, and cadences — to automatically identify subscriptions. No manual entry required.",
  },
  {
    q: "Is it safe to connect my bank account?",
    a: "Absolutely. We use bank-grade 256-bit encryption and never store your login credentials. Our bank connections are read-only — we can see transaction metadata but cannot move money or make changes. We're partnered with licensed open-banking providers regulated under PSD2.",
  },
  {
    q: "Which banks do you support?",
    a: "SubSight supports over 2,000 banks across Europe through open banking APIs. This includes major banks like Deutsche Bank, BNP Paribas, ING, Santander, and many neo-banks like N26 and Revolut. UK and US bank support is coming soon.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — there are no contracts or commitments. Cancel your Pro or Team plan at any time with one click, and your account will revert to the Free tier. You won't be charged again.",
  },
  {
    q: "How is the Pro plan different from Free?",
    a: "Free gives you one bank connection, up to 20 detected subscriptions, and the basic dashboard. Pro unlocks unlimited banks and subscriptions, the AI financial assistant, price-increase tracking, email/push notifications, and CSV export. Most active users upgrade to Pro within their first week.",
  },
  {
    q: "Do you sell my financial data?",
    a: "Never. Your transaction data is yours alone. We don't sell, share, or monetize your data in any way. SubSight makes money through subscriptions — not through advertising or data brokerage.",
  },
];

// ---------- page ----------

export default function Landing() {
  const featuresRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-primary)_0%,transparent_60%)] opacity-[0.07] dark:opacity-[0.12]" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_50%,var(--color-primary)_0%,transparent_70%)] opacity-[0.05] dark:opacity-[0.08]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:pb-24 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              🚀 Your subscription command center
            </Badge>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Never lose track of a{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                subscription
              </span>{" "}
              again.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              SubSight automatically discovers recurring payments from your bank
              transactions, flags wasted spend, and alerts you before charges
              hit — so you stay in control.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link to="/signup">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <button onClick={scrollToFeatures}>
                  See How It Works
                </button>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · Free tier forever
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== FEATURES ============== */}
      <section
        ref={featuresRef}
        className="border-t border-border bg-muted/30 px-4 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to master your subscriptions
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              From automatic discovery to AI-powered insights — SubSight gives
              you full visibility and control.
            </p>
          </FadeUp>

          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <Card className="group h-full border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============== PRICING ============== */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center">
            <Badge variant="secondary" className="mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Start free, upgrade when you need more. No hidden fees, cancel
              anytime.
            </p>
          </FadeUp>

          <Stagger className="mt-14 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <Card
                  className={`relative flex h-full flex-col ${
                    tier.featured
                      ? "border-primary shadow-lg ring-1 ring-primary/20"
                      : "border-border/60"
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-5xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">
                        {tier.period}
                      </span>
                    </div>
                    <ul className="space-y-3 text-sm">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardContent>
                    <Button
                      asChild
                      variant={tier.featured ? "default" : "outline"}
                      className="w-full"
                    >
                      <Link to={tier.href}>{tier.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeUp delay={0.2} className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Want a full feature comparison?{" "}
              <Link
                to="/pricing"
                className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
              >
                View detailed pricing page
              </Link>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section className="border-t border-border bg-muted/30 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center">
            <Badge variant="secondary" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by subscribers everywhere
            </h2>
          </FadeUp>

          <Stagger className="mt-14 grid gap-8 sm:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <Card className="flex h-full flex-col border-border/60 bg-card/60 backdrop-blur-sm">
                  <CardContent className="flex flex-1 flex-col pt-6">
                    {/* Stars */}
                    <div className="mb-4 flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-current"
                        />
                      ))}
                    </div>
                    <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <FadeUp className="text-center">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
          </FadeUp>

          <FadeUp delay={0.15} className="mt-14">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="border-t border-border px-4 py-20 text-center sm:py-28">
        <FadeUp className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start saving today
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            The average SubSight user saves €47/month in their first week.
            What could you find?
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link to="/signup">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">Compare Plans</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free forever — no credit card required
          </p>
        </FadeUp>
      </section>
    </div>
  );
}
