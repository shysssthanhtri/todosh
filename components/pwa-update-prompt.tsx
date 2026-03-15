"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Detects when a new service worker is waiting (after a re-deploy) and prompts
 * the user to reload. Used with Serwist when skipWaiting/clientsClaim are disabled
 * to avoid stale-page issues (e.g. drawer closing on first open).
 */
export function PwaUpdatePrompt() {
  const promptedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const showReloadPrompt = (registration: ServiceWorkerRegistration) => {
      const waiting = registration.waiting;
      if (!waiting || promptedRef.current) return;
      promptedRef.current = true;

      const reload = () => {
        waiting.postMessage({ type: "SKIP_WAITING" });
        const onControllerChange = () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            onControllerChange,
          );
          window.location.reload();
        };
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          onControllerChange,
        );
      };

      toast.info("New version available", {
        position: "top-center",
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: "Reload",
          onClick: reload,
        },
      });
    };

    const checkAndPrompt = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        showReloadPrompt(registration);
      }
    };

    const attachUpdateFoundListener = (
      registration: ServiceWorkerRegistration,
    ) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            showReloadPrompt(registration);
          }
        });
      });
    };

    let mounted = true;

    navigator.serviceWorker.ready.then((registration) => {
      if (!mounted) return;
      checkAndPrompt(registration);
      attachUpdateFoundListener(registration);
    });

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        navigator.serviceWorker.ready.then((registration) => {
          if (!mounted) return;
          registration.update();
          checkAndPrompt(registration);
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
