"use client";

import React, { useEffect, useState } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTypescript,
  SiJavascript,
  SiRedux,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
} from "react-icons/si";

const skills = {
  Frontend: [
    { name: "React", icon: SiReact },
    { name: "Angular", icon: SiAngular },
    { name: "TypeScript", icon: SiTypescript },
    { name: "JavaScript", icon: SiJavascript },
    { name: "Tailwind CSS", icon: SiTailwindcss },
  ],
  Backend: [
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Express.js", icon: SiExpress },
    { name: "MongoDB", icon: SiMongodb },
  ],
};

const HomepageSkills = () => {
  const [hoverEffect, setHoverEffect] = useState(false);

  useEffect(() => {
    setHoverEffect(true);
  }, []);

  return (
    <div
      id="skills"
      className="relative mx-auto flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 px-6 py-20 text-white sm:px-8"
    >
      <div className="container pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,0,0.1),_transparent)] opacity-40" />
      <h2 className="mb-12 animate-pulse text-center text-4xl font-extrabold tracking-widest text-yellow-400 drop-shadow-lg sm:text-5xl">
        🚀 My Skills
      </h2>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
        {Object.entries(skills).map(([category, skillList]) => (
          <div
            key={category}
            className="relative scale-100 transform overflow-hidden rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-2xl transition duration-300 ease-in-out hover:scale-105 hover:shadow-yellow-500/50 sm:p-8"
          >
            <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-r from-yellow-500/10 to-transparent opacity-50" />
            <h3 className="mb-4 border-b-4 border-yellow-500 pb-2 text-2xl font-bold text-yellow-300 drop-shadow-md sm:mb-6 sm:text-3xl">
              {category}
            </h3>
            <div className="relative z-10 flex flex-wrap justify-center gap-3 sm:justify-start sm:gap-4">
              {skillList.map(({ name, icon: Icon }, index) => (
                <div
                  key={index}
                  className={`sm:text-md flex transform items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 ease-in-out hover:rotate-2 hover:scale-110 hover:shadow-yellow-400 sm:px-5 sm:py-3 ${
                    hoverEffect ? "animate-fade-in" : ""
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" /> {name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomepageSkills;
