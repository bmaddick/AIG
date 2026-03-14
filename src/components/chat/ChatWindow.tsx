"use client";

import type { Chat, ChatMessage } from "@/types/api";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHistory from "./ChatHistory";

interface ChatWindowProps {
  messages: ChatMessage[];
  streamingContent: string;
  isStreaming: boolean;
  isIncognito: boolean;
  activeChatId: string | null;
  chats: Chat[];
  chatsLoading: boolean;
  showHistory: boolean;
  onSend: (content: string) => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
  onNewIncognito: () => void;
  onToggleHistory: () => void;
}

export default function ChatWindow({
  messages,
  streamingContent,
  isStreaming,
  isIncognito,
  activeChatId,
  chats,
  chatsLoading,
  showHistory,
  onSend,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  onNewIncognito,
  onToggleHistory,
}: ChatWindowProps) {
  return (
    <div
      className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden
        rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200 animate-in fade-in slide-in-from-bottom-4
        duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#00546B] px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleHistory}
            aria-label="Toggle chat history"
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isIncognito ? "Incognito Chat" : "AiG Chat"}
            </h2>
            {isIncognito && (
              <p className="text-[10px] text-white/60">Messages won&apos;t be saved</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!isIncognito && (
            <button
              onClick={onNewChat}
              aria-label="New chat"
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {showHistory && (
          <ChatHistory
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={onSelectChat}
            onDeleteChat={onDeleteChat}
            onNewChat={onNewChat}
            onNewIncognito={onNewIncognito}
            onClose={onToggleHistory}
            loading={chatsLoading}
          />
        )}
        <MessageList
          messages={messages}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
        />
      </div>

      {/* Input */}
      <MessageInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}
