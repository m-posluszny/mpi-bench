import useSWR from "swr";
import { fetcher } from "./core";

export const useCore = (
  url,
  query,
  shouldRun = true,
  options = {}
) => {
  const { data, error, mutate, isLoading } = useSWR(
    shouldRun && url ? [url, query] : null,
    fetcher,
    options
  );
  return { data, refresh: mutate, error, loading: isLoading };
};