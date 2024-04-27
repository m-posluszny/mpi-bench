import { useState } from "react";

export default function NavUser({ username }) {
  const [user, setUser] = useState(username);
  const [open, setOpen] = useState(false);

  return (
    <div className="nav-user">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}></a>
    </div>
  );
}
