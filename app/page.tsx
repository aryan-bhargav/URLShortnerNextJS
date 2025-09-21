import Image from "next/image";
import UrlShortner from "@/components/url-shortner-container";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  bg-gray-50 px-6 py-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          URL Shortener
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Shorten your links and share them instantly with friends, colleagues,
          or anyone online.
        </p>
      </div>

      <div className="mt-8 w-full max-w-xl">
        <UrlShortner />
      </div>
    </main>
  );
}
