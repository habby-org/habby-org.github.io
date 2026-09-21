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

  // Automatically offer the installed app, but never infer installation with a store timer. On
  // iOS the confirmation alert leaves this page visible while the user decides; only a timed store
  // redirect caused the previous race. The visible link remains the fallback for WebViews that
  // reject non-user-initiated external navigation.
  window.setTimeout(() => {
    window.location.href = appUrl;
  }, 50);
})();
