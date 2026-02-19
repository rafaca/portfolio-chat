"use client";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "What kind of work does Rafa do?",
  "Show me some branding projects",
  "Tell me about the Google Pixel project",
  "How can I work with Rafa?",
];

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-8">
        {/* Intro */}
        <div className="space-y-3">
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Chat with me to explore Rafa&apos;s work and experience.
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
            15+ years designing for Google, Aesop, Toyota, and more.
          </p>
        </div>

        {/* Suggested prompts */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Try asking
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestionClick(suggestion)}
                className="suggested-prompt rounded-full px-4 py-2 text-sm transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
