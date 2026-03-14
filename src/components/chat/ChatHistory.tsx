"use client";

import type { Chat } from "@/types/api";

interface ChatHistoryProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
  onNewIncognito: () => void;
  onClose: () => void;
  loading: boolean;
}

export default function ChatHistory({
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  onNewIncognito,
  onClose,
  loading,
}: ChatHistoryProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-700">Chat History</h3>
        <button
          onClick={onClose}
          aria-label="Close history"
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* New chat buttons */}
      <div className="flex gap-2 border-b border-zinc-100 px-4 py-3">
        <button
          onClick={onNewChat}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#00546B] px-3
            py-2 text-xs font-medium text-white hover:bg-[#003d4f] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
        <button
          onClick={onNewIncognito}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-300
            px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          Incognito
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-[#00546B]" />
          </div>
        ) : chats.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-zinc-400">
            No chat history yet
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {chats.map((chat) => (
              <li key={chat.id} className="group relative">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    activeChatId === chat.id
                      ? "bg-[#00546B]/5 border-l-2 border-[#00546B]"
                      : "hover:bg-zinc-50"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-zinc-700">
                    {chat.title || "Untitled chat"}
                  </p>
                  {chat.updatedAt && (
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  aria-label="Delete chat"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-300
                    opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500
                    group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
