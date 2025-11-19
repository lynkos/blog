import Toast from 'bootstrap/js/src/toast';

// Detect if the user is on iOS (iPhone, iPad, or iPod)
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Force a complete refresh for iOS devices to work around Safari's
// buggy service worker lifecycle management
function forceCompleteRefresh() {
  const unregisterPromises = [];
  
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      unregisterPromises.push(registration.unregister());
    });
    
    return Promise.all(unregisterPromises);
  }).then(() => {
    // Clear all caches after unregistering service workers
    if ('caches' in window) {
      return caches.keys().then((cacheNames) => {
        const deletePromises = cacheNames.map(name => caches.delete(name));
        return Promise.all(deletePromises);
      });
    }
  }).then(() => {
    // Wait briefly to ensure cleanup completes, then force a hard reload
    // The delay is necessary because iOS Safari needs time to process
    // the unregistration and cache clearing operations
    setTimeout(() => {
      window.location.reload(true);
    }, 150);
  }).catch((error) => {
    // If something goes wrong, still try to reload
    console.error('Error during iOS refresh:', error);
    window.location.reload(true);
  });
}

if ('serviceWorker' in navigator) {
  const isiOSDevice = isIOS();
  
  // Get Jekyll config from URL parameters
  const src = new URL(document.currentScript.src);
  const register = src.searchParams.get('register');
  const baseUrl = src.searchParams.get('baseurl');

  if (register) {
    const swUrl = `${baseUrl}/sw.min.js`;
    const notification = document.getElementById('notification');
    const btnRefresh = notification.querySelector('.toast-body>button');
    const popupWindow = Toast.getOrCreateInstance(notification);

    navigator.serviceWorker.register(swUrl).then((registration) => {
      // Restore the update window that was last manually closed by the user
      if (registration.waiting) {
        popupWindow.show();
      }

      registration.addEventListener('updatefound', () => {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting) {
            if (navigator.serviceWorker.controller) {
              popupWindow.show();
            }
          }
        });
      });

      btnRefresh.addEventListener('click', () => {
        // Hide the popup immediately so the user gets feedback
        popupWindow.hide();
        
        if (isiOSDevice) {
          // iOS Safari has issues with the standard skipWaiting approach,
          // so we force a complete service worker unregistration and cache clear
          forceCompleteRefresh();
        } else {
          // Standard approach for non-iOS browsers
          if (registration.waiting) {
            registration.waiting.postMessage('SKIP_WAITING');
          }
        }
      });
    });

    // Only set up the controllerchange listener for non-iOS devices
    // iOS devices will handle reloading through forceCompleteRefresh instead
    if (!isiOSDevice) {
      let refreshing = false;

      // Detect controller change and refresh all the opened tabs
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  } else {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
}