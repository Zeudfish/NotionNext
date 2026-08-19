/* eslint-disable react/no-unknown-property */
const SecondaryStyle = () => <style jsx global>{`#theme-simple .zeurd-archive-list { display: grid; gap: 2rem; }
    #theme-simple .zeurd-archive-group h2 { scroll-margin-top: 6rem; margin: 0 0 .55rem; color: var(--z-text); font-size: 1.45rem; font-weight: 760; letter-spacing: -.025em; }
    #theme-simple .zeurd-archive-group ul { margin: 0; border-top: 1px solid var(--z-border); padding: 0; list-style: none; }
    #theme-simple .zeurd-archive-group li { scroll-margin-top: 6rem; border-bottom: 1px solid var(--z-border); }
    #theme-simple .zeurd-archive-link { display: grid; grid-template-columns: 7rem minmax(0, 1fr); align-items: center; gap: 1rem; min-height: 48px; padding: .5rem .25rem; color: var(--z-body); text-decoration: none; }
    #theme-simple .zeurd-archive-link time { color: var(--z-faint); font-size: .78rem; font-variant-numeric: tabular-nums; }
    #theme-simple .zeurd-archive-link:hover span { color: var(--z-blue); text-decoration: underline; }
    #theme-simple .zeurd-taxonomy-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr)); gap: .85rem; }
    #theme-simple .zeurd-taxonomy-card { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: .8rem; border: 1px solid var(--z-border); border-radius: 1rem; padding: 1rem; color: var(--z-body); background: var(--z-surface); text-decoration: none; transition: transform 140ms, border-color 140ms, box-shadow 140ms; }
    #theme-simple .zeurd-taxonomy-card:hover { transform: translateY(-2px); border-color: var(--z-border-accent); color: var(--z-blue); box-shadow: var(--z-shadow); }
    #theme-simple .zeurd-taxonomy-card small { color: var(--z-faint); font-size: .72rem; }
    #theme-simple .zeurd-tag-index { display: flex; flex-wrap: wrap; gap: .65rem; }
    #theme-simple .zeurd-tag-index-item { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid var(--z-border); border-radius: 999px; padding: .45rem .85rem; color: var(--z-body); background: var(--z-surface); text-decoration: none; }
    #theme-simple .zeurd-tag-index-item:hover { border-color: var(--z-border-accent); color: var(--z-blue); }
    #theme-simple .zeurd-tag-index-item small { color: var(--z-faint); font-variant-numeric: tabular-nums; }

    #theme-simple .zeurd-404 { display: flex; min-height: 55vh; max-width: 42rem; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; padding: 2rem 1rem; text-align: center; }
    #theme-simple .zeurd-404 h1 { margin: 1rem 0 0; color: var(--z-text); font-size: clamp(2rem, 5vw, 3rem); line-height: 1.2; }
    #theme-simple .zeurd-404 p { margin: 1rem 0 0; color: var(--z-muted); line-height: 1.75; }
    #theme-simple .zeurd-404-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .7rem; margin-top: 1.75rem; }
    #theme-simple .zeurd-jump-wrapper { position: fixed; right: 1rem; bottom: 1rem; z-index: 40; }
    #theme-simple .zeurd-jump-top { display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--z-border); border-radius: 999px; color: #fff; background: rgba(15, 23, 42, .84); box-shadow: var(--z-shadow); cursor: pointer; backdrop-filter: blur(10px); }
    #theme-simple .zeurd-jump-top:hover { background: var(--z-blue-strong); }
    #theme-simple .zeurd-footer { margin-top: auto; border-top: 1px solid rgba(148, 163, 184, .16); color: #cbd5e1; background: #111827; }
    #theme-simple .zeurd-footer-inner { display: grid; grid-template-columns: 1fr auto auto; width: min(calc(100% - 2rem), var(--z-content)); align-items: center; gap: 1rem 2rem; margin: 0 auto; padding: 1.5rem 0; font-size: .78rem; }
    #theme-simple .zeurd-footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: .55rem 1rem; }
    #theme-simple .zeurd-footer-links a { color: #cbd5e1; text-decoration: none; }
    #theme-simple .zeurd-footer-links a:hover { color: #fff; text-decoration: underline; }
    #theme-simple .zeurd-footer-theme #darkModeButton { color: #cbd5e1; }

    @media (min-width: 768px) {
      #theme-simple .zeurd-navbar-logo, #theme-simple .zeurd-desktop-menu { display: flex; }
      #theme-simple .zeurd-mobile-menu { display: none; }
    }
    @media (min-width: 1280px) { #theme-simple #right-sidebar { display: block; } }
    @media (max-width: 767px) {
      #theme-simple #container-wrapper { width: min(calc(100% - 1.25rem), var(--z-content)); padding-top: 2rem; padding-bottom: 3rem; }
      #theme-simple .zeurd-simple-hero { padding: 2.4rem 1rem 2.15rem; }
      #theme-simple .zeurd-hero-shell { flex-direction: column; align-items: stretch; gap: 1.7rem; }
      #theme-simple .zeurd-title { font-size: clamp(3rem, 17vw, 4.4rem); }
      #theme-simple .zeurd-description { margin-top: 1rem; }
      #theme-simple .zeurd-hero-side { width: 100%; min-width: 0; gap: .95rem; border-top: 1px solid var(--z-border-accent); border-left: 0; padding: 1.2rem 0 0; }
      #theme-simple .zeurd-stat-block { flex-direction: row; align-items: baseline; gap: .75rem; }
      #theme-simple .zeurd-stat-number { font-size: 2.15rem; }
      #theme-simple .zeurd-stat-label { margin-top: 0; }
      #theme-simple .zeurd-navbar-inner { width: calc(100% - 1.25rem); }
      #theme-simple .zeurd-reading-surface { border-radius: 1.1rem; padding: 1.1rem; }
      #theme-simple .zeurd-reading-surface .notion { font-size: 16px; letter-spacing: 0; line-height: 1.82; }
      #theme-simple .zeurd-pagination { grid-template-columns: 1fr 1fr; }
      #theme-simple .zeurd-page-status { grid-column: 1 / -1; grid-row: 1; justify-self: center; }
      #theme-simple .zeurd-pagination .zeurd-page-control:first-child, #theme-simple .zeurd-pagination .zeurd-page-control:last-child { grid-row: 2; }
      #theme-simple .zeurd-archive-link { grid-template-columns: 1fr; gap: .1rem; padding: .65rem .25rem; }
      #theme-simple .zeurd-footer-inner { grid-template-columns: 1fr auto; }
      #theme-simple .zeurd-footer-links { grid-column: 1 / -1; grid-row: 2; justify-content: flex-start; }
    }
    @media (max-width: 480px) {
      #theme-simple .zeurd-search-submit span { display: none; }
      #theme-simple .zeurd-topic-line { font-size: .78rem; }
      #theme-simple .zeurd-topic-line span + span::before { margin: 0 .45rem; }
      #theme-simple .zeurd-blog-content { padding: 1.15rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      #theme-simple *, #theme-simple *::before, #theme-simple *::after {
        scroll-behavior: auto !important; animation-duration: .01ms !important;
        animation-iteration-count: 1 !important; transition-duration: .01ms !important;
      }
      #theme-simple .zeurd-blog-item:hover, #theme-simple .zeurd-taxonomy-card:hover,
      #theme-simple .zeurd-read-more:hover, #theme-simple .zeurd-back-button:hover,
      #theme-simple .zeurd-page-control:hover { transform: none; }
    }
    @media print {
      #theme-simple .zeurd-navbar, #theme-simple .zeurd-simple-hero, #theme-simple #right-sidebar,
      #theme-simple .zeurd-footer, #theme-simple .zeurd-jump-wrapper,
      #theme-simple .zeurd-back-button, #theme-simple .zeurd-breadcrumb { display: none !important; }
      #theme-simple #container-wrapper, #theme-simple .zeurd-article-page { width: 100%; max-width: none; padding: 0; }
      #theme-simple .zeurd-reading-surface { border: 0; padding: 0; box-shadow: none; }
    }
  `}</style>
export { SecondaryStyle }
