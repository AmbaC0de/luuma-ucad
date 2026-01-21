import { useConvexAuth } from "convex/react";

export const useIsSignedIn = () => {
  const { isAuthenticated } = useConvexAuth();
  return isAuthenticated;
};

export const useIsSignedOut = () => {
  const { isAuthenticated } = useConvexAuth();
  return !isAuthenticated;
};
