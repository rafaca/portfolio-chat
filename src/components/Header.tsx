"use client";

import Logo from "./Logo";

export default function Header() {
  return (
    <header className="header py-6 w-full">
      <div className="flex justify-center">
        <a
          href="https://www.rafacastello.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
        >
          <Logo width={400} height={50} />
        </a>
      </div>
    </header>
  );
}
