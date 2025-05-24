// components/UserDropdown.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-3 py-1 border rounded-md bg-secondary/20 hover:bg-secondary/30 dark:bg-secondary/50 dark:hover:bg-secondary/60"
      >
        Menu ▾
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-card dark:bg-card-dark border border-border rounded shadow-lg z-10">
          <Link href="/account-info">
            <a className="block px-4 py-2 hover:bg-muted dark:hover:bg-muted-dark">
              Account
            </a>
          </Link>
          <Link href="/protected/saved-jobs">
            <a className="block px-4 py-2 hover:bg-muted dark:hover:bg-muted-dark">
              Saved Jobs
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
