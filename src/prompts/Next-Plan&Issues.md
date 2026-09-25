# Apearix Next.js — Comprehensive Project Audit, Issues & Action Plan

> **Date:** September 9, 2026  
> **Framework:** Next.js 16.2.12 (Turbopack) | React 19.2.4 | Tailwind CSS v4 | Framer Motion 12.42  
> **Audit Status:** Read-Only Full Analysis (No code modifications applied)

---

## 1. Executive Summary

A complete systematic audit was performed across all routes, components, layouts, metadata configurations, and build/lint pipelines of the Apearix codebase.

### Key Highlights:
- **Build Status:** `next build` passes successfully (26 static pages generated).
- **ESLint & Compiler Status:** **Failed with 86 problems (24 errors, 62 warnings)**. Errors include React Compiler hook rule violations (`react-hooks/static-components`, `react-hooks/set-state-in-effect`), unescaped JSX entities, and explicit `any` usages.
- **Routing & Navigation Integrity:** **Severe 404 discrepancies exist**. Numerous links in the Navbar, Footer, Breadcrumbs, and `sitemap.ts` point to nonexistent routes (e.g., `/company/about`, `/services/ai-engineering`, `/solutions/*`, `/products`, `/work`).
- **Page Completeness:** Core layout and styling look modern and cohesive, but several sections are commented out, forms have no submit handlers or API routes, cards on Blog and Portfolio have no clickable links or detail pages, and a rogue duplicate page exists (`/abouts`).

---

## 2. All Pages Status & Audit Matrix

| Route | File Path | Status | Summary & Issues |
|---|---|---|---|
| `/` | `src/app/(site)/page.tsx` | 🟡 Partial | Landing page renders well, but deviates from `flow.md`. Sections like `AIIntelligentSystems`, `EngineeringProcess`, and `Testimonials` are commented out. Renders two separate tech stack sections (`TechStack` + `ModernTechStack`). |
| `/about` | `src/app/(apearix)/about/page.tsx` | 🟡 Partial / Buggy | Good content & schema, but canonical URL & breadcrumbs point to `/company/about` (which is a 404). Unescaped entity error in JSX. |
| `/abouts` | `src/app/(site)/abouts/page.tsx` | 🔴 Rogue / Deprecated | Old unpolished landing page prototype mistakenly routed at `/abouts`. Hardcoded `<a>` tags (`href="#services"`), unoptimized raw `<img>` referencing missing `/image_39d8f9.png`, unescaped entities. |
| `/careers` | `src/app/(apearix)/careers/page.tsx` | 🟡 Partial | Job postings look great, but canonical URL & breadcrumbs point to `/company/careers` (404). Apply button is generic `mailto:`. Unused `CTASection` import. |
| `/contact` | `src/app/(apearix)/contact/page.tsx` | 🟡 Partial / Non-functional | Form is purely static visual HTML. Has no `onSubmit` handler, no state, no feedback toast/dialog, and no `/api/contact` backend handler. Breadcrumbs and canonical point to `/company/contact` (404). Unused `MapPin` import. |
| `/services/web-development` | `src/app/services/web-development/page.tsx` | 🟢 Complete | Well structured with JSON-LD schema, feature grid, and breadcrumbs. Unused imports (`Monitor`, `ArrowRight`, `Link`, `CTASection`). |
| `/services/saas-development` | `src/app/services/saas-development/page.tsx` | 🟢 Complete | Well structured, clean schema. Unused `CTASection`, `Cpu`, `CheckCircle2` imports. |
| `/services/ai-automation` | `src/app/services/ai-automation/page.tsx` | 🟢 Complete | Strong copy and structure. Unused `CTASection`, `Sparkles`, `CheckCircle2` imports. |
| `/services/ui-ux-design` | `src/app/services/ui-ux-design/page.tsx` | 🟢 Complete | Clean layout and schema. Unused `CTASection`, `Sparkles`, `CheckCircle2` imports. |
| `/services/mobile-app-development` | `src/app/services/mobile-app-development/page.tsx` | 🟢 Complete | Clean layout and schema. Unused `CTASection`, `CheckCircle2` imports. |
| `/services/cloud-devops` | `src/app/services/cloud-devops/page.tsx` | 🟢 Complete | Clean layout and schema. Unused `CTASection`, `Cpu`, `CheckCircle2` imports. |
| `/work/portfolio` | `src/app/work/portfolio/page.tsx` | 🟡 Partial | High visual quality, but project cards have arrow icons that do not link anywhere (non-clickable). Breadcrumbs point to missing `/work`. Unused `CTASection`. |
| `/work/case-studies` | `src/app/work/case-studies/page.tsx` | 🟡 Partial | Detailed case studies, but "Discuss Similar Solution" button links to `/company/contact` (404). Breadcrumbs point to missing `/work`. Unused `CTASection`. |
| `/resources/blog` | `src/app/resources/blog/page.tsx` | 🟡 Incomplete | 4 article previews displayed with "Read Article" CTA, but cards have **no links** and there is **no dynamic `[slug]` page** to read them. Breadcrumbs point to `/resources` (404). |
| `/resources/faq` | `src/app/resources/faq/page.tsx` | 🟢 Complete | Accordion works cleanly. SearchAction in `layout.tsx` advertises `/resources/faq?q={query}`, but page does not support URL query filtering. |
| `/legal/privacy-policy` | `src/app/legal/privacy-policy/page.tsx` | 🟢 Complete | Standard legal page with metadata and breadcrumbs. |
| `/legal/terms-and-conditions` | `src/app/legal/terms-and-conditions/page.tsx` | 🟢 Complete | Standard legal terms with metadata and breadcrumbs. |
| `/legal/cookie-policy` | `src/app/legal/cookie-policy/page.tsx` | 🟡 Minimal | Very brief (2 short paragraphs). Commented out in footer. |
| `/work` (parent) | N/A | 🔴 Missing | Linked in Navbar (`/work`), but folder has no `page.tsx`. Causes 404! |
| `/services` (parent) | N/A | 🔴 Missing | No overview page for all services. |
| `/solutions/*` | N/A | 🔴 Missing | Linked in Navbar (4 sub-links), but directory does not exist. Causes 404! |
| `/products/*` | N/A | 🔴 Missing | Linked in Navbar and Footer, but directory does not exist. Causes 404! |

