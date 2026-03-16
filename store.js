import React from "https://esm.sh/react@18.3.1";
import { html } from "../main.js";

const STORAGE_KEY = "aitryon_store_v1";

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

const initialState = {
  user: null, // { id, name, email }
  theme: "light",
  cart: [], // [{ productId, qty }]
  favorites: [], // [{ id, productIds, createdAt, photoDataUrl?, label? }]
  tryOn: {
    photoDataUrl: null,
    selectedProductIds: [],
    compareProductIds: [],
    overlay: { opacity: 0.92, scale: 1.0, yOffset: 0, xOffset: 0 },
  },
  toasts: [],
};

function loadState() {
  const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const parsed = raw ? safeJsonParse(raw) : null;
  if (!parsed || typeof parsed !== "object") return { ...initialState };

  const theme = parsed.theme === "dark" ? "dark" : "light";
  if (theme === "dark") document.documentElement.classList.add("dark");

  return {
    ...initialState,
    ...parsed,
    theme,
    toasts: [],
  };
}

function persistState(state) {
  const payload = { ...state, toasts: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function uid() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function reducer(state, action) {
  switch (action.type) {
    case "toast:add": {
      const toast = { id: uid(), kind: action.kind || "info", message: action.message, createdAt: Date.now() };
      return { ...state, toasts: [...state.toasts, toast].slice(-4) };
    }
    case "toast:dismiss": {
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    }
    case "theme:set": {
      const theme = action.theme === "dark" ? "dark" : "light";
      if (theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return { ...state, theme };
    }
    case "auth:login": {
      const user = { id: uid(), name: action.name, email: action.email };
      return { ...state, user };
    }
    case "auth:logout": {
      return { ...state, user: null };
    }
    case "cart:add": {
      const { productId, qty = 1 } = action;
      const found = state.cart.find((x) => x.productId === productId);
      const cart = found
        ? state.cart.map((x) => (x.productId === productId ? { ...x, qty: x.qty + qty } : x))
        : [...state.cart, { productId, qty }];
      return { ...state, cart };
    }
    case "cart:remove": {
      return { ...state, cart: state.cart.filter((x) => x.productId !== action.productId) };
    }
    case "cart:setQty": {
      const qty = Math.max(1, Number(action.qty || 1));
      return {
        ...state,
        cart: state.cart.map((x) => (x.productId === action.productId ? { ...x, qty } : x)),
      };
    }
    case "cart:clear": {
      return { ...state, cart: [] };
    }
    case "tryon:setPhoto": {
      return { ...state, tryOn: { ...state.tryOn, photoDataUrl: action.photoDataUrl } };
    }
    case "tryon:setSelected": {
      return { ...state, tryOn: { ...state.tryOn, selectedProductIds: action.productIds } };
    }
    case "tryon:setCompare": {
      return { ...state, tryOn: { ...state.tryOn, compareProductIds: action.productIds } };
    }
    case "tryon:setOverlay": {
      return { ...state, tryOn: { ...state.tryOn, overlay: { ...state.tryOn.overlay, ...action.overlay } } };
    }
    case "favorites:saveLook": {
      const look = {
        id: uid(),
        label: action.label || "Saved look",
        productIds: action.productIds || [],
        photoDataUrl: action.photoDataUrl || null,
        createdAt: nowIso(),
      };
      return { ...state, favorites: [look, ...state.favorites].slice(0, 30) };
    }
    case "favorites:remove": {
      return { ...state, favorites: state.favorites.filter((x) => x.id !== action.id) };
    }
    default:
      return state;
  }
}

const StoreCtx = React.createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, undefined, loadState);

  React.useEffect(() => {
    // Avoid persisting transient toasts
    persistState(state);
  }, [state.user, state.theme, state.cart, state.favorites, state.tryOn]);

  const api = React.useMemo(() => {
    const toast = (message, kind = "info") => dispatch({ type: "toast:add", message, kind });
    return {
      state,
      dispatch,
      toast,
    };
  }, [state]);

  return html`<${StoreCtx.Provider} value=${api}>${children}</${StoreCtx.Provider}>`;
}

export function useStore() {
  const ctx = React.useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

