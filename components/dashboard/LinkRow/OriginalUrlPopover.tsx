import { CheckIcon, CopyIcon, ExternalLinkIcon, LockIcon, UnlockIcon } from "lucide-react";



export default function OriginalUrlPopover({
  originalUrl,
  urlCopied,
  onCopy,
}: {
  originalUrl: string;
  urlCopied: boolean;
  onCopy: () => void;
}) {
  const displayUrl = originalUrl.replace(/^https?:\/\//, "");
  const isHttps = originalUrl.startsWith("https://");

  return (
    <div className="group relative min-w-0">

      {/* Pill */}
      <div className="flex items-center gap-1.5 w-fit max-w-full px-3 py-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-200 cursor-default">
        <span className={`shrink-0 ${isHttps ? "text-emerald-400" : "text-yellow-500"}`}>
          {isHttps ? <LockIcon /> : <UnlockIcon />}
        </span>
        <span className="truncate text-gray-300 text-xs font-mono leading-none">
          {displayUrl}
        </span>
      </div>

      {/* Popover */}
      <div className="
        absolute left-0 top-full mt-3 z-50 w-max max-w-[340px] opacity-0 translate-y-1.5 scale-[0.97] pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto
        transition-all duration-200 ease-out
      ">

        <div className="absolute -top-[5px] left-5 w-2.5 h-2.5 rotate-45 rounded-tl-[2px] bg-white/[0.08] border-l border-t border-white/15" />

        <div className="relative rounded-2xl overflow-hidden bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />

          <div className="relative p-3.5 flex flex-col gap-3">

            <div className="flex items-start gap-2">
              <span className={`mt-0.5 shrink-0 ${isHttps ? "text-emerald-400" : "text-yellow-500"}`}> {isHttps ? <LockIcon size={13} /> : <UnlockIcon size={13} />} </span>
              <p className="text-gray-200 text-xs font-mono break-all leading-relaxed">{originalUrl}</p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="flex items-center gap-2">
              <a href={originalUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150"
              >
                <ExternalLinkIcon />
                Open
              </a>

              <button onClick={onCopy}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150"
              >
                {urlCopied ? (
                  <>
                    <CheckIcon className="text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    Copy URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}