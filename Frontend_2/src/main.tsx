import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Default the app to dark mode for the whole project
// Tailwind is configured with `darkMode: ['class']` so adding
// the 'dark' class to the root element enables the dark variables.
if (typeof document !== "undefined") {
	document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
