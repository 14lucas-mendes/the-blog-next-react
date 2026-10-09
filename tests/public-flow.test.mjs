import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PostFeatured } from "../src/components/PostFeatured/index.tsx";
import SpinLoader from "../src/components/SpinLoader/index.tsx";
import { SafeMarkdown } from "../src/components/SafeMarkdown/index.tsx";
import { createPostQueries } from "../src/lib/post/create-post-queries.ts";
import { JsonPostRepository } from "../src/repositories/post/json-post-repository.ts";
import { getPageNumber } from "../src/utils/pagination.ts";
import { HomePosts } from "../src/components/HomePosts/index.tsx";

test("the featured component safely handles absence of a post", () => {
  assert.equal(renderToStaticMarkup(PostFeatured({})), "");
});

test("an empty database renders the home page with a helpful empty state", async () => {
  const repository = new JsonPostRepository();
  repository.findAllPublic = async () => [];
  const queries = createPostQueries(repository);
  const data = await queries.findPublicPostPageCached(1);
  assert.match(renderToStaticMarkup(HomePosts({ ...data, page: 1 })), /Nenhuma publicação encontrada/);
  await assert.rejects(queries.findPublicPostPageCached(2), (error) => error.digest === "NEXT_HTTP_ERROR_FALLBACK;404");
});

test("query errors propagate while an absent post follows the 404 path", async () => {
  const failure = new Error("Database unavailable");
  const repository = new JsonPostRepository();
  repository.findBySlugPublic = async () => { throw failure; };
  repository.findAllPublic = async () => { throw failure; };
  const queries = createPostQueries(repository);
  await assert.rejects(queries.findPostBySlugCached("existing"), (error) => error === failure);
  await assert.rejects(queries.findPublicPostPageCached(1), (error) => error === failure);
  const publicQueries = createPostQueries(new JsonPostRepository());
  await assert.rejects(publicQueries.findPostBySlugCached("missing"), (error) => error.digest === "NEXT_HTTP_ERROR_FALLBACK;404");
  await assert.rejects(publicQueries.findPublicPostPageCached(999), (error) => error.digest === "NEXT_HTTP_ERROR_FALLBACK;404");
});

test("pagination accepts positive integers and rejects unsafe or malformed values", () => {
  assert.equal(getPageNumber("2"), 2);
  for (const value of [undefined, ["2"], "0", "-1", "1.5", "abc", "9007199254740991"]) {
    assert.equal(getPageNumber(value), 1);
  }
});

test("the loading indicator has an accessible name", () => {
  const html = renderToStaticMarkup(SpinLoader({}));
  assert.match(html, /role="status"/);
  assert.match(html, /Carregando publicações/);
});

test("Markdown renders tables while preventing executable links and raw scripts", () => {
  const html = renderToStaticMarkup(SafeMarkdown({
    markdown: '[unsafe](javascript:alert(1))\n\n<script>alert(1)</script>\n\n| Name |\n| --- |\n| Value |',
  }));
  assert.doesNotMatch(html, /href="javascript:|<script/);
  assert.match(html, /<table/);
  assert.match(html, /Value/);
});
