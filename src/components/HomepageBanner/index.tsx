import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Engine } from "tsparticles-engine";

const HomepageBanner = () => {
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900 text-center text-white">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 50 },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.7 },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 2 },
          },
        }}
        className="absolute inset-0 -z-10"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,0,0.15),_transparent)] opacity-40" />
      <h1 className="flex animate-pulse flex-col gap-3 text-6xl font-extrabold tracking-widest text-yellow-400 drop-shadow-xl sm:text-7xl md:flex-row">
        <span>Code</span> <span className="hidden md:inline-block">/</span>{" "}
        <span>Notes</span>
      </h1>
      <h2 className="animate-fade-in mt-4 text-xl font-semibold text-gray-300 sm:text-3xl">
        Frontend Developer
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-2xl">
        These notes probably only make sense to me.
      </p>
      <div className="mt-10 flex flex-col gap-6 md:flex-row">
        <a
          href="#skills"
          className="rounded-xl bg-yellow-500 px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-yellow-400"
        >
          Explore My Skills
        </a>
        <a
          href="/docs/intro"
          className="rounded-xl border-2 border-yellow-500 px-8 py-4 text-lg font-bold text-yellow-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 hover:text-gray-900"
        >
          To My Note
        </a>
      </div>
      <div className="absolute bottom-10 animate-bounce text-lg text-gray-500">
        Scroll down to see more ↓
      </div>
    </div>
  );
};

export default HomepageBanner;
