import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** True only once the component has mounted on the client — used to defer
 * rendering of localStorage-backed state (e.g. the cart) until after hydration. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
