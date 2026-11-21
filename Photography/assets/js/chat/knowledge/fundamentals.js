/* Knowledge: camera & exposure fundamentals (beginner → advanced). */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];

    ARC.KB.push(
        {
            id: 'beginner-roadmap', topic: 'fundamentals', level: 'beginner', title: 'Getting started with photography',
            q: ['how do i start photography', 'i am a beginner', 'how to get better at photography', 'where should a beginner start', 'learn photography'],
            k: ['beginner', 'start', 'learn', 'improve', 'getting started', 'new to photography', 'tips for beginners'],
            a: `A practical path for beginners:\n\n1. **Learn the exposure triangle**: aperture, shutter speed and ISO.\n2. **Shoot in aperture priority (A/Av)** with Auto ISO so you can focus on one setting at a time.\n3. **Study light**: shoot the same scene at midday, golden hour and blue hour and compare.\n4. **Practise composition**: rule of thirds, leading lines, simple backgrounds.\n5. **Shoot RAW** and learn basic editing (exposure, white balance, crop).\n6. **Pick a project** (one subject or place for a month) and review your best 10 shots critically.\n\nGear matters far less than light, composition and practice: a phone or kit lens is plenty to start.`,
            more: `To accelerate: copy a photo you admire (work out its focal length, light direction and settings), keep EXIF data on so you can learn from your own keepers, and get feedback from a photo community. Move to manual mode once you understand *why* the camera picks the settings it does.`,
            related: ['exposure-triangle', 'camera-modes', 'composition-basics', 'choose-camera']
        },
        {
            id: 'exposure-triangle', topic: 'fundamentals', level: 'beginner', title: 'The exposure triangle',
            q: ['what is the exposure triangle', 'explain exposure', 'how does exposure work', 'aperture shutter speed iso relationship'],
            k: ['exposuretriangle', 'exposure', 'aperture', 'shutterspeed', 'iso', 'stop', 'brightness'],
            a: `**Exposure** is how much light reaches the sensor. Three settings control it, and each has a side effect:\n\n- **Aperture (f-number)**: size of the lens opening. Wider (f/1.8) = more light and **shallower depth of field**.\n- **Shutter speed**: how long the sensor is exposed. Slower (1/15 s) = more light and **more motion blur**.\n- **ISO**: sensor amplification. Higher (ISO 6400) = brighter but **more noise**.\n\nEach full **stop** doubles or halves the light: f/4→f/5.6, 1/250→1/125, ISO 200→400. Change one setting by a stop and compensate with another to keep the same exposure but a different look.`,
            more: `Equivalent exposures example: f/4 · 1/500 s · ISO 100 = f/5.6 · 1/250 s · ISO 100 = f/8 · 1/125 s · ISO 100. Choose based on what matters: freeze action (fast shutter), blur the background (wide aperture) or keep noise low (low ISO). Full stops of aperture: f/1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, each is the previous × √2.`,
            related: ['aperture', 'shutter-speed', 'iso', 'metering']
        },
        {
            id: 'aperture', topic: 'fundamentals', level: 'beginner', title: 'Aperture (f-stops)',
            q: ['what is aperture', 'what does f stop mean', 'what aperture should i use', 'f/1.8 vs f/8', 'why is a smaller f number bigger'],
            k: ['aperture', 'f-stop', 'f number', 'lens opening', 'wide open', 'stop down'],
            a: `**Aperture** is the opening in the lens, written as an **f-number** (f/1.8, f/4, f/11). The f-number is a ratio (focal length ÷ opening diameter), so a **smaller number = bigger opening**.\n\n- **f/1.4–f/2.8:** lots of light, very shallow depth of field, portraits, low light, bokeh.\n- **f/4–f/5.6:** a good balance, events, wildlife, everyday shooting.\n- **f/8–f/11:** front-to-back sharpness, landscapes, architecture. Most lenses are sharpest around here.\n- **f/16–f/22:** maximum depth of field and sunstars, but **diffraction** softens detail.`,
            more: `Lenses are usually softest wide open and in the extreme corners; stopping down 1–2 stops improves sharpness and reduces vignetting. Past roughly f/11 on full frame (f/8 on APS-C, f/5.6–f/8 on Micro Four Thirds) diffraction starts reducing fine detail. A "fast" lens is one with a wide maximum aperture.`,
            related: ['depth-of-field', 'diffraction', 'exposure-triangle', 'bokeh']
        },
        {
            id: 'shutter-speed', topic: 'fundamentals', level: 'beginner', title: 'Shutter speed',
            q: ['what is shutter speed', 'what shutter speed should i use', 'how to freeze motion', 'how to avoid blur from movement', 'fast vs slow shutter'],
            k: ['shutterspeed', 'shutter', 'freeze motion', 'motion', 'exposure time', 'fast shutter', 'slow shutter'],
            a: `**Shutter speed** is how long the sensor is exposed. It controls **motion**:\n\n- **1/1000 s+**: birds in flight, sports, splashing water\n- **1/250–1/500 s**: people walking, kids, pets\n- **1/60–1/125 s**: still subjects handheld\n- **1/4–2 s**: silky waterfalls (tripod)\n- **10–30 s+**: smooth seas, star photos, light trails (tripod)\n\n**Handheld rule of thumb:** use at least **1/(focal length × crop factor)**: e.g. 1/100 s at 100 mm on full frame. Image stabilisation lets you go a few stops slower for still subjects (it doesn't freeze moving subjects).`,
            related: ['motion-blur', 'long-exposure', 'stabilization', 'camera-shake']
        },
        {
            id: 'iso', topic: 'fundamentals', level: 'beginner', title: 'ISO and noise',
            q: ['what is iso', 'what iso should i use', 'why are my photos grainy', 'high iso noise', 'is high iso bad'],
            k: ['iso', 'noise', 'grain', 'sensitivity', 'autoiso', 'low light'],
            a: `**ISO** amplifies the signal from the sensor. Raising it brightens the image but makes **noise** more visible.\n\n- **ISO 100–400:** daylight, tripod work, cleanest files\n- **ISO 800–3200:** indoors, overcast, fast action, fine on most modern cameras\n- **ISO 6400+:** night, events, usable, especially with noise reduction\n\nKey point: noise mostly comes from **too little light**, not ISO itself. A properly exposed ISO 3200 shot looks better than an underexposed ISO 800 shot brightened in editing. Don't be afraid of high ISO when you need a fast shutter.`,
            more: `Many cameras are close to "ISO-invariant" above a certain ISO, meaning raising ISO in-camera vs brightening later gives similar noise. Exposing well (even slightly to the right) and using modern AI denoise (Lightroom Denoise, DxO PureRAW, etc.) makes ISO 6400–12800 very usable. Auto ISO with a minimum shutter speed is ideal for changing light.`,
            related: ['exposure-triangle', 'noise-reduction', 'auto-iso']
        },
        {
            id: 'camera-modes', topic: 'fundamentals', level: 'beginner', title: 'Camera modes (Auto, P, A/Av, S/Tv, M)',
            q: ['which camera mode should i use', 'aperture priority vs manual', 'should i shoot in manual', 'what does av mode do', 'what is shutter priority'],
            k: ['mode', 'aperturepriority', 'shutterpriority', 'manualmode', 'program mode', 'auto mode', 'av', 'tv', 'dial'],
            a: `- **Auto / P (Program):** the camera chooses aperture and shutter; P lets you shift the pair and set ISO/exposure compensation.\n- **A / Av (Aperture priority):** you choose the aperture, the camera picks shutter speed. **Best everyday mode**: landscapes, portraits.\n- **S / Tv (Shutter priority):** you choose the shutter speed, sports, wildlife, panning.\n- **M (Manual):** you choose everything, consistent light, studio, night, panoramas, flash.\n\nA very popular setup is **Manual + Auto ISO**: you fix aperture and shutter speed for the look you want, and the camera adjusts ISO, with exposure compensation to fine-tune.`,
            related: ['exposure-compensation', 'auto-iso', 'metering']
        },
        {
            id: 'exposure-compensation', topic: 'fundamentals', level: 'beginner', title: 'Exposure compensation',
            q: ['what is exposure compensation', 'my snow photos are grey', 'photo too dark in auto', 'how to make the photo brighter', 'how to fix overexposed photos'],
            k: ['exposurecompensation', 'ev', 'brighter', 'darker', 'overexposed', 'underexposed', 'snow grey', 'plus minus'],
            a: `**Exposure compensation** (the +/– button, in EV) tells the camera to expose brighter or darker than its meter suggests in P, A/Av, S/Tv or Manual + Auto ISO.\n\nThe meter aims for "average grey", so:\n\n- **Bright scenes** (snow, beach, white buildings) come out grey → use **+1 to +2 EV**.\n- **Dark scenes** (night, black subjects, dark forest) come out too bright → use **–1 to –2 EV**.\n- **Sunsets / backlight:** –0.3 to –1 EV protects highlights.\n\nCheck the **histogram** rather than the rear screen, which can be misleading in bright sun.`,
            related: ['metering', 'histogram', 'ettr']
        },
        {
            id: 'metering', topic: 'fundamentals', level: 'intermediate', title: 'Metering modes',
            q: ['what metering mode should i use', 'spot metering vs evaluative', 'how does the light meter work', 'matrix metering'],
            k: ['metering', 'spot', 'evaluative', 'matrix', 'center weighted', 'centre weighted', 'meter'],
            a: `The camera meter measures reflected light and aims for mid-grey.\n\n- **Matrix / Evaluative / Multi:** analyses the whole frame, the best default.\n- **Centre-weighted:** favours the middle, classic portraits.\n- **Spot (1–5% of frame):** measures a tiny area, backlit subjects, a bird against a bright sky, the moon, stage performers.\n- **Highlight-weighted** (some cameras): protects bright areas, concerts, theatre.\n\nTip: spot-meter a mid-tone (green grass, grey rock, blue sky away from the sun) and lock exposure with AE-L.`,
            related: ['exposure-compensation', 'histogram']
        },
        {
            id: 'histogram', topic: 'fundamentals', level: 'intermediate', title: 'Reading the histogram',
            q: ['how do i read a histogram', 'what is a histogram', 'clipping highlights', 'blinkies', 'how do i know if exposure is correct'],
            k: ['histogram', 'clipping', 'blinkies', 'highlights', 'shadows', 'tones', 'graph'],
            a: `The **histogram** graphs the tones in your photo: shadows on the left, highlights on the right.\n\n- Data **piled against the right edge** = clipped (pure white) highlights that can't be recovered.\n- Data **piled against the left edge** = crushed blacks.\n- There's no "correct" shape: a snow scene leans right, a night scene leans left.\n\nTurn on **highlight warnings ("blinkies")** to see clipped areas flash. For colourful scenes, check the **RGB histogram** too: a single channel (often red in sunsets or flowers) can clip before the overall histogram shows it.`,
            related: ['ettr', 'dynamic-range', 'exposure-compensation']
        },
        {
            id: 'ettr', topic: 'fundamentals', level: 'advanced', title: 'Expose to the right (ETTR)',
            q: ['what is ettr', 'expose to the right', 'how to get cleaner shadows'],
            k: ['ettr', 'expose to the right', 'shadow noise', 'raw exposure'],
            a: `**ETTR** means exposing as brightly as possible **without clipping important highlights**, then pulling exposure down in RAW editing. Because sensors capture more data in bright tones, this gives cleaner shadows and less noise.\n\nUse it with RAW files, static scenes and highlight warnings on. Note the in-camera histogram is based on a JPEG preview, so it's slightly conservative. Don't ETTR when it would force a slower shutter or higher ISO than the scene allows, and never clip the sun's surroundings, skin or white feathers you care about.`,
            related: ['histogram', 'raw-vs-jpeg', 'dynamic-range']
        },
        {
            id: 'dynamic-range', topic: 'fundamentals', level: 'intermediate', title: 'Dynamic range',
            q: ['what is dynamic range', 'sky is white and foreground is dark', 'how to capture bright sky and dark land', 'high contrast scene'],
            k: ['dynamicrange', 'contrast', 'bright sky', 'dark foreground', 'stops of dynamic range', 'highlight recovery'],
            a: `**Dynamic range** is the span from the darkest to brightest tones a camera can record with detail, modern sensors capture roughly 12–15 stops at base ISO, while a sunset scene can exceed that.\n\nWhen the sky blows out and the land goes black:\n\n1. Shoot **RAW** and expose for the highlights, then lift the shadows.\n2. **Bracket** exposures and blend them (HDR).\n3. Use a **graduated ND filter** to darken the sky in-camera.\n4. Wait for softer light (golden hour, cloud cover).\n\nDynamic range is highest at **base ISO**.`,
            related: ['hdr', 'graduated-nd', 'raw-vs-jpeg']
        },
        {
            id: 'white-balance', topic: 'fundamentals', level: 'beginner', title: 'White balance',
            q: ['what is white balance', 'why are my photos orange', 'photos look too blue', 'what white balance should i use', 'kelvin settings'],
            k: ['whitebalance', 'kelvin', 'colour cast', 'color cast', 'orange', 'blue tint', 'auto white balance', 'awb', 'tungsten'],
            a: `**White balance (WB)** makes neutral colours look neutral under different light, measured in **Kelvin**:\n\n- Candle ~1900 K · Tungsten bulbs ~2700–3200 K · Daylight ~5200–5600 K · Cloudy ~6000–6500 K · Shade ~7000–8000 K\n\nSetting WB *lower* than the light makes the image bluer; *higher* makes it warmer. **Auto WB** is good most of the time, but it may "correct" a sunset into dullness: try **Daylight** or **Cloudy** for warm skies.\n\nIf you shoot **RAW**, WB can be changed freely afterwards; with JPEG it's baked in.`,
            more: `For accurate colour (product shots, art reproduction) use a grey card or custom WB. For mixed lighting (tungsten indoors + window light) pick one source to match and either accept the cast on the other, or gel your flash. Locking WB to a fixed value keeps a sequence or timelapse consistent.`,
            related: ['raw-vs-jpeg', 'color-grading', 'golden-hour']
        },
        {
            id: 'raw-vs-jpeg', topic: 'fundamentals', level: 'beginner', title: 'RAW vs JPEG',
            q: ['should i shoot raw or jpeg', 'what is a raw file', 'why shoot raw', 'raw vs jpeg', 'can i open raw files'],
            k: ['raw', 'jpeg', 'jpg', 'file format', 'heic', 'cr3', 'nef', 'arw', 'dng'],
            a: `- **RAW** stores the sensor data (12–14 bit). It gives much more room to fix **exposure, highlights, shadows and white balance**, but files are larger and must be processed (Lightroom, Capture One, darktable, RawTherapee, the camera maker's software).\n- **JPEG** is processed in-camera (8-bit, compressed): small, ready to share, but edits break down sooner.\n\n**Shoot RAW** for anything important or tricky (high contrast, mixed light, night). JPEG is fine for quick sharing or when the camera's colours are exactly what you want. **RAW + JPEG** gives you both.`,
            related: ['editing-workflow', 'white-balance', 'file-formats']
        },
        {
            id: 'file-formats', topic: 'fundamentals', level: 'intermediate', title: 'Image file formats (JPEG, HEIF, TIFF, PNG, WebP, DNG)',
            q: ['what file format should i export', 'tiff vs jpeg', 'what is heic', 'png or jpg for photos', 'what is dng', 'webp vs jpeg'],
            k: ['file format', 'tiff', 'png', 'heic', 'heif', 'webp', 'avif', 'dng', 'export format', 'jpeg'],
            a: `- **JPEG**: universal; best for sharing and web. 8-bit, lossy.\n- **HEIF/HEIC**: newer phone/camera format; ~smaller than JPEG at similar quality, supports 10-bit. Not every app/site accepts it.\n- **TIFF**: lossless, 8/16-bit; for printing labs and editing hand-offs. Large files.\n- **PNG**: lossless; great for graphics and screenshots, inefficient for photos.\n- **WebP / AVIF**: modern web formats; much smaller than JPEG for websites.\n- **DNG**: Adobe's open RAW format; good for archiving RAWs.\n\nRule of thumb: **JPEG (or WebP/AVIF) for web, TIFF or high-quality JPEG for print, RAW/DNG for your archive.**`,
            related: ['export-web', 'print-resolution', 'raw-vs-jpeg']
        },
        {
            id: 'depth-of-field', topic: 'fundamentals', level: 'beginner', title: 'Depth of field',
            q: ['what is depth of field', 'how to get everything in focus', 'how to blur the background', 'shallow depth of field', 'why is only part of my photo sharp'],
            k: ['depthoffield', 'shallow', 'deep', 'everything sharp', 'in focus', 'background blur', 'focus range'],
            a: `**Depth of field (DoF)** is the zone in front of and behind the focus point that looks acceptably sharp. It gets **shallower** with:\n\n1. **Wider aperture** (f/1.8 vs f/8)\n2. **Closer focus distance** (the biggest factor in macro)\n3. **Longer focal length** at the same framing distance (practically, longer lenses blur backgrounds more)\n4. **Larger sensor** for the same framing and f-number\n\n**For blur:** wide aperture, get close, put distance between subject and background.\n**For front-to-back sharpness:** f/8–f/11, focus about one-third into the scene (or at the hyperfocal distance), or focus-stack.`,
            related: ['bokeh', 'hyperfocal', 'focus-stacking', 'aperture']
        },
        {
            id: 'hyperfocal', topic: 'fundamentals', level: 'advanced', title: 'Hyperfocal distance',
            q: ['what is hyperfocal distance', 'how to use hyperfocal focusing', 'where to focus for landscapes'],
            k: ['hyperfocal', 'hyperfocal distance', 'focus for landscapes', 'infinity'],
            a: `The **hyperfocal distance** is the closest focus distance at which the depth of field still reaches **infinity**. Focus there and everything from **half that distance to infinity** is acceptably sharp.\n\nFormula: **H = f² / (N × c) + f** (f = focal length, N = f-number, c = circle of confusion ≈ 0.03 mm full frame, 0.02 mm APS-C).\n\nExample: 24 mm at f/8 on full frame ≈ 2.4 m → sharp from ~1.2 m to infinity.\n\nAsk me: **“hyperfocal 16mm f/11”** and I'll calculate it. For critical large prints, focus slightly beyond H, or focus-stack instead.`,
            related: ['depth-of-field', 'landscape-photography', 'focus-stacking']
        },
        {
            id: 'bokeh', topic: 'fundamentals', level: 'beginner', title: 'Bokeh (background blur)',
            q: ['how do i get bokeh', 'what is bokeh', 'best lens for bokeh', 'creamy background', 'blur background like a pro'],
            k: ['bokeh', 'background blur', 'creamy', 'blurry background', 'out of focus highlights', 'portrait blur'],
            a: `**Bokeh** is the look of the out-of-focus areas. To get more of it:\n\n1. Use your **widest aperture** (f/1.4–f/2.8).\n2. **Get closer** to your subject.\n3. Move the subject **far from the background**.\n4. Use a **longer focal length** (85–200 mm is classic).\n5. Find **small background lights** (city lights, sun through leaves) for round bokeh balls.\n\nAffordable option: a **50mm f/1.8** prime. On phones, Portrait mode simulates bokeh with software.`,
            related: ['depth-of-field', 'portrait-photography', 'prime-vs-zoom']
        },
        {
            id: 'focus-basics', topic: 'fundamentals', level: 'beginner', title: 'Autofocus modes & focus areas',
            q: ['which autofocus mode should i use', 'af-s vs af-c', 'my camera focuses on the wrong thing', 'continuous focus', 'eye autofocus'],
            k: ['autofocus', 'af-s', 'af-c', 'one shot', 'ai servo', 'continuous', 'focus point', 'eye af', 'subject detection', 'focus area', 'tracking'],
            a: `**Focus modes**\n- **Single (AF-S / One-Shot):** locks once, still subjects, landscapes.\n- **Continuous (AF-C / AI Servo):** keeps refocusing, moving subjects, wildlife, sports.\n\n**Focus areas**\n- **Single point / spot:** precise; you choose where.\n- **Zone / expanded:** small group of points, erratic subjects like birds.\n- **Wide / tracking + subject detection (eye/animal/bird/vehicle):** on modern mirrorless cameras this is excellent, let it find the eye.\n\nIf the camera grabs the background, switch from wide-area to a single point and place it on your subject.`,
            related: ['back-button-focus', 'sharpness-troubleshooting', 'wildlife-photography']
        },
        {
            id: 'back-button-focus', topic: 'fundamentals', level: 'intermediate', title: 'Back-button focus',
            q: ['what is back button focus', 'should i use back button focus', 'separate focus from shutter'],
            k: ['backbutton', 'back button focus', 'af-on', 'focus and recompose'],
            a: `**Back-button focus** moves autofocus from the half-press of the shutter to a rear button (AF-ON or AE-L).\n\nWhy people like it:\n- Hold the button for **continuous tracking**, release it to **lock focus**: no need to switch AF modes.\n- Focus once on a tripod and the shutter won't refocus every shot.\n- Combine with fast bursts without the camera hunting.\n\nSet it in the custom controls menu and remove AF activation from the shutter button. It takes a day or two to get used to.`,
            related: ['focus-basics', 'wildlife-photography']
        },
        {
            id: 'sharpness-troubleshooting', topic: 'fundamentals', level: 'beginner', title: 'Why are my photos blurry?',
            q: ['why are my photos blurry', 'my pictures are not sharp', 'how to get sharper photos', 'soft images', 'everything is out of focus'],
            k: ['blurry', 'sharpness', 'sharp', 'soft', 'out of focus', 'not sharp', 'crisp'],
            a: `Work out *which* blur you have:\n\n1. **Everything is blurred in one direction** → camera shake. Use a faster shutter (≥ 1/focal length), stabilisation, a tripod or timer.\n2. **Subject blurred, background sharp** → subject motion. Faster shutter (1/500 s+ for action).\n3. **Something else is sharp, but not your subject** → missed focus. Use a single AF point or eye-detection, AF-C for moving subjects.\n4. **Nothing is quite sharp at f/16–f/22** → diffraction. Use f/8–f/11.\n5. **Shallow DoF**: at f/1.8 close up, only a sliver is sharp. Stop down.\n6. **Dirty lens / filter**, haze, heat shimmer at long distances, or high ISO noise reduction smearing detail.\n\nZoom to 100% on the camera to check, and shoot a short burst: one frame is often sharper.`,
            related: ['camera-shake', 'focus-basics', 'diffraction', 'tripod']
        },
        {
            id: 'camera-shake', topic: 'fundamentals', level: 'beginner', title: 'Avoiding camera shake',
            q: ['how to hold a camera steady', 'avoid camera shake', 'slowest handheld shutter speed', 'reciprocal rule'],
            k: ['camerashake', 'handheld', 'steady', 'reciprocal rule', 'hold the camera', 'stabilization'],
            a: `- **Reciprocal rule:** shutter speed ≥ 1/(focal length × crop factor). On high-resolution sensors, double it.\n- **Stance:** elbows tucked, camera against your face (viewfinder), exhale and press the shutter gently.\n- **Brace** against a wall, tree or railing.\n- **Stabilisation (IBIS/OIS)** typically buys 3–6 stops for still subjects.\n- **Burst** 3–5 frames and keep the sharpest.\n- On a tripod: use a **2-second timer or remote**, and turn off stabilisation if your lens manual recommends it.`,
            related: ['stabilization', 'tripod', 'shutter-speed']
        },
        {
            id: 'stabilization', topic: 'fundamentals', level: 'intermediate', title: 'Image stabilisation (IBIS / OIS)',
            q: ['what is image stabilization', 'do i need ibis', 'turn off stabilization on tripod', 'how many stops of stabilization'],
            k: ['stabilization', 'ibis', 'ois', 'vr', 'is', 'vibration reduction', 'stops'],
            a: `**In-body (IBIS)** moves the sensor; **optical (OIS/VR/IS)** moves a lens element; many systems combine both. They counter **your** movement, typically by **3–8 stops** depending on the system and focal length.\n\n- Great for handheld landscapes, low-light interiors and video.\n- **Doesn't freeze subject motion**: a walking person still blurs at 1/10 s.\n- **On a tripod:** some (often older) systems can introduce blur, check your manual; many modern cameras detect tripods automatically.`,
            related: ['camera-shake', 'shutter-speed']
        },
        {
            id: 'diffraction', topic: 'fundamentals', level: 'advanced', title: 'Diffraction',
            q: ['what is diffraction', 'why is f/22 blurry', 'sharpest aperture', 'diffraction limit'],
            k: ['diffraction', 'f22', 'f16', 'sharpest aperture', 'sweet spot', 'small aperture'],
            a: `**Diffraction** is light spreading as it passes through a small aperture, which softens fine detail. It's physics, not a lens flaw.\n\n- Visible softening typically starts around **f/11 on full frame**, **f/8 on APS-C**, **f/5.6–f/8 on Micro Four Thirds** (higher-resolution sensors show it sooner).\n- A lens's **sweet spot** is usually **2–3 stops down from wide open** (often f/5.6–f/8).\n\nIf you need more depth of field than f/11 gives, consider **focus stacking** instead of f/22. Sometimes f/16 is still the right call (sunstars, deep scenes for web use).`,
            related: ['aperture', 'focus-stacking', 'depth-of-field']
        },
        {
            id: 'sensor-size', topic: 'fundamentals', level: 'intermediate', title: 'Sensor sizes & crop factor',
            q: ['full frame vs aps-c', 'what is crop factor', 'does sensor size matter', 'micro four thirds vs full frame', 'equivalent focal length'],
            k: ['sensorsize', 'fullframe', 'apsc', 'microfourthirds', 'cropfactor', 'medium format', '1 inch', 'equivalent'],
            a: `Common sensor sizes and **crop factors** (relative to 36×24 mm full frame):\n\n- **Medium format** ~0.8× (44×33 mm)\n- **Full frame** 1×\n- **APS-C** 1.5× (Nikon, Sony, Fujifilm) · 1.6× (Canon)\n- **Micro Four Thirds** 2×\n- **1-inch** ~2.7× · **Phones** ~3–7×\n\nMultiply focal length by the crop factor for the equivalent field of view (50 mm on APS-C ≈ 75 mm full frame).\n\n**Larger sensors**: better low-light noise and dynamic range, shallower DoF at the same framing. **Smaller sensors**: lighter, cheaper lenses, more "reach" for wildlife, more DoF. All are capable of excellent work.`,
            related: ['choose-camera', 'focal-lengths']
        },
        {
            id: 'sunny16', topic: 'fundamentals', level: 'intermediate', title: 'Sunny 16 rule',
            q: ['what is the sunny 16 rule', 'exposure without a light meter'],
            k: ['sunny16', 'sunny 16', 'no meter', 'film exposure'],
            a: `**Sunny 16:** on a bright sunny day with distinct shadows, at **f/16** set the shutter speed to **1/ISO** (ISO 100 → 1/100 s, or 1/125 s).\n\nAdjust for conditions (at f/16 equivalents):\n- Snow/sand: f/22\n- Slight overcast (soft shadows): f/11\n- Overcast: f/8\n- Heavy overcast: f/5.6\n- Open shade / sunset: f/4\n\nIt's handy for film, manual lenses or checking your camera's meter.`,
            related: ['exposure-triangle', 'metering']
        }
    );
})(typeof window !== 'undefined' ? window : globalThis);