---

## 3. Critical Bugs & Broken Links (404 Audit)

### 3.1. Google Sitemap (`sitemap.ts`) Points to 404 URLs
In `src/app/sitemap.ts`, lines 9–11 specify:
- `/company/about`
- `/company/careers`
- `/company/contact`

**Issue:** Because `(apearix)` is a Next.js route group, the actual live URLs are `/about`, `/careers`, and `/contact`. The `/company/*` routes return **404 Not Found**. Submitting this sitemap to Google Search Console leads to indexing penalties.

### 3.2. Navbar (`Navbar.tsx`) Broken Links
The desktop & mobile menus contain dead routes:
- `Services -> AI Engineering`: links to `/services/ai-engineering` (404 — actual page is `/services/ai-automation`)
- `Services -> Software Engineering`: links to `/services/software-engineering` (404 — actual pages are `/services/web-development` & `/services/saas-development`)
- `Services -> Product Design`: links to `/services/product-design` (404 — actual page is `/services/ui-ux-design`)
- `Solutions -> All 4 links`: `/solutions/ai-automation`, `/solutions/business-systems`, `/solutions/internal-tools`, `/solutions/digital-transformation` all return 404 (no `solutions` folder exists).
- `Products -> All 2 links`: `/products/labs`, `/products` return 404 (no `products` folder exists).
- `Direct Links -> Work`: links to `/work` which returns 404 (only `/work/portfolio` and `/work/case-studies` exist).

### 3.3. Footer (`Footer.tsx`) Broken Links & Dead Anchors
- `Services -> AI Engineering`: `/services/ai-engineering` (404)
- `Services -> Software Development`: `/services/software-engineering` (404)
- `Services -> Automation`: `/services/automation` (404 — actual is `/services/ai-automation`)
- `Products`: `/products`, `/products#smarttabs`, `/products#ai-products`, `/products#developer-tools` (all 404)
- `Resources`:
  - `Blog`: `href="#"` (Should be `/resources/blog`)
  - `Documentation`: `href="#"` (Does not exist)
  - `FAQ`: `href="#"` (Should be `/resources/faq`)
