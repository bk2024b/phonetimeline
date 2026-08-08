export default function AdminLoading() {
  return (
    <main className="p-8">
      <div className="animate-pulse space-y-6 max-w-4xl">
        <div className="h-7 w-48 bg-line/60 rounded" />
        <div className="h-40 bg-surface border border-line rounded" />
        <div className="space-y-2">
          <div className="h-10 bg-surface border border-line rounded" />
          <div className="h-10 bg-surface border border-line rounded" />
          <div className="h-10 bg-surface border border-line rounded" />
        </div>
      </div>
    </main>
  );
}
