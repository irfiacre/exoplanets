import { useState, useEffect, useCallback } from "react";

export interface UseBeginnerAnswerReturn {
  isAnswerReady: boolean;
  isGettingAnswer: boolean;
  answer?: string;

  waitForBackend: () => void;
  sendMessageAndWaitForAnswer: (
    message: string,
    appName: string,
    userId: string,
    sessionId: string,
    streaming?: boolean
  ) => Promise<string>;

  retryWithBackoff: <T>(
    fn: () => Promise<T>,
    maxRetries?: number,
    maxDuration?: number
  ) => Promise<T>;
}

export function useBeginnerAnswer(): UseBeginnerAnswerReturn {
  const [isAnswerReady, setIsAnswerReady] = useState(false);
  const [isGettingAnswer, setIsGettingAnswer] = useState(false);
  const [answer, setAnswer] = useState<string | undefined>(undefined);

  const checkForAnswer = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/run_sse", {
        method: "OPTIONS",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      console.log("Backend not ready yet:", error);
      return false;
    }
  }, []);

  // Retry utility with exponential backoff
  const retryWithBackoff = useCallback(
    async <T>(
      fn: () => Promise<T>,
      maxRetries: number = 10,
      maxDuration: number = 120000 // 2 minutes
    ): Promise<T> => {
      const startTime = Date.now();
      let lastError: Error;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        if (Date.now() - startTime > maxDuration) {
          throw new Error(`Retry timeout after ${maxDuration}ms`);
        }

        try {
          return await fn();
        } catch (error) {
          lastError = error as Error;
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
          console.log(
            `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
            error
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      throw lastError!;
    },
    []
  );

  // Start health monitoring with retry logic
  const waitForBackend = useCallback((): void => {
    const checkBackend = async (): Promise<void> => {
      setIsGettingAnswer(true);

      // Check if backend is ready with retry logic
      const maxAttempts = 60; // 2 minutes with 2-second intervals
      let attempts = 0;

      while (attempts < maxAttempts) {
        const isReady = await checkForAnswer();
        if (isReady) {
          setIsAnswerReady(true);
          setIsGettingAnswer(false);
          return;
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setIsGettingAnswer(false);
      console.error("Answer failed to be got within 2 minutes");
    };

    checkBackend();
  }, [checkForAnswer]);

  const sendMessageAndWaitForAnswer = useCallback(
    async (
      message: string,
      appName: string,
      userId: string,
      sessionId: string,
      streaming: boolean = true
    ): Promise<string> => {
      setIsGettingAnswer(true);
      setIsAnswerReady(false);
      setAnswer(undefined);
      
      const response = await fetch("/api/run_sse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appName: appName,
          userId: userId,
          sessionId: sessionId,
          message,
          streaming,
        }),
      });

      if (!response.ok || !response.body) {
        setIsGettingAnswer(false);
        throw new Error("Failed to connect to ADK agent");
      }

      // ReadableStream reader for streaming tokens
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk; // or parse newline-delimited JSON events if needed
        setAnswer((prev) => (prev || "") + chunk);
      }

      setIsGettingAnswer(false);
      setIsAnswerReady(true);
      return fullResponse;
    },
    []
  );

  // Auto-start health check
  useEffect(() => {
    waitForBackend();
  }, [waitForBackend]);

  return {
    isAnswerReady,
    isGettingAnswer,
    answer,
    // checkForAnswer,
    waitForBackend,
    sendMessageAndWaitForAnswer,
    retryWithBackoff,
  };
}
