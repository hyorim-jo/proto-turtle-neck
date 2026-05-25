import { useCallback, useEffect, useMemo, useState } from "react";

import { speechPrompts } from "../data/speechPrompts";

const promptsPerPage = 3;

export function usePromptPages(triggerKey) {
  const pages = useMemo(() => chunkPrompts(speechPrompts, promptsPerPage), []);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [triggerKey]);

  const setSafePageIndex = useCallback(
    (nextPageIndex) => {
      setPageIndex((currentPageIndex) => {
        const resolvedPageIndex =
          typeof nextPageIndex === "function" ? nextPageIndex(currentPageIndex) : nextPageIndex;
        return wrapPageIndex(resolvedPageIndex, pages.length);
      });
    },
    [pages.length]
  );

  return useMemo(
    () => ({
      pageIndex,
      pages,
      setPageIndex: setSafePageIndex
    }),
    [pageIndex, pages, setSafePageIndex]
  );
}

function chunkPrompts(prompts, size) {
  const pages = [];
  for (let index = 0; index < prompts.length; index += size) {
    const page = prompts.slice(index, index + size);
    let fillIndex = 0;

    while (page.length < size && prompts.length > 0) {
      page.push(prompts[fillIndex % prompts.length]);
      fillIndex += 1;
    }

    pages.push(page);
  }
  return pages;
}

function wrapPageIndex(index, pageCount) {
  if (pageCount <= 0) return 0;
  return ((index % pageCount) + pageCount) % pageCount;
}
