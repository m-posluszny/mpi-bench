import InputModal from "./InputModal";
import { useState } from "react";

export default function TextInputModal({
  title,
  children,
  open,
  onClose,
  onConfirm,
}) {
  const [input, setInput] = useState("");
  return (
    <InputModal
      title={title}
      modalChildren={children}
      input={input}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
    >
      <input
        id="text-input-modal"
        className="my-3 border-2 rounded-md border-black focus:border-blue-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></input>
    </InputModal>
  );
}
