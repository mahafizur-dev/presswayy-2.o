import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Zap,
  Cpu,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  BarChart3,
  Users,
  ChevronDown,
  Play,
} from "lucide-react";

// --- Utility: Scroll Reveal Component ---
const RevealOnScroll = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1) transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Components ---

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer relative overflow-hidden group";
  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:-translate-y-1 border-none",
    secondary:
      "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-orange-500/50",
    outline:
      "bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out skew-y-12"></div>
      )}
    </button>
  );
};

const SectionHeading = ({ badge, title, subtitle, align = "center" }) => (
  <RevealOnScroll
    className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}
  >
    {badge && (
      <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-orange-400 uppercase bg-orange-900/30 rounded-full border border-orange-500/30 animate-pulse">
        {badge}
      </span>
    )}
    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
      {title}
    </h2>
    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
      {subtitle}
    </p>
  </RevealOnScroll>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <RevealOnScroll delay={delay}>
    <div className="group relative p-8 bg-zinc-900/50 border border-white/10 rounded-2xl transition-all duration-500 hover:bg-zinc-800/80 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/50">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-orange-500/30 group-hover:scale-150"></div>
      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner shadow-orange-500/10">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
        {description}
      </p>
    </div>
  </RevealOnScroll>
);

const StepCard = ({ number, title, text, delay }) => (
  <RevealOnScroll
    delay={delay}
    className="relative pl-8 md:pl-0 border-l-2 md:border-l-0 md:border-t-2 border-zinc-800 md:pt-8 flex flex-col gap-4 group hover:border-orange-500/50 transition-colors duration-500"
  >
    <div className="absolute -left-[9px] top-0 md:-top-[9px] md:left-0 w-4 h-4 rounded-full bg-zinc-800 border-2 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)] group-hover:scale-125 group-hover:bg-orange-500 transition-all duration-300"></div>
    <span className="text-5xl font-bold text-zinc-800 absolute top-4 right-4 md:static select-none group-hover:text-zinc-700 transition-colors duration-500">
      0{number}
    </span>
    <h3 className="text-xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
      {title}
    </h3>
    <p className="text-gray-400 text-sm">{text}</p>
  </RevealOnScroll>
);

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none bg-transparent border-none cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-white group-hover:text-orange-400 transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`text-orange-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-48 opacity-100 pb-6" : "max-h-0 opacity-0"}`}
      >
        <p className="text-gray-400 mt-2">{answer}</p>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Auto-Load Tailwind CSS for Localhost Support ---
  useEffect(() => {
    if (!document.querySelector('script[src*="tailwindcss"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Styles & Keyframes */}
      <style>{`
        body { background-color: #000; margin: 0; color: white; }
        .clip-path-triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }

        @keyframes message-pop-in {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-message-1 { animation: message-pop-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
        .animate-message-2 { animation: message-pop-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 2.5s forwards; opacity: 0; }
        
        @keyframes process-fade {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
        .animate-process { animation: process-fade 1.5s ease-in-out 1s forwards; opacity: 0; }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(249,115,22,0.1); }
          50% { box-shadow: 0 0 30px rgba(249,115,22,0.3); }
        }
        .animate-glow { animation: glow-pulse 3s infinite; }
      `}</style>

      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg" : "bg-transparent py-4"}`}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="flex items-center gap-1 font-bold text-2xl tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span className="text-white">press</span>
              <div className="relative h-6 w-6 mx-0.5 flex items-center justify-center">
                <div className="absolute bottom-0 w-4 h-5 bg-gradient-to-t from-orange-600 to-orange-400 clip-path-triangle group-hover:h-6 transition-all duration-300"></div>
                <div className="absolute bottom-0 w-0.5 h-3 bg-white/40 group-hover:bg-white group-hover:h-4 transition-all duration-300"></div>
              </div>
              <span className="text-white">wayy</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Results"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors no-underline relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <Button
              variant="primary"
              className="py-2 px-5 text-sm shadow-orange-500/20"
            >
              Book a Call
            </Button>
          </div>

          <button
            className="md:hidden text-white bg-transparent border-none cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-zinc-900 border-b border-white/10 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="p-6 flex flex-col gap-4">
            <a
              href="#features"
              className="text-lg font-medium text-white no-underline hover:text-orange-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#workflow"
              className="text-lg font-medium text-white no-underline hover:text-orange-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-lg font-medium text-white no-underline hover:text-orange-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Results
            </a>
            <Button variant="primary" className="w-full justify-center">
              Book a Call
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 rounded-[100%] blur-[120px] -z-10 animate-float opacity-40"></div>
        <div
          className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-900/10 rounded-[100%] blur-[120px] -z-10 animate-float opacity-30"
          style={{ animationDelay: "-5s" }}
        ></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-0"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <RevealOnScroll className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-sm font-medium mb-8 hover:bg-white/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Now integrating with WhatsApp & Instagram API
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight max-w-4xl mx-auto drop-shadow-2xl">
              Intelligent Workforce,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse">
                Empowering Humans.
              </span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={400}>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Presswayy 2.0 builds custom AI chatbots and automated workflows
              that handle 24/7 customer support and lead generation, so your
              team can focus on what matters.
            </p>
          </RevealOnScroll>

          <RevealOnScroll
            delay={600}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button className="w-full sm:w-auto h-14 text-lg shadow-orange-500/30 shadow-lg">
              Start Automating{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-auto h-14 text-lg"
            >
              <Play size={18} className="mr-2 fill-current" /> Watch Demo
            </Button>
          </RevealOnScroll>

          {/* Hero Visual Mockup - Live Chat Simulation */}
          <RevealOnScroll delay={800}>
            <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm p-2 shadow-2xl shadow-orange-500/10 animate-glow">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 rounded-xl blur opacity-20 animate-spin-slow"></div>
              <div className="relative rounded-lg overflow-hidden bg-zinc-900 aspect-[16/9] flex items-center justify-center border border-zinc-800">
                {/* UI Mockup Placeholder */}
                <div className="w-full h-full flex flex-col">
                  <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-2 bg-zinc-950">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:scale-110 transition-transform"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:scale-110 transition-transform"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:scale-110 transition-transform"></div>
                    <div className="ml-auto text-xs text-zinc-500 font-mono">
                      Presswayy_Dashboard.exe
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-4 hidden md:block">
                      <div className="h-8 w-3/4 bg-zinc-800 rounded mb-4 animate-pulse"></div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 opacity-50"
                          >
                            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                            <div className="h-3 w-1/2 bg-zinc-800 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Chat Area */}
                    <div className="flex-1 p-8 flex flex-col justify-center items-center relative overflow-hidden">
                      {/* Connecting Nodes Visual */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <div className="w-96 h-96 border border-orange-500/10 rounded-full flex items-center justify-center animate-spin-slow">
                          <div className="absolute w-2 h-2 bg-orange-500 rounded-full top-0"></div>
                        </div>
                        <div className="absolute w-64 h-64 border border-orange-500/20 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]"></div>
                      </div>

                      {/* Chat Messages */}
                      <div className="w-full max-w-md flex flex-col gap-4 relative z-10">
                        {/* User Message */}
                        <div className="self-start animate-message-1">
                          <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-lg">
                            <p className="text-sm text-gray-300">
                              How many qualified leads did we generate today?
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-600 ml-1 mt-1">
                            Just now
                          </span>
                        </div>

                        {/* Processing State */}
                        <div className="self-center animate-process absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur px-4 py-2 rounded-full border border-orange-500/30">
                          <div className="text-xs text-orange-500 flex items-center gap-2 font-mono">
                            <Cpu size={14} className="animate-spin" />
                            <span className="animate-pulse">
                              ANALYZING DATABASE...
                            </span>
                          </div>
                        </div>

                        {/* AI Response */}
                        <div className="self-end animate-message-2">
                          <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-4 rounded-2xl rounded-tr-none shadow-lg shadow-orange-500/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-white/10 animate-pulse"></div>
                            <div className="relative flex items-start gap-3">
                              <div>
                                <p className="text-sm text-white font-medium">
                                  Presswayy AI: We captured{" "}
                                  <span className="font-bold underline">
                                    142 leads
                                  </span>
                                  .
                                </p>
                                <p className="text-sm text-white/90 mt-1">
                                  28 booked calls directly. ROI is up 45% this
                                  week. 🚀
                                </p>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-600 mr-1 mt-1 block text-right">
                            0.4s response time
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-white/5 bg-white/2">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
            Powering Next-Gen Businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Simple Logo Animations on Hover */}
            {[
              "Acme Corp",
              "GlobalTech",
              "Nebula AI",
              "Vertex",
              "SaaS Flow",
            ].map((name, i) => (
              <span
                key={i}
                className="text-xl font-bold text-white hover:text-orange-500 hover:scale-110 transition-all duration-300 cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge="Features"
            title="Beyond Simple Chatbots"
            subtitle="We don't just build bots; we engineer complete intelligent ecosystems for your business."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              delay={0}
              icon={Bot}
              title="AI Conversational Agents"
              description="Deploy human-like agents on Instagram, WhatsApp, and Web that nurture leads 24/7 without sleeping."
            />
            <FeatureCard
              delay={100}
              icon={Zap}
              title="Instant Lead Qualification"
              description="Automatically filter tire-kickers from high-value prospects and book meetings directly into your calendar."
            />
            <FeatureCard
              delay={200}
              icon={Cpu}
              title="Custom Workflow Automation"
              description="Connect your CRM, Email, and Slack. When a lead comes in, Presswayy handles the data entry instantly."
            />
            <FeatureCard
              delay={300}
              icon={MessageSquare}
              title="Omnichannel Support"
              description="Manage all conversations from one unified dashboard. Never miss a DM or comment again."
            />
            <FeatureCard
              delay={400}
              icon={BarChart3}
              title="Sentiment Analysis"
              description="Our AI understands customer emotion, escalating angry customers to humans while solving simple queries alone."
            />
            <FeatureCard
              delay={500}
              icon={Users}
              title="CRM Integration"
              description="Seamlessly sync data with HubSpot, Salesforce, or Pipedrive. Your database stays pristine and up-to-date."
            />
          </div>
        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section
        id="workflow"
        className="py-24 bg-zinc-950 border-t border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll className="relative z-10">
              <span className="text-orange-500 font-bold tracking-wider text-sm uppercase mb-2 block animate-pulse">
                The Workflow
              </span>
              <h2 className="text-4xl font-bold text-white mb-6">
                From Chaos to Clarity
              </h2>
              <p className="text-gray-400 text-lg mb-10">
                Stop drowning in DMs and manual data entry. Here is how
                Presswayy 2.0 streamlines your operation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StepCard
                  delay={0}
                  number="1"
                  title="Connect"
                  text="We link your social channels and data sources to our secure AI engine."
                />
                <StepCard
                  delay={200}
                  number="2"
                  title="Train"
                  text="We train the AI on your brand voice, FAQs, and sales logic."
                />
                <StepCard
                  delay={400}
                  number="3"
                  title="Scale"
                  text="Launch and watch your response times drop to seconds."
                />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300} className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full animate-pulse-slow"></div>
              <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden group hover:border-orange-500/30 transition-colors">
                <div className="space-y-6">
                  {/* Static Chat Visuals for Workflow */}
                  <div className="flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
                    <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-white/5 w-full">
                      <div className="h-2 w-3/4 bg-zinc-700 rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-zinc-700 rounded"></div>
                    </div>
                  </div>
                  <div className="flex justify-center py-2">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                  </div>
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-lg shadow-orange-500/20">
                      PW
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tr-none border border-orange-500/20 w-full group-hover:bg-white/10 transition-colors">
                      <p className="text-white text-sm">
                        Automated response delivered instantly.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-xs text-green-500">
                          Synced to CRM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Trust/Testimonials */}
      <section
        id="testimonials"
        className="py-24 bg-black relative overflow-hidden"
      >
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading
            title="Trusted by Modern Teams"
            subtitle="See how we are helping businesses reclaim their time."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <RevealOnScroll
              delay={0}
              className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors duration-300"
            >
              <div className="flex text-orange-500 mb-4 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "Presswayy 2.0 completely transformed our customer service. We
                went from a 4-hour response time to instant replies."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full"></div>
                <div>
                  <h4 className="text-white font-bold">Sarah Jenkins</h4>
                  <p className="text-gray-500 text-sm">CMO, TechFlow</p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll
              delay={200}
              className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors duration-300"
            >
              <div className="flex text-orange-500 mb-4 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "The setup was incredibly fast. The AI sounded exactly like our
                best sales rep. It's like cloning your best employee."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full"></div>
                <div>
                  <h4 className="text-white font-bold">David Chen</h4>
                  <p className="text-gray-500 text-sm">Founder, E-Com Scale</p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll
              delay={400}
              className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors duration-300 hidden lg:block"
            >
              <div className="flex text-orange-500 mb-4 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "I was skeptical about AI, but Presswayy isn't just a chatbot.
                It's a full workflow automation tool. Highly recommended."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full"></div>
                <div>
                  <h4 className="text-white font-bold">Elena Rodriguez</h4>
                  <p className="text-gray-500 text-sm">
                    Director, Realty Group
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-3xl">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Frequently Asked Questions
            </h2>
          </RevealOnScroll>
          <div className="space-y-2">
            <FaqItem
              question="Does this replace my human support team?"
              answer="Not necessarily. Presswayy 2.0 acts as a first line of defense, handling 80% of repetitive queries. This allows your human team to focus on complex, high-value interactions."
            />
            <FaqItem
              question="Can I customize the AI's personality?"
              answer="Absolutely. During onboarding, we tune the AI to match your brand voice—whether that's professional, witty, or casual."
            />
            <FaqItem
              question="What platforms do you support?"
              answer="We currently support integration with Instagram DMs, Facebook Messenger, WhatsApp, and Website Chat widgets."
            />
            <FaqItem
              question="Is my data secure?"
              answer="Yes. We prioritize data security and use enterprise-grade encryption. We do not use your customer data to train public models."
            />
          </div>
        </div>
      </section>

      {/* CTA / Bottom Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Automate the Mundane?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join the forward-thinking companies using Presswayy 2.0 to scale
              their operations without scaling headcount.
            </p>
            <Button className="h-16 text-xl px-10 shadow-2xl shadow-orange-500/30 mx-auto animate-bounce-subtle">
              Get Your Free Audit
            </Button>
            <p className="mt-6 text-sm text-gray-500">
              No credit card required. 14-day free trial available.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-1 font-bold text-xl tracking-tight mb-6 group cursor-default">
                <span className="text-white">press</span>
                <div className="relative h-5 w-5 mx-0.5 flex items-center justify-center">
                  <div className="absolute bottom-0 w-3 h-4 bg-gradient-to-t from-orange-600 to-orange-400 clip-path-triangle group-hover:h-5 transition-all duration-300"></div>
                  <div className="absolute bottom-0 w-0.5 h-2.5 bg-white/40 group-hover:h-4 group-hover:bg-white transition-all duration-300"></div>
                </div>
                <span className="text-white">wayy</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Intelligent Workforce,
                <br />
                Empowering Humans.
              </p>
            </div>

            {/* Footer Links - simplified for brevity but fully functional */}
            {[
              {
                title: "Product",
                links: ["Features", "Integrations", "Pricing", "Case Studies"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Contact"],
              },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold mb-6">{col.title}</h4>
                <ul className="space-y-4 text-gray-500 text-sm">
                  {col.links.map((link) => (
                    <li
                      key={link}
                      className="hover:text-orange-500 cursor-pointer transition-colors hover:translate-x-1 duration-200 inline-block"
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs">
              © 2026 Presswayy 2.0. All rights reserved.
            </p>
            <div className="flex gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-5 h-5 bg-gray-800 rounded-full hover:bg-orange-500 cursor-pointer transition-all hover:scale-125 duration-300"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
