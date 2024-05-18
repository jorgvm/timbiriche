import clsx from "clsx";
import { useState } from "react";
import formStyles from "./form.module.scss";
import Modal from "./modal";

/**
 * A text explaining the rules of the game
 * When already read, hide from the user
 */
const Rules = () => {
  const [openModal, setOpenModal] = useState(
    sessionStorage.getItem("timbiriche-read-rules") !== "true"
  );

  const closeModal = () => {
    sessionStorage.setItem("timbiriche-read-rules", "true");
    setOpenModal(false);
  };

  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <>
        <h2>Rules</h2>

        <div className={clsx(formStyles.helpText)}>
          <p>Players take turns building a wall.</p>

          <p>
            Did you build the last wall? Now you own that room and get to place
            one more wall!
          </p>

          <p>The player with most rooms wins!</p>
        </div>

        <button
          type="button"
          onClick={closeModal}
          className={formStyles.button}
        >
          Got it!
        </button>
      </>
    </Modal>
  );
};

export default Rules;
