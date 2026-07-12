// Domain-specific content database for InternSphere

export const domainContent = {
  'Web Development': {
    modules: [
      {
        id: 1, week: 1, duration: '6 hours', assignments: 2,
        title: 'Introduction to Web Development',
        description: 'Get started with the fundamentals of web development. Understand HTTP, DNS, servers, and build your first webpage using HTML5 and CSS3.',
        topics: ['Internet Fundamentals (HTTP, DNS, Client/Server)', 'Setting Up VS Code & Dev Tools', 'HTML5 Semantic Tags & Structure', 'CSS3 Box Model & Layouts'],
        resources: [{ title: 'MDN Web Docs - HTML', url: '#' }, { title: 'CSS Tricks - Flexbox Guide', url: '#' }]
      },
      {
        id: 2, week: 2, duration: '7 hours', assignments: 2,
        title: 'Advanced CSS & Grid Layouts',
        description: 'Master CSS Grid, keyframes animations, transitions, and modern responsive design conventions.',
        topics: ['CSS Grid Layout System', 'CSS Animations & Transitions', 'CSS Custom Variables', 'Media Queries & Mobile-First Design'],
        resources: [{ title: 'CSS Grid Garden', url: '#' }, { title: 'Animista - CSS Animations', url: '#' }]
      },
      {
        id: 3, week: 3, duration: '8 hours', assignments: 2,
        title: 'JavaScript DOM Manipulation',
        description: 'Learn core JavaScript syntax, functions, object parameters, and DOM click handlers.',
        topics: ['Variables & Basic Operators', 'Conditional logic & Loops', 'DOM Selectors & Event Handlers', 'Arrays & Objects methods'],
        resources: [{ title: 'JavaScript.info', url: '#' }, { title: 'Eloquent JavaScript Book', url: '#' }]
      },
      {
        id: 4, week: 4, duration: '8 hours', assignments: 2,
        title: 'Async JS & Web APIs',
        description: 'Explore modern ES6 JavaScript updates, fetch requests, promises, and async/await models.',
        topics: ['Arrow Functions & Destructuring', 'Promises & Async/Await', 'Fetch API & JSON handling', 'Working with weather APIs'],
        resources: [{ title: 'Async JavaScript Guide', url: '#' }, { title: 'Fetch API Documentation', url: '#' }]
      },
      {
        id: 5, week: 5, duration: '9 hours', assignments: 2,
        title: 'React Core Concepts',
        description: 'Learn component-driven engineering using React, props, useState, and conditional renderings.',
        topics: ['React Component Lifecycle', 'JSX & Virtual DOM', 'State & Props mapping', 'Component styling approaches'],
        resources: [{ title: 'React Official Documentation', url: '#' }, { title: 'Vite React Starter Guide', url: '#' }]
      },
      {
        id: 6, week: 6, duration: '9 hours', assignments: 2,
        title: 'React Hooks & State',
        description: 'Master state hooks, side effects, Context API, and modular React Router navigation.',
        topics: ['useEffect side effects', 'Context API & useContext', 'Custom React hooks', 'React Router configurations'],
        resources: [{ title: 'React Hooks API Cheat Sheet', url: '#' }, { title: 'React Router Tutorial', url: '#' }]
      },
      {
        id: 7, week: 7, duration: '10 hours', assignments: 2,
        title: 'Backend Express REST APIs',
        description: 'Introduction to server-side code. Learn Express routing, custom middleware, and REST designs.',
        topics: ['Node.js fundamentals & NPM packages', 'Express routing & requests', 'Custom middleware creation', 'Postman API testing'],
        resources: [{ title: 'Express.js Getting Started', url: '#' }, { title: 'REST API Best Practices', url: '#' }]
      },
      {
        id: 8, week: 8, duration: '10 hours', assignments: 2,
        title: 'Database integration & Cloud Deployments',
        description: 'Connect databases, write CRUD queries, set environment values, and deploy apps.',
        topics: ['MongoDB & Mongoose schemas', 'CRUD operations with db', 'JWT authentication tokens', 'Deploying on Vercel & Render'],
        resources: [{ title: 'Mongoose Schemas Guide', url: '#' }, { title: 'Deployment Checklists', url: '#' }]
      }
    ],
    assignments: [
      { id: 1, week: 1, title: 'Build a Personal Portfolio Layout', description: 'Create a responsive personal portfolio using semantic HTML5 and CSS Flexbox.', dueDate: '2026-06-10', status: 'graded', marks: 92, totalMarks: 100, feedback: 'Excellent layout structure.' },
      { id: 2, week: 2, title: 'Responsive CSS Grid Gallery', description: 'Build an image gallery utilizing CSS grid and hover transitions.', dueDate: '2026-06-14', status: 'graded', marks: 88, totalMarks: 100, feedback: 'Beautiful grid implementation.' },
      { id: 3, week: 3, title: 'JavaScript Calculator Application', description: 'Build a functional browser calculator using event listeners.', dueDate: '2026-06-18', status: 'graded', marks: 95, totalMarks: 100, feedback: 'Clean JS handlers!' },
      { id: 4, week: 4, title: 'Fetch API Weather Dashboard', description: 'Create an app that queries weather API data and lists forecasts.', dueDate: '2026-06-22', status: 'graded', marks: 85, totalMarks: 100, feedback: 'Great job handling async fetch responses.' },
      { id: 5, week: 5, title: 'React To-Do Task Manager', description: 'Build a stateful to-do list using React props and useState hooks.', dueDate: '2026-06-26', status: 'graded', marks: 90, totalMarks: 100, feedback: 'Great component layout.' },
      { id: 6, week: 6, title: 'React Router Multi-Page Shop', description: 'Develop a routing-based e-commerce product page template.', dueDate: '2026-07-02', status: 'graded', marks: 87, totalMarks: 100, feedback: 'Good context structure.' },
      { id: 7, week: 7, title: 'Express API Server CRUD operations', description: 'Build an Express API endpoint group supporting blog CRUD operations.', dueDate: '2026-07-14', status: 'pending', marks: null, totalMarks: 100, feedback: null },
      { id: 8, week: 8, title: 'Fullstack Blog Application Deployment', description: 'Connect Express server to database, support user accounts, and deploy online.', dueDate: '2026-07-22', status: 'pending', marks: null, totalMarks: 100, feedback: null }
    ],
    assessments: [
      { id: 1, title: 'HTML & CSS Fundamentals', topic: 'Semantic tags, Flexbox layouts', questionsCount: 15, timeLimit: 20, score: 93, status: 'completed' },
      { id: 2, title: 'JavaScript DOM Handlers', topic: 'Select arrays, event listeners', questionsCount: 15, timeLimit: 20, score: 86, status: 'completed' },
      { id: 3, title: 'React States & Props mapping', topic: 'useState hooks, components rendering', questionsCount: 15, timeLimit: 20, score: 88, status: 'completed' },
      { id: 4, title: 'Express.js Routing Server', topic: 'JSON endpoints, REST methods', questionsCount: 15, timeLimit: 25, score: null, status: 'pending' },
      { id: 5, title: 'Mongoose Schemas & MongoDB', topic: 'Queries, schema validations', questionsCount: 10, timeLimit: 15, score: null, status: 'locked' }
    ]
  },
  'Data Science': {
    modules: [
      {
        id: 1, week: 1, duration: '6 hours', assignments: 2,
        title: 'Python for Data Analysis',
        description: 'Get started with Python syntax, lists, loops, dictionaries, and write clean pythonic scripts.',
        topics: ['Python Data Types & Loops', 'Writing custom python functions', 'List comprehensions', 'Working with files and directories'],
        resources: [{ title: 'Python Docs for Beginners', url: '#' }, { title: 'Google Python Class', url: '#' }]
      },
      {
        id: 2, week: 2, duration: '7 hours', assignments: 2,
        title: 'Data Operations with NumPy & Pandas',
        description: 'Master Pandas DataFrames, index values, missing row operations, and multi-dimensional matrices.',
        topics: ['NumPy array operations', 'Pandas DataFrame data loading', 'Filtering, grouping, and merging data', 'Handling empty rows & null elements'],
        resources: [{ title: 'Pandas User Guide', url: '#' }, { title: 'NumPy Cheat Sheet', url: '#' }]
      },
      {
        id: 3, week: 3, duration: '8 hours', assignments: 2,
        title: 'Data Visualizations & Plots',
        description: 'Learn matplotlib and seaborn plotting. Build histograms, box plots, scatter plots, and correlation heatmaps.',
        topics: ['Matplotlib bar/line charts', 'Seaborn heatmaps and scatterplots', 'Customizing axes, labels, and legends', 'Exploratory Data Analysis (EDA)'],
        resources: [{ title: 'Matplotlib Gallery', url: '#' }, { title: 'Seaborn Documentation', url: '#' }]
      },
      {
        id: 4, week: 4, duration: '8 hours', assignments: 2,
        title: 'Data Wrangling & Cleaning',
        description: 'Learn robust data preparation approaches, string cleaning, date parsing, and outlier detection.',
        topics: ['String operations in Pandas', 'DateTime data parsing', 'Removing statistical outliers', 'Scaling and normalizing attributes'],
        resources: [{ title: 'Kaggle Data Cleaning Course', url: '#' }]
      },
      {
        id: 5, week: 5, duration: '9 hours', assignments: 2,
        title: 'Introduction to SQL Databases',
        description: 'Learn SQL select, where, join, group by queries to fetch information from relational databases.',
        topics: ['SQL syntax and selectors', 'Inner, Left, and Outer joins', 'Group by aggregates', 'Subqueries & nested operations'],
        resources: [{ title: 'SQLZoo Tutorial', url: '#' }]
      },
      {
        id: 6, week: 6, duration: '9 hours', assignments: 2,
        title: 'Exploratory Data Projects',
        description: 'Build complete EDA pipelines, document correlations, and prepare insights decks.',
        topics: ['Formulating statistical questions', 'Summarizing datasets with pandas', 'Interactive plots in notebooks', 'Designing presentations'],
        resources: [{ title: 'EDA Case Studies', url: '#' }]
      },
      {
        id: 7, week: 7, duration: '10 hours', assignments: 2,
        title: 'Machine Learning Models Basics',
        description: 'Dive into Linear and Logistic Regression using Scikit-Learn. Learn train/test splitting.',
        topics: ['Supervised Learning overview', 'Linear regression calculations', 'Train-Test validation splits', 'Scikit-Learn model selectors'],
        resources: [{ title: 'Scikit-Learn Regression Guide', url: '#' }]
      },
      {
        id: 8, week: 8, duration: '10 hours', assignments: 2,
        title: 'Model Evaluation & Tuning',
        description: 'Evaluate models with confusion matrices, RMSE metrics, precision/recall, and hyperparameter grids.',
        topics: ['Confusion Matrix metrics', 'R-squared & RMSE indicators', 'GridSearch cross validation', 'Deploying models in Python files'],
        resources: [{ title: 'Scikit-Learn Model Evaluation', url: '#' }]
      }
    ],
    assignments: [
      { id: 1, week: 1, title: 'Python Basics Scripts', description: 'Write Python functions to calculate stats, find unique elements, and handle files.', dueDate: '2026-06-10', status: 'graded', marks: 95, totalMarks: 100, feedback: 'Excellent script coding.' },
      { id: 2, week: 2, title: 'Pandas Employee Log Analysis', description: 'Clean a csv log, calculate average payouts, and filter rows in Pandas.', dueDate: '2026-06-14', status: 'graded', marks: 90, totalMarks: 100, feedback: 'Great filtering scripts.' },
      { id: 3, week: 3, title: 'EDA Plotting Showcase', description: 'Generate 5 scatter and box plots detailing tips and house pricing correlations.', dueDate: '2026-06-18', status: 'graded', marks: 88, totalMarks: 100, feedback: 'Beautiful graphs mapping!' },
      { id: 4, week: 4, title: 'Data Cleaning Pipeline', description: 'Wrangle a dirty dataset, resolve duplicates, and parse messy dates.', dueDate: '2026-06-22', status: 'graded', marks: 87, totalMarks: 100, feedback: 'Clean parsing pipeline.' },
      { id: 5, week: 5, title: 'SQL Aggregate Joins', description: 'Write SQL queries to join orders and users logs, return sums per user.', dueDate: '2026-06-26', status: 'graded', marks: 92, totalMarks: 100, feedback: 'All queries correct.' },
      { id: 6, week: 6, title: 'EDA Notebook Capstone Proposal', description: 'Formulate correlation hypotheses on dataset and present summary graphs.', dueDate: '2026-07-02', status: 'graded', marks: 94, totalMarks: 100, feedback: 'Outstanding slides and charts.' },
      { id: 7, week: 7, title: 'Scikit-Learn Housing Regression', description: 'Train a linear model predicting house pricing from numeric features.', dueDate: '2026-07-14', status: 'pending', marks: null, totalMarks: 100, feedback: null },
      { id: 8, week: 8, title: 'Model Optimization & Test Splits', description: 'Fine-tune model hyperparameters using GridSearch CV and write final logs.', dueDate: '2026-07-22', status: 'pending', marks: null, totalMarks: 100, feedback: null }
    ],
    assessments: [
      { id: 1, title: 'Python Syntax & Operators', topic: 'Loops, lists, variables', questionsCount: 15, timeLimit: 20, score: 90, status: 'completed' },
      { id: 2, title: 'Pandas & NumPy Arrays', topic: 'Groupby, joins, filters', questionsCount: 15, timeLimit: 20, score: 85, status: 'completed' },
      { id: 3, title: 'Data Plots & Heatmaps', topic: 'Seaborn layouts, scatter plots', questionsCount: 15, timeLimit: 20, score: 92, status: 'completed' },
      { id: 4, title: 'SQL Joins & Select Queries', topic: 'Queries tables, aggregates', questionsCount: 15, timeLimit: 25, score: null, status: 'pending' },
      { id: 5, title: 'Linear Regression Basics', topic: 'Splits, fitting, error evaluation', questionsCount: 10, timeLimit: 15, score: null, status: 'locked' }
    ]
  },
  'UI/UX Design': {
    modules: [
      {
        id: 1, week: 1, duration: '6 hours', assignments: 2,
        title: 'Design Thinking & UX Basics',
        description: 'Understand user research, user personas, journey mapping, and the core stages of Design Thinking.',
        topics: ['Introduction to UX & Design Principles', 'Conducting User Research & Interviews', 'Empathy Maps & User Personas', 'User Journey Mapping'],
        resources: [{ title: 'Interaction Design Foundation - UX', url: '#' }]
      },
      {
        id: 2, week: 2, duration: '7 hours', assignments: 2,
        title: 'Information Architecture & Wireframing',
        description: 'Master sitemaps, user flow diagrams, and design low-fidelity paper and digital wireframes.',
        topics: ['Sitemaps & Card Sorting', 'Creating User Flows', 'Lo-Fi Wireframing on Paper', 'Digital Lo-Fi in Figma'],
        resources: [{ title: 'Figma wireframing basics', url: '#' }]
      },
      {
        id: 3, week: 3, duration: '8 hours', assignments: 2,
        title: 'Figma Grids & Typography',
        description: 'Learn layout grids, sizing structures, type hierarchies, and contrast guidelines in Figma.',
        topics: ['8px Grid Systems', 'Type scale & hierarchies', 'Choosing color palettes', 'Web accessibility contrast ratios'],
        resources: [{ title: 'Figma Grid Systems guide', url: '#' }]
      },
      {
        id: 4, week: 4, duration: '8 hours', assignments: 2,
        title: 'Interactive Prototyping',
        description: 'Connect screens, configure transition curves, smart animate layers, and test user inputs.',
        topics: ['Connecting pages in Figma', 'Configuring transitions & easing', 'Smart Animate options', 'Building interactive menus'],
        resources: [{ title: 'Figma Prototype guides', url: '#' }]
      },
      {
        id: 5, week: 5, duration: '9 hours', assignments: 2,
        title: 'Design Systems & UI Components',
        description: 'Create reusable button variants, form inputs, navigation bars, and manage global styles.',
        topics: ['Figma Components & Variants', 'Auto-Layout constraints', 'Establishing typography/color styles', 'Designing UI patterns'],
        resources: [{ title: 'Designing Systems - Figma', url: '#' }]
      },
      {
        id: 6, week: 6, duration: '9 hours', assignments: 2,
        title: 'Usability Testing & Feedbacks',
        description: 'Plan testing prompts, record click failures, map user reactions, and document iterations.',
        topics: ['Usability testing protocols', 'A/B testing guidelines', 'Interpreting test feedbacks', 'UX audit checklists'],
        resources: [{ title: 'Nielsen Norman Usability testing', url: '#' }]
      },
      {
        id: 7, week: 7, duration: '10 hours', assignments: 2,
        title: 'Mobile UI Patterns',
        description: 'Examine iOS Human Interface Guidelines and Android Material Design cards. Design mobile apps.',
        topics: ['iOS Human Interface Guidelines', 'Material Design specifications', 'Mobile gesture patterns', 'Responsive app layouts'],
        resources: [{ title: 'Material Design Guidelines', url: '#' }]
      },
      {
        id: 8, week: 8, duration: '10 hours', assignments: 2,
        title: 'Portfolio & Developer Hand-off',
        description: 'Compile case study documentation, export inspect logs for developers, and build portfolios.',
        topics: ['Structuring a UX case study', 'Figma developer inspect inspect tools', 'Exporting assets & redlines', 'Publishing design portfolios'],
        resources: [{ title: 'Best Design Portfolios tips', url: '#' }]
      }
    ],
    assignments: [
      { id: 1, week: 1, title: 'User Persona & Journey Map', description: 'Create 2 detailed user personas and journey maps for a food delivery application.', dueDate: '2026-06-10', status: 'graded', marks: 94, totalMarks: 100, feedback: 'Personas are detailed.' },
      { id: 2, week: 2, title: 'Paper Wireframe sketches', description: 'Sketch 5 low-fidelity paper wireframes showing order flows.', dueDate: '2026-06-14', status: 'graded', marks: 87, totalMarks: 100, feedback: 'Nice layout concepts.' },
      { id: 3, week: 3, title: 'Figma Grids UI layout', description: 'Design landing page hero sections aligning elements on an 8px grid.', dueDate: '2026-06-18', status: 'graded', marks: 90, totalMarks: 100, feedback: 'Perfect grid alignment!' },
      { id: 4, week: 4, title: 'Interactive Smart Prototype', description: 'Connect shopping card screens with sliding menu transitions.', dueDate: '2026-06-22', status: 'graded', marks: 88, totalMarks: 100, feedback: 'Smooth transitions.' },
      { id: 5, week: 5, title: 'Figma Reusable Library', description: 'Build auto-layout button components supporting primary, hover, and disabled states.', dueDate: '2026-06-26', status: 'graded', marks: 91, totalMarks: 100, feedback: 'Great variant mapping.' },
      { id: 6, week: 6, title: 'UX Usability Audit', description: 'Run test on Order flow with 2 users, report click speed bottlenecks.', dueDate: '2026-07-02', status: 'graded', marks: 89, totalMarks: 100, feedback: 'Valuable user insights.' },
      { id: 7, week: 7, title: 'Material Mobile App screens', description: 'Design 3 mobile screens adopting Android bottom navigation systems.', dueDate: '2026-07-14', status: 'pending', marks: null, totalMarks: 100, feedback: null },
      { id: 8, week: 8, title: 'UX Case Study Draft', description: 'Structure complete case study from research to high-fidelity designs.', dueDate: '2026-07-22', status: 'pending', marks: null, totalMarks: 100, feedback: null }
    ],
    assessments: [
      { id: 1, title: 'Design Thinking Phases', topic: 'Empathy, define, ideate, test', questionsCount: 10, timeLimit: 15, score: 92, status: 'completed' },
      { id: 2, title: 'Information Architecture', topic: 'Sitemaps, card sorting, wireframes', questionsCount: 10, timeLimit: 15, score: 88, status: 'completed' },
      { id: 3, title: 'Auto-Layout & Variants', topic: 'Auto-layout constraints, styles', questionsCount: 10, timeLimit: 15, score: 95, status: 'completed' },
      { id: 4, title: 'Mobile Navigation Patterns', topic: 'iOS vs Material conventions', questionsCount: 10, timeLimit: 15, score: null, status: 'pending' },
      { id: 5, title: 'Usability & A/B testing', topic: 'User research, testing', questionsCount: 10, timeLimit: 15, score: null, status: 'locked' }
    ]
  }
};
