/* Knowledge: genres & techniques. */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];

    ARC.KB.push(
        {
            id: 'landscape-photography', topic: 'technique', level: 'beginner', title: 'Landscape photography',
            q: ['how to take landscape photos', 'best settings for landscape photography', 'landscape photography tips', 'what lens for landscapes', 'mountain photography'],
            k: ['landscape', 'scenery', 'mountains', 'scenic', 'vista', 'nature photography', 'outdoor'],
            a: `**Typical settings:** aperture priority or manual, **f/8–f/11**, **ISO 100**, tripod when the shutter drops below ~1/focal length, focus a third into the scene (or at the hyperfocal distance), RAW.\n\n**What makes landscapes work:**\n- **Light:** golden hour, blue hour, storms clearing, fog. Plan with a sun/weather app.\n- **Foreground interest** and layers for depth.\n- **Lenses:** wide (14–35 mm) for big scenes with foreground; telephoto (70–200 mm) to isolate peaks, layers and patterns.\n- **Filters:** polariser for water/foliage glare, ND for motion, graduated ND for bright skies.\n- **Return** to the same place in different seasons and weather.`,
            more: `Advanced: bracket exposures for high-contrast scenes, focus-stack when the foreground is very close, shoot panoramas with a longer lens for higher resolution, and check the histogram for clipped skies. Scout locations at midday, shoot them at the edges of the day. Keep the horizon level — use the in-camera electronic level.`,
            related: ['foreground-interest', 'hyperfocal', 'polarizer', 'golden-hour']
        },
        {
            id: 'waterfall-photography', topic: 'technique', level: 'beginner', title: 'Photographing waterfalls',
            q: ['how to photograph waterfalls', 'silky waterfall settings', 'waterfall shutter speed', 'how to make water look smooth'],
            k: ['waterfall', 'falls', 'cascade', 'silky water', 'smooth water', 'rapids', 'stream', 'creek'],
            a: `**Settings for silky water:** tripod, **ISO 100**, **f/8–f/11**, shutter **1/4 s to 2 s** (start around 1/2 s). Faster (1/250 s+) freezes droplets for a powerful look; very long (5 s+) gives a misty look but can lose texture.\n\n- Shoot on **overcast days** or in shade — bright sun causes blown highlights and makes slow shutters impossible.\n- A **polariser** removes glare on wet rocks and leaves and cuts ~1.5–2 stops of light.\n- Add an **ND filter** if it's still too bright.\n- Carry a microfibre cloth — spray is constant near big falls like Niagara or Montmorency.\n- Include rocks, logs or ferns in the foreground for scale.`,
            related: ['long-exposure', 'polarizer', 'nd-filters', 'tripod']
        },
        {
            id: 'long-exposure', topic: 'technique', level: 'intermediate', title: 'Long exposure photography',
            q: ['how to do long exposure', 'long exposure settings', 'how to blur clouds', 'light trails', 'smooth sea photography'],
            k: ['longexposure', 'long exposure', 'bulb', 'light trails', 'streaking clouds', 'smooth sea', 'motion'],
            a: `**Long exposures** (from ~1 s to several minutes) smooth water and clouds and turn moving lights into trails.\n\n**Workflow:**\n1. Tripod, remote or 2-second timer, **ISO 100**, **f/8–f/11**.\n2. Compose and **focus before attaching an ND filter**, then switch to manual focus.\n3. Meter without the filter, then multiply for the filter strength (e.g. 10 stops: 1/30 s → ~30 s).\n4. Use **Bulb** mode for anything over 30 s.\n5. Cover the viewfinder (DSLRs) and turn on long-exposure noise reduction if you see hot pixels.\n\n**Times:** light trails 10–30 s · smooth sea 30 s–2 min · streaking clouds 1–5 min.\n\nAsk me “10 stop ND at 1/60” and I'll calculate the time.`,
            related: ['nd-filters', 'waterfall-photography', 'night-city', 'tripod']
        },
        {
            id: 'astro-milkyway', topic: 'technique', level: 'intermediate', title: 'Milky Way & star photography',
            q: ['how to photograph the milky way', 'star photography tips', 'night sky photography', 'when can i see the milky way', 'how to find dark skies'],
            k: ['astro', 'milky way', 'stars', 'night sky', 'galactic core', 'dark sky', 'light pollution', 'new moon'],
            a: `**Planning matters most:**\n- **Dark skies** — use a light-pollution map; aim for Bortle 1–4. Canada has many Dark Sky Preserves.\n- **New moon** (or moon below the horizon).\n- **Season:** in the Northern Hemisphere the bright galactic core is visible roughly **February–October**, best around **May–August**, toward the south.\n- Clear sky forecast (astronomy forecasts like Clear Outside).\n\n**Starting settings:** tripod, widest aperture (**f/1.4–f/2.8**), **ISO 1600–6400**, shutter by the **500/NPF rule** (≈15–25 s with a 14–20 mm on full frame), manual focus on a bright star using live view magnified, RAW, WB ~3800–4200 K.\n\nAsk me “500 rule for 14mm APS-C” for your shutter speed.`,
            more: `Next level: stack 10–20 frames (Sequator on Windows, Starry Landscape Stacker on Mac) to cut noise, shoot a separate longer/lower-ISO foreground exposure during blue hour and blend, use a star tracker for long, low-noise sky exposures, and use a red headlamp to protect night vision. Dew heaters stop lenses fogging on humid nights.`,
            related: ['astro-settings', 'aurora', 'wide-angle', 'tripod']
        },
        {
            id: 'astro-settings', topic: 'technique', level: 'intermediate', title: 'Focusing & settings for night sky',
            q: ['how to focus at night', 'stars are blurry', 'stars look like lines', 'star trails', 'best iso for stars'],
            k: ['astro', 'focus stars', 'star trails', 'blurry stars', 'infinity focus', 'night focus', 'live view'],
            a: `**Sharp stars checklist:**\n- **Manual focus:** live view, magnify 10× on the brightest star, turn the ring until it's the smallest point. The ∞ mark on many lenses is *not* exactly infinity. Tape the ring once set.\n- **Trailing stars?** Shorten the exposure (500 rule is a maximum; the NPF rule is stricter).\n- **Coma (bird-wing stars in corners)?** Stop down ⅓–1 stop.\n- **Turn off** image stabilisation on a tripod if your system recommends it.\n- **Intentional star trails:** many 30 s frames over 1–2 hours, stacked (StarStaX), pointing toward Polaris for circles.`,
            related: ['astro-milkyway', 'aurora']
        },
        {
            id: 'aurora', topic: 'technique', level: 'intermediate', title: 'Northern lights (aurora)',
            q: ['how to photograph the northern lights', 'aurora settings', 'where can i see northern lights in canada', 'aurora forecast'],
            k: ['aurora', 'northern lights', 'aurora borealis', 'kp index', 'geomagnetic'],
            a: `**When/where:** dark, clear skies away from city lights, ideally at higher latitudes (in Canada: Yukon, NWT and northern provinces are best, but strong storms reach southern Canada). Check an **aurora forecast** (Kp index, Bz) and live alerts; activity often peaks around local midnight but can happen any time after dark.\n\n**Settings:** tripod, wide lens, **f/1.4–f/2.8**, **ISO 800–3200**, shutter **2–10 s** for bright, fast-moving aurora (up to ~15 s for faint glow), manual focus on stars, WB ~3500–4000 K.\n\nShorter exposures keep the curtain structure; long ones turn it into a green smear. Your camera sees colour the eye often can't, so take test shots even if the sky looks only faintly grey-white.`,
            related: ['astro-milkyway', 'astro-settings', 'cold-weather']
        },
        {
            id: 'wildlife-photography', topic: 'technique', level: 'intermediate', title: 'Wildlife photography',
            q: ['how to photograph wildlife', 'wildlife camera settings', 'best lens for wildlife', 'how to get close to animals'],
            k: ['wildlife', 'animals', 'safari', 'deer', 'moose', 'fox', 'telephoto', 'nature', 'mammals'],
            a: `**Settings:** shutter priority or Manual + Auto ISO, **1/1000 s+** for active animals (1/250–1/500 s for still ones), widest aperture (f/4–f/6.3), **AF-C** with zone or animal-eye detection, burst mode.\n\n**Gear:** 300–600 mm equivalent is the usual range; a 100–400/150–600 mm zoom is a great start. APS-C or Micro Four Thirds bodies extend reach.\n\n**Fieldcraft beats gear:**\n- Go at **dawn and dusk** when animals are active.\n- Learn behaviour; stay still, quiet and downwind.\n- **Get low** to eye level for intimate images.\n- **Respect distance** — if an animal changes behaviour, you're too close. Never bait or approach nests and dens.`,
            related: ['birds-in-flight', 'telephoto', 'focus-basics', 'ethics-wildlife']
        },
        {
            id: 'birds-in-flight', topic: 'technique', level: 'advanced', title: 'Bird photography & birds in flight',
            q: ['how to photograph birds in flight', 'bird photography settings', 'bird photos are blurry', 'best settings for birds'],
            k: ['birdsinflight', 'birds', 'bird', 'flight', 'heron', 'geese', 'eagle', 'gull', 'feathers'],
            a: `**Settings for birds in flight:**\n- **1/2000–1/4000 s** (1/1000 s for large slow birds like herons and geese)\n- Aperture wide open or one stop down (f/5.6–f/8)\n- **Auto ISO** in Manual, exposure compensation **+0.3 to +1** against bright sky\n- **AF-C**, zone/tracking area or **bird-eye detection**, high burst rate\n- Back-button focus helps you track continuously\n\n**Technique:** have the sun **behind you**, pre-focus at the distance birds will pass, track smoothly and start shooting before they're in the ideal spot. Perched birds: get eye-level and use a clean, distant background. White birds (swans, egrets): expose for the whites to keep feather detail.`,
            related: ['wildlife-photography', 'back-button-focus', 'telephoto']
        },
        {
            id: 'ethics-wildlife', topic: 'technique', level: 'beginner', title: 'Wildlife & nature photography ethics',
            q: ['is it ok to bait animals', 'how close should i get to wildlife', 'nature photography ethics', 'leave no trace'],
            k: ['ethics', 'baiting', 'distance', 'disturb', 'leave no trace', 'responsible', 'nest'],
            a: `- **The animal's welfare comes first** — no photo is worth stressing it. If it changes behaviour, back off.\n- **Don't bait, call repeatedly or use playback** in breeding season; never approach nests or dens.\n- **Follow park rules** and keep the distances many parks recommend (Parks Canada advises staying well back — at least 100 m from bears and 30 m from most other large animals).\n- **Stay on trails**, especially in fragile areas, and **leave no trace**.\n- Be cautious about sharing exact locations of sensitive species.\n- Caption honestly: say when a photo was taken in a zoo, aquarium, sanctuary or museum diorama.`,
            related: ['wildlife-photography', 'drone']
        },
        {
            id: 'macro-photography', topic: 'technique', level: 'intermediate', title: 'Macro & close-up photography',
            q: ['how to take macro photos', 'macro photography settings', 'how to photograph insects', 'flower close up tips', 'macro without a macro lens'],
            k: ['macro', 'close-up', 'closeup', 'insects', 'flowers', 'butterfly', 'extension tubes', 'magnification', 'dew'],
            a: `**True macro** is 1:1 magnification (subject life-size on the sensor) — a dedicated macro lens (e.g. 90–105 mm) is best. Cheaper options: **extension tubes**, **close-up filters** or a lens with close focusing.\n\n**Settings:** depth of field is razor-thin up close, so use **f/8–f/16**, a fast shutter (**1/200 s+**) handheld, and raise ISO or add **flash with a diffuser**.\n\n**Tips:**\n- Shoot insects **early morning** when they're cool and slow.\n- Focus by moving the camera slightly back and forth rather than turning the ring.\n- Keep the sensor **parallel** to the subject to maximise what's sharp.\n- Use **focus stacking** for front-to-back sharpness on still subjects.\n- Overcast light is flattering for flowers; a reflector fills shadows.`,
            related: ['focus-stacking', 'flash-basics', 'garden-photography']
        },
        {
            id: 'garden-photography', topic: 'technique', level: 'beginner', title: 'Gardens & flower photography',
            q: ['how to photograph flowers', 'garden photography tips', 'tips for photographing butchart gardens', 'botanical garden photos', 'tulip photography'],
            k: ['flowers', 'garden', 'botanical', 'tulips', 'blossom', 'butchart', 'greenhouse', 'conservatory', 'cherry blossom'],
            a: `- **Light:** overcast days are perfect for flowers; in sun, look for **backlit petals** or shoot early/late.\n- **Isolate** one bloom with a wide aperture (f/2.8–f/4) and a longer focal length (85–200 mm) to blur busy backgrounds.\n- **Shoot wide** for garden "scenes" — paths, fountains, layered beds; include a bench or lantern as a focal point.\n- **Get low** for unusual angles through foreground flowers.\n- **Greenhouses:** humidity fogs cold lenses — let the camera acclimatise; watch for mixed light colour.\n- **Respect garden rules** — many (including The Butchart Gardens) don't allow tripods at busy times; check before you go.\n\nThe gallery's Nature category has 120+ Butchart Gardens photos for inspiration.`,
            related: ['macro-photography', 'bokeh', 'travel-butchart'],
            actions: [{ label: 'See Butchart Gardens photos', action: 'gallery:search:butchart' }]
        },
        {
            id: 'portrait-photography', topic: 'technique', level: 'beginner', title: 'Portrait photography',
            q: ['how to take good portraits', 'portrait settings', 'best lens for portraits', 'how to pose people', 'headshot tips'],
            k: ['portrait', 'people', 'headshot', 'model', 'pose', 'face', 'eyes', 'skin'],
            a: `**Settings:** aperture priority, **f/1.8–f/2.8** for blur (f/4–f/5.6 for groups), shutter ≥ 1/200 s, **eye-AF**.\n\n**Lenses:** 50 mm, **85 mm** (classic) or 70–200 mm. Very wide lenses close up distort faces.\n\n**Light:** open shade, a window to the side, or golden hour backlight with a reflector. Avoid harsh overhead sun.\n\n**Connection:** talk to your subject, give simple directions ("chin slightly forward and down", "shift your weight to the back foot"), and shoot between poses for natural expressions. Focus on the **nearest eye**, and leave a little headroom without cutting at joints (wrists, knees).`,
            related: ['bokeh', 'light-quality', 'flash-basics']
        },
        {
            id: 'street-photography', topic: 'technique', level: 'intermediate', title: 'Street photography',
            q: ['street photography tips', 'how to photograph strangers', 'street photography settings', 'candid photos in the city'],
            k: ['street', 'candid', 'strangers', 'city life', 'zone focus', 'urban people'],
            a: `- **Small, quiet gear:** a compact or a 28–35 mm prime is less intimidating.\n- **Zone focusing:** manual focus at ~3 m, **f/8**, and everything from about 2–6 m is sharp — no waiting for AF.\n- **Shutter priority 1/250–1/500 s**, Auto ISO.\n- **Find a stage, wait for the actor:** good light or a strong background, then wait for someone to walk into it.\n- **Light and shadow:** low sun creates dramatic shapes.\n- **Ethics & law:** rules on photographing people in public vary by country — be respectful, smile, delete if asked, and get releases for commercial use.`,
            related: ['composition-basics', 'light-quality']
        },
        {
            id: 'architecture-photography', topic: 'technique', level: 'intermediate', title: 'Architecture & interiors',
            q: ['how to photograph buildings', 'architecture photography tips', 'converging verticals', 'how to photograph church interiors', 'keep buildings straight'],
            k: ['architecture', 'building', 'interior', 'church', 'cathedral', 'skyscraper', 'converging verticals', 'keystone', 'tilt shift', 'dome'],
            a: `- **Keep verticals straight:** hold the camera level (use the electronic level) and crop later, step back with a longer lens, or fix with **Transform/Upright** in Lightroom. A **tilt-shift** lens does it optically.\n- **Light:** blue hour for lit buildings; side light reveals texture on façades.\n- **Interiors** (churches, legislatures, domes): high dynamic range — **bracket** 3–5 exposures and merge to HDR. If tripods aren't allowed, brace on a pew and raise ISO.\n- **Look up:** symmetric ceilings and domes work well centred with a wide lens.\n- **Details:** a telephoto picks out windows, carvings and patterns.\n\nThe Urban category has many examples (St. Peter's Basilica, BC Legislature).`,
            related: ['hdr', 'symmetry', 'blue-hour', 'wide-angle'],
            actions: [{ label: 'Browse Urban photos', action: 'gallery:category:urban' }]
        },
        {
            id: 'night-city', topic: 'technique', level: 'intermediate', title: 'Night & cityscape photography',
            q: ['how to photograph a city at night', 'night photography settings', 'skyline photography', 'how to photograph fireworks', 'handheld night photos'],
            k: ['night', 'cityscape', 'skyline', 'city lights', 'fireworks', 'light trails', 'christmas lights'],
            a: `**Tripod settings:** ISO 100–400, **f/8–f/11** (sunstars from street lights), **2–30 s**, 2-second timer, manual focus, RAW. Shoot during **blue hour** for a sky that isn't pitch black.\n\n**Handheld:** widest aperture, ISO 3200–6400, stabilisation on, brace against something, shoot a burst.\n\n**Fireworks:** tripod, ISO 100–200, f/8–f/11, Bulb or 2–8 s, pre-focus on the first burst, include a skyline for context.\n\n**Light trails:** 10–30 s from a bridge or overpass; time it with traffic lights changing.`,
            related: ['blue-hour', 'long-exposure', 'tripod']
        },
        {
            id: 'sunset-photography', topic: 'technique', level: 'beginner', title: 'Sunrise & sunset photos',
            q: ['how to photograph a sunset', 'sunset camera settings', 'sunset is too dark', 'how to capture sunset colours'],
            k: ['sunset', 'sunrise', 'sun', 'silhouette', 'afterglow', 'sky colours', 'clouds'],
            a: `- **Expose for the sky**: dial **–0.3 to –1 EV** to keep colour; let foreground subjects go to silhouette, or bracket and blend.\n- **WB:** Daylight or Cloudy keeps the warmth that Auto WB may remove.\n- **Stay after sunset** — the best colour (afterglow) often comes 10–20 minutes later. High, broken clouds give the best colour.\n- **Sunstar:** f/16 with the sun partly hidden behind an edge.\n- **Silhouettes:** strong, clean shapes (trees, people, piers) against the brightest part of the sky.\n- Never look at the sun through an optical viewfinder with a telephoto lens.`,
            related: ['golden-hour', 'dynamic-range', 'graduated-nd']
        },
        {
            id: 'snow-photography', topic: 'technique', level: 'beginner', title: 'Winter & snow photography',
            q: ['how to photograph snow', 'winter photography tips', 'snow looks grey', 'ice photography', 'frozen waterfall photos'],
            k: ['snow', 'winter', 'ice', 'frozen', 'icicles', 'frost', 'cold'],
            a: `- **Snow turns grey** because the meter aims for mid-grey → add **+1 to +2 EV** and watch the histogram.\n- **White balance:** shade and overcast make snow blue — use Cloudy/Shade WB or correct in RAW.\n- **Ice and icicles** glow when backlit; side light shows texture.\n- **Falling snow:** 1/500 s freezes flakes, 1/30–1/60 s gives streaks; flash on a dark background makes flakes pop.\n- See cold-weather gear tips for batteries and condensation.\n\nThe Water category's frozen Niagara Falls and Lake Ontario ice series are good examples.`,
            related: ['cold-weather', 'exposure-compensation', 'white-balance'],
            actions: [{ label: 'See winter photos', action: 'gallery:search:winter' }]
        },
        {
            id: 'motion-blur', topic: 'technique', level: 'intermediate', title: 'Motion blur & panning',
            q: ['how to do panning photography', 'how to show motion in a photo', 'intentional camera movement', 'blur moving cars'],
            k: ['motionblur', 'panning', 'icm', 'intentional camera movement', 'movement', 'speed'],
            a: `**Panning:** follow a moving subject (car, cyclist, bird) with a smooth swing while using a slow shutter — **1/30–1/60 s** for cars/cyclists, **1/15 s** for runners. The subject stays fairly sharp while the background streaks. Use AF-C, burst mode and keep swinging after the shutter fires. Expect a low hit rate at first.\n\n**ICM (intentional camera movement):** move the camera during a **0.5–2 s** exposure for painterly abstracts — vertical sweeps work beautifully with forests.`,
            related: ['shutter-speed', 'long-exposure']
        },
        {
            id: 'travel-photography', topic: 'technique', level: 'beginner', title: 'Travel photography',
            q: ['travel photography tips', 'what camera gear to bring on a trip', 'how to photograph landmarks without crowds', 'road trip photography'],
            k: ['travel', 'trip', 'vacation', 'landmark', 'tourist', 'road trip', 'packing', 'crowds'],
            a: `- **Pack light:** one body, a versatile zoom (24–105 or 18–135 mm) and maybe a fast prime. Spare batteries and cards matter more than extra lenses.\n- **Beat crowds:** go at sunrise or right before closing; use a long exposure (ND filter) to "erase" moving people; or include people as part of the story.\n- **Tell a story:** wide establishing shots, medium scenes, close details, food, people, signage.\n- **Research** the classic viewpoint, then find your own angle.\n- **Back up every night** (laptop, SSD or cloud) and keep cards separate from the camera.\n- **Check local rules** on drones, tripods and photographing people or sacred sites.`,
            related: ['backup', 'long-exposure', 'choose-lens']
        },
        {
            id: 'aquarium-zoo', topic: 'technique', level: 'beginner', title: 'Aquariums, zoos & through glass',
            q: ['how to photograph through glass', 'aquarium photography tips', 'zoo photography', 'jellyfish photos', 'reflections in glass'],
            k: ['aquarium', 'zoo', 'glass', 'jellyfish', 'fish', 'reflections in glass', 'butterfly house', 'enclosure'],
            a: `- **Lens against the glass** (a rubber lens hood helps) to kill reflections, and shoot perpendicular to it.\n- **No flash** — it reflects off glass and disturbs animals.\n- **Wide aperture, ISO 1600–6400, 1/125 s+** — aquariums are dark and fish move.\n- Use **manual or single-point AF** if the camera focuses on scratches.\n- **Jellyfish:** dark backgrounds make them glow; under-expose slightly to keep blacks clean.\n- **Zoos:** a long lens at wide aperture can make fences disappear when the animal is far from them.\n- **White balance:** tanks are often blue/green — set custom WB or fix in RAW.`,
            related: ['iso', 'white-balance', 'wildlife-photography']
        },
        {
            id: 'focus-stacking', topic: 'technique', level: 'advanced', title: 'Focus stacking',
            q: ['what is focus stacking', 'how to focus stack', 'get foreground and background sharp', 'focus bracketing'],
            k: ['focusstacking', 'focus stack', 'focus bracketing', 'stack', 'helicon', 'zerene'],
            a: `**Focus stacking** merges several shots focused at different distances into one image that's sharp front to back — without the diffraction of f/22.\n\n1. Tripod, manual exposure, f/5.6–f/11.\n2. Shoot a series from the nearest point to infinity, overlapping focus zones (many cameras have **focus bracketing** built in).\n3. Merge in **Photoshop** (Auto-Align → Auto-Blend Layers → Stack Images), **Helicon Focus**, **Zerene Stacker**, or Affinity Photo.\n\nUsed for macro (often dozens of frames) and landscapes with close foregrounds (typically 2–5 frames). Moving subjects (wind) cause artefacts — shoot between gusts.`,
            related: ['depth-of-field', 'macro-photography', 'diffraction']
        },
        {
            id: 'hdr', topic: 'technique', level: 'intermediate', title: 'HDR & exposure bracketing',
            q: ['what is hdr photography', 'how to bracket exposures', 'how to merge hdr', 'natural looking hdr'],
            k: ['hdr', 'bracketing', 'merge', 'exposure blend', 'aeb', 'tone mapping'],
            a: `**HDR** combines several exposures to capture more dynamic range than one frame can.\n\n1. Use **auto-exposure bracketing (AEB)**: 3 frames at **–2, 0, +2 EV** (5 frames for very high contrast, e.g. interiors with windows).\n2. Keep aperture fixed (aperture priority or manual), tripod if possible, burst mode handheld.\n3. Merge in **Lightroom (Photo Merge → HDR)** — it outputs a flexible RAW-like DNG — or Photomatix / Aurora HDR.\n\nFor a natural look, avoid heavy tone-mapping halos: keep shadows slightly darker than midtones. With modern sensors, one well-exposed RAW often suffices.`,
            related: ['dynamic-range', 'architecture-photography']
        },
        {
            id: 'panorama', topic: 'technique', level: 'intermediate', title: 'Panoramas',
            q: ['how to shoot a panorama', 'panorama settings', 'how to stitch photos', 'parallax in panoramas'],
            k: ['panorama', 'pano', 'stitch', 'parallax', 'nodal point', 'wide view'],
            a: `1. **Manual exposure, manual WB, manual focus** so frames match.\n2. Shoot in **portrait orientation** with **30–50% overlap**.\n3. Keep the camera **level**; a tripod with a panning base helps.\n4. For close foregrounds, rotate around the lens's **no-parallax point** (nodal slide) to avoid stitching errors.\n5. Merge in **Lightroom (Photo Merge → Panorama)**, Photoshop or PTGui.\n\nA longer lens (35–85 mm) stitched across a scene gives far more resolution than a single wide shot.`,
            related: ['landscape-photography', 'tripod']
        },
        {
            id: 'flash-basics', topic: 'technique', level: 'intermediate', title: 'Flash basics',
            q: ['how to use flash', 'flash photos look harsh', 'bounce flash', 'fill flash outdoors', 'off camera flash'],
            k: ['flash', 'speedlight', 'bounce', 'fill flash', 'ttl', 'diffuser', 'strobe', 'red eye'],
            a: `- **Bounce** a hot-shoe flash off a white ceiling or wall to make the light big and soft — the single best improvement.\n- **Fill flash** outdoors (−1 to −2 FEC) lifts shadows on faces in harsh sun or backlight.\n- **TTL** for changing situations; **manual power** for consistency.\n- **Drag the shutter** indoors (1/30–1/60 s) to keep ambient light while flash freezes the subject.\n- **Sync speed** limits shutter speed (often 1/200–1/250 s); **high-speed sync** lifts that at the cost of power.\n- **Off-camera flash** with a softbox or umbrella gives studio-style shape anywhere.`,
            related: ['light-quality', 'portrait-photography', 'macro-photography']
        },
        {
            id: 'smartphone', topic: 'technique', level: 'beginner', title: 'Better phone photos',
            q: ['how to take better photos with my phone', 'iphone photography tips', 'phone camera settings', 'can a phone replace a camera'],
            k: ['smartphone', 'phone', 'iphone', 'android', 'mobile', 'pixel', 'galaxy'],
            a: `- **Clean the lens** — pocket lint is the #1 cause of hazy phone photos.\n- **Tap to focus, then slide to adjust exposure**; lock it (AE/AF lock) by holding.\n- **Turn on the grid** for straight horizons and thirds.\n- Use the **telephoto (2–5×)** for flattering portraits and compressed landscapes instead of digital zoom.\n- **Night mode:** brace the phone or use a mini tripod.\n- **RAW / ProRAW / Expert RAW** gives editing headroom on supported phones.\n- **Portrait mode** for bokeh; check edges around hair.\n\nPhones are superb for travel, street and good-light landscapes. Dedicated cameras still win for fast action, long telephoto, very low light and large prints.`,
            related: ['composition-basics', 'editing-workflow', 'choose-camera']
        },
        {
            id: 'drone', topic: 'technique', level: 'intermediate', title: 'Drone (aerial) photography',
            q: ['drone photography tips', 'do i need a licence to fly a drone in canada', 'drone rules', 'drone camera settings', 'can i fly a drone in national parks'],
            k: ['drone', 'aerial', 'uav', 'rpas', 'dji', 'licence', 'license to fly', 'transport canada'],
            a: `**Rules (always check the current regulations — they change):**\n- In **Canada**, drones weighing **250 g to 25 kg** must be **registered with Transport Canada**, and the pilot needs a **drone pilot certificate** (Basic or Advanced, depending on where you fly). Recreational flight is also subject to rules on altitude (typically max **122 m / 400 ft**), keeping the drone in sight, and distance from people and airports.\n- **Recreational flying is generally not permitted in national parks** in Canada without authorisation.\n- Other countries have their own rules (e.g. FAA in the US, EASA in the EU).\n\n**Photo tips:** shoot RAW/DNG, use AEB for high contrast, fly at golden hour, look straight down for patterns, and use ND filters for smooth video.`,
            related: ['ethics-wildlife', 'travel-photography']
        },
        {
            id: 'travel-butchart', topic: 'places', level: 'beginner', title: 'The Butchart Gardens (BC)',
            q: ['tell me about the butchart gardens', 'when to visit butchart gardens', 'where is butchart gardens', 'best time to photograph butchart'],
            k: ['butchart', 'gardens', 'brentwood bay', 'sunken garden', 'victoria', 'vancouver island'],
            a: `**The Butchart Gardens** are in **Brentwood Bay, near Victoria on Vancouver Island, BC**. They began in the early 1900s when Jennie Butchart transformed a worked-out limestone quarry into the famous **Sunken Garden**, and they're a National Historic Site of Canada. Highlights include the Sunken Garden, Rose Garden, Japanese Garden, Italian Garden and the Ross Fountain.\n\n**Photo tips:** spring (bulbs, cherry blossom) and autumn colour are spectacular; arrive at opening for soft light and fewer people; overcast days suit flowers. Check the gardens' official site for current hours, seasonal displays and photography/tripod rules.\n\nThe Nature category has 120+ photos from here.`,
            related: ['garden-photography', 'travel-vancouver-island'],
            actions: [{ label: 'Show Butchart photos', action: 'gallery:search:butchart' }]
        },
        {
            id: 'travel-niagara', topic: 'places', level: 'beginner', title: 'Niagara Falls',
            q: ['tell me about niagara falls', 'best place to photograph niagara falls', 'niagara falls in winter', 'how tall is niagara falls'],
            k: ['niagara', 'horseshoe falls', 'american falls', 'niagara gorge', 'whirlpool', 'rainbow bridge'],
            a: `**Niagara Falls** straddles Ontario and New York. It has three falls: the **Horseshoe (Canadian) Falls**, the **American Falls** and the smaller **Bridal Veil Falls**; the Horseshoe Falls drop roughly 50 metres.\n\n**Photo tips:**\n- The Canadian side (Niagara Parkway / Table Rock) faces the falls directly.\n- **Mist is constant** — bring lens cloths and a rain cover.\n- **Winter** creates huge ice formations (see the gallery's frozen-falls series).\n- The falls are **illuminated at night** — great for blue hour.\n- Downstream, the **Niagara Gorge and Whirlpool** have turquoise water and autumn colour.`,
            related: ['waterfall-photography', 'snow-photography'],
            actions: [{ label: 'Show Niagara photos', action: 'gallery:search:niagara' }]
        },
        {
            id: 'travel-rockies', topic: 'places', level: 'beginner', title: 'Canadian Rockies (Banff, Lake Louise, Jasper)',
            q: ['why is lake louise turquoise', 'photographing banff', 'canadian rockies photography tips', 'best time to visit banff for photos'],
            k: ['rockies', 'banff', 'lake louise', 'jasper', 'moraine lake', 'bow lake', 'glacier', 'turquoise lake', 'icefields parkway'],
            a: `The **turquoise colour** of lakes like Lake Louise and Bow Lake comes from **glacial rock flour** — fine sediment suspended in meltwater that scatters blue-green light. Colour is usually strongest in **summer** (roughly July–September) when meltwater flows.\n\n**Photo tips:** arrive at **sunrise** for calm reflections and fewer crowds; a **polariser** deepens the colour (rotate carefully — it can also remove the reflection); the **Icefields Parkway** between Lake Louise and Jasper has endless viewpoints and waterfalls (Athabasca, Sunwapta).\n\nAccess, parking and shuttle arrangements in Banff and Jasper change — check **Parks Canada** before you go, and carry bear spray on trails.`,
            related: ['landscape-photography', 'polarizer', 'ethics-wildlife'],
            actions: [{ label: 'Show Rockies photos', action: 'gallery:search:alberta' }]
        },
        {
            id: 'travel-vancouver-island', topic: 'places', level: 'beginner', title: 'Victoria & Vancouver Island',
            q: ['photography spots in victoria bc', 'vancouver island photo tips', 'best photo spots victoria'],
            k: ['vancouverisland', 'victoria', 'inner harbour', 'empress', 'kinsol trestle', 'botanical beach', 'hatley', 'beacon hill'],
            a: `Photographed spots in the portfolio include **Victoria's Inner Harbour** (Fairmont Empress and BC Legislature, beautiful at blue hour when the legislature is outlined in lights), **Hatley Park**, **Beacon Hill Park**, **The Butchart Gardens**, the **Kinsol Trestle** near Shawnigan Lake, the **Malahat SkyWalk**, and the rugged west-coast shoreline at **Botanical Beach** near Port Renfrew.\n\nTips: tide pools at Botanical Beach are best at **low tide** (check tide tables and watch the incoming tide); coastal sunsets over the strait and Olympic Mountains are spectacular from Victoria's waterfront.`,
            related: ['travel-butchart', 'blue-hour'],
            actions: [{ label: 'Show Victoria photos', action: 'gallery:search:victoria' }]
        },
        {
            id: 'travel-pei', topic: 'places', level: 'beginner', title: 'Prince Edward Island',
            q: ['why is pei sand red', 'prince edward island photography', 'thunder cove beach'],
            k: ['pei', 'prince edward island', 'red sand', 'thunder cove', 'confederation bridge', 'sandstone'],
            a: `**Prince Edward Island's** red cliffs and beaches get their colour from **iron oxide** in the island's sandstone. Thunder Cove Beach is known for eroded sea stacks (the formations change over time, and some have collapsed), and the **Confederation Bridge** (about 12.9 km) links PEI to New Brunswick.\n\nTips: shoot red sandstone at **golden hour** when the colour glows; visit near **low tide** for sea stacks and arches; stay off cliff edges — they erode constantly.`,
            related: ['landscape-photography', 'golden-hour'],
            actions: [{ label: 'Show PEI photos', action: 'gallery:search:prince edward island' }]
        }
    );
})(typeof window !== 'undefined' ? window : globalThis);
