/* eslint-disable react/no-unknown-property */
const NavigationStyle = () => <style jsx global>{`#theme-simple .zeurd-navbar {
      position: sticky; top: 0; z-index: 50; width: 100%; border-bottom: 1px solid var(--z-border);
      background: var(--z-surface-strong);
      background: color-mix(in srgb, var(--z-surface-strong) 88%, transparent);
      box-shadow: 0 8px 28px rgba(15, 23, 42, .04); backdrop-filter: blur(14px);
    }
    #theme-simple .zeurd-navbar-inner { display: flex; width: min(calc(100% - 2rem), var(--z-content)); min-height: 3.75rem; align-items: center; gap: 1rem; margin: 0 auto; }
    #theme-simple .zeurd-navbar-logo {
      display: none; align-items: center; justify-content: center; flex: 0 0 44px;
      border: 1px solid var(--z-border); border-radius: .75rem; color: var(--z-text);
      font-family: ui-serif, Georgia, serif; font-size: 1.2rem; font-weight: 800;
      text-decoration: none; transition: border-color 140ms, color 140ms, background 140ms;
    }
    #theme-simple .zeurd-navbar-logo:hover { border-color: var(--z-border-accent); color: var(--z-blue); background: var(--z-blue-soft); }
    #theme-simple .zeurd-navbar-content { min-width: 0; flex: 1 1 auto; align-self: stretch; }
    #theme-simple .zeurd-desktop-menu { display: none; height: 100%; align-items: stretch; gap: .2rem; }
    #theme-simple .zeurd-nav-item { position: relative; display: flex; align-items: stretch; }
    #theme-simple .menu-link, #theme-simple .zeurd-nav-link {
      display: inline-flex; min-height: 3.7rem; align-items: center; gap: .5rem;
      border: 0; padding: 0 .8rem; color: var(--z-body); background-color: transparent;
      background-image: linear-gradient(var(--z-blue), var(--z-blue)); background-repeat: no-repeat;
      background-position: bottom center; background-size: 0 2px; font-size: .94rem;
      font-weight: 620; letter-spacing: .02em; text-decoration: none;
      transition: color 140ms, background-size 140ms, background-color 140ms;
    }
    #theme-simple .zeurd-nav-link:hover, #theme-simple .zeurd-nav-link.is-active { color: var(--z-blue); background-size: 100% 2px; }
    #theme-simple .zeurd-nav-link.is-active { font-weight: 760; }
    #theme-simple .zeurd-nav-chevron { margin-left: .15rem; font-size: .65rem; transition: transform 160ms; }
    #theme-simple .zeurd-nav-dropdown {
      position: absolute; top: calc(100% + .45rem); left: 0; z-index: 70; min-width: 13rem;
      visibility: hidden; transform: translateY(-.35rem); margin: 0; border: 1px solid var(--z-border);
      border-radius: 1rem; padding: .45rem; opacity: 0; background: var(--z-surface-strong);
      box-shadow: var(--z-shadow-hover); list-style: none;
      transition: opacity 140ms, transform 140ms, visibility 140ms;
    }
    #theme-simple .zeurd-nav-dropdown.is-open { visibility: visible; transform: translateY(0); opacity: 1; }
    #theme-simple .zeurd-nav-dropdown-link {
      display: flex; min-height: 44px; align-items: center; gap: .65rem;
      border-radius: .7rem; padding: .7rem .8rem; color: var(--z-body);
      font-size: .9rem; text-decoration: none;
    }
    #theme-simple .zeurd-nav-dropdown-link:hover, #theme-simple .zeurd-nav-dropdown-link.is-active { color: var(--z-blue); background: var(--z-blue-soft); }

    #theme-simple .zeurd-mobile-menu { position: relative; display: flex; height: 100%; align-items: center; }
    #theme-simple .zeurd-mobile-menu-trigger, #theme-simple .zeurd-navbar-search-toggle, #theme-simple .zeurd-navbar-search button {
      display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
      border: 0; border-radius: 999px; color: var(--z-muted); background: transparent;
      cursor: pointer; transition: color 140ms, background 140ms;
    }
    #theme-simple .zeurd-mobile-menu-trigger:hover, #theme-simple .zeurd-navbar-search-toggle:hover, #theme-simple .zeurd-navbar-search button:hover { color: var(--z-blue); background: var(--z-blue-soft); }
    #theme-simple .zeurd-mobile-menu-collapse { position: absolute; top: 100%; left: -1rem; width: 100vw; }
    #theme-simple .zeurd-mobile-menu-panel {
      max-height: min(72vh, 36rem); overflow-y: auto; border-top: 1px solid var(--z-border);
      border-bottom: 1px solid var(--z-border); padding: .6rem 1rem 1rem;
      background: var(--z-surface-strong); box-shadow: var(--z-shadow);
    }
    #theme-simple .zeurd-mobile-menu-item + .zeurd-mobile-menu-item { border-top: 1px solid var(--z-border); }
    #theme-simple .zeurd-mobile-menu-link {
      display: flex; width: 100%; min-height: 48px; align-items: center; justify-content: space-between;
      gap: 1rem; border: 0; padding: .6rem .35rem; color: var(--z-body);
      background: transparent; text-align: left; text-decoration: none;
    }
    #theme-simple .zeurd-mobile-menu-link span, #theme-simple .zeurd-mobile-submenu-link { display: flex; align-items: center; gap: .65rem; }
    #theme-simple .zeurd-mobile-menu-link.is-active, #theme-simple .zeurd-mobile-submenu-link.is-active { color: var(--z-blue); font-weight: 750; }
    #theme-simple .zeurd-mobile-submenu { display: grid; gap: .15rem; padding: 0 0 .65rem 1.6rem; }
    #theme-simple .zeurd-mobile-submenu-link { min-height: 44px; border-radius: .65rem; padding: .45rem .65rem; color: var(--z-muted); text-decoration: none; }
    #theme-simple .zeurd-mobile-submenu-link:hover { color: var(--z-blue); background: var(--z-blue-soft); }
    #theme-simple .zeurd-navbar-search { display: flex; height: 100%; align-items: center; gap: .5rem; }
    #theme-simple .zeurd-navbar-search input { min-width: 0; flex: 1 1 auto; border: 0; outline: 0; color: var(--z-text); background: transparent; }
    #theme-simple .zeurd-navbar-search input::placeholder { color: var(--z-faint); }

    #theme-simple .zeurd-breadcrumb { margin: 0 0 1.35rem; color: var(--z-muted); font-size: .82rem; }
    #theme-simple .zeurd-breadcrumb ol { display: flex; flex-wrap: wrap; align-items: center; gap: .15rem; margin: 0; padding: 0; list-style: none; }
    #theme-simple .zeurd-breadcrumb li { display: inline-flex; min-width: 0; align-items: center; }
    #theme-simple .zeurd-breadcrumb a { text-decoration: none; }
    #theme-simple .zeurd-breadcrumb a:hover { color: var(--z-blue); text-decoration: underline; }
    #theme-simple .zeurd-breadcrumb [aria-current='page'] { max-width: min(36rem, 70vw); overflow: hidden; color: var(--z-body); text-overflow: ellipsis; white-space: nowrap; }
    #theme-simple .zeurd-breadcrumb-separator { margin: 0 .45rem; color: var(--z-faint); }

    `}</style>
export { NavigationStyle }
