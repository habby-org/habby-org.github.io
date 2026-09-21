(() => {
  const appStoreUrl = "https://apps.apple.com/us/app/habby/id6790799084";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=dev.yjyoon.habby";
  const userAgent = navigator.userAgent || "";
  const message = document.querySelector("#message");
  const fallback = document.querySelector("#fallback");

  // This document is reached only when the operating system did not hand the same URL to a
  // verified Android App Link or iOS Universal Link. Store redirection therefore never competes
  // with an installed app; it is the fallback for recipients who do not have habby yet.
  const destination = /iPhone|iPad|iPod/i.test(userAgent)
    ? appStoreUrl
    : /Android/i.test(userAgent)
      ? playStoreUrl
      : null;

  if (destination) {
    fallback.href = destination;
    fallback.textContent = "ストアを開く";
    window.setTimeout(() => window.location.replace(destination), 500);
  } else {
    message.textContent = "スマートフォンで開くと、habby アプリまたはストアをご利用いただけます。";
  }
})();
