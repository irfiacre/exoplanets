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
          <h1 className="text-4xl font-bold">Exoplanets Researcher</h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="capitalize text-lg max-w-2xl mx-auto">
            An Exoplanets <strong className="uppercase">AI</strong> assistant to facilitate you to in your research.
          </p>
        </div>

        {/* Try asking about section */}
        <div className="space-y-4 text-start">
          <div className=" ">
            <strong>You can try:</strong> 
              <br />
              <ul className="list-disc list-inside">
                <li>Show me the distribution of orbital periods across confirmed vs false positives in the K2 dataset.</li>
                <li>Are there any K2 planets located in the habitable zone?</li>
                <li>Given the following parameters, classify whether this potential candidate is likely a confirmed exoplanet, planetary candidate, or false positive: orbital_period=12.4d, radius=1.2Re, transit_depth=0.0023, star_temp=5800K.</li>
                <li>
                  {"I am looking for Earth-sized planets around Sun-like stars in the K2 dataset. Filter candidates with radius < 1.5 Earth radii, host star temperature between 5000–6000K, and orbital periods 200–400 days. Return the top five results with EPIC ID and disposition."}
                </li>
           </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
