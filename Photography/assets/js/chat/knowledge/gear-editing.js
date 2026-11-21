/* Knowledge: cameras, lenses, accessories, editing, exporting, printing, workflow. */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];

    ARC.KB.push(
        /* ---------- Gear ---------- */
        {
            id: 'choose-camera', topic: 'gear', level: 'beginner', title: 'Choosing a camera',
            q: ['what camera should i buy', 'best camera for beginners', 'which camera is best for landscape', 'should i upgrade my camera', 'camera recommendation'],
            k: ['camera', 'buy', 'which camera', 'recommend', 'upgrade', 'beginner camera', 'body'],
            a: `I won't name a single "best" model, line-ups and prices change constantly, but here's how to choose:\n\n1. **What do you shoot?** Fast action/wildlife → strong subject-tracking AF and fast bursts. Landscapes → resolution and dynamic range. Travel → size and weight.\n2. **System, not body:** lenses last longer than bodies. Look at the lens range (Canon, Nikon, Sony, Fujifilm, OM System/Panasonic all have mature mirrorless systems).\n3. **Sensor size:** full frame for low light/shallow DoF; APS-C or Micro Four Thirds for smaller kit and more reach.\n4. **Handling:** hold it in a shop, grip, menus and viewfinder matter.\n5. **Budget split:** a mid-range body with a good lens beats a top body with a poor lens. **Used gear** is excellent value.\n\nIf you already own a phone with a good camera, a dedicated camera mainly adds better zoom reach, low-light performance, AF and lens choice.`,
            related: ['sensor-size', 'mirrorless-vs-dslr', 'choose-lens', 'used-gear']
        },
        {
            id: 'mirrorless-vs-dslr', topic: 'gear', level: 'beginner', title: 'Mirrorless vs DSLR',
            q: ['mirrorless vs dslr', 'is dslr dead', 'should i buy a dslr or mirrorless', 'difference between mirrorless and dslr'],
            k: ['mirrorless', 'dslr', 'evf', 'optical viewfinder', 'difference'],
            a: `- **Mirrorless** shows a live electronic preview of exposure (EVF), usually has better **eye/subject-detection AF**, silent shutters and strong video. It's where all major makers now develop new bodies and lenses.\n- **DSLRs** have an optical viewfinder and often longer battery life, and used DSLRs/lenses are very affordable.\n\nFor a new system, **mirrorless** is the future-proof choice. A used DSLR is still a capable, budget-friendly way to learn.`,
            related: ['choose-camera']
        },
        {
            id: 'choose-lens', topic: 'gear', level: 'beginner', title: 'Choosing lenses',
            q: ['what lens should i buy', 'best lens for beginners', 'which lens for travel', 'what lenses do i need', 'first lens after kit lens'],
            k: ['lens', 'lenses', 'kit lens', 'which lens', 'travel lens', 'upgrade lens'],
            a: `Good first upgrades after a kit lens:\n\n- **50 mm f/1.8 (or 35 mm on APS-C)**: cheap, sharp, great for portraits and low light.\n- **Standard zoom** (24–70/24–105 mm full frame, 16–55/18–135 mm APS-C): the do-everything travel lens.\n- **Ultra-wide** (14–24/16–35 mm): landscapes, architecture, astro.\n- **Telephoto zoom** (70–200 / 70–300 / 100–400 mm): wildlife, sports, compressed landscapes.\n- **Macro** (90–105 mm): close-ups and also lovely portraits.\n\nBuy for what you actually shoot. Check reviews for sharpness, AF speed and weight; third-party brands (Sigma, Tamron, Samyang, Viltrox…) offer good value on many mounts.`,
            related: ['focal-lengths', 'prime-vs-zoom', 'wide-angle', 'telephoto']
        },
        {
            id: 'focal-lengths', topic: 'gear', level: 'beginner', title: 'Focal lengths explained',
            q: ['what does focal length mean', 'what focal length for portraits', '24mm vs 50mm', 'what is 50mm good for', 'lens compression'],
            k: ['focallength', 'mm', 'field of view', 'angle of view', 'compression', 'perspective'],
            a: `Focal length (in mm) sets the **field of view** (full-frame equivalents):\n\n- **14–24 mm (ultra-wide):** landscapes, interiors, astro, exaggerates foreground.\n- **24–35 mm (wide):** travel, street, environmental portraits.\n- **50 mm (normal):** close to natural perspective; versatile.\n- **85–135 mm (short tele):** flattering portraits, details.\n- **200–600 mm (telephoto):** wildlife, sports, distant subjects.\n\n**"Compression"** is really about **distance**: shooting from far away with a long lens makes background objects look larger relative to the subject. Multiply by the crop factor on APS-C/MFT to get the equivalent.`,
            related: ['choose-lens', 'sensor-size', 'wide-angle', 'telephoto']
        },
        {
            id: 'prime-vs-zoom', topic: 'gear', level: 'beginner', title: 'Prime vs zoom lenses',
            q: ['prime or zoom lens', 'are primes sharper', 'why use a prime lens', 'nifty fifty'],
            k: ['primelens', 'zoomlens', 'prime', 'zoom', 'fixed focal length', 'fiftymm'],
            a: `- **Primes** (fixed focal length): usually **brighter** (f/1.4–f/2), smaller and often sharper for the money, great for low light, bokeh and learning composition "with your feet".\n- **Zooms**: **flexibility**: one lens covers many situations; essential for travel, events and wildlife.\n\nModern professional zooms are extremely sharp, so the choice is mostly about **aperture vs convenience**. A popular combo: a standard zoom + one fast prime (35 or 50 mm).`,
            related: ['choose-lens', 'bokeh']
        },
        {
            id: 'wide-angle', topic: 'gear', level: 'intermediate', title: 'Using wide-angle lenses',
            q: ['how to use a wide angle lens', 'wide angle distortion', 'ultra wide tips', 'why do my wide angle photos look empty'],
            k: ['wideangle', 'ultra wide', 'distortion', '14mm', '16mm', 'wide lens'],
            a: `Wide lenses make **near things big and far things small**. If photos feel empty, you're probably not close enough to something.\n\n- **Get close** to a foreground subject (rock, flower, leading line): 30 cm–1 m.\n- **Keep the camera level** to avoid leaning buildings (or embrace dramatic angles deliberately).\n- **Keep people away from the frame edges**: stretching distortion.\n- **Polarisers** cause uneven blue skies on very wide lenses.\n- Great for astro, interiors, dramatic skies and leading lines.`,
            related: ['focal-lengths', 'foreground-interest', 'leading-lines']
        },
        {
            id: 'telephoto', topic: 'gear', level: 'intermediate', title: 'Using telephoto lenses',
            q: ['telephoto lens tips', 'how to use a long lens', 'telephoto for landscape', 'best focal length for wildlife'],
            k: ['telephoto', 'long lens', '70-200', '100-400', '150-600', 'reach', 'zoom lens'],
            a: `- **Fast shutter:** at 400 mm use ≥ 1/400 s handheld (with stabilisation you can go slower for still subjects).\n- **Isolate** subjects and compress layers: mountain ridges, sunsets with a big sun, details in architecture.\n- **Heat shimmer** ruins distant sharpness on warm days: shoot early.\n- **Support:** monopod or bean bag for heavy lenses; use the tripod collar.\n- For wildlife, 300–600 mm equivalent is the common range; teleconverters add reach but cost light and AF speed.`,
            related: ['wildlife-photography', 'focal-lengths', 'camera-shake']
        },
        {
            id: 'tripod', topic: 'gear', level: 'beginner', title: 'Tripods',
            q: ['do i need a tripod', 'what tripod should i buy', 'tripod tips', 'carbon fibre vs aluminium tripod'],
            k: ['tripod', 'monopod', 'ball head', 'carbon fiber', 'carbon fibre', 'aluminium', 'stability'],
            a: `You need a tripod for **long exposures, night/astro, HDR brackets, panoramas, focus stacking and self-portraits**.\n\n- **Carbon fibre** is lighter and damps vibration; **aluminium** is cheaper but heavier.\n- Choose one rated well above your camera + heaviest lens weight, and tall enough without the centre column (raising it reduces stability).\n- **Ball heads** are quick and versatile; **geared/pan-tilt** heads give precision for architecture.\n- Use a 2-second timer or remote, hang your bag from the hook in wind, and spread the legs wide on uneven ground.`,
            related: ['long-exposure', 'astro-milkyway', 'camera-shake']
        },
        {
            id: 'polarizer', topic: 'gear', level: 'intermediate', title: 'Circular polariser (CPL)',
            q: ['what does a polarizing filter do', 'should i use a cpl', 'how to use a polarizer', 'remove reflections from water'],
            k: ['polarizer', 'cpl', 'filter', 'glare', 'reflections', 'blue sky', 'polarising'],
            a: `A **circular polariser (CPL)** cuts polarised light. Rotate it while looking through the viewfinder:\n\n- **Removes glare** from water (see the riverbed), wet rocks and leaves → richer colours.\n- **Darkens blue skies**: strongest at **90° to the sun**, weakest pointing toward or away from it.\n- **Controls reflections** on water and glass (you can enhance *or* remove them).\n- Costs about **1–2 stops** of light: handy for slowing waterfalls.\n\nCautions: uneven sky banding on ultra-wides, little effect on overcast skies, and it can kill rainbows if rotated the wrong way.`,
            related: ['nd-filters', 'waterfall-photography', 'landscape-photography']
        },
        {
            id: 'nd-filters', topic: 'gear', level: 'intermediate', title: 'ND filters',
            q: ['what is an nd filter', 'which nd filter should i buy', 'nd filter strength', '6 stop vs 10 stop nd'],
            k: ['ndfilter', 'nd', 'neutral density', 'stops', 'nd8', 'nd64', 'nd1000', 'variable nd'],
            a: `**Neutral density (ND) filters** darken the scene evenly so you can use slower shutter speeds or wider apertures in bright light.\n\n- **3 stops (ND8):** waterfalls in daylight, wide aperture video.\n- **6 stops (ND64):** smooth water, some cloud movement.\n- **10 stops (ND1000):** streaking clouds, glassy seas, "erasing" people in daytime.\n- **Variable NDs:** convenient for video; may show an "X" pattern at strong settings.\n\nEach stop doubles the exposure time. Ask me e.g. **“10 stop ND at 1/125”** to calculate. Quality filters avoid colour casts.`,
            related: ['long-exposure', 'polarizer', 'graduated-nd']
        },
        {
            id: 'graduated-nd', topic: 'gear', level: 'advanced', title: 'Graduated ND filters',
            q: ['what is a grad nd filter', 'soft vs hard grad', 'how to darken the sky in camera'],
            k: ['graduated nd', 'gnd', 'grad filter', 'soft grad', 'hard grad', 'reverse grad', 'sky darker'],
            a: `A **graduated ND** is dark at the top, clear at the bottom, it holds back a bright sky while keeping the foreground exposure.\n\n- **Hard edge:** flat horizons (sea).\n- **Soft edge:** uneven horizons (mountains, trees).\n- **Reverse grad:** darkest at the middle, sunsets on the horizon.\n- Strengths of 2–3 stops are most common.\n\nToday many photographers bracket and blend instead, or use Lightroom's linear gradient masks, but grads still save time and help in fast-changing light.`,
            related: ['dynamic-range', 'nd-filters', 'hdr']
        },
        {
            id: 'memory-cards', topic: 'gear', level: 'beginner', title: 'Memory cards',
            q: ['what memory card should i buy', 'sd card speed', 'card full or slow buffer', 'how to avoid losing photos on a card'],
            k: ['memorycard', 'sd card', 'cfexpress', 'uhs-ii', 'v30', 'v60', 'v90', 'buffer', 'card speed'],
            a: `- Check your camera's **supported type** (SD UHS-I/UHS-II, CFexpress Type A/B).\n- For photos, a reputable **UHS-I V30** card is fine; for **fast bursts** or **4K+ video**, use **UHS-II V60/V90** or CFexpress.\n- Buy from trusted retailers: counterfeit cards are common.\n- **Format in camera** (not on the computer) after backing up.\n- Use several mid-size cards rather than one huge card, and use **dual slots in backup mode** for once-in-a-lifetime events.`,
            related: ['backup']
        },
        {
            id: 'cold-weather', topic: 'gear', level: 'beginner', title: 'Cameras in cold weather',
            q: ['camera batteries die in cold', 'condensation on lens', 'shooting in winter cold tips', 'can my camera handle cold'],
            k: ['cold', 'winter', 'batteries', 'condensation', 'freezing', 'fog lens'],
            a: `- **Batteries drain fast** in the cold, carry spares in an inside pocket and swap them.\n- **Condensation:** when coming indoors, put the camera in a **sealed bag** before entering and let it warm slowly (an hour or more). Don't change lenses in steamy rooms.\n- **Don't breathe** on the lens or viewfinder: it freezes.\n- Thin liner gloves under mitts keep you able to work the controls.\n- Lens heaters or hand-warmers stop dew/frost on night shoots.`,
            related: ['snow-photography', 'aurora']
        },
        {
            id: 'gear-weather-protection', topic: 'gear', level: 'beginner', title: 'Protecting gear from rain, sand & spray',
            q: ['can i use my camera in the rain', 'is my camera weather sealed', 'protect camera at the beach', 'waterfall spray on lens'],
            k: ['rain', 'weather sealed', 'waterproof', 'sand', 'beach', 'spray', 'rain cover', 'salt'],
            a: `"Weather-sealed" means **resistant**, not waterproof, and the lens must be sealed too.\n\n- Use a **rain cover** (or a plastic bag + rubber band) and a **lens hood**.\n- Keep a **microfibre cloth** and blower handy; blot water, don't rub grit.\n- At the beach, avoid lens changes in wind; wipe off **salt spray** with a slightly damp cloth afterward.\n- Store wet gear open in a dry room, not sealed in a bag.`,
            related: ['overcast-weather', 'sensor-cleaning']
        },
        {
            id: 'sensor-cleaning', topic: 'gear', level: 'intermediate', title: 'Cleaning lenses & sensor',
            q: ['how to clean my camera sensor', 'dark spots on my photos', 'how to clean a lens', 'dust on sensor'],
            k: ['sensorcleaning', 'dust', 'spots', 'clean lens', 'blower', 'sensor swab'],
            a: `**Dust spots** show up as soft dark blobs at small apertures (f/11+) in skies. Check by shooting a plain sky at f/16.\n\n1. Use the camera's **sensor-cleaning** function.\n2. Use a **rocket blower** (camera facing down, never canned air).\n3. If spots remain, use **sensor swabs** with the correct fluid for your sensor size, or have a camera shop do it.\n\n**Lenses:** blower first, then a soft brush, then lens fluid on a microfibre cloth in circular motions. Remove dust spots in editing with the healing/spot tool.`,
            related: ['diffraction']
        },
        {
            id: 'used-gear', topic: 'gear', level: 'beginner', title: 'Buying used gear',
            q: ['should i buy used camera gear', 'what to check when buying a used lens', 'shutter count'],
            k: ['used', 'second hand', 'secondhand', 'refurbished', 'shutter count', 'buying used'],
            a: `Used gear is great value, lenses especially hold up well. Check:\n\n- **Lenses:** haze, fungus (shine a torch through), scratches on the front/rear element, smooth zoom/focus rings, AF and stabilisation working, aperture blades clean.\n- **Bodies:** shutter count vs rated life, sensor condition, all buttons/dials, card doors, battery health, firmware.\n- Take test shots at different apertures and zooms.\n- Buy from reputable dealers with returns or a warranty (manufacturer-refurbished is a good option).`,
            related: ['choose-camera', 'choose-lens']
        },

        /* ---------- Editing ---------- */
        {
            id: 'editing-workflow', topic: 'editing', level: 'beginner', title: 'A basic editing workflow',
            q: ['how should i edit my photos', 'editing workflow', 'how to edit in lightroom', 'what order should i edit in', 'beginner editing tips'],
            k: ['editing', 'edit', 'workflow', 'lightroom', 'post processing', 'retouch', 'raw editor'],
            a: `A reliable order (Lightroom, Capture One, darktable, Snapseed, the ideas are the same):\n\n1. **Cull**: pick only the best frames.\n2. **Lens corrections** (profile + chromatic aberration) and **crop/straighten**.\n3. **White balance**.\n4. **Exposure & contrast**, then **highlights/shadows/whites/blacks**: watch the histogram.\n5. **Presence:** texture, clarity, dehaze, gently.\n6. **Colour:** vibrance before saturation; HSL for individual colours.\n7. **Local adjustments:** masks for sky, subject, dodge & burn to guide the eye.\n8. **Noise reduction & sharpening.**\n9. **Spot removal.**\n10. **Export** for the destination (web or print).\n\nStep away and come back: fresh eyes catch over-editing.`,
            more: `Pro habits: edit on a calibrated monitor in a dim room, compare against the original (\\ key in Lightroom), build presets from your own edits for consistency, and use virtual copies to try alternatives. Use AI masks (Select Sky / Select Subject) for fast local work.`,
            related: ['color-grading', 'noise-reduction', 'sharpening', 'export-web']
        },
        {
            id: 'color-grading', topic: 'editing', level: 'intermediate', title: 'Colour grading & correction',
            q: ['how to colour grade photos', 'how to get a cinematic look', 'teal and orange look', 'my colours look unnatural'],
            k: ['colorgrading', 'grading', 'colour correction', 'cinematic', 'split toning', 'hsl', 'teal orange', 'mood'],
            a: `**Correct first, then grade.**\n\n- **Correction:** neutral white balance, accurate skin tones, remove colour casts.\n- **Grading:** create a mood, Lightroom's **Color Grading** wheels (shadows/midtones/highlights), **HSL** sliders, the **tone curve** per channel, or **calibration** panel.\n\nPopular looks: warm highlights + cool shadows ("teal and orange"); muted greens for moody forests; lifted blacks for a film look. Keep skin tones natural, and if colours look neon, reduce **saturation** and use **vibrance** instead.`,
            related: ['editing-workflow', 'color-theory', 'white-balance']
        },
        {
            id: 'noise-reduction', topic: 'editing', level: 'intermediate', title: 'Noise reduction',
            q: ['how to remove noise from photos', 'best denoise software', 'my night photos are grainy', 'ai denoise'],
            k: ['noise', 'denoise', 'grain', 'noise reduction', 'luminance noise', 'colour noise', 'ai denoise'],
            a: `- **Prevent it:** expose well (dark files brightened later get much noisier).\n- **AI denoise** tools are a big leap: **Lightroom/ACR Denoise**, **DxO PureRAW/PhotoLab**, **Topaz Photo AI**, and others. Apply them to the RAW **before** other edits.\n- Classic sliders: remove **colour noise** first (usually safe), then add **luminance** NR carefully, too much makes skin and foliage plastic.\n- For astro and static scenes, **stacking** several frames reduces noise without losing detail.\n- A little fine grain looks natural in print; don't chase zero noise.`,
            related: ['iso', 'editing-workflow', 'astro-milkyway']
        },
        {
            id: 'sharpening', topic: 'editing', level: 'intermediate', title: 'Sharpening',
            q: ['how to sharpen photos', 'how much sharpening', 'sharpening for web vs print', 'halos from sharpening'],
            k: ['sharpening', 'sharpen', 'unsharp mask', 'masking', 'output sharpening', 'detail'],
            a: `Sharpening can't fix a blurry photo, but it restores crispness lost in capture.\n\n1. **Capture sharpening** (RAW editor): moderate amount, radius ~0.8–1.2, and hold **Alt/Option on the Masking slider** to restrict sharpening to edges (not skies or skin).\n2. **Creative/local sharpening:** eyes, textures.\n3. **Output sharpening** on export: *Screen* for web, *Matte/Glossy* for print, prints usually need more.\n\nView at 100% and stop before you see **halos** or crunchy noise.`,
            related: ['export-web', 'sharpness-troubleshooting']
        },
        {
            id: 'chromatic-aberration', topic: 'editing', level: 'intermediate', title: 'Chromatic aberration, vignetting & distortion',
            q: ['purple fringe on branches', 'how to fix chromatic aberration', 'dark corners in photos', 'lens distortion correction'],
            k: ['chromaticaberration', 'fringing', 'vignetting', 'dark corners', 'distortion', 'lens profile', 'barrel'],
            a: `- **Chromatic aberration** (purple/green fringes on high-contrast edges like branches against sky): enable **Remove Chromatic Aberration** in your RAW editor; stopping down also helps.\n- **Vignetting** (dark corners): fixed by the **lens profile** correction; stopping down 1–2 stops reduces it. Sometimes you'll add some back deliberately.\n- **Distortion** (barrel/pincushion): lens profile corrections fix most of it; use **Transform/Upright** for perspective in architecture.\n\nTurn on profile corrections as part of your import preset.`,
            related: ['editing-workflow', 'architecture-photography']
        },
        {
            id: 'export-web', topic: 'editing', level: 'beginner', title: 'Exporting for web & social media',
            q: ['best export settings for instagram', 'how to export photos for web', 'why do my photos look bad on instagram', 'export size for website'],
            k: ['export', 'instagram', 'web', 'social media', 'facebook', 'resize', 'compression', 'upload'],
            a: `- **Colour space: sRGB** (otherwise colours look dull or odd online).\n- **Size:** ~2048 px on the long edge for websites/Facebook; for **Instagram**, 1080 px wide (portrait **4:5 at 1080×1350** gets the most screen space; Instagram also supports taller 3:4 crops on newer layouts).\n- **JPEG quality 80–90%**, or WebP/AVIF for your own website.\n- Apply **output sharpening for screen** (standard).\n- Add your copyright to the metadata.\n\nPlatforms recompress uploads; exporting at their preferred size reduces how much they mangle it.`,
            related: ['color-space', 'sharpening', 'file-formats']
        },
        {
            id: 'color-space', topic: 'editing', level: 'advanced', title: 'Colour spaces (sRGB, Adobe RGB, Display P3, ProPhoto)',
            q: ['srgb vs adobe rgb', 'which colour space should i use', 'what is prophoto rgb', 'colours look different after export'],
            k: ['colorspace', 'srgb', 'adobe rgb', 'prophoto', 'display p3', 'gamut', 'icc profile'],
            a: `- **sRGB:** the standard for the web and most screens, **always export web images in sRGB**.\n- **Display P3:** wider gamut used by modern Apple and many phone/laptop displays.\n- **Adobe RGB:** wider (especially greens/cyans); useful for **printing** on capable printers.\n- **ProPhoto RGB:** very wide; used internally by Lightroom for editing. Use **16-bit** with it to avoid banding.\n\nIf colours shift after export, you've likely exported a wide-gamut file to an app that ignores colour profiles: convert to sRGB.`,
            related: ['export-web', 'calibration', 'printing-tips']
        },
        {
            id: 'calibration', topic: 'editing', level: 'intermediate', title: 'Monitor calibration',
            q: ['do i need to calibrate my monitor', 'my prints are too dark', 'how to calibrate a screen for photo editing'],
            k: ['calibration', 'calibrate', 'monitor', 'screen', 'prints too dark', 'colorimeter', 'brightness'],
            a: `**Prints too dark?** Your screen is probably too bright. Most laptop/phone screens run at full brightness, far above print viewing conditions.\n\n- Use a **hardware colorimeter** (Calibrite, Datacolor Spyder…) to calibrate colour and brightness.\n- For print work, target roughly **80–120 cd/m²** brightness and **6500 K (D65)** white point.\n- Edit in a dim, neutral room; turn off auto-brightness and Night Shift/blue-light filters while editing.\n- Soft-proof in Lightroom/Photoshop with the printer/paper ICC profile.`,
            related: ['printing-tips', 'color-space']
        },
        {
            id: 'print-resolution', topic: 'editing', level: 'beginner', title: 'Print size & resolution (DPI/PPI)',
            q: ['how big can i print my photo', 'what resolution do i need to print', 'dpi for printing', 'megapixels for a large print'],
            k: ['printsize', 'resolution', 'dpi', 'ppi', 'megapixels', 'print size', 'large print', 'upscale'],
            a: `**PPI** (pixels per inch) determines print size: inches = pixels ÷ PPI.\n\n- **300 PPI:** gallery quality viewed up close (24 MP ≈ 20×13 in).\n- **200 PPI:** excellent for most wall prints.\n- **100–150 PPI:** big prints and canvases viewed from a distance.\n\nViewing distance matters more than megapixels. AI upscaling (Lightroom Super Resolution, Topaz) can enlarge cleanly for big prints. Ask me “how big can I print 45MP?” to calculate.`,
            related: ['printing-tips', 'site-prints']
        },
        {
            id: 'printing-tips', topic: 'editing', level: 'intermediate', title: 'Getting good prints',
            q: ['how to get good prints', 'print looks different from screen', 'which paper for photo prints', 'matte vs glossy'],
            k: ['print', 'printing', 'paper', 'matte', 'glossy', 'lustre', 'canvas', 'lab', 'soft proof', 'icc'],
            a: `1. **Calibrate** your monitor and lower its brightness.\n2. **Soft-proof** with the lab's ICC profile for your chosen paper.\n3. Export **TIFF or maximum-quality JPEG**, in the colour space your lab asks for (often sRGB or Adobe RGB), at the final size.\n4. Add **print sharpening** (matte papers need more).\n5. **Order a small test print** before a large one.\n\n**Papers:** glossy/lustre = punchy contrast; **matte fine-art** = soft, painterly, no glare; **metal** = vivid and modern; **canvas** = textured, forgiving of lower resolution.`,
            related: ['calibration', 'print-resolution', 'site-prints']
        },
        {
            id: 'backup', topic: 'editing', level: 'beginner', title: 'Backing up & organising photos',
            q: ['how should i back up my photos', 'best way to store photos', 'organise photo library', '3-2-1 backup'],
            k: ['backup', 'storage', '3-2-1', 'cloud', 'hard drive', 'organise', 'organize', 'catalog', 'archive'],
            a: `Follow the **3-2-1 rule**: **3 copies** of your photos, on **2 different types of storage**, with **1 copy off-site** (cloud or a drive kept elsewhere).\n\n- Example: computer + external SSD/HDD + a cloud backup service.\n- **Automate** backups: manual ones get forgotten.\n- Organise by **year → date_event** folders, rate/keyword in Lightroom or similar, and add copyright metadata on import.\n- Don't delete cards until at least two copies exist.\n- Drives fail: replace them every few years and test restoring files occasionally.`,
            related: ['memory-cards', 'travel-photography']
        },
        {
            id: 'copyright-basics', topic: 'editing', level: 'intermediate', title: 'Copyright for photographers',
            q: ['who owns the copyright of a photo', 'how to protect my photos online', 'watermark or not', 'someone stole my photo'],
            k: ['copyright', 'protect', 'watermark', 'stolen', 'theft', 'metadata', 'reverse image search'],
            a: `In most countries (including Canada and the US), the **photographer owns the copyright** automatically when the photo is taken, unless it's transferred in writing or made under certain employment/commission terms. *This is general information, not legal advice.*\n\n**Protecting work online:** upload web-size files, embed copyright in metadata, use subtle watermarks if you like, and use reverse image search (Google Lens, TinEye) to find copies. If someone uses your work without permission, start with a polite request or invoice; most platforms also have formal takedown processes.`,
            related: ['site-license', 'export-web']
        },
        {
            id: 'ai-editing', topic: 'editing', level: 'intermediate', title: 'AI tools in photo editing',
            q: ['should i use ai to edit photos', 'generative fill', 'ai sky replacement', 'is ai editing cheating'],
            k: ['ai', 'artificial intelligence', 'generative', 'sky replacement', 'generative fill', 'masking', 'upscale'],
            a: `AI tools now help with **masking (sky/subject), denoise, upscaling, object removal and generative fill**.\n\n- **Corrective** AI (denoise, masks, dust removal) is widely accepted.\n- **Generative** changes (adding/removing major elements, sky replacement) are fine for art, but be transparent: many contests, editorial outlets and stock sites restrict or ban them.\n- Keep your original RAW, and be honest in captions when an image is a composite.`,
            related: ['editing-workflow', 'noise-reduction']
        }
    );
})(typeof window !== 'undefined' ? window : globalThis);
