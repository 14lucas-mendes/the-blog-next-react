"use client";

import DisplayError from "@/components/ErrorMessage";
import { useEffect } from "react";

type RootErrorPageProps = { error: Error & { digest?: string }; reset: () => void };

export default function RootErrorPage({ error, reset }: RootErrorPageProps) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div>
      <DisplayError pageTitle="Erro interno" contentTitle="500"
        message="Não foi possível carregar esta página. Tente novamente." />
      <div className="text-center mb-16">
        <button type="button" onClick={reset}
          className="rounded-lg bg-slate-900 text-white px-6 py-3 dark:bg-slate-100 dark:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

