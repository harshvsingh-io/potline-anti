import React from "react";

interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Wordmark: React.FC<WordmarkProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`relative inline-flex flex-col select-none ${className}`}>
      <div className={`flex items-baseline font-serif font-bold tracking-tight text-ink dark:text-paper ${sizeClasses[size]}`}>
        <span>Pl</span>
        
        {/* Survey-point marker replacing the 'o' */}
        <span className="relative inline-flex items-center justify-center mx-[1px] self-center">
          <svg
            className={size === "lg" ? "w-6 h-6" : size === "md" ? "w-4 h-4" : "w-3 h-3"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            {/* Outer survey boundary ring */}
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeDasharray="3 2" />
            {/* Inner survey benchmark dot */}
            <circle cx="12" cy="12" r="2.5" fill="#1F4D3A" className="dark:fill-[#2A644C]" />
            {/* Orthogonal survey benchmark crosshair ticks */}
            <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" />
            <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" />
            <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" />
            <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" />
          </svg>
        </span>

        <span>tline</span>
      </div>

      {/* Thin boundary line under the word ending in a small cadastral polygon corner */}
      <div className="relative w-full h-[3px] mt-[1px] flex items-center">
        <div className="h-[1px] flex-1 bg-ink/30 dark:bg-paper/30" />
        <svg className="w-2.5 h-2.5 text-forest dark:text-[#388062] -ml-[1px]" viewBox="0 0 10 10" fill="currentColor">
          <path d="M0,5 L7,5 L7,0 L9,0 L9,7 L0,7 Z" />
        </svg>
      </div>
    </div>
  );
};
