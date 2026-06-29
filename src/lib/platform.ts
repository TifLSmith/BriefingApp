import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

// True when running inside the native iOS/Android Capacitor shell (vs. a plain web
// browser). Per Apple Guideline 3.1.1 the native apps are read-only — Pro is sold on
// the web only — so we use this to hide all in-app purchase/checkout UI.
export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

// Client-only variant: returns false during SSR and the first client render (so
// hydration matches the server), then flips to the real value after mount. Use this
// in components that conditionally hide purchase UI.
export function useIsNativeApp(): boolean {
  const [native, setNative] = useState(false);
  useEffect(() => setNative(isNativeApp()), []);
  return native;
}
