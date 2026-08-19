/* eslint-disable react/no-unknown-property */
const ContentStyle = () => <style jsx global>{`#theme-simple .zeurd-list-header { margin: 0 0 1.7rem; }
    #theme-simple .zeurd-list-eyebrow { display: flex; align-items: center; gap: .55rem; color: var(--z-blue); font-size: .72rem; font-weight: 800; letter-spacing: .14em; }
    #theme-simple .zeurd-list-title-row { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .75rem; }
    #theme-simple .zeurd-list-header h1, #theme-simple .zeurd-list-title-row h1 { margin: .45rem 0 0; color: var(--z-text); font-size: clamp(1.8rem, 4vw, 2.55rem); font-weight: 790; letter-spacing: -.045em; line-height: 1.2; }
    #theme-simple .zeurd-list-header p { max-width: 46rem; margin: .75rem 0 0; color: var(--z-muted); line-height: 1.7; }
    #theme-simple .zeurd-list-count { color: var(--z-faint); font-size: .8rem; font-variant-numeric: tabular-nums; }

    #theme-simple #posts-wrapper { display: grid; gap: 1rem; }
    #theme-simple .zeurd-post-slot { content-visibility: auto; contain-intrinsic-size: 360px; }
    #theme-simple .zeurd-blog-item {
      overflow: hidden; border: 1px solid var(--z-border); border-radius: var(--z-card-radius);
      background: var(--z-surface); box-shadow: var(--z-shadow);
      transition: transform 160ms, border-color 160ms, box-shadow 160ms;
    }
    #theme-simple .zeurd-blog-item:hover { transform: translateY(-2px); border-color: var(--z-border-accent); box-shadow: var(--z-shadow-hover); }
    #theme-simple .zeurd-blog-cover { display: block; overflow: hidden; border-bottom: 1px solid var(--z-border); background: var(--z-blue-soft); }
    #theme-simple .zeurd-blog-cover-image { display: block; width: 100%; height: auto; aspect-ratio: 2 / 1; object-fit: cover; transition: transform 360ms; }
    #theme-simple .zeurd-blog-cover:hover .zeurd-blog-cover-image { transform: scale(1.025); }
    #theme-simple .zeurd-blog-content { padding: clamp(1.15rem, 2.5vw, 1.65rem); }
    #theme-simple .zeurd-blog-content h2 { margin: 0; }
    #theme-simple .zeurd-blog-title { color: var(--z-text); font-size: clamp(1.2rem, 2.4vw, 1.55rem); font-weight: 780; letter-spacing: -.025em; line-height: 1.4; text-decoration: none; text-wrap: balance; }
    #theme-simple .zeurd-blog-title:hover { color: var(--z-blue); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .18em; }
    #theme-simple .zeurd-blog-meta, #theme-simple .zeurd-article-meta { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem .9rem; margin-top: .75rem; color: var(--z-muted); font-size: .78rem; }
    #theme-simple .zeurd-blog-meta a, #theme-simple .zeurd-article-meta a, #theme-simple .zeurd-blog-meta span, #theme-simple .zeurd-article-meta span { display: inline-flex; align-items: center; gap: .35rem; text-decoration: none; }
    #theme-simple .zeurd-blog-meta a:hover, #theme-simple .zeurd-article-meta a:hover { color: var(--z-blue); }
    #theme-simple .zeurd-tag-row { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .85rem; }
    #theme-simple .zeurd-tag-chip { display: inline-flex; align-items: center; min-height: 30px; border: 1px solid var(--z-border-accent); border-radius: 999px; padding: .2rem .65rem; color: var(--z-blue-strong); background: var(--z-blue-soft); font-size: .72rem; font-weight: 650; text-decoration: none; }
    #theme-simple .zeurd-tag-chip:hover { color: var(--z-warm); border-color: rgba(217, 119, 6, .3); background: var(--z-warm-soft); }
    #theme-simple .zeurd-blog-summary { margin-top: .95rem; color: var(--z-muted); font-size: .94rem; line-height: 1.75; }
    #theme-simple .zeurd-blog-summary p { margin: 0; }
    #theme-simple .zeurd-summary-clamp { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
    #theme-simple .zeurd-list-preview { max-height: 14rem; overflow: hidden; mask-image: linear-gradient(#000 72%, transparent); }
    #theme-simple .zeurd-search-hit { color: var(--z-body); }
    #theme-simple .zeurd-search-hit-source { display: inline-flex; margin-right: .55rem; border-radius: 999px; padding: .12rem .5rem; color: var(--z-blue-strong); background: var(--z-blue-soft); font-size: .7rem; font-weight: 750; }
    #theme-simple .zeurd-search-highlight { border-bottom: 2px solid var(--z-warm); color: var(--z-text); background: var(--z-warm-soft); }
    #theme-simple .zeurd-blog-actions { display: flex; margin-top: 1.05rem; }

    #theme-simple .zeurd-read-more, #theme-simple .zeurd-back-button, #theme-simple .zeurd-page-control {
      display: inline-flex; align-items: center; justify-content: center; gap: .55rem;
      border: 1px solid var(--z-border-accent); border-radius: 999px; padding: .45rem .9rem;
      color: var(--z-blue-strong); background: var(--z-surface-strong); font-size: .78rem;
      font-weight: 720; text-decoration: none; transition: transform 140ms, border-color 140ms, color 140ms, box-shadow 140ms;
    }
    #theme-simple .zeurd-read-more:hover, #theme-simple .zeurd-back-button:hover, #theme-simple .zeurd-page-control:hover { transform: translateY(-1px); border-color: rgba(217, 119, 6, .35); color: var(--z-warm); box-shadow: var(--z-shadow); }
    #theme-simple .zeurd-back-button { margin-bottom: 1rem; }
    #theme-simple .zeurd-pagination { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: .75rem; margin-top: 1.5rem; }
    #theme-simple .zeurd-pagination .zeurd-page-control:first-child { justify-self: start; }
    #theme-simple .zeurd-pagination .zeurd-page-control:last-child { justify-self: end; }
    #theme-simple .zeurd-page-control.is-disabled { opacity: .42; cursor: not-allowed; }
    #theme-simple .zeurd-page-control.is-disabled:hover { transform: none; color: var(--z-blue-strong); box-shadow: none; }
    #theme-simple .zeurd-page-status { color: var(--z-faint); font-size: .76rem; font-variant-numeric: tabular-nums; }
    #theme-simple .zeurd-load-more { display: flex; align-items: center; justify-content: center; margin: 1.2rem auto 0; border: 1px solid var(--z-border); border-radius: 999px; padding: .45rem 1.2rem; color: var(--z-body); background: var(--z-surface); cursor: pointer; }
    #theme-simple .zeurd-load-more:hover:not(:disabled) { border-color: var(--z-border-accent); color: var(--z-blue); }
    #theme-simple .zeurd-load-more:disabled { opacity: .5; cursor: default; }
    #theme-simple .zeurd-scroll-sentinel { height: 1px; }
    #theme-simple .zeurd-empty-state { display: grid; place-items: center; min-height: 18rem; border: 1px dashed var(--z-border); border-radius: var(--z-card-radius); padding: 2rem; color: var(--z-muted); text-align: center; }
    #theme-simple .zeurd-empty-state > i { color: var(--z-blue); font-size: 2rem; }
    #theme-simple .zeurd-empty-state h2 { margin: .9rem 0 0; color: var(--z-text); }
    #theme-simple .zeurd-empty-state p { margin: .45rem 0 0; }

    #theme-simple .zeurd-search-page-box { margin-bottom: 1.5rem; }
    #theme-simple .zeurd-search-form { display: flex; width: 100%; align-items: center; gap: .35rem; border: 1px solid var(--z-border); border-radius: 1rem; padding: .35rem; background: var(--z-surface); box-shadow: var(--z-shadow); }
    #theme-simple .zeurd-search-input { min-width: 0; min-height: 46px; flex: 1 1 auto; border: 0; padding: 0 .85rem; outline: 0; color: var(--z-text); background: transparent; }
    #theme-simple .zeurd-search-icon-button, #theme-simple .zeurd-search-submit { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; border: 0; border-radius: .75rem; color: var(--z-muted); background: transparent; cursor: pointer; }
    #theme-simple .zeurd-search-submit { padding: 0 .85rem; color: #fff; background: var(--z-blue-strong); }
    #theme-simple .zeurd-search-submit:hover { filter: brightness(1.06); }

    #theme-simple .zeurd-article-page { width: 100%; max-width: var(--z-reading); margin: 0 auto; }
    #theme-simple .zeurd-reading-surface { border: 1px solid var(--z-border); border-radius: 1.6rem; padding: clamp(1.25rem, 3vw, 2.5rem); background: var(--z-surface); box-shadow: var(--z-shadow); }
    #theme-simple .zeurd-article-info { margin: 0 0 2rem; border-bottom: 1px solid var(--z-border); padding-bottom: 1.5rem; }
    #theme-simple .zeurd-article-info .blog-item-title { margin: 0; color: var(--z-text); font-size: clamp(1.8rem, 4.2vw, 2.65rem); font-weight: 790; letter-spacing: -.045em; line-height: 1.2; text-wrap: balance; }
    #theme-simple .zeurd-reading-surface .notion { color: var(--z-body); font-size: 17px; font-weight: 400; letter-spacing: .006em; line-height: 1.82; }
    #theme-simple .zeurd-reading-surface .notion > .notion-text { margin: 0 0 .82em !important; padding: 0 !important; line-height: inherit; }
    #theme-simple .zeurd-reading-surface .notion > .notion-h { scroll-margin-top: 6rem; margin-right: 0 !important; margin-left: 0 !important; padding: 0 !important; color: var(--z-text); font-weight: 760; letter-spacing: -.02em; line-height: 1.35; }
    #theme-simple .zeurd-reading-surface .notion > .notion-h1 { margin-top: 2.1em !important; margin-bottom: .7em !important; }
    #theme-simple .zeurd-reading-surface .notion > .notion-h2 { margin-top: 1.85em !important; margin-bottom: .62em !important; }
    #theme-simple .zeurd-reading-surface .notion > .notion-h3 { margin-top: 1.55em !important; margin-bottom: .5em !important; }
    #theme-simple .zeurd-reading-surface .notion .notion-h-title { margin: 0 !important; line-height: inherit; }
    #theme-simple .zeurd-reading-surface .notion > .notion-list { margin-top: .25em; margin-bottom: 1em; line-height: 1.75; }
    #theme-simple .zeurd-reading-surface .notion-list li { padding-top: .16em; padding-bottom: .16em; }
    #theme-simple .zeurd-reading-surface .notion > .notion-asset-wrapper { margin-top: 1.4rem; margin-bottom: 1.7rem; }
    #theme-simple .zeurd-reading-surface .notion-asset-wrapper img { height: auto; border-radius: .8rem; }
    #theme-simple .zeurd-reading-surface .notion > .notion-hr { margin: 1.75rem 0 !important; border-color: var(--z-border) !important; }
    #theme-simple .zeurd-reading-surface .notion-link { opacity: .94; border-bottom-color: var(--z-border-accent); }
    #theme-simple .zeurd-reading-surface .notion-link:hover { color: var(--z-blue-strong); opacity: 1; }
    #theme-simple .zeurd-reading-surface .notion b, #theme-simple .zeurd-reading-surface .notion strong { color: var(--z-text); font-weight: 650; }
    #theme-simple #right-sidebar .catalog-item { font-weight: 430; line-height: 1.55; }

    `}</style>
export { ContentStyle }
