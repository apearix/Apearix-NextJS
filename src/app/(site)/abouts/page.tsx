import React from 'react';
import { 
  ArrowRight, Code2, Smartphone, Puzzle, Bot, 
  CheckCircle2, ChevronDown, Monitor, Cpu, ShieldCheck, 
  Workflow, Zap, Layers, Server, Cloud, 
 Mail, Phone, Layout
} from 'lucide-react';

export default function ApearixLandingPage() {
  return (
    <div className="min-h-screen font-sans text-[#4B5563] bg-[#FFFFFF] selection:bg-[#F4F0FF] selection:text-[#6D28F5]">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-[20px] border-b border-[#E5E7EB]/80">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-[#111827] tracking-tight">Apearix</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <a href="#services" className="text-[#111827] hover:text-[#6D28F5] transition-colors">Services</a>
            <a href="#projects" className="text-[#111827] hover:text-[#6D28F5] transition-colors">Projects</a>
            <a href="#process" className="text-[#111827] hover:text-[#6D28F5] transition-colors">Process</a>
            <a href="#faq" className="text-[#111827] hover:text-[#6D28F5] transition-colors">FAQ</a>
          </div>
          <button className="bg-[#6D28F5] hover:bg-[#5B21E6] text-white h-12 px-6 rounded-[10px] text-sm font-medium transition-colors">
            Start Your Project
          </button>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="pt-40 pb-24 px-6 bg-gradient-to-b from-[#FFFFFF] via-[#FAFAFC] to-[#F4F0FF]">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[#6D28F5]"></span>
            <span className="text-sm font-medium text-[#111827]">Software Development Agency</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#111827] tracking-tight leading-tight mb-6">
            Software built for businesses that want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#5B21E6]">grow.</span>
          </h1>
          <p className="text-xl text-[#4B5563] leading-[1.7] mb-10 max-w-2xl mx-auto">
            We design and develop websites, mobile applications, browser extensions, and AI-powered automations that help businesses launch faster, work smarter, and scale with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto h-14 flex items-center justify-center gap-2 bg-[#6D28F5] hover:bg-[#5B21E6] text-white px-8 rounded-[10px] font-medium transition-colors shadow-md">
              Start Your Project <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto h-14 flex items-center justify-center gap-2 bg-white border border-[#DDD6FE] text-[#6D28F5] hover:bg-[#F4F0FF] px-8 rounded-[10px] font-medium transition-colors">
              View Our Work
            </button>
          </div>
        </div>
        
        {/* Main mockup placeholder container */}
        <div className="max-w-[1280px] mx-auto mt-16 rounded-[16px] border border-[#E5E7EB] bg-[#FAFAFC] p-8 shadow-xl overflow-hidden flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] bg-[#F4F0FF] px-4 py-1.5 rounded-full border border-[#DDD6FE] inline-block mb-3">Enterprise Dashboard Overview</span>
              <p className="text-[#6B7280] text-sm max-w-md">High-performance custom web applications, mobile platforms, and automated workflow solutions.</p>
            </div>
        </div>
      </section>

      {/* 2. Trusted by Ideas, Built for Growth */}
      <section className="py-24 px-6 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-sm font-bold text-[#6D28F5] uppercase tracking-wider mb-4">Every successful product starts with an idea</h2>
          <p className="text-2xl font-medium text-[#111827] mb-16 max-w-3xl mx-auto">
            We help turn that idea into software people use every day.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Projects Delivered", value: "40+" },
              { label: "Technologies We Use", value: "15+" },
              { label: "Industries Served", value: "8" },
              { label: "Years Building Software", value: "5+" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-[#FAFAFC] border border-[#E5E7EB] rounded-[12px]">
                <div className="text-4xl font-bold text-[#111827] mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. What We Build */}
      <section id="services" className="py-24 px-6 bg-[#F6F7FB]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-4">What We Build</h2>
            <p className="text-[#4B5563] text-lg max-w-2xl">End-to-end software development services tailored for modern businesses.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: <Monitor className="w-6 h-6" />, title: "Website Development", desc: "Fast, responsive websites built for businesses that care about performance and credibility." },
              { icon: <Smartphone className="w-6 h-6" />, title: "App Development", desc: "Mobile and web applications designed around real users and real business goals." },
              { icon: <Puzzle className="w-6 h-6" />, title: "Browser Extension Development", desc: "Extensions for Chrome and Microsoft Edge that automate workflows and improve productivity." },
              { icon: <Bot className="w-6 h-6" />, title: "AI Automation", desc: "Automate repetitive work using AI integrations and custom business workflows." }
            ].map((service, i) => (
              <div key={i} className="group p-8 bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm hover:border-[#DDD6FE] hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-[#F4F0FF] rounded-[10px] flex items-center justify-center text-[#6D28F5] mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{service.title}</h3>
                <p className="text-[#4B5563] leading-[1.7]">{service.desc}</p>
              </div>
            ))}
          </div>
          
          <button className="flex items-center gap-2 bg-white border border-[#DDD6FE] text-[#6D28F5] hover:bg-[#F4F0FF] h-12 px-6 rounded-[10px] font-medium transition-colors">
            Explore Services <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Why Businesses Choose Apearix */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-4">Built around quality, not shortcuts.</h2>
            <p className="text-[#4B5563] text-lg max-w-2xl">We prioritize sustainable engineering and clear communication over quick fixes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Code2 />, title: "Clean Engineering", desc: "Readable code, scalable architecture, and maintainable projects." },
              { icon: <Layers />, title: "Business First", desc: "Technology decisions are based on your business goals, not trends." },
              { icon: <Layout />, title: "Transparent Process", desc: "Know what's happening at every stage of development." },
              { icon: <Workflow />, title: "Long-Term Support", desc: "Launch is only the beginning. We help products evolve." },
              { icon: <Zap />, title: "Performance Matters", desc: "Fast loading, responsive, SEO-friendly, and optimized for growth." },
              { icon: <ShieldCheck />, title: "Security by Design", desc: "Modern development practices with security considered from day one." }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-[#FAFAFC] border border-[#E5E7EB] rounded-[12px]">
                <div className="text-[#6D28F5] mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{feature.title}</h3>
                <p className="text-[#6B7280] leading-[1.7] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How We Work */}
      <section id="process" className="py-24 px-6 bg-[#F4F0FF]/50">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-16 text-center">A simple, transparent process</h2>
          
          <div className="grid md:grid-cols-6 gap-4">
            {[
              { step: "1", title: "Discovery", desc: "We learn about your business, users, and goals." },
              { step: "2", title: "Planning", desc: "Define features, timelines, and technical approach." },
              { step: "3", title: "Design", desc: "Create intuitive interfaces before development begins." },
              { step: "4", title: "Development", desc: "Build reliable software using modern technologies." },
              { step: "5", title: "Testing", desc: "Every feature is tested before release." },
              { step: "6", title: "Launch & Support", desc: "Deploy with confidence and continue improving." }
            ].map((phase, i) => (
              <div key={i} className="relative">
                <div className="w-10 h-10 rounded-full bg-white border border-[#DDD6FE] flex items-center justify-center text-[#6D28F5] font-bold mb-4 shadow-sm z-10 relative">
                  {phase.step}
                </div>
                {i < 5 && <div className="hidden md:block absolute top-5 left-10 w-full h-[1px] bg-[#DDD6FE] z-0"></div>}
                <h3 className="font-bold text-[#111827] mb-2 text-sm">{phase.title}</h3>
                <p className="text-xs text-[#6B7280] leading-[1.6]">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Projects */}
      <section id="projects" className="py-24 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-16">Featured Projects</h2>
          
          <div className="space-y-16">
            {/* Project 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-[#FAFAFC] aspect-video rounded-[12px] border border-[#E5E7EB] p-8 flex items-center justify-center">
                <div className="text-[#6D28F5] text-sm font-semibold uppercase tracking-wider">Apearix Platform Interface</div>
              </div>
              <div>
                <div className="inline-block px-3 py-1 bg-[#F4F0FF] text-[#6D28F5] text-xs font-semibold rounded-full mb-4">SaaS Platform</div>
                <h3 className="text-2xl font-bold text-[#111827] mb-4">Business Management Platform</h3>
                <div className="space-y-4 mb-6 text-sm">
                  <p><strong>Problem:</strong> Disjointed tools causing workflow friction for mid-sized enterprises.</p>
                  <p><strong>Solution:</strong> A unified dashboard integrating analytics, HR, and project management.</p>
                  <p><strong>Result:</strong> 40% reduction in admin time and centralized data operations.</p>
                </div>
                <div className="flex gap-2 mb-8 flex-wrap">
                  {['Next.js', 'TypeScript', 'Tailwind', 'Node.js'].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-[#F6F7FB] border border-[#E5E7EB] rounded-[6px] text-xs text-[#6B7280]">{tech}</span>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-[#6D28F5] font-medium hover:text-[#5B21E6] transition-colors">
                  View Case Study <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Technology Stack & 8. Industries */}
      <section className="py-24 px-6 bg-[#FAFAFC] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          
          {/* Tech Stack */}
          <div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight mb-8">Technology Stack</h2>
            <div className="space-y-6">
              {[
                { category: "Frontend", tools: "React, Next.js, TypeScript, Tailwind CSS" },
                { category: "Backend", tools: "Node.js, Laravel, PHP, NestJS" },
                { category: "Mobile", tools: "Flutter, React Native" },
                { category: "Cloud", tools: "AWS, Vercel, Docker, GitHub" },
                { category: "AI", tools: "OpenAI, Claude, Gemini, Automation APIs" }
              ].map((stack, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-[#E5E7EB] pb-4">
                  <div className="w-24 font-semibold text-[#111827] text-sm">{stack.category}</div>
                  <div className="text-[#6B7280] text-sm">{stack.tools}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight mb-8">Industries We Serve</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Healthcare", "Education", "Real Estate", "Finance", 
                "Retail", "Manufacturing", "Professional Services", "Startups"
              ].map((industry, i) => (
                <div key={i} className="flex items-center gap-2 p-4 bg-white border border-[#E5E7EB] rounded-[14px]">
                  <div className="w-2 h-2 rounded-full bg-[#6D28F5]"></div>
                  <span className="text-sm font-medium text-[#4B5563]">{industry}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 9. Our Development Standards */}
      <section className="py-24 px-6 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-12">Our Development Standards</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              "Responsive on every device", "SEO-ready structure", 
              "Fast loading performance", "Secure authentication", 
              "Clean and documented code", "Scalable architecture", 
              "Version controlled", "Production deployment support"
            ].map((standard, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#F6F7FB] rounded-[14px]">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                <span className="font-medium text-[#111827] text-sm">{standard}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="py-24 px-6 bg-[#FAFAFC] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              "How long does a project take?",
              "Do you redesign existing software?",
              "Can you work with our existing development team?",
              "Do you provide ongoing maintenance?",
              "Who owns the source code?",
              "Can you sign an NDA?"
            ].map((question, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-[14px] p-5 cursor-pointer hover:border-[#DDD6FE] transition-colors flex justify-between items-center group">
                <span className="font-medium text-[#111827]">{question}</span>
                <ChevronDown className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#6D28F5] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Ready to Build? (CTA) */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#6D28F5] to-[#7C3AED]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight mb-6">Let's build software that lasts.</h2>
          <p className="text-[#F4F0FF] text-lg mb-10 max-w-2xl mx-auto opacity-90">
            Whether you're starting with an idea or improving an existing product, we're ready to help you build something people enjoy using.
          </p>
          <button className="bg-white text-[#6D28F5] hover:bg-[#FAFAFC] px-8 py-4 rounded-[14px] font-bold transition-colors shadow-[0_12px_35px_rgba(15,23,42,0.15)]">
            Book a Consultation
          </button>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="bg-[#0F172A] pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 md:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                <img src="/image_39d8f9.png" alt="Apearix Logo" className="w-8 h-8 object-contain filter brightness-0 invert" />
                <span className="text-xl font-bold text-white tracking-tight">Apearix</span>
              </div>
              <p className="text-[#CBD5E1] text-sm leading-relaxed max-w-xs mb-8">
                Building software that helps businesses grow, automate, and succeed in the digital world.
              </p>
              {/* <div className="flex items-center gap-4 text-[#94A3B8]">
                <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div> */}
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-[#94A3B8]">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Projects</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Services</h4>
              <ul className="space-y-4 text-sm text-[#94A3B8]">
                <li><a href="#" className="hover:text-white transition-colors">Website Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">App Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Extension Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Automation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-[#94A3B8]">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#94A3B8]">
            <div>© {new Date().getFullYear()} Apearix. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@apearix.com</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> Contact Us</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}