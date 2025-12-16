/**
 * Sets up a global watcher that triggers Matomo page view tracking
 * whenever the document.title changes
 */
export function setupMatomoTitleTracking(matomo: any) {
  if (!matomo) {
    console.warn('[Matomo] Matomo instance not available for title tracking');
    return;
  }

  let lastTitle = document.title;

  // Create a MutationObserver to watch for changes to the document title
  const observer = new MutationObserver(() => {
    const currentTitle = document.title;

    if (currentTitle !== lastTitle && currentTitle) {
      lastTitle = currentTitle;

      // Track the page view with the new title
      matomo.trackPageView(currentTitle);
    }
  });

  // Start observing the document head for changes to child elements
  const titleElement = document.querySelector('head > title');
  if (titleElement) {
    observer.observe(titleElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  // Also observe the head for when title element is added/removed
  observer.observe(document.head, {
    childList: true,
    subtree: true,
  });

  // Return cleanup function
  return () => {
    observer.disconnect();
  };
}

