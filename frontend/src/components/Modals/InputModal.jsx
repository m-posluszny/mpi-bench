import Modal from "./Modal";
import { useState } from "react";

export default function InputModal({
  title,
  input,
  modalChildren,
  children,
  open,
  onClose,
  onConfirm,
}) {
  const [error, setError] = useState("");
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl text-left">{title}</h2>
      <div className="py-3 text-left">{modalChildren}</div>
      {children}
      <div className="py-3 text-red-500">{error}</div>
      <div className="flex justify-end">
        <div className="p-1">
          <button
            onClick={() => onClose()}
            className=" bg-red-400 hover:bg-red-600 w-10 min-w-min p-1 rounded-md mx-2"
          >
            Cancel
          </button>
        </div>
        <div className="p-1">
          <button
            onClick={async () => {
              if (input === "") return;
              try {
                await onConfirm(input);
                onClose();
              } catch (error) {
                setError(error.message);
              }
            }}
            className=" bg-blue-400 hover:bg-blue-600 w-10 rounded-md mx-2 p-1 mr-0"
          >
            Ok
          </button>
        </div>
      </div>
    </Modal>
  );
}
