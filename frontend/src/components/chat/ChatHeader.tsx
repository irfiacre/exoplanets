"use client";

import { BotMessageSquare } from "lucide-react";

import { UserIdInput } from "@/components/chat/UserIdInput";
import { SessionSelector } from "@/components/chat/SessionSelector";
import { useChatContext } from "@/components/chat/ChatProvider";
import { Icon } from "@iconify/react";

/**
 * ChatHeader - User and session management interface
 * Extracted from ChatMessagesView header section
 * Handles user ID input and session selection
 */
export function ChatHeader(): React.JSX.Element {
  const {
    userId,
    sessionId,
    handleUserIdChange,
    handleUserIdConfirm,
    handleSessionSwitch,
    handleCreateNewSession,
  } = useChatContext();

  return (
    <div className="relative z-10 flex-shrink-0 bg-white text-black">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
            <Icon icon="simple-icons:nasa" fontSize={50} />
          <div>
            <h1 className="text-xl font-bold">
             -  Exogent
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <UserIdInput
            currentUserId={userId}
            onUserIdChange={handleUserIdChange}
            onUserIdConfirm={handleUserIdConfirm}
            className="text-xs"
          />

          {userId && (
            <SessionSelector
              currentUserId={userId}
              currentSessionId={sessionId}
              onSessionSelect={handleSessionSwitch}
              onCreateSession={handleCreateNewSession}
              className="text-xs"
            />
          )}
        </div>
      </div>
    </div>
  );
}
