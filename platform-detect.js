/**
 * Platform detection and SMS link handling for Remyndrs.
 *
 * - iOS: rewrites sms: links to use & separator (required by iOS)
 * - Android mobile: adds "platform-android" class to <html>, which CSS
 *   uses to hide SMS-based elements and show form-based alternatives
 * - Also handles data-mobile-text / data-desktop-text swaps on CTA buttons
 *
 * Loaded by index.html, commands.html, and faq.html.
 */
document.addEventListener('DOMContentLoaded', function () {
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua);
    var isAndroid = /Android/.test(ua);
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // --- iOS: fix sms: link separator ---
    if (isIOS) {
        document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
            link.setAttribute('href', link.getAttribute('href').replace('?body=', '&body='));
        });
    }

    // --- Android mobile: switch to form-based experience ---
    if (isAndroid && isMobile) {
        document.documentElement.classList.add('platform-android');

        // For pages that link to index.html#hero (commands, faq), the CSS
        // handles hiding/showing via .platform-android overrides.  For inline
        // elements that use mobile-only with sms: hrefs, we also need to swap
        // their desktop-only siblings.  The CSS classes take care of the major
        // containers (mobile-cta-container, mobile-contact-grid, floating share,
        // footer buttons, share section, pricing CTAs, CTA section).

        // Swap inline mobile-only sms: links that don't have a CSS container
        // class handled by the overrides. These are <span> pairs in running text
        // (e.g., faq hero "Text us your question" / "Email us your question").
        document.querySelectorAll('span.mobile-only').forEach(function (el) {
            var smsLink = el.querySelector('a[href^="sms:"]');
            if (!smsLink) return;
            // Find adjacent desktop-only sibling span
            var sibling = el.nextElementSibling;
            if (sibling && /desktop-only/.test(sibling.className)) {
                el.style.display = 'none';
                sibling.style.display = 'inline';
            }
        });

        // Track Android form-mode sessions in analytics
        if (typeof gtag === 'function') {
            gtag('event', 'android_form_mode', {
                page: window.location.pathname.replace(/^\//, '').replace('.html', '') || 'index'
            });
        }
    }

    // --- CTA button text swap (mobile vs desktop) ---
    var ctaButtons = document.querySelectorAll('.cta-sms-button, .cta-sms-text');
    ctaButtons.forEach(function (button) {
        var mobileText = button.getAttribute('data-mobile-text');
        var desktopText = button.getAttribute('data-desktop-text');

        if (isMobile && mobileText) {
            button.textContent = mobileText;
        } else if (!isMobile && desktopText) {
            button.textContent = desktopText;
        }
    });
});
