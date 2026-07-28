export const questionBank = {
  "Web Development - React Fundamentals": [
    {
      questionText: "What is the primary purpose of React Virtual DOM?",
      options: [
        "To directly manipulate browser DOM for every state change without caching",
        "To create an in-memory representation of DOM and minimize costly real DOM updates via diffing",
        "To replace HTML completely with proprietary binary formats",
        "To serve CSS stylesheets dynamically over WebSockets"
      ],
      correctAnswer: 1
    },
    {
      questionText: "Which React hook should be used to synchronize a component with an external system or API?",
      options: [
        "useState",
        "useMemo",
        "useEffect",
        "useCallback"
      ],
      correctAnswer: 2
    },
    {
      questionText: "What is the correct rule regarding calling React Hooks?",
      options: [
        "Hooks can be called inside loops, conditions, or nested functions freely",
        "Hooks must only be called at the top level of functional components or custom hooks",
        "Hooks can only be used inside class components' constructor methods",
        "Hooks must be invoked asynchronously using async/await syntax"
      ],
      correctAnswer: 1
    },
    {
      questionText: "How does unidirectional data flow work in React?",
      options: [
        "Child components automatically overwrite parent component state directly",
        "Data flows from parent to child via props, and children communicate back via callback functions",
        "All components share a single global mutable variable without props",
        "Data is transferred bidirectionally via HTML form submissions only"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the purpose of the 'key' prop when rendering lists in React?",
      options: [
        "To encrypt list items for SSL security during rendering",
        "To help React identify which items have changed, are added, or are removed for efficient re-rendering",
        "To define CSS animation durations for list items",
        "To bind inline click event listeners automatically"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the difference between controlled and uncontrolled components in React forms?",
      options: [
        "Controlled components manage form data via React state, whereas uncontrolled components rely on DOM refs",
        "Controlled components cannot have validation rules, while uncontrolled components validate automatically",
        "Controlled components only work with Redux, whereas uncontrolled work with React Context",
        "There is no difference; the terms are synonymous in React 18+"
      ],
      correctAnswer: 0
    },
    {
      questionText: "When should you use useMemo in a React component?",
      options: [
        "To cache the result of an expensive calculation between re-renders",
        "To fetch API data on initial component mount",
        "To force a component to re-render continuously in a loop",
        "To store sensitive user authentication passwords securely in memory"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is React Context primarily designed to solve?",
      options: [
        "Prop drilling across deep component trees without passing props manually at every level",
        "Database indexing and SQL query optimization",
        "Compressing JavaScript bundle sizes during production builds",
        "Managing server-side HTTP routing and middleware execution"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What does the useRef hook return?",
      options: [
        "A boolean indicating if the component is currently mounted in the DOM",
        "An mutable object with a .current property that persists across re-renders without triggering re-renders",
        "A callback function that automatically triggers CSS animations",
        "A promise that resolves when all child components finish rendering"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is React Suspense used for?",
      options: [
        "To pause JavaScript execution until the user moves their mouse over the component",
        "To declaratively specify a loading fallback (like a spinner) while child components wait for asynchronous data or lazy-loaded code",
        "To prevent hackers from inspecting React component hierarchies in browser DevTools",
        "To automatically log console errors when props type-checking fails"
      ],
      correctAnswer: 1
    }
  ],
  "Web Development - Node.js & Express REST APIs": [
    {
      questionText: "What is the core architectural model of Node.js?",
      options: [
        "Multi-threaded synchronous blocking I/O model",
        "Single-threaded event loop with non-blocking asynchronous I/O",
        "Distributed multi-process grid computing without event loops",
        "Strictly procedural sequential execution without callbacks or promises"
      ],
      correctAnswer: 1
    },
    {
      questionText: "In Express.js, what is middleware?",
      options: [
        "A hardware router that connects client computers to database servers",
        "A function that has access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle",
        "An external SQL database driver for managing schemas",
        "A frontend styling engine for compiling CSS syntax"
      ],
      correctAnswer: 1
    },
    {
      questionText: "Which HTTP method is idempotent and typically used to replace an existing resource completely?",
      options: [
        "POST",
        "PUT",
        "PATCH",
        "CONNECT"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the primary role of package.json in a Node.js project?",
      options: [
        "To store binary database records and user session cookies",
        "To record project metadata, script commands, and manage dependencies and their version ranges",
        "To compile TypeScript files into machine code automatically on startup",
        "To configure SSL certificates and DNS routing tables for the server"
      ],
      correctAnswer: 1
    },
    {
      questionText: "How do you handle uncaught exceptions or unhandled promise rejections gracefully in Node.js?",
      options: [
        "By ignoring them; Node.js automatically recovers without crashing",
        "By listening to process events like 'uncaughtException' and 'unhandledRejection', logging errors, and initiating a graceful shutdown",
        "By setting the environment variable IGNORE_ERRORS=true in .env",
        "By wrapping the entire server startup script inside an inline CSS style block"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is JSON Web Token (JWT) commonly used for in Node.js REST APIs?",
      options: [
        "Compressing image assets before sending them over network sockets",
        "Stateless authentication and secure transmission of claims between client and server",
        "Formatting HTML tables for frontend email templates",
        "Encrypting entire database hard drives automatically"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the purpose of CORS (Cross-Origin Resource Sharing) middleware in Express?",
      options: [
        "To prevent SQL injection attacks in PostgreSQL databases",
        "To allow or restrict requested resources on a web server depending on where the HTTP request was initiated",
        "To convert XML payloads into JSON format automatically",
        "To balance incoming TCP traffic across multiple CPU cores"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the difference between req.params and req.query in Express.js?",
      options: [
        "req.params captures route path segments (e.g., /users/:id), while req.query captures URL query string parameters (e.g., ?sort=asc)",
        "req.params is for POST body JSON data, while req.query is for HTTP request headers",
        "req.params is only available in production mode, while req.query is for local development only",
        "There is no difference; both return identical JavaScript objects in Express"
      ],
      correctAnswer: 0
    },
    {
      questionText: "Which Node.js core module provides utilities for working with file and directory paths?",
      options: [
        "fs",
        "http",
        "path",
        "crypto"
      ],
      correctAnswer: 2
    },
    {
      questionText: "What is the recommended way to prevent SQL injection in Node.js database applications?",
      options: [
        "Concatenating raw user input strings directly into SQL queries",
        "Using parameterized queries or prepared statements provided by ORMs and database drivers",
        "Disabling all database read permissions for web users",
        "Converting all strings to lowercase before executing queries"
      ],
      correctAnswer: 1
    }
  ],
  "JavaScript & ES6+ Mastery": [
    {
      questionText: "What is the difference between 'let', 'const', and 'var' in JavaScript?",
      options: [
        "var is block-scoped, while let and const are function-scoped",
        "let and const are block-scoped and cannot be redeclared in the same scope, whereas var is function-scoped and hoisted with undefined",
        "const can be reassigned freely, while let is immutable after initialization",
        "var is used exclusively for numbers, while let is used for strings and objects"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What does the JavaScript event delegation pattern rely on?",
      options: [
        "Event bubbling up the DOM tree from target element to ancestors",
        "WebSockets transmitting click events to backend servers",
        "Disabling all JavaScript event listeners on parent elements",
        "Running multiple web workers simultaneously in background threads"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is a JavaScript Closure?",
      options: [
        "A CSS syntax rule for closing HTML tags properly",
        "A function bundled together with references to its surrounding lexical state (lexical environment), allowing access to outer scope variables even after outer function execution finishes",
        "A built-in method for closing database connections automatically",
        "An error thrown when infinite recursion overflows the call stack"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What will be the output of: console.log(typeof null)?",
      options: [
        "'null'",
        "'undefined'",
        "'object'",
        "'string'"
      ],
      correctAnswer: 2
    },
    {
      questionText: "What is the purpose of Promise.all() in asynchronous JavaScript?",
      options: [
        "To execute promises sequentially one after another with delays",
        "To take an iterable of promises and return a single Promise that resolves when all input promises resolve (or rejects immediately if any promise rejects)",
        "To cancel running network requests if they take longer than 5 seconds",
        "To convert synchronous while-loops into asynchronous callbacks"
      ],
      correctAnswer: 1
    },
    {
      questionText: "How does the 'this' keyword behave differently in ES6 arrow functions compared to traditional regular functions?",
      options: [
        "Arrow functions bind 'this' dynamically based on how they are called at runtime",
        "Arrow functions do not have their own 'this' binding; they inherit 'this' lexically from the enclosing scope",
        "Arrow functions always set 'this' to window or global object regardless of scope",
        "Arrow functions throw a syntax error whenever 'this' is referenced inside them"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the purpose of destructuring assignment in ES6?",
      options: [
        "To delete properties from objects permanently to save memory",
        "To unpack values from arrays or properties from objects into distinct variables using concise syntax",
        "To convert JSON strings into binary arrays",
        "To prevent developers from accessing object properties directly"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the difference between == and === operators in JavaScript?",
      options: [
        "== checks for equality with type coercion, whereas === checks for strict equality without type coercion",
        "=== checks for equality with type coercion, whereas == checks strict equality",
        "== is used for strings only, while === is used for numerical comparisons",
        "There is no difference in modern ES6+ engines"
      ],
      correctAnswer: 0
    }
  ],
  "Python - Data Science & Core Architecture": [
    {
      questionText: "What is the difference between a Python list and a tuple?",
      options: [
        "Lists are immutable, while tuples are mutable and dynamic",
        "Lists are mutable and defined with square brackets [], whereas tuples are immutable and defined with parentheses ()",
        "Tuples can only store integers, whereas lists can store any data type",
        "Lists are syntax errors in Python 3, replaced entirely by dictionaries"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the primary function of the Pandas library in Data Science?",
      options: [
        "Creating 3D video game graphics and rendering engines",
        "Data manipulation and analysis using high-performance data structures like DataFrames and Series",
        "Compiling Python scripts into standalone Windows .exe executables",
        "Managing low-level TCP/IP network packets for cybersecurity monitoring"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is a Python decorator?",
      options: [
        "A GUI design theme for Tkinter applications",
        "A design pattern that allows a user to add new functionality to an existing object or function without modifying its structure, usually initiated with the @symbol",
        "A built-in database indexing engine for SQLite",
        "A tool that automatically translates Python comments into English documentation"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What does the '__init__' method do in a Python class?",
      options: [
        "It destroys the class instance and frees up memory when execution finishes",
        "It serves as the constructor method that is automatically called when a new instance of the class is created to initialize attributes",
        "It converts class methods into static global functions",
        "It imports external packages from PyPI automatically"
      ],
      correctAnswer: 1
    },
    {
      questionText: "In NumPy, what is broadcasting?",
      options: [
        "Sending data packets over Wi-Fi networks to remote servers",
        "A powerful mechanism that allows NumPy to perform arithmetic operations on arrays of different shapes during element-wise operations",
        "Printing array contents to the console screen continuously",
        "Converting Python dictionaries into CSV spreadsheets automatically"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the difference between supervised and unsupervised learning in Machine Learning?",
      options: [
        "Supervised learning trains on labeled data with known target outcomes, whereas unsupervised learning finds hidden patterns in unlabeled data without predefined target labels",
        "Supervised learning requires human programmers to type every code line manually, while unsupervised learning writes its own source code",
        "Supervised learning only works on images, whereas unsupervised learning only works on audio files",
        "There is no mathematical or practical difference between the two approaches"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is the purpose of a virtual environment (venv) in Python development?",
      options: [
        "To simulate quantum computer hardware on a standard laptop",
        "To create an isolated environment for a Python project with its own independent set of installed packages and dependencies, avoiding conflicts with system-wide packages",
        "To run Python code inside an online web browser without installing Python locally",
        "To encrypt source code files so unauthorized users cannot read them"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What does the Python 'yield' keyword do inside a function?",
      options: [
        "It terminates the function immediately and returns an error code",
        "It pauses function execution and returns a generator object, saving local state so execution can resume right where it left off on successive calls",
        "It forces the CPU to yield processing power to background background tasks",
        "It converts a string into an integer automatically with error handling"
      ],
      correctAnswer: 1
    }
  ],
  "Cybersecurity & Cloud Essentials": [
    {
      questionText: "What is the primary objective of a SQL Injection (SQLi) attack?",
      options: [
        "To overwhelm web server CPU memory with billions of HTTP ping requests",
        "To insert malicious SQL statements into entry fields for execution by the backend database, allowing unauthorized data viewing or manipulation",
        "To intercept wireless Wi-Fi signals between laptops and routers",
        "To encrypt files on a victim's computer and demand ransom payment in Bitcoin"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What does the Principle of Least Privilege state in information security?",
      options: [
        "Every employee should have full administrator root access to ensure maximum productivity without barriers",
        "A user, program, or process should only be granted the bare minimum access privileges necessary to perform its legitimate function",
        "All passwords must be at least 4 characters long and contain no symbols",
        "Security firewalls should be disabled during business hours to speed up internet browsing"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is Cross-Site Scripting (XSS)?",
      options: [
        "A vulnerability where attackers inject malicious client-side scripts into web pages viewed by other users to steal session cookies or manipulate DOM elements",
        "A protocol for transferring files between Linux servers over SSH",
        "An encrypted VPN tunnel for remote workers",
        "A hardware firewall specification for enterprise data centers"
      ],
      correctAnswer: 0
    },
    {
      questionText: "In Cloud Computing, what is the difference between IaaS and PaaS?",
      options: [
        "IaaS provides raw virtualized computing infrastructure (VMs, storage, networks), whereas PaaS provides a managed platform and runtime environment allowing developers to deploy applications without managing underlying servers",
        "IaaS is for mobile apps only, whereas PaaS is for mainframe supercomputers",
        "IaaS is completely free, while PaaS always charges by the millisecond",
        "There is no difference; IaaS and PaaS are identical marketing terms for web hosting"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is a DDoS (Distributed Denial of Service) attack?",
      options: [
        "An attack where multiple compromised systems flood the bandwidth or resources of a targeted system, rendering it inaccessible to legitimate users",
        "A method for decoding encrypted passwords using rainbow tables",
        "An social engineering phone call trick to obtain employee badges",
        "An antivirus software update that accidentally deletes operating system files"
      ],
      correctAnswer: 0
    }
  ],
  "Java Full Stack & Core Architecture": [
    {
      questionText: "What is the main difference between JDK, JRE, and JVM?",
      options: [
        "JDK contains JRE and development tools; JRE contains JVM and class libraries; JVM executes byte code",
        "JVM compiles Java code into machine code; JRE compiles C++ code; JDK is an IDE",
        "They are three different brand names for the exact same software package",
        "JRE is only used on mobile phones, while JDK is used exclusively on web servers"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What does the keyword 'static' mean when applied to a method in Java?",
      options: [
        "The method can only be called once per program execution",
        "The method belongs to the class itself rather than any specific object instance",
        "The method cannot be overridden by subclasses and cannot contain variables",
        "The method runs automatically in a background daemon thread"
      ],
      correctAnswer: 1
    },
    {
      questionText: "In Java Collections Framework, what is the primary difference between ArrayList and LinkedList?",
      options: [
        "ArrayList uses a dynamic resizable array with fast O(1) random access, whereas LinkedList uses doubly-linked nodes with faster O(1) insertions/deletions at endpoints",
        "ArrayList can store strings only, whereas LinkedList can store integers only",
        "LinkedList is thread-safe by default, while ArrayList is synchronized",
        "ArrayList cannot grow in size once initialized, whereas LinkedList has infinite capacity"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is object-oriented Polymorphism in Java?",
      options: [
        "The ability of different classes to inherit from multiple abstract parents simultaneously without interfaces",
        "The ability of an object to take on many forms, allowing a parent reference variable to point to a child subclass object and execute overridden methods at runtime",
        "The automatic conversion of strings into primitive integers during mathematical operations",
        "A security mechanism that hides private database passwords from reflection APIs"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the purpose of the 'finally' block in Java exception handling?",
      options: [
        "To terminate the JVM process immediately upon encountering an error",
        "To execute cleanup code (like closing database connections or file streams) regardless of whether an exception was thrown or caught",
        "To re-throw caught exceptions back to the operating system console",
        "To skip the catch block during unit testing"
      ],
      correctAnswer: 1
    }
  ],
  "Spring Boot & Microservices": [
    {
      questionText: "What is Dependency Injection (DI) in Spring Boot?",
      options: [
        "A design pattern where an external container (Spring IoC Container) injects required dependencies into an object rather than the object creating them itself",
        "An SQL script that injects mock data into production database tables",
        "A security vulnerability where attackers inject Spring annotations into HTTP request headers",
        "A build tool command that downloads Maven JAR files at runtime"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is the role of the @SpringBootApplication annotation?",
      options: [
        "It generates HTML templates for frontend user interfaces automatically",
        "It is a convenience annotation that combines @Configuration, @EnableAutoConfiguration, and @ComponentScan to bootstrap a Spring application",
        "It encrypts all application.properties database passwords using AES-256",
        "It forces the built-in Tomcat server to run on port 80 exclusively"
      ],
      correctAnswer: 1
    },
    {
      questionText: "How does Spring Data JPA simplify database access?",
      options: [
        "By eliminating SQL databases entirely and replacing them with in-memory JSON files",
        "By automatically generating repository implementations at runtime from interface method names (e.g., findByEmail) without writing boilerplate SQL queries",
        "By converting Java classes into Python scripts for database migrations",
        "By disabling database connection pooling to reduce memory consumption"
      ],
      correctAnswer: 1
    },
    {
      questionText: "In a Microservices architecture, what is an API Gateway?",
      options: [
        "A hardware router that connects office Wi-Fi networks to cloud servers",
        "A single entry point that routes client requests to appropriate internal microservices, handling cross-cutting concerns like authentication, rate limiting, and SSL termination",
        "An SQL database table that stores user authentication logs",
        "A frontend JavaScript library for rendering responsive navigational menus"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the purpose of Spring Actuator?",
      options: [
        "To animate UI components in Spring MVC web pages",
        "To provide production-ready features like health checks, metrics monitoring, HTTP tracing, and environmental auditing endpoints out of the box",
        "To automatically restart the database server whenever an exception occurs",
        "To compile Java source code twice as fast during Gradle builds"
      ],
      correctAnswer: 1
    }
  ],
  "UI/UX Design & Figma Mastery": [
    {
      questionText: "What is the primary difference between UI (User Interface) and UX (User Experience) design?",
      options: [
        "UI focuses on the visual touchpoints, aesthetics, and layout of an interface, whereas UX encompasses the overall journey, functionality, ease of use, and emotional response of the user",
        "UI is used only for websites, whereas UX is used only for iOS and Android mobile apps",
        "UI designers write backend JavaScript code, while UX designers manage SQL databases",
        "There is no difference; UI and UX are exact synonyms in modern product design"
      ],
      correctAnswer: 0
    },
    {
      questionText: "In Figma, what is an Auto Layout frame?",
      options: [
        "A tool that automatically writes CSS animations for developer handoff",
        "A dynamic property that allows frames to grow, shrink, and reflow content automatically based on padding, spacing, and sizing rules when items are added or removed",
        "A plugin that exports Figma canvas designs into playable video games",
        "An AI assistant that selects color palettes based on brand logos"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the purpose of a Design System?",
      options: [
        "To prevent developers from making any changes to UI code after launch",
        "To maintain consistency and scalability across products by documenting reusable components, typography scales, color palettes, and interactive design tokens",
        "To store high-resolution stock photography files in cloud storage",
        "To replace usability testing by relying on standardized templates"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the difference between a wireframe and an interactive prototype?",
      options: [
        "A wireframe is a low-fidelity static structural blueprint of screen layouts, whereas a prototype is a high-fidelity interactive simulation demonstrating user flows and click behaviors",
        "A wireframe is always drawn on paper, while a prototype can only be created in Photoshop",
        "A wireframe includes full database backend integration, while a prototype is frontend-only",
        "Wireframes are used for branding logos, while prototypes are used for print typography"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is the WCAG contrast ratio recommendation for normal body text to ensure accessibility?",
      options: [
        "1:1 (Pure white on pure white)",
        "At least 4.5:1 contrast ratio against its background",
        "Exactly 100:1 contrast ratio for all fonts",
        "Accessibility guidelines do not apply to web font colors"
      ],
      correctAnswer: 1
    }
  ],
  "Digital Marketing & SEO Essentials": [
    {
      questionText: "What is the difference between Organic SEO and Paid Search (PPC)?",
      options: [
        "Organic SEO focuses on optimizing website content and authority to rank naturally in search engine results without paying per click, whereas PPC involves purchasing ad placements at the top of results",
        "Organic SEO is only used on social media platforms, while PPC is used exclusively on email newsletters",
        "Organic SEO delivers instant overnight traffic, while PPC takes 6-12 months to show results",
        "There is no difference; both require bidding on keywords in Google Ads"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is Click-Through Rate (CTR) in digital advertising?",
      options: [
        "The total dollar cost required to acquire a single paying customer",
        "The percentage of people who clicked on an advertisement or search result out of the total number of people who viewed it (Clicks / Impressions * 100)",
        "The speed at which a website landing page loads on mobile devices",
        "The number of email newsletter subscribers who forward an email to friends"
      ],
      correctAnswer: 1
    },
    {
      questionText: "In SEO, what are backlinks and why are they important?",
      options: [
        "Hidden hyperlinks pointing back to the website's own homepage; they increase server storage speed",
        "Incoming links from external websites pointing to your page; search engines view high-quality backlinks as votes of confidence and domain authority",
        "Links placed inside customer billing receipts; they reduce credit card processing fees",
        "Broken links that lead to 404 error pages; they improve website security ratings"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is A/B Testing (Split Testing) in conversion rate optimization?",
      options: [
        "Testing a website on two different web browsers simultaneously to check for visual bugs",
        "Comparing two versions of a webpage, email, or ad (Version A vs. Version B) against each other with live audience traffic to determine which performs better at driving conversions",
        "Asking internal employees to grade marketing copy on an A to B letter scale",
        "Splitting advertising budgets equally across all available social media channels"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the primary goal of Content Marketing?",
      options: [
        "Sending unsolicited promotional spam emails to purchased lead lists daily",
        "Creating and distributing valuable, relevant, and consistent content to attract and engage a clearly defined target audience, ultimately driving profitable customer action",
        "Replacing all human customer service agents with automated chatbots",
        "Bidding on competitor brand names in search engine paid advertising auctions"
      ],
      correctAnswer: 1
    }
  ],
  "DevOps & CI/CD Pipelines": [
    {
      questionText: "What is Continuous Integration (CI) in software engineering?",
      options: [
        "The practice of merging developer code changes into a shared central repository frequently (multiple times a day), automatically triggering automated builds and unit tests to catch integration bugs early",
        "An annual performance review process where developers integrate feedback from managers",
        "Installing all operating system software updates simultaneously on production servers without backups",
        "Writing software documentation continuously while coding without compiling"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is the primary benefit of Containerization (e.g., using Docker)?",
      options: [
        "It eliminates the need for computer hardware by running software directly on monitor screens",
        "It packages an application along with all its required libraries, dependencies, and configuration files into a portable container, ensuring consistent execution across development, testing, and production environments",
        "It automatically writes unit test coverage reports for legacy codebases",
        "It encrypts database network traffic to prevent unauthorized Wi-Fi sniffing"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is Kubernetes primarily used for?",
      options: [
        "Designing vector graphics and SVG logos for web applications",
        "An open-source container orchestration platform that automates the deployment, scaling, networking, and management of containerized applications across clusters of hosts",
        "A relational database management engine designed to replace PostgreSQL",
        "A frontend JavaScript test runner for Jest and Mocha assertions"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is Infrastructure as Code (IaC) using tools like Terraform or Ansible?",
      options: [
        "Writing manual step-by-step Word document guides for sysadmins to plug in server cables",
        "Managing and provisioning computing infrastructure through machine-readable definition files and code rather than physical hardware configuration or interactive configuration tools",
        "Embedding hardware microchips inside software installation disks",
        "Converting Python source code into binary assembly instructions for CPUs"
      ],
      correctAnswer: 1
    },
    {
      questionText: "In Git version control, what is the difference between 'git merge' and 'git rebase'?",
      options: [
        "git merge combines branches by creating a new merge commit preserving branch history, whereas git rebase rewrites commit history by transferring commits from one branch onto the tip of another for a linear project history",
        "git merge deletes the target branch permanently, whereas git rebase duplicates repository files onto remote servers",
        "git merge is used for documentation files only, while git rebase is used for compiled source code",
        "There is no difference; both commands execute the exact same underlying Git algorithm"
      ],
      correctAnswer: 0
    }
  ],
  "AWS Cloud Architecture": [
    {
      questionText: "What is Amazon EC2 (Elastic Compute Cloud)?",
      options: [
        "A managed relational database service supporting MySQL and PostgreSQL engines",
        "A web service that provides resizable virtual computing capacity (virtual machines or instances) in the AWS cloud",
        "An object storage service designed to store and retrieve any amount of unstructured files",
        "A serverless function execution runtime that runs code without provisioning servers"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the difference between Amazon S3 and Amazon EBS?",
      options: [
        "S3 is an object storage service accessed via HTTP/REST APIs ideal for storing backups, static files, and media, whereas EBS provides persistent block-level storage volumes attached directly to EC2 virtual machines like physical hard drives",
        "S3 is for Windows servers only, whereas EBS is for Linux servers only",
        "S3 stores data in RAM memory, while EBS stores data on magnetic tape drives",
        "There is no difference; S3 and EBS are interchangeable names for AWS cloud drives"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is AWS Lambda and how does it work?",
      options: [
        "A dedicated physical server rack hosted in an office building managed by AWS technicians",
        "An event-driven, serverless computing service that lets you run code without provisioning or managing servers, automatically scaling and charging only for the exact compute time consumed during execution",
        "A private virtual network firewall that blocks unauthorized incoming SQL traffic",
        "An automated domain name registrar that renews SSL certificates annually"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is Amazon VPC (Virtual Private Cloud)?",
      options: [
        "An isolated virtual network section of the AWS cloud where you can launch AWS resources in a custom-defined network topology with control over subnets, routing tables, and internet gateways",
        "A cloud-based video conferencing tool for engineering teams",
        "A physical USB security key required to log into the AWS Management Console",
        "An artificial intelligence model that predicts monthly AWS cloud billing costs"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is the purpose of Amazon Route 53?",
      options: [
        "A highly available and scalable cloud Domain Name System (DNS) web service designed to route end-user requests to internet applications and perform health checks",
        "A GPS navigation tracking system for AWS delivery trucks",
        "An automated backup scheduler for MySQL database instances",
        "A load balancing hardware appliance installed inside customer data centers"
      ],
      correctAnswer: 0
    }
  ],
  "AI & Machine Learning": [
    {
      questionText: "What is the difference between Deep Learning and traditional Machine Learning?",
      options: [
        "Deep learning uses artificial neural networks with multiple hidden layers that automatically learn hierarchical feature representations from raw data, whereas traditional ML often relies on manual feature engineering and simpler algorithms (like decision trees or regression)",
        "Deep learning only works on spreadsheets, while traditional ML only works on robotics",
        "Deep learning runs without electricity or computers, while traditional ML requires supercomputers",
        "There is no difference; deep learning is just a marketing term for linear regression"
      ],
      correctAnswer: 0
    },
    {
      questionText: "What is Overfitting in Machine Learning model training?",
      options: [
        "When a model trains so fast that it overheats the computer CPU hardware",
        "When a model learns the training data too well—including statistical noise and outliers—resulting in exceptionally high training accuracy but poor generalizability and low accuracy on unseen test data",
        "When a dataset contains fewer than 10 rows of data",
        "When a neural network has zero weights and biases initialized"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is the purpose of an Activation Function in an Artificial Neural Network (such as ReLU, Sigmoid, or Softmax)?",
      options: [
        "To power on the computer monitor when training completes",
        "To introduce non-linearity into the network, allowing the neural network to learn complex patterns and decision boundaries beyond simple linear combinations",
        "To compress dataset image files before feeding them into input layers",
        "To encrypt model weights so competitors cannot reverse-engineer neural networks"
      ],
      correctAnswer: 1
    },
    {
      questionText: "In Natural Language Processing (NLP) and Large Language Models (LLMs), what is a Token?",
      options: [
        "A physical security key card required to enter AI server data centers",
        "The basic numerical building block or unit of text (such as a word, subword, or character) that text is converted into so that neural networks can process and analyze language",
        "A cryptocurrency coin mined by AI computers during training",
        "A syntax error message generated when grammar checks fail"
      ],
      correctAnswer: 1
    },
    {
      questionText: "What is Retrieval-Augmented Generation (RAG) in generative AI applications?",
      options: [
        "A technique that combines a pre-trained Large Language Model with an external knowledge retrieval system (like a vector database of documents), allowing the model to generate factual answers grounded in specific custom data without retraining",
        "A hardware cooling technique that pumps liquid refrigerant through GPU clusters",
        "An algorithm that deletes old training data when hard drive storage is full",
        "A method for translating voice audio recordings into Morse code signals"
      ],
      correctAnswer: 0
    }
  ]
};

export const parseBulkQuestions = (rawText) => {
  if (!rawText || !rawText.trim()) return [];
  
  const parsed = [];
  // Split by question number headers like "1.", "1)", "Q1:", "Question 1-"
  const blocks = rawText.split(/(?:^|\n)(?:\d+[\.\)]|Q\d+[\.\:\-]|Question\s*\d+[\.\:\-])\s*/i);
  
  for (let block of blocks) {
    if (!block.trim()) continue;
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 3) continue; // Need at least question and 2 options
    
    const questionText = lines[0];
    const options = [];
    let correctAnswer = 0;
    
    // Process remaining lines as options
    let optIdx = 0;
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];
      // Match option prefixes: A), A., a), (A), [A], -
      const optMatch = line.match(/^(?:[A-D][\)\.\-]|\[[A-D]\]|\([A-D]\)|\-|\*)\s*(.*)/i);
      let optText = optMatch ? optMatch[1] : line;
      
      // Check if this option is marked as correct with *, (correct), [x], or (true)
      const isCorrect = /\*|\(correct\)|\(true\)|\[correct\]|\[x\]/i.test(optText) || /\*|\(correct\)|\(true\)|\[correct\]|\[x\]/i.test(line);
      
      // Clean marker tags from option text
      optText = optText.replace(/\*|\(correct\)|\(true\)|\[correct\]|\[x\]/gi, '').trim();
      
      if (optText.length > 0 && options.length < 4) {
        if (isCorrect) {
          correctAnswer = options.length;
        }
        options.push(optText);
        optIdx++;
      }
    }
    
    // Ensure we have at least 2 options, pad to 4 if needed
    while (options.length < 4) {
      options.push(`Option ${String.fromCharCode(65 + options.length)}`);
    }
    
    if (options.length >= 2) {
      parsed.push({
        questionText,
        options: options.slice(0, 4),
        correctAnswer: Math.min(correctAnswer, 3)
      });
    }
  }
  
  return parsed;
};
