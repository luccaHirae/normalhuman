"use client";

import DOMPurify from "dompurify";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { useDebounceValue } from "usehooks-ts";
import { api } from "@/trpc/react";
import { useThreads } from "@/hooks/use-threads";
import { searchValueAtom } from "@/app/mail/search-bar";

export const SearchDisplay = () => {
  const [searchValue] = useAtom(searchValueAtom);
  const [debouncedSearchValue] = useDebounceValue(searchValue, 500);
  const search = api.account.searchEmails.useMutation();
  const { accountId } = useThreads();

  useEffect(() => {
    if (!accountId) return;

    search.mutate({
      accountId,
      query: debouncedSearchValue,
    });

    // adding search to the dependencies array will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, debouncedSearchValue]);

  return (
    <div className="max-h-[calc(100vh-50px)] overflow-y-scroll p-4">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-sm text-gray-600 dark:text-gray-400">
          Your search for &quot;{searchValue}&quot; come back with...
        </h2>
      </div>

      {search.data?.hits.length === 0 ? (
        <p>No results found</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {search.data?.hits.map((hit) => (
            <li
              key={hit.id}
              className="cursor-pointer list-none rounded-md border p-4 transition-all hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              <h3 className="text-base font-medium">{hit.document.subject}</h3>

              <p className="text-sm text-gray-500">From: {hit.document.from}</p>

              <p className="text-sm text-gray-500">
                To:{" "}
                {Array.isArray(hit.document.to)
                  ? hit.document.to.join(", ")
                  : hit.document.to}
              </p>

              <p
                className="mt-2 text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(hit.document.rawBody as string, {
                    USE_PROFILES: { html: true },
                  }),
                }}
              ></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
