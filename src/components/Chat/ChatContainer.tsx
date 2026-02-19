"use client";

import { useState, useCallback, useEffect } from "react";
import { Message as MessageType } from "@/types";
import Header from "../Header";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import WelcomeScreen from "../WelcomeScreen";
import PasswordGate from "../PasswordGate";

export default function ChatContainer() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if already authenticated on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("authenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      // Create assistant message placeholder
      const assistantMessage: MessageType = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      // Stream the response
      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;

        // Update the assistant message with streamed content
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: fullContent } : m
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);

      // Add error message
      const errorMessage: MessageType = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please make sure the API key is configured and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [messages]);

  const hasMessages = messages.length > 0;

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="flex gap-1">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      </div>
    );
  }

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header />

      {hasMessages ? (
        <MessageList messages={messages} isLoading={isLoading} />
      ) : (
        <WelcomeScreen onSuggestionClick={sendMessage} />
      )}

      <InputArea onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
