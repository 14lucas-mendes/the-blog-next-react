export function getSiteUrl(environment: { NODE_ENV?: string; SITE_URL?: string }): URL {
  const configuredUrl = environment.SITE_URL?.trim();
  if (!configuredUrl && environment.NODE_ENV === "production") {
    throw new Error("SITE_URL é obrigatória em produção. Configure a URL pública antes do build e da inicialização.");
  }
  const url = new URL(configuredUrl || "http://localhost:3000");
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL deve ser uma URL HTTP ou HTTPS.");
  }
  return url;
}
