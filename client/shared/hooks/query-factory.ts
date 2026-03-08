import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

// ── Query Hook Factory ──

export function createQueryHook<TData, TParams extends unknown[] = []>(config: {
  queryKey: (...args: TParams) => QueryKey;
  queryFn: (...args: TParams) => Promise<TData>;
  defaultOptions?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">;
}) {
  return function useGeneratedQuery(
    ...args: [...TParams, ...[options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">]]
  ) {
    const params = args.slice(0, config.queryFn.length) as unknown as TParams;
    const options = args[config.queryFn.length] as
      | Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
      | undefined;

    return useQuery<TData>({
      queryKey: config.queryKey(...params),
      queryFn: () => config.queryFn(...params),
      ...config.defaultOptions,
      ...options,
    });
  };
}

// ── Mutation Hook Factory ──

export function createMutationHook<TData, TVars>(config: {
  mutationFn: (vars: TVars) => Promise<TData>;
  invalidateKeys?: QueryKey[];
  defaultOptions?: Omit<UseMutationOptions<TData, unknown, TVars>, "mutationFn">;
}) {
  return function useGeneratedMutation(
    options?: Omit<UseMutationOptions<TData, unknown, TVars>, "mutationFn">,
  ) {
    const qc = useQueryClient();

    return useMutation<TData, unknown, TVars>({
      mutationFn: config.mutationFn,
      ...config.defaultOptions,
      ...options,
      onSuccess: (data, vars, context) => {
        if (config.invalidateKeys) {
          config.invalidateKeys.forEach((key) => {
            qc.invalidateQueries({ queryKey: key });
          });
        }
        options?.onSuccess?.(data, vars, context);
        config.defaultOptions?.onSuccess?.(data, vars, context);
      },
    });
  };
}

// ── Paginated Query Hook Factory ──

export function createPaginatedQueryHook<TItem, TParams extends unknown[] = []>(config: {
  queryKey: (...args: TParams) => QueryKey;
  queryFn: (...args: TParams) => Promise<{ content: TItem[]; totalPages: number; last: boolean }>;
  defaultOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn">;
}) {
  return function useGeneratedPaginatedQuery(
    ...args: [...TParams, ...[options?: Omit<UseQueryOptions, "queryKey" | "queryFn">]]
  ) {
    const params = args.slice(0, config.queryFn.length) as unknown as TParams;
    const options = args[config.queryFn.length] as
      | Omit<UseQueryOptions, "queryKey" | "queryFn">
      | undefined;

    return useQuery({
      queryKey: config.queryKey(...params),
      queryFn: () => config.queryFn(...params),
      ...config.defaultOptions,
      ...options,
    });
  };
}
