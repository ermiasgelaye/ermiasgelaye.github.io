/* Knowledge: Ermias Gelaye Gaga — background, experience, education, skills, projects, contact.
 * Only facts shown on the portfolio page belong here. Update both together. */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];
    const CV = 'https://drive.google.com/file/d/1XVWFF_t5IVVkVQ-8G8oZ58p-ulXrZjPb/view';

    ARC.KB.push(
        {
            id: 'me-about', topic: 'about', title: 'About Ermias',
            q: ['tell me about ermias', 'who is ermias', 'what is his background', 'introduce yourself', 'summary of his profile'],
            k: ['ermias', 'about', 'background', 'profile', 'bio', 'summary', 'who'],
            a: `**Ermias Gelaye Gaga** is a **data scientist and data research analyst** based in **Toronto, Canada**, with **10+ years** of experience in fast-paced digital environments focused on data handling and analysis.\n\n- **M.S. in Data Science**: Eastern University (2024–2025)\n- **M.S. in Cognitive Science** (Cognitive Neuroscience stream): CIMeC, University of Trento, Italy (2015–2017)\n- **Data Analytics & Visualization certificate**: University of Toronto School of Continuing Studies (2019–2020)\n- **B.A. in Psychology**: Hawassa University, Ethiopia (2008–2011)\n\nHe enjoys mining, analyzing and visualizing heterogeneous data with research teams, and photographing nature and travel in his spare time.`,
            more: `His path runs from psychology and cognitive neuroscience into data analytics and data science. Today he works as a **Senior Analyst** (since 2021), researching collective-bargaining trends, using AI tools to extract data from bargaining documents, and building dashboards and standardized reporting methods.`,
            related: ['me-experience', 'me-education', 'me-skills', 'me-projects'],
            actions: [{ label: 'Read the About section', action: 'scroll:#about' }]
        },
        {
            id: 'me-experience', topic: 'about', title: 'Work experience',
            q: ['what is his work experience', 'where has he worked', 'what does he do now', 'current job', 'career history'],
            k: ['experience', 'work', 'job', 'career', 'senior analyst', 'research associate', 'cyber media analyst', 'role', 'position'],
            a: `**Senior Analyst**: 2021 to present\n- Researches and analyses collective-bargaining trends to inform strategic decisions\n- Implemented AI tools to extract and process data from bargaining documents, improving accuracy and efficiency\n- Designs interactive dashboards and detailed reports for internal and external audiences\n- Developed standardized methodologies for reporting key bargaining metrics\n\n**Research Associate**: 2018 to 2021\n- Researched and extracted business data to acquire new customers across industries\n- Data manipulation, transformation and cleansing; statistical reports and KPI dashboards\n\n**Cyber Media Analyst**: 2011 to 2015\n- Monitored and analyzed public inquiries from news, government reports and social networks\n- Weekly reports on digital sentiment and public-opinion trends; recommendations to government agencies`,
            related: ['me-skills', 'me-education', 'me-contact'],
            actions: [{ label: 'See the timeline', action: 'scroll:#experience' }]
        },
        {
            id: 'me-education', topic: 'about', title: 'Education',
            q: ['what is his education', 'what degrees does he have', 'where did he study', 'university', 'qualifications'],
            k: ['education', 'degree', 'degrees', 'master', 'university', 'study', 'qualification', 'eastern university', 'trento', 'hawassa', 'bootcamp'],
            a: `- **Master of Science in Data Science**: Eastern University, St. Davids, Pennsylvania (2024–2025): machine learning, advanced analytics in Python, R and SQL, database management, visualization and statistical modeling.\n- **Certificate in Data Analytics and Visualization**: University of Toronto School of Continuing Studies (2019–2020), a 24-week intensive boot camp.\n- **Master of Science in Cognitive Science** (Cognitive Neuroscience stream): CIMeC, University of Trento, Rovereto, Italy (2015–2017): research-focused.\n- **Bachelor of Arts in Psychology**: Hawassa University, Ethiopia (2008–2011).`,
            related: ['me-about', 'me-skills'],
            actions: [{ label: 'See education', action: 'scroll:#education' }, { label: 'Cognitive Science program (Trento)', action: 'link:https://corsi.unitn.it/en/cognitive-science/program/overview' }]
        },
        {
            id: 'me-skills', topic: 'about', title: 'Technical skills',
            q: ['what are his technical skills', 'what programming languages does he know', 'what tools does he use', 'is he good at python', 'tech stack'],
            k: ['skills', 'technical', 'python', 'r', 'sql', 'java', 'tools', 'stack', 'languages', 'expertise', 'proficiency'],
            a: `**Core languages (daily use)**\n- **Python**: Pandas, NumPy, Scikit-learn, TensorFlow (Mental Health, Google Health, Weather API projects)\n- **SQL**: PostgreSQL, SQLite, SQLAlchemy; schema design and ETL (Employee DB, ETL pipeline, Hawaii climate API)\n\n**Also experienced with**\n- **R**: statistical analysis, ggplot2\n- **Java**: backend systems and data processing\n\n**Capabilities, with projects that show them**\n- **Data visualization**: Matplotlib, Seaborn, Plotly, D3.js, Chart.js, Tableau (Belly Button dashboard, D3 health risks)\n- **Exploratory analysis & statistics**: hypothesis tests, correlation, regression (drug regimen study, weather vs. latitude)\n- **Data wrangling & ETL**: Pandas, REST APIs, web scraping (ETL pipeline, Google Health data audit)\n- **Modeling & ML**: logistic regression, cross-validation, PCA, k-means (Mental Health, Google Health)\n- **Databases**: PostgreSQL, SQLite, MongoDB\n- **Web apps & deployment**: Flask, JavaScript, Express, GitHub Pages, Vercel`,
            related: ['me-projects', 'ds-python', 'ds-sql'],
            actions: [{ label: 'See skills', action: 'scroll:#skills' }]
        },
        {
            id: 'me-projects', topic: 'about', title: 'Projects overview',
            q: ['show me his projects', 'what projects has he done', 'portfolio projects', 'github projects', 'best project'],
            k: ['projects', 'portfolio', 'github', 'demo', 'work samples', 'case study'],
            a: `Featured projects:\n\n1. **Google Health Search Trends**: where Americans search for nine health conditions across 210 metro areas (2004–2017), alongside CDC death rates.\n2. **Mental Health Risk Indicators**: who seeks treatment in a tech-worker survey, and how suicide rates in 185 countries changed from 2000 to 2021 and relate to World Bank indicators, with ML models.\n3. **Global Weather Analysis**: 500+ cities from the OpenWeatherMap API: how weather changes toward the equator.\n4. **Pharmaceutical Data Analysis**: statistical comparison of drug regimens in a study of 249 mice.\n5. **ARC-NATURE Photography**: a gallery web app with 1,000+ photos, a travel map and a photo assistant.\n\nAsk about any of them for details.`,
            related: ['p-health', 'p-mental', 'p-weather', 'p-pharma'],
            actions: [{ label: 'Browse projects', action: 'scroll:#projects' }, { label: 'GitHub profile', action: 'link:https://github.com/ermiasgelaye' }]
        },
        {
            id: 'p-health', topic: 'project', title: 'Google Health Search Trends project',
            q: ['tell me about the google health search project', 'health search trends dashboard', 'cdc project'],
            k: ['google health', 'health search', 'google trends', 'cdc', 'flask', 'postgresql', 'd3', 'dashboard'],
            a: `**Google Health Search Trends Analysis**: where Americans search Google for nine health conditions across **210 metro areas, 2004–2017**, alongside CDC leading causes of death.\n\n- Cleaned and modeled Google Trends and CDC data with **Python** and **PostgreSQL**; now a static site\n- Audited the data and fixed 18 wrong state assignments, 23 mis-geocoded metros and a CDC typo\n- Interactive US map, PCA, correlation analysis and CDC trends\n- Key findings: states that search more about health have more illness in CDC surveys (r = 0.52); the South leans toward rehab, heart and diarrhea searches, the North toward depression, vaccine and obesity searches`,
            related: ['me-projects', 'ds-sql', 'ds-dataviz'],
            actions: [{ label: 'Live demo', action: 'link:https://ermiasgelaye.github.io/Google-Health-Search-Project/' }, { label: 'Code', action: 'link:https://github.com/ermiasgelaye/Google-Health-Search-Project' }]
        },
        {
            id: 'p-mental', topic: 'project', title: 'Mental Health Risk Indicators project',
            q: ['tell me about the mental health project', 'suicide risk indicators analysis', 'world bank suicide project'],
            k: ['mental health', 'suicide', 'osmi', 'world bank', 'tableau', 'risk indicators', 'machine learning project'],
            a: `**Mental Health Risk Indicators Analysis**: population-level analytics of mental-health and socio-economic indicators related to suicide mortality across countries, to support prevention planning.\n\n- Combined the **OSMI Mental Health in Tech survey** (1,258 respondents) with **World Bank** indicators for 185 countries, 2000–2021\n- Found family history is the strongest predictor of seeking treatment (adjusted odds ratio 4.5); suicide rates fell 27% across 185 countries from 2000 to 2021 (World Bank / WHO, indicator SH.STA.SUIC.P5), and in the typical country men die by suicide about 3× as often as women (about 2× worldwide, population-weighted)\n- **Logistic regression, region-adjusted and within-country models**, and cross-validated ML (SVM, random forest)\n- Interactive charts and **Tableau** dashboards\n\nBuilt with Python, scikit-learn, Tableau and Chart.js.`,
            related: ['ds-tree-models', 'ds-dataviz', 'me-projects'],
            actions: [{ label: 'Live demo', action: 'link:https://ermiasgelaye.github.io/Mental-Health-Predictor/' }, { label: 'Code', action: 'link:https://github.com/ermiasgelaye/Mental-Health-Predictor' }]
        },
        {
            id: 'p-weather', topic: 'project', title: 'Global Weather Analysis project',
            q: ['tell me about the weather project', 'weather api analysis', 'latitude weather project'],
            k: ['weather', 'openweathermap', 'latitude', 'equator', 'cities', 'api project'],
            a: `**Global Weather Analysis**: how weather changes closer to the equator, using data from **500+ cities** worldwide.\n\n- Collected data from the **OpenWeatherMap API**\n- Exploratory analysis with **Pandas**\n- Visualizations with **Matplotlib** and **Seaborn**: max temperature, humidity, cloudiness and wind speed vs latitude\n- Identified key weather patterns by latitude`,
            related: ['ds-eda', 'ds-regression', 'me-projects'],
            actions: [{ label: 'Live demo', action: 'link:https://ermiasgelaye.github.io/Web-Design-Challenge/index.html' }, { label: 'Code', action: 'link:https://github.com/ermiasgelaye/python-api-challenge' }]
        },
        {
            id: 'p-pharma', topic: 'project', title: 'Pharmaceutical Data Analysis project',
            q: ['tell me about the pharmaceutical project', 'mice tumor drug analysis', 'capomulin'],
            k: ['pharmaceutical', 'mice', 'tumor', 'tumour', 'drug regimen', 'capomulin', 'scc', 'matplotlib challenge'],
            a: `**Pharmaceutical Data Analysis**: data from **249 mice** with SCC tumor growth, comparing the performance of different drug regimens.\n\n- Cleaned and processed the raw experimental data\n- Statistical analysis and hypothesis testing\n- Visualizations comparing treatment efficacy: treatment distribution, tumor-volume box plots and a weight-vs-tumor-volume regression\n- Identified **Capomulin** as the most effective treatment in the analysis`,
            related: ['ds-hypothesis', 'ds-dataviz', 'me-projects'],
            actions: [{ label: 'Live demo', action: 'link:https://ermiasgelaye.github.io/Matplotlib-Challenge/' }, { label: 'Code', action: 'link:https://github.com/ermiasgelaye/Matplotlib-Challenge' }]
        },
        {
            id: 'p-photo', topic: 'project', title: 'ARC-NATURE Photography web app',
            q: ['tell me about the photography site', 'does he do photography', 'photography portfolio', 'hobbies'],
            k: ['photography', 'photos', 'gallery', 'hobby', 'hobbies', 'interests', 'travel', 'arc-nature'],
            a: `Outside data work, Ermias photographs nature and travel. **ARC-NATURE Photography** is his photo platform: a fast, mobile-friendly gallery of 1,000+ photos with search and categories, a travel map of every location, licensing and print requests, and a photography assistant, built with vanilla JavaScript, Leaflet and a service worker for offline use.`,
            related: ['me-about'],
            actions: [{ label: 'Open the photography site', action: 'link:Photography/Home.html' }]
        },
        {
            id: 'me-contact', topic: 'about', title: 'Contact & social links',
            q: ['how do i contact him', 'what is his email', 'phone number', 'linkedin', 'can i hire him'],
            k: ['contact', 'email', 'phone', 'linkedin', 'github', 'reach', 'hire', 'message', 'social', 'medium'],
            a: `- 📧 **Email:** ermiasgelaye@gmail.com (usually replies within 24 hours)\n- 📍 **Location:** Toronto, ON, Canada\n- 🔗 **LinkedIn:** linkedin.com/in/egaga\n- 💻 **GitHub:** github.com/ermiasgelaye\n- 📝 **Medium:** medium.com/@ermiasgelaye\n\nOr use the contact form on this page.`,
            related: ['me-cv'],
            actions: [{ label: 'Open contact form', action: 'contact:hire' }, { label: 'LinkedIn', action: 'link:https://www.linkedin.com/in/egaga/' }]
        },
        {
            id: 'me-cv', topic: 'about', title: 'CV / résumé',
            q: ['download his cv', 'can i see his resume', 'where is the resume'],
            k: ['resume', 'cv', 'download'],
            a: `You can view or download Ermias's CV (on Google Drive) with the button below or the **Download CV** button at the top of the page.`,
            related: ['me-experience', 'me-contact'],
            actions: [{ label: 'Download CV', action: `link:${CV}` }]
        },
        {
            id: 'me-stats', topic: 'about', title: 'At a glance',
            q: ['how many years of experience', 'how many projects', 'quick facts'],
            k: ['years', 'experience years', 'how many', 'stats', 'facts', 'commits'],
            a: `At a glance: **10+ years** of experience · **3 degrees** (plus a U of T certificate) · **30 projects completed** · **950+ GitHub commits**.`,
            related: ['me-about', 'me-projects']
        }
    );
})(typeof window !== 'undefined' ? window : globalThis);
