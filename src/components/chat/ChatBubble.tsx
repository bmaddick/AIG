"use client";

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread?: boolean;
}

export default function ChatBubble({ isOpen, onClick, hasUnread }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center
        rounded-full bg-[#00546B] text-white shadow-lg transition-all duration-300
        hover:bg-[#003d4f] hover:scale-105 active:scale-95 focus:outline-none
        focus:ring-2 focus:ring-[#00546B] focus:ring-offset-2"
    >
      {hasUnread && !isOpen && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
      )}
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )}
    </button>
  );
}
