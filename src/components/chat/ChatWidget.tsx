"use client";

import { useState, useCallback, useRef } from "react";
import type { Chat, ChatMessage } from "@/types/api";
import ChatBubble from "./ChatBubble";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const msgIdCounter = useRef(0);

  const fetchChats = useCallback(async () => {
    setChatsLoading(true);
    try {
      const res = await fetch("/api/chat/list");
      if (res.ok) {
        const json = await res.json();
        setChats(json.data ?? []);
      }
    } catch {
      // silently fail — chat list is non-critical
    } finally {
      setChatsLoading(false);
    }
  }, []);

  const loadChatMessages = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${encodeURIComponent(chatId)}/messages`);
      if (res.ok) {
        const json = await res.json();
        setMessages(json.data ?? []);
      }
    } catch {
      // silently fail
    }
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      fetchChats();
    }
  }, [isOpen, fetchChats]);

  const handleSend = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      // Add user message immediately
      const userMsg: ChatMessage = {
        id: `local-${++msgIdCounter.current}`,
        content,
        role: "user",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setStreamingContent("");
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Use incognito endpoint for new chats (no activeChatId yet)
        const useIncognito = isIncognito || !activeChatId;
        const endpoint = useIncognito ? "/api/chat/incognito" : "/api/chat/send";
        const body = useIncognito
          ? { message: { content } }
          : { chatId: activeChatId, message: { content } };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(err.error ?? "Request failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";
        let newChatId: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = line.slice(5).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                // Dominion SSE format: {"type":"text_delta","data":{"delta":"..."}}
                const text =
                  parsed.data?.delta ??
                  parsed.content ??
                  (typeof parsed.data === "string" ? parsed.data : null) ??
                  parsed.text;
                if (typeof text === "string" && text.length > 0) {
                  accumulated += text;
                  setStreamingContent(accumulated);
                }
                // Capture chatId from metadata event or inline field
                const chatIdVal = parsed.data?.chatId ?? parsed.chatId;
                if (chatIdVal && !activeChatId && !isIncognito) {
                  newChatId = chatIdVal;
                }
              } catch {
                if (data.length > 0) {
                  accumulated += data;
                  setStreamingContent(accumulated);
                }
              }
            }
          }
        }

        // Finalize: add assistant message
        if (accumulated) {
          const assistantMsg: ChatMessage = {
            id: `local-${++msgIdCounter.current}`,
            content: accumulated,
            role: "assistant",
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }

        if (newChatId) {
          setActiveChatId(newChatId);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          const errorMsg: ChatMessage = {
            id: `local-${++msgIdCounter.current}`,
            content: `Error: ${(error as Error).message}`,
            role: "assistant",
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      } finally {
        setStreamingContent("");
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, isIncognito, activeChatId],
  );

  const handleSelectChat = useCallback(
    async (chatId: string) => {
      setActiveChatId(chatId);
      setIsIncognito(false);
      setShowHistory(false);
      await loadChatMessages(chatId);
    },
    [loadChatMessages],
  );

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      try {
        const res = await fetch(`/api/chat/${encodeURIComponent(chatId)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setChats((prev) => prev.filter((c) => c.id !== chatId));
          if (activeChatId === chatId) {
            setActiveChatId(null);
            setMessages([]);
          }
        }
      } catch {
        // silently fail
      }
    },
    [activeChatId],
  );

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setIsIncognito(false);
    setShowHistory(false);
    setStreamingContent("");
  }, []);

  const handleNewIncognito = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setIsIncognito(true);
    setShowHistory(false);
    setStreamingContent("");
  }, []);

  const handleToggleHistory = useCallback(() => {
    setShowHistory((prev) => {
      if (!prev) fetchChats();
      return !prev;
    });
  }, [fetchChats]);

  return (
    <>
      {isOpen && (
        <ChatWindow
          messages={messages}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
          isIncognito={isIncognito}
          activeChatId={activeChatId}
          chats={chats}
          chatsLoading={chatsLoading}
          showHistory={showHistory}
          onSend={handleSend}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onNewChat={handleNewChat}
          onNewIncognito={handleNewIncognito}
          onToggleHistory={handleToggleHistory}
        />
      )}
      <ChatBubble isOpen={isOpen} onClick={handleToggle} />
    </>
  );
}
