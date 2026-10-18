// URL Override Script - Replaces download button URLs and preserves Retrac section order.
(function() {
    'use strict';

    const NEW_DOWNLOAD_URL = 'https://projectretrac.dev/download';
    const OLD_URLS = [
        'https://github.com/retracfndev/Retrac/releases/download/2.1.2/Retrac.Setup.2.1.2.exe',
        'https://projectretracfn.com/download',
        '/download'
    ];

    function fixLink(link) {
        const href = link.getAttribute('href');
        if (href === null || href === NEW_DOWNLOAD_URL) return;
        if (OLD_URLS.includes(href)) link.setAttribute('href', NEW_DOWNLOAD_URL);
    }

    function syncRetracOrder() {
        if (typeof window.__retracRestore === 'function') window.__retracRestore();
    }

    function updateDownloadLinks() {
        document.querySelectorAll('a[href]').forEach(fixLink);
        syncRetracOrder();
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.target.tagName === 'A') fixLink(mutation.target);
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return;
                if (node.tagName === 'A') fixLink(node);
                node.querySelectorAll && node.querySelectorAll('a[href]').forEach(fixLink);
            });
        });
        queueMicrotask(syncRetracOrder);
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
    });

    window.addEventListener('load', syncRetracOrder);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateDownloadLinks);
    else updateDownloadLinks();
    setTimeout(updateDownloadLinks, 500);
    setTimeout(updateDownloadLinks, 2000);
    setTimeout(syncRetracOrder, 3000);
})();