export const POSTS_PER_PAGE = 10;

export function getPageNumber(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= Math.floor(Number.MAX_SAFE_INTEGER / POSTS_PER_PAGE)
    ? page : 1;
}

