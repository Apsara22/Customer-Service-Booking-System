import React from "react";

const Welcome = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative z-10 text-center px-4">

        <h1
          className="text-5xl md:text-7xl font-bold mb-4
                     bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400
                     bg-clip-text text-transparent
                     animate-gradient-x"
          style={{
            backgroundSize: "200% auto",
            animation: "gradient-x 3s ease infinite",
          }}
        >
          Welcome to
        </h1>

        <h2
          className="text-4xl md:text-6xl font-extrabold mb-6
                     text-white
                     drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]
                     animate-fade-in-up"
        >
          Customer Service
        </h2>

        <p
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto
                     animate-fade-in-up animation-delay-200"
        >
          We're here to provide you with the best support experience.
          Your satisfaction is our priority.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <span className="w-16 h-1 bg-purple-500 rounded-full" />
          <span className="w-16 h-1 bg-pink-500 rounded-full" />
          <span className="w-16 h-1 bg-purple-500 rounded-full" />
        </div>

        <div className="flex justify-center gap-3 mt-8">
          <div className="w-3 h-3 bg-purple-400 rounded-full" />
          <div className="w-3 h-3 bg-pink-400 rounded-full" />
          <div className="w-3 h-3 bg-purple-400 rounded-full" />
        </div>

      </div>
    </div>
  );
};

export default Welcome;