- `Cookie Policy`: Link is commented out even though `/legal/cookie-policy` exists.
- Unused dead data arrays: `quickLinks`, `solutionsList` define dead routes like `/company/about`.

### 3.4. Canonical & Breadcrumb URL Discrepancies
- **`about/page.tsx`**:
  - `canonical`: `https://www.apearix.com/company/about` (Mismatch! Live route is `/about`)
  - `breadcrumbs`: points to `/company/about` (404)
- **`careers/page.tsx`**:
  - `canonical`: `https://www.apearix.com/company/careers` (Mismatch! Live route is `/careers`)
  - `breadcrumbs`: points to `/company/about` and `/company/careers` (404)
- **`contact/page.tsx`**:
  - `canonical`: `https://www.apearix.com/company/contact` (Mismatch! Live route is `/contact`)
  - `breadcrumbs`: points to `/company/about` and `/company/contact` (404)
- **`case-studies/page.tsx`**:
  - CTA button: `<Link href="/company/contact">` (404!)

### 3.5. Missing Logo Endpoint `/icon`
In `RootLayout` (`src/app/layout.tsx`) and `src/app/manifest.ts`:
- Referenced icon: `/icon` (e.g., `<script>` Schema.org `"logo": "https://www.apearix.com/icon"`, manifest icon `src: "/icon"`)
- **Bug:** There is no `src/app/icon.tsx` or `public/icon.png`. Only `apple-icon.tsx` and `favicon.ico` exist. This results in a 404 for search engine rich result scrapers.

---

## 4. Code Quality, ESLint & React Compiler Errors

Running `npm run lint` generates **86 problems (24 errors, 62 warnings)**.

### 4.1. React Compiler Violations: Nested Component Creation
- **File:** `src/components/layout/Navbar.tsx:74`
- **Error:** `Cannot create components during render` (`react-hooks/static-components`)
- **Detail:** `const DesktopDropdown = ({ title, id, items }: ... ) => (...)` is defined *inside* the `Navbar` component body. This causes the dropdown component to be re-instantiated on every re-render of `Navbar` (e.g., on every scroll event), destroying internal state and breaking React Compiler optimizations.
- **Fix:** Move `DesktopDropdown` outside the `Navbar` component or extract it to a standalone helper component.

### 4.2. Synchronous State Updates Inside `useEffect`
- **Files:**
  - `src/components/common/ApearixPreloader.tsx` (lines 16, 31)
  - `src/components/common/ApearixPreloader.lite.tsx` (lines 16, 30, 48)
- **Error:** `Calling setState synchronously within an effect can trigger cascading renders` (`react-hooks/set-state-in-effect`)
- **Detail:** Direct synchronous calls `setMounted(true)` and `setMinTimeElapsed(true)` trigger immediate extra render passes.
- **Fix:** Use transition/timing callbacks or derive state appropriately.

### 4.3. Unescaped JSX Entities (`react/no-unescaped-entities`)
Unescaped quotes and apostrophes in JSX text trigger build/lint errors:
- `src/app/(apearix)/about/page.tsx:132`: `That's` -> should be `That&apos;s`
- `src/app/(site)/abouts/page.tsx:292, 294`: `Let's`, `you're`, `we're`
- `src/components/layout/Navbar.tsx:157, 229`: `Let's Build` -> `Let&apos;s Build`
- `src/components/sections/EngineeringProcess.tsx:138`: `"We don't just build interfaces..."` -> `&quot;We don&apos;t...&quot;`
- `src/components/sections/Testimonials.tsx:61`: `"{t.quote}"` -> `&ldquo;{t.quote}&rdquo;`
- `src/components/sections/WhatWeBuild.tsx:193`: `Let's discuss` -> `Let&apos;s discuss`

### 4.4. TypeScript Explicit `any` Warnings/Errors
- `src/components/layout/Navbar.tsx:74`: `items: any[]` -> Needs strict `NavItem` type.
- `src/components/sections/HowWeWork.tsx:139`: `step: any` -> Needs strict `StepItem` type.
- `src/components/sections/Metrics.tsx:28`: `item: any`
- `src/components/sections/Process.tsx:97`: `step: any`

