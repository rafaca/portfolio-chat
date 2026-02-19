export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  type: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export type Theme = "pink" | "green";
