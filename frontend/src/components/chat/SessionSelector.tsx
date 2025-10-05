"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Calendar,
  Loader2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { fetchActiveSessionsAction } from "@/lib/actions/session-list-actions";

interface Session {
  id: string;
  userId: string;
  lastActivity: Date;
  title?: string;
  messageCount?: number;
}

interface SessionSelectorProps {
  currentUserId: string;
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onCreateSession: (userId: string, url?: string) => Promise<void>;
  className?: string;
}

export function SessionSelector({
  currentUserId,
  currentSessionId,
  onSessionSelect,
  onCreateSession,
  className = "",
}: SessionSelectorProps): React.JSX.Element {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Fetch active sessions from ADK backend
  const fetchActiveSessions = useCallback(
    async (userId: string) => {
      try {
        setIsLoadingSessions(true);
        setSessionError(null);

        console.log(
          "🔄 [SESSION_SELECTOR] Fetching active sessions for user:",
          userId
        );

        const result = await fetchActiveSessionsAction(userId, "research_agent");

        if (result.success) {
          console.log("✅ [SESSION_SELECTOR] Active sessions fetched:", {
            sessionsCount: result.sessions.length,
          });

          // Convert ADK sessions to Session format
          const activeSessions: Session[] = result.sessions.map((session) => ({
            id: session.id,
            userId: session.userId,
            lastActivity: session.lastUpdateTime || new Date(),
            title: session.title || `Session ${session.id.substring(0, 8)}`,
            messageCount: session.messageCount, // Now using real message count from backend
          }));

          // Sort by last activity (most recent first)
          activeSessions.sort(
            (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
          );

          setSessions(activeSessions);
          console.log("✅ [SESSION_SELECTOR] Sessions updated in state:", {
            sessionsCount: activeSessions.length,
            sessionIds: activeSessions.map((s) => s.id.substring(0, 8)),
            currentSessionId: currentSessionId?.substring(0, 8),
          });
        } else {
          console.error(
            "❌ [SESSION_SELECTOR] Failed to fetch sessions:",
            result.error
          );
          const errorMessage = result.error || "Failed to fetch sessions";
          setSessionError(errorMessage);
          setSessions([]);

          // Show error toast to user
          toast.error("Failed to load sessions", {
            description: errorMessage,
          });
        }
      } catch (error) {
        console.error("❌ [SESSION_SELECTOR] Error fetching sessions:", error);
        const errorMessage = "Network error while fetching sessions";
        setSessionError(errorMessage);
        setSessions([]);

        // Show error toast to user
        toast.error("Network error", {
          description:
            "Could not connect to load your sessions. Please try again.",
        });
      } finally {
        setIsLoadingSessions(false);
      }
    },
    [currentSessionId]
  );

  // Load sessions when user ID changes
  useEffect(() => {
    if (currentUserId) {
      fetchActiveSessions(currentUserId);
    } else {
      setSessions([]);
      setSessionError(null);
    }
  }, [currentUserId, fetchActiveSessions]);

  // Add current session to list if it doesn't exist (for newly created sessions)
  useEffect(() => {
    console.log("🔄 [SESSION_SELECTOR] Current session changed:", {
      currentSessionId: currentSessionId?.substring(0, 8),
      currentUserId,
      hasSessionId: !!currentSessionId,
      hasUserId: !!currentUserId,
    });

    if (currentSessionId && currentUserId) {
      // Use a timeout to ensure this runs after sessions have been set
      const timeoutId = setTimeout(() => {
        setSessions((prevSessions) => {
          const sessionExists = prevSessions.some(
            (s) => s.id === currentSessionId
          );

          console.log("🔍 [SESSION_SELECTOR] Checking if session exists:", {
            currentSessionId: currentSessionId.substring(0, 8),
            sessionExists,
            prevSessionsCount: prevSessions.length,
            prevSessionIds: prevSessions.map((s) => s.id.substring(0, 8)),
          });

          if (!sessionExists) {
            console.log(
              "➕ [SESSION_SELECTOR] Adding current session to list:",
              currentSessionId.substring(0, 8)
            );
            const newSession: Session = {
              id: currentSessionId,
              userId: currentUserId,
              lastActivity: new Date(),
              title: `Session ${currentSessionId.substring(0, 8)}`,
              messageCount: 0,
            };
            return [newSession, ...prevSessions];
          }

          return prevSessions;
        });
      }, 100); // Small delay to ensure proper timing

      return () => clearTimeout(timeoutId);
    }
  }, [currentSessionId, currentUserId]); // Removed sessions dependency to avoid circular updates

  // Handle session selection or creation
  const handleSessionSelect = async (value: string): Promise<void> => {
    if (value === "create-new") {
      // Create new session
      setIsCreatingSession(true);
      try {
        await onCreateSession(currentUserId, `/apps/research_agent/users/${currentUserId}/sessions`);

        // Refresh session list after creation to ensure it appears
        console.log("🔄 [SESSION_SELECTOR] Refreshing sessions after creation");
        setTimeout(() => {
          fetchActiveSessions(currentUserId);
        }, 500); // Small delay to allow backend to process
      } catch (error) {
        console.error("Failed to create session:", error);

        // Show error toast to user
        toast.error("Failed to create session", {
          description: "Could not create a new session. Please try again.",
        });
      } finally {
        setIsCreatingSession(false);
      }
    } else {
      // Select existing session
      onSessionSelect(value);
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className={`${className} text-black`}>
      {!currentUserId ? (
        <div className="flex items-center gap-2 text-xs">
          <MessageSquare className="w-4 h-4" />
          <span>No user set</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>Session:</span>
          <Select value={currentSessionId} onValueChange={handleSessionSelect}>
            <SelectTrigger className="w-44 h-12 text-xs border-black focus:border-slate-700 px-4 py-1">
              <SelectValue
                placeholder={
                  isLoadingSessions
                    ? "Loading sessions..."
                    : sessionError
                    ? "Error loading sessions"
                    : sessions.length === 0
                    ? "Create your first session"
                    : "Select session"
                }
              />
            </SelectTrigger>
            <SelectContent className="border-black min-w-44">
              {/* Loading state */}
              {isLoadingSessions && (
                <div className="flex items-center gap-2 p-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading active sessions...</span>
                </div>
              )}

              {/* Error state */}
              {sessionError && !isLoadingSessions && (
                <div className="flex items-center gap-2 p-3 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Failed to load sessions</span>
                </div>
              )}

              {/* Sessions list */}
              {!isLoadingSessions && !sessionError && (
                <>
                  {sessions.map((session) => (
                    <SelectItem
                      key={session.id}
                      value={session.id}
                      className="focus:bg-slate-700 focus:text-slate-50 cursor-pointer py-3 px-3"
                    >
                      <div className="flex flex-col items-start w-full min-w-0">
                        <span className="font-medium text-sm truncate w-full">
                          {session.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="flex-shrink-0">
                            {formatDate(session.lastActivity)}
                          </span>
                          {session.messageCount !== undefined && (
                            <>
                              <span className="text-slate-500">•</span>
                              <span className="flex-shrink-0">
                                {session.messageCount} msg
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem
                    value="create-new"
                    className="focus:bg-white focus:text-slate-50 border-t border-slate-600 mt-1 cursor-pointer py-3 px-3"
                    disabled={isCreatingSession}
                  >
                    <div className="flex items-center gap-2">
                      {isCreatingSession ? (
                        <Loader2 className="w-4 h-4 animate-spin text-black flex-shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-black flex-shrink-0" />
                      )}
                      <span className="text-black font-medium">
                        {isCreatingSession
                          ? "Creating..."
                          : "Create New Session"}
                      </span>
                    </div>
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
