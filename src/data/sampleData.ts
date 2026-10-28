import { 
  Student, 
  Subject, 
  Topic, 
  AssessmentRecord, 
  StudyHabit, 
  EngagementRecord, 
  AttendanceRecord, 
  PracticeQuizActivity, 
  AppState 
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'NIET-2026-001',
    name: 'Vedant',
    program: 'B.Tech Computer Science and Engineering',
    semester: 3,
    section: 'F',
    enrollmentDate: '2024-08-01',
    email: 'vedant@example.edu'
  },
  {
    id: 'NIET-2026-002',
    name: 'Vyash',
    program: 'B.Tech Computer Science and Engineering',
    semester: 3,
    section: 'F',
    enrollmentDate: '2024-08-01',
    email: 'vyash@example.edu'
  },
  {
    id: 'NIET-2026-003',
    name: 'Yogesh',
    program: 'B.Tech Computer Science and Engineering',
    semester: 3,
    section: 'F',
    enrollmentDate: '2024-08-01',
    email: 'yogesh@example.edu'
  },
  {
    id: 'NIET-2026-004',
    name: 'Yash',
    program: 'B.Tech Computer Science and Engineering',
    semester: 3,
    section: 'F',
    enrollmentDate: '2024-08-01',
    email: 'yash@example.edu'
  },
  {
    id: 'NIET-2026-005',
    name: 'Rahul',
    program: 'B.Tech Computer Science and Engineering',
    semester: 3,
    section: 'F',
    enrollmentDate: '2024-08-01',
    email: 'rahul@example.edu'
  },
  {
    id: 'NIET-2026-006',
    name: 'Gyanendra',
    program: 'B.Tech Computer Science and Engineering',
    semester: 3,
    section: 'F',
    enrollmentDate: '2024-08-01',
    email: 'gyanendra@example.edu'
  },
  {
    id: 'NIET-2026-007',
    name: 'Anubhav',
    program: 'B.Tech Computer Science and Engineering',
    semester: 3,
    section: 'F',
    enrollmentDate: '2024-08-01',
    email: 'anubhav@example.edu'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'SUB-DSA',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    semester: 3
  },
  {
    id: 'SUB-AIML',
    name: 'Artificial Intelligence & Machine Learning',
    code: 'CS302',
    semester: 3
  },
  {
    id: 'SUB-MATH',
    name: 'Discrete Mathematics',
    code: 'CS303',
    semester: 3
  },
  {
    id: 'SUB-DBMS',
    name: 'Database Management Systems',
    code: 'CS304',
    semester: 3
  }
];

