const searchParamKeyLimit = "pl";
const searchParamKeyPrevPage = "pp";
const searchParamKeyNextPage = "pn";

export function getForwardCursorPaginationParams(
  searchParams: URLSearchParams,
  limit?: number
) {
  const first = searchParams.get(searchParamKeyLimit)
    ? Number(searchParams.get(searchParamKeyLimit))
    : limit ?? 20;
  const after = searchParams.get(searchParamKeyNextPage);
  if (typeof after === "string") {
    return { first, after };
  }
  return { first };
}

export function getCursorPaginationLinkTos(
  url: URL,
  cursorNext: string | null
) {
  const searchParams = url.searchParams;
  const prevPageTo = searchParams.get(searchParamKeyPrevPage);

  let nextPageTo: string | null = null;
  if (cursorNext != null) {
    const tmp = url;
    tmp.searchParams.set(searchParamKeyPrevPage, tmp.pathname + tmp.search);
    tmp.searchParams.set(searchParamKeyNextPage, cursorNext);
    nextPageTo = tmp.pathname + tmp.search;
  }

  return { nextPageTo, prevPageTo };
}
