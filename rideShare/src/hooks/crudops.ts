import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseCrudOperationsOptions<
  TData,
  TCreatePayload,
  TUpdatePayload,
  TDeleteKey,
> {
  queryKey: QueryKey
  fetchFn: () => Promise<TData[]>
  createFn: (payload: TCreatePayload) => Promise<TData>
  updateFn: (id: string, payload: TUpdatePayload) => Promise<TData>
  deleteFn: (id: TDeleteKey) => Promise<void>
}

interface UseCrudOperationsReturn<
  TData,
  TCreatePayload,
  TUpdatePayload,
  TDeleteKey,
> {
  query: UseQueryResult<TData[], Error>
  create: UseMutationResult<TData, Error, TCreatePayload>
  update: UseMutationResult<
    TData,
    Error,
    { id: string; payload: TUpdatePayload }
  >
  delete: UseMutationResult<void, Error, TDeleteKey>
}

export function useCrudOperations<
  TData,
  TCreatePayload,
  TUpdatePayload,
  TDeleteKey,
>(
  resourceQueryKeys: {
    all: QueryKey
    details: (id: string) => QueryKey
  },
  options: Omit<
    UseCrudOperationsOptions<TData, TCreatePayload, TUpdatePayload, TDeleteKey>,
    'queryKey'
  >,
): UseCrudOperationsReturn<TData, TCreatePayload, TUpdatePayload, TDeleteKey> {
  const queryClient = useQueryClient()
  //  ---- get Data ---
  const query = useQuery<TData[], Error>({
    queryKey: resourceQueryKeys.all,
    queryFn: options.fetchFn,
    refetchOnWindowFocus: true,
  })

  // --- Create Mutation ---
  const create = useMutation<TData, Error, TCreatePayload>({
    mutationFn: options.createFn,
    onSuccess: () => {
      toast.success(`Item created successfully!`)
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.all })
    },
    onError: (error) => {
      toast.error(`Failed to create item: ${error.message}`)
    },
  })
  // --- Update Mutation ---
  const update = useMutation<
    TData,
    Error,
    { id: string; payload: TUpdatePayload }
  >({
    mutationFn: ({ id, payload }) => options.updateFn(id, payload),
    onSuccess: (_, variables) => {
      toast.success(`Item updated successfully!`)
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.all })
      queryClient.invalidateQueries({
        queryKey: resourceQueryKeys.details(variables.id),
      })
    },
    onError: (error) => {
      toast.error(`Failed to update item: ${error.message}`)
    },
  })
  // --- Delete Mutation ---
  const remove = useMutation<void, Error, TDeleteKey>({
    mutationFn: options.deleteFn,
    onSuccess: (_, variables) => {
      toast.success(`Item deleted successfully!`)
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.all })
      if (typeof variables === 'string') {
        queryClient.removeQueries({
          queryKey: resourceQueryKeys.details(variables),
        })
      }
    },
    onError: (error) => {
      toast.error(`Failed to delete item: ${error.message}`)
    },
  })

  return {
    query,
    create,
    update,
    delete: remove,
  }
}
