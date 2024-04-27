import InputModal from "./InputModal";
import { useState } from "react";

export default function TextInputModal({
  title,
  children,
  options,
  open,
  onClose,
  onConfirm,
}) {
  const [input, setInput] = useState(options[0]);
  return (
    <InputModal
      title={title}
      modalChildren={children}
      input={input}
      isSearchable={false}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
    >
    </InputModal>
  );
}
