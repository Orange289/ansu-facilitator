"use client";

import {Headphones} from "lucide-react";

export function AudioPlayer({src}: {src: string}) {
  return (
    <div className="mt-8 rounded-[6px] border border-ink/12 bg-background/70 p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-line/18 text-ink sm:flex">
          <Headphones size={19} />
        </div>
        <audio
          className="h-11 w-full accent-line"
          controls
          controlsList="nodownload"
          onContextMenu={(event) => event.preventDefault()}
          preload="metadata"
          src={src}
        />
      </div>
    </div>
  );
}
