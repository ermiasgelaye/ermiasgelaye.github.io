/* Knowledge: data science, machine learning, statistics, tools and careers (beginner → advanced). */
'use strict';
(function (root) {
    const ARC = root.ARC || (root.ARC = {});
    ARC.KB = ARC.KB || [];

    ARC.KB.push(
        /* ---------- Machine learning ---------- */
        {
            id: 'ds-ml', topic: 'ml', level: 'beginner', title: 'What is machine learning?',
            q: ['what is machine learning', 'explain machine learning', 'ml basics', 'types of machine learning'],
            k: ['machinelearning', 'ai', 'supervised', 'unsupervised', 'reinforcement', 'algorithm', 'model'],
            a: `**Machine learning** builds models that learn patterns from data to make predictions or decisions, instead of following hand-written rules.\n\n- **Supervised learning** — learn from labelled examples. *Classification* (spam or not) and *regression* (predict a price).\n- **Unsupervised learning** — find structure without labels: *clustering* (customer segments), *dimensionality reduction* (PCA).\n- **Reinforcement learning** — an agent learns by trial and reward (games, robotics).\n\nTypical workflow: define the problem → collect & clean data → explore (EDA) → engineer features → split train/validation/test → train → evaluate → deploy → monitor.`,
            more: `Common starting algorithms: linear/logistic regression (simple, interpretable baselines), decision trees, random forests and gradient boosting (strong on tabular data), k-nearest neighbours, k-means clustering, and neural networks (images, text, audio). Always start with a simple baseline — it tells you whether a complex model is actually helping.`,
            related: ['ds-overfitting', 'ds-crossval', 'ds-metrics-class', 'ds-tree-models']
        },
        {
            id: 'ds-overfitting', topic: 'ml', level: 'intermediate', title: 'Overfitting, underfitting & the bias–variance trade-off',
            q: ['what is overfitting', 'explain the bias variance tradeoff', 'how to prevent overfitting', 'underfitting vs overfitting'],
            k: ['overfitting', 'underfitting', 'bias', 'variance', 'regularization', 'generalize'],
            a: `- **Overfitting:** the model memorises noise in the training data — great training score, poor on new data (high **variance**).\n- **Underfitting:** the model is too simple to capture the pattern — poor everywhere (high **bias**).\n\n**How to reduce overfitting:**\n- More (or better) training data\n- Simpler models / fewer features\n- **Regularisation** (L1/Lasso, L2/Ridge, dropout in neural nets)\n- Limit tree depth, use ensembles\n- **Cross-validation** and early stopping\n\nDiagnose with learning curves: a big gap between training and validation error means overfitting.`,
            related: ['ds-crossval', 'ds-split-leakage', 'ds-ml']
        },
        {
            id: 'ds-crossval', topic: 'ml', level: 'intermediate', title: 'Cross-validation',
            q: ['what is cross validation', 'how does k fold work', 'why use cross validation'],
            k: ['crossvalidation', 'validation', 'folds', 'model selection', 'hyperparameter tuning'],
            a: `**k-fold cross-validation** splits the training data into *k* folds (commonly 5 or 10), trains on k–1 folds and validates on the remaining one, rotating through all folds. The average score is a more reliable estimate than a single split.\n\n- Use **stratified** k-fold for classification so class proportions stay balanced.\n- Use **time-series split** (train on past, validate on future) for temporal data — never shuffle time.\n- Tune hyperparameters inside cross-validation (e.g. \`GridSearchCV\`), then evaluate **once** on a held-out test set.`,
            related: ['ds-split-leakage', 'ds-overfitting']
        },
        {
            id: 'ds-split-leakage', topic: 'ml', level: 'intermediate', title: 'Train/test splits & data leakage',
            q: ['what is data leakage', 'how to split data for machine learning', 'train validation test split'],
            k: ['leakage', 'train test split', 'test set', 'validation set', 'holdout'],
            a: `Split data into **train** (fit the model), **validation** (tune choices) and **test** (final, untouched evaluation) — e.g. 70/15/15, or train + cross-validation + test.\n\n**Data leakage** is when information unavailable at prediction time sneaks into training, making results look unrealistically good. Common causes:\n- Scaling/imputing using statistics from the *whole* dataset (fit preprocessing on training data only — use pipelines)\n- Features derived from the target or from the future\n- Duplicate records shared between train and test\n- Random splits on time-series data`,
            related: ['ds-crossval', 'ds-feature-eng']
        },
        {
            id: 'ds-metrics-class', topic: 'ml', level: 'intermediate', title: 'Classification metrics',
            q: ['precision vs recall', 'what is f1 score', 'what is roc auc', 'how to evaluate a classifier', 'imbalanced data metrics'],
            k: ['classificationmetrics', 'accuracy', 'precision', 'recall', 'f1', 'roc', 'auc', 'imbalanced', 'confusion'],
            a: `From the **confusion matrix** (TP, FP, TN, FN):\n- **Accuracy** = correct / all — misleading with imbalanced classes.\n- **Precision** = TP / (TP + FP) — of predicted positives, how many were right? (cost of false alarms)\n- **Recall** = TP / (TP + FN) — of actual positives, how many did we catch? (cost of misses)\n- **F1** = harmonic mean of precision and recall.\n- **ROC-AUC** — ranking quality across thresholds; **PR-AUC** is more informative when positives are rare.\n\nFor imbalanced data: use precision/recall/PR-AUC, tune the decision threshold, and consider class weights or resampling.`,
            related: ['ds-metrics-reg', 'ds-crossval']
        },
        {
            id: 'ds-metrics-reg', topic: 'ml', level: 'intermediate', title: 'Regression metrics',
            q: ['mae vs rmse', 'what is r squared', 'how to evaluate a regression model'],
            k: ['mae', 'rmse', 'mse', 'r squared', 'r2', 'regression metrics', 'error'],
            a: `- **MAE** (mean absolute error) — average error in the target's units; robust to outliers.\n- **RMSE** (root mean squared error) — penalises large errors more.\n- **R²** — share of variance explained (1 = perfect, 0 = no better than predicting the mean; can be negative).\n- **MAPE** — percentage error; unstable near zero.\n\nAlways compare against a simple baseline (e.g. predicting the mean or last value) and inspect residual plots for patterns.`,
            related: ['ds-regression', 'ds-metrics-class']
        },
        {
            id: 'ds-regression', topic: 'ml', level: 'beginner', title: 'Linear & logistic regression',
            q: ['what is linear regression', 'what is logistic regression', 'difference between linear and logistic regression'],
            k: ['regression', 'linear', 'logistic', 'coefficients', 'ols', 'baseline model'],
            a: `- **Linear regression** predicts a continuous value as a weighted sum of features (y = b₀ + b₁x₁ + …). Coefficients are interpretable. Check assumptions: linearity, independent errors, constant variance, limited multicollinearity.\n- **Logistic regression** predicts the **probability** of a class using the logistic (sigmoid) function — despite the name, it's a classification model.\n\nBoth are excellent baselines. Add regularisation (Ridge/Lasso) when you have many or correlated features.`,
            related: ['ds-metrics-reg', 'ds-tree-models']
        },
        {
            id: 'ds-tree-models', topic: 'ml', level: 'intermediate', title: 'Decision trees, random forests & gradient boosting',
            q: ['what is a random forest', 'random forest vs gradient boosting', 'how do decision trees work', 'feature importance'],
            k: ['treemodels', 'decision tree', 'random forest', 'gradient boosting', 'xgboost', 'lightgbm', 'ensemble', 'feature importance'],
            a: `- **Decision tree** — splits data with if/else rules; easy to explain but overfits alone.\n- **Random forest** — many trees on bootstrapped samples and random feature subsets, averaged. Robust, little tuning.\n- **Gradient boosting** (XGBoost, LightGBM, CatBoost) — trees built sequentially, each correcting the previous errors. Often the top performer on tabular data, but needs careful tuning (learning rate, depth, number of trees).\n\n**Feature importance:** impurity-based importance can be biased; **permutation importance** or **SHAP** values give more reliable explanations.`,
            related: ['ds-overfitting', 'ds-feature-eng']
        },
        {
            id: 'ds-clustering', topic: 'ml', level: 'intermediate', title: 'Clustering (k-means & friends)',
            q: ['what is k means', 'how to choose number of clusters', 'customer segmentation'],
            k: ['clustering', 'kmeans', 'dbscan', 'hierarchical', 'segmentation', 'elbow', 'silhouette'],
            a: `**k-means** groups points into *k* clusters by minimising distance to cluster centres. Scale features first; it assumes roughly round, similar-sized clusters.\n\nChoosing *k*: the **elbow method** (inertia vs k) and the **silhouette score**, plus whether the clusters make business sense.\n\nAlternatives: **DBSCAN** (arbitrary shapes, finds outliers), **hierarchical clustering** (dendrograms), **Gaussian mixtures** (soft assignments).`,
            related: ['ds-pca', 'ds-ml']
        },
        {
            id: 'ds-pca', topic: 'ml', level: 'advanced', title: 'PCA & dimensionality reduction',
            q: ['what is pca', 'when to use dimensionality reduction', 'tsne vs pca'],
            k: ['pca', 'principal components', 'tsne', 'umap', 'dimensions'],
            a: `**PCA** finds new axes (principal components) that capture the most variance, letting you compress correlated features into fewer dimensions. Standardise features first, and check the explained-variance ratio to choose how many components to keep.\n\nUse it to reduce noise, speed up models, or visualise data in 2D. **t-SNE** and **UMAP** are better for visualising clusters but distances between clusters aren't meaningful.`,
            related: ['ds-clustering', 'ds-feature-eng']
        },
        {
            id: 'ds-feature-eng', topic: 'ml', level: 'intermediate', title: 'Feature engineering',
            q: ['what is feature engineering', 'how to encode categorical variables', 'feature scaling'],
            k: ['featureengineering', 'features', 'encoding', 'one hot', 'scaling', 'normalization', 'standardization'],
            a: `Turning raw data into informative inputs:\n- **Categorical:** one-hot encoding (few categories), target/ordinal encoding (many — beware leakage).\n- **Scaling:** standardise (z-scores) or min-max for distance-based models and neural nets; trees don't need it.\n- **Dates:** day of week, month, holidays, time since an event.\n- **Text:** TF-IDF, embeddings.\n- **Domain features:** ratios, aggregates, interactions.\n\nWrap preprocessing in a **pipeline** (e.g. scikit-learn \`Pipeline\`/\`ColumnTransformer\`) so the same steps apply in training and production.`,
            related: ['ds-missing', 'ds-split-leakage']
        },
        {
            id: 'ds-deep-learning', topic: 'ml', level: 'advanced', title: 'Deep learning basics',
            q: ['what is deep learning', 'how do neural networks work', 'tensorflow vs pytorch'],
            k: ['deeplearning', 'neural', 'tensorflow', 'pytorch', 'cnn', 'transformer', 'layers'],
            a: `**Neural networks** stack layers of weighted connections and non-linear activations, trained by **backpropagation** and gradient descent.\n\n- **CNNs** — images\n- **RNNs/LSTMs** — sequences (largely replaced by transformers)\n- **Transformers** — text and increasingly everything (the architecture behind large language models)\n\nDeep learning shines with large unstructured data (images, audio, text). For typical tabular business data, gradient-boosted trees are often as good or better. **TensorFlow/Keras** and **PyTorch** are the main frameworks.`,
            related: ['ds-nlp', 'ds-ml']
        },
        {
            id: 'ds-nlp', topic: 'ml', level: 'intermediate', title: 'Natural language processing (NLP)',
            q: ['what is nlp', 'sentiment analysis', 'how to analyze text data'],
            k: ['nlp', 'text', 'sentiment', 'tokenization', 'tfidf', 'embeddings', 'language model', 'llm'],
            a: `NLP turns text into something models can use.\n\n- **Classic pipeline:** clean → tokenise → remove stop words / lemmatise → TF-IDF features → logistic regression or similar. Fast and surprisingly strong.\n- **Modern:** pretrained **embeddings** or **transformer** models fine-tuned for classification, extraction or summarisation.\n- **Tasks:** sentiment analysis, topic modelling, named-entity recognition, document classification and information extraction.\n\nErmias's work includes sentiment analysis of digital media (2011–2015) and using AI tools to extract data from documents in his current role.`,
            related: ['ds-deep-learning', 'me-experience']
        },
        {
            id: 'ds-timeseries', topic: 'ml', level: 'advanced', title: 'Time series & forecasting',
            q: ['how to forecast time series', 'what is arima', 'seasonality and trend'],
            k: ['timeseries', 'arima', 'prophet', 'seasonality', 'trend', 'lag features'],
            a: `Time series have **trend**, **seasonality** and noise; observations aren't independent.\n\n- Start with naive baselines (last value, seasonal naive).\n- Classical models: exponential smoothing, **ARIMA/SARIMA**; tools like Prophet for business seasonality.\n- ML approach: lag and rolling-window features with gradient boosting.\n- Validate with **time-based splits** (rolling-origin), never random shuffles.`,
            related: ['ds-crossval', 'ds-metrics-reg']
        },
        {
            id: 'ds-deploy', topic: 'ml', level: 'advanced', title: 'Deploying models',
            q: ['how to deploy a machine learning model', 'flask api for a model', 'mlops'],
            k: ['deploy', 'deployment', 'flask', 'api', 'mlops', 'production', 'monitoring', 'docker'],
            a: `A common path: save the trained pipeline (e.g. \`joblib\`) → wrap it in an **API** (Flask or FastAPI) → containerise (Docker) → host it (a cloud service or platforms like Render) → **monitor** inputs and accuracy for drift → retrain on a schedule.\n\nErmias's Google Health Search and Mental Health projects use **Flask** backends with live demos.`,
            related: ['p-health', 'p-mental']
        },

        /* ---------- Statistics ---------- */
        {
            id: 'ds-hypothesis', topic: 'stats', level: 'intermediate', title: 'Hypothesis testing & p-values',
            q: ['what is a p value', 'explain hypothesis testing', 'what is statistical significance', 't test vs chi square'],
            k: ['pvalue', 'hypothesistesting', 'significance', 'null hypothesis', 'alpha', 'ttest', 'anova'],
            a: `1. State a **null hypothesis** (H₀: no effect) and alternative.\n2. Pick a test and significance level (often α = 0.05).\n3. The **p-value** is the probability of seeing data at least this extreme *if H₀ were true*. It is **not** the probability that H₀ is true.\n4. p < α → reject H₀ ("statistically significant").\n\nCommon tests: **t-test** (compare two means), **ANOVA** (several means), **chi-square** (categorical association), Mann-Whitney (non-parametric).\n\nAlways report **effect sizes and confidence intervals** too — a tiny effect can be "significant" with huge samples.`,
            related: ['ds-ci', 'ds-abtest', 'p-pharma']
        },
        {
            id: 'ds-ci', topic: 'stats', level: 'intermediate', title: 'Confidence intervals',
            q: ['what is a confidence interval', 'how to interpret a 95% confidence interval'],
            k: ['confidence interval', 'ci', 'margin of error', 'uncertainty', 'standard error'],
            a: `A **95% confidence interval** is a range built by a procedure that captures the true parameter in 95% of repeated samples. Practically, it shows the plausible range for an estimate and its **uncertainty**.\n\nIt narrows with larger samples and less variability. Report intervals alongside point estimates — "conversion rose 2.1% (95% CI 0.4% to 3.8%)" says far more than "p = 0.02".`,
            related: ['ds-hypothesis', 'ds-abtest']
        },
        {
            id: 'ds-abtest', topic: 'stats', level: 'intermediate', title: 'A/B testing',
            q: ['how to run an ab test', 'what is ab testing', 'sample size for ab test'],
            k: ['abtesting', 'experiment', 'control', 'treatment', 'sample size', 'power'],
            a: `1. Define one **primary metric** and the minimum effect worth detecting.\n2. Compute the **sample size** (power analysis, typically 80% power, α = 0.05) *before* starting.\n3. **Randomly** assign users to control and variant.\n4. Run for the planned duration (cover weekly cycles); **don't stop early** when it looks significant ("peeking").\n5. Analyse with the planned test; check guardrail metrics and segments cautiously.\n\nWatch out for novelty effects, sample-ratio mismatch and running many metrics at once (multiple comparisons).`,
            related: ['ds-hypothesis', 'ds-ci']
        },
        {
            id: 'ds-correlation', topic: 'stats', level: 'beginner', title: 'Correlation vs causation',
            q: ['correlation vs causation', 'does correlation imply causation', 'what is a confounder'],
            k: ['correlation', 'causation', 'confounder', 'causal', 'pearson', 'spearman'],
            a: `**Correlation** measures how two variables move together (Pearson for linear, Spearman for ranked/monotonic relationships). It doesn't show **causation** — a third factor (**confounder**) can drive both, the direction can be reversed, or it can be coincidence.\n\nTo argue causation: randomised experiments (A/B tests), or careful causal methods on observational data (controls, difference-in-differences, regression discontinuity, instrumental variables).`,
            related: ['ds-abtest', 'ds-hypothesis']
        },
        {
            id: 'ds-distributions', topic: 'stats', level: 'beginner', title: 'Descriptive statistics & distributions',
            q: ['mean vs median', 'what is standard deviation', 'normal distribution', 'how to handle outliers'],
            k: ['mean', 'median', 'mode', 'standard deviation', 'variance', 'normal distribution', 'outliers', 'skew', 'iqr'],
            a: `- **Mean** is sensitive to outliers; **median** is robust — prefer it for skewed data like incomes.\n- **Standard deviation** measures spread; in a normal distribution ~68% of values fall within 1 SD and ~95% within 2 SD.\n- **Outliers:** detect with the IQR rule (below Q1 − 1.5·IQR or above Q3 + 1.5·IQR) or z-scores. Investigate before removing — they may be errors *or* the most important cases.\n- Visualise distributions with histograms and box plots before modelling.`,
            related: ['ds-eda', 'ds-hypothesis']
        },

        /* ---------- Data work & tools ---------- */
        {
            id: 'ds-eda', topic: 'data', level: 'beginner', title: 'Exploratory data analysis (EDA)',
            q: ['how to do exploratory data analysis', 'eda steps', 'first steps with a new dataset'],
            k: ['eda', 'exploration', 'explore', 'profiling', 'summary statistics'],
            a: `A practical EDA checklist:\n1. **Shape & types** — \`df.shape\`, \`df.info()\`, \`df.dtypes\`\n2. **Missing values & duplicates**\n3. **Summary stats** — \`df.describe()\`, value counts for categories\n4. **Distributions** — histograms, box plots, outliers\n5. **Relationships** — correlation matrix, scatter plots, group-bys against the target\n6. **Time patterns** if dates exist\n7. **Write down questions and hypotheses** for modelling or the next analysis\n\nEDA is where most insights — and data-quality problems — are found.`,
            related: ['ds-missing', 'ds-dataviz', 'ds-python']
        },
        {
            id: 'ds-missing', topic: 'data', level: 'intermediate', title: 'Data cleaning & missing values',
            q: ['how to handle missing data', 'data cleaning steps', 'imputation methods'],
            k: ['datacleaning', 'missing', 'null', 'nan', 'imputation', 'duplicates', 'cleaning'],
            a: `First ask **why** data is missing (random, or systematically linked to something?).\n\n- **Drop** rows/columns only when little is missing or the column isn't useful.\n- **Impute:** median/mode for simple cases; group-wise imputation; model-based (KNN, iterative) for richer patterns.\n- Add a **"was missing" indicator** — missingness itself can be predictive.\n- Fit imputers on training data only (avoid leakage).\n\nOther cleaning: fix types, standardise text/categories, deduplicate, validate ranges, and document every rule.`,
            related: ['ds-eda', 'ds-split-leakage']
        },
        {
            id: 'ds-python', topic: 'tools', level: 'beginner', title: 'Python for data science',
            q: ['how to learn python for data science', 'pandas tips', 'which python libraries for data science'],
            k: ['python', 'pandas', 'numpy', 'scikit learn', 'jupyter', 'libraries', 'matplotlib', 'seaborn'],
            a: `Core stack:\n- **Pandas** — tabular data (read, clean, group, join)\n- **NumPy** — fast numerical arrays\n- **Matplotlib / Seaborn / Plotly** — visualisation\n- **Scikit-learn** — classical ML, pipelines, model selection\n- **TensorFlow / PyTorch** — deep learning\n- **Jupyter** — interactive analysis\n\nPandas habits that pay off: use vectorised operations instead of loops, \`groupby().agg()\` for summaries, \`merge\` with \`validate=\` to catch bad joins, and method chaining for readable pipelines.`,
            related: ['ds-sql', 'ds-eda', 'me-skills']
        },
        {
            id: 'ds-sql', topic: 'tools', level: 'beginner', title: 'SQL essentials',
            q: ['what sql should a data scientist know', 'explain sql joins', 'what are window functions', 'sql interview questions'],
            k: ['sql', 'joins', 'windowfunction', 'cte', 'group by', 'postgresql', 'query', 'database'],
            a: `Must-knows:\n- \`SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY\`\n- **JOINs:** INNER (matches only), LEFT (keep all left rows), FULL OUTER; watch for row duplication on one-to-many joins\n- **CTEs** (\`WITH\`) for readable multi-step queries\n- **Window functions:** \`ROW_NUMBER()\`, \`RANK()\`, \`LAG()\`, running totals with \`SUM() OVER (PARTITION BY … ORDER BY …)\`\n- \`CASE WHEN\` for conditional logic; date functions; NULL handling with \`COALESCE\`\n\nPerformance basics: filter early, index join/filter columns, and read the query plan (\`EXPLAIN\`).`,
            related: ['ds-python', 'p-health']
        },
        {
            id: 'ds-dataviz', topic: 'tools', level: 'beginner', title: 'Data visualization best practices',
            q: ['data visualization best practices', 'which chart should i use', 'how to make a good dashboard'],
            k: ['dataviz', 'chart', 'graph', 'dashboard', 'plot', 'visual', 'storytelling'],
            a: `- **Pick the chart for the question:** trend → line; compare categories → bar (sorted); distribution → histogram/box plot; relationship → scatter; part-to-whole → stacked bar (pies only for 2–3 parts).\n- **Start bar charts at zero**, label axes and units, and title charts with the *insight*, not just the variable names.\n- **Use colour purposefully** — highlight what matters, grey the rest; check colour-blind safety.\n- **Dashboards:** lead with the key metrics, allow drill-down, keep filters consistent and avoid clutter.\n\nTools Ermias uses: Matplotlib, Seaborn, Plotly, D3.js and Tableau.`,
            related: ['ds-tableau', 'ds-eda', 'p-health']
        },
        {
            id: 'ds-tableau', topic: 'tools', level: 'intermediate', title: 'Tableau',
            q: ['how to get started with tableau', 'tableau tips', 'what is an lod expression'],
            k: ['tableau', 'lod', 'calculated field', 'dashboard', 'bi'],
            a: `Getting started: connect a clean data source → build sheets (drag dimensions and measures) → combine them in a **dashboard** with filters and actions → publish.\n\nUseful skills: calculated fields, table calculations (running totals, % of total), **LOD expressions** (\`FIXED\`, \`INCLUDE\`, \`EXCLUDE\`) for aggregations at a different level of detail than the view, parameters for what-if analysis, and extracts for performance.\n\nErmias built Tableau dashboards for his Mental Health Risk Indicators project.`,
            related: ['ds-dataviz', 'p-mental']
        },
        {
            id: 'ds-ethics', topic: 'data', level: 'intermediate', title: 'Data ethics & privacy',
            q: ['data ethics', 'how to avoid bias in models', 'responsible ai', 'data privacy'],
            k: ['ethics', 'bias', 'fairness', 'privacy', 'responsible', 'anonymization', 'consent'],
            a: `- **Privacy:** collect only what's needed, anonymise or aggregate (as with population-level health data), secure access, and follow regulations such as PIPEDA (Canada) or GDPR (EU).\n- **Bias:** check whether training data under-represents groups; compare error rates across groups; avoid proxies for protected attributes.\n- **Transparency:** document data sources, assumptions and limitations; prefer explainable models in high-stakes settings.\n- **Human oversight** for decisions that affect people.`,
            related: ['p-mental', 'ds-tree-models']
        },

        /* ---------- Careers ---------- */
        {
            id: 'car-start', topic: 'career', level: 'beginner', title: 'Getting into data science',
            q: ['how do i become a data scientist', 'how to start a career in data science', 'data analyst vs data scientist', 'career advice in data science'],
            k: ['career', 'become', 'start', 'entry level', 'junior', 'transition', 'data analyst', 'data scientist'],
            a: `A realistic path:\n1. **Foundations:** statistics, SQL, Python (or R), spreadsheets.\n2. **Analyst skills:** EDA, visualisation, dashboards (Tableau/Power BI), communicating findings.\n3. **ML basics:** regression, classification, evaluation, scikit-learn.\n4. **Projects:** 3–5 end-to-end projects on real, messy data — published on GitHub with a clear README.\n5. **Domain knowledge:** your previous field is an asset (Ermias went from psychology and cognitive neuroscience into data science).\n\n**Data analysts** focus on describing and explaining data; **data scientists** add modelling and experimentation; **ML engineers** focus on production systems.`,
            related: ['car-portfolio', 'car-interview', 'me-about']
        },
        {
            id: 'car-portfolio', topic: 'career', level: 'beginner', title: 'Building a data science portfolio',
            q: ['how to build a data science portfolio', 'what projects should i build', 'portfolio tips'],
            k: ['portfolio', 'projects', 'github', 'readme', 'showcase'],
            a: `- Choose **questions you care about** with real, messy data (public APIs, government open data, Kaggle as a start).\n- Show the **whole process**: question → data collection → cleaning → analysis/model → clear conclusion.\n- Write a strong **README**: problem, data, approach, results, how to run it, and a screenshot.\n- Deploy something interactive (a dashboard or small Flask app) — it's far more memorable.\n- Quality over quantity: 3–5 polished projects beat 20 tutorial copies.\n\nThis portfolio follows that pattern: each project links to a live demo and the code.`,
            related: ['me-projects', 'car-start']
        },
        {
            id: 'car-interview', topic: 'career', level: 'intermediate', title: 'Data science interview preparation',
            q: ['how to prepare for a data science interview', 'common data science interview questions', 'technical interview tips'],
            k: ['interview', 'questions', 'preparation', 'technical', 'behavioral', 'case study'],
            a: `**Technical:** SQL (joins, window functions), statistics (p-values, confidence intervals, A/B tests), ML concepts (bias–variance, regularisation, metrics, leakage), Python/pandas exercises.\n\n**Case/product questions:** define metrics, design an experiment, size a problem, reason about trade-offs.\n\n**Projects:** be ready to walk through one project in depth — problem, data issues, choices, results and what you'd do differently.\n\n**Behavioural:** prepare STAR stories (Situation, Task, Action, Result) about challenges, collaboration and influencing decisions with data.`,
            related: ['ds-sql', 'ds-abtest', 'ds-overfitting']
        },
        {
            id: 'car-salary', topic: 'career', level: 'beginner', title: 'Salary information',
            q: ['how much do data scientists make', 'data science salary in canada', 'what salary should i ask for'],
            k: ['salary', 'pay', 'compensation', 'wage', 'income', 'earn'],
            a: `I don't keep salary figures because they change quickly and vary a lot by city, industry and seniority, and I'd rather not give you outdated numbers.\n\nReliable places to check current ranges: the **Government of Canada Job Bank** wage data (by occupation and region), **Statistics Canada**, recent job postings that list salary ranges, and salary-survey sites such as Glassdoor or Levels.fyi.`,
            related: ['car-start']
        }
    );
})(typeof window !== 'undefined' ? window : globalThis);
