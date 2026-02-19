"use client";

import { useState, useRef, useEffect } from "react";

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function InputArea({ onSend, disabled }: InputAreaProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex gap-3 items-end max-w-2xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Rafa's work..."
          disabled={disabled}
          rows={1}
          className="chat-input flex-1 rounded-full px-5 py-3 resize-none min-h-[48px]"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="send-button rounded-full px-6 py-3 font-medium"
        >
          Send
        </button>
      </div>
      <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
        Press Enter to send
      </p>
    </form>
  );
}
