import styles from "./page.module.css";
import StartGame from "@/components/start-game";

export default function Home() {
  return (
    <main className={styles.main}>
      <StartGame />
    </main>
  );
}
