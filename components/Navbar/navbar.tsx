import styles from "./navbar.module.css";
import Image from "next/image";
import logo from "../../public/Logo.svg";
import wppImage from "../../public/WhatsApp.png";

export default function Navbar() {
  return (
    <div className={styles.container}>
      <Image className={styles.logo} src={logo} alt="logo" />

      <a className={styles.wpp} target="_blank">
        <Image src={wppImage} alt="wppImage" />
        <h4 className={styles.wpp_number}>
          <span className={styles.wpp_ddd}>31.</span> 9766-4630
        </h4>
      </a>
    </div>
  );
}
