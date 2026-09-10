"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white p-6">
        <h2>Something went wrong</h2>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-zinc-800 rounded text-sm text-zinc-200"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
