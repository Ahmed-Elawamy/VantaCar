export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-graphite-950">
      <div className="relative">
        <div className="h-10 w-10 animate-spin rounded-full border border-graphite-700 border-t-accent" />
      </div>
      <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500">
        VANTA / Loading
      </p>
    </div>
  )
}
