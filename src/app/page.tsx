import styles from "./page.module.css";
import CreateGame from "@/components/create-game";

export default function Home() {
  return (
    <main className={styles.main}>
      <CreateGame />
    </main>
  );
}