export const INITIAL_TOPICS: Topic[] = [
  // Subject 1: Data Structures & Algorithms
  {
    id: 'TOPIC-DSA-01',
    subjectId: 'SUB-DSA',
    name: 'Arrays & Strings',
    description: 'Fundamental linear memory allocation, pointers, sliding window, and two-pointer techniques.',
    prerequisites: []
  },
  {
    id: 'TOPIC-DSA-02',
    subjectId: 'SUB-DSA',
    name: 'Linked Lists & Stacks',
    description: 'Dynamic node allocation, pointer manipulations, and LIFO operations.',
    prerequisites: ['TOPIC-DSA-01']
  },
  {
    id: 'TOPIC-DSA-03',
    subjectId: 'SUB-DSA',
    name: 'Trees & Binary Search',
    description: 'Hierarchical node representations, BST invariant properties, and recursive traversals.',
    prerequisites: ['TOPIC-DSA-02']
  },
  {
    id: 'TOPIC-DSA-04',
    subjectId: 'SUB-DSA',
    name: 'Graphs & Traversals',
    description: 'Adjacency structures, BFS/DFS reachability, shortest paths, and topological sorting.',
    prerequisites: ['TOPIC-DSA-03']
  },
  {
    id: 'TOPIC-DSA-05',
    subjectId: 'SUB-DSA',
    name: 'Dynamic Programming',
    description: 'Optimal substructure, overlapping subproblems, memoization tables, and bottom-up formulation.',
    prerequisites: ['TOPIC-DSA-01', 'TOPIC-DSA-03']
  },

  // Subject 2: AI & ML
  {
    id: 'TOPIC-AIML-01',
    subjectId: 'SUB-AIML',
    name: 'Linear Algebra & Optimization',
    description: 'Vector spaces, matrix decomposition, eigenvalues, gradients, and convex cost functions.',
    prerequisites: []
  },
  {
    id: 'TOPIC-AIML-02',
    subjectId: 'SUB-AIML',
    name: 'Supervised Learning',
    description: 'Linear & logistic regression, decision trees, support vector machines, and ensemble methods.',
    prerequisites: ['TOPIC-AIML-01']
  },
  {
    id: 'TOPIC-AIML-03',
    subjectId: 'SUB-AIML',
    name: 'Model Evaluation & Metrics',
    description: 'Confusion matrices, precision-recall, ROC-AUC curves, cross-validation, and bias-variance tradeoff.',
    prerequisites: ['TOPIC-AIML-02']
  },
  {
    id: 'TOPIC-AIML-04',
    subjectId: 'SUB-AIML',
    name: 'Neural Networks & Deep Learning',
    description: 'Multilayer perceptrons, backpropagation, activation functions, loss surfaces, and gradient descent variants.',
    prerequisites: ['TOPIC-AIML-01', 'TOPIC-AIML-03']
  },

  // Subject 3: Discrete Mathematics
  {
    id: 'TOPIC-MATH-01',
    subjectId: 'SUB-MATH',
    name: 'Propositional Logic & Truth Tables',
    description: 'Tautologies, logical equivalences, predicate calculus, and inference rules.',
    prerequisites: []
  },
  {
    id: 'TOPIC-MATH-02',
    subjectId: 'SUB-MATH',
    name: 'Sets, Relations & Functions',
    description: 'Equivalence relations, partial orderings, lattices, and bijective mappings.',
    prerequisites: ['TOPIC-MATH-01']
  },
  {
    id: 'TOPIC-MATH-03',
    subjectId: 'SUB-MATH',
    name: 'Graph Theory Foundations',
    description: 'Eulerian/Hamiltonian paths, planar graphs, graph coloring, and isomorphism.',
    prerequisites: ['TOPIC-MATH-02']
  },

  // Subject 4: Database Management Systems
  {
    id: 'TOPIC-DBMS-01',
    subjectId: 'SUB-DBMS',
    name: 'Relational Modeling & ER Diagrams',
    description: 'Entity-relationship diagrams, primary/foreign keys, and relational schema mapping.',
    prerequisites: []
  },
  {
    id: 'TOPIC-DBMS-02',
    subjectId: 'SUB-DBMS',
    name: 'Database Normalization (1NF to BCNF)',
    description: 'Functional dependencies, lossless joins, dependency preservation, 2NF, 3NF, and BCNF.',
    prerequisites: ['TOPIC-DBMS-01']
  },
  {
    id: 'TOPIC-DBMS-03',
    subjectId: 'SUB-DBMS',
    name: 'SQL Transactions & Indexing',
    description: 'ACID properties, serializability, B-tree indexes, execution plans, and concurrency control.',
    prerequisites: ['TOPIC-DBMS-02']
  }
];

