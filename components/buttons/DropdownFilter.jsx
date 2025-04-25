"use client";

// import React from "react";
// import { useState } from "react";
// import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.js";

function DropdownFilter({ items }) {
  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="w-20 p-2 border rounded">
        <select className="form-select">
          {items.map((item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* I'm going to kill myself I was coding the wrong component

function DropdownFilter({ items, heading }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // const handeClick = (item) => (heading = item);

  return (
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {heading}
      </button>
      <ul class="dropdown-menu">
        {items.map((item, index) => (
          <li
            class={
              selectedIndex === index ? "dropdown-item active" : "dropdown-item"
            }
            key={item} // key might need to be an id or something later on but for now its just the item name
            onMouseEnter={() => {
              setSelectedIndex(index);
            }}
            onMouseLeave={() => {
              setSelectedIndex(-1);
            }}
            //onClick={() => handeClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
} */

export default DropdownFilter;
