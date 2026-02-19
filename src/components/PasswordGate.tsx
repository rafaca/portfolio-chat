"use client";

import { useState, useRef } from "react";
import Logo from "./Logo";

interface PasswordGateProps {
  onSuccess: () => void;
}

export default function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("authenticated", "true");
      onSuccess();
    } else {
      setError(true);
      setIsLoading(false);

      // Clear and refocus after shake
      setTimeout(() => {
        setError(false);
        setPassword("");
        inputRef.current?.focus();
      }, 400);
    }
  };

  return (
    <div className="pwd-screen">
      <div className="pwd-content">
        {/* Logo */}
        <div className="pwd-logo">
          <Logo width={305} height={38} />
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="pwd-form">
          <label className="pwd-label">Enter Password</label>

          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="• • • • • •"
            className={`pwd-input${error ? " pwd-input-error" : ""}`}
            autoFocus
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={isLoading || !password}
            className="pwd-submit"
          >
            {isLoading ? "Checking..." : "Enter"}
          </button>

          <div className={`pwd-hint${error ? " pwd-hint-visible" : ""}`}>
            Incorrect password
          </div>
        </form>
      </div>
    </div>
  );
}
