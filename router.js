import React from "https://esm.sh/react@18.3.1";
import { html } from "../main.js";
import { HomePage } from "./views/HomePage.js";
import { CatalogPage } from "./views/CatalogPage.js";
import { TryOnPage } from "./views/TryOnPage.js";
import { CartPage } from "./views/CartPage.js";
import { LoginPage } from "./views/LoginPage.js";
import { ProfilePage } from "./views/ProfilePage.js";
import { NotFoundPage } from "./views/NotFoundPage.js";

function parseHash() {
  const raw = window.location.hash || "#/";
  const hash = raw.startsWith("#") ? raw.slice(1) : raw;
  const [path, queryString = ""] = hash.split("?");
  const query = new URLSearchParams(queryString);
  return { raw, path: path || "/", query };
}

export function useHashRoute() {
  const [route, setRoute] = React.useState(() => parseHash());
  React.useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(to) {
  window.location.hash = to.startsWith("#") ? to : `#${to}`;
}

export function RouterView({ route }) {
  const path = route.path;
  if (path === "/" || path === "/home") return html`<${HomePage} />`;
  if (path === "/catalog") return html`<${CatalogPage} />`;
  if (path === "/tryon") return html`<${TryOnPage} />`;
  if (path === "/cart") return html`<${CartPage} />`;
  if (path === "/login") return html`<${LoginPage} />`;
  if (path === "/profile") return html`<${ProfilePage} />`;
  return html`<${NotFoundPage} />`;
}

