import CreateGame from "@/components/create-game";
import Image from "next/image";
import styles from "./page.module.scss";

/**
 * Homepage with form to create game
 */
const Page = () => {
  return (
    <>
      <CreateGame />

      <p className={styles.footer}>
        <a
          href="https://github.com/jorgvm/timbiriche"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.github}
        >
          <Image src="./github.svg" width="24" height="24" alt="Github logo" />
          code on Github
        </a>
      </p>
    </>
  );
};

export default Page;
