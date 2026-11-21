/* Knowledge: Pharmaceutical Data Analysis project. Population numbers are computed from
 * Resources/mouse_metadata.csv; treatment results come from the original analysis figures. */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];
    ARC.KB.push(
        { id: 'ph-overview', topic: 'project', title: 'About this pharmaceutical project',
          q: ['what is this project about', 'what was the main finding of this study', 'summary of the pharmaceutical analysis'],
          k: ['project', 'study', 'summary', 'overview', 'finding', 'scc', 'tumour', 'tumor'],
          a: `An analysis of an animal study of **squamous cell carcinoma (SCC)**: **249 mice** received one of **10 drug regimens** (including a placebo) and tumour volume was tracked over 45 days.\n\n**Main findings:**\n- **Capomulin** and **Ramicane** produced the smallest final tumour volumes of the four regimens compared.\n- For Capomulin, **mouse weight strongly predicts average tumour volume** (R² ≈ 0.70).\n- The sexes are balanced (124 female, 125 male).\n\nCaveat: Capomulin and Ramicane mice were also lighter at baseline — see "baseline weight".`,
          related: ['ph-best', 'ph-weight', 'ph-confounder'] },
        { id: 'ph-design', topic: 'project', title: 'Study design & population',
          q: ['which treatments were compared', 'how many mice per treatment', 'what drugs were tested', 'how many mice were in the study'],
          k: ['treatments', 'regimens', 'drugs', 'mice', 'population', 'placebo', 'design', 'capomulin', 'ramicane', 'infubinol', 'ceftamin'],
          a: `**249 mice**, about **25 per regimen** (Stelasyn has 24):\nCapomulin, Ramicane, Infubinol, Ceftamin, Ketapril, Naftisol, Propriva, Stelasyn, Zoniferol and Placebo.\n\nMice are 1–24 months old (mean 12.7) and weigh 15–30 g (mean 26.1 g).`,
          related: ['ph-measurements', 'ph-sex'], actions: [{ label: 'Browse the data', action: 'link:data.html' }] },
        { id: 'ph-measurements', topic: 'project', title: 'Measurements per regimen',
          q: ['why does capomulin have 230', 'number of measurements per drug', 'which drug has the fewest measurements'],
          k: ['measurements', 'timepoints', '230', 'propriva', 'bar chart', 'count', 'fewest'],
          a: `The bar chart counts **measurements** (tumour readings over time), not mice: **Capomulin has the most (230)**, Ramicane is close behind (about 228) and **Propriva has the fewest (about 160)**. Every regimen started with about 25 mice; regimens with more measurements kept more mice in the study for longer.\n\nOne mouse (g989) had duplicated timepoint records and was excluded from the treatment analysis, leaving 248 mice.`,
          related: ['ph-design'] },
        { id: 'ph-best', topic: 'project', title: 'Which treatment worked best?',
          q: ['which drug was most effective', 'best treatment', 'capomulin vs ramicane', 'final tumour volume'],
          k: ['best', 'effective', 'efficacy', 'final tumour volume', 'box plot', 'capomulin', 'ramicane'],
          a: `Comparing final tumour volume across Capomulin, Ramicane, Infubinol and Ceftamin (box plot), **Capomulin and Ramicane** had the smallest tumours at the end of the study — medians about 36–38 mm³ versus about 60 mm³ for Infubinol and Ceftamin. Infubinol shows one low outlier.\n\nThis is a descriptive comparison; see the baseline-weight caveat before treating it as purely a drug effect.`,
          related: ['ph-confounder', 'ph-weight'] },
        { id: 'ph-weight', topic: 'project', title: 'Weight vs. tumour volume (regression)',
          q: ['how does weight affect tumour volume', 'what is the r squared', 'regression result'],
          k: ['weight', 'regression', 'r squared', 'correlation', 'tumour volume', 'tumor volume', 'line'],
          a: `For mice on **Capomulin**, average tumour volume rises with body weight. The fitted line is **y ≈ 0.95x + 21.55** (about +0.95 mm³ per gram), with **R² ≈ 0.70** — weight explains about 70% of the variation in average tumour volume.`,
          related: ['ph-confounder'] },
        { id: 'ph-confounder', topic: 'project', title: 'Baseline weight caveat',
          q: ['are the results confounded', 'were the groups comparable', 'baseline weight', 'is the comparison fair'],
          k: ['confounder', 'confounding', 'baseline', 'caveat', 'limitation', 'weight', 'bias', 'fair'],
          a: `Mice on **Capomulin and Ramicane were lighter at baseline** — about **20 g on average**, versus **27–28 g** for every other regimen. Because weight is strongly related to tumour volume (R² ≈ 0.70), part of their smaller tumours may reflect body weight rather than the drug alone.\n\nA fairer comparison would adjust for weight (e.g. regression with weight as a covariate) or compare change in tumour volume from baseline.`,
          related: ['ph-best', 'ph-weight'] },
        { id: 'ph-sex', topic: 'project', title: 'Male vs. female mice',
          q: ['how many male vs female mice', 'gender distribution', 'sex split'],
          k: ['male', 'female', 'sex', 'gender', 'pie chart'],
          a: `The study is balanced: **124 female** and **125 male** mice (≈50/50), so sex is unlikely to bias the overall comparison.`,
          related: ['ph-design'] },
        { id: 'ph-method', topic: 'project', title: 'Methodology',
          q: ['what statistical methods were used', 'how was the data visualized', 'how was the analysis done'],
          k: ['method', 'methodology', 'pandas', 'matplotlib', 'groupby', 'outliers', 'iqr', 'statistics'],
          a: `1. **Clean** the study data with Pandas and remove the mouse with duplicated timepoint records.\n2. **Aggregate** with Pandas \`groupby\` operations (e.g. measurements per regimen).\n3. **Visualise** with Matplotlib: measurements per regimen (bar), sex split (pie), final tumour volume for four regimens (box plot, with outliers beyond 1.5×IQR shown as points) and weight vs. average tumour volume.\n4. **Quantify** the weight–volume relationship with a linear regression (R² ≈ 0.70).`,
          related: ['ph-best', 'ph-weight'] },
        { id: 'ph-code', topic: 'project', title: 'Source code',
          q: ['where is the code', 'github repository'],
          k: ['code', 'github', 'source', 'repository', 'notebook'],
          a: `The analysis notebook is on GitHub: **github.com/ermiasgelaye/Matplotlib-Challenge**.`,
          actions: [{ label: 'View code on GitHub', action: 'link:https://github.com/ermiasgelaye/Matplotlib-Challenge' }] }
    );
})(typeof window !== 'undefined' ? window : globalThis);
