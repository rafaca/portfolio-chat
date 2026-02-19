"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-4 animate-fade-in-up">
      <div className="message-assistant rounded-lg px-4 py-3 flex items-center gap-2">
        <span className="text-sm opacity-70">Thinking</span>
        <span className="animate-morph">...</span>
      </div>
    </div>
  );
}
