"use client";
import { search_car } from "@/actions/car.actions";
import { CarForRent } from "@/generated/prisma";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
  results: CarForRent[];
  isLoading: boolean;
  error: string | null;
};

const SearchContext = createContext<SearchContextValue | null>(null);

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState(query);
  const [results, setResults] = useState<CarForRent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 500);
    return () => clearTimeout(id);
  }, [query]);

  // Fetch when debounced changes
  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Replace with your API
        const data = await search_car(debounced);
        console.log("Search results:", data);
        if (!cancelled) setResults(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Search failed");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const value = useMemo(
    () => ({ query, setQuery, results, isLoading, error }),
    [query, results, isLoading, error]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export default SearchProvider;

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
