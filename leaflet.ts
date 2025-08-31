let leafletPromise: Promise<any> | null = null;

export async function ensureLeaflet(): Promise<any> {
  if (typeof window === "undefined") return null;
  const w = window as any;
  if (w.L) return w.L;
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      // Inject CSS
      const idCss = "leaflet-cdn-css";
      if (!document.getElementById(idCss)) {
        const link = document.createElement("link");
        link.id = idCss;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      // Inject JS
      const idJs = "leaflet-cdn-js";
      if (document.getElementById(idJs)) {
        const wait = () => (w.L ? resolve(w.L) : setTimeout(wait, 50));
        wait();
        return;
      }
      const script = document.createElement("script");
      script.id = idJs;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => resolve((window as any).L);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return leafletPromise;
}
