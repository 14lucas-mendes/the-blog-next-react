'use client';

import DisplayError from "@/components/ErrorMessage"
import { useEffect } from "react";

type RootErrorPageProps = {
  error: Error;
  reset: () => void;
}


export default function RootErrorPage({ error }: RootErrorPageProps) {
  useEffect(() => {
    console.log(error);
  }, [error])

  return (
      <DisplayError pageTitle="Internal server error" contentTitle="501" message="Deu ruim! Tente novamente mais tarde." />
    )
}