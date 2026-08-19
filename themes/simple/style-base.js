/* eslint-disable react/no-unknown-property */
const BaseStyle = () => <style jsx global>{`
    #theme-simple {
      --z-bg: #fffdf9;
      --z-surface: rgba(255, 255, 255, 0.9);
      --z-surface-strong: #fff;
      --z-text: #172033;
      --z-body: #334155;
      --z-muted: #64748b;
      --z-faint: #94a3b8;
      --z-border: rgba(100, 116, 139, 0.18);
      --z-border-accent: rgba(37, 99, 235, 0.3);
      --z-blue: #2563eb;
      --z-blue-strong: #1d4ed8;
      --z-blue-soft: rgba(37, 99, 235, 0.08);
      --z-warm: #d97706;
      --z-warm-soft: rgba(245, 158, 11, 0.1);
      --z-card-radius: 1.3rem;
      --z-control-radius: 0.78rem;
      --z-shadow: 0 16px 46px rgba(15, 23, 42, 0.07);
      --z-shadow-hover: 0 22px 60px rgba(15, 23, 42, 0.12);
      --z-content: 72rem;
      --z-reading: 48rem;
      min-height: 100vh;
      color: var(--z-body);
      background:
        radial-gradient(circle at 14% 3%, rgba(245, 158, 11, 0.08), transparent 24rem),
        var(--z-bg);
    }

    .dark #theme-simple {
      --z-bg: #070b14;
      --z-surface: rgba(15, 23, 42, 0.9);
      --z-surface-strong: #0f172a;
      --z-text: #f1f5f9;
      --z-body: #d5dde9;
      --z-muted: #a3afc0;
      --z-faint: #7c899d;
      --z-border: rgba(148, 163, 184, 0.17);
      --z-border-accent: rgba(96, 165, 250, 0.35);
      --z-blue: #60a5fa;
      --z-blue-strong: #93c5fd;
      --z-blue-soft: rgba(96, 165, 250, 0.1);
      --z-warm: #fbbf24;
      --z-warm-soft: rgba(251, 191, 36, 0.1);
      --z-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
      --z-shadow-hover: 0 24px 64px rgba(0, 0, 0, 0.34);
      background:
        radial-gradient(circle at 14% 3%, rgba(37, 99, 235, 0.16), transparent 25rem),
        var(--z-bg);
    }

    body { overflow-wrap: anywhere; }
    .dark body { background: #070b14; }
    #theme-simple *, #theme-simple *::before, #theme-simple *::after { box-sizing: border-box; }
    #theme-simple a { color: inherit; }
    #theme-simple img, #theme-simple video, #theme-simple iframe { max-width: 100%; }
    #theme-simple button, #theme-simple input { font: inherit; }
    #theme-simple .zeurd-control, #theme-simple button, #theme-simple [role='button'] { min-width: 44px; min-height: 44px; }
    #theme-simple :focus-visible { outline: 3px solid var(--z-blue); outline-offset: 3px; }
    #theme-simple #main-content:focus { outline: none; }
    .notion { margin-top: 0 !important; margin-bottom: 0 !important; }
    .forbid-copy { user-select: none; -webkit-user-select: none; }

    #theme-simple .zeurd-skip-link {
      position: fixed; top: .75rem; left: .75rem; z-index: 1000;
      transform: translateY(-180%); border-radius: .65rem; padding: .75rem 1rem;
      color: #fff; background: #111827; box-shadow: var(--z-shadow);
      text-decoration: none; transition: transform 140ms ease;
    }
    #theme-simple .zeurd-skip-link:focus { transform: translateY(0); }

    #theme-simple #container-wrapper {
      display: flex; width: min(calc(100% - 2rem), var(--z-content)); flex: 1 0 auto;
      align-items: flex-start; gap: clamp(2rem, 4vw, 4.5rem); margin: 0 auto;
      padding: clamp(2.3rem, 5vw, 4.5rem) 0 4.5rem;
    }
    #theme-simple #container-wrapper.is-reversed { flex-direction: row-reverse; }
    #theme-simple .zeurd-main-content { min-width: 0; flex: 1 1 auto; }
    #theme-simple #right-sidebar {
      position: sticky; top: 5.5rem; display: none; flex: 0 0 auto;
      border-left: 1px solid var(--z-border); padding-left: 2rem;
    }
    #theme-simple #right-sidebar.is-article { width: 15rem; }
    #theme-simple #right-sidebar.is-list { width: 21rem; }

    #theme-simple .zeurd-simple-hero {
      position: relative; z-index: 10; overflow: hidden; border-bottom: 1px solid var(--z-border);
      padding: clamp(2.7rem, 6vw, 4.75rem) 1.25rem;
      background:
        radial-gradient(circle at 18% 18%, rgba(37, 99, 235, 0.12), transparent 27rem),
        linear-gradient(115deg, #f8fbff 0%, #fff 62%, #fffaf0 100%);
    }
    .dark #theme-simple .zeurd-simple-hero {
      background:
        radial-gradient(circle at 18% 16%, rgba(59, 130, 246, 0.2), transparent 27rem),
        linear-gradient(115deg, #070b14 0%, #0a0f1c 64%, #111827 100%);
    }
    #theme-simple .zeurd-hero-shell {
      display: flex; width: min(100%, var(--z-content)); align-items: center;
      justify-content: space-between; gap: clamp(2rem, 6vw, 5rem); margin: 0 auto;
    }
    #theme-simple .zeurd-hero-main { min-width: 0; flex: 1 1 auto; text-decoration: none; }
    #theme-simple .zeurd-title {
      margin: 0; color: var(--z-text); font-family: ui-serif, Georgia, Cambria, serif;
      font-size: clamp(3.1rem, 7vw, 5.35rem); font-weight: 800;
      letter-spacing: -.075em; line-height: .92;
    }
    #theme-simple .zeurd-description {
      max-width: 42rem; margin: 1.25rem 0 0; color: var(--z-muted);
      font-size: clamp(.98rem, 1.6vw, 1.12rem); line-height: 1.75;
    }
    #theme-simple .zeurd-hero-side {
      display: flex; min-width: 20rem; flex-direction: column; align-items: flex-start;
      gap: 1.35rem; border-left: 2px solid var(--z-blue); padding: .4rem 0 .4rem 2rem;
    }
    #theme-simple .zeurd-stat-block { display: flex; flex-direction: column; }
    #theme-simple .zeurd-stat-number { color: var(--z-blue); font-size: 2.7rem; font-weight: 850; letter-spacing: -.06em; line-height: .95; }
    #theme-simple .zeurd-stat-label { margin-top: .5rem; color: var(--z-muted); font-size: .74rem; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
    #theme-simple .zeurd-topic-line { display: flex; flex-wrap: wrap; color: var(--z-body); font-size: .86rem; font-weight: 650; line-height: 1.6; }
    #theme-simple .zeurd-topic-line span + span::before { margin: 0 .7rem; color: var(--z-blue); content: '•'; }

    `}</style>
export { BaseStyle }
