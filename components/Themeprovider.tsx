"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// External-store pattern. The previous version read localStorage inside a
// mount effect and called setTheme(saved), which React 19's
// react-hooks/set-state-in-effect lint flags as an anti-pattern (cascading
// renders). useSyncExternalStore is the React-blessed way to bind external
// state into a component without that pattern.
//
// Server snapshot is always "dark" so SSR + initial client hydration match;
// after hydration React switches to the real localStorage snapshot. Users who
// saved "light" still see a brief flicker — fixing that needs a blocking
// pre-hydration script in <head>, which is out of scope here.

const STORAGE_KEY = "hv_theme";

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach(cb => cb());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Cross-tab sync: another tab toggling theme should propagate here. Local
  // (same-tab) writes don't fire `storage`, hence the manual emit() in toggle.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "dark";
  } catch {
    return "dark";
  }
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Mirror theme to the DOM as a data attribute. Pure side effect (DOM write,
  // not React state) — lint is happy with this kind of effect.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode / disabled storage — non-blocking */
    }
    emit();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
