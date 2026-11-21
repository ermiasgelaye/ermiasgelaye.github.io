/* Knowledge: this website, the photographer, downloads, licensing, prints, contact.
 * Keep these answers in sync with the real site policies (ARC.config). */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];
    const C = ARC.config || {};
    const FREE = C.FREE_DOWNLOADS_PER_YEAR || 3;
    const PRICE = C.UNLIMITED_PRICE || '$30.00';
    const EMAIL = C.CONTACT_EMAIL || 'ermiasgelaye@gmail.com';

    ARC.KB.push(
        {
            id: 'site-about-photographer', topic: 'site', title: 'About the photographer',
            q: ['who is the photographer', 'who took these photos', 'tell me about ermias', 'who runs this site', 'about the artist'],
            k: ['photographer', 'about', 'ermias', 'ermias gaga', 'artist', 'behind the lens', 'who'],
            a: `All photos here are by **Ermias Gaga** (Ermias Gelaye Gaga), a travel enthusiast who photographs nature's marvels and architectural wonders — mostly across Canada, from Lake Superior and Niagara to Vancouver Island, Québec City and the Maritimes, plus a few trips to Italy, Vatican City and Dubai.\n\nErmias is also a data scientist; his data-science portfolio is at **ermiasgelaye.github.io**. You can follow his photography on Instagram (**@ermias_gelaye**).`,
            related: ['site-contact', 'site-gallery-guide', 'site-commission'],
            actions: [{ label: 'About section', action: 'scroll:#about' }]
        },
        {
            id: 'site-gallery-guide', topic: 'site', title: 'How to use the gallery',
            q: ['how do i use the gallery', 'how do i search photos', 'how to filter photos', 'how do i see more photos', 'how to favorite a photo', 'how do favourites work'],
            k: ['gallery', 'search', 'filter', 'category', 'favorite', 'favourite', 'heart', 'load more', 'lightbox', 'navigate', 'sort'],
            a: `Using the gallery:\n\n- **Categories** — tap a chip (Nature, Landscape, Travel, Urban, Water, Wildlife) to filter.\n- **Search** — type a place, subject or tag (e.g. *Butchart*, *waterfall*, *winter*). Press **/** anywhere to jump to the search box.\n- **Sort** — by title, location, newest or shuffle.\n- **Open a photo** — click it for the full-resolution view; use ← → keys or swipe to browse, Esc to close.\n- **Favourites** — tap the ♥ on any photo; they're saved in your browser and shown under the *Favourites* chip.\n- **Share** — the share button copies a direct link to that photo.\n\nYou can also just ask me, e.g. “show me photos of Niagara Falls”.`,
            related: ['site-downloads', 'portfolio-overview'],
            actions: [{ label: 'Go to gallery', action: 'scroll:#gallery' }]
        },
        {
            id: 'portfolio-overview', topic: 'site', title: 'What is in the portfolio',
            q: ['what kind of photos do you have', 'what do you photograph', 'what categories are there', 'what is in the portfolio'],
            k: ['portfolio', 'categories', 'collection', 'nature', 'landscape', 'travel', 'urban', 'water', 'wildlife', 'kind of photos'],
            a: `The collection is organised into six categories:\n\n- **Nature** — forests, flowers, autumn colour and gardens (including a large set from The Butchart Gardens)\n- **Landscape** — canyons, cliffs, mountains, coastlines, caves\n- **Travel** — roads, bridges, lighthouses, landmarks along the journey\n- **Urban** — architecture, skylines, churches, interiors, classic cars\n- **Water** — waterfalls, lakes, sunsets over water, frozen Niagara, coastlines\n- **Wildlife** — birds, butterflies, marine life and more\n\nAsk “how many photos are there?” for live counts, or “show me …” to search.`,
            related: ['site-gallery-guide', 'site-about-photographer']
        },
        {
            id: 'site-downloads', topic: 'site', title: 'Free downloads',
            q: ['can i download photos', 'how do downloads work', 'are downloads free', 'how many free downloads do i get', 'why is there a watermark', 'download limit'],
            k: ['download', 'free', 'watermark', 'limit', 'downloads remaining', 'free downloads'],
            a: `Every visitor gets **${FREE} free downloads per calendar year**. Open a photo and press **Download**.\n\n- Free downloads are **web-size (up to 2048 px) with a watermark**, for personal use (e.g. a desktop wallpaper).\n- Re-downloading a photo you already downloaded doesn't use another credit.\n- The counter at the bottom-left shows how many you have left.\n\nFor full-resolution, watermark-free files with a commercial licence, see **unlimited access**.`,
            related: ['site-unlimited', 'site-license'],
            more: `Downloads are tracked by the site's server together with this browser, so clearing your browser data doesn't reset the yearly allowance. If something looks wrong with your count, use the contact form and include roughly when you downloaded.`
        },
        {
            id: 'site-unlimited', topic: 'site', title: 'Unlimited access ($30 / year)',
            q: ['how much is unlimited', 'what do i get with unlimited access', 'how do i buy unlimited downloads', 'is there a premium plan', 'price of unlimited'],
            k: ['unlimited', 'premium', 'price', 'cost', 'buy', 'purchase', 'pay', 'stripe', 'paypal', 'full resolution', 'no watermark'],
            a: `**Unlimited access costs ${PRICE} — a one-time payment, valid for 1 year.** It includes:\n\n- Unlimited **full-resolution** downloads\n- **No watermarks**\n- A **commercial usage licence**\n- Priority email support\n\nPay securely by **card (Stripe)** or **PayPal** using the *Get Unlimited* button. After payment you'll get an **activation code** — keep it, because access is tied to the browser/device you bought it on.`,
            related: ['site-license', 'site-refund', 'site-activation'],
            actions: [{ label: 'Get unlimited access', action: 'purchase' }]
        },
        {
            id: 'site-activation', topic: 'site', title: 'Activation & using access on another device',
            q: ['i paid but still see the limit', 'i bought unlimited but it still says i have no downloads', 'purchased but downloads still limited', 'my unlimited access is not working', 'use unlimited on another device', 'lost activation code', 'transfer access to new computer'],
            k: ['activation', 'activation code', 'another device', 'new computer', 'transfer', 'not working', 'paid', 'bought', 'still limited', 'restore', 'zero downloads'],
            a: `Unlimited access is registered to the **browser/device** used for the purchase.\n\n- **Paid but still limited?** Refresh the page (the site re-checks with the server). Private/incognito windows and cleared site data can hide your access.\n- **New device or browser?** Send your **activation code** and receipt email through the contact form or to **${EMAIL}**, and Ermias can move the access for you.\n- **Lost the code?** Include the email you paid with and the payment date.`,
            related: ['site-unlimited', 'site-contact']
        },
        {
            id: 'site-license', topic: 'site', title: 'Licensing & using the photos',
            q: ['can i use your photos', 'can i use a photo for my business', 'commercial use', 'can i post your photo on instagram', 'do i need permission'],
            k: ['license', 'licence', 'commercial', 'permission', 'use photos', 'usage', 'rights', 'copyright', 'credit'],
            a: `All photos are **© ARC-NATURE PHOTOGRAPHY / Ermias Gaga — all rights reserved**.\n\n- **Free downloads:** personal, non-commercial use only (e.g. wallpaper). Don't remove the watermark or redistribute.\n- **Unlimited access:** includes a **commercial usage licence** for the full-resolution files.\n- **Anything else** (editorial use, advertising, products for resale, exclusive rights, large campaigns): ask first through the contact form so terms can be agreed.\n\nSharing the gallery **link** on social media is always welcome — please credit the photographer.`,
            related: ['site-unlimited', 'copyright-basics', 'site-contact']
        },
        {
            id: 'site-prints', topic: 'site', title: 'Buying prints',
            q: ['can i buy a print', 'do you sell prints', 'how much is a print', 'canvas print', 'framed print', 'metal print'],
            k: ['print', 'prints', 'canvas', 'metal print', 'framed', 'wall art', 'fine art', 'limited edition', 'order print'],
            a: `Yes — prints are available on request. Options mentioned on the site include **fine-art paper prints**, **canvas**, **metal prints** and **signed limited editions**.\n\nPricing depends on the size, material and photo, so there's no fixed price list here. Use the **contact form** with inquiry type **Print Purchase** and include:\n\n1. The photo title (or a share link)\n2. The size you'd like\n3. Material/finish and where it should ship`,
            related: ['print-resolution', 'printing-tips', 'site-contact'],
            actions: [{ label: 'Request a print', action: 'contact:print' }]
        },
        {
            id: 'site-contact', topic: 'site', title: 'Contacting Ermias',
            q: ['how do i contact you', 'what is your email', 'how can i reach the photographer', 'get in touch', 'social media'],
            k: ['contact', 'email', 'message', 'reach', 'instagram', 'linkedin', 'social', 'get in touch', 'reply'],
            a: `The best way is the **contact form** at the bottom of this page (choose an inquiry type: print, collaboration, commission, workshop or other). Ermias usually replies within a day or two.\n\nYou can also email **${EMAIL}**, or find him on Instagram **@ermias_gelaye** and LinkedIn **/in/egaga**.`,
            actions: [{ label: 'Open contact form', action: 'contact:other' }]
        },
        {
            id: 'site-commission', topic: 'site', title: 'Commissions & collaborations',
            q: ['can i hire you', 'do you do photo shoots', 'collaboration', 'can you photograph my event', 'book a session'],
            k: ['commission', 'hire', 'shoot', 'collaboration', 'collaborate', 'event', 'booking', 'session', 'assignment'],
            a: `Ermias is open to **commissions and collaborations** — for example landscape, travel or architectural work. Availability and rates depend on the project, so there's no fixed rate card.\n\nSend the details through the contact form (inquiry type **Photo Commission** or **Collaboration**): what you need, location, dates, intended use of the photos and your budget range.`,
            related: ['site-contact', 'site-license'],
            actions: [{ label: 'Start an inquiry', action: 'contact:commission' }]
        },
        {
            id: 'site-workshops', topic: 'site', title: 'Workshops & lessons',
            q: ['do you teach photography', 'are there workshops', 'photography classes', 'can you mentor me', 'upcoming workshops'],
            k: ['workshop', 'class', 'lesson', 'teach', 'course', 'mentor', 'learn', 'tutorial'],
            a: `There's no public workshop schedule on the site right now, so I can't give you dates. To ask about upcoming workshops or one-to-one sessions, use the contact form with inquiry type **Workshop Inquiry**.\n\nIn the meantime, I'm happy to teach here — try “explain the exposure triangle” or “how do I photograph waterfalls?”`,
            related: ['exposure-triangle', 'beginner-roadmap'],
            actions: [{ label: 'Ask about workshops', action: 'contact:workshop' }]
        },
        {
            id: 'site-refund', topic: 'site', title: 'Refunds & payment security',
            q: ['can i get a refund', 'is payment secure', 'money back guarantee', 'do you store my card'],
            k: ['refund', 'money back', 'guarantee', 'secure', 'security', 'card', 'payment', 'charged'],
            a: `Payments are processed by **Stripe** (card) or **PayPal** — your card details go directly to them and are never stored on this site.\n\nThe purchase screen offers a **30-day money-back guarantee**. To request a refund, contact Ermias with your receipt email and payment date.`,
            related: ['site-unlimited', 'site-contact']
        },
        {
            id: 'site-privacy', topic: 'site', title: 'Privacy & data',
            q: ['what data do you collect', 'do you track me', 'is my data private', 'cookies'],
            k: ['privacy', 'data', 'track', 'tracking', 'cookies', 'personal information', 'gdpr'],
            a: `This site stores a few things **in your browser** (theme, favourites, chat history, download counter). To enforce the yearly free-download limit, it sends an anonymous visitor ID and basic device characteristics to the site's download server. Payments are handled by Stripe/PayPal. Contact-form messages go to Ermias via Formspree.\n\nYou can clear the chat history any time with the 🗑 button in the chat header. For any privacy request, use the contact form.`,
            related: ['site-downloads']
        },
        {
            id: 'site-chatbot', topic: 'site', title: 'About this assistant',
            q: ['are you an ai', 'how do you work', 'can i trust your answers', 'where do your answers come from'],
            k: ['assistant', 'chatbot', 'bot', 'ai', 'trust', 'accurate', 'source', 'knowledge base'],
            a: `I answer from a **curated photography knowledge base** written for this site, plus calculators that compute real values (500 rule, hyperfocal distance, ND times, print sizes) and a live search of the portfolio. Each answer shows its source.\n\nWhen I don't have a reliable answer I'll say so rather than guess. Photography “rules” are guidelines — always test on your own camera.`,
            related: ['site-gallery-guide']
        }
    );
})(typeof window !== 'undefined' ? window : globalThis);
