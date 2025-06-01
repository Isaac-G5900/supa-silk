import React, { useState } from "react";

const CollapsibleDropdown = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="collapsible-dropdown">
      <button
        className="dropdown-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
      </button>
      {open && <div className="dropdown-content">{children}</div>}
    </div>
  );
};

export default CollapsibleDropdown;