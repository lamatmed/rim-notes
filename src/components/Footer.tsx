import React from "react";
import { shadow } from "@/styles/utils";
export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur py-6 mt-8 text-center text-sm text-muted-foreground shadow-inner" style={{ boxShadow: shadow }}>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-widest text-base sm:text-lg text-foreground drop-shadow-sm">RIM Notes</span>
          <span className="opacity-80 text-xs sm:text-sm text-foreground/70">© {new Date().getFullYear()}</span>
        </div>
        <a
          href="https://github.com/lamatmed/rim-notes"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z" />
          </svg>
          <span className="underline underline-offset-2">Code source</span>
        </a>
      </div>
    </footer>
  );
} 