/* Knowledge: composition, light, colour, weather. */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];

    ARC.KB.push(
        {
            id: 'composition-basics', topic: 'composition', level: 'beginner', title: 'Composition basics',
            q: ['how do i compose a photo', 'composition tips', 'how to make photos more interesting', 'framing tips', 'my photos look boring'],
            k: ['composition', 'compose', 'framing', 'boring', 'interesting', 'layout', 'arrangement'],
            a: `Strong compositions usually have **one clear subject** and nothing that distracts from it. Core tools:\n\n- **Rule of thirds**: place the subject or horizon on a third line.\n- **Leading lines**: roads, rivers, fences that guide the eye.\n- **Foreground interest**: rocks, flowers or ice in front of a landscape for depth.\n- **Framing**: arches, branches, windows around the subject.\n- **Simplify**: step closer, change angle, or use a longer lens to remove clutter.\n- **Check the edges**: no half-objects or bright spots pulling the eye out of the frame.\n- **Change height**: get low or go high; eye level is often the least interesting view.`,
            more: `More advanced ideas: balance visual weight (a small bright object balances a large dark one), use negative space for calm, look for repetition and pattern then break it, use odd numbers of subjects, and arrange layers (foreground–midground–background). Rules are starting points: symmetry and centred subjects work brilliantly for reflections and architecture.`,
            related: ['rule-of-thirds', 'leading-lines', 'symmetry', 'foreground-interest']
        },
        {
            id: 'rule-of-thirds', topic: 'composition', level: 'beginner', title: 'Rule of thirds',
            q: ['what is the rule of thirds', 'where should i put the horizon', 'should the subject be in the centre'],
            k: ['ruleofthirds', 'thirds', 'grid', 'horizon placement', 'off centre', 'off center'],
            a: `Divide the frame into a **3×3 grid** (turn on the grid overlay in your camera or phone). Placing the subject on a line or intersection usually feels more dynamic than dead centre.\n\n- **Horizon:** on the lower third when the sky is the star, the upper third when the foreground is.\n- **Eyes** in portraits: near the top third line.\n- **Moving subjects:** leave space in the direction they're moving or looking.\n\nBreak it deliberately for **symmetry, reflections and minimalism**, where centring is stronger.`,
            related: ['composition-basics', 'symmetry']
        },
        {
            id: 'leading-lines', topic: 'composition', level: 'beginner', title: 'Leading lines',
            q: ['what are leading lines', 'how to use leading lines', 'guide the eye in a photo'],
            k: ['leadinglines', 'lines', 'diagonal', 'roads', 'paths', 'rivers', 'boardwalk', 'converging lines'],
            a: `**Leading lines** draw the viewer's eye through the image toward the subject: roads, rails, boardwalks, rivers, shorelines, fences, bridges.\n\n- Start lines near the **bottom corners** and let them lead in.\n- **Wide-angle lenses** exaggerate converging lines: get low and close.\n- **S-curves** (winding rivers or trails) feel calm and natural; **diagonals** feel energetic.\n\nYou'll see this a lot in the gallery's boardwalk, railway and Kinsol Trestle photos.`,
            related: ['composition-basics', 'wide-angle']
        },
        {
            id: 'symmetry', topic: 'composition', level: 'intermediate', title: 'Symmetry, reflections & patterns',
            q: ['how to photograph reflections', 'tips for reflections on a lake', 'symmetrical composition', 'mirror reflection on a lake', 'patterns in photography'],
            k: ['symmetry', 'reflection', 'reflections', 'lake reflection', 'mirror', 'pattern', 'repetition', 'calm water', 'still water', 'puddle'],
            a: `**Reflections** look best on **still water**: early morning or evening when wind is lowest. Centre the horizon for a perfect mirror; a **polariser** can strengthen or remove reflections (rotate it to see the change). Get low to the water to make a small puddle reflect a whole building.\n\n**Symmetry** suits architecture, bridges and corridors: centre precisely and keep the camera level (use the electronic level). **Patterns** become stronger when something breaks them: one red leaf among yellow ones.`,
            related: ['polarizer', 'composition-basics']
        },
        {
            id: 'foreground-interest', topic: 'composition', level: 'intermediate', title: 'Foreground interest & depth',
            q: ['how to add depth to landscape photos', 'my landscape photos look flat', 'foreground in landscape'],
            k: ['foreground', 'depth', 'layers', 'flat', 'three dimensional', 'near far'],
            a: `To make landscapes feel three-dimensional:\n\n- Put an interesting **foreground** (rocks, flowers, ice, driftwood) close to a wide lens, 0.5–2 m away.\n- Build **layers**: foreground → middle ground → background (mountains, sky).\n- Use **atmosphere**: fog, mist and haze separate layers by tone.\n- **Side light** (low sun) adds shadows and texture.\n- Use f/8–f/11 and focus about a third into the scene, or **focus-stack** for very close foregrounds.`,
            related: ['landscape-photography', 'hyperfocal', 'focus-stacking']
        },
        {
            id: 'minimalism', topic: 'composition', level: 'intermediate', title: 'Minimalism & negative space',
            q: ['minimalist photography', 'what is negative space', 'simple clean photos'],
            k: ['minimalism', 'minimalist', 'negative space', 'simple', 'clean', 'lone tree', 'fog'],
            a: `**Minimalist** images use a single subject and lots of **negative space** (empty sky, water, snow, fog). Tips:\n\n- Look for **fog, snow, calm water or plain skies**.\n- Use a **long lens** to isolate the subject or a long exposure to smooth water and clouds.\n- Place the small subject off-centre and keep tones simple: often two or three colours.\n- Expose carefully: bright minimal scenes usually need **+1 EV**.`,
            related: ['composition-basics', 'long-exposure', 'snow-photography']
        },
        {
            id: 'golden-hour', topic: 'light', level: 'beginner', title: 'Golden hour',
            q: ['what is golden hour', 'when is the best time for landscape photography', 'best time of day to take photos', 'why shoot at sunrise'],
            k: ['goldenhour', 'sunrise', 'sunset', 'best time', 'warm light', 'time of day'],
            a: `**Golden hour** is roughly the **first and last hour of sunlight** (sun below ~6° above the horizon). Light is warm, soft and low, creating long shadows and texture: flattering for portraits and landscapes.\n\nIts length varies with **latitude and season**: short near the equator, much longer at high latitudes and in winter. Use an app like PhotoPills, The Photographer's Ephemeris or a sunrise/sunset calculator to plan, and arrive 30–45 minutes early.\n\nMidday sun isn't useless: it's great for turquoise water, forests on overcast days and black-and-white architecture.`,
            related: ['blue-hour', 'sunset-photography', 'light-quality']
        },
        {
            id: 'blue-hour', topic: 'light', level: 'beginner', title: 'Blue hour',
            q: ['what is blue hour', 'when is blue hour', 'best time to photograph city lights'],
            k: ['bluehour', 'twilight', 'dusk', 'dawn', 'city lights', 'cityscape'],
            a: `**Blue hour** is twilight when the sun is a few degrees **below** the horizon (roughly 20–40 minutes, depending on location and season). The sky turns deep blue and balances nicely with artificial lights: ideal for **cityscapes, bridges and illuminated buildings**.\n\nTypical settings: tripod, **f/8**, **ISO 100**, exposures of **1–30 s**, WB around 3800–4500 K for natural blues. Shoot the same composition every few minutes: the best balance between sky and lights is often short.`,
            related: ['night-city', 'golden-hour', 'long-exposure']
        },
        {
            id: 'light-quality', topic: 'light', level: 'intermediate', title: 'Hard vs soft light & light direction',
            q: ['what is soft light', 'hard light vs soft light', 'how to use light direction', 'side lighting', 'backlighting'],
            k: ['light', 'soft light', 'hard light', 'direction', 'side light', 'backlight', 'front light', 'diffuse', 'shadows'],
            a: `**Quality**\n- **Hard light** (small source: midday sun, bare flash): crisp shadows, high contrast, punchy.\n- **Soft light** (large source: overcast sky, window, softbox): gentle shadows, flattering.\n\n**Direction**\n- **Front:** even, flat, shows colour.\n- **Side:** texture and depth, landscapes, food, portraits with drama.\n- **Back:** glowing edges, silhouettes, translucent leaves; watch for flare.\n- **Top (midday):** harsh shadows under eyes, find shade.\n\nThe bigger and closer the source, the softer the light.`,
            related: ['golden-hour', 'portrait-photography', 'flash-basics']
        },
        {
            id: 'overcast-weather', topic: 'light', level: 'intermediate', title: 'Shooting in overcast, fog, rain & storms',
            q: ['what to photograph on a cloudy day', 'how to photograph fog', 'photography in the rain', 'storm photography', 'bad weather photography'],
            k: ['overcast', 'cloudy', 'fog', 'mist', 'rain', 'storm', 'weather', 'moody', 'grey sky'],
            a: `"Bad" weather is often the best weather:\n\n- **Overcast:** a giant softbox, forests, waterfalls, flowers and portraits look great. Keep dull skies out of frame.\n- **Fog/mist:** simplifies scenes and adds depth; expose **+0.7 to +1.3 EV** so it stays bright.\n- **Rain:** saturated colours, reflections in puddles; use a rain cover or plastic bag, lens hood, and wipe the front element often.\n- **Storms:** dramatic skies; keep safe distances, never shoot lightning in the open.\n\nAfter the rain clears is prime time for rainbows (sun behind you, low in the sky).`,
            related: ['waterfall-photography', 'gear-weather-protection']
        },
        {
            id: 'color-theory', topic: 'light', level: 'intermediate', title: 'Colour in photography',
            q: ['how to use colour in photos', 'complementary colours', 'colour harmony', 'why do some photos have great colour'],
            k: ['colour', 'color', 'complementary', 'harmony', 'teal and orange', 'palette', 'saturation'],
            a: `- **Complementary** colours (opposite on the colour wheel: blue/orange, red/green, purple/yellow) create contrast, sunsets over blue water, autumn leaves on evergreens.\n- **Analogous** colours (neighbours: yellow-orange-red) feel harmonious.\n- **A single accent colour** in a muted scene draws the eye.\n- **Warm** tones advance and feel energetic; **cool** tones recede and feel calm.\n\nIn editing, restraint wins: use the **HSL** panel to adjust individual colours rather than pushing global saturation.`,
            related: ['color-grading', 'white-balance']
        },
        {
            id: 'black-and-white', topic: 'light', level: 'intermediate', title: 'Black & white photography',
            q: ['when should i convert to black and white', 'how to make good black and white photos', 'monochrome tips'],
            k: ['black and white', 'monochrome', 'bw', 'b&w', 'greyscale', 'grayscale'],
            a: `Black and white works when **shape, texture, contrast and light** matter more than colour, architecture, dramatic skies, portraits with character, harsh midday light.\n\n- Shoot **RAW** (keep colour data) and convert in editing.\n- Use the **B&W mix sliders** to control tones: darkening blue makes skies dramatic; brightening orange/red smooths skin.\n- Aim for a full range from true black to clean white, then add local contrast.\n- Long exposures + B&W create a classic fine-art look.`,
            related: ['editing-workflow', 'architecture-photography']
        }
    );
})(typeof window !== 'undefined' ? window : globalThis);