export const INITIAL_ASSESSMENTS: AssessmentRecord[] = [
  // 1. Vedant (High consistent performer, 85-95%)
  {
    id: 'REC-001',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-01',
    assessmentName: 'Quiz 1 - Array Manipulation',
    assessmentType: 'Quiz',
    date: '2026-08-14',
    obtainedMarks: 18,
    maxMarks: 20,
    percentage: 90.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-002',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-01',
    assessmentName: 'Lab 1 - Sliding Window & Two Pointers',
    assessmentType: 'Lab',
    date: '2026-08-28',
    obtainedMarks: 47,
    maxMarks: 50,
    percentage: 94.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-003',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-02',
    assessmentName: 'Midterm 1 - Linked Structures',
    assessmentType: 'Midterm',
    date: '2026-09-12',
    obtainedMarks: 88,
    maxMarks: 100,
    percentage: 88.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-004',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-03',
    assessmentName: 'Quiz 2 - Tree Invariants & BST',
    assessmentType: 'Quiz',
    date: '2026-09-26',
    obtainedMarks: 23,
    maxMarks: 25,
    percentage: 92.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-005',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-03',
    assessmentName: 'Assignment 2 - Balanced Trees',
    assessmentType: 'Assignment',
    date: '2026-10-10',
    obtainedMarks: 48,
    maxMarks: 50,
    percentage: 96.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-006',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-AIML',
    topicId: 'TOPIC-AIML-01',
    assessmentName: 'Quiz 1 - Matrix Transformations',
    assessmentType: 'Quiz',
    date: '2026-08-20',
    obtainedMarks: 19,
    maxMarks: 20,
    percentage: 95.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-007',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-AIML',
    topicId: 'TOPIC-AIML-02',
    assessmentName: 'Assignment 1 - Logistic Regressor',
    assessmentType: 'Assignment',
    date: '2026-09-18',
    obtainedMarks: 86,
    maxMarks: 100,
    percentage: 86.0,
    attemptNumber: 1,
    status: 'completed'
  },

  // 2. Vyash (Demonstrating CLEAR IMPROVING PERFORMANCE in Dynamic Programming: 52% -> 64% -> 76% -> 86%)
  {
    id: 'REC-010',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-05',
    assessmentName: 'Diagnostic Quiz - Recursion to Memoization',
    assessmentType: 'Quiz',
    date: '2026-08-22',
    obtainedMarks: 13,
    maxMarks: 25,
    percentage: 52.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-011',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-05',
    assessmentName: 'Assignment 1 - 1D Dynamic Programming',
    assessmentType: 'Assignment',
    date: '2026-09-08',
    obtainedMarks: 32,
    maxMarks: 50,
    percentage: 64.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-012',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-05',
    assessmentName: 'Midterm Evaluation - 2D Grid DP',
    assessmentType: 'Midterm',
    date: '2026-09-24',
    obtainedMarks: 76,
    maxMarks: 100,
    percentage: 76.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-013',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-05',
    assessmentName: 'Practice Lab 3 - Knapsack & Partitioning',
    assessmentType: 'Lab',
    date: '2026-10-12',
    obtainedMarks: 43,
    maxMarks: 50,
    percentage: 86.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-014',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-01',
    assessmentName: 'Quiz 1 - Array Fundamentals',
    assessmentType: 'Quiz',
    date: '2026-08-14',
    obtainedMarks: 16,
    maxMarks: 20,
    percentage: 80.0,
    attemptNumber: 1,
    status: 'completed'
  },

  // 3. Yogesh (Demonstrating CLEAR DECLINING PERFORMANCE in Trees: 84% -> 72% -> 60% -> 48%)
  {
    id: 'REC-020',
    studentId: 'NIET-2026-003',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-03',
    assessmentName: 'Quiz 1 - Binary Tree Properties',
    assessmentType: 'Quiz',
    date: '2026-08-16',
    obtainedMarks: 21,
    maxMarks: 25,
    percentage: 84.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-021',
    studentId: 'NIET-2026-003',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-03',
    assessmentName: 'Assignment 1 - BST Construction',
    assessmentType: 'Assignment',
    date: '2026-09-02',
    obtainedMarks: 36,
    maxMarks: 50,
    percentage: 72.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-022',
    studentId: 'NIET-2026-003',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-03',
    assessmentName: 'Lab Exam - AVL Rotations',
    assessmentType: 'Lab',
    date: '2026-09-20',
    obtainedMarks: 30,
    maxMarks: 50,
    percentage: 60.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-023',
    studentId: 'NIET-2026-003',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-03',
    assessmentName: 'Midterm Section - Red-Black Tree Balancing',
    assessmentType: 'Midterm',
    date: '2026-10-08',
    obtainedMarks: 48,
    maxMarks: 100,
    percentage: 48.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-024',
    studentId: 'NIET-2026-003',
    subjectId: 'SUB-AIML',
    topicId: 'TOPIC-AIML-01',
    assessmentName: 'Quiz 1 - Vector Calculus',
    assessmentType: 'Quiz',
    date: '2026-08-20',
    obtainedMarks: 14,
    maxMarks: 20,
    percentage: 70.0,
    attemptNumber: 1,
    status: 'completed'
  },

  // 4. Yash (Demonstrating CLEAR STABLE PERFORMANCE: 74% -> 73% -> 75% -> 74%)
  {
    id: 'REC-030',
    studentId: 'NIET-2026-004',
    subjectId: 'SUB-AIML',
    topicId: 'TOPIC-AIML-02',
    assessmentName: 'Quiz 1 - Linear Regression Derivation',
    assessmentType: 'Quiz',
    date: '2026-08-18',
    obtainedMarks: 37,
    maxMarks: 50,
    percentage: 74.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-031',
    studentId: 'NIET-2026-004',
    subjectId: 'SUB-AIML',
    topicId: 'TOPIC-AIML-02',
    assessmentName: 'Lab 1 - Scikit-Learn Pipeline Implementation',
    assessmentType: 'Lab',
    date: '2026-09-04',
    obtainedMarks: 73,
    maxMarks: 100,
    percentage: 73.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-032',
    studentId: 'NIET-2026-004',
    subjectId: 'SUB-AIML',
    topicId: 'TOPIC-AIML-02',
    assessmentName: 'Assignment 2 - Decision Tree Pruning',
    assessmentType: 'Assignment',
    date: '2026-09-22',
    obtainedMarks: 30,
    maxMarks: 40,
    percentage: 75.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-033',
    studentId: 'NIET-2026-004',
    subjectId: 'SUB-AIML',
    topicId: 'TOPIC-AIML-02',
    assessmentName: 'Midterm Practical - SVM Classifiers',
    assessmentType: 'Midterm',
    date: '2026-10-10',
    obtainedMarks: 74,
    maxMarks: 100,
    percentage: 74.0,
    attemptNumber: 1,
    status: 'completed'
  },

  // 5. Rahul (Demonstrating at least ONE GENUINE ZERO SCORE + recovery attempt)
  {
    id: 'REC-040',
    studentId: 'NIET-2026-005',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-04',
    assessmentName: 'Surprise Quiz - Graph Representation',
    assessmentType: 'Quiz',
    date: '2026-08-25',
    obtainedMarks: 0,
    maxMarks: 20,
    percentage: 0.0, // Genuine recorded zero!
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-041',
    studentId: 'NIET-2026-005',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-04',
    assessmentName: 'Lab Exam 1 - BFS Shortest Path',
    assessmentType: 'Lab',
    date: '2026-09-15',
    obtainedMarks: 28,
    maxMarks: 50,
    percentage: 56.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-042',
    studentId: 'NIET-2026-005',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-04',
    assessmentName: 'Assignment 2 - Dijkstra Implementation',
    assessmentType: 'Assignment',
    date: '2026-10-05',
    obtainedMarks: 65,
    maxMarks: 100,
    percentage: 65.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-043',
    studentId: 'NIET-2026-005',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-01',
    assessmentName: 'Quiz 1 - Array Indexing',
    assessmentType: 'Quiz',
    date: '2026-08-14',
    obtainedMarks: 12,
    maxMarks: 20,
    percentage: 60.0,
    attemptNumber: 1,
    status: 'completed'
  },

  // 6. Gyanendra (Demonstrating INSUFFICIENT DATA: EXACTLY 1 ATTEMPT in Supervised Learning)
  {
    id: 'REC-050',
    studentId: 'NIET-2026-006',
    subjectId: 'SUB-AIML',
    topicId: 'TOPIC-AIML-02',
    assessmentName: 'Initial Diagnostic - Supervised Learning',
    assessmentType: 'Quiz',
    date: '2026-09-10',
    obtainedMarks: 68,
    maxMarks: 100,
    percentage: 68.0,
    attemptNumber: 1,
    status: 'completed'
  },

  // 7. Anubhav (Mixed performance, repeated attempts on same topic, unattempted Dynamic Programming)
  {
    id: 'REC-060',
    studentId: 'NIET-2026-007',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-02',
    assessmentName: 'Quiz 1 - Stack Implementation',
    assessmentType: 'Quiz',
    date: '2026-08-15',
    obtainedMarks: 11,
    maxMarks: 20,
    percentage: 55.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-061',
    studentId: 'NIET-2026-007',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-02',
    assessmentName: 'Quiz 1 Re-attempt - Stack Invariants',
    assessmentType: 'Quiz',
    date: '2026-08-22',
    obtainedMarks: 15,
    maxMarks: 20,
    percentage: 75.0,
    attemptNumber: 2,
    status: 'completed'
  },
  {
    id: 'REC-062',
    studentId: 'NIET-2026-007',
    subjectId: 'SUB-DSA',
    topicId: 'TOPIC-DSA-02',
    assessmentName: 'Lab 1 - Doubly Linked Lists',
    assessmentType: 'Lab',
    date: '2026-09-12',
    obtainedMarks: 40,
    maxMarks: 50,
    percentage: 80.0,
    attemptNumber: 1,
    status: 'completed'
  },

  // Discrete Mathematics (SUB-MATH) Assessments across scholars
  {
    id: 'REC-M01',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-MATH',
    topicId: 'TOPIC-MATH-01',
    assessmentName: 'Midterm 1 - Propositional Calculus & Truth Tables',
    assessmentType: 'Midterm',
    date: '2026-09-15',
    obtainedMarks: 92,
    maxMarks: 100,
    percentage: 92.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-M02',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-MATH',
    topicId: 'TOPIC-MATH-01',
    assessmentName: 'Midterm 1 - Propositional Calculus & Truth Tables',
    assessmentType: 'Midterm',
    date: '2026-09-15',
    obtainedMarks: 84,
    maxMarks: 100,
    percentage: 84.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-M03',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-MATH',
    topicId: 'TOPIC-MATH-02',
    assessmentName: 'Assignment 1 - Relations, Equivalence & Mappings',
    assessmentType: 'Assignment',
    date: '2026-09-28',
    obtainedMarks: 42,
    maxMarks: 50,
    percentage: 84.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-M04',
    studentId: 'NIET-2026-003',
    subjectId: 'SUB-MATH',
    topicId: 'TOPIC-MATH-01',
    assessmentName: 'Midterm 1 - Propositional Calculus & Truth Tables',
    assessmentType: 'Midterm',
    date: '2026-09-15',
    obtainedMarks: 58,
    maxMarks: 100,
    percentage: 58.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-M05',
    studentId: 'NIET-2026-004',
    subjectId: 'SUB-MATH',
    topicId: 'TOPIC-MATH-03',
    assessmentName: 'Quiz 1 - Graph Theory & Planarity',
    assessmentType: 'Quiz',
    date: '2026-09-18',
    obtainedMarks: 18,
    maxMarks: 20,
    percentage: 90.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-M06',
    studentId: 'NIET-2026-005',
    subjectId: 'SUB-MATH',
    topicId: 'TOPIC-MATH-01',
    assessmentName: 'Midterm 1 - Propositional Calculus & Truth Tables',
    assessmentType: 'Midterm',
    date: '2026-09-15',
    obtainedMarks: 62,
    maxMarks: 100,
    percentage: 62.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-M07',
    studentId: 'NIET-2026-006',
    subjectId: 'SUB-MATH',
    topicId: 'TOPIC-MATH-02',
    assessmentName: 'Assignment 1 - Relations, Equivalence & Mappings',
    assessmentType: 'Assignment',
    date: '2026-09-28',
    obtainedMarks: 31,
    maxMarks: 50,
    percentage: 62.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-M08',
    studentId: 'NIET-2026-007',
    subjectId: 'SUB-MATH',
    topicId: 'TOPIC-MATH-01',
    assessmentName: 'Midterm 1 - Propositional Calculus & Truth Tables',
    assessmentType: 'Midterm',
    date: '2026-09-15',
    obtainedMarks: 78,
    maxMarks: 100,
    percentage: 78.0,
    attemptNumber: 1,
    status: 'completed'
  },

  // Database Management Systems (SUB-DBMS) Assessments across scholars
  {
    id: 'REC-D01',
    studentId: 'NIET-2026-001',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-02',
    assessmentName: 'Midterm 1 - Normalization (1NF to BCNF)',
    assessmentType: 'Midterm',
    date: '2026-09-20',
    obtainedMarks: 89,
    maxMarks: 100,
    percentage: 89.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-D02',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-02',
    assessmentName: 'Midterm 1 - Normalization (1NF to BCNF)',
    assessmentType: 'Midterm',
    date: '2026-09-20',
    obtainedMarks: 58,
    maxMarks: 100,
    percentage: 58.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-D03',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-01',
    assessmentName: 'Quiz 1 - ER Modeling & Relational Schema',
    assessmentType: 'Quiz',
    date: '2026-08-30',
    obtainedMarks: 15,
    maxMarks: 20,
    percentage: 75.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-D04',
    studentId: 'NIET-2026-002',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-03',
    assessmentName: 'Assignment 1 - SQL Transactions & Indexing',
    assessmentType: 'Assignment',
    date: '2026-10-05',
    obtainedMarks: 33,
    maxMarks: 50,
    percentage: 66.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-D05',
    studentId: 'NIET-2026-003',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-02',
    assessmentName: 'Midterm 1 - Normalization (1NF to BCNF)',
    assessmentType: 'Midterm',
    date: '2026-09-20',
    obtainedMarks: 52,
    maxMarks: 100,
    percentage: 52.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-D06',
    studentId: 'NIET-2026-004',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-03',
    assessmentName: 'Assignment 1 - SQL Transactions & Indexing',
    assessmentType: 'Assignment',
    date: '2026-10-05',
    obtainedMarks: 44,
    maxMarks: 50,
    percentage: 88.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-D07',
    studentId: 'NIET-2026-005',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-02',
    assessmentName: 'Midterm 1 - Normalization (1NF to BCNF)',
    assessmentType: 'Midterm',
    date: '2026-09-20',
    obtainedMarks: 56,
    maxMarks: 100,
    percentage: 56.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-D08',
    studentId: 'NIET-2026-006',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-02',
    assessmentName: 'Midterm 1 - Normalization (1NF to BCNF)',
    assessmentType: 'Midterm',
    date: '2026-09-20',
    obtainedMarks: 60,
    maxMarks: 100,
    percentage: 60.0,
    attemptNumber: 1,
    status: 'completed'
  },
  {
    id: 'REC-D09',
    studentId: 'NIET-2026-007',
    subjectId: 'SUB-DBMS',
    topicId: 'TOPIC-DBMS-01',
    assessmentName: 'Quiz 1 - ER Modeling & Relational Schema',
    assessmentType: 'Quiz',
    date: '2026-08-30',
    obtainedMarks: 16,
    maxMarks: 20,
    percentage: 80.0,
    attemptNumber: 1,
    status: 'completed'
  }
];

