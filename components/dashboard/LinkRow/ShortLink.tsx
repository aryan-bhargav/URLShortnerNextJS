export default function ShortLink({
  shortCode,
  shortUrl,
}: {
  shortCode: string;
  shortUrl: string;
}) {
  return (
    <a
      href={`/${shortCode}`}
      target="_blank"
      className="text-blue-400 hover:underline truncate font-mono text-sm"
    >
      {shortCode}
    </a>
  );
}
