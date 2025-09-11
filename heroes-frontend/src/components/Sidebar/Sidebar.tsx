import { Link } from "react-router-dom";
import { useState } from "react";
import css from "./Sidebar.module.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={css.mobileMenuButton}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      <div
        className={`${css.mobileOverlay} ${isOpen ? css.open : ""}`}
        onClick={closeMenu}
      />

      <aside className={`${css.sidebar} ${isOpen ? css.open : ""}`}>
        <a className={css.logo} href="/" onClick={closeMenu}>
          <svg className={css.logoicon} aria-hidden="true">
            <use href="/symbol-defs.svg#icon-secure"></use>
          </svg>
          HeroHub
        </a>

        <nav>
          <ul className={css.navList}>
            <li>
              <Link className={css.navListLinks} to="/" onClick={closeMenu}>
                <svg className={css.linkicon} aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-list"></use>
                </svg>
                SuperHero List
              </Link>
            </li>
            <li>
              <Link
                className={css.navListLinks}
                to="/create"
                onClick={closeMenu}
              >
                <svg className={css.linkicon} aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-radar"></use>
                </svg>
                Create SuperHero
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
