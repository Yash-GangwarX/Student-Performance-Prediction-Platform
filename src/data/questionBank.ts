export interface QuizQuestion {
  id: string;
  topicId: string;
  questionText: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
  difficulty: 'Introductory' | 'Standard' | 'Advanced';
}

export const TOPIC_QUESTIONS: Record<string, QuizQuestion[]> = {
  // ==========================================
  // TOPIC-DSA-01: Arrays & Strings (20 Questions)
  // ==========================================
  'TOPIC-DSA-01': [
    {
      id: 'DSA-01-01',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is the index of the first element in a standard 0-indexed array?',
      options: ['0', '1', '-1', 'null'],
      correctIndex: 0,
      explanation: 'In 0-indexed programming languages (like C, C++, Java, and Python), array indexing starts at 0.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-02',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is the time complexity to access any element by its index in an array?',
      options: ['O(1) Constant time', 'O(n) Linear time', 'O(log n) Logarithmic time', 'O(n²) Quadratic time'],
      correctIndex: 0,
      explanation: 'Arrays store elements in contiguous memory locations, allowing direct memory address calculation (base + index * size) in O(1) time.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-03',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is the time complexity of searching for an element in an unsorted array of size n using Linear Search?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'],
      correctIndex: 0,
      explanation: 'Linear search checks each element one by one from start to end, requiring O(n) comparisons in the worst case.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-04',
      topicId: 'TOPIC-DSA-01',
      questionText: 'Which of the following words is a Palindrome (reads the same forwards and backwards)?',
      options: ['radar', 'computer', 'science', 'algorithm'],
      correctIndex: 0,
      explanation: '"radar" reversed is "radar", making it a palindrome.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-05',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is the maximum number of elements an array declared as arr[10] can store?',
      options: ['10', '9', '11', 'Unlimited'],
      correctIndex: 0,
      explanation: 'An array declared with size 10 allocates exactly 10 slots (indices 0 through 9).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-06',
      topicId: 'TOPIC-DSA-01',
      questionText: 'How can an array be reversed in-place with O(1) extra space?',
      options: [
        'Swap elements using two pointers starting at the beginning and the end, moving towards the center',
        'Sort the array in descending order',
        'Create a new array and copy items backwards',
        'Use binary search'
      ],
      correctIndex: 0,
      explanation: 'Using two pointers (left and right) and swapping arr[left] with arr[right] reverses the array in O(n) time and O(1) space.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-07',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is the sum of all elements in the array [2, 5, 3, 10]?',
      options: ['20', '18', '25', '15'],
      correctIndex: 0,
      explanation: '2 + 5 + 3 + 10 = 20.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-08',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is an Anagram?',
      options: [
        'A word or phrase formed by rearranging the letters of another word (e.g. "listen" and "silent")',
        'A word that is written backwards',
        'A string containing only digits',
        'An empty string'
      ],
      correctIndex: 0,
      explanation: 'Two strings are anagrams if they contain the exact same characters with the exact same frequencies in a different order.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-09',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What does Kadane’s algorithm compute in O(n) linear time?',
      options: [
        'The maximum contiguous subarray sum',
        'The shortest path in a graph',
        'The reverse of a string',
        'The median of two arrays'
      ],
      correctIndex: 0,
      explanation: 'Kadane’s algorithm finds the contiguous subarray with the largest sum in O(n) time and O(1) space.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-01-10',
      topicId: 'TOPIC-DSA-01',
      questionText: 'In a dynamic array (like std::vector or ArrayList), what is the average amortized time to append an element at the end?',
      options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
      correctIndex: 0,
      explanation: 'Geometric capacity doubling ensures that n appends cost O(n) total time, yielding an amortized cost of O(1) per append.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-01-11',
      topicId: 'TOPIC-DSA-01',
      questionText: 'Given the array [14, 2, 88, 5, 31], what is the maximum element?',
      options: ['88', '31', '14', '5'],
      correctIndex: 0,
      explanation: 'Scanning the array finds 88 as the largest numerical value.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-12',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is a Substring?',
      options: [
        'A contiguous sequence of characters within a string (e.g. "cat" in "education")',
        'Any set of characters in arbitrary order',
        'A string converted to uppercase',
        'A string containing only vowels'
      ],
      correctIndex: 0,
      explanation: 'A substring must be contiguous. If non-contiguous characters are allowed while preserving relative order, it is called a subsequence.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-13',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What technique uses two pointers to find two numbers in a sorted array that sum to a target value?',
      options: [
        'Two-pointer approach (converging left from start and right from end)',
        'Breadth-first search',
        'Bubble sort',
        'Recursion tree'
      ],
      correctIndex: 0,
      explanation: 'Because the array is sorted, incrementing left increases the sum and decrementing right decreases the sum, finding the pair in O(n) time.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-01-14',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is the length of the string "Artificial Intelligence"?',
      options: ['23 (including the space)', '22', '24', '20'],
      correctIndex: 0,
      explanation: '"Artificial" has 10 letters, "Intelligence" has 12 letters, plus 1 space = 23 characters.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-15',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What error occurs if code attempts to read arr[15] in an array of size 10?',
      options: [
        'Array Index Out of Bounds Exception / Buffer Overflow',
        'Stack Overflow Error',
        'Syntax Error',
        'Arithmetic Zero Division'
      ],
      correctIndex: 0,
      explanation: 'Valid indices for size 10 are 0 to 9. Accessing index 15 exceeds allocated bounds.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-16',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is a Prefix Sum array useful for?',
      options: [
        'Answering range sum queries in O(1) constant time after O(n) precomputation',
        'Sorting strings alphabetically',
        'Finding prime numbers',
        'Encrypting passwords'
      ],
      correctIndex: 0,
      explanation: 'With prefix[i] storing the sum of elements from 0 to i, any range sum between indices L and R is computed in O(1) via prefix[R] - prefix[L-1].',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-01-17',
      topicId: 'TOPIC-DSA-01',
      questionText: 'How many comparisons are required in the best case for linear search if the target is at index 0?',
      options: ['1 comparison', 'n comparisons', 'log n comparisons', '0 comparisons'],
      correctIndex: 0,
      explanation: 'If the target is the very first element, linear search succeeds immediately after 1 comparison.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-18',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is the time complexity to find the length of a null-terminated string of n characters?',
      options: ['O(n)', 'O(1)', 'O(n²)', 'O(log n)'],
      correctIndex: 0,
      explanation: 'Standard strlen() iterates from the start until encountering the null terminator \'\\0\', taking O(n) time.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-01-19',
      topicId: 'TOPIC-DSA-01',
      questionText: 'Which algorithm sorts an array containing only 0s, 1s, and 2s in-place in linear O(n) time?',
      options: [
        'Dutch National Flag Algorithm (3-pointer partition)',
        'Merge Sort',
        'Binary Search',
        'Dijkstra’s Algorithm'
      ],
      correctIndex: 0,
      explanation: 'The Dutch National Flag algorithm partitions 0s to the left, 1s to the middle, and 2s to the right in a single O(n) pass.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-01-20',
      topicId: 'TOPIC-DSA-01',
      questionText: 'What is the result of concatenating string "Data" with string "Base"?',
      options: ['"DataBase"', '"Data Base"', '"Data+Base"', '"Data"'],
      correctIndex: 0,
      explanation: 'String concatenation appends the second string to the first: "Data" + "Base" = "DataBase".',
      difficulty: 'Introductory'
    }
  ],

  // ==========================================
  // TOPIC-DSA-02: Linked Lists & Stacks (20 Questions)
  // ==========================================
  'TOPIC-DSA-02': [
    {
      id: 'DSA-02-01',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What principle does a Stack data structure follow?',
      options: ['LIFO (Last In, First Out)', 'FIFO (First In, First Out)', 'Random Access', 'Priority Based'],
      correctIndex: 0,
      explanation: 'A stack operates on LIFO: the most recently inserted item is the first one to be removed.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-02',
      topicId: 'TOPIC-DSA-02',
      questionText: 'Which operation adds a new element onto the top of a stack?',
      options: ['push()', 'pop()', 'peek()', 'enqueue()'],
      correctIndex: 0,
      explanation: 'push() inserts an element at the top of the stack.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-03',
      topicId: 'TOPIC-DSA-02',
      questionText: 'Which operation removes the topmost element from a stack?',
      options: ['pop()', 'push()', 'peek()', 'dequeue()'],
      correctIndex: 0,
      explanation: 'pop() removes and returns the element currently at the top of the stack.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-04',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What does a standard node in a singly linked list contain?',
      options: [
        'Data and a pointer to the next node',
        'Data and two pointers to left and right children',
        'Only data without pointers',
        'An array index'
      ],
      correctIndex: 0,
      explanation: 'Each node in a singly linked list contains its payload data and a reference (next pointer) to the subsequent node.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-05',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What does the next pointer of the last node in a standard singly linked list point to?',
      options: ['null (or nullptr)', 'The first node (head)', 'Itself', 'A random address'],
      correctIndex: 0,
      explanation: 'The end of a standard singly linked list is marked by a null pointer.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-06',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What is the time complexity to insert a new node at the head (beginning) of a linked list?',
      options: ['O(1) Constant time', 'O(n) Linear time', 'O(n²)', 'O(log n)'],
      correctIndex: 0,
      explanation: 'Setting newNode.next = head and head = newNode takes constant O(1) time regardless of how many nodes exist.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-07',
      topicId: 'TOPIC-DSA-02',
      questionText: 'Which data structure is naturally used to check if parentheses like "{[()]}" are balanced?',
      options: ['Stack', 'Queue', 'Array without pointers', 'Binary Search Tree'],
      correctIndex: 0,
      explanation: 'A stack stores open brackets; when a closing bracket is met, it must match the most recently pushed opening bracket (LIFO).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-08',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What condition causes a Stack Overflow?',
      options: [
        'Pushing elements into a full stack or calling infinite recursive functions',
        'Popping from an empty stack',
        'Inserting null into an array',
        'Sorting a linked list'
      ],
      correctIndex: 0,
      explanation: 'Stack overflow occurs when allocated stack memory space is exceeded, frequently due to infinite recursion.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-09',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What condition causes a Stack Underflow?',
      options: [
        'Attempting to pop() or peek() from an empty stack',
        'Pushing too many elements',
        'Memory allocation error',
        'Division by zero'
      ],
      correctIndex: 0,
      explanation: 'Stack underflow arises when trying to remove an item from a stack containing zero elements.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-10',
      topicId: 'TOPIC-DSA-02',
      questionText: 'In a Doubly Linked List, what pointers does each node maintain?',
      options: [
        'A pointer to the next node and a pointer to the previous node',
        'A pointer to the root and leaf',
        'Only one pointer to the head',
        'Four pointers'
      ],
      correctIndex: 0,
      explanation: 'A doubly linked list node contains two pointers: prev (to previous node) and next (to next node).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-11',
      topicId: 'TOPIC-DSA-02',
      questionText: 'If you push 10, then push 20, then push 30 onto an empty stack, which element is on top?',
      options: ['30', '10', '20', '0'],
      correctIndex: 0,
      explanation: 'Because 30 was pushed last, it resides at the top of the stack.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-12',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What does the peek() method do on a stack?',
      options: [
        'Returns the top element without removing it',
        'Removes and deletes the top element',
        'Clears the entire stack',
        'Reverses the stack elements'
      ],
      correctIndex: 0,
      explanation: 'peek() (or top()) inspects the element at the top of the stack while leaving the stack unchanged.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-13',
      topicId: 'TOPIC-DSA-02',
      questionText: 'How does Floyd’s Cycle Detection (Tortoise and Hare) algorithm identify a loop in a linked list?',
      options: [
        'One slow pointer moves 1 step while a fast pointer moves 2 steps; if a loop exists, they meet',
        'By counting all nodes twice',
        'By reversing the list',
        'By sorting node addresses'
      ],
      correctIndex: 0,
      explanation: 'Because the fast pointer gains 1 node per step on the slow pointer, they will inevitably collide inside a closed loop.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-02-14',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What is the time complexity to access the k-th element in a singly linked list of size n?',
      options: ['O(k) / O(n) Linear time', 'O(1) Constant time', 'O(log n)', 'O(n²)'],
      correctIndex: 0,
      explanation: 'Unlike arrays with contiguous indexing, a linked list must be traversed node-by-node from the head to reach the k-th node.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-15',
      topicId: 'TOPIC-DSA-02',
      questionText: 'In a Circular Linked List, what does the last node point to?',
      options: [
        'Back to the first node (head)',
        'null',
        'The middle node',
        'An empty array'
      ],
      correctIndex: 0,
      explanation: 'In a circular linked list, the tail node links back to the head node, forming a closed ring.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-16',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What is the Postfix expression for the mathematical expression (3 + 4)?',
      options: ['3 4 +', '+ 3 4', '3 + 4', '+ 4 3'],
      correctIndex: 0,
      explanation: 'In postfix notation (Reverse Polish), operators follow their operands: (3 + 4) becomes "3 4 +".',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-17',
      topicId: 'TOPIC-DSA-02',
      questionText: 'To delete a node B located between node A and node C in a singly linked list (A -> B -> C), what pointer update is performed?',
      options: ['A.next = C (bypassing node B)', 'B.next = null only', 'A.next = B', 'C.next = A'],
      correctIndex: 0,
      explanation: 'Updating A.next to point directly to B.next (which is C) unlinks node B from the sequence.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-18',
      topicId: 'TOPIC-DSA-02',
      questionText: 'What is the size of an empty stack?',
      options: ['0', '1', '-1', 'Infinity'],
      correctIndex: 0,
      explanation: 'An empty stack contains 0 elements.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-02-19',
      topicId: 'TOPIC-DSA-02',
      questionText: 'How can you find the middle node of a linked list in a single pass?',
      options: [
        'Move slow pointer 1 step and fast pointer 2 steps; when fast reaches the end, slow is at the middle',
        'Count total nodes then traverse again',
        'Sort the list',
        'Pop elements from a stack'
      ],
      correctIndex: 0,
      explanation: 'Because the fast pointer travels twice as fast as the slow pointer, it reaches the end when the slow pointer reaches the halfway point.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-02-20',
      topicId: 'TOPIC-DSA-02',
      questionText: 'Why is inserting at the beginning of a linked list faster than inserting at the beginning of a fixed array?',
      options: [
        'Linked list insertion is O(1) without shifting; array insertion requires shifting all n elements O(n)',
        'Arrays do not allow insertion',
        'Linked lists use less memory than arrays',
        'Arrays cannot store numbers'
      ],
      correctIndex: 0,
      explanation: 'A linked list only rewires two pointers in O(1) time, whereas an array must shift every existing element right by one position in O(n) time.',
      difficulty: 'Standard'
    }
  ],

  // ==========================================
  // TOPIC-DSA-03: Trees & Binary Search (20 Questions)
  // ==========================================
  'TOPIC-DSA-03': [
    {
      id: 'DSA-03-01',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the maximum number of children any node can have in a Binary Tree?',
      options: ['2', '1', '3', 'Unlimited'],
      correctIndex: 0,
      explanation: 'By definition, a binary tree restricts each node to at most two children (conventionally left and right).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-02',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the topmost node of a tree called?',
      options: ['Root node', 'Leaf node', 'Branch node', 'Sub-node'],
      correctIndex: 0,
      explanation: 'The root node is the single entry point at the top of a tree with no parent.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-03',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is a node with zero children called in a tree?',
      options: ['Leaf node', 'Root node', 'Internal node', 'Ancestor node'],
      correctIndex: 0,
      explanation: 'Nodes that have no child nodes are referred to as leaf (or terminal) nodes.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-04',
      topicId: 'TOPIC-DSA-03',
      questionText: 'In a Binary Search Tree (BST), where are keys smaller than the root node stored?',
      options: [
        'In the left subtree',
        'In the right subtree',
        'At the root itself',
        'In an external array'
      ],
      correctIndex: 0,
      explanation: 'The BST invariant states that all values in the left subtree must be less than the root, and all values in the right subtree must be greater.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-05',
      topicId: 'TOPIC-DSA-03',
      questionText: 'Which traversal of a Binary Search Tree produces values in sorted ascending order?',
      options: [
        'In-order traversal (Left, Root, Right)',
        'Pre-order traversal (Root, Left, Right)',
        'Post-order traversal (Left, Right, Root)',
        'Level-order traversal'
      ],
      correctIndex: 0,
      explanation: 'In-order traversal visits left subtree (smaller), root, and right subtree (larger), naturally producing sorted ascending order.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-06',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the time complexity of Binary Search on a sorted array of size n?',
      options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
      correctIndex: 0,
      explanation: 'Binary search halves the remaining search range at each step, taking O(log2 n) comparisons.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-07',
      topicId: 'TOPIC-DSA-03',
      questionText: 'Does Binary Search require the input array to be sorted?',
      options: [
        'Yes, the array must be sorted in order to discard half the search space',
        'No, it works on any random array',
        'Only if the array contains negative numbers',
        'Only if the array size is even'
      ],
      correctIndex: 0,
      explanation: 'Binary search relies on order to determine whether the target lies in the left or right partition.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-08',
      topicId: 'TOPIC-DSA-03',
      questionText: 'Given the sorted array [2, 5, 8, 12, 16, 23, 38], what is the middle element on the first check?',
      options: ['12', '8', '16', '5'],
      correctIndex: 0,
      explanation: 'Indices range from 0 to 6; mid = (0 + 6) / 2 = index 3, which stores the value 12.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-09',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the order of nodes visited in a Pre-order tree traversal?',
      options: [
        'Root, Left Subtree, Right Subtree',
        'Left Subtree, Root, Right Subtree',
        'Left Subtree, Right Subtree, Root',
        'Level by level'
      ],
      correctIndex: 0,
      explanation: 'Pre-order visits the current Root node first, then traverses the Left subtree, then the Right subtree.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-10',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the order of nodes visited in a Post-order tree traversal?',
      options: [
        'Left Subtree, Right Subtree, Root',
        'Root, Left Subtree, Right Subtree',
        'Left Subtree, Root, Right Subtree',
        'Right Subtree, Left Subtree, Root'
      ],
      correctIndex: 0,
      explanation: 'Post-order visits Left and Right subtrees first before visiting the Root node.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-11',
      topicId: 'TOPIC-DSA-03',
      questionText: 'Which traversal algorithm visits tree nodes horizontal level by horizontal level?',
      options: [
        'Level-Order Traversal (Breadth-First Search using a Queue)',
        'In-order traversal',
        'Depth-First Search',
        'Post-order traversal'
      ],
      correctIndex: 0,
      explanation: 'Level-order traversal uses a FIFO queue to visit all nodes at depth d before proceeding to depth d+1.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-12',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the height of a balanced binary search tree with N nodes?',
      options: ['O(log N)', 'O(N)', 'O(N²)', 'O(1)'],
      correctIndex: 0,
      explanation: 'A balanced binary search tree divides nodes evenly, keeping tree height proportional to log2(N).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-13',
      topicId: 'TOPIC-DSA-03',
      questionText: 'In an AVL Tree, what is the maximum allowed difference between the heights of the left and right subtrees of any node?',
      options: ['1 (Balance factor must be -1, 0, or +1)', '2', '3', '0 strictly'],
      correctIndex: 0,
      explanation: 'An AVL tree is strictly self-balancing such that |Height(Left) - Height(Right)| <= 1 at every node.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-03-14',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is a Full Binary Tree?',
      options: [
        'A binary tree where every node has either 0 or 2 children',
        'A tree with all leaves at different heights',
        'A tree where every node has only 1 child',
        'A tree containing only integers'
      ],
      correctIndex: 0,
      explanation: 'In a full (or 2-tree) binary tree, no node has exactly 1 child; every node has either 0 or 2 children.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-15',
      topicId: 'TOPIC-DSA-03',
      questionText: 'In binary search, if target < arr[mid], which half should be searched next?',
      options: [
        'The left half (high = mid - 1)',
        'The right half (low = mid + 1)',
        'Both halves simultaneously',
        'Stop the search immediately'
      ],
      correctIndex: 0,
      explanation: 'Since the array is sorted ascending, any value smaller than arr[mid] must reside to the left of mid.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-16',
      topicId: 'TOPIC-DSA-03',
      questionText: 'In binary search, if target == arr[mid], what should the algorithm do?',
      options: [
        'Return mid (target is found)',
        'Continue searching right',
        'Return -1',
        'Sort the array'
      ],
      correctIndex: 0,
      explanation: 'When arr[mid] equals target, the search is complete and returns the index mid.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-17',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the minimum number of nodes in a binary tree of height 2 (root is at height 0)?',
      options: ['3 nodes', '1 node', '7 nodes', '10 nodes'],
      correctIndex: 0,
      explanation: 'A path of height 2 requires at least 3 nodes (root -> child -> grandchild).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-18',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the Lowest Common Ancestor (LCA) of two nodes u and v in a tree?',
      options: [
        'The deepest (lowest) node that has both u and v as descendants',
        'The root node always',
        'The node with the smallest value',
        'A leaf node'
      ],
      correctIndex: 0,
      explanation: 'The LCA of u and v is the lowest shared ancestor node on the paths from root to u and v.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-03-19',
      topicId: 'TOPIC-DSA-03',
      questionText: 'What is the worst-case search time in an unbalanced Binary Search Tree of n nodes (e.g. elements inserted in sorted order)?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
      correctIndex: 0,
      explanation: 'Inserting sorted numbers into an unbalanced BST degenerates the tree into a linear linked list of height n, giving O(n) search time.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-03-20',
      topicId: 'TOPIC-DSA-03',
      questionText: 'How many child pointers does a leaf node have in a binary tree?',
      options: ['0', '1', '2', '3'],
      correctIndex: 0,
      explanation: 'A leaf node has no children, so both its left and right pointers are null.',
      difficulty: 'Introductory'
    }
  ],

  // ==========================================
  // TOPIC-DSA-04: Graphs & Traversals (20 Questions)
  // ==========================================
  'TOPIC-DSA-04': [
    {
      id: 'DSA-04-01',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What two basic components make up a Graph?',
      options: ['Vertices (Nodes) and Edges (Links)', 'Keys and Values only', 'Stacks and Queues', 'Rows and Columns only'],
      correctIndex: 0,
      explanation: 'A graph G = (V, E) is formally defined by a set of vertices V connected by edges E.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-02',
      topicId: 'TOPIC-DSA-04',
      questionText: 'Which data structure is primarily used to implement Breadth-First Search (BFS)?',
      options: ['Queue (FIFO)', 'Stack (LIFO)', 'Hash Table alone', 'Binary Search Tree'],
      correctIndex: 0,
      explanation: 'BFS explores nodes layer by layer using a FIFO queue to visit immediate neighbors before deeper ones.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-03',
      topicId: 'TOPIC-DSA-04',
      questionText: 'Which data structure or technique is primarily used to implement Depth-First Search (DFS)?',
      options: ['Stack (LIFO) or Function Call Recursion', 'Queue (FIFO)', 'Priority Queue', 'Dynamic Array'],
      correctIndex: 0,
      explanation: 'DFS dives deep along each branch using recursion (call stack) or an explicit LIFO stack.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-04',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is a Directed Graph (Digraph)?',
      options: [
        'A graph where edges have a defined direction (arrows from one vertex to another)',
        'A graph with no edges',
        'A graph with only 2 vertices',
        'A tree with no root'
      ],
      correctIndex: 0,
      explanation: 'In a directed graph, edges are one-way: an edge from u to v does not imply an edge from v to u.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-05',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is a Cycle in a graph?',
      options: [
        'A path of edges that starts and ends at the exact same vertex',
        'A graph with an odd number of vertices',
        'A tree without any branches',
        'A disconnected node'
      ],
      correctIndex: 0,
      explanation: 'A cycle is a closed loop of edges where a vertex is reachable from itself.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-06',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What algorithm finds the shortest path between two vertices in an unweighted graph?',
      options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Prim’s Algorithm', 'Kruskal’s Algorithm'],
      correctIndex: 0,
      explanation: 'Because BFS explores nodes in order of distance (layer by layer), the first time it reaches the target is guaranteed to be the shortest path.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-07',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is the purpose of Dijkstra’s Algorithm?',
      options: [
        'To find the shortest path from a single source vertex to all other vertices in a non-negative weighted graph',
        'To sort an array of numbers',
        'To detect cycles in undirected graphs only',
        'To find the diameter of a tree'
      ],
      correctIndex: 0,
      explanation: 'Dijkstra’s algorithm uses a priority queue (min-heap) to greedily compute shortest paths in graphs with non-negative weights.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-04-08',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What does DAG stand for in computer science?',
      options: ['Directed Acyclic Graph', 'Dynamic Array Graph', 'Direct Access Grid', 'Data Association Graph'],
      correctIndex: 0,
      explanation: 'A DAG is a directed graph containing zero cycles, essential for topological sorting and task scheduling.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-09',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is a Topological Sort of a Directed Acyclic Graph (DAG)?',
      options: [
        'A linear ordering of vertices such that for every directed edge u -> v, vertex u comes before v',
        'Sorting vertices alphabetically',
        'Reversing all edges in the graph',
        'Finding the maximum edge weight'
      ],
      correctIndex: 0,
      explanation: 'Topological sort arranges tasks respecting all prerequisites: if u is required before v, u appears before v in the order.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-04-10',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is an Adjacency Matrix?',
      options: [
        'A 2D V × V grid where matrix[i][j] indicates whether an edge exists between vertex i and vertex j',
        'A list of vertex names',
        'An array of queues',
        'A binary tree'
      ],
      correctIndex: 0,
      explanation: 'An adjacency matrix represents connections as a V × V 2D array, enabling O(1) edge existence checks.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-11',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is an Adjacency List?',
      options: [
        'An array of lists where list i contains all adjacent neighbors of vertex i',
        'A single 1D array of edge weights',
        'A queue of visited nodes',
        'A matrix with only 1s'
      ],
      correctIndex: 0,
      explanation: 'An adjacency list stores only existing edges, making it memory-efficient for sparse graphs (O(V + E) space).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-12',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is the Degree of a vertex in an undirected graph?',
      options: [
        'The number of edges connected to that vertex',
        'The weight of the vertex',
        'The position in an array',
        'The number of cycles'
      ],
      correctIndex: 0,
      explanation: 'The degree of a vertex counts how many edges touch it.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-13',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is a Minimum Spanning Tree (MST)?',
      options: [
        'A subset of edges that connects all vertices together without any cycles and with minimum possible total edge weight',
        'A tree with the maximum number of leaves',
        'The longest path between any two vertices',
        'A graph with negative cycles'
      ],
      correctIndex: 0,
      explanation: 'An MST spans all V vertices using exactly V-1 edges while minimizing the sum of edge weights.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-04-14',
      topicId: 'TOPIC-DSA-04',
      questionText: 'Which two famous greedy algorithms are used to find a Minimum Spanning Tree?',
      options: [
        'Kruskal’s Algorithm and Prim’s Algorithm',
        'Binary Search and Linear Search',
        'BFS and DFS',
        'Merge Sort and Quick Sort'
      ],
      correctIndex: 0,
      explanation: 'Kruskal’s (edge sorting with DSU) and Prim’s (growing tree with priority queue) find the MST.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-15',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is a Connected Component in an undirected graph?',
      options: [
        'A subgraph in which any two vertices are connected to each other by paths',
        'A cycle of 3 vertices',
        'A node with degree 0',
        'An isolated edge'
      ],
      correctIndex: 0,
      explanation: 'A connected component is a maximal set of vertices such that every pair has a connecting path.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-16',
      topicId: 'TOPIC-DSA-04',
      questionText: 'In a graph traversal, why is a "visited" set or boolean array used?',
      options: [
        'To prevent visiting the same vertex multiple times and avoid infinite loops in cyclic graphs',
        'To sort the edge weights',
        'To delete vertices',
        'To increase recursion depth'
      ],
      correctIndex: 0,
      explanation: 'Tracking visited nodes ensures each vertex is processed once and prevents cyclic infinite loops.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-17',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What is the in-degree of a vertex in a directed graph?',
      options: [
        'The number of incoming edges pointing into that vertex',
        'The number of outgoing edges leaving that vertex',
        'The total weight of the vertex',
        'The number of neighbors'
      ],
      correctIndex: 0,
      explanation: 'In-degree counts arrows pointing into the node; out-degree counts arrows pointing out.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-18',
      topicId: 'TOPIC-DSA-04',
      questionText: 'Can a graph containing a cycle have a valid Topological Sort?',
      options: [
        'No, a cycle creates circular dependencies where no node can be placed first',
        'Yes, any graph can be topologically sorted',
        'Only if the graph is undirected',
        'Only if all weights are positive'
      ],
      correctIndex: 0,
      explanation: 'If A -> B and B -> A, neither can precede the other, making topological ordering impossible.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-19',
      topicId: 'TOPIC-DSA-04',
      questionText: 'How many edges are in a tree with V vertices?',
      options: ['V - 1', 'V', 'V + 1', 'V * 2'],
      correctIndex: 0,
      explanation: 'Every connected acyclic graph (tree) with V vertices has exactly V - 1 edges.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-04-20',
      topicId: 'TOPIC-DSA-04',
      questionText: 'What algorithm can find shortest paths even when edge weights are negative?',
      options: ['Bellman-Ford Algorithm', 'Dijkstra’s Algorithm', 'Prim’s Algorithm', 'Kruskal’s Algorithm'],
      correctIndex: 0,
      explanation: 'Bellman-Ford relaxes edges V-1 times, handling negative weights and detecting negative weight cycles.',
      difficulty: 'Standard'
    }
  ],

  // ==========================================
  // TOPIC-DSA-05: Dynamic Programming (20 Questions)
  // ==========================================
  'TOPIC-DSA-05': [
    {
      id: 'DSA-05-01',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What is the core idea behind Dynamic Programming (DP)?',
      options: [
        'Breaking problems into subproblems and storing subproblem results to avoid redundant calculations',
        'Random guessing until a valid solution is found',
        'Sorting data before searching',
        'Converting code into assembly language'
      ],
      correctIndex: 0,
      explanation: 'Dynamic Programming solves each subproblem once and caches its solution, transforming exponential time into polynomial time.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-02',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What are the two essential properties needed for a problem to be solved using Dynamic Programming?',
      options: [
        'Overlapping Subproblems and Optimal Substructure',
        'Greedy Choice Property and Infinite Memory',
        'Negative Edge Weights and Graph Cycles',
        'Sorted Input and Random Variables'
      ],
      correctIndex: 0,
      explanation: 'Optimal substructure means optimal solutions to subproblems build the overall solution; overlapping subproblems means identical subproblems recur.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-03',
      topicId: 'TOPIC-DSA-05',
      questionText: 'In computing the Fibonacci sequence, what is the recurrence relation for F(n)?',
      options: ['F(n) = F(n-1) + F(n-2)', 'F(n) = F(n-1) * F(n-2)', 'F(n) = F(n-1) - 1', 'F(n) = 2 * F(n-1)'],
      correctIndex: 0,
      explanation: 'Each Fibonacci number is the sum of the two preceding ones: F(n) = F(n-1) + F(n-2).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-04',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What are the base cases for the standard Fibonacci sequence?',
      options: ['F(0) = 0 and F(1) = 1', 'F(0) = 1 and F(1) = 2', 'F(0) = -1 and F(1) = 0', 'F(0) = 10 and F(1) = 20'],
      correctIndex: 0,
      explanation: 'The standard Fibonacci sequence begins with 0 and 1: 0, 1, 1, 2, 3, 5, 8...',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-05',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What is Top-Down Dynamic Programming with caching commonly called?',
      options: ['Memoization', 'Tabulation', 'Greedy Search', 'Divide and Conquer'],
      correctIndex: 0,
      explanation: 'Memoization uses top-down recursion while storing (caching) the return values of subproblems in an array or map.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-06',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What is Bottom-Up Dynamic Programming by filling a table iteratively called?',
      options: ['Tabulation', 'Memoization', 'Breadth-First Search', 'Backtracking'],
      correctIndex: 0,
      explanation: 'Tabulation builds solutions iteratively starting from base cases and working up to the target state.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-07',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What is the time complexity to compute the n-th Fibonacci number using Dynamic Programming?',
      options: ['O(n) Linear time', 'O(2^n) Exponential time', 'O(n!) Factorial time', 'O(n³)'],
      correctIndex: 0,
      explanation: 'Storing previous values allows computing each Fibonacci number in 1 step, resulting in O(n) total time instead of naive O(2^n).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-08',
      topicId: 'TOPIC-DSA-05',
      questionText: 'In the 0/1 Knapsack problem, what does "0/1" signify?',
      options: [
        'An item can either be taken completely (1) or left behind (0); fractional items are not allowed',
        'Binary digits only',
        'There are only 2 items in total',
        'The knapsack has capacity 0 or 1'
      ],
      correctIndex: 0,
      explanation: '"0/1" indicates binary choice: you cannot break or duplicate items.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-09',
      topicId: 'TOPIC-DSA-05',
      questionText: 'In the Coin Change Problem (minimum coins to make amount A), what is the base case for amount 0?',
      options: ['0 coins', 'Infinity', '-1', '1 coin'],
      correctIndex: 0,
      explanation: 'To make an amount of 0, exactly 0 coins are needed: dp[0] = 0.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-10',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What does LCS stand for in standard computer science problems?',
      options: ['Longest Common Subsequence', 'Lowest Cost Search', 'Linear Continuous String', 'Linked Circular Stack'],
      correctIndex: 0,
      explanation: 'Longest Common Subsequence (LCS) finds the longest sequence appearing in both strings in relative order.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-11',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What is the LCS of strings "ABC" and "AC"?',
      options: ['"AC" (length 2)', '"ABC"', '"A"', '"C"'],
      correctIndex: 0,
      explanation: 'Characters \'A\' and \'C\' appear in both strings in the same order, with maximum length 2.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-12',
      topicId: 'TOPIC-DSA-05',
      questionText: 'In the House Robber problem (cannot rob two adjacent houses), what does dp[i] represent?',
      options: [
        'The maximum money that can be robbed up to house i',
        'The number of police cars',
        'The length of the street',
        'The minimum money in house i'
      ],
      correctIndex: 0,
      explanation: 'dp[i] stores the optimal loot up to house i: max(dp[i-1], dp[i-2] + money[i]).',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-05-13',
      topicId: 'TOPIC-DSA-05',
      questionText: 'How many ways are there to climb 1 step if you can take 1 or 2 steps at a time (Climbing Stairs problem)?',
      options: ['1 way (take 1 step)', '2 ways', '0 ways', '3 ways'],
      correctIndex: 0,
      explanation: 'To climb 1 step, there is only 1 possibility: taking a single step of size 1.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-14',
      topicId: 'TOPIC-DSA-05',
      questionText: 'In the Climbing Stairs problem, how many ways are there to climb 2 steps (taking 1 or 2 steps at a time)?',
      options: ['2 ways (1+1 or 2)', '1 way', '3 ways', '4 ways'],
      correctIndex: 0,
      explanation: 'Two possibilities exist: two single steps (1+1) or one double step (2).',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-15',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What classic algorithmic problem determines the minimum operations (insert, delete, replace) to convert string A into string B?',
      options: ['Edit Distance (Levenshtein Distance)', 'Shortest Path', 'Binary Search', 'Linear Regression'],
      correctIndex: 0,
      explanation: 'Edit distance counts minimum edits to transform one string into another using dynamic programming.',
      difficulty: 'Standard'
    },
    {
      id: 'DSA-05-16',
      topicId: 'TOPIC-DSA-05',
      questionText: 'If two strings are identical ("test" and "test"), what is their Edit Distance?',
      options: ['0', '1', '4', '-1'],
      correctIndex: 0,
      explanation: 'Zero edits are required to transform a string into its identical self.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-17',
      topicId: 'TOPIC-DSA-05',
      questionText: 'In a 2D grid of size M × N, if you can only move Right or Down, how many ways can you reach cell (0, 0) from (0, 0)?',
      options: ['1 way', '0 ways', '2 ways', 'M + N ways'],
      correctIndex: 0,
      explanation: 'Starting at (0, 0), you are already at (0, 0), so there is exactly 1 trivial way.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-18',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What is the space complexity to calculate the n-th Fibonacci number when keeping only the last two values in variables?',
      options: ['O(1) Constant space', 'O(n) Linear space', 'O(n²)', 'O(log n)'],
      correctIndex: 0,
      explanation: 'Because each number only needs the previous two numbers, storing them in two variables takes O(1) auxiliary space.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-19',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What does LIS stand for in array problems?',
      options: ['Longest Increasing Subsequence', 'Lowest Item Selection', 'Linear Index Sequence', 'Largest Interval Set'],
      correctIndex: 0,
      explanation: 'LIS finds the longest subsequence where elements strictly increase from left to right.',
      difficulty: 'Introductory'
    },
    {
      id: 'DSA-05-20',
      topicId: 'TOPIC-DSA-05',
      questionText: 'What is the LIS of the array [10, 20, 10, 30]?',
      options: ['[10, 20, 30] (length 3)', '[10, 10]', '[10, 20, 10, 30]', '[30]'],
      correctIndex: 0,
      explanation: 'The sequence 10 -> 20 -> 30 strictly increases and has length 3.',
      difficulty: 'Introductory'
    }
  ],

  // ==========================================
  // TOPIC-AIML-01: Linear Algebra & Optimization (20 Questions)
  // ==========================================
  'TOPIC-AIML-01': [
    {
      id: 'AIML-01-01',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is the dot product of two 2D vectors u = [1, 2] and v = [3, 4]?',
      options: ['11 (1*3 + 2*4)', '7', '10', '14'],
      correctIndex: 0,
      explanation: 'u · v = (1 × 3) + (2 × 4) = 3 + 8 = 11.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-02',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is the dot product of two perpendicular (orthogonal) vectors?',
      options: ['0', '1', '-1', 'Infinity'],
      correctIndex: 0,
      explanation: 'u · v = ||u|| ||v|| cos(90°) = 0. Perpendicular vectors have a dot product of zero.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-03',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is the Transpose of a 2 × 3 matrix?',
      options: ['A 3 × 2 matrix', 'A 2 × 3 matrix', 'A 3 × 3 matrix', 'A scalar number'],
      correctIndex: 0,
      explanation: 'Transposing a matrix swaps rows and columns, turning dimensions (m × n) into (n × m).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-04',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is the Identity Matrix I multiplied by any vector x?',
      options: ['The vector x itself (I * x = x)', 'Zero vector', 'Negative x', 'The transpose of x'],
      correctIndex: 0,
      explanation: 'The identity matrix acts as the neutral element in matrix multiplication (like multiplying by 1).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-05',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is the determinant of the 2 × 2 matrix [[2, 1], [3, 4]]?',
      options: ['5 (2*4 - 1*3)', '8', '11', '0'],
      correctIndex: 0,
      explanation: 'det = (a * d) - (b * c) = (2 * 4) - (1 * 3) = 8 - 3 = 5.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-06',
      topicId: 'TOPIC-AIML-01',
      questionText: 'In Gradient Descent, what hyperparameter controls the size of each step taken towards the minimum?',
      options: ['Learning Rate (alpha / eta)', 'Batch size', 'Number of epochs', 'Random seed'],
      correctIndex: 0,
      explanation: 'The learning rate scales the gradient vector to determine how far parameters move in each iteration.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-07',
      topicId: 'TOPIC-AIML-01',
      questionText: 'In which direction does Gradient Descent update parameters to minimize a loss function?',
      options: [
        'In the opposite direction of the gradient (-learning_rate * gradient)',
        'In the exact same direction as the gradient',
        'At random angles',
        'Towards higher loss values'
      ],
      correctIndex: 0,
      explanation: 'The gradient points in the direction of steepest increase; moving in the negative gradient direction decreases loss.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-08',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What happens if the learning rate in gradient descent is set too large?',
      options: [
        'The parameters may overshoot the minimum and diverge or oscillate wildly',
        'It converges in exactly 1 step',
        'The loss function becomes zero immediately',
        'Gradients disappear'
      ],
      correctIndex: 0,
      explanation: 'An overly large learning rate causes big jumps that overshoot the valley, failing to converge.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-09',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is an Eigenvector v of a matrix A defined as?',
      options: [
        'A vector whose direction does not change under transformation A (it is only scaled by factor λ)',
        'A vector with all elements equal to 0',
        'A vector that points to the origin',
        'The inverse of the matrix'
      ],
      correctIndex: 0,
      explanation: 'A * v = λ * v. Transformation A merely scales eigenvector v by eigenvalue λ without rotating it.',
      difficulty: 'Standard'
    },
    {
      id: 'AIML-01-10',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is the Euclidean distance between points (0, 0) and (3, 4)?',
      options: ['5 (sqrt(3² + 4²))', '7', '25', '12'],
      correctIndex: 0,
      explanation: 'sqrt((3 - 0)² + (4 - 0)²) = sqrt(9 + 16) = sqrt(25) = 5.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-11',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is a Square Matrix?',
      options: [
        'A matrix with the same number of rows as columns (e.g. 3 × 3)',
        'A matrix with only positive numbers',
        'A matrix with all numbers squared',
        'A 1 × 1 matrix only'
      ],
      correctIndex: 0,
      explanation: 'A square matrix has n rows and n columns.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-12',
      topicId: 'TOPIC-AIML-01',
      questionText: 'At a local minimum of a smooth, differentiable function, what is the gradient equal to?',
      options: ['Zero (0)', '1', 'Infinity', '-1'],
      correctIndex: 0,
      explanation: 'At flat turning points (minima, maxima, saddle points), the slope (gradient) is zero.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-13',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What does PCA (Principal Component Analysis) primarily achieve in machine learning?',
      options: [
        'Dimensionality reduction by projecting data onto directions of maximum variance',
        'Supervised image classification',
        'Text translation',
        'Neural network weight initialization'
      ],
      correctIndex: 0,
      explanation: 'PCA finds orthogonal principal components that retain the maximum variance while reducing feature count.',
      difficulty: 'Standard'
    },
    {
      id: 'AIML-01-14',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is the length (magnitude) of a Unit Vector?',
      options: ['1', '0', '10', 'Varies randomly'],
      correctIndex: 0,
      explanation: 'By definition, a unit vector has a Euclidean norm of exactly 1.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-15',
      topicId: 'TOPIC-AIML-01',
      questionText: 'In Stochastic Gradient Descent (SGD), how are parameter updates calculated?',
      options: [
        'Using the gradient calculated on one random sample (or small mini-batch) at a time',
        'Using the entire dataset at once',
        'Without any gradients',
        'Using manual weights'
      ],
      correctIndex: 0,
      explanation: 'SGD evaluates gradients on single examples (or mini-batches), allowing faster updates and lower memory use.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-16',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is an Invertible (non-singular) matrix?',
      options: [
        'A matrix that has an inverse A^(-1) such that A * A^(-1) = I',
        'A matrix whose determinant is 0',
        'A matrix with only 1 column',
        'A matrix with negative eigenvalues only'
      ],
      correctIndex: 0,
      explanation: 'An invertible matrix has a non-zero determinant (det ≠ 0) and possesses a unique inverse A^(-1).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-17',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is a Convex Function characterized by?',
      options: [
        'A bowl-shaped curve where any local minimum is guaranteed to be a global minimum',
        'A curve with many random peaks and valleys',
        'A function with no minimum',
        'A straight vertical line'
      ],
      correctIndex: 0,
      explanation: 'In convex optimization, any local minimum is automatically the global minimum, guaranteeing convergence.',
      difficulty: 'Standard'
    },
    {
      id: 'AIML-01-18',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What does the L1 Norm of a vector represent?',
      options: [
        'The sum of the absolute values of its components (|x1| + |x2| + ...)',
        'The square root of sum of squares',
        'The maximum element only',
        'The product of elements'
      ],
      correctIndex: 0,
      explanation: 'The L1 norm (Manhattan distance) sums absolute values: ||x||_1 = sum(|x_i|).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-19',
      topicId: 'TOPIC-AIML-01',
      questionText: 'What is the L2 Norm of vector v = [0, 3]?',
      options: ['3 (sqrt(0² + 3²))', '0', '9', '6'],
      correctIndex: 0,
      explanation: 'sqrt(0² + 3²) = sqrt(9) = 3.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-01-20',
      topicId: 'TOPIC-AIML-01',
      questionText: 'Which popular optimization algorithm uses adaptive learning rates and momentum for fast convergence in deep learning?',
      options: ['Adam Optimizer', 'Bubble Sort', 'Linear Search', 'K-Means'],
      correctIndex: 0,
      explanation: 'Adam (Adaptive Moment Estimation) combines momentum and RMSprop for reliable and rapid optimization.',
      difficulty: 'Standard'
    }
  ],

  // ==========================================
  // TOPIC-AIML-02: Supervised Learning (20 Questions)
  // ==========================================
  'TOPIC-AIML-02': [
    {
      id: 'AIML-02-01',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What defines Supervised Learning?',
      options: [
        'Training data consists of input features paired with correct ground-truth target labels',
        'Training without any labels or feedback',
        'Learning solely through game rewards',
        'Clustering unlabeled points'
      ],
      correctIndex: 0,
      explanation: 'Supervised learning trains models on labeled datasets (features X paired with target labels Y).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-02',
      topicId: 'TOPIC-AIML-02',
      questionText: 'Which task predicts a continuous numerical quantity (e.g. predicting house price or student test score)?',
      options: ['Regression', 'Classification', 'Clustering', 'Dimensionality Reduction'],
      correctIndex: 0,
      explanation: 'Regression predicts continuous real numbers, whereas classification predicts discrete categories.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-03',
      topicId: 'TOPIC-AIML-02',
      questionText: 'Which task predicts discrete category labels (e.g. spam vs non-spam, pass vs fail)?',
      options: ['Classification', 'Regression', 'Matrix Multiplication', 'Sorting'],
      correctIndex: 0,
      explanation: 'Classification categorizes input samples into discrete classes.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-04',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What equation describes a simple Linear Regression line with one input feature x?',
      options: ['y = m * x + c (or y = w * x + b)', 'y = x²', 'y = log(x)', 'y = sin(x)'],
      correctIndex: 0,
      explanation: 'Simple linear regression fits the straight line equation y = weight * x + bias.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-05',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What activation function squashes linear outputs into probabilities between 0 and 1 in Logistic Regression?',
      options: ['Sigmoid function', 'ReLU function', 'Linear function', 'Step function'],
      correctIndex: 0,
      explanation: 'The sigmoid function σ(z) = 1 / (1 + e^(-z)) maps any real number into the probability range (0, 1).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-06',
      topicId: 'TOPIC-AIML-02',
      questionText: 'In a Decision Tree, what is the starting top node called?',
      options: ['Root node', 'Leaf node', 'Terminal node', 'Branch node'],
      correctIndex: 0,
      explanation: 'A decision tree starts at the Root node, branching based on feature split conditions.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-07',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What is an ensemble formed by combining predictions from multiple decision trees called?',
      options: ['Random Forest', 'Single Perceptron', 'Linear Regression', 'K-Means'],
      correctIndex: 0,
      explanation: 'A Random Forest aggregates predictions from an ensemble of diverse decision trees to improve accuracy and reduce variance.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-08',
      topicId: 'TOPIC-AIML-02',
      questionText: 'How does the k-Nearest Neighbors (k-NN) algorithm classify a new query point?',
      options: [
        'By looking at the k closest training points and taking a majority vote',
        'By training a deep neural network',
        'By fitting a polynomial curve',
        'By calculating determinants'
      ],
      correctIndex: 0,
      explanation: 'k-NN computes distance (e.g. Euclidean) to all training points and assigns the majority class among the k closest neighbors.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-09',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What is Overfitting in machine learning?',
      options: [
        'When a model memorizes training noise and performs poorly on unseen test data',
        'When a model is too simple to learn anything',
        'When training loss equals testing loss',
        'When data has no missing values'
      ],
      correctIndex: 0,
      explanation: 'Overfitting occurs when a complex model fits the training set too closely, losing generalization ability on new data.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-10',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What is Underfitting in machine learning?',
      options: [
        'When a model is too simple to capture the underlying pattern, showing high error on both train and test data',
        'When test accuracy is 100%',
        'When the dataset has too many columns',
        'When learning rate is 0'
      ],
      correctIndex: 0,
      explanation: 'Underfitting happens when a model lacks capacity (e.g. fitting a straight line to a wave pattern).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-11',
      topicId: 'TOPIC-AIML-02',
      questionText: 'Why do we split a dataset into Training and Testing sets?',
      options: [
        'To train the model on one portion and independently evaluate generalization performance on unseen test data',
        'To speed up CPU processing only',
        'Because algorithms require even numbers of samples',
        'To delete duplicate rows'
      ],
      correctIndex: 0,
      explanation: 'Evaluating on a held-out test set verifies how well the model predicts new, unseen observations.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-12',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What does SVM stand for in machine learning?',
      options: ['Support Vector Machine', 'Standard Vector Method', 'Supervised Value Model', 'Simple Variable Measure'],
      correctIndex: 0,
      explanation: 'SVM stands for Support Vector Machine.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-13',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What is the goal of Support Vector Machines (SVM)?',
      options: [
        'To find the separating hyperplane with the maximum margin between classes',
        'To count words in text',
        'To construct an infinite loop',
        'To compute square roots'
      ],
      correctIndex: 0,
      explanation: 'SVM searches for the decision boundary that leaves the largest possible margin to the nearest data points (support vectors).',
      difficulty: 'Standard'
    },
    {
      id: 'AIML-02-14',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What does L1 Regularization (Lasso) tend to do to uninformative feature weights?',
      options: [
        'Drives their weights strictly to zero, performing automatic feature selection',
        'Multiplies weights by 100',
        'Increases variance to infinity',
        'Converts weights to text'
      ],
      correctIndex: 0,
      explanation: 'Lasso regularization penalizes the absolute sum of weights, pushing unimportant coefficients to exactly zero.',
      difficulty: 'Standard'
    },
    {
      id: 'AIML-02-15',
      topicId: 'TOPIC-AIML-02',
      questionText: 'Which popular classifier is based on Bayes’ Theorem assuming features are independent?',
      options: ['Naive Bayes Classifier', 'Linear Regression', 'K-Means', 'PCA'],
      correctIndex: 0,
      explanation: 'Naive Bayes applies Bayes\' theorem under the "naive" assumption that all features are mutually independent given the class.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-16',
      topicId: 'TOPIC-AIML-02',
      questionText: 'Why is feature scaling (e.g. normalizing age and salary to [0, 1]) important for distance-based algorithms like k-NN?',
      options: [
        'To prevent features with huge numbers (like salary in thousands) from dominating distance calculations over smaller features (like age)',
        'Because computers cannot store large numbers',
        'It converts classification into regression',
        'It removes all labels'
      ],
      correctIndex: 0,
      explanation: 'Without scaling, distance is dominated by features with large numeric scales, ignoring smaller but important features.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-17',
      topicId: 'TOPIC-AIML-02',
      questionText: 'In a decision tree, what node outputs the final class prediction with no further branches?',
      options: ['Leaf node', 'Root node', 'Internal node', 'Split node'],
      correctIndex: 0,
      explanation: 'A leaf node is a terminal node containing the final target label or value.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-18',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What is a typical train-test split ratio used in practice?',
      options: ['80% Training, 20% Testing', '10% Training, 90% Testing', '0% Training, 100% Testing', '50% Training, 0% Testing'],
      correctIndex: 0,
      explanation: 'Common splits allocate the majority (70-80%) to training and the remaining (20-30%) for evaluation.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-19',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What is the purpose of Early Stopping during model training?',
      options: [
        'Halting training when validation loss stops improving to prevent overfitting',
        'Stopping after 1 second always',
        'Shutting down the computer',
        'Deleting the training data'
      ],
      correctIndex: 0,
      explanation: 'Early stopping monitors validation loss and stops training before the model overfits the training set.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-02-20',
      topicId: 'TOPIC-AIML-02',
      questionText: 'What does Bagging (Bootstrap Aggregation) do in Random Forests?',
      options: [
        'Trains multiple trees on random subsets of the training data and averages their predictions',
        'Discards 90% of the data',
        'Trains only a single linear regression',
        'Sorts the data alphabetically'
      ],
      correctIndex: 0,
      explanation: 'Bagging trains trees on random bootstrap samples with replacement, combining their outputs to reduce overall variance.',
      difficulty: 'Standard'
    }
  ],

  // ==========================================
  // TOPIC-AIML-03: Model Evaluation & Metrics (20 Questions)
  // ==========================================
  'TOPIC-AIML-03': [
    {
      id: 'AIML-03-01',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What table displays the counts of True Positives, True Negatives, False Positives, and False Negatives?',
      options: ['Confusion Matrix', 'Adjacency Matrix', 'Identity Matrix', 'Truth Table'],
      correctIndex: 0,
      explanation: 'A Confusion Matrix cross-tabulates actual vs predicted classifications across all classes.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-02',
      topicId: 'TOPIC-AIML-03',
      questionText: 'How is classification Accuracy defined?',
      options: [
        'Total Correct Predictions / Total Predictions ( (TP + TN) / Total )',
        'Total Incorrect Predictions / Total Predictions',
        'True Positives only',
        'False Positives / False Negatives'
      ],
      correctIndex: 0,
      explanation: 'Accuracy measures the percentage of all predictions that were correct.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-03',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What is a False Positive (FP) in medical diagnosis?',
      options: [
        'A healthy patient incorrectly diagnosed as having the disease',
        'A sick patient correctly diagnosed as sick',
        'A sick patient incorrectly diagnosed as healthy',
        'A healthy patient correctly diagnosed as healthy'
      ],
      correctIndex: 0,
      explanation: 'A false positive is a negative instance mistakenly classified as positive (false alarm).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-04',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What is a False Negative (FN) in disease screening?',
      options: [
        'A patient with the disease incorrectly diagnosed as healthy (missed diagnosis)',
        'A healthy patient diagnosed as healthy',
        'A healthy patient diagnosed as sick',
        'A correct diagnosis'
      ],
      correctIndex: 0,
      explanation: 'A false negative misses an actual positive case, which is critical in medical diagnostics.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-05',
      topicId: 'TOPIC-AIML-03',
      questionText: 'How is Precision calculated?',
      options: ['TP / (TP + FP)', 'TP / (TP + FN)', 'TN / (TN + FP)', '(TP + TN) / Total'],
      correctIndex: 0,
      explanation: 'Precision answers: "Out of all instances predicted as positive, how many were truly positive?"',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-06',
      topicId: 'TOPIC-AIML-03',
      questionText: 'How is Recall (Sensitivity) calculated?',
      options: ['TP / (TP + FN)', 'TP / (TP + FP)', 'TN / (TN + FP)', 'FP / (FP + TN)'],
      correctIndex: 0,
      explanation: 'Recall answers: "Out of all actual positive instances, how many did the model correctly identify?"',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-07',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What is the F1-Score?',
      options: [
        'The harmonic mean of Precision and Recall: 2 * (P * R) / (P + R)',
        'The sum of True Positives and True Negatives',
        'The average of accuracy and error rate',
        'The ratio of true positives to total samples'
      ],
      correctIndex: 0,
      explanation: 'F1-Score balances precision and recall into a single metric using their harmonic mean.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-08',
      topicId: 'TOPIC-AIML-03',
      questionText: 'Why is Accuracy misleading on imbalanced datasets (e.g. 99% legitimate emails, 1% spam)?',
      options: [
        'A trivial model predicting "not spam" for everything gets 99% accuracy while detecting 0 spam emails',
        'Because accuracy cannot be calculated on percentages',
        'Because accuracy only works for regression',
        'Because numbers cannot exceed 100'
      ],
      correctIndex: 0,
      explanation: 'On imbalanced data, predicting only the majority class gives deceptive high accuracy while completely failing on the minority class.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-09',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What does an ROC-AUC score of 1.0 indicate?',
      options: [
        'A perfect classifier that separates all positive and negative samples flawlessly',
        'A completely random classifier',
        'A model that failed completely',
        'An overfitted model with 0 training samples'
      ],
      correctIndex: 0,
      explanation: 'An AUC of 1.0 represents ideal discrimination across all probability thresholds.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-10',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What does an ROC-AUC score of 0.5 indicate?',
      options: [
        'Performance identical to random guessing (a coin flip)',
        '100% correct classification',
        'Zero false positives',
        'Overfitting'
      ],
      correctIndex: 0,
      explanation: 'An AUC of 0.5 corresponds to the diagonal random chance line.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-11',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What does MSE stand for in regression evaluation?',
      options: ['Mean Squared Error', 'Maximum Standard Error', 'Mean Sample Estimation', 'Matrix Singular Element'],
      correctIndex: 0,
      explanation: 'Mean Squared Error computes the average of the squared differences between predicted and actual values.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-12',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What is the best (ideal) possible value for Mean Squared Error (MSE)?',
      options: ['0 (perfect predictions with zero error)', '1', '100', '-1'],
      correctIndex: 0,
      explanation: 'When every prediction exactly matches the true value, error is 0.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-13',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What does MAE stand for in regression?',
      options: ['Mean Absolute Error', 'Maximum Average Estimation', 'Multi-Axis Error', 'Minimum Adjusted Error'],
      correctIndex: 0,
      explanation: 'Mean Absolute Error measures the average magnitude of errors without squaring: (1/n) * sum(|actual - predicted|).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-14',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What does an R² (R-squared) score of 1.0 mean in regression?',
      options: [
        'The model explains 100% of the variance in the target variable',
        'The model has 100 errors',
        'The model predicts zero always',
        'The line is horizontal'
      ],
      correctIndex: 0,
      explanation: 'An R² of 1.0 indicates that regression predictions perfectly match the data points.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-15',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What is K-Fold Cross-Validation?',
      options: [
        'Splitting data into K folds, training on K-1 folds and testing on the remaining fold, repeated K times',
        'Multiplying the learning rate by K',
        'Training K independent neural networks on different computers',
        'Deleting K random columns'
      ],
      correctIndex: 0,
      explanation: 'K-Fold cross-validation gives every sample a chance to be in the test set, producing a robust evaluation.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-16',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What is Data Leakage (Target Leakage)?',
      options: [
        'When information from the test set or future data accidentally enters the training process',
        'When computer memory leaks',
        'When data is saved to a USB drive',
        'When an array is printed to console'
      ],
      correctIndex: 0,
      explanation: 'Data leakage gives the model an unrealistic peek at evaluation answers, causing inflated but invalid test scores.',
      difficulty: 'Standard'
    },
    {
      id: 'AIML-03-17',
      topicId: 'TOPIC-AIML-03',
      questionText: 'In spam filtering, if an important email from a professor is marked as spam, what type of error is that?',
      options: ['False Positive (FP)', 'False Negative (FN)', 'True Positive (TP)', 'True Negative (TN)'],
      correctIndex: 0,
      explanation: 'The email is actually legitimate (negative), but was falsely classified as spam (positive).',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-18',
      topicId: 'TOPIC-AIML-03',
      questionText: 'If a bank wants to catch every possible fraudulent transaction, which metric should be maximized?',
      options: ['Recall (Catching all fraud cases)', 'Precision alone', 'Specificity alone', 'Execution speed'],
      correctIndex: 0,
      explanation: 'High recall ensures that virtually all actual fraud cases are flagged for inspection.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-19',
      topicId: 'TOPIC-AIML-03',
      questionText: 'What does a True Negative (TN) mean in cancer screening?',
      options: [
        'A healthy person correctly identified as not having cancer',
        'A sick person correctly identified as sick',
        'A healthy person told they have cancer',
        'A sick person told they are healthy'
      ],
      correctIndex: 0,
      explanation: 'A true negative is a negative case correctly classified as negative.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-03-20',
      topicId: 'TOPIC-AIML-03',
      questionText: 'In K-fold cross validation, if K = 5, what percentage of data is used for testing in each fold?',
      options: ['20% (1/5)', '50%', '80%', '5%'],
      correctIndex: 0,
      explanation: 'With 5 folds, 4 folds (80%) are used for training and 1 fold (20%) is held out for testing in each rotation.',
      difficulty: 'Introductory'
    }
  ],

  // ==========================================
  // TOPIC-AIML-04: Neural Networks & Deep Learning (20 Questions)
  // ==========================================
  'TOPIC-AIML-04': [
    {
      id: 'AIML-04-01',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What are artificial neural networks loosely inspired by?',
      options: [
        'Biological neurons and neural pathways in the human brain',
        'Electrical power grids',
        'Mechanical clocks',
        'Computer hard drives'
      ],
      correctIndex: 0,
      explanation: 'Artificial neural networks draw conceptual inspiration from interconnected networks of biological neurons.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-02',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What is the basic computational unit in an artificial neural network called?',
      options: ['Neuron (or Perceptron)', 'Transistor', 'Pixel', 'Bit'],
      correctIndex: 0,
      explanation: 'The artificial neuron (or node/perceptron) computes a weighted sum of inputs, adds a bias, and applies an activation function.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-03',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What are the three main types of layers in a standard neural network?',
      options: [
        'Input Layer, Hidden Layer(s), and Output Layer',
        'Start Layer, Stop Layer, and Restart Layer',
        'Header, Body, and Footer',
        'Row, Column, and Cell'
      ],
      correctIndex: 0,
      explanation: 'Inputs enter at the input layer, pass through one or more intermediate hidden layers, and produce predictions at the output layer.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-04',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What adjustable parameters are learned during neural network training?',
      options: ['Weights and Biases', 'Number of inputs', 'Operating system clock', 'Monitor resolution'],
      correctIndex: 0,
      explanation: 'Training optimizes weight matrices and bias vectors to minimize prediction loss.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-05',
      topicId: 'TOPIC-AIML-04',
      questionText: 'Why are non-linear activation functions used in neural networks?',
      options: [
        'To enable the network to learn complex non-linear relationships; without them, multiple layers collapse into a single linear model',
        'To speed up addition',
        'To make weights strictly positive',
        'Because matrices cannot be multiplied otherwise'
      ],
      correctIndex: 0,
      explanation: 'A stack of linear layers is mathematically equivalent to a single linear layer. Non-linear activations allow universal function approximation.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-06',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What does the ReLU (Rectified Linear Unit) activation function output for negative inputs?',
      options: ['0', '-1', 'The input itself', '1'],
      correctIndex: 0,
      explanation: 'ReLU(x) = max(0, x). For any negative number, the output is 0.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-07',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What does the ReLU activation function output for positive inputs (e.g. x = 5)?',
      options: ['The input value itself (5)', '0', '1', '-5'],
      correctIndex: 0,
      explanation: 'For any positive input x > 0, ReLU(x) = x.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-08',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What fundamental algorithm calculates gradients of the loss with respect to all weights using the chain rule?',
      options: ['Backpropagation', 'Binary Search', 'Dijkstra’s Algorithm', 'Kruskal’s Algorithm'],
      correctIndex: 0,
      explanation: 'Backpropagation uses the calculus chain rule to propagate error signals backward from the output layer to update all weights.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-09',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What activation function is standard in the output layer for multi-class classification to produce probabilities that sum to 1.0?',
      options: ['Softmax function', 'ReLU function', 'Step function', 'Linear function'],
      correctIndex: 0,
      explanation: 'Softmax exponentiates raw logits and normalizes them so that class probabilities sum to exactly 1.0.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-10',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What is an "Epoch" in neural network training?',
      options: [
        'One complete pass of the entire training dataset through the network',
        'One single gradient update on one image',
        'The total training time in seconds',
        'The number of layers'
      ],
      correctIndex: 0,
      explanation: 'An epoch finishes when every training sample has been passed through the network forward and backward once.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-11',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What is "Batch Size" in deep learning?',
      options: [
        'The number of training samples processed in one forward/backward pass before updating weights',
        'The total number of layers in the network',
        'The file size of the model on disk',
        'The size of the output prediction'
      ],
      correctIndex: 0,
      explanation: 'Batch size defines how many training instances are evaluated together before computing gradient updates.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-12',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What does Dropout regularization do during neural network training?',
      options: [
        'Randomly deactivates (zeroes out) a fraction of neurons in a layer to prevent overfitting',
        'Drops bad training samples permanently',
        'Shuts down the GPU',
        'Decreases learning rate'
      ],
      correctIndex: 0,
      explanation: 'Dropout randomly turns off neurons during training, preventing neurons from excessively co-adapting.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-13',
      topicId: 'TOPIC-AIML-04',
      questionText: 'Which neural network architecture is specialized for processing grid-like data like 2D images?',
      options: [
        'Convolutional Neural Network (CNN)',
        'Recurrent Neural Network (RNN)',
        'Decision Tree',
        'Linear Regression'
      ],
      correctIndex: 0,
      explanation: 'CNNs use sliding convolutional filters to detect spatial patterns (edges, shapes, textures) in images.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-14',
      topicId: 'TOPIC-AIML-04',
      questionText: 'Which neural network architecture is specialized for processing sequential data like text or time-series?',
      options: [
        'Recurrent Neural Network (RNN / LSTM)',
        'Convolutional Neural Network (CNN)',
        'K-Means Clustering',
        'Support Vector Machine'
      ],
      correctIndex: 0,
      explanation: 'RNNs have recurrent loops and internal memory to process sequences step by step.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-15',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What does a Pooling layer (like Max Pooling) do in a CNN?',
      options: [
        'Reduces spatial dimensions (width and height) of feature maps while retaining dominant features',
        'Increases image resolution',
        'Calculates backpropagation',
        'Multiplies pixel values by 2'
      ],
      correctIndex: 0,
      explanation: 'Max pooling takes the maximum value in local patches (e.g. 2×2), downsampling the feature map to reduce parameters.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-16',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What is Transfer Learning?',
      options: [
        'Taking a model trained on a large dataset (like ImageNet) and fine-tuning it for a specific new task',
        'Transferring files across USB drives',
        'Converting code from Python to C++',
        'Copying weights from one neuron to all neurons'
      ],
      correctIndex: 0,
      explanation: 'Transfer learning leverages pre-trained feature representations, requiring far less training data and time.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-17',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What is the Vanishing Gradient problem in deep networks using Sigmoid activations?',
      options: [
        'Gradients become extremely small as they propagate backward through many layers, causing early layers to train very slowly',
        'Weights explode to infinity',
        'The loss becomes negative',
        'RAM runs out'
      ],
      correctIndex: 0,
      explanation: 'Multiplying many small derivatives (< 0.25) through deep layers shrinks gradients close to zero.',
      difficulty: 'Standard'
    },
    {
      id: 'AIML-04-18',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What is an activation function used for binary classification in a single output neuron?',
      options: ['Sigmoid', 'Softmax', 'Linear', 'Step function'],
      correctIndex: 0,
      explanation: 'Sigmoid outputs a probability value in (0, 1), ideal for binary classification.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-19',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What is the purpose of the Loss Function in neural networks?',
      options: [
        'To measure the error or difference between the network’s prediction and the ground truth target',
        'To count the number of neurons',
        'To speed up CPU clock rate',
        'To format output text'
      ],
      correctIndex: 0,
      explanation: 'The loss function provides the numerical error signal that gradient descent seeks to minimize.',
      difficulty: 'Introductory'
    },
    {
      id: 'AIML-04-20',
      topicId: 'TOPIC-AIML-04',
      questionText: 'What architectural innovation in ResNet (Residual Networks) allows training networks over 100 layers deep?',
      options: [
        'Skip / Residual Connections (shortcut connections that add input directly to layer output)',
        'Removing all hidden layers',
        'Using only 1 neuron per layer',
        'Disabling backpropagation'
      ],
      correctIndex: 0,
      explanation: 'Residual skip connections let gradients flow directly backwards through the network without degradation.',
      difficulty: 'Standard'
    }
  ],

  // ==========================================
  // TOPIC-MATH-01: Propositional Logic & Truth Tables (20 Questions)
  // ==========================================
  'TOPIC-MATH-01': [
    {
      id: 'MATH-01-01',
      topicId: 'TOPIC-MATH-01',
      questionText: 'Which of the following is a Proposition (a statement that is either strictly True or False)?',
      options: ['"5 is greater than 3"', '"What time is it?"', '"Please close the door"', '"x + 2 = 7"'],
      correctIndex: 0,
      explanation: '"5 is greater than 3" is a declarative statement that is unambiguously True.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-02',
      topicId: 'TOPIC-MATH-01',
      questionText: 'When is a Conjunction (p ∧ q) True in propositional logic?',
      options: ['Only when both p and q are True', 'When at least one is True', 'Only when both are False', 'Never True'],
      correctIndex: 0,
      explanation: 'Conjunction (AND) is True only when both component propositions are True.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-03',
      topicId: 'TOPIC-MATH-01',
      questionText: 'When is a Disjunction (p ∨ q) False?',
      options: ['Only when both p and q are False', 'When both are True', 'When p is True and q is False', 'Never False'],
      correctIndex: 0,
      explanation: 'Disjunction (OR) is False only when both propositions are False.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-04',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the truth value of the Conditional statement (p → q) when p is False and q is False?',
      options: ['True (vacuously true)', 'False', 'Undefined', 'Contradictory'],
      correctIndex: 0,
      explanation: 'An implication (p → q) is always True when the hypothesis p is False.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-05',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is a proposition called that is True for all possible truth values of its variables?',
      options: ['Tautology', 'Contradiction', 'Contingency', 'Fallacy'],
      correctIndex: 0,
      explanation: 'A compound proposition that is always True is called a Tautology (e.g. p ∨ ¬p).',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-06',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the Contrapositive of the conditional statement "If p, then q" (p → q)?',
      options: ['¬q → ¬p', 'q → p', '¬p → ¬q', 'p ∧ ¬q'],
      correctIndex: 0,
      explanation: 'The contrapositive of p → q is ¬q → ¬p, and it is logically equivalent to the original statement.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-07',
      topicId: 'TOPIC-MATH-01',
      questionText: 'According to De Morgan\'s Law, what is ¬(p ∧ q) logically equivalent to?',
      options: ['¬p ∨ ¬q', '¬p ∧ ¬q', 'p ∨ q', '¬p → q'],
      correctIndex: 0,
      explanation: 'De Morgan\'s Law states ¬(p ∧ q) ≡ ¬p ∨ ¬q.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-08',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the truth table size (number of rows) for a compound proposition with 3 distinct variables (p, q, r)?',
      options: ['8 rows (2³)', '6 rows', '9 rows', '4 rows'],
      correctIndex: 0,
      explanation: 'Each variable has 2 possible values (T/F), so n variables require 2ⁿ = 2³ = 8 rows.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-09',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the negation of "All CSE students pass the midterm"?',
      options: [
        'There exists at least one CSE student who did not pass',
        'No CSE students pass the midterm',
        'All CSE students fail the midterm',
        'Some CSE students pass'
      ],
      correctIndex: 0,
      explanation: '¬(∀x P(x)) ≡ ∃x ¬P(x). The negation of "for all" is "there exists at least one that does not".',
      difficulty: 'Standard'
    },
    {
      id: 'MATH-01-10',
      topicId: 'TOPIC-MATH-01',
      questionText: 'When is the Biconditional statement (p ↔ q) True?',
      options: [
        'When p and q have identical truth values (both True or both False)',
        'Only when p is True',
        'Only when q is True',
        'When p and q have opposite truth values'
      ],
      correctIndex: 0,
      explanation: 'The biconditional (p ↔ q) is True whenever p and q agree in truth value.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-11',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the converse of "If it rains, then the ground is wet"?',
      options: [
        'If the ground is wet, then it rains',
        'If it does not rain, then the ground is not wet',
        'If the ground is not wet, then it does not rain',
        'It rains and the ground is dry'
      ],
      correctIndex: 0,
      explanation: 'The converse of p → q is q → p.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-12',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the logical rule of inference known as Modus Ponens?',
      options: [
        'From p and (p → q), deduce q',
        'From q and (p → q), deduce p',
        'From ¬p, deduce ¬q',
        'From (p ∨ q), deduce p'
      ],
      correctIndex: 0,
      explanation: 'Modus Ponens affirms the antecedent: [p ∧ (p → q)] ⊢ q.',
      difficulty: 'Standard'
    },
    {
      id: 'MATH-01-13',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the logical rule Modus Tollens?',
      options: [
        'From ¬q and (p → q), deduce ¬p',
        'From ¬p and (p → q), deduce ¬q',
        'From p and q, deduce p ∨ q',
        'From q, deduce p'
      ],
      correctIndex: 0,
      explanation: 'Modus Tollens denies the consequent: [¬q ∧ (p → q)] ⊢ ¬p.',
      difficulty: 'Standard'
    },
    {
      id: 'MATH-01-14',
      topicId: 'TOPIC-MATH-01',
      questionText: 'Which property is represented by p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)?',
      options: ['Distributive Law', 'Associative Law', 'Commutative Law', 'Idempotent Law'],
      correctIndex: 0,
      explanation: 'This illustrates the distributive law of conjunction over disjunction.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-15',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is a proposition that is False under every truth assignment called?',
      options: ['Contradiction', 'Tautology', 'Contingency', 'Theorem'],
      correctIndex: 0,
      explanation: 'A contradiction is always False (e.g. p ∧ ¬p).',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-16',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What does the Universal Quantifier symbol (∀) denote?',
      options: ['"For all" / "For every"', '"There exists"', '"Such that"', '"Element of"'],
      correctIndex: 0,
      explanation: '∀ is the universal quantifier meaning "for all" or "for every".',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-17',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What does the Existential Quantifier symbol (∃) denote?',
      options: ['"There exists at least one"', '"For all"', '"If and only if"', '"Equivalent"'],
      correctIndex: 0,
      explanation: '∃ denotes "there exists at least one element".',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-18',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the simplified form of (p ∧ True)?',
      options: ['p', 'True', 'False', '¬p'],
      correctIndex: 0,
      explanation: 'By the Identity Law, p ∧ True ≡ p.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-19',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the simplified form of (p ∨ True)?',
      options: ['True (Domination Law)', 'p', 'False', '¬p'],
      correctIndex: 0,
      explanation: 'By the Domination Law, any proposition OR True is always True.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-01-20',
      topicId: 'TOPIC-MATH-01',
      questionText: 'What is the law that states ¬(¬p) ≡ p?',
      options: ['Double Negation Law', 'De Morgan\'s Law', 'Absorption Law', 'Idempotent Law'],
      correctIndex: 0,
      explanation: 'Negating a negation returns the original proposition: ¬(¬p) ≡ p.',
      difficulty: 'Introductory'
    }
  ],

  // ==========================================
  // TOPIC-MATH-02: Sets, Relations & Functions (20 Questions)
  // ==========================================
  'TOPIC-MATH-02': [
    {
      id: 'MATH-02-01',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is the cardinality of the Power Set P(A) for a set A with 3 elements?',
      options: ['8 (2³)', '6', '3', '9'],
      correctIndex: 0,
      explanation: 'The power set contains 2ⁿ subsets, so 2³ = 8.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-02',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is an Empty Set (∅)?',
      options: ['A set containing zero elements', 'A set containing the number 0', 'A set with undefined size', 'A universal set'],
      correctIndex: 0,
      explanation: 'The empty set ∅ contains no elements; its cardinality |∅| = 0.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-03',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is the Cartesian Product A × B for sets A = {1, 2} and B = {a, b}?',
      options: ['{(1, a), (1, b), (2, a), (2, b)}', '{1, 2, a, b}', '{(1, 2), (a, b)}', '4'],
      correctIndex: 0,
      explanation: 'A × B is the set of all ordered pairs (a, b) where a ∈ A and b ∈ B.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-04',
      topicId: 'TOPIC-MATH-02',
      questionText: 'When is a relation R on set A called Reflexive?',
      options: ['When (a, a) ∈ R for every element a ∈ A', 'When (a, b) ∈ R implies (b, a) ∈ R', 'When (a, b) and (b, c) imply (a, c)', 'When R is empty'],
      correctIndex: 0,
      explanation: 'Reflexivity requires every element to be related to itself: ∀a ∈ A, (a, a) ∈ R.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-05',
      topicId: 'TOPIC-MATH-02',
      questionText: 'When is a relation R Symmetric?',
      options: ['If (a, b) ∈ R, then (b, a) ∈ R for all a, b', 'If (a, a) ∈ R', 'If (a, b) ∈ R and (b, c) ∈ R then (a, c) ∈ R', 'If R has no elements'],
      correctIndex: 0,
      explanation: 'Symmetry means if a is related to b, then b is related to a.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-06',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What three properties define an Equivalence Relation?',
      options: ['Reflexive, Symmetric, and Transitive', 'Reflexive, Antisymmetric, and Transitive', 'Symmetric and Irreflexive', 'Injective, Surjective, and Bijective'],
      correctIndex: 0,
      explanation: 'An equivalence relation must be Reflexive, Symmetric, and Transitive.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-07',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What three properties define a Partial Ordering Relation (POSET)?',
      options: ['Reflexive, Antisymmetric, and Transitive', 'Reflexive, Symmetric, and Transitive', 'Irreflexive and Symmetric', 'Asymmetric only'],
      correctIndex: 0,
      explanation: 'A partial ordering is Reflexive, Antisymmetric, and Transitive.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-08',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is an Injective (One-to-One) function f: A → B?',
      options: ['Different inputs in A map to different outputs in B (f(x) = f(y) ⇒ x = y)', 'Every element in B is mapped to', 'Both one-to-one and onto', 'A constant function'],
      correctIndex: 0,
      explanation: 'An injective function never maps two distinct domain elements to the same codomain element.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-09',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is a Surjective (Onto) function f: A → B?',
      options: ['Every element in codomain B is the image of at least one element in domain A (Range = Codomain)', 'Every input maps to a distinct output', 'Only 1 element in B is used', 'f is not defined on all elements'],
      correctIndex: 0,
      explanation: 'A surjective function covers the entire codomain B.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-10',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is a Bijective function?',
      options: ['Both Injective (one-to-one) and Surjective (onto)', 'Only injective', 'Only surjective', 'Neither injective nor surjective'],
      correctIndex: 0,
      explanation: 'A bijection is both one-to-one and onto, meaning it possesses a unique inverse function.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-11',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is the union of sets A = {1, 2} and B = {2, 3}?',
      options: ['{1, 2, 3}', '{2}', '{1, 3}', '{1, 2, 2, 3}'],
      correctIndex: 0,
      explanation: 'A ∪ B contains all distinct elements in A or B: {1, 2, 3}.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-12',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is the intersection of sets A = {1, 2, 3} and B = {2, 3, 4}?',
      options: ['{2, 3}', '{1, 4}', '{1, 2, 3, 4}', '∅'],
      correctIndex: 0,
      explanation: 'A ∩ B contains elements present in both sets: {2, 3}.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-13',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is the set difference A \\ B for A = {1, 2, 3} and B = {2, 4}?',
      options: ['{1, 3}', '{4}', '{2}', '{1, 2, 3, 4}'],
      correctIndex: 0,
      explanation: 'A \\ B consists of elements in A that are not in B: {1, 3}.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-14',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is the Pigeonhole Principle?',
      options: ['If k+1 items are placed into k boxes, at least one box contains 2 or more items', 'Pigeons always fly in pairs', 'Every set has an empty subset', 'All relations are symmetric'],
      correctIndex: 0,
      explanation: 'The Pigeonhole Principle states if n > k items are put into k containers, at least one container holds > 1 items.',
      difficulty: 'Standard'
    },
    {
      id: 'MATH-02-15',
      topicId: 'TOPIC-MATH-02',
      questionText: 'If |A| = 4 and |B| = 5, what is the cardinality of A × B?',
      options: ['20 (4 × 5)', '9', '1', '25'],
      correctIndex: 0,
      explanation: '|A × B| = |A| × |B| = 4 × 5 = 20.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-16',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is the composition (g ∘ f)(x) defined as?',
      options: ['g(f(x))', 'f(g(x))', 'g(x) × f(x)', 'g(x) + f(x)'],
      correctIndex: 0,
      explanation: 'Function composition (g ∘ f)(x) evaluates f(x) first, then applies g to the result: g(f(x)).',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-17',
      topicId: 'TOPIC-MATH-02',
      questionText: 'Which function has an inverse function f⁻¹?',
      options: ['A bijective function', 'Any relation', 'Only constant functions', 'Only functions with 0 range'],
      correctIndex: 0,
      explanation: 'Only bijective (one-to-one and onto) functions have two-sided inverses.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-18',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is an Antisymmetric relation?',
      options: ['If (a, b) ∈ R and (b, a) ∈ R, then a = b', 'No elements are related', 'All elements are related to themselves', 'Reflexivity does not hold'],
      correctIndex: 0,
      explanation: 'Antisymmetry states that two distinct elements cannot be mutually related: (a, b) ∈ R ∧ (b, a) ∈ R ⇒ a = b.',
      difficulty: 'Standard'
    },
    {
      id: 'MATH-02-19',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What are Disjoint sets?',
      options: ['Sets whose intersection is the empty set (A ∩ B = ∅)', 'Sets with identical elements', 'Infinite sets', 'Complement sets'],
      correctIndex: 0,
      explanation: 'Two sets are disjoint if they share no common elements.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-02-20',
      topicId: 'TOPIC-MATH-02',
      questionText: 'What is the symmetric difference A ⊕ B of two sets?',
      options: ['(A ∪ B) \\ (A ∩ B)', 'A ∩ B', 'A × B', 'The empty set'],
      correctIndex: 0,
      explanation: 'Symmetric difference contains elements that belong to either A or B, but not both.',
      difficulty: 'Standard'
    }
  ],

  // ==========================================
  // TOPIC-MATH-03: Graph Theory Foundations (20 Questions)
  // ==========================================
  'TOPIC-MATH-03': [
    {
      id: 'MATH-03-01',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is the Handshaking Lemma in an undirected graph G = (V, E)?',
      options: ['The sum of degrees of all vertices equals 2 × |E|', 'The sum of degrees equals |V|', 'Every vertex has degree 2', 'Total edges equal vertices minus 1'],
      correctIndex: 0,
      explanation: 'Every edge contributes 1 to the degree of each of its two endpoint vertices: Σ deg(v) = 2|E|.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-02',
      topicId: 'TOPIC-MATH-03',
      questionText: 'In any undirected graph, what must the number of vertices with odd degree be?',
      options: ['Always an even number', 'Always an odd number', 'Always zero', 'Prime'],
      correctIndex: 0,
      explanation: 'Because the sum of degrees is 2|E| (even), the number of odd-degree vertices must be even.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-03',
      topicId: 'TOPIC-MATH-03',
      questionText: 'How many edges does a Tree with n vertices have?',
      options: ['n - 1 edges', 'n edges', 'n + 1 edges', '2n edges'],
      correctIndex: 0,
      explanation: 'A connected acyclic graph (tree) on n vertices always has exactly n - 1 edges.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-04',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is an Eulerian Circuit in a connected graph?',
      options: ['A closed walk that traverses every edge exactly once', 'A path that visits every vertex once', 'A cycle with 3 vertices', 'A tree traversal'],
      correctIndex: 0,
      explanation: 'An Euler circuit visits every edge in the graph exactly once and returns to the starting vertex.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-05',
      topicId: 'TOPIC-MATH-03',
      questionText: 'When does a connected undirected graph contain an Eulerian Circuit?',
      options: ['When every vertex has an even degree', 'When every vertex has an odd degree', 'When it is a tree', 'When it has n edges'],
      correctIndex: 0,
      explanation: 'Euler proved that a connected graph has an Euler circuit if and only if every vertex has an even degree.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-06',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is a Hamiltonian Cycle?',
      options: ['A closed cycle that visits every vertex in the graph exactly once', 'A cycle that traverses every edge once', 'A path with shortest length', 'An acyclic tree'],
      correctIndex: 0,
      explanation: 'A Hamiltonian cycle visits every vertex of the graph exactly once before returning to the start.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-07',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is a Complete Graph K_n?',
      options: ['A simple graph in which every pair of distinct vertices is connected by a unique edge', 'A graph with no edges', 'A graph with 1 cycle', 'A bipartite graph'],
      correctIndex: 0,
      explanation: 'In K_n, every vertex has an edge to every other vertex, giving n(n-1)/2 total edges.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-08',
      topicId: 'TOPIC-MATH-03',
      questionText: 'How many edges are in the complete graph K_5?',
      options: ['10 (5 × 4 / 2)', '5', '20', '15'],
      correctIndex: 0,
      explanation: 'Number of edges = n(n - 1) / 2 = 5(4) / 2 = 10.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-09',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is a Bipartite Graph?',
      options: [
        'A graph whose vertices can be partitioned into two disjoint sets V1 and V2 such that every edge connects a vertex in V1 to V2',
        'A graph with 2 cycles',
        'A graph with directed edges only',
        'A complete graph'
      ],
      correctIndex: 0,
      explanation: 'A graph is bipartite if its vertices can be partitioned into two independent sets.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-10',
      topicId: 'TOPIC-MATH-03',
      questionText: 'Which condition is necessary and sufficient for a graph to be Bipartite (2-colorable)?',
      options: ['It contains no odd-length cycles', 'It has even number of vertices', 'It is connected', 'It has no trees'],
      correctIndex: 0,
      explanation: 'A graph is bipartite if and only if it contains no cycles of odd length.',
      difficulty: 'Standard'
    },
    {
      id: 'MATH-03-11',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is Euler\'s formula for a connected Planar Graph with V vertices, E edges, and F faces (regions)?',
      options: ['V - E + F = 2', 'V + E - F = 2', 'V - E - F = 0', 'V × E = F'],
      correctIndex: 0,
      explanation: 'Euler\'s planar graph formula states V - E + F = 2.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-12',
      topicId: 'TOPIC-MATH-03',
      questionText: 'According to the Four Color Theorem, what is the maximum number of colors needed to color any planar map so adjacent regions have different colors?',
      options: ['4 colors', '5 colors', '3 colors', '6 colors'],
      correctIndex: 0,
      explanation: 'The celebrated Four Color Theorem proves that any planar graph is 4-colorable.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-13',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is the Chromatic Number χ(G) of bipartite graph with at least one edge?',
      options: ['2', '1', '3', 'Depends on edge count'],
      correctIndex: 0,
      explanation: 'By definition, bipartite graphs can be properly colored with exactly 2 colors.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-14',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is an isolated vertex in a graph?',
      options: ['A vertex with degree 0 (no connected edges)', 'A vertex connected to all others', 'A leaf vertex with degree 1', 'A cut vertex'],
      correctIndex: 0,
      explanation: 'An isolated vertex has degree 0 and has no incident edges.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-15',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is a Pendant (Leaf) vertex in a tree?',
      options: ['A vertex with degree 1', 'A vertex with degree 0', 'The root node', 'An internal node'],
      correctIndex: 0,
      explanation: 'A leaf or pendant vertex in a tree has a degree of exactly 1.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-16',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What does Kuratowski\'s Theorem state regarding planar graphs?',
      options: [
        'A graph is planar if and only if it does not contain a subgraph homeomorphic to K_5 or K_3,3',
        'All planar graphs have 4 vertices',
        'Trees are not planar',
        'Bipartite graphs are never planar'
      ],
      correctIndex: 0,
      explanation: 'Kuratowski\'s Theorem characterises planarity by the absence of K_5 and K_3,3 subdivisions.',
      difficulty: 'Standard'
    },
    {
      id: 'MATH-03-17',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is an Adjacency Matrix for a graph with n vertices?',
      options: ['An n × n matrix where entry (i, j) is 1 if edge (i, j) exists, 0 otherwise', 'An n × m matrix', 'A list of weights', 'A diagonal matrix'],
      correctIndex: 0,
      explanation: 'An adjacency matrix is an n × n binary matrix indicating edge existence between vertex pairs.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-18',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is a Spanning Tree of a connected graph G?',
      options: ['A subgraph that is a tree and includes every vertex of G', 'A tree with all edges of G', 'A disconnected forest', 'A directed tree'],
      correctIndex: 0,
      explanation: 'A spanning tree connects all |V| vertices with |V| - 1 edges without any cycles.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-19',
      topicId: 'TOPIC-MATH-03',
      questionText: 'Which algorithm finds a Minimum Spanning Tree (MST) in a weighted connected graph?',
      options: ['Kruskal\'s Algorithm / Prim\'s Algorithm', 'Dijkstra\'s Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall'],
      correctIndex: 0,
      explanation: 'Both Kruskal\'s and Prim\'s algorithms greedily compute the Minimum Spanning Tree.',
      difficulty: 'Introductory'
    },
    {
      id: 'MATH-03-20',
      topicId: 'TOPIC-MATH-03',
      questionText: 'What is an Isomorphism between two graphs G1 and G2?',
      options: [
        'A bijection between vertex sets that preserves edge adjacency and non-adjacency',
        'Having the same number of vertices only',
        'Having identical vertex labels',
        'A planar projection'
      ],
      correctIndex: 0,
      explanation: 'Isomorphic graphs share identical topological structure, differing only in vertex labeling.',
      difficulty: 'Standard'
    }
  ],

  // ==========================================
  // TOPIC-DBMS-01: Relational Modeling & ER Diagrams (20 Questions)
  // ==========================================
  'TOPIC-DBMS-01': [
    {
      id: 'DBMS-01-01',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'In an Entity-Relationship (ER) diagram, what geometric shape represents an Entity Set?',
      options: ['Rectangle', 'Diamond', 'Ellipse / Oval', 'Double circle'],
      correctIndex: 0,
      explanation: 'Rectangles represent entity sets (e.g. Student, Course) in Chen\'s ER notation.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-02',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'In an ER diagram, what shape represents a Relationship between entities?',
      options: ['Diamond', 'Rectangle', 'Circle', 'Triangle'],
      correctIndex: 0,
      explanation: 'Diamonds represent relationship sets (e.g. Enrolls, Teaches) connecting entity sets.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-03',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What shape represents an Attribute of an entity in standard ER diagrams?',
      options: ['Ellipse / Oval', 'Square', 'Hexagon', 'Line'],
      correctIndex: 0,
      explanation: 'Ovals or ellipses represent attributes (e.g. Student_Name, Roll_No).',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-04',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What is a Primary Key in a relational database table?',
      options: [
        'An attribute or minimal set of attributes that uniquely identifies each tuple (row) and cannot contain NULL',
        'Any column that has numbers',
        'A key that points to another table',
        'The last column of the table'
      ],
      correctIndex: 0,
      explanation: 'A primary key enforces entity integrity: unique values and NOT NULL across all tuples.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-05',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What is a Foreign Key?',
      options: [
        'An attribute in one table that references the Primary Key of another table, enforcing referential integrity',
        'A key encrypted with passwords',
        'A key used outside the database',
        'An alternate unique key'
      ],
      correctIndex: 0,
      explanation: 'Foreign keys link related records across tables by referencing the parent primary key.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-06',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'In relational database terminology, what is a single row in a table called?',
      options: ['Tuple', 'Attribute', 'Domain', 'Schema'],
      correctIndex: 0,
      explanation: 'A row in a relational table represents a record and is formally called a Tuple.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-07',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'In relational database terminology, what is a column in a table called?',
      options: ['Attribute', 'Tuple', 'Cardinality', 'Instance'],
      correctIndex: 0,
      explanation: 'A column represents a named field of data and is formally called an Attribute.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-08',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What is the Cardinality of a relational table?',
      options: ['The total number of rows (tuples) in the table', 'The total number of columns (attributes)', 'The table name', 'The index size'],
      correctIndex: 0,
      explanation: 'Cardinality refers to the number of rows (tuples) in a relation.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-09',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What is the Degree of a relational table?',
      options: ['The total number of columns (attributes) in the relation schema', 'The total number of rows', 'The number of keys', 'The database size'],
      correctIndex: 0,
      explanation: 'The degree of a relation is the number of attributes (columns) it possesses.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-10',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What is a Weak Entity in ER modeling?',
      options: [
        'An entity set that does not have a primary key of its own and depends on an owner entity set',
        'An entity with only 1 attribute',
        'An entity with no relationships',
        'A table with zero rows'
      ],
      correctIndex: 0,
      explanation: 'Weak entities lack sufficient attributes for a primary key and rely on an identifying relationship with an owner entity.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-11',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'How is a Weak Entity Set represented in an ER diagram?',
      options: ['Double Rectangle', 'Dashed Oval', 'Double Diamond', 'Dotted Line'],
      correctIndex: 0,
      explanation: 'Weak entity sets are drawn using double rectangles.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-12',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What type of attribute can be split into smaller, independent sub-parts (e.g. Name into First_Name, Last_Name)?',
      options: ['Composite Attribute', 'Atomic Attribute', 'Derived Attribute', 'Multivalued Attribute'],
      correctIndex: 0,
      explanation: 'Composite attributes can be subdivided into sub-attributes with their own independent meanings.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-13',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'How is a Multivalued Attribute (e.g. Phone_Numbers, Skills) represented in an ER diagram?',
      options: ['Double Ellipse / Double Oval', 'Dotted Rectangle', 'Solid Triangle', 'Diamond'],
      correctIndex: 0,
      explanation: 'Attributes that can hold multiple values for a single entity are represented by double ellipses.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-14',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What is a Derived Attribute (e.g. Age computed from Date_of_Birth)?',
      options: [
        'An attribute whose value is calculated from other related stored attributes',
        'An attribute imported from external files',
        'A primary key',
        'A foreign key'
      ],
      correctIndex: 0,
      explanation: 'Derived attributes are calculated dynamically from base stored attributes and drawn with dashed ovals.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-15',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What is a Candidate Key?',
      options: [
        'A minimal superkey capable of uniquely identifying tuples in a relation',
        'Any foreign key',
        'A key that allows NULLs',
        'The first column created'
      ],
      correctIndex: 0,
      explanation: 'Candidate keys are minimal superkeys; one candidate key is chosen to be the primary key.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-16',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What is a Superkey?',
      options: [
        'A set of one or more attributes that uniquely identifies a tuple in a relation (may contain redundant attributes)',
        'Only single column keys',
        'An encrypted key',
        'A non-unique index'
      ],
      correctIndex: 0,
      explanation: 'A superkey uniquely identifies tuples; a candidate key is a minimal superkey.',
      difficulty: 'Standard'
    },
    {
      id: 'DBMS-01-17',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'In a Many-to-Many (M:N) relationship between Student and Course, how is it converted into the relational model?',
      options: [
        'By creating a separate Junction / Associative table containing foreign keys referencing both tables',
        'By adding Course_ID into Student table only',
        'By merging both tables into one single table',
        'It cannot be represented in relational databases'
      ],
      correctIndex: 0,
      explanation: 'Many-to-many relationships require a separate bridge/junction table holding foreign keys of both entities.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-18',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What integrity constraint states that Primary Key values cannot be NULL?',
      options: ['Entity Integrity Constraint', 'Referential Integrity Constraint', 'Domain Integrity', 'Key Constraint'],
      correctIndex: 0,
      explanation: 'Entity Integrity requires primary key columns to be unique and non-null.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-19',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What integrity constraint ensures that foreign key values must either match an existing primary key or be NULL?',
      options: ['Referential Integrity Constraint', 'Entity Integrity Constraint', 'Domain Constraint', 'Cardinality Constraint'],
      correctIndex: 0,
      explanation: 'Referential integrity prevents dangling foreign key references to nonexistent records.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-01-20',
      topicId: 'TOPIC-DBMS-01',
      questionText: 'What does the Relational Schema describe?',
      options: [
        'The structural definition of relations, including table names, attribute names, domains, and integrity constraints',
        'The physical hard drive layout',
        'The current rows in the database',
        'The database backup file'
      ],
      correctIndex: 0,
      explanation: 'The schema is the blueprint or logical structure of the database, whereas the instance is data at a point in time.',
      difficulty: 'Introductory'
    }
  ],

  // ==========================================
  // TOPIC-DBMS-02: Database Normalization 1NF to BCNF (20 Questions)
  // ==========================================
  'TOPIC-DBMS-02': [
    {
      id: 'DBMS-02-01',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is the primary objective of Database Normalization?',
      options: [
        'To eliminate data redundancy, avoid insertion/update/deletion anomalies, and improve data integrity',
        'To increase storage size',
        'To encrypt all database tables',
        'To speed up full table scans'
      ],
      correctIndex: 0,
      explanation: 'Normalization organizes relational tables to minimize duplicate data and eliminate update anomalies.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-02',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is the core requirement for a relation to be in First Normal Form (1NF)?',
      options: [
        'All attribute values must be Atomic (indivisible single values; no repeating groups or arrays)',
        'No partial dependencies',
        'No transitive dependencies',
        'Every determinant must be a candidate key'
      ],
      correctIndex: 0,
      explanation: '1NF requires domain of each attribute to contain only atomic (indivisible) scalar values.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-03',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What defines a Partial Functional Dependency?',
      options: [
        'A non-prime attribute depends on only a proper subset of a composite candidate key',
        'An attribute depends on the full primary key',
        'A primary key depends on a foreign key',
        'Two non-prime attributes depend on each other'
      ],
      correctIndex: 0,
      explanation: 'Partial dependency occurs when a non-key attribute is determined by part of a composite primary key.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-04',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is required for a relation to be in Second Normal Form (2NF)?',
      options: [
        'It is in 1NF and contains No Partial Dependencies (all non-prime attributes are fully functionally dependent on primary key)',
        'It must have zero foreign keys',
        'No transitive dependencies',
        'It must have only 2 tables'
      ],
      correctIndex: 0,
      explanation: '2NF eliminates partial functional dependencies on candidate keys.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-05',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'If a table in 1NF has a single-attribute primary key (non-composite), is it automatically in 2NF?',
      options: [
        'Yes, because partial dependencies can only exist with composite primary keys',
        'No, 2NF requires more checks',
        'Only if it has numbers',
        'Never'
      ],
      correctIndex: 0,
      explanation: 'A partial dependency requires a proper subset of the key. With a single attribute key, no proper subsets exist!',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-06',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is a Transitive Dependency?',
      options: [
        'A functional dependency X → Z mediated through Y (X → Y and Y → Z where Y is not a candidate key)',
        'A dependency on composite keys',
        'A self-referencing foreign key',
        'A circular loop between tables'
      ],
      correctIndex: 0,
      explanation: 'Transitive dependency occurs when a non-prime attribute determines another non-prime attribute.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-07',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is required for a relation to be in Third Normal Form (3NF)?',
      options: [
        'It is in 2NF and contains No Transitive Dependencies for non-prime attributes',
        'It must have 3 primary keys',
        'All attributes must be varchar',
        'It has no candidate keys'
      ],
      correctIndex: 0,
      explanation: '3NF removes transitive functional dependencies between non-prime attributes.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-08',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'In 3NF, for every functional dependency X → Y, what condition must hold?',
      options: [
        'Either X is a Superkey, or Y is a Prime attribute (part of some candidate key)',
        'X must be a foreign key',
        'Y must be a number',
        'X and Y must be identical'
      ],
      correctIndex: 0,
      explanation: 'In 3NF, for any non-trivial dependency X → Y, X is a superkey OR Y is a prime attribute.',
      difficulty: 'Standard'
    },
    {
      id: 'DBMS-02-09',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is Boyce-Codd Normal Form (BCNF)?',
      options: [
        'A stricter version of 3NF where for EVERY non-trivial functional dependency X → Y, X must strictly be a Superkey',
        'A form with binary trees',
        'A form allowing partial dependencies',
        'Equivalent to 1NF'
      ],
      correctIndex: 0,
      explanation: 'BCNF requires the determinant X to be a superkey in every non-trivial functional dependency X → Y.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-10',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'Is every relation in BCNF also guaranteed to be in 3NF?',
      options: [
        'Yes, BCNF is strictly stronger than 3NF',
        'No, 3NF is stronger than BCNF',
        'They are unrelated',
        'Only if tables are small'
      ],
      correctIndex: 0,
      explanation: 'BCNF is a stricter, stronger refinement of 3NF: BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-11',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What anomaly occurs when deleting one piece of data unintentionally removes unrelated vital data?',
      options: ['Deletion Anomaly', 'Insertion Anomaly', 'Update Anomaly', 'Read Anomaly'],
      correctIndex: 0,
      explanation: 'A deletion anomaly causes unintended loss of secondary data when a tuple is deleted.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-12',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What anomaly occurs when updating a value in one row leaves conflicting old values in other rows?',
      options: ['Update / Modification Anomaly (Inconsistency)', 'Deletion Anomaly', 'Deadlock Anomaly', 'Syntax Anomaly'],
      correctIndex: 0,
      explanation: 'Update anomalies lead to inconsistent database states when redundant copies are not all synchronized.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-13',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is a Lossless Join Decomposition?',
      options: [
        'A decomposition where joining the decomposed tables via natural join reconstructs the original table without spurious tuples',
        'A join that drops duplicate columns',
        'A join without WHERE clause',
        'A join that loses rows'
      ],
      correctIndex: 0,
      explanation: 'Lossless join guarantees no information is lost or falsely created when relations are reunited.',
      difficulty: 'Standard'
    },
    {
      id: 'DBMS-02-14',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is Dependency Preservation during normalization decomposition?',
      options: [
        'All original functional dependencies can be enforced using dependencies local to the decomposed relations',
        'Foreign keys are preserved in backups',
        'Only primary keys are kept',
        'Indexes are copied'
      ],
      correctIndex: 0,
      explanation: 'Dependency preservation ensures constraints can be checked without requiring costly multi-table joins.',
      difficulty: 'Standard'
    },
    {
      id: 'DBMS-02-15',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'Can any relational schema always be decomposed into 3NF such that it is BOTH Lossless and Dependency Preserving?',
      options: [
        'Yes, 3NF decomposition is always guaranteed to achieve both lossless join and dependency preservation',
        'No, never possible',
        'Only for 2-column tables',
        'Only in BCNF'
      ],
      correctIndex: 0,
      explanation: '3NF synthesis algorithm guarantees both lossless join and dependency preservation.',
      difficulty: 'Standard'
    },
    {
      id: 'DBMS-02-16',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'Why might a BCNF decomposition sometimes fail to be preferred over 3NF in real-world systems?',
      options: [
        'BCNF decompositions cannot always preserve all functional dependencies',
        'BCNF is slower to read',
        'BCNF tables cannot have indexes',
        'BCNF requires commercial databases'
      ],
      correctIndex: 0,
      explanation: 'Some schemas decomposed into BCNF lose dependency preservation, requiring expensive cross-table checks.',
      difficulty: 'Standard'
    },
    {
      id: 'DBMS-02-17',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is Armstrong\'s Axiom of Reflexivity for functional dependencies?',
      options: ['If Y ⊆ X, then X → Y', 'If X → Y, then Y → X', 'If X → Y and Y → Z, then X → Z', 'X → X only'],
      correctIndex: 0,
      explanation: 'Reflexivity states that any set of attributes functionally determines any of its subsets: Y ⊆ X ⇒ X → Y.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-18',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is Armstrong\'s Axiom of Augmentation?',
      options: ['If X → Y, then XZ → YZ for any attribute set Z', 'If X → Y, then Y → X', 'If X → Y, then X → Z', 'XZ → X'],
      correctIndex: 0,
      explanation: 'Augmentation states adding attribute set Z to both sides preserves validity: X → Y ⇒ XZ → YZ.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-19',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is Armstrong\'s Axiom of Transitivity?',
      options: ['If X → Y and Y → Z, then X → Z', 'If X → Y, then Z → Y', 'If X → Z, then Z → X', 'X → YZ'],
      correctIndex: 0,
      explanation: 'Transitivity states if X determines Y and Y determines Z, then X determines Z.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-02-20',
      topicId: 'TOPIC-DBMS-02',
      questionText: 'What is the Attribute Closure X⁺ under a set of functional dependencies F?',
      options: [
        'The set of all attributes functionally determined by X under F',
        'All attributes not in X',
        'The primary key of X',
        'All foreign keys'
      ],
      correctIndex: 0,
      explanation: 'X⁺ denotes the complete set of attributes that can be inferred from X using Armstrong\'s axioms.',
      difficulty: 'Introductory'
    }
  ],

  // ==========================================
  // TOPIC-DBMS-03: SQL Transactions & Indexing (20 Questions)
  // ==========================================
  'TOPIC-DBMS-03': [
    {
      id: 'DBMS-03-01',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What does the ACID acronym stand for in database transaction management?',
      options: [
        'Atomicity, Consistency, Isolation, Durability',
        'Access, Control, Indexing, Delivery',
        'Algorithm, Computation, Iteration, Data',
        'Authentication, Cipher, Integrity, Domain'
      ],
      correctIndex: 0,
      explanation: 'ACID guarantees reliable processing of database transactions.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-02',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What does the Atomicity property guarantee?',
      options: [
        'All operations in the transaction succeed together, or all changes are rolled back ("all-or-nothing")',
        'Data is stored atomically in 1NF',
        'Transactions execute instantly',
        'Single CPU processing'
      ],
      correctIndex: 0,
      explanation: 'Atomicity ensures that a transaction cannot be partially committed.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-03',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What does the Durability property guarantee?',
      options: [
        'Once a transaction is committed, its updates persist permanently even in the event of system crashes or power failures',
        'Transactions run forever',
        'Memory never leaks',
        'Indexes are indestructible'
      ],
      correctIndex: 0,
      explanation: 'Durability ensures committed changes survive server restarts via write-ahead transaction logs (WAL).',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-04',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What does the Isolation property ensure?',
      options: [
        'Concurrent transactions execute independently without interfering with or observing intermediate uncommitted states of others',
        'Only 1 user can connect at a time',
        'Database runs in a virtual machine',
        'Tables are isolated on separate disks'
      ],
      correctIndex: 0,
      explanation: 'Isolation prevents race conditions and dirty reads during concurrent transaction execution.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-05',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'Which SQL command permanently saves all changes made during the current transaction to the database?',
      options: ['COMMIT', 'ROLLBACK', 'SAVEPOINT', 'CHECKPOINT'],
      correctIndex: 0,
      explanation: 'COMMIT makes the transactional modifications permanent and visible to other users.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-06',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'Which SQL command undoes all changes made in the current uncommitted transaction?',
      options: ['ROLLBACK', 'COMMIT', 'DELETE', 'DROP'],
      correctIndex: 0,
      explanation: 'ROLLBACK restores data to the state prior to the transaction\'s start.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-07',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is a Dirty Read phenomenon in database concurrency?',
      options: [
        'A transaction reads data modified by an uncommitted concurrent transaction that may later rollback',
        'Reading data from corrupted disk sectors',
        'Reading expired cache data',
        'Reading without an index'
      ],
      correctIndex: 0,
      explanation: 'A dirty read occurs when Transaction A views dirty uncommitted updates from Transaction B before B aborts.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-08',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is a Non-Repeatable Read?',
      options: [
        'A transaction re-reads the same row and discovers values were altered by another committed transaction',
        'A query that errors on second execution',
        'A query that cannot use loops',
        'A read timeout'
      ],
      correctIndex: 0,
      explanation: 'Non-repeatable read happens when subsequent reads of the same row yield different values due to committed updates.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-09',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is the highest and most rigorous ANSI SQL Transaction Isolation Level?',
      options: ['SERIALIZABLE', 'REPEATABLE READ', 'READ COMMITTED', 'READ UNCOMMITTED'],
      correctIndex: 0,
      explanation: 'SERIALIZABLE prevents dirty reads, non-repeatable reads, and phantom rows, ensuring execution order equivalence.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-10',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What data structure is most widely used by relational database engines (like MySQL, PostgreSQL, Oracle) for primary table indexing?',
      options: ['B+ Tree (Balanced Multiway Search Tree)', 'Linked List', 'Binary Heap', 'Queue'],
      correctIndex: 0,
      explanation: 'B+ Trees provide O(log n) lookups, insertions, deletions, and sequential range scans on disk blocks.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-11',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What distinguishes a Clustered Index from a Non-Clustered (Secondary) Index?',
      options: [
        'A clustered index dictates the actual physical sorting order of table rows on disk (only 1 per table)',
        'Clustered indexes are stored in RAM only',
        'A table can have 100 clustered indexes',
        'Non-clustered indexes store data rows directly'
      ],
      correctIndex: 0,
      explanation: 'Because data can only be physically sorted one way on disk, a table can have only one clustered index.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-12',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is a Deadlock in database transaction management?',
      options: [
        'A condition where two or more transactions are each blocked waiting for locks held by the other, forming a cyclic dependency',
        'When the database disk is 100% full',
        'When network cables disconnect',
        'When an index is deleted'
      ],
      correctIndex: 0,
      explanation: 'Deadlock occurs when transaction T1 holds Lock A and waits for Lock B, while T2 holds Lock B and waits for Lock A.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-13',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What SQL statement is used to create an index on the "email" column of a "students" table?',
      options: [
        'CREATE INDEX idx_student_email ON students(email);',
        'ADD INDEX email TO students;',
        'MAKE INDEX ON students.email;',
        'INDEX students(email);'
      ],
      correctIndex: 0,
      explanation: 'Standard SQL syntax is: CREATE INDEX index_name ON table_name(column_name);',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-14',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'Why shouldn\'t every single column in a database table be indexed?',
      options: [
        'Indexes add write overhead (INSERT, UPDATE, DELETE become slower) and consume additional disk storage',
        'Database crashes if there are > 2 indexes',
        'Indexes make SELECT queries slower',
        'Indexes disable primary keys'
      ],
      correctIndex: 0,
      explanation: 'Every index requires real-time tree rebalancing and extra disk writes whenever rows are inserted or modified.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-15',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What does EXPLAIN or EXPLAIN ANALYZE do in SQL queries?',
      options: [
        'Displays the Query Execution Plan chosen by the query optimizer (index scans vs sequential scans)',
        'Translates SQL into Python',
        'Corrects syntax errors automatically',
        'Backs up the query table'
      ],
      correctIndex: 0,
      explanation: 'EXPLAIN shows cost estimates, join strategies, and whether index lookups or sequential table scans will execute.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-16',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is Two-Phase Locking (2PL)?',
      options: [
        'A concurrency protocol with a Growing Phase (acquiring locks) followed by a Shrinking Phase (releasing locks)',
        'Entering passwords twice',
        'Using 2 database servers',
        'Locking both rows and columns'
      ],
      correctIndex: 0,
      explanation: '2PL ensures serializability: once a transaction releases any lock, it may not acquire any new locks.',
      difficulty: 'Standard'
    },
    {
      id: 'DBMS-03-17',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is a Write-Ahead Log (WAL)?',
      options: [
        'Writing all transaction changes to a sequential log on persistent storage BEFORE applying them to data pages',
        'Writing documentation before writing SQL',
        'Logging all SELECT queries',
        'A user activity monitor'
      ],
      correctIndex: 0,
      explanation: 'WAL ensures crash recovery: unwritten buffer modifications can be replayed from the log upon reboot.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-18',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is a Shared Lock (S-Lock)?',
      options: [
        'A lock that allows multiple transactions to concurrently read a data item, but prevents write operations',
        'A lock that permits writes only',
        'A lock shared across networks',
        'A lock that never releases'
      ],
      correctIndex: 0,
      explanation: 'Shared locks allow concurrent reading; multiple transactions can hold shared locks on the same data item.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-19',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is an Exclusive Lock (X-Lock)?',
      options: [
        'A lock granted to a single transaction for updating data; no other transaction can read or write it',
        'A lock for administrators only',
        'A read-only lock',
        'A lock on external files'
      ],
      correctIndex: 0,
      explanation: 'An exclusive lock prohibits any concurrent shared or exclusive locks on that data item.',
      difficulty: 'Introductory'
    },
    {
      id: 'DBMS-03-20',
      topicId: 'TOPIC-DBMS-03',
      questionText: 'What is a Composite (Multi-column) Index?',
      options: [
        'An index constructed on two or more columns of a table (e.g. INDEX(dept_id, enrollment_year))',
        'An index that joins 2 tables',
        'An index on numbers and text combined',
        'An index stored in 2 files'
      ],
      correctIndex: 0,
      explanation: 'Composite indexes optimize queries filtering or sorting across multiple attributes using the leftmost prefix rule.',
      difficulty: 'Introductory'
    }
  ]
};
