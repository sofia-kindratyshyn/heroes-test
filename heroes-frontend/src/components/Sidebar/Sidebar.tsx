import { Link } from "react-router-dom";
import css from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={css.sidebar}>
      <a className={css.logo} href="/">
        <svg className={css.logoicon} aria-hidden="true">
          <use href="/symbol-defs.svg#icon-secure"></use>
        </svg>
        HeroHub
      </a>

      <nav>
        <ul className={css.navList}>
          <li>
            <Link className={css.navListLinks} to="/">
              <svg className={css.linkicon} aria-hidden="true">
                <use href="/symbol-defs.svg#icon-list"></use>
              </svg>
              SuperHero List
            </Link>
          </li>
          <li>
            <Link className={css.navListLinks} to="/create">
              <svg className={css.linkicon} aria-hidden="true">
                <use href="/symbol-defs.svg#icon-radar"></use>
              </svg>
              Create SuperHero
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
