import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// ── Console Branding ──
if (typeof window !== "undefined") {
  const styles = {
    banner: "font-size:32px;font-weight:800;background:linear-gradient(135deg,#9333EA,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;",
    tagline: "font-size:13px;color:#a78bfa;font-weight:600;",
    info: "font-size:11px;color:#6b7280;",
    link: "font-size:11px;color:#9333EA;font-weight:600;",
  };

  /* eslint-disable no-console */
  console.log("%cOnMeet", styles.banner);
  console.log("%c AI-Powered Video Meeting Platform", styles.tagline);
  console.log(
    "%c%s\n%c%s",
    styles.info, "Built with React + TypeScript + LiveKit",
    styles.link, "https://onmeet.cloud",
  );
  /* eslint-enable no-console */
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
