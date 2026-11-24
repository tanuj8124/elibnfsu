"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowDownRight,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react"

const notices = [
  {
    category: "Library update",
    date: "24 Nov 2026",
    title: "Extended access to forensic science e-journals",
    summary: "Explore the latest research through the university’s digital journal collection. Sign in with your NFSU credentials for off-campus access.",
    icon: BookOpen,
    tone: "blue",
    tag: "Access",
  },
  {
    category: "Academic notice",
    date: "21 Nov 2026",
    title: "New resources added to the digital repository",
    summary: "Recent theses, dissertations and conference proceedings are now available to browse in the institutional repository.",
    icon: FileText,
    tone: "gold",
    tag: "Repository",
  },
  {
    category: "Recruitment",
    date: "18 Nov 2026",
    title: "Temporary contractual Hindi translation recruitment — registration open",
    summary: "Eligible applicants may register their interest for temporary contractual Hindi translation work with the university.",
    icon: GraduationCap,
    tone: "red",
    tag: "Opportunity",
  },
  {
    category: "Library services",
    date: "14 Nov 2026",
    title: "Research support and citation clinic schedule",
    summary: "Book a one-to-one session with the library team for literature discovery, citation tools and research data guidance.",
    icon: CalendarDays,
    tone: "green",
    tag: "Support",
  },
]

const collections = [
  { title: "E-books & textbooks", detail: "Browse multidisciplinary e-book collections", icon: BookOpen, count: "12,400+ titles" },
  { title: "Research journals", detail: "Peer-reviewed journals and databases", icon: FileText, count: "80+ databases" },
  { title: "Digital repository", detail: "Theses, dissertations and university research", icon: ShieldCheck, count: "Open access" },
]