export const INITIAL_STUDY_HABITS: StudyHabit[] = [
  {
    id: 'HABIT-001',
    studentId: 'NIET-2026-001',
    studyHoursPerWeek: 14,
    revisionFrequency: 'Daily',
    practiceFrequency: 'High',
    preparationPattern: 'Regular distributed',
    lastUpdated: '2026-10-15',
    notes: 'Maintains disciplined 2-hour daily review sessions.'
  },
  {
    id: 'HABIT-002',
    studentId: 'NIET-2026-002',
    studyHoursPerWeek: 11,
    revisionFrequency: '3-4 times/week',
    practiceFrequency: 'High',
    preparationPattern: 'Regular distributed',
    lastUpdated: '2026-10-18',
    notes: 'Steadily increased practice frequency after diagnostic test.'
  },
  {
    id: 'HABIT-003',
    studentId: 'NIET-2026-003',
    studyHoursPerWeek: 4,
    revisionFrequency: 'Before Exams',
    practiceFrequency: 'Low',
    preparationPattern: 'Cramming',
    lastUpdated: '2026-10-10',
    notes: 'Self-reported infrequent study sessions; concentrates preparation right before evaluations.'
  },
  {
    id: 'HABIT-004',
    studentId: 'NIET-2026-004',
    studyHoursPerWeek: 8,
    revisionFrequency: 'Weekly',
    practiceFrequency: 'Moderate',
    preparationPattern: 'Self-paced',
    lastUpdated: '2026-10-12',
    notes: 'Consistent weekend review rhythm.'
  },
  {
    id: 'HABIT-005',
    studentId: 'NIET-2026-005',
    studyHoursPerWeek: 6,
    revisionFrequency: '3-4 times/week',
    practiceFrequency: 'Moderate',
    preparationPattern: 'Group study',
    lastUpdated: '2026-10-14',
    notes: 'Participates in peer coding circles.'
  },
  {
    id: 'HABIT-006',
    studentId: 'NIET-2026-006',
    studyHoursPerWeek: 5,
    revisionFrequency: 'Weekly',
    practiceFrequency: 'Moderate',
    preparationPattern: 'Self-paced',
    lastUpdated: '2026-10-09'
  },
  {
    id: 'HABIT-007',
    studentId: 'NIET-2026-007',
    studyHoursPerWeek: 9,
    revisionFrequency: '3-4 times/week',
    practiceFrequency: 'High',
    preparationPattern: 'Regular distributed',
    lastUpdated: '2026-10-16'
  }
];

