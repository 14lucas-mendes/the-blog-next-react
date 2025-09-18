import DisplayError from "@/components/ErrorMessage";


export default function NotFoundPage() {
  return (
    <DisplayError
      pageTitle="Página não encontrada"
      contentTitle="404"
      message="Error 404 - A página que você está procurando não foi encontrada."
    />
  );
}
