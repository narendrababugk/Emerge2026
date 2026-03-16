import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";
import { App } from "./ui/App.js";

export const html = htm.bind(React.createElement);

const root = createRoot(document.getElementById("app"));
root.render(html`<${App} />`);

