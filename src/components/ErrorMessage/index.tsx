'use client'

import clsx from "clsx";

type DisplayErrorProps = {
  pageTitle: string;
  contentTitle: string;
  message: React.ReactNode
}

export default function DisplayError({ pageTitle, contentTitle, message }: DisplayErrorProps) {
  return (
    <>
    <title>{pageTitle}</title>
    <div className={clsx('min-h-[320px] bg-slate-900 text-slate-100', 
      'mb-16 p-8 rounded-xl', 'dark:bg-slate-100 dark:text-slate-900',
      'flex items-center justify-center', 'text-center'
      )}>
      <div>
        <h1 className="text-5xl/normal mb-4 font-extrabold">{contentTitle}</h1>
        <div className="text-xl/normal mb-4">{message}</div>
      </div>
    </div>
    </>
  )
}