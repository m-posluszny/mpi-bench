import useSWR from "swr";
import { fetcher } from "./core";

export const useCore = (
  url,
  query,
  shouldRun = true,
  options = {},
  _fetcher = fetcher
) => {
  const { data, error, mutate, isLoading } = useSWR(
    shouldRun && url ? [url, query] : null,
    _fetcher,
    options
  );
  return { data, refresh: mutate, error, loading: isLoading };
};