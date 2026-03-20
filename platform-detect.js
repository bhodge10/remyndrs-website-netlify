/**
 * Platform detection and SMS link handling for Remyndrs.
 *
 * - Detects UTM parameters and sets the SMS keyword accordingly
 *   (TRY for Reddit, GO for Facebook/Instagram, FRIEND for referral, HI default)
 * - iOS: rewrites sms: links to use & separator (required by iOS)
 * - Android mobile: rewrites sms: links to sms:// format for tap-to-text
 * - Also handles data-mobile-text / data-desktop-text swaps on CTA buttons
 *
 * Loaded by index.html, commands.html, and faq.html.
 */
document.addEventListener('DOMContentLoaded', function () {
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua);
    var isAndroid = /Android/.test(ua);
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // --- Determine SMS keyword from UTM parameters ---
    var params = new URLSearchParams(window.location.search);
    var utmSource = (params.get('utm_source') || '').toLowerCase();
    var utmMedium = (params.get('utm_medium') || '').toLowerCase();
    var keyword = 'HI'; // default for organic/direct

    if (utmSource === 'reddit') {
        keyword = 'TRY';
    } else if (utmSource === 'facebook' || utmSource === 'instagram' || utmSource === 'fb' || utmSource === 'ig') {
        keyword = 'GO';
    } else if (utmSource === 'referral' || utmMedium === 'referral') {
        keyword = 'FRIEND';
    }

    // --- Replace "Hello" body with UTM-based keyword in signup SMS links ---
    document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href.indexOf('body=Hello') !== -1) {
            link.setAttribute('href', href.replace('body=Hello', 'body=' + keyword));
        }
    });

    // --- iOS: fix sms: link separator ---
    if (isIOS) {
        document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
            link.setAttribute('href', link.getAttribute('href').replace('?body=', '&body='));
        });
    }

    // --- Android mobile: rewrite sms: links to sms:// format for tap-to-text ---
    if (isAndroid && isMobile) {
        document.documentElement.classList.add('platform-android');

        document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
            var href = link.getAttribute('href');
            // Match sms:+number?body=TEXT (with our phone number)
            var match = href.match(/^sms:\+?(\d+)\?body=(.+)$/);
            if (match) {
                link.setAttribute('href', 'sms://+' + match[1] + ';?&body=' + match[2]);
            }
        });

        // Track Android tap-to-text sessions in analytics
        if (typeof gtag === 'function') {
            gtag('event', 'android_tap_to_text', {
                page: window.location.pathname.replace(/^\//, '').replace('.html', '') || 'index',
                keyword: keyword
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
