import { v4 as uuidv4 } from "uuid";
import { Message } from "@/types/message";

export function createUserMessage(content: string): Message {
  return {
    id: uuidv4(),
    owner: "you",
    message: content,
    type: "text",
    url: null,
    timestamp: Date.now().toString(),
  };
}

export function createBotTempMessage(content: string): Message {
  return {
    id: uuidv4(),
    owner: "bot-temp",
    message: content,
    type: "text",
    url: null,
    timestamp: Date.now().toString(),
  };
}

export function createBotMessage(content: string): Message {
  return {
    id: uuidv4(),
    owner: "bot",
    message: content,
    type: "text",
    url: null,
    timestamp: Date.now().toString(),
  };
}

export function createBotImageMessage(text: string, url: string): Message {
  return {
    id: uuidv4(),
    owner: "bot",
    message: text,
    type: "image_with_text",
    url,
    timestamp: Date.now().toString(),
  };
}
