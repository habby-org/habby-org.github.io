(() => {
  const appStoreUrl = "https://apps.apple.com/jp/app/habby/id6790799084";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=dev.yjyoon.habby";
  const userAgent = navigator.userAgent || "";
  const message = document.querySelector("#message");
  const fallback = document.querySelector("#fallback");

  // Since iPadOS 13, Safari can identify itself as Macintosh. touch points distinguish an iPad
  // from a Mac so an iPad without habby still reaches the App Store fallback.
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
    || (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);

  // This document is reached only when the operating system did not hand the same URL to a
  // verified Android App Link or iOS Universal Link. Store redirection therefore never competes
  // with an installed app; it is the fallback for recipients who do not have habby yet.
  const destination = isIOS
    ? appStoreUrl
    : isAndroid
      ? playStoreUrl
      : null;

  if (destination) {
    fallback.href = destination;
    fallback.textContent = isIOS ? "App Storeでダウンロード" : "Google Playでダウンロード";
    window.setTimeout(() => window.location.replace(destination), 600);
  } else {
    message.textContent = "スマートフォンで開くと、habby アプリまたはストアをご利用いただけます。";
  }
})();
