"use client";

import { Icon } from "@iconify/react";

/**
 * EmptyState - AI Goal Planner welcome screen
 * Extracted from ChatMessagesView empty state section
 * Displays when no messages exist in the current session
 */
export function EmptyState(): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center min-h-[60vh]">
      <div className="max-w-4xl w-full space-y-8">
        {/* Main header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Reasearcher Agent</h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            An enterprize level AI agent that based on requirements executes
            automation scripts.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto">
              <Icon icon="icon-park-solid:web-page" fontSize={28} />
            </div>
            <h3 className="font-semibold text-green-400">Web Browsers</h3>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto">
              <Icon icon="ic:baseline-apple" fontSize={28} />
            </div>
            <h3 className="font-semibold text-blue-400">
              iOS <span className="text-sm text-neutral-400">(Coming soon)</span>
              
            </h3>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto">
              <Icon icon="material-symbols:android" fontSize={28} />
            </div>
            <h3 className="font-semibold text-purple-400">Android <span className="text-sm text-neutral-400">(Coming soon)</span></h3>
          </div>
        </div>

        {/* Try asking about section */}
        <div className="space-y-4 text-start">
          <p className="text-neutral-400">Examples:</p>
          <div className=" ">
            <p>
            <strong>URI:</strong> www.google.com, 
              <br />
             <strong>Requirements:</strong>
              <ul>
                <li>- The user should be able to search and click on the first result.</li>
                <li>- The user should be able to search, click on the first result, and go back to the search page.</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