### 4.5. Tailwind CSS & Class Name Typos
- `src/components/sections/WhatWeBuild.tsx:85`: `className="ustify-between mb-8 gap-6"` (Missing 'j' -> should be `justify-between`).
- Turbopack warning during build: `z-index is currently not supported` when processing theme values.

---

## 5. Home Page vs. Target Landing Flow (`flow.md`)

In `src/app/home/flow.md`, the landing page structure is specified as:
```text
1. Navbar
2. Hero
3. Trusted / Technology Strip
4. What We Build
5. AI & Intelligent Systems
6. Software Engineering
7. Products / Solutions
8. How We Work
9. Featured Work / Case Studies
10. Why Apearix
11. CTA
12. Footer
```

### Current Status in `src/app/(site)/page.tsx`:
1. **Navbar** (`<Navbar />`): Rendered.
2. **Hero** (`<Hero />`): Rendered.
3. **Technology Strip** (`<TechStack />`): Rendered.
4. **What We Build** (`<WhatWeBuild />`): Rendered.
5. **AI & Intelligent Systems**: **COMMENTED OUT** (`{/* <AIIntelligentSystems /> */}`).
6. **Software Engineering**: **COMMENTED OUT** (`{/* <EngineeringProcess /> */}`).
7. **Products / Solutions**: Rendered by `<CaseStudies />` (which renders Products: SmartTabs, ApxBill, Labs — not case studies!).
8. **Why Apearix** (`<WhyApearix />`): Rendered before How We Work (order swapped).
9. **How We Work** (`<HowWeWork />`): Rendered.
10. **ModernTechStack** (`<ModernTechStack />`): **Extra section inserted** (duplicates tech stack info right below How We Work).
11. **PerformanceSEO** (`<PerformanceSEO />`): **Extra section inserted**.
12. **Featured Work / Case Studies**: **MISSING entirely** on the home page! (`CaseStudiesOld.tsx` contains the actual case studies, but is not used).
13. **Testimonials**: **COMMENTED OUT** (`{/* <Testimonials /> */}`).
14. **FAQ Section** (`<FAQSection />`): Rendered.
15. **CTA Section** (`<CTASection />`): Rendered.
16. **Footer** (`<Footer />`): Rendered.

---

## 6. Interactive Components & Functional Gaps

### 6.1. Contact Form (`/contact`)
- **Status:** Static mockup only.
- **Problems:**
  - No React state (`useState`) bound to inputs.
  - Submitting triggers a default browser form POST / refresh without sending data.
  - No validation (email format, minimum message length).
  - No success / error UI state (alert, toast, or confirmation screen).
  - No API endpoint (e.g., `src/app/api/contact/route.ts` via Resend/Nodemailer/webhook) exists.

### 6.2. Blog Section (`/resources/blog`)
- **Status:** Read-only teaser cards.
- **Problems:**
  - "Read Article" button has no `<Link>` or `href`.
  - No dynamic routing `src/app/resources/blog/[slug]/page.tsx`.
  - Clicking any of the 4 blog posts does nothing.

### 6.3. Portfolio Section (`/work/portfolio`)
- **Status:** Static display cards.
- **Problems:**
  - Arrow icons on project cards have no links to live demos or case study deep-dives.
  - No filter by category (SaaS, AI, Mobile, Web).

### 6.4. BackToTop Button (`BackToTop.tsx`)
- **Status:** Permanently visible.
- **Problems:**
  - The button is rendered with `fixed bottom-6 right-6` at all times, even when the user is at the very top of the page (`scrollY === 0`).
  - Should only appear after scrolling down (e.g., `scrollY > 400`) wrapped in `<AnimatePresence>`.

### 6.5. Preloader (`ApearixPreloader.tsx`)
- Has two duplicate implementations: `ApearixPreloader.tsx` and `ApearixPreloader.lite.tsx`.
- Uses `sessionStorage.getItem('apearix-intro-seen')`. If session storage is blocked or in certain SSR scenarios, potential hydration mismatches may occur without careful hydration shielding.

### 6.6. Rogue Prototype Page (`/abouts`)
- The file `src/app/(site)/abouts/page.tsx` is an obsolete prototype that duplicates the landing page under a broken URL.
- Contains dead links, raw `<img>` tags, and unescaped entity errors.
- **Recommendation:** Safely delete or archive this file.

---

