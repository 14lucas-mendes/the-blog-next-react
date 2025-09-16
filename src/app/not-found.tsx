import clsx from "clsx";

export default function NotFoundPage() {
  return (
    <div className={clsx('min-h-[320px] bg-slate-900 text-slate-100', 
    'mb-16 p-8 rounded-xl', 'dark:bg-slate-100 dark:text-slate-900',
    'flex items-center justify-center', 'text-center'
    )}>
      <div>
        <h1 className="text-5xl/normal mb-4 font-extrabold">404 - Página não encontrada</h1>
        <p className="text-xl/normal mb-4">A página que você está procurando não foi encontrada.</p>
      </div>
    </div>
  )
}