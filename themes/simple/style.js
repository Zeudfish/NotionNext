/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    
  // 底色
  .dark body{
      background-color: black;
  }
  // 文本不可选取
    .forbid-copy {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
  
  #theme-simple #announcement-content {
    /* background-color: #f6f6f6; */
  }
  
  #theme-simple .blog-item-title {
    color: #276077;
  }
  
  .dark #theme-simple .blog-item-title {
    color: #d1d5db;
  }
  
  .notion {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  /* 文章页：保留站点的暖色氛围，同时给长文一个稳定的阅读平面 */
  #theme-simple .zeurd-article-page {
    width: 100%;
    max-width: 46rem;
    margin-right: auto;
    margin-left: auto;
  }

  #theme-simple .zeurd-reading-surface {
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 1.75rem;
    padding: clamp(1.25rem, 3vw, 2.4rem);
    background: rgba(255, 253, 249, 0.94);
    box-shadow: 0 18px 55px rgba(15, 23, 42, 0.055);
  }

  .dark #theme-simple .zeurd-reading-surface {
    border-color: rgba(148, 163, 184, 0.16);
    background: rgba(15, 23, 42, 0.92);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.24);
  }

  #theme-simple .zeurd-reading-surface .blog-item-title {
    color: #172033;
    font-size: clamp(1.75rem, 3.2vw, 2.2rem);
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.24;
  }

  .dark #theme-simple .zeurd-reading-surface .blog-item-title {
    color: #f8fafc;
  }

  .zeurd-reading-surface .notion {
    color: #273247;
    font-size: 17px;
    font-weight: 400;
    letter-spacing: 0.008em;
    line-height: 1.78;
  }

  .dark .zeurd-reading-surface .notion {
    color: #d8dee9;
  }

  .zeurd-reading-surface .notion > .notion-text {
    padding: 0 !important;
    margin: 0 0 0.78em !important;
    line-height: inherit;
  }

  .zeurd-reading-surface .notion > .notion-text:last-child {
    margin-bottom: 0 !important;
  }

  .zeurd-reading-surface .notion > .notion-h {
    padding: 0 !important;
    color: #172033;
    font-weight: 700;
    letter-spacing: -0.012em;
    line-height: 1.35;
  }

  .dark .zeurd-reading-surface .notion > .notion-h {
    color: #f1f5f9;
  }

  .zeurd-reading-surface .notion > .notion-h1 {
    margin: 2em 0 0.72em !important;
  }

  .zeurd-reading-surface .notion > .notion-h2 {
    margin: 1.8em 0 0.64em !important;
  }

  .zeurd-reading-surface .notion > .notion-h3 {
    margin: 1.45em 0 0.52em !important;
  }

  .zeurd-reading-surface .notion .notion-h-title {
    margin: 0 !important;
    line-height: inherit;
  }

  .zeurd-reading-surface .notion > .notion-list {
    margin-top: 0.25em;
    margin-bottom: 1em;
    line-height: 1.72;
  }

  .zeurd-reading-surface .notion-list li {
    padding-top: 0.16em;
    padding-bottom: 0.16em;
  }

  .zeurd-reading-surface .notion > .notion-asset-wrapper {
    margin-top: 1.35rem;
    margin-bottom: 1.65rem;
  }

  .zeurd-reading-surface .notion-asset-wrapper img {
    border-radius: 0.7rem;
  }

  .zeurd-reading-surface .notion > .notion-hr {
    margin: 1.5rem 0 !important;
    border-color: rgba(100, 116, 139, 0.22) !important;
  }

  .zeurd-reading-surface .notion > .notion-hr:first-child {
    margin-top: 0 !important;
  }

  .zeurd-reading-surface .notion-link {
    opacity: 0.9;
    border-bottom-color: rgba(37, 99, 235, 0.38);
  }

  .zeurd-reading-surface .notion-link:hover {
    color: #1d4ed8;
    opacity: 1;
  }

  .zeurd-reading-surface .notion b,
  .zeurd-reading-surface .notion strong {
    color: #172033;
    font-weight: 600;
  }

  .dark .zeurd-reading-surface .notion b,
  .dark .zeurd-reading-surface .notion strong {
    color: #f1f5f9;
  }

  #theme-simple #right-sidebar .catalog-item {
    font-weight: 400;
    line-height: 1.55;
  }

  @media (max-width: 640px) {
    #theme-simple .zeurd-reading-surface {
      border-radius: 1.2rem;
      padding: 1.15rem;
    }

    .zeurd-reading-surface .notion {
      font-size: 16px;
      letter-spacing: 0;
      line-height: 1.8;
    }
  }
  
  
  /*  菜单下划线动画 */
  #theme-simple .menu-link {
      text-decoration: none;
      background-image: linear-gradient(#dd3333, #dd3333);
      background-repeat: no-repeat;
      background-position: bottom center;
      background-size: 0 2px;
      transition: background-size 100ms ease-in-out;
  }
   
  #theme-simple .menu-link:hover {
      background-size: 100% 2px;
      color: #dd3333;
      cursor: pointer;
  }
  
  

  `}</style>
}

export { Style }
