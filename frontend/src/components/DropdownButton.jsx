import React from "react";
import { useState } from "react";

export default function DropdownButton({
  content,
  children,
  buttonClassName,
  className,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        id="dropdown-btn"
        className={buttonClassName}
        onClick={() => setOpen(!open)}
      >
        {content}
      </button>
      {open && children}
    </div>
  );
}
