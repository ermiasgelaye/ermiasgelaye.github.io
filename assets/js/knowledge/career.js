/* Knowledge: Ermias Gelaye Gaga — background, experience, education, skills, projects, contact.
 * Only facts shown on the portfolio page belong here. Update both together. */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];
    const CV = 'https://drive.google.com/uc?export=download&id=1c_OG7eygSeQCWAYgU_MucNsN9_LZTUtd';

    ARC.KB.push(
        {
            id: 'me-about', topic: 'about', title: 'About Ermias',
            q: ['tell me about ermias', 'who is ermias', 'what is his background', 'introduce yourself', 'summary of his profile'],
            k: ['ermias', 'about', 'background', 'profile', 'bio', 'summary', 'who'],
            a: `**Ermias Gelaye Gaga** is a **data scientist and data research analyst** based in **Toronto, Canada**, with **10+ years** of experience in fast-paced digital environments focused on data handling and analysis.\n\n- **M.S. in Data Science** — Eastern University (2024–2025)\n- **M.S. in Cognitive Science**, Cognitive Neuroscience stream — CIMeC, University of Trento, Italy (2015–2017)\n- **Data Analytics & Visualization certificate** — University of Toronto School of Continuing Studies (2019–2020)\n- **B.A. in Psychology** — Hawassa University, Ethiopia (2008–2011)\n\nHe enjoys mining, analysing and visualising heterogeneous data with research teams — and photographing nature and travel in his spare time.`,
            more: `His path runs from psychology and cognitive neuroscience into data analytics and data science. Today he works as a **Senior Analyst** (since 2021), researching collective-bargaining trends, using AI tools to extract data from bargaining documents, and building dashboards and standardised reporting methods.`,
            related: ['me-experience', 'me-education', 'me-skills', 'me-projects'],
            actions: [{ label: 'Read the About section', action: 'scroll:#about' }]
        },
        {
            id: 'me-experience', topic: 'about', title: 'Work experience',
            q: ['what is his work experience', 'where has he worked', 'what does he do now', 'current job', 'career history'],
            k: ['experience', 'work', 'job', 'career', 'senior analyst', 'research associate', 'cyber media analyst', 'role', 'position'],
            a: `**Senior Analyst** — 2021 to present\n- Researches and analyses collective-bargaining trends to inform strategic decisions\n- Implemented AI tools to extract and process data from bargaining documents, improving accuracy and efficiency\n- Designs interactive dashboards and detailed reports for internal and external audiences\n- Developed standardised methodologies for reporting key bargaining metrics\n\n**Research Associate** — 2018 to 2021\n- Researched and extracted business data to acquire new customers across industries\n- Data manipulation, transformation and cleansing; statistical reports and KPI dashboards\n\n**Cyber Media Analyst** — 2011 to 2015\n- Monitored and analysed public inquiries from news, government reports and social networks\n- Weekly reports on digital sentiment and public-opinion trends; recommendations to government agencies`,
            related: ['me-skills', 'me-education', 'me-contact'],
            actions: [{ label: 'See the timeline', action: 'scroll:#experience' }]
        },
        {
            id: 'me-education', topic: 'about', title: 'Education',
            q: ['what is his education', 'what degrees does he have', 'where did he study', 'university', 'qualifications'],
            k: ['education', 'degree', 'degrees', 'master', 'university', 'study', 'qualification', 'eastern university', 'trento', 'hawassa', 'bootcamp'],
            a: `- **Master of Science in Data Science** — Eastern University, St. Davids, Pennsylvania (2024–2025): machine learning, advanced analytics in Python, R and SQL, database management, visualization and statistical modelling.\n- **Data Analytics & Visualization bootcamp** — University of Toronto School of Continuing Studies (2019–2020): a 24-week intensive program.\n- **Master of Science in Cognitive Science**, Cognitive Neuroscience stream — CIMeC, University of Trento, Rovereto, Italy (2015–2017): research-focused.\n- **Bachelor of Arts in Psychology** — Hawassa University, Ethiopia (2008–2011).`,
            related: ['me-about', 'me-skills'],
            actions: [{ label: 'See education', action: 'scroll:#education' }]
        },
        {
            id: 'me-skills', topic: 'about', title: 'Technical skills',
            q: ['what are his technical skills', 'what programming languages does he know', 'what tools does he use', 'is he good at python', 'tech stack'],
            k: ['skills', 'technical', 'python', 'r', 'sql', 'java', 'tools', 'stack', 'languages', 'expertise', 'proficiency'],
            a: `**Programming (self-rated)**\n- **Python 97%** — Pandas, NumPy, Scikit-learn, TensorFlow\n- **SQL 97%** — database design, query optimisation, ETL\n- **R 90%** — statistical analysis, ggplot2\n- **Java 90%** — backend systems and data processing\n\n**Data science**\n- Data visualization 95% (Matplotlib, Seaborn, Plotly, Tableau, D3.js)\n- Exploratory data analysis 95%\n- Data wrangling 93% · Quantitative methods 93% · Data modelling 93%\n- Advanced data mining 90%\n\nProjects also use **Flask**, **PostgreSQL** and REST APIs.`,
            related: ['me-projects', 'ds-python', 'ds-sql'],
            actions: [{ label: 'See skills', action: 'scroll:#skills' }]
        },
        {
            id: 'me-projects', topic: 'about', title: 'Projects overview',
            q: ['show me his projects', 'what projects has he done', 'portfolio projects', 'github projects', 'best project'],
            k: ['projects', 'portfolio', 'github', 'demo', 'work samples', 'case study'],
            a: `Featured projects:\n\n1. **Google Health Search Trends** — Flask + PostgreSQL dashboard comparing Google search trends for health issues with CDC data (D3.js, Plotly).\n2. **Mental Health Risk Indicators** — population-level ML analysis of WHO and World Bank indicators with Tableau dashboards.\n3. **Global Weather Analysis** — 500+ cities from the OpenWeatherMap API: how weather changes toward the equator.\n4. **Pharmaceutical Data Analysis** — statistical comparison of drug regimens in a study of 249 mice.\n5. **ARC-NATURE Photography** — a gallery web app with 1,000+ photos, a travel map and a photo assistant.\n\nAsk about any of them for details.`,
            related: ['p-health', 'p-mental', 'p-weather', 'p-pharma'],
            actions: [{ label: 'Browse projects', action: 'scroll:#projects' }, { label: 'GitHub profile', action: 'link:https://github.com/ermiasgelaye' }]
        },
        {
            id: 'p-health', topic: 'project', title: 'Google Health Search Trends project',
            q: ['tell me about the google health search project', 'health search trends dashboard', 'cdc project'],
            k: ['google health', 'health search', 'google trends', 'cdc', 'flask', 'postgresql', 'd3', 'dashboard'],
            a: `**Google Health Search Trends Analysis** — an interactive dashboard exploring online search trends for common health issues in the US over two decades, compared with actual occurrence data from the CDC.\n\n- Collected and cleaned data from Google Trends, Kaggle and the CDC\n- Built a **PostgreSQL** database and **Flask API** backend\n- Interactive visualizations with **D3.js** and **Plotly**\n- Resulted in 15% more efficient identification of health-concern patterns`,
            related: ['me-projects', 'ds-sql', 'ds-dataviz'],
            actions: [{ label: 'Live demo', action: 'link:https://google-health-search.onrender.com/' }, { label: 'Code', action: 'link:https://github.com/ermiasgelaye/Google-Health-Search-Project' }]
        },
        {
            id: 'p-mental', topic: 'project', title: 'Mental Health Risk Indicators project',
            q: ['tell me about the mental health project', 'suicide risk indicators analysis', 'who world bank project'],
            k: ['mental health', 'suicide', 'who', 'world bank', 'tableau', 'risk indicators', 'machine learning project'],
            a: `**Mental Health Risk Indicators Analysis** — population-level analytics of mental-health and socio-economic indicators related to suicide mortality across countries, to support prevention planning.\n\n- Integrated **100,000+ aggregated records** from WHO and World Bank data\n- **Regression and tree-based models** to analyse indicator importance\n- Interactive **Tableau** dashboards showing regional variation\n- Summarised risk and protective indicators for evidence-informed prevention\n\nBuilt with Python, machine learning, Tableau and Flask.`,
            related: ['ds-tree-models', 'ds-dataviz', 'me-projects'],
            actions: [{ label: 'Live demo', action: 'link:https://mindyourhealth.onrender.com' }, { label: 'Code', action: 'link:https://github.com/ermiasgelaye/Mental-Health-Predictor' }]
        },
        {
            id: 'p-weather', topic: 'project', title: 'Global Weather Analysis project',
            q: ['tell me about the weather project', 'weather api analysis', 'latitude weather project'],
            k: ['weather', 'openweathermap', 'latitude', 'equator', 'cities', 'api project'],
            a: `**Global Weather Analysis** — how weather changes closer to the equator, using data from **500+ cities** worldwide.\n\n- Collected data from the **OpenWeatherMap API**\n- Exploratory analysis with **Pandas**\n- Visualizations with **Matplotlib** and **Seaborn** — max temperature, humidity, cloudiness and wind speed vs latitude\n- Identified key weather patterns by latitude`,
            related: ['ds-eda', 'ds-regression', 'me-projects'],
            actions: [{ label: 'Live demo', action: 'link:https://ermiasgelaye.github.io/Web-Design-Challenge/index.html' }, { label: 'Code', action: 'link:https://github.com/ermiasgelaye/python-api-challenge' }]
        },
        {
            id: 'p-pharma', topic: 'project', title: 'Pharmaceutical Data Analysis project',
            q: ['tell me about the pharmaceutical project', 'mice tumor drug analysis', 'capomulin'],
            k: ['pharmaceutical', 'mice', 'tumor', 'tumour', 'drug regimen', 'capomulin', 'scc', 'matplotlib challenge'],
            a: `**Pharmaceutical Data Analysis** — data from **249 mice** with SCC tumour growth, comparing the performance of different drug regimens.\n\n- Cleaned and processed the raw experimental data\n- Statistical analysis and hypothesis testing\n- Visualizations comparing treatment efficacy — treatment distribution, tumour-volume box plots and a weight-vs-tumour-volume regression\n- Identified **Capomulin** as the most effective treatment in the analysis`,
            related: ['ds-hypothesis', 'ds-dataviz', 'me-projects'],
            actions: [{ label: 'Live demo', action: 'link:https://ermiasgelaye.github.io/Matplotlib-Challenge/' }, { label: 'Code', action: 'link:https://github.com/ermiasgelaye/Matplotlib-Challenge' }]
        },
        {
            id: 'p-photo', topic: 'project', title: 'ARC-NATURE Photography web app',
            q: ['tell me about the photography site', 'does he do photography', 'photography portfolio', 'hobbies'],
            k: ['photography', 'photos', 'gallery', 'hobby', 'hobbies', 'interests', 'travel', 'arc-nature'],
            a: `Outside data work, Ermias photographs nature and travel. **ARC-NATURE Photography** is his photo platform: a fast, mobile-friendly gallery of 1,000+ photos with search and categories, a travel map of every location, licensing and print requests, and a photography assistant — built with vanilla JavaScript, Leaflet and a service worker for offline use.`,
            related: ['me-about'],
            actions: [{ label: 'Open the photography site', action: 'link:Photography/Home.html' }]
        },
        {
            id: 'me-contact', topic: 'about', title: 'Contact & social links',
            q: ['how do i contact him', 'what is his email', 'phone number', 'linkedin', 'can i hire him'],
            k: ['contact', 'email', 'phone', 'linkedin', 'github', 'reach', 'hire', 'message', 'social', 'medium'],
            a: `- 📧 **Email:** ermiasgelaye@gmail.com (usually replies within 24 hours)\n- 📱 **Phone:** +1 (437) 228-0708\n- 📍 **Location:** Toronto, ON, Canada\n- 🔗 **LinkedIn:** linkedin.com/in/egaga\n- 💻 **GitHub:** github.com/ermiasgelaye\n- 📝 **Medium:** medium.com/@ermiasgelaye\n\nOr use the contact form on this page.`,
            related: ['me-cv'],
            actions: [{ label: 'Open contact form', action: 'contact:hire' }, { label: 'LinkedIn', action: 'link:https://www.linkedin.com/in/egaga/' }]
        },
        {
            id: 'me-cv', topic: 'about', title: 'CV / résumé',
            q: ['download his cv', 'can i see his resume', 'where is the resume'],
            k: ['resume', 'cv', 'download'],
            a: `You can download Ermias's CV (PDF via Google Drive) with the button below or the **Download CV** button at the top of the page.`,
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