## 7. Recommended Action Plan & Roadmap

### Phase 1: Lint, Types & Compiler Errors (Immediate Priority)
1. **Fix `Navbar.tsx`:** Extract `DesktopDropdown` outside the `Navbar` component function and define strict TypeScript interfaces for navigation items.
2. **Fix Unescaped Entities:** Escape all `'` (`&apos;`) and `"` (`&quot;` / `&ldquo;` / `&rdquo;`) in `about/page.tsx`, `Navbar.tsx`, `EngineeringProcess.tsx`, `Testimonials.tsx`, and `WhatWeBuild.tsx`.
3. **Fix Typing (`any`):** Replace `any` in `HowWeWork.tsx`, `Navbar.tsx`, `Metrics.tsx`, and `Process.tsx` with dedicated types.
4. **Fix Preloader Hooks:** Refactor state initialization in `ApearixPreloader.tsx` to eliminate synchronous `setState` warnings in `useEffect`.
5. **Fix Typo:** Fix `ustify-between` -> `justify-between` in `WhatWeBuild.tsx`.

### Phase 2: Navigation & Routing Integrity (Fix 404s)
1. **Harmonize Routes:** Decide on final URL structure:
   - Keep `/about`, `/careers`, `/contact` (standard clean URLs).
   - Update `sitemap.ts` to use `/about`, `/careers`, `/contact` (remove `/company/*`).
   - Update all `canonical` URLs and `breadcrumbs` in `about/page.tsx`, `careers/page.tsx`, `contact/page.tsx`, and `case-studies/page.tsx` to point to the actual live routes.
2. **Fix Navbar Links:**
   - Map Services to existing pages:
     - AI Engineering -> `/services/ai-automation`
     - Software Engineering -> `/services/web-development`
     - SaaS Development -> `/services/saas-development`
     - Cloud & DevOps -> `/services/cloud-devops`
     - Product Design -> `/services/ui-ux-design`
     - Add Mobile App Dev -> `/services/mobile-app-development`
   - Map Direct Link `Work` to `/work/portfolio` or create a `/work/page.tsx` hub.
   - Either create the missing `/solutions/*` and `/products/*` pages or adjust the Navbar to only link to existing sections/pages.
3. **Fix Footer Links:**
   - Point `Blog` to `/resources/blog`.
   - Point `FAQ` to `/resources/faq`.
   - Remove dead `#` links and clean up unused arrays.
4. **Add Favicon / Icon Endpoints:**
   - Create `src/app/icon.tsx` (similar to `apple-icon.tsx`) so that `/icon` returns a clean 32x32 PNG icon as declared in metadata and `manifest.ts`.
5. **Delete Rogue `/abouts` Page:** Remove `src/app/(site)/abouts/page.tsx`.

### Phase 3: Home Page Alignment with `flow.md`
1. Re-enable or reposition `<AIIntelligentSystems />` and `<EngineeringProcess />` as intended by `src/app/home/flow.md`.
2. Rename or reorganize `<CaseStudies />` (which shows Products) vs `<CaseStudiesOld />` (which shows actual client case studies) so users can view real case studies on the home page.
3. Fix "Explore Service" buttons in `<WhatWeBuild />` so each card links to its specific service page instead of all pointing to `/contact`.
4. Decide whether to keep or streamline `<ModernTechStack />` vs `<TechStack />` to prevent redundancy.

### Phase 4: Functional Enhancements
1. **Contact Form Implementation:**
   - Convert `contact/page.tsx` form into a client-interactive component with React state, validation, and loading spinners.
   - Create `src/app/api/contact/route.ts` to handle message delivery (email or webhook) securely.
2. **Blog Dynamic Routing:**
   - Create `src/app/resources/blog/[slug]/page.tsx` to allow full reading of articles.
   - Link the article cards in `/resources/blog` to their respective slugs.
3. **BackToTop Scroll Listener:**
   - Add scroll threshold check (`window.scrollY > 400`) before rendering the button.
4. **Clean up Dead / Deprecated Files:**
   - Archive or remove `CTASectionOld.tsx`, `CaseStudiesOld.tsx`, `TechStackOld.tsx`, `WhyApearixOld.tsx`, `FooterOld.tsx`, and `ApearixPreloader.lite.tsx`.
