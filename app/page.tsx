"use client";

import Navbar from "@/components/Navbar/navbar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.content_left}>
          <h2 className={styles.text_description}>
            <span className={styles.text_green}>O TRAMONTE CONVIDA</span> VOCÊ A
            ECONOMIZAR ATÉ{" "}
            <span className={styles.text_green}>
              25% EM SUA TARIFA DE ENERGIA.{" "}
            </span>
          </h2>
        </div>
        <div className={styles.content_right}>
          <form id="form" className={styles.form_contato} method="post">
            <div className={styles.title_area}>
              <h4 className={styles.title_area_title}>
                <span className={styles.text_green}>CADASTRE-SE </span>PARA
                GARANTIR MAIS ECONOMIA NA{" "}
                <span className={styles.text_green}>SUA CONTA DE LUZ </span>
              </h4>
              <p className={styles.title_area_subtitle}>
                APROVEITE, ECONOMIZAR É GRÁTIS!
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
