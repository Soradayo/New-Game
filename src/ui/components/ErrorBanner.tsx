export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-100">
      {message}
    </div>
  );
}
