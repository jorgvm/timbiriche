"use client";

import { playSound } from "@/utils/sound";
import clsx from "clsx";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import formStyles from "./form.module.scss";
import styles from "./header.module.scss";
import Modal from "./modal";

/**
 * Header with Timbiriche logo and "exit game" modal
 */
const Header = () => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const handleOpenModal = () => {
    if (pathName !== "/") {
      playSound("button");
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    playSound("button");
  };

  const quitGame = () => {
    router.push("/");
    setOpenModal(false);
    playSound("button");
  };

  return (
    <>
      <button className={styles.logo} onClick={handleOpenModal}>
        Timbiriche
        {pathName !== "/" && (
          <Image src="/exit.svg" width="20" height="20" alt="Open menu" />
        )}
      </button>

      <Modal
        openModal={openModal}
        closeModal={handleCloseModal}
        showCloseButton={false}
      >
        <>
          <div className={clsx(formStyles.helpText, formStyles.center)}>
            <p>Quit and create new game?</p>
          </div>

          <div className={styles.options}>
            <button
              type="button"
              onClick={handleCloseModal}
              className={formStyles.buttonSecondary}
            >
              Oops, no
            </button>

            <button
              type="button"
              onClick={quitGame}
              className={formStyles.button}
            >
              Yes, quit
            </button>
          </div>
        </>
      </Modal>
    </>
  );
};

export default Header;
