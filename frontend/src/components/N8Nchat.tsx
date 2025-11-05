"use client";
import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function N8NChat() {
  useEffect(() => {
    createChat({
      webhookUrl: "https://ashudev.app.n8n.cloud/webhook/b1c40d9f-6b4b-4043-a433-0649f26506f0/chat",
      target: "#n8n-chat", 
      theme: {
        color: "#1e8fffff",
        background: "#EAF2FF",
        text: "#000",
      },
    });
  }, []);

  return <div id="n8n-chat"></div>;
}
