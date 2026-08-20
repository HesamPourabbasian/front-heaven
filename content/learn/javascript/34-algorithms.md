---
title: 'Algorithms'
description: 'Master essential algorithms in JavaScript: Big-O analysis (Time & Space complexity), Binary Search, Sorting (Merge Sort, Quick Sort), Dynamic Programming, Greedy approaches, Graph traversals (BFS, DFS), Two Pointers, and Sliding Window.'
order: 34
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/javascript/33-advanced-data-structures
---

# Algorithms

Algorithms are formalized sequences of unambiguous instructions designed to solve specific computational problems. In frontend and full-stack software engineering, algorithmic efficiency directly impacts UI responsiveness, frame rates, memory footprints, search filtering performance, and client-side computational capabilities.

Understanding **Big-O Notation** allows engineers to mathematically predict how algorithms scale as datasets grow from ten items to millions of records.

In this lesson, we will master Big-O Time and Space complexity, explore **Binary Search**, implement **Merge Sort** and **Quick Sort**, analyze **Two Pointers** and **Sliding Window** patterns, traverse graphs with **BFS and DFS**, and solve complex optimization challenges using **Dynamic Programming**.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Big-O Complexity Hierarchy                      │
├────────────────────────────────────────────────────────────────────────┤
│ O(1)        : Constant Time     (Array indexing, Hash map lookup)      │
│ O(log N)    : Logarithmic Time  (Binary Search)                        │
│ O(N)        : Linear Time       (Single loop traversal)                │
│ O(N log N)  : Linearithmic Time (Merge Sort, Quick Sort, Timsort)      │
│ O(N^2)      : Quadratic Time    (Nested loops, Bubble Sort)            │
│ O(2^N)      : Exponential Time  (Unmemoized Fibonacci recursion)       │
└────────────────────────────────────────────────────────────────────────┘
```

## Binary Search ($O(\log N)$)

Binary search locates a target value within a **sorted array** by repeatedly dividing the search interval in half:

```javascript
function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (sortedArr[mid] === target) return mid; // Found index
    if (sortedArr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }

  return -1; // Not found
}

const dataset = [10, 23, 35, 42, 59, 70, 88, 91, 105];
console.log(binarySearch(dataset, 42)); // Index 3
```

## Two Pointers Technique

The **Two Pointers** pattern uses two index pointers that traverse an array toward each other or in tandem, reducing $O(N^2)$ brute-force solutions to $O(N)$ linear time:

```javascript
// Two Sum on Sorted Array: Find two numbers that add up to target
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return null;
}
```

## Sliding Window Pattern

The **Sliding Window** technique maintains a dynamic window boundary over a continuous subset of an array or string. It is ideal for calculating rolling metrics or finding the longest substring satisfying specific criteria:

```javascript
// Longest Substring Without Repeating Characters (O(N))
function lengthOfLongestUniqueSubstring(s) {
  const charMap = new Map();
  let maxLength = 0;
  let windowStart = 0;

  for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
    const char = s[windowEnd];
    if (charMap.has(char) && charMap.get(char) >= windowStart) {
      windowStart = charMap.get(char) + 1; // Slide window start past duplicate
    }
    charMap.set(char, windowEnd);
    maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
  }

  return maxLength;
}

console.log(lengthOfLongestUniqueSubstring("abcabcbb")); // 3 ("abc")
```

## Merge Sort ($O(N \log N)$ Divide-and-Conquer)

Merge Sort recursively splits the array into two halves, sorts them, and merges the sorted halves back together:

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr; // Base case

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let l = 0, r = 0;

  while (l < left.length && r < right.length) {
    if (left[l] <= right[r]) result.push(left[l++]);
    else result.push(right[r++]);
  }

  return result.concat(left.slice(l)).concat(right.slice(r));
}
```

## Graph Traversals: BFS and DFS

Graphs represent networks of interconnected nodes (vertices) and edges:
- **Breadth-First Search (BFS)**: Explores nearest neighbors first using a **Queue**. Ideal for finding the shortest path in unweighted graphs.
- **Depth-First Search (DFS)**: Explores as deep as possible along each branch before backtracking, utilizing a **Stack** or recursion.

```javascript
const networkGraph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"]
};

// Breadth-First Search (Shortest Path / Layer-by-Layer)
function bfs(graph, startNode) {
  const visited = new Set([startNode]);
  const queue = [startNode];
  const traversalOrder = [];

  while (queue.length > 0) {
    const current = queue.shift();
    traversalOrder.push(current);

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return traversalOrder;
}
```

## Dynamic Programming (Memoization & Tabulation)

Dynamic Programming breaks complex problems into overlapping subproblems, storing results to avoid redundant calculations:

```javascript
// Tabulated Dynamic Programming: 0/1 Knapsack Problem
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}
```

## Summary

Algorithms provide deterministic frameworks for processing data efficiently. Big-O notation measures algorithmic scalability. Binary search searches sorted collections in $O(\log N)$. Two pointers and sliding window reduce quadratic loops to linear time. Merge sort delivers stable $O(N \log N)$ sorting. BFS explores graphs level-by-level, DFS explores depth, and Dynamic Programming optimizes overlapping subproblems.

## Best Practices

1. **Analyze Big-O Before Implementation**: Evaluate time and space complexity to prevent $O(N^2)$ bottlenecks on large user datasets.
2. **Sort Data First When Searching Repeatedly**: If you search an array multiple times, sort it once ($O(N \log N)$) and use Binary Search ($O(\log N)$) thereafter.
3. **Use Sliding Window for Subarray Problems**: Replace brute-force nested iterations over strings/arrays with sliding window techniques.
4. **Use Sets for $O(1)$ Membership Checks**: Never check array membership with `array.includes()` inside an outer loop; convert the array to a `Set` for instant lookups.
5. **Prevent Maximum Call Stack Errors in Recursion**: For deep recursive algorithms, use iterative loops with an explicit stack array to prevent stack overflows.
