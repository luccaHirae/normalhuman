"use client";

import { atom, useAtom } from "jotai";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useThreads } from "@/hooks/use-threads";

export const searchValueAtom = atom("");
export const isSearchingAtom = atom(false);

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [, setIsSearching] = useAtom(isSearchingAtom);
  const { isFetching } = useThreads();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFocus = () => {
    setIsSearching(true);
  };

  const handleBlur = () => {
    if (searchValue === "") {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setIsSearching(false);
  };

  return (
    <div className="relative m-4">
      <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
      <Input
        value={searchValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search..."
        className="pl-8"
      />

      <div className="absolute right-2 top-2.5 flex items-center gap-2">
        {isFetching && (
          <Loader2 className="size-4 animate-spin text-gray-400" />
        )}

        <button
          onClick={handleClear}
          className="rounded-sm hover:bg-gray-400/20"
        >
          <X className="size-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};
