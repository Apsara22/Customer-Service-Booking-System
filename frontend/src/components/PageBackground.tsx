import React from "react";

const PageBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      {/* Purple blur bubble */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[250px] h-[200px]
                   bg-purple-600 rounded-full blur-3xl opacity-40
                   animate-pulse"
      />

      {/* Pink blur bubble */}
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[200px] h-[200px]
                   bg-pink-500 rounded-full blur-3xl opacity-40
                   animate-pulse"
      />

      {/* Small purple bubble */}
      <div
        className="absolute top-[20%] right-[15%] w-[200px] h-[200px]
                   bg-purple-400 rounded-full blur-2xl opacity-30
                   animate-bounce"
      />

      {/* Small pink bubble */}
      <div
        className="absolute bottom-[30%] left-[20%] w-[70px] h-[70px]
                   bg-pink-200 rounded-full blur-2xl opacity-30
                   animate-pulse"
      />

      {/* Extra tiny bubble */}
      <div
        className="absolute top-[50%] left-[40%] w-[50px] h-[50px]
                   bg-purple-100 rounded-full blur-xl opacity-25"
      />
    </div>
  );
};

export default PageBackground;