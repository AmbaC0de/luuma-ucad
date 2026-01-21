import { OptionalRestArgsOrSkip, useQuery } from "convex/react";
import type { FunctionReference, OptionalRestArgs } from "convex/server";

export function useAppQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgsOrSkip<Query>
) {
  const data = useQuery(query, ...args);

  return {
    data,
    isFetching: data === undefined,
  };
}
