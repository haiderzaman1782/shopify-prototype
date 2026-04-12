import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUp,
  Sparkles, 
  Headphones, 
  Play, 
  Star,
  Plus,
  Minus,
  Menu,
  X,
  TrendingUp,
  Code2,
  Smartphone,
  Youtube,
  Mail
} from 'lucide-react';

// --- Premium Animation Components ---

const PageLoader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
      style={{ pointerEvents: 'none' }}
    >
      <motion.span
        className="text-[var(--saas-lime)] text-2xl font-bold tracking-widest"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
        transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1] }}
      >
        PROXIMUX
      </motion.span>
    </motion.div>
  )
}

const HeadingReveal = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const words = text.split(" ")

  return (
    <h2 ref={ref} className={`flex flex-wrap gap-x-2 sm:gap-x-3 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: "0%" } : { y: "100%" }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.07,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

const FadeInSection = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode, delay?: number, direction?: "up" | "down" | "left" | "right" }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

const CountUp = ({ end, duration = 2000, suffix = "", start = false }: { end: number, duration?: number, suffix?: string, start?: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return <span>{count}{suffix}</span>;
};

// --- Main App ---

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, margin: "-100px" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 100);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQs", href: "#faq" }
  ];

  const services = [
    { title: "Marketing That Converts", desc: "We craft paid and organic strategies that put your brand in front of the right audience at the right time.", icon: <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--saas-lime)] opacity-80" /> },
    { title: "Web Dev, Done Right", desc: "From landing pages to full-stack platforms — clean code, fast load times, zero fluff.", icon: <Code2 className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--saas-lime)] opacity-80" />, badge: "High Performance" },
    { title: "Apps People Actually Use", desc: "iOS & Android apps designed around user behavior, not just aesthetics.", icon: <Smartphone className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--saas-lime)] opacity-80" /> },
    { title: "YouTube on Autopilot", desc: "We script, edit, and upload — you collect the views, subscribers, and ad revenue.", icon: <Youtube className="w-20 h-20 sm:w-24 sm:h-24 text-[var(--saas-lime)] opacity-80" />, isWide: true },
    { title: "Email That Sells", desc: "Automated sequences, newsletters, and drip campaigns engineered for maximum ROI.", icon: <Mail className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--saas-lime)] opacity-80" /> }
  ];

  return (
    <div style={{ 
      backgroundColor: 'var(--saas-dark-bg)', 
      color: 'var(--saas-text)'
    }}>
      <PageLoader />
      
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ 
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, 
                      rgba(180,255,0,0.04), transparent 60%)` 
        }}
      />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '64px',
          borderBottom: `1px solid var(--saas-border)`,
          backgroundColor: scrolled ? 'rgba(10, 10, 8, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'all 200ms ease'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-1 touch-manipulation min-h-[44px]" style={{ fontFamily: 'Syne, sans-serif' }}>
            <span className="text-xl sm:text-2xl font-extrabold text-[#e8e8e0]">PROXIMUX</span>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--saas-lime)',
              display: 'inline-block'
            }}></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-base">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + i * 0.08, duration: 0.4 }}
                className="touch-manipulation min-h-[44px] flex items-center hover:text-[var(--saas-lime)] transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
            className="hidden md:flex items-center gap-3"
          >
            <button className="touch-manipulation min-h-[44px] min-w-[44px] px-4 hover:text-[var(--saas-lime)] transition-colors">
              Login
            </button>
            <button className="touch-manipulation min-h-[44px] px-5 sm:px-6 py-2 bg-[var(--saas-lime)] text-black rounded-[24px] text-sm lg:text-base font-medium transition-transform hover:scale-105 active:scale-95">
              Get Started
            </button>
          </motion.div>

          <button 
            className="flex md:hidden touch-manipulation min-h-[44px] min-w-[44px] p-2 items-center justify-center text-[var(--saas-text)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-16 left-0 right-0 z-50 shadow-2xl"
              style={{ 
                backgroundColor: 'var(--saas-card-bg)', 
                borderBottom: `1px solid var(--saas-border)`,
                padding: '20px'
              }}
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <motion.a 
                    key={link.name}
                    href={link.href} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setMobileMenuOpen(false)} 
                    className="touch-manipulation min-h-[44px] flex items-center text-lg"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <hr className="border-[var(--saas-border)]" />
                <button className="touch-manipulation min-h-[44px] text-left text-lg">
                  Login
                </button>
                <button className="touch-manipulation min-h-[44px] w-full bg-[var(--saas-lime)] text-black rounded-[24px] font-medium text-lg">
                  Get Started with PROXIMUX
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-screen py-16 sm:py-20 md:py-24 lg:py-32 flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-24 overflow-hidden">
        {/* Background circle and glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full border border-[rgba(200,241,53,0.12)] relative opacity-50">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.06)_0%,transparent_70%)]"></div>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Pulsing badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.5, ease: "backOut" }}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 bg-[rgba(200,241,53,0.1)] border border-[rgba(200,241,53,0.2)] rounded-[20px] text-xs sm:text-sm"
          >
            <motion.span 
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[var(--saas-lime)] inline-block"
            ></motion.span>
            <span className="text-[var(--saas-lime)]">🚀 Now Accepting New Clients</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#f5f5ef] mb-6 sm:mb-8 leading-[1.1]"
          >
            We Build. We Grow. We Automate.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--saas-muted)] max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed"
          >
            PROXIMUX is your all-in-one digital growth partner — from stunning websites and apps to automated YouTube channels and email funnels that print revenue.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 w-full sm:w-auto"
          >
            <input 
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-[280px] px-6 py-3 bg-[var(--saas-input-bg)] border border-[var(--saas-border)] rounded-[24px] text-[var(--saas-text)] text-sm sm:text-base outline-none focus:border-[var(--saas-lime)] transition-colors min-h-[44px] touch-manipulation"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-3 bg-[var(--saas-lime)] text-black rounded-[24px] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-transform min-h-[44px] touch-manipulation"
            >
              Get Started with PROXIMUX
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Services Badges Bar */}
      <section className="py-10 sm:py-12 border-y border-[var(--saas-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeInSection>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#6b6b60] text-center mb-8 px-2 uppercase">
              WHAT WE DO
            </p>
          </FadeInSection>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              { icon: <TrendingUp size={16} />, label: "Marketing" },
              { icon: <Code2 size={16} />, label: "Web Development" },
              { icon: <Smartphone size={16} />, label: "App Development" },
              { icon: <Youtube size={16} />, label: "YouTube Automation" },
              { icon: <Mail size={16} />, label: "Email Marketing" },
            ].map((service, i) => (
              <motion.div 
                key={service.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "backOut" }}
                whileHover={{ 
                  scale: 1.08, 
                  borderColor: "var(--saas-lime)",
                  backgroundColor: "rgba(200, 241, 53, 0.1)"
                }}
                className="rounded-full border border-[var(--saas-lime)]/30 px-5 py-2 text-sm font-medium tracking-wide text-white transition-colors flex items-center gap-2 touch-manipulation min-h-[44px] cursor-default"
              >
                <span className="text-[var(--saas-lime)]">{service.icon}</span>
                {service.label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Block */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-[var(--saas-input-bg)] border-y border-[var(--saas-border)]">
        <div className="max-w-3xl mx-auto">
          <FadeInSection delay={0.2}>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[var(--saas-muted)] leading-relaxed text-center">
              We know what's going on. You need <strong className="text-[var(--saas-text)] uppercase font-extrabold">top-notch digital growth</strong> to stand out in the tech world, but managing multiple agencies is <strong className="text-[var(--saas-text)] uppercase font-extrabold">costly and time-consuming</strong>. That's when <strong className="text-[var(--saas-text)] font-black tracking-tighter">PROXIMUX</strong> comes in.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <FadeInSection>
              <div className="inline-block mb-4 px-4 py-1.5 bg-[var(--saas-lime)] text-black rounded-[20px] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                OUR CORE OFFERINGS
              </div>
            </FadeInSection>
            <HeadingReveal className="justify-center" text="Comprehensive solutions to scale your business." />
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-[var(--saas-border)]"
          >
            {services.map((service, i) => (
              <FeatureCard 
                key={service.title}
                badge={service.badge}
                visual={service.icon}
                title={service.title}
                description={service.desc}
                className={`${i === 0 ? "md:rounded-tl-[16px]" : ""} ${i === 2 ? "lg:rounded-tr-[16px]" : ""} ${service.isWide ? "md:col-span-2 lg:col-span-2" : ""} ${i === 4 ? "md:rounded-br-[16px] lg:rounded-br-[16px]" : ""}`}
                isWide={service.isWide}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <FadeInSection>
              <div className="inline-block mb-4 px-4 py-1.5 bg-[var(--saas-lime)] text-black rounded-[20px] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                HOW IT WORKS
              </div>
            </FadeInSection>
            <HeadingReveal className="justify-center text-center" text="Results-driven growth, delivered at your doorstep." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: <ArrowRight />, title: "Tell us your vision", desc: "Share details about your growth goals and target audience." },
              { icon: <Sparkles />, title: "Receive the magic", desc: "Our specialized team of experts will turn your ideas into a revenue-generating machine." },
              { icon: <Headphones />, title: "Get ongoing support", desc: "Our partnership grants you continuous access to our growth and development teams." }
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <ProcessCard icon={item.icon} title={item.title} description={item.desc} />
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Story */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeInSection direction="right">
              <div className="inline-block mb-6 px-4 py-1.5 bg-[var(--saas-lime)] text-black rounded-[20px] text-[10px] sm:text-xs font-bold uppercase">
                CUSTOMER STORY
              </div>
              <blockquote className="font-syne text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#f5f5ef] mb-8 leading-tight">
                "Working with PROXIMUX has completely transformed our acquisition channel. We no longer worry about lead flow."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--saas-border)]"></div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-[var(--saas-text)]">
                    Aihou Bankuku
                  </div>
                  <div className="text-sm sm:text-base text-[var(--saas-muted)]">
                    CEO, Nory
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="left">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="aspect-video bg-[var(--saas-inner-bg)] rounded-xl border border-[var(--saas-border)] flex items-center justify-center shadow-2xl overflow-hidden relative"
              >
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[rgba(200,241,53,0.2)] border border-[rgba(200,241,53,0.4)] flex items-center justify-center text-[var(--saas-lime)] transition-transform touch-manipulation min-h-[44px] min-w-[44px]"
                >
                  <Play size={24} fill="currentColor" />
                </motion.button>
              </motion.div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section ref={statsRef} className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-8 bg-[var(--saas-dark-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 sm:gap-12">
            <Stat number={<CountUp end={50} suffix="+" start={isInView} duration={1800} />} label="Projects Delivered" />
            <Stat number={<CountUp end={98} suffix="%" start={isInView} duration={2200} />} label="Client Retention Rate" />
            <Stat number={<CountUp end={3} suffix="X" start={isInView} duration={1500} />} label="Average ROI" />
            <Stat number={<CountUp end={5} suffix="★" start={isInView} duration={2000} />} label="Client Rating" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <FadeInSection>
              <div className="inline-block mb-4 px-4 py-1.5 bg-[var(--saas-lime)] text-black rounded-[20px] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                TESTIMONIALS
              </div>
            </FadeInSection>
            <HeadingReveal className="justify-center" text="What our clients say about us." />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: "Sara M.", role: "E-commerce Founder", review: "PROXIMUX rebuilt our website and launched our email funnel. Revenue doubled in 60 days. Genuinely shocked.", rating: 5, date: "March 15, 2026" },
              { name: "James K.", role: "SaaS CEO", review: "Their YouTube automation service grew our channel to 10K subscribers in 3 months. Hands-off, high-output.", rating: 5, date: "March 10, 2026" },
              { name: "Layla R.", role: "Startup Founder", review: "The app they built for us was delivered on time, on budget, and our users love it. 5 stars, no question.", rating: 5, date: "March 5, 2026" }
            ].map((t, i) => (
              <TestimonialCard 
                key={t.name}
                index={i}
                {...t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-[var(--saas-input-bg)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <FadeInSection>
              <div className="inline-block mb-4 px-4 py-1.5 bg-[var(--saas-lime)] text-black rounded-[20px] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                FAQ
              </div>
            </FadeInSection>
            <HeadingReveal className="justify-center" text="We've got the answers." />
          </div>

          <div className="space-y-1">
            {[
              { q: "What services does PROXIMUX offer?", a: "We offer Marketing, Web Development, App Development, YouTube Automation, and Email Marketing — all under one roof." },
              { q: "How long does a typical project take?", a: "Web projects typically take 2–4 weeks. App development ranges from 6–12 weeks. Automation setups are usually live within 7 days." },
              { q: "Do you work with startups or only established businesses?", a: "Both. We have packages for early-stage startups and scaling enterprises alike." },
              { q: "What makes PROXIMUX different?", a: "We don't just deliver work — we deliver results. Every project is tied to a growth goal, not just a deliverable checklist." },
              { q: "How do I get started?", a: "Click 'Get Started with PROXIMUX' at the top of the page, fill out a short brief, and we'll be in touch within 24 hours." }
            ].map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <FAQItem 
                  index={i}
                  question={faq.q}
                  answer={faq.a}
                  openIndex={openFaqIndex}
                  setOpenIndex={setOpenFaqIndex}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-8 overflow-hidden border-t border-[var(--saas-border)]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[150px] sm:w-[600px] sm:h-[300px] lg:w-[800px] lg:h-[400px] rounded-[50%] bg-[radial-gradient(ellipse,rgba(200,241,53,0.08)_0%,transparent_70%)]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <div className="inline-block mb-6 px-4 py-1.5 bg-[var(--saas-lime)] text-black rounded-[20px] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            READY TO GROW?
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#f5f5ef] mb-8 leading-tight">
            We Build. We Grow. We Automate.
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--saas-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the leading tech companies that trust PROXIMUX for their growth needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 w-full sm:w-auto">
            <input 
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-[300px] px-6 py-4 bg-[var(--saas-input-bg)] border border-[var(--saas-border)] rounded-[24px] text-[var(--saas-text)] text-sm sm:text-base outline-none focus:border-[var(--saas-lime)] transition-colors min-h-[44px] touch-manipulation"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-4 bg-[var(--saas-lime)] text-black rounded-[24px] font-bold text-sm sm:text-base transition-transform min-h-[44px] touch-manipulation shadow-xl shadow-[var(--saas-lime)]/10"
            >
              Get Started with PROXIMUX
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-16 border-t border-[var(--saas-border)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center lg:text-left mb-16 lg:mb-24">
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-1 mb-6 text-xl sm:text-2xl font-extrabold font-syne touch-manipulation min-h-[44px]">
                <span className="text-[#e8e8e0]">PROXIMUX</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--saas-lime)]"></span>
              </div>
              <p className="text-sm sm:text-base text-[var(--saas-muted)] max-w-[240px]">
                Your growth partner for the digital age.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="text-base sm:text-lg font-bold text-[var(--saas-text)] mb-2">Services</h4>
              {["Marketing", "Web Development", "App Development"].map((link, i) => (
                <motion.a 
                  key={link} href="#" 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  whileHover={{ x: 4, color: "var(--saas-lime)" }}
                  className="text-sm sm:text-base text-[var(--saas-muted)] transition-colors touch-manipulation min-h-[44px]"
                >
                  {link}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-base sm:text-lg font-bold text-[var(--saas-text)] mb-2">Capabilities</h4>
              {["YouTube Automation", "Email Marketing", "Growth Strategy"].map((link, i) => (
                <motion.a 
                  key={link} href="#" 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  whileHover={{ x: 4, color: "var(--saas-lime)" }}
                  className="text-sm sm:text-base text-[var(--saas-muted)] transition-colors touch-manipulation min-h-[44px]"
                >
                  {link}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-base sm:text-lg font-bold text-[var(--saas-text)] mb-2">Support</h4>
              {["Contact Us", "Privacy Policy", "Terms of Service"].map((link, i) => (
                <motion.a 
                  key={link} href="#" 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  whileHover={{ x: 4, color: "var(--saas-lime)" }}
                  className="text-sm sm:text-base text-[var(--saas-muted)] transition-colors touch-manipulation min-h-[44px]"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-[var(--saas-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[var(--saas-muted)]">
            <p>© 2025 PROXIMUX. All rights reserved.</p>
            <div className="flex gap-6">
              <motion.a whileHover={{ y: -2, color: "var(--saas-lime)" }} href="#" className="hover:text-[var(--saas-lime)] transition-colors touch-manipulation min-h-[44px]">Twitter</motion.a>
              <motion.a whileHover={{ y: -2, color: "var(--saas-lime)" }} href="#" className="hover:text-[var(--saas-lime)] transition-colors touch-manipulation min-h-[44px]">LinkedIn</motion.a>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-[50px] right-[50px] z-50 w-12 h-12 rounded-full bg-[var(--saas-lime)] text-black flex items-center justify-center shadow-lg cursor-pointer border-0 touch-manipulation relative overflow-hidden"
            title="Scroll to top"
          >
            {/* Animated Arrow */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUp size={24} />
            </motion.div>

            {/* Pulsing Ripple (Clipped inside) */}
            <motion.div
              animate={{ 
                scale: [1, 2],
                opacity: [0.6, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 bg-white/40 rounded-full"
              style={{ pointerEvents: 'none' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Component Helpers ---

function FeatureCard({ badge, visual, title, description, className }: { badge?: string, visual: React.ReactNode, title: string, description: string, className?: string, isWide?: boolean }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.97 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`p-6 sm:p-8 lg:p-10 transition-all duration-300 relative group flex flex-col h-full bg-[var(--saas-card-bg)] hover:bg-[var(--saas-hover-bg)] ${className}`}
    >
      {badge && (
        <div className="mb-4 inline-block px-3 py-1 bg-[var(--saas-lime)] text-black rounded-full text-[10px] sm:text-xs font-bold w-fit">
          {badge}
        </div>
      )}
      <div className="mb-6 flex justify-center">{visual}</div>
      <h3 className="font-syne text-lg sm:text-xl lg:text-2xl font-bold text-[var(--saas-text)] mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-[var(--saas-muted)] leading-relaxed h-full">
        {description}
      </p>
    </motion.div>
  );
}

function ProcessCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[rgba(200,241,53,0.1)] border border-[rgba(200,241,53,0.2)] text-[var(--saas-lime)] transition-all group-hover:scale-110 group-hover:bg-[rgba(200,241,53,0.2)] shadow-sm">
        {icon}
      </div>
      <h3 className="font-syne text-lg sm:text-xl lg:text-2xl font-bold text-[var(--saas-text)] mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-[var(--saas-muted)] leading-relaxed max-w-[280px] mx-auto">
        {description}
      </p>
    </div>
  );
}

function Stat({ number, label }: { number: React.ReactNode, label: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      animate={isInView ? {
        textShadow: [
          "0 0 0px transparent",
          "0 0 20px var(--saas-lime)",
          "0 0 0px transparent"
        ]
      } : {}}
      className="text-center"
    >
      <div className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f5f5ef] leading-none mb-4">
        {number}
      </div>
      <div className="text-xs sm:text-sm md:text-base text-[var(--saas-muted)] uppercase tracking-widest font-medium">
        {label}
      </div>
    </motion.div>
  );
}

function TestimonialCard({ name, role, review, rating, date, index }: { name: string, role: string, review: string, rating: number, date: string, index: number }) {
  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, x: 60 }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: { delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="p-6 sm:p-8 bg-[var(--saas-card-bg)] border border-[var(--saas-border)] rounded-2xl flex flex-col h-full hover:border-[var(--saas-lime)] transition-colors"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--saas-border)] shrink-0"></div>
        <div>
          <div className="text-sm sm:text-base font-bold text-[var(--saas-text)] font-syne">
            {name}
          </div>
          <div className="text-xs sm:text-sm text-[var(--saas-muted)]">
            {role}
          </div>
        </div>
      </div>
      <p className="text-sm sm:text-base text-[var(--saas-muted)] leading-relaxed mb-6 h-full italic">
        "{review}"
      </p>
      <div className="flex items-center justify-between pt-6 border-t border-[var(--saas-border)] mt-auto">
        <div className="flex gap-1 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? "var(--saas-lime)" : "transparent"} color="var(--saas-lime)" />
          ))}
        </div>
        <div className="text-[10px] sm:text-xs text-[var(--saas-muted)]">
          {date}
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ index, question, answer, openIndex, setOpenIndex }: { index: number, question: string, answer: string, openIndex: number | null, setOpenIndex: (idx: number | null) => void }) {
  const isOpen = openIndex === index;

  return (
    <div className="border-b border-[var(--saas-border)]">
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex items-center justify-between gap-4 text-left py-5 sm:py-6 px-4 group touch-manipulation min-h-[44px]"
      >
        <span className={`text-sm sm:text-base font-bold transition-colors ${isOpen ? 'text-[var(--saas-lime)]' : 'text-[var(--saas-text)]'} group-hover:text-[var(--saas-lime)]`}>
          {question}
        </span>
        <span className="text-[var(--saas-lime)] shrink-0">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-4"
          >
            <p className="text-sm sm:text-base text-[var(--saas-muted)] leading-relaxed pb-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
