(() => {
  const appStoreUrl = "https://apps.apple.com/jp/app/habby/id6790799084";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=dev.yjyoon.habby";
  const userAgent = navigator.userAgent || "";
  const message = document.querySelector("#message");
  const openApp = document.querySelector("#open-app");
  const fallback = document.querySelector("#fallback");

  // Since iPadOS 13, Safari can identify itself as Macintosh. touch points distinguish an iPad
  // from a Mac so an iPad without habby still reaches the App Store fallback.
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
    || (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);

  const code = new URLSearchParams(window.location.search).get("code")?.trim();

  // A verified App/Universal Link normally opens before this page loads. Some in-app browsers
  // consume https links themselves, though, so reaching the page does not prove that habby is not
  // installed. In that case this narrow custom scheme gives the installed app a second chance.
  const destination = isIOS
    ? appStoreUrl
    : isAndroid
      ? playStoreUrl
      : null;

  if (!destination || !code) {
    openApp.href = "/intro/";
    openApp.textContent = "habby の紹介を見る";
    message.textContent = "スマートフォンで開くと、habby アプリまたはストアをご利用いただけます。";
    return;
  }

  const customSchemeUrl = `habby://invite?code=${encodeURIComponent(code)}`;
  const appUrl = isAndroid
    ? `intent://invite?code=${encodeURIComponent(code)}`
      + `#Intent;scheme=habby;package=dev.yjyoon.habby;`
      + `S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`
    : customSchemeUrl;

  fallback.style.display = "inline-block";
  fallback.href = destination;
  fallback.textContent = isIOS ? "App Storeでダウンロード" : "Google Playでダウンロード";
  openApp.href = appUrl;

  let fallbackTimer = null;
  let leftPage = false;

  const cancelFallback = () => {
    leftPage = true;
    if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") cancelFallback();
  });
  window.addEventListener("pagehide", cancelFallback);

  const launchApp = () => {
    leftPage = false;
    if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    fallbackTimer = window.setTimeout(() => {
      if (!leftPage && document.visibilityState === "visible") {
        window.location.replace(destination);
      }
    }, 1800);
    window.location.href = appUrl;
  };

  openApp.addEventListener("click", (event) => {
    event.preventDefault();
    launchApp();
  });

  // Preserve automatic handoff while giving iOS enough time to background Safari before deciding
  // that the scheme was unhandled. The button covers WebViews that block automatic navigation.
  window.setTimeout(launchApp, 50);
})();
