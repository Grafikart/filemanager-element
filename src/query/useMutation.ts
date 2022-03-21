import { writable } from "svelte/store";

type MutationOptions<Data> = {
  onSuccess?: (data: Data) => void;
  onError?: (e: unknown) => void;
};

export function useMutation<Arg extends Object, Data>(
  cb: (arg: Arg) => Promise<Data>,
  options: MutationOptions<Data> = {}
) {
  const mutate = (arg: Arg) => {
    store.update((v) => ({ ...v, isLoading: true }));
    return cb(arg)
      .then((data) => {
        options.onSuccess?.(data);
        store.update((v) => ({ ...v, isLoading: true }));
        return data;
      })
      .catch((reason) => {
        options.onError?.(reason);
        throw reason;
      });
  };
  const store = writable({
    isLoading: false,
    mutate: (arg: Arg) => {
      mutate(arg).catch(() => null);
    },
    mutateAsync: mutate,
  });

  return { subscribe: store.subscribe };
}
