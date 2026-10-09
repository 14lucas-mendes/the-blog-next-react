import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const origin = "http://127.0.0.1:3100";
const server = spawn(process.execPath, [
  "node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3100",
], { stdio: ["ignore", "inherit", "inherit"] });

async function page(path, expectedStatus = 200) {
  const response = await fetch(new URL(path, origin), { headers: { "user-agent": "Twitterbot" } });
  assert.equal(response.status, expectedStatus, path);
  return response.text();
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error("O servidor encerrou antes de iniciar.");
    try {
      const response = await fetch(origin);
      await response.arrayBuffer();
      ready = response.status === 200;
      if (ready) break;
    } catch {
      // The process is still starting; retry within a bounded startup window.
    }
    await delay(250);
  }
  assert.ok(ready, "O servidor não iniciou em 30 segundos.");

  const home = await page("/");
  assert.match(home, /lang="pt-BR"/);
  assert.match(home, /Rotina matinal de pessoas altamente eficazes/);
  const article = await page("/post/rotina-matinal-de-pessoas-altamente-eficazes");
  assert.match(article, /O Next.js também é uma boa escolha/);
  assert.match(article, /property="og:type" content="article"/);
  assert.match(article, /rel="canonical"/);
  const statuses = {};
  const expectedStatuses = {};
  for (const agent of ["Mozilla/5.0", "Twitterbot"]) {
    for (const path of ["/post/missing-post", "/post/como-a-tecnologia-impacta-nosso-bem-estar", "/?page=999"]) {
      const response = await fetch(new URL(path, origin), { headers: { "user-agent": agent } });
      await response.arrayBuffer();
      statuses[`${agent} ${path}`] = response.status;
      expectedStatuses[`${agent} ${path}`] = 404;
    }
  }
  assert.deepEqual(statuses, expectedStatuses, "Posts indisponíveis e páginas inexistentes devem responder 404 para navegadores e bots.");

  const sitemap = await page("/sitemap.xml");
  assert.match(sitemap, /rotina-matinal-de-pessoas-altamente-eficazes/);
  assert.doesNotMatch(sitemap, /como-a-tecnologia-impacta-nosso-bem-estar/);
  assert.match(await page("/robots.txt"), /Sitemap:/);

  const image = await fetch(new URL("/_next/image?url=%2Fimages%2Fbryen_8.png&w=640&q=75", origin));
  assert.equal(image.status, 200, "Otimização de imagem");
  assert.match(image.headers.get("content-type"), /^image\//);
  assert.ok((await image.arrayBuffer()).byteLength > 0);
  console.info("Smoke de produção: home, artigo, 404, rascunhos, SEO e imagem passaram.");
} finally {
  if (server.exitCode === null) {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill("SIGTERM");
    const timer = setTimeout(() => server.kill("SIGKILL"), 5000);
    timer.unref();
    await exited;
    clearTimeout(timer);
  }
}
