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