export function LibraryHomepage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [noticeFilter, setNoticeFilter] = useState("All notices")
  const filteredNotices = notices.filter((notice) => {
    const matchesFilter = noticeFilter === "All notices" || notice.category === noticeFilter
    const matchesQuery = `${notice.title} ${notice.summary} ${notice.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })

  return (
    <div className="site-shell">
      <div className="announcement-bar">
        <div className="announcement-inner">
          <span className="announcement-label"><span className="live-dot" /> Library bulletin</span>
          <a href="/work-based-learning" className="announcement-link">
            Temporary contractual Hindi translation recruitment: registration is open <span className="new-pill">NEW</span>
            <ArrowRight aria-hidden="true" size={15} />
          </a>
          <span className="announcement-date"><Clock3 aria-hidden="true" size={13} /> Updated 24 Nov 2026</span>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="NFSU e-Library home">
            <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-7gm0thPZNvlohywweVMIWvQQH3uqph.png" alt="National Forensic Sciences University crest" width={84} height={100} className="brand-crest" unoptimized />
            <span className="brand-copy">
              <span className="brand-university">National Forensic Sciences University</span>
              <span className="brand-library">E-Library</span>
              <span className="brand-subtitle">Knowledge. Discovery. Justice.</span>
            </span>
          </a>
          <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
            <a href="#notices" onClick={() => setMenuOpen(false)}>Notices</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Library services</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          </nav>
          <a className="header-login" href="#collections">University access <ArrowRight aria-hidden="true" size={15} /></a>
        </div>
      </header>

      <main id="home">
        <section className="hero-section">
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow"><span /> THE DIGITAL GATEWAY TO KNOWLEDGE</div>
              <h1>Research begins<br />with <em>discovery.</em></h1>
              <p className="hero-description">Explore a world of trusted academic resources, specialist research and knowledge in forensic sciences.</p>
              <form className="search-box" role="search" onSubmit={(event) => { event.preventDefault(); document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" }) }}>
                <Search aria-hidden="true" size={19} />
                <label className="sr-only" htmlFor="library-search">Search the library</label>
                <input id="library-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books, journals, theses..." />
                <button type="submit">Search <ArrowRight aria-hidden="true" size={16} /></button>
              </form>
              <div className="hero-quick-links">
                <span>Popular:</span><a href="#collections">Forensic toxicology</a><i /> <a href="#collections">Digital evidence</a><i /> <a href="#collections">Criminology</a>
              </div>
            </div>
            <div className="hero-art" aria-label="Illustration of a quiet library and open book">
              <div className="hero-art-halo" />
              <div className="book-stack stack-back"><span /><span /><span /></div>
              <div className="book-stack stack-front"><span /><span /><span /></div>
              <div className="open-book"><div className="book-page page-left"><span /><span /><span /><span /><span /></div><div className="book-page page-right"><span /><span /><span /><span /><span /></div></div>
              <div className="hero-art-label"><span className="label-icon"><BookOpen size={18} /></span><span><b>Knowledge, at your fingertips</b><small>Explore the digital collection</small></span><ArrowDownRight size={17} /></div>
              <div className="floating-stamp"><span>EST.</span><b>2009</b><small>NEW DELHI</small></div>
              <div className="sparkle sparkle-one" /><div className="sparkle sparkle-two" />
            </div>
          </div>
          <div className="hero-bottom-rule"><span /> <span /> <span /></div>
        </section>

        <section className="stat-strip" aria-label="Library highlights">
          <div className="stat-inner">
            <div className="stat-intro">A universe of knowledge,<br /><strong>curated for you.</strong></div>
            <div className="stat-item"><strong>12<span>k+</span></strong><small>Digital resources</small></div>
            <div className="stat-item"><strong>80<span>+</span></strong><small>Research databases</small></div>
            <div className="stat-item"><strong>24<span>/7</span></strong><small>Online access</small></div>
            <a href="#collections" className="stat-explore">Explore the library <ArrowRight size={16} /></a>
          </div>
        </section>

        <section className="content-section" id="collections">
          <div className="section-heading">
            <div><div className="eyebrow dark"><span /> YOUR LIBRARY, ONLINE</div><h2>Explore our <em>collections</em></h2><p>Find the resources you need to learn, investigate and move your research forward.</p></div>
            <a href="#services" className="text-link">View all resources <ArrowRight size={16} /></a>
          </div>
          <div className="collection-grid">
            {collections.map(({ title, detail, icon: Icon, count }, index) => (
              <a href="#services" className={`collection-card collection-${index + 1}`} key={title}>
                <div className="collection-top"><span className="collection-icon"><Icon size={21} strokeWidth={1.7} /></span><span className="collection-count">{count}</span></div>
                <h3>{title}</h3><p>{detail}</p><span className="collection-action">Explore collection <ArrowRight size={15} /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="notice-section" id="notices">
          <div className="notice-layout">
            <div className="notice-intro">
              <div className="eyebrow dark"><span /> STAY IN THE KNOW</div>
              <div className="notice-title-row"><h2>Latest <em>notices</em></h2><span className="notice-count">{filteredNotices.length.toString().padStart(2, "0")}</span></div>
              <p>Library updates, academic announcements and opportunities from across the university.</p>
              <div className="notice-controls">
                <label className="filter-select-wrap" htmlFor="notice-filter"><span className="sr-only">Filter notices by category</span><select id="notice-filter" value={noticeFilter} onChange={(event) => setNoticeFilter(event.target.value)}><option>All notices</option><option>Library update</option><option>Academic notice</option><option>Recruitment</option><option>Library services</option></select><ChevronDown aria-hidden="true" size={15} /></label>
                <a href="#notices" className="all-notices">All updates <ArrowRight size={15} /></a>
              </div>
              <div className="notice-side-note"><Bell size={16} /><span><b>Don&apos;t miss an update</b><small>Check back regularly for new library announcements.</small></span></div>
            </div>
            <div className="notice-list" aria-live="polite">
              {filteredNotices.length ? filteredNotices.map(({ category, date, title, summary, icon: Icon, tone, tag }, index) => (
                <article className={`notice-card ${index === 0 ? "notice-featured" : ""}`} key={title}>
                  <div className={`notice-icon ${tone}`}><Icon size={19} strokeWidth={1.8} /></div>
                  <div className="notice-body"><div className="notice-meta"><span className={`notice-tag ${tone}`}>{tag}</span><span className="notice-date"><CalendarDays size={13} />{date}</span></div><h3>{title}</h3><p>{summary}</p><a href={category === "Recruitment" ? "/work-based-learning" : "#services"} className="notice-read">{category === "Recruitment" ? "View registration details" : "Read announcement"}<ArrowRight size={14} /></a></div>
                  {index === 0 && <span className="fresh-mark">LATEST</span>}
                </article>
              )) : <div className="no-notices">No notices match your search. Try another keyword or category.</div>}
              <p className="notice-disclaimer">Illustrative portal content for preview. Please verify dates and announcements with NFSU before acting.</p>
            </div>
          </div>
        </section>

        <section className="registration-section" id="registration">
          <div className="registration-card">
            <div className="registration-symbol"><GraduationCap size={26} strokeWidth={1.6} /></div>
            <div className="registration-copy"><span className="registration-kicker">CONTRACTUAL OPPORTUNITY <span className="new-pill">NEW</span></span><h2>Translate with purpose.<br /><em>Support access.</em></h2><p>Registration is open for temporary contractual Hindi translation recruitment. Check eligibility and submit your details to express interest.</p></div>
            <div className="registration-action"><span className="registration-deadline"><Clock3 size={14} /> Registration window open</span><a href="/work-based-learning" className="registration-button">Start registration <ExternalLink size={15} /></a><small>Complete the secure two-page form</small></div>
            <div className="registration-watermark" aria-hidden="true">NFSU</div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="services-inner"><div><div className="eyebrow dark"><span /> HERE TO HELP</div><h2>More than books.<br /><em>A partner in research.</em></h2><p>Whether you are starting your research or ready to publish, our library team can help you find your way.</p></div><div className="service-links"><a href="mailto:library@nfsu.ac.in"><span className="service-number">01</span><span><b>Research assistance</b><small>Get expert guidance for your next project</small></span><ArrowRight size={17} /></a><a href="mailto:library@nfsu.ac.in"><span className="service-number">02</span><span><b>Ask a librarian</b><small>We&apos;re here to answer your questions</small></span><ArrowRight size={17} /></a><a href="#about"><span className="service-number">03</span><span><b>Using the e-library</b><small>Access resources wherever you are</small></span><ArrowRight size={17} /></a></div></div>
        </section>
      </main>

      <footer className="site-footer" id="about"><div className="footer-inner"><a className="footer-brand" href="#home"><Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-7gm0thPZNvlohywweVMIWvQQH3uqph.png" alt="" width={42} height={50} unoptimized /><span><b>NFSU E-Library</b><small>National Forensic Sciences University</small></span></a><p>Advancing knowledge in forensic sciences and beyond.</p><div className="footer-links"><a href="#about">About NFSU</a><a href="#services">Contact library</a><a href="#home">Back to top ↑</a></div><span className="copyright">© 2026 National Forensic Sciences University</span></div></footer>
    </div>
  )
}
