
import React, { type ReactNode } from "react";

interface PageBackgroundProps {
  children?: ReactNode;
}

const PageBackground: React.FC<PageBackgroundProps> = ({
  children,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background bubbles */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
      >
        {/* Purple blur bubble */}
        <div
          className="absolute left-[-5%] top-[-10%] h-[200px] w-[250px]
                     animate-pulse rounded-full bg-purple-600
                     opacity-40 blur-3xl"
        />

        {/* Pink blur bubble */}
        <div
          className="absolute bottom-[-10%] right-[-5%] h-[200px] w-[200px]
                     animate-pulse rounded-full bg-pink-500
                     opacity-40 blur-3xl"
        />

        {/* Small purple bubble */}
        <div
          className="absolute right-[15%] top-[20%] h-[200px] w-[200px]
                     animate-bounce rounded-full bg-purple-400
                     opacity-30 blur-2xl"
        />

        {/* Small pink bubble */}
        <div
          className="absolute bottom-[30%] left-[20%] h-[70px] w-[70px]
                     animate-pulse rounded-full bg-pink-200
                     opacity-30 blur-2xl"
        />

        {/* Extra tiny bubble */}
        <div
          className="absolute left-[40%] top-[50%] h-[50px] w-[50px]
                     rounded-full bg-purple-100 opacity-25 blur-xl"
        />
      </div>

      {/* Page content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;
