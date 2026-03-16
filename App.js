import React from "https://esm.sh/react@18.3.1";
import { html } from "../main.js";
import { RouterView, useHashRoute } from "./router.js";
import { StoreProvider, useStore } from "./store.js";
import { TopNav } from "./components/TopNav.js";
import { ToastHost } from "./components/ToastHost.js";

function AppShell() {
  const route = useHashRoute();
  const { state } = useStore();

  return html`
    <div class="min-h-dvh">
      <${TopNav} route=${route} />
      <main class="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-start justify-between gap-3">
          <div>
            <div class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              AI virtual try-on demo
            </div>
            <h1 class="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">
              Upload your photo, try outfits, compare looks, and shop
            </h1>
          </div>
          <div class="hidden items-center gap-2 sm:flex">
            <div
              class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              title="Saved locally in this browser"
            >
              Signed in:
              <span class="font-semibold">${state.user ? state.user.name : "Guest"}</span>
            </div>
          </div>
        </div>
        <${RouterView} route=${route} />
      </main>
      <${ToastHost} />
      <footer class="border-t border-slate-200 bg-white/60 py-6 text-sm text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            Built for hackathon: virtual try-on uses in-browser body segmentation and canvas overlays.
          </div>
          <div class="text-slate-500 dark:text-slate-400">
            No server required • Data stored locally
          </div>
        </div>
      </footer>
    </div>
  `;
}

export function App() {
  return html`
    <${StoreProvider}>
      <${AppShell} />
    </${StoreProvider}>
  `;
}

