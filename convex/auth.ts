import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  // callbacks: {
  //   async redirect({ redirectTo }) {
  //     if (
  //       redirectTo !== "luumaucadclient://" &&
  //       redirectTo !== "luumaucadadmin://" &&
  //       redirectTo !== "http://localhost:8081/"
  //     ) {
  //       throw new Error(`Invalid redirect URL ${redirectTo}"`);
  //     }
  //     return redirectTo;
  //   },
  // },
});
