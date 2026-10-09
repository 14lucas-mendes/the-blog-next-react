import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PostFeatured } from "../src/components/PostFeatured/index.tsx";
import SpinLoader from "../src/components/SpinLoader/index.tsx";
import { SafeMarkdown } from "../src/components/SafeMarkdown/index.tsx";
import { findPostBySlugCached } from "../src/lib/post/queries.ts";
import { postRepository } from "../src/repositories/post/index.tsx";
import { getPageNumber } from "../src/utils/pagination.ts";
import HomePage from "../src/app/page.tsx";

test("the featured component safely handles absence of a post", () => {
  assert.equal(renderToStaticMarkup(PostFeatured({})), "");
});

test("an empty database renders the home page with a helpful empty state", async () => {
  const original = postRepository.findAllPublic;
  postRepository.findAllPublic = async () => [];
  try {
    const page = await HomePage({ searchParams: Promise.resolve({}) });
    const content = await page.props.children.type(page.props.children.props);
    assert.match(renderToStaticMarkup(content), /Nenhuma publicação encontrada/);
  } finally {
    postRepository.findAllPublic = original;
  }
});

test("query errors propagate while an absent post follows the 404 path", async () => {
  const original = postRepository.findBySlugPublic;
  try {
    const failure = new Error("Database unavailable");
    postRepository.findBySlugPublic = async () => { throw failure; };
    await assert.rejects(findPostBySlugCached("existing"), (error) => error === failure);
    postRepository.findBySlugPublic = async () => undefined;
    await assert.rejects(findPostBySlugCached("missing"), (error) => error.digest === "NEXT_HTTP_ERROR_FALLBACK;404");
  } finally {
    postRepository.findBySlugPublic = original;
  }
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
