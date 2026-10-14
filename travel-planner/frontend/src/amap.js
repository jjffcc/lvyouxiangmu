let amapPromise;

export function loadAMap() {
  const key = import.meta.env.VITE_AMAP_WEB_KEY?.trim();
  if (!key) return Promise.reject(new Error("missing-key"));
  if (window.AMap) return Promise.resolve(window.AMap);

  if (!amapPromise) {
    window._AMapSecurityConfig = {
      serviceHost: `${window.location.origin}/_AMapService`,
    };

    amapPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}`;
      script.async = true;
      script.onload = () => {
        if (window.AMap) resolve(window.AMap);
        else reject(new Error("amap-unavailable"));
      };
      script.onerror = () => {
        script.remove();
        amapPromise = undefined;
        reject(new Error("amap-load-failed"));
      };
      document.head.append(script);
    });
  }

  return amapPromise;
}

export function loadAMapPlugins(AMap, plugins) {
  return new Promise((resolve) => AMap.plugin(plugins, resolve));
}
