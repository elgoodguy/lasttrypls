declare module '@tanstack/react-query' {
  export interface QueryOptions<TData = unknown, TError = Error> {
    queryKey: unknown[];
    queryFn: () => Promise<TData>;
    enabled?: boolean;
    retry?: boolean | number;
    retryDelay?: number | ((retryAttempt: number) => number);
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    refetchOnReconnect?: boolean;
    refetchInterval?: number | false;
    refetchIntervalInBackground?: boolean;
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
    onSettled?: (data: TData | undefined, error: TError | null) => void;
  }

  export interface MutationOptions<TData = unknown, TError = Error, TVariables = void> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
    onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  }

  export function useQuery<TData = unknown, TError = Error>(
    options: QueryOptions<TData, TError>
  ): {
    data: TData | undefined;
    error: TError | null;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    refetch: () => Promise<void>;
  };

  export function useMutation<TData = unknown, TError = Error, TVariables = void>(
    options: MutationOptions<TData, TError, TVariables>
  ): {
    mutate: (variables: TVariables) => void;
    mutateAsync: (variables: TVariables) => Promise<TData>;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: TError | null;
    data: TData | undefined;
  };

  export function useQueryClient(): {
    invalidateQueries: (options: { queryKey: unknown[] }) => void;
  };
} 