export const INITIAL_ENGAGEMENT: EngagementRecord[] = [
  {
    id: 'ENG-001',
    studentId: 'NIET-2026-001',
    lessonsCompleted: 28,
    totalLessons: 30,
    learningActivitiesCompleted: 24,
    totalActivities: 25,
    resourcesAccessedCount: 78,
    progressPercentage: 93.3,
    measuredMinutesSpent: 1820,
    lastUpdated: '2026-10-19'
  },
  {
    id: 'ENG-002',
    studentId: 'NIET-2026-002',
    lessonsCompleted: 26,
    totalLessons: 30,
    learningActivitiesCompleted: 22,
    totalActivities: 25,
    resourcesAccessedCount: 65,
    progressPercentage: 86.7,
    measuredMinutesSpent: 1540,
    lastUpdated: '2026-10-19'
  },
  {
    id: 'ENG-003',
    studentId: 'NIET-2026-003',
    lessonsCompleted: 11,
    totalLessons: 30,
    learningActivitiesCompleted: 8,
    totalActivities: 25,
    resourcesAccessedCount: 22,
    progressPercentage: 36.7,
    measuredMinutesSpent: 490,
    lastUpdated: '2026-10-19'
  },
  {
    id: 'ENG-004',
    studentId: 'NIET-2026-004',
    lessonsCompleted: 22,
    totalLessons: 30,
    learningActivitiesCompleted: 18,
    totalActivities: 25,
    resourcesAccessedCount: 52,
    progressPercentage: 73.3,
    measuredMinutesSpent: 1120,
    lastUpdated: '2026-10-19'
  },
  {
    id: 'ENG-005',
    studentId: 'NIET-2026-005',
    lessonsCompleted: 18,
    totalLessons: 30,
    learningActivitiesCompleted: 14,
    totalActivities: 25,
    resourcesAccessedCount: 41,
    progressPercentage: 60.0,
    measuredMinutesSpent: 870,
    lastUpdated: '2026-10-19'
  },
  {
    id: 'ENG-006',
    studentId: 'NIET-2026-006',
    lessonsCompleted: 14,
    totalLessons: 30,
    learningActivitiesCompleted: 10,
    totalActivities: 25,
    resourcesAccessedCount: 30,
    progressPercentage: 46.7,
    measuredMinutesSpent: 620,
    lastUpdated: '2026-10-19'
  },
  {
    id: 'ENG-007',
    studentId: 'NIET-2026-007',
    lessonsCompleted: 23,
    totalLessons: 30,
    learningActivitiesCompleted: 19,
    totalActivities: 25,
    resourcesAccessedCount: 56,
    progressPercentage: 76.7,
    measuredMinutesSpent: 1240,
    lastUpdated: '2026-10-19'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Vedant
  { id: 'ATT-001', studentId: 'NIET-2026-001', subjectId: 'SUB-DSA', classesAttended: 38, totalClassesHeld: 40, attendancePercentage: 95.0, termPeriod: 'Odd Sem 2026' },
  { id: 'ATT-002', studentId: 'NIET-2026-001', subjectId: 'SUB-AIML', classesAttended: 37, totalClassesHeld: 40, attendancePercentage: 92.5, termPeriod: 'Odd Sem 2026' },
  
  // Vyash
  { id: 'ATT-003', studentId: 'NIET-2026-002', subjectId: 'SUB-DSA', classesAttended: 36, totalClassesHeld: 40, attendancePercentage: 90.0, termPeriod: 'Odd Sem 2026' },
  { id: 'ATT-004', studentId: 'NIET-2026-002', subjectId: 'SUB-AIML', classesAttended: 35, totalClassesHeld: 40, attendancePercentage: 87.5, termPeriod: 'Odd Sem 2026' },

  // Yogesh (Low attendance in DSA)
  { id: 'ATT-005', studentId: 'NIET-2026-003', subjectId: 'SUB-DSA', classesAttended: 24, totalClassesHeld: 40, attendancePercentage: 60.0, termPeriod: 'Odd Sem 2026' },
  { id: 'ATT-006', studentId: 'NIET-2026-003', subjectId: 'SUB-AIML', classesAttended: 27, totalClassesHeld: 40, attendancePercentage: 67.5, termPeriod: 'Odd Sem 2026' },

  // Yash
  { id: 'ATT-007', studentId: 'NIET-2026-004', subjectId: 'SUB-DSA', classesAttended: 33, totalClassesHeld: 40, attendancePercentage: 82.5, termPeriod: 'Odd Sem 2026' },
  { id: 'ATT-008', studentId: 'NIET-2026-004', subjectId: 'SUB-AIML', classesAttended: 34, totalClassesHeld: 40, attendancePercentage: 85.0, termPeriod: 'Odd Sem 2026' },

  // Rahul
  { id: 'ATT-009', studentId: 'NIET-2026-005', subjectId: 'SUB-DSA', classesAttended: 29, totalClassesHeld: 40, attendancePercentage: 72.5, termPeriod: 'Odd Sem 2026' },
  { id: 'ATT-010', studentId: 'NIET-2026-005', subjectId: 'SUB-AIML', classesAttended: 31, totalClassesHeld: 40, attendancePercentage: 77.5, termPeriod: 'Odd Sem 2026' },

  // Gyanendra
  { id: 'ATT-011', studentId: 'NIET-2026-006', subjectId: 'SUB-DSA', classesAttended: 30, totalClassesHeld: 40, attendancePercentage: 75.0, termPeriod: 'Odd Sem 2026' },
  { id: 'ATT-012', studentId: 'NIET-2026-006', subjectId: 'SUB-AIML', classesAttended: 28, totalClassesHeld: 40, attendancePercentage: 70.0, termPeriod: 'Odd Sem 2026' },

  // Anubhav
  { id: 'ATT-013', studentId: 'NIET-2026-007', subjectId: 'SUB-DSA', classesAttended: 35, totalClassesHeld: 40, attendancePercentage: 87.5, termPeriod: 'Odd Sem 2026' },
  { id: 'ATT-014', studentId: 'NIET-2026-007', subjectId: 'SUB-AIML', classesAttended: 34, totalClassesHeld: 40, attendancePercentage: 85.0, termPeriod: 'Odd Sem 2026' }
];

export const INITIAL_PRACTICE_ACTIVITIES: PracticeQuizActivity[] = [
  {
    id: 'PRAC-001',
    studentId: 'NIET-2026-001',
    topicId: 'TOPIC-DSA-01',
    quizzesAttempted: 8,
    quizzesCompleted: 8,
    totalQuestions: 80,
    correctAnswers: 74,
    accuracyPercentage: 92.5,
    repeatAttemptsCount: 1
  },
  {
    id: 'PRAC-002',
    studentId: 'NIET-2026-002',
    topicId: 'TOPIC-DSA-05',
    quizzesAttempted: 10,
    quizzesCompleted: 10,
    totalQuestions: 100,
    correctAnswers: 82,
    accuracyPercentage: 82.0,
    repeatAttemptsCount: 3
  },
  {
    id: 'PRAC-003',
    studentId: 'NIET-2026-003',
    topicId: 'TOPIC-DSA-03',
    quizzesAttempted: 3,
    quizzesCompleted: 2,
    totalQuestions: 30,
    correctAnswers: 14,
    accuracyPercentage: 46.7,
    repeatAttemptsCount: 0
  },
  {
    id: 'PRAC-004',
    studentId: 'NIET-2026-004',
    topicId: 'TOPIC-AIML-02',
    quizzesAttempted: 6,
    quizzesCompleted: 6,
    totalQuestions: 60,
    correctAnswers: 45,
    accuracyPercentage: 75.0,
    repeatAttemptsCount: 1
  },
  {
    id: 'PRAC-005',
    studentId: 'NIET-2026-005',
    topicId: 'TOPIC-DSA-04',
    quizzesAttempted: 5,
    quizzesCompleted: 4,
    totalQuestions: 50,
    correctAnswers: 31,
    accuracyPercentage: 62.0,
    repeatAttemptsCount: 2
  }
];

export function getInitialAppState(): AppState {
  return {
    students: INITIAL_STUDENTS,
    subjects: INITIAL_SUBJECTS,
    topics: INITIAL_TOPICS,
    assessments: INITIAL_ASSESSMENTS,
    studyHabits: INITIAL_STUDY_HABITS,
    engagementRecords: INITIAL_ENGAGEMENT,
    attendanceRecords: INITIAL_ATTENDANCE,
    practiceActivities: INITIAL_PRACTICE_ACTIVITIES,
    recommendations: [],
    reviewThreshold: 60.0,
    dataSource: 'synthetic',
    selectedStudentId: 'NIET-2026-002', // Vyash selected by default for clear progressive trajectory demo
    selectedSubjectId: 'all',
    selectedTopicId: 'all'
  };
}
