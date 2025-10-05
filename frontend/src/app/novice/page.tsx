"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { ANONYMOUS_USER } from "@/constants";
import { useBeginnerAnswer } from "@/hooks/useBeginner";
import { Icon } from "@iconify/react";

export default function NovicePage() {
  const [ageRange, setAgeRange] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [showPresentation, setShowPresentation] = useState(false);
  const router = useRouter();
  const { handleCreateNewSession, sessionId, handleUserIdChange } =
    useSession();

  const {
    isAnswerReady,
    isGettingAnswer,
    answer,
    sendMessageAndWaitForAnswer,
  } = useBeginnerAnswer();

  useEffect(() => {
    let result;
    (async () => {
      handleUserIdChange(ANONYMOUS_USER);
      await handleCreateNewSession(ANONYMOUS_USER);
    })();
    console.log("===", result);
  }, []);

  const interestOptions = [
    "Exoplanets",
    "Astrobiology",
    "Orbit",
    "Habitable",
    "Telescope",
    "Atmosphere",
    "Stars",
    "Planets",
    "Moons",
    "Nebula",
    "Supernova",
    "BlackHole",
    "Galaxy",
    "Kepler",
    "TESS",
    "LightYear",
    "RedGiant",
    "WhiteDwarf",
    "Asteroid",
    "Comet",
    "Exomoon",
    "Gravity",
    "Luminosity",
    "Cosmology",
  ];

  const ageRanges = [
    "Under 18",
    "18-25",
    "26-35",
    "36-45",
    "46-55",
    "56-65",
    "Over 65",
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ageRange || interests.length === 0) return;

    setShowPresentation(true); // or wait until answer arrives — up to you
    try {
      const agentOutput = await sendMessageAndWaitForAnswer(
        `Hi, I am a user who is in the age range ${ageRange} with these interests: ${interests.join(
          ","
        )}`,
        "CurriculumnAgentSystem",
        ANONYMOUS_USER,
        sessionId
      );

      console.log("Agent output:", agentOutput);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePresentationComplete = () => {
    router.push("/researcher");
  };

  if (showPresentation) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        {isGettingAnswer && !isAnswerReady ? (
          <div className="flex flex-col items-center justify-center gap-5">
            <Icon
              icon="eos-icons:bubble-loading"
              fontSize={50}
              className="text-gray-600"
            />
            <div>
              <h1 className="text-gray-600">
                {" "}
                Generating Customized Learning Material
              </h1>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 w-[80%]"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Exoplanet Discovery!
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Please watch this presentation to learn about exoplanets before
              proceeding to research mode.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-md shadow-2xl p-4 mb-8 border border-gray-200"
            >
              <iframe
                src="https://docs.google.com/gview?url=https://storage.googleapis.com/exoplanets_storage/generated_slides.pptx&embedded=true"
                width="100%"
                height="500"
                className="rounded-md"
                title="Exoplanet Presentation"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePresentationComplete}
              className="bg-accent hover:bg-accent/90 text-white font-semibold py-4 px-8 rounded-md text-xl shadow-lg transition-all duration-300 border border-accent/20"
            >
              I've completed the presentation - Continue to Research Mode
            </motion.button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8"
        >
          Tell us about yourself
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-12"
        >
          {/* Age Range Selection */}
          <div className="space-y-6">
            <label className="block text-xl font-semibold text-gray-900">
              What's your age range?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {ageRanges.map((range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setAgeRange(range)}
                  className={`p-4 rounded-md font-medium transition-all duration-300 border ${
                    ageRange === range
                      ? "bg-accent text-white border-accent shadow-lg"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-accent/30"
                  }`}
                >
                  {range}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Interests Selection */}
          <div className="space-y-6">
            <label className="block text-xl font-semibold text-gray-900">
              What are your interests? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {interestOptions.map((interest) => (
                <motion.button
                  key={interest}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-md font-medium transition-all duration-300 border text-sm ${
                    interests.includes(interest)
                      ? "bg-accent text-white border-accent shadow-lg"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-accent/30"
                  }`}
                >
                  {interest}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!ageRange || interests.length === 0}
            className={`w-full py-4 px-8 rounded-md text-xl font-semibold shadow-lg transition-all duration-300 border ${
              ageRange && interests.length > 0
                ? "bg-accent hover:bg-accent/90 text-white border-accent"
                : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
            }`}
          >
            Continue to Learning
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
