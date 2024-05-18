import { ReactNode, useEffect, useRef } from "react";
import styles from "./modal.module.scss";

interface ModalProps {
  openModal: boolean;
  closeModal: () => void;
  showCloseButton?: boolean;
  children: ReactNode;
}

/**
 * A basic modal component that can be reused
 */
const Modal = ({
  openModal,
  closeModal,
  showCloseButton = true,
  children,
}: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} onCancel={closeModal} className={styles.root}>
      {children}

      {showCloseButton && (
        <button onClick={closeModal} className={styles.close}>
          &times;
        </button>
      )}
    </dialog>
  );
};

export default Modal;
