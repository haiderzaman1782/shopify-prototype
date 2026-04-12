Build a dark-themed SaaS design agency landing page in Next.js 14 with Tailwind CSS and Framer Motion. Font: Syne (headings) + DM Sans (body) from Google Fonts. Dark background #0a0a08, lime accent #c8f135, card bg #141412, border #252520, text #e8e8e0, muted text #9a9a8a.

SECTIONS (in order):

1. STICKY NAVBAR — Logo left ("Atomic" with lime accent dot), nav links center (Features, How it works, Testimonials, FAQs), Login ghost button + "Get started" lime pill CTA right. Blur backdrop on scroll. Height 64px, padding 0 48px, border-bottom 1px #252520.

2. HERO SECTION — Full viewport height, centered content. Behind heading: large circle outline (700px, 1px lime rgba 12% border) + radial lime glow (rgba c8f135 6%). Pulsing green dot badge above H1. H1: "Design work, the efficient way" — Syne 88px, weight 800, letter-spacing -2.5px, color #f5f5ef, max-width 700px. Subtext: "Innovative design solutions for technology firms and emerging businesses weary of the typical aesthetic methodology, driving clarity." — DM Sans 15px, color #9a9a8a, max-width 420px. Below: email input (pill, bg #111110, border #252520, width 240px) + "Get started" lime pill button side by side.

3. LOGOS BAR — Border-top 1px #252520. Label: "Already chosen by the leaders" — 12px, uppercase, letter-spacing 0.5px, color #6b6b60. Below: 6 logo placeholder rectangles (height 20px, bg #252520, border-radius 4px, opacity 0.5, widths vary: 80px 90px 60px 100px 70px 85px) spaced evenly in a flex row.

4. INTRO BLOCK — bg #111110, border-top and border-bottom 1px #252520, centered, padding 80px 48px. Single large paragraph max-width 640px, font-size 22px, color #9a9a8a, line-height 1.6: "We know what's going on. You need top-notch design to stand out in the tech world, but hiring in-house designers is costly and time-consuming. That's when Atomic comes in." Bold and color #e8e8e0 the phrases: "top-notch design", "costly and time-consuming", "Atomic".

5. FEATURES GRID — Centered header: section tag "WHAT YOU GET" (lime pill tag) + title "We resolve problems associated with creative procedures." — Syne 48px 800 weight. Then 2-row × 3-column CSS grid, gap 2px:
   Row 1:
   - Card A: Placeholder div (160px tall, bg #181815, border-radius 10px, inner gradient lime 4%) with small bar chart SVG shapes (4 rects, lime color, varying heights). Title "Cost effective solution". Desc "Get high-quality design work at a fraction of the cost."
   - Card B: Badge "Latest design" (lime small pill). Placeholder UI mockup div (160px, bg #181815) showing fake browser chrome (3 colored dots + gray bar). Title "Tailor-made design". Desc "We've got the expertise to make your vision a reality."
   - Card C: Placeholder div (160px, bg #181815) with a centered glowing lime dot (20px, box-shadow lime glow) + radiating circle rings (2 circles, lime rgba borders). Title "Scalable as you grow". Desc "Solutions to meet your evolving needs."
   Row 2:
   - Card D (grid-column span 2): Row of 6 app icon placeholders (32×32px, bg #181815, border #252520, border-radius 8px). Title "Workflow integration". Desc "Seamlessly connect all your existing apps." Below desc: 3 small stat chips inline (e.g. "3 Integrations", "5 Workflows", "24/7 Support") — tiny pills bg #181815.
   - Card E: Stack of 4 overlapping avatar circles (36px, border-radius 50%, bg colors: #2a2a20 #1e2a1e #2a201e #20201e, border 2px #141412, margin-left -8px). Online badge "Team • Online" (small, lime dot + text). Title "Collaborate real-time". Desc "Seamlessly connect all your existing apps."
   All cards: bg #141412, border 1px #252520, padding 32px, hover bg #1a1a17, transition 200ms. First card border-radius 16px 0 0 0, third card 0 16px 0 0, fourth card 0 0 0 16px, last card 0 0 16px 0.

6. HOW IT WORKS — Centered header: section tag "HOW IT WORKS" + title "Top-notch designs, delivered at your doorstep." — Syne 48px. Then 3 cards in a row, each: icon in 56px circle (bg rgba lime 10%, border 1px rgba lime 20%, icon color lime), title Syne 18px bold, desc muted 13.5px. Cards: (1) Submit/arrow icon "Tell us your vision" "Share details about your design project." (2) Sparkle/magic icon "Receive the magic" "A dedicated expert designer will turn your ideas into reality." (3) Headset icon "Get ongoing support" "Your subscription grants you free continuous access to our design team."

7. CUSTOMER STORY — Two columns 50/50. Left: lime section tag "CUSTOMER STORY", large blockquote Syne 32px 700 weight color #f5f5ef: "Our growth no longer necessitates the recruitment and education of additional design professionals." Below: avatar placeholder circle 40px + name "Aihou Bankuku" + title "CEO, Nory" — muted 13px. Right: 16:9 placeholder div (bg #181815, border-radius 16px, border 1px #252520) with centered play button circle (56px, bg rgba lime 20%, border 1px rgba lime 40%, lime triangle icon inside).

8. STATS ROW — 3 stats centered in a flex row with dividers. Each stat: number Syne 64px 800 weight color #f5f5ef, label DM Sans 14px color #9a9a8a. Stats: "45+" / "Happy customers", "5k+" / "Hours spent on design", "4.8" / "Average rating".

9. TESTIMONIALS — Section tag "TESTIMONIALS" + title "What our client say about us." 2-row × 3-col grid, gap 16px. Each card: top row = avatar circle 40px (bg #252520) + name Syne 14px bold + role muted 12px. Review text muted 13px line-height 1.6. Bottom: 5 star icons (lime) + date muted 11px. Card bg #141412, border 1px #252520, padding 24px, border-radius 12px. 6 fake names: John Smith / Developer, Jason Williams / Designer, Mark Thompson / CEO, Michael Anderson / Founder, Nark Thompson / PM, Jason Williams / Marketer.

10. FAQ ACCORDION — Section tag "FAQ" + centered title "We've got the answers." 2-column layout, 4 questions per column. Each item: question text 14px color #e8e8e0 + "+" icon right. Click toggles answer text (muted 13px) with smooth height animation. Border-bottom 1px #252520 on each item. Questions: "Can I use Atomic Template for commercial purposes?" / "How do I get started with LumiFree?" / "What are Atomic Template's restrictions?" / "Accept the Template Usage Disclaimer" / "Disclaimer of Responsibility for Usage" / "Graphic Assets Attribution Notice" / "How to contact the author of this Template?" / "Asset and Understand Template restrictions."

11. FOOTER CTA — Full-width section, bg #0a0a08, centered. Behind content: radial gradient lime glow (rgba c8f135 8%, large ellipse). Section tag "GET STARTED". H2 Syne 64px 800 weight: "Elevate the way you source design." Subtext muted 15px. Email input + lime "Get started" pill button. Top border 1px #252520.

GLOBAL RULES:
- No images anywhere. All visuals are CSS/SVG placeholder divs.
- Framer Motion: page fade-in on load, sections stagger-reveal on scroll (viewport: once, margin -100px).
- All hover transitions 200ms ease.
- Tailwind CSS only for layout/spacing, CSS variables for colors.
- Single page.tsx file with all sections as inline components.
- Google Fonts loaded via next/font/google.
- Fully responsive: mobile breakpoints collapse grid to 1 col, nav collapses to hamburger.