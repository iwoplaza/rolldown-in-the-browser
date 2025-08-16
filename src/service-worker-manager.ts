export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (navigator.serviceWorker.controller) {
    console.log("Service worker already registered");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/rolldown-in-the-browser/service-worker.js",
    );

    if (registration.installing) {
      console.log("Service worker installing");
    } else if (registration.waiting) {
      console.log("Service worker installed");
    } else if (registration.active) {
      console.log("Service worker active");
    }
  } catch (error) {
    console.error(`Registration failed with ${error}`);
  }

  // Refreshing the page
  window.location.reload();
}
