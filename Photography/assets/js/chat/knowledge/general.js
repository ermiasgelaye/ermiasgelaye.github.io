/* Knowledge: general photography knowledge, history, video, business, misc. */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];

    ARC.KB.push(
        {
            id: 'auto-iso', topic: 'fundamentals', level: 'intermediate', title: 'Auto ISO',
            q: ['should i use auto iso', 'how does auto iso work', 'auto iso minimum shutter speed'],
            k: ['autoiso', 'auto iso', 'minimum shutter', 'iso range'],
            a: `**Auto ISO** lets the camera raise or lower ISO to keep exposure correct. Set:\n\n- **Maximum ISO** you're comfortable with (e.g. 6400–12800 on modern cameras).\n- **Minimum shutter speed**: "Auto" ties it to focal length; set it faster (e.g. 1/500 s) for action.\n\n**Manual + Auto ISO** is a favourite wildlife and events setup: you fix the shutter speed and aperture for the look, and use **exposure compensation** to fine-tune brightness (supported on most modern bodies).`,
            related: ['iso', 'camera-modes', 'exposure-compensation']
        },
        {
            id: 'megapixels', topic: 'gear', level: 'beginner', title: 'Do megapixels matter?',
            q: ['how many megapixels do i need', 'are more megapixels better', '24mp vs 45mp'],
            k: ['megapixels', 'mp', 'resolution', 'pixel count', 'high resolution'],
            a: `More megapixels help with **large prints and heavy cropping** (wildlife, landscapes). They don't automatically mean better photos.\n\n- **12–24 MP:** plenty for web, social media and prints up to ~A3 / 12×18 in.\n- **33–61 MP:** big prints, landscapes, crop flexibility, but larger files and they reveal camera shake and lens flaws more.\n\nLens quality, technique and light usually matter more than resolution.`,
            related: ['print-resolution', 'choose-camera']
        },
        {
            id: 'aspect-ratios', topic: 'composition', level: 'beginner', title: 'Aspect ratios',
            q: ['what aspect ratio should i use', '3:2 vs 4:3', 'best crop for instagram', 'square photos'],
            k: ['aspect ratio', 'crop', '3:2', '4:3', '16:9', '4:5', 'square', '1:1'],
            a: `- **3:2**: most interchangeable-lens cameras; classic 35 mm film shape.\n- **4:3**: Micro Four Thirds and most phones.\n- **16:9**: widescreen, cinematic landscapes.\n- **4:5**: portrait crop that fills more of the screen on social feeds.\n- **1:1**: square; great for symmetry and minimalism.\n- **Panoramic** (2:1, 3:1), wide vistas.\n\nPick the crop that suits the subject; leave room around the subject when shooting so you can crop later.`,
            related: ['export-web', 'composition-basics']
        },
        {
            id: 'exif', topic: 'editing', level: 'beginner', title: 'EXIF & metadata',
            q: ['what is exif data', 'how to see camera settings of a photo', 'remove location from photos', 'what settings were used for this photo'],
            k: ['exif', 'metadata', 'gps', 'location data', 'camera settings', 'iptc'],
            a: `**EXIF** data is stored inside photo files: camera, lens, focal length, aperture, shutter speed, ISO, date and often **GPS location**. View it in Lightroom, your OS file info panel, or online EXIF viewers.\n\n- Study EXIF from your best shots to learn what works.\n- **Privacy:** phones embed GPS, strip location before sharing photos taken at home (most export dialogs and phone share sheets have an option).\n- **IPTC** fields hold your name, copyright and captions: set them on import.\n\nFor gallery photos on this site, camera settings aren't published, so I can't tell you the exact settings used for a specific image.`,
            related: ['copyright-basics', 'backup']
        },
        {
            id: 'how-camera-works', topic: 'fundamentals', level: 'beginner', title: 'How a digital camera works',
            q: ['how does a camera work', 'what is a camera sensor', 'how is a photo made'],
            k: ['how camera works', 'sensor', 'pixel', 'photosite', 'bayer', 'lens', 'image processor'],
            a: `1. The **lens** focuses light onto the **sensor**.\n2. The **aperture** controls how much light passes; the **shutter** controls for how long.\n3. The sensor has millions of **photosites** that convert light into electrical signals. A **colour filter array** (usually Bayer: red, green, blue) lets each record one colour.\n4. The **image processor** demosaics the colours, applies white balance, tone and noise reduction, and saves a **JPEG**: or stores the raw sensor data as a **RAW** file.\n\nISO amplifies the signal after capture.`,
            related: ['exposure-triangle', 'raw-vs-jpeg', 'sensor-size']
        },
        {
            id: 'film-photography', topic: 'general', level: 'intermediate', title: 'Film photography',
            q: ['should i try film photography', 'film vs digital', 'how to start shooting film', '35mm film tips'],
            k: ['film', 'analog', 'analogue', '35mm film', 'medium format film', 'negative', 'darkroom'],
            a: `Film slows you down, limited shots per roll make you think before pressing the shutter.\n\n- **Start** with an affordable 35 mm SLR or point-and-shoot and a forgiving **colour negative film** (ISO 200–400); negatives handle overexposure well, so err on the bright side.\n- **Slide (positive) film** is less forgiving: expose precisely.\n- **Black-and-white** film is easiest to develop at home.\n- Labs develop and scan; costs per frame are much higher than digital.\n\nMany skills transfer directly: Sunny 16, metering and composition.`,
            related: ['sunny16', 'metering']
        },
        {
            id: 'video-basics', topic: 'general', level: 'intermediate', title: 'Video basics for photographers',
            q: ['how to shoot video with my camera', '180 degree rule', 'frame rate for video', 'video settings'],
            k: ['video', 'frame rate', 'fps', '24p', '180 degree rule', 'filming', 'slow motion', '4k'],
            a: `- **Frame rate:** 24/25 fps for a cinematic look, 30 fps for general use, 60–120 fps to slow down motion.\n- **180° shutter rule:** shutter ≈ **1/(2 × frame rate)** (1/50 s at 24/25 fps) for natural motion blur.\n- Since shutter speed is fixed, control brightness with **ND filters** (variable NDs are popular), aperture and ISO.\n- **Stabilise:** gimbal, IBIS + lens IS, or a tripod.\n- **Audio** matters as much as image: use an external mic.\n- Log profiles give more grading latitude but need colour correction.`,
            related: ['nd-filters', 'stabilization']
        },
        {
            id: 'photo-business', topic: 'general', level: 'advanced', title: 'Selling photos & starting out professionally',
            q: ['how to sell my photos', 'how to make money from photography', 'start a photography business', 'how to price photography', 'stock photography'],
            k: ['sell photos', 'business', 'money', 'pricing', 'stock', 'clients', 'professional', 'income'],
            a: `Common income streams: **client work** (portraits, events, real estate, product), **licensing** (direct or stock agencies), **prints**, **workshops/teaching**, and **content creation**.\n\n- Build a **focused portfolio** of your best 15–25 images for the work you want.\n- **Price** from your costs (gear, insurance, software, time editing, taxes) plus profit, not just what others charge.\n- Use **contracts** and **model/property releases** for commercial use.\n- Stock photography pays little per image; it works best at volume or in niches.\n- Check local requirements for business registration, tax and insurance: this varies by country/province, so get local advice.`,
            related: ['copyright-basics', 'site-license']
        },
        {
            id: 'photo-history', topic: 'general', level: 'beginner', title: 'A very short history of photography',
            q: ['who invented photography', 'history of photography', 'first photograph', 'when was the camera invented'],
            k: ['history', 'invented', 'first photograph', 'daguerreotype', 'niepce', 'kodak', 'digital camera'],
            a: `- **1826–27:** Joseph Nicéphore Niépce makes the oldest surviving camera photograph, *View from the Window at Le Gras*.\n- **1839:** Louis Daguerre's **daguerreotype** is announced; William Henry Fox Talbot develops the negative–positive **calotype** process soon after.\n- **1888:** Kodak's box camera, "You press the button, we do the rest", brings photography to the public.\n- **1925:** the Leica popularises **35 mm** film.\n- **1975:** Steven Sasson at Kodak builds an early **digital camera** prototype.\n- **2000s onward:** digital SLRs, then camera phones and mirrorless cameras, make photography ubiquitous.`,
            related: ['film-photography', 'how-camera-works']
        },
        {
            id: 'photo-critique', topic: 'general', level: 'intermediate', title: 'How to critique & improve your photos',
            q: ['how do i know if my photo is good', 'how to critique a photo', 'why are my photos not improving', 'get feedback on photos'],
            k: ['critique', 'feedback', 'improve', 'good photo', 'evaluate', 'portfolio review', 'better photos'],
            a: `Ask these questions of every image:\n\n1. **What's the subject?** Can a stranger tell in one second?\n2. **Light:** is it interesting, or just illuminating?\n3. **Composition:** anything distracting at the edges? Would a step closer, lower or to the side help?\n4. **Technical:** focus on the right spot, exposure, horizon level.\n5. **Emotion/story:** does it make you feel something?\n\nThen: shoot **themed projects**, revisit locations, study photographers you admire, and share in critique communities. Curate hard: show only your best.`,
            related: ['composition-basics', 'beginner-roadmap']
        }
    );
})(typeof window !== 'undefined' ? window : globalThis);
