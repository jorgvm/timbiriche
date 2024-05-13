import styles from "./page.module.css";
import CreateGame from "@/components/create-game";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Timbiriche</h1>

      <CreateGame />

      <p>
        <a
          href="https://github.com/jorgvm/timbiriche"
          target="_blank"
          rel="noopener noreferrer"
        >
          View project on Github
        </a>
      </p>
    </main>
  );
}
