import Modal from "./Modal";
import { useState } from "react";

export default function ConfirmModal({
  title,
  children,
  open,
  onClose,
  onConfirm,
}) {
  const [error, setError] = useState("");
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl text-left">{title}</h2>
      <div className="py-5 text-left">{children}</div>
      <div className="py-3 text-red-500">{error}</div>
      <div className="flex justify-end">
        <div className="p-1">
          <button
            onClick={() => onClose()}
            className="h-10 bg-red-400 hover:bg-red-600 w-10 rounded-md mx-2 p-1"
          >
            No
          </button>
        </div>
        <div className="p-1">
          <button
            id="confirm-yes"
            onClick={async () => {
              try {
                await onConfirm();
                onClose();
              } catch (error) {
                setError(error.message);
              }
            }}
            className=" bg-blue-400 hover:bg-blue-600 w-10 rounded-md mx-2 p-1 h-10"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
}
