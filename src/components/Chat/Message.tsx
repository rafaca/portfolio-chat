"use client";

import { Message as MessageType } from "@/types";
import { getProjectById } from "@/lib/portfolio-data";
import PortfolioCard from "./PortfolioCard";
import { useMemo } from "react";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  // Parse content for project references [PROJECT:id]
  const parsedContent = useMemo(() => {
    const projectRegex = /\[PROJECT:([a-z0-9-]+)\]/g;
    const parts: (string | { type: "project"; id: string })[] = [];
    let lastIndex = 0;
    let match;

    while ((match = projectRegex.exec(message.content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(message.content.slice(lastIndex, match.index));
      }
      // Add project reference
      parts.push({ type: "project", id: match[1] });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < message.content.length) {
      parts.push(message.content.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [message.content];
  }, [message.content]);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 ${
          isUser ? "message-user" : "message-assistant"
        }`}
      >
        {parsedContent.map((part, index) => {
          if (typeof part === "string") {
            // Render text with line breaks preserved
            return (
              <div key={index} className="whitespace-pre-wrap">
                {part}
              </div>
            );
          } else if (part.type === "project") {
            const project = getProjectById(part.id);
            if (project) {
              return <PortfolioCard key={index} project={project} />;
            }
            return null;
          }
          return null;
        })}
      </div>
    </div>
  );
}
