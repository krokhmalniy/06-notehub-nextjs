"use client";

import css from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p className={css.text}>© {year} NoteHub. All rights reserved.</p>

        <div className={css.wrap}>
          <p className={css.text}>Developer: Your Name</p>

          <p className={css.text}>
            Contact us:{" "}
            <a className={css.link} href="mailto:student@notehub.app">
              student@notehub.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
