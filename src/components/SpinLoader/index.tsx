import clsx from "clsx";

export default function SpinLoader({ className = "" }: { className?: string }) {
  return (
    <div role="status" aria-live="polite" className={clsx("flex items-center justify-center", className)}>
      <span className="sr-only">Carregando publicações...</span>
      <div aria-hidden="true" className="w-10 h-10 border-5 border-t-transparent border-slate-900 dark:border-slate-100 rounded-full animate-spin motion-reduce:animate-none" />
    </div>
  );
}

