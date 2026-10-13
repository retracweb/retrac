// URL Override Script - Replaces download button URLs after Framer hydration
(function() {
    'use strict';

    // Your new download URL
    const NEW_DOWNLOAD_URL = 'https://projectretracfn.com/download';

    // Old URLs to replace (add any variations you find)
    const OLD_URLS = [
        'https://github.com/retracfndev/Retrac/releases/download/2.1.2/Retrac.Setup.2.1.2.exe',
        // Add more old URLs here if needed
    ];

    function fixLink(link) {
        const href = link.getAttribute('href');
        if (href === null || href === NEW_DOWNLOAD_URL) return;
        if (OLD_URLS.includes(href)) {
            link.setAttribute('href', NEW_DOWNLOAD_URL);
            console.log('Updated link:', link);
        }
    }

    function updateDownloadLinks() {
        document.querySelectorAll('a[href]').forEach(fixLink);
    }

    function startObserver() {
        // Watch both new elements and href changes on existing ones (React hydration)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.target.tagName === 'A') {
                    fixLink(mutation.target);
                }
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'A') fixLink(node);
                    node.querySelectorAll && node.querySelectorAll('a[href]').forEach(fixLink);
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    }

    startObserver();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateDownloadLinks);
    } else {
        updateDownloadLinks();
    }

    // Extra passes to catch late Framer hydration
    setTimeout(updateDownloadLinks, 500);
    setTimeout(updateDownloadLinks, 2000);
})();
