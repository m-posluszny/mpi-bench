import { useState } from "react";

export default function NavItem  ()  {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-title">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {/* {props.icon} */}
      </a>

      {/* {open && props.children} */}
    </li>
  );
};

export default NavItem;
