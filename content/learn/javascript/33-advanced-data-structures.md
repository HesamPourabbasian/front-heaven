---
title: 'Advanced Data Structures'
description: 'Master advanced data structures in JavaScript: Stack, Queue, Deque, Singly and Doubly Linked Lists, Hash Table with collision handling, Set, Map, Binary Search Tree (BST), Min/Max Heap, Graph, Trie (Prefix Tree), and LRU Cache.'
order: 33
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/javascript/32-advanced-async-programming
---

# Advanced Data Structures

While JavaScript provides built-in `Array`, `Object`, `Map`, and `Set` structures, solving complex algorithmic challenges and optimizing performance bottlenecks requires implementing custom, specialized data structures. Choosing the optimal data structure drastically reduces computational time complexity from quadratic time to logarithmic or constant time.

Data structures organize data in memory to enable specific access, insertion, and traversal patterns with mathematical efficiency guarantees. In large-scale frontend and full-stack applications, choosing an inappropriate data structure can lead to severe performance degradation.

From implementing undo/redo stacks and message queues to constructing **Trie** autocomplete prefix trees, **Binary Search Trees (BST)**, **Min/Max Priority Heaps**, and **LRU (Least Recently Used) Caches**, mastery of data structures is fundamental for senior frontend engineers.

In this lesson, we will implement and analyze Stacks, Queues, Doubly Linked Lists, Hash Tables with collision chaining, Binary Search Trees, Heaps, Graph adjacency lists, Tries, and a production-grade LRU Cache.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Data Structure Complexities                     │
├───────────────────┬──────────────┬──────────────┬──────────────────────┤
│ Data Structure    │ Access       │ Search       │ Insertion / Deletion │
├───────────────────┼──────────────┼──────────────┼──────────────────────┤
│ Array             │ O(1)         │ O(N)         │ O(N) (O(1) at end)   │
│ Linked List       │ O(N)         │ O(N)         │ O(1) (At head/tail)  │
│ Hash Table / Map  │ N/A          │ O(1) avg     │ O(1) avg             │
│ Binary Search Tree│ O(log N) avg │ O(log N) avg │ O(log N) avg         │
│ Min/Max Heap      │ O(1) (Peek)  │ O(N)         │ O(log N)             │
│ Trie              │ N/A          │ O(K) (length)│ O(K)                 │
│ LRU Cache         │ O(1)         │ O(1)         │ O(1)                 │
└───────────────────┴──────────────┴──────────────┴──────────────────────┘
```

## Linear Structures: Stacks, Queues, and Deques

A **Stack** operates on a Last-In, First-Out (LIFO) model, making it ideal for tracking navigation history, call stacks, and undo/redo operations.

A **Queue** follows First-In, First-Out (FIFO) ordering, perfect for managing task queues, print buffers, and message ingestion pipelines.

A **Deque (Double-Ended Queue)** allows insertion and removal of elements from both the front and back in $O(1)$ constant time.

## Doubly Linked List

A **Doubly Linked List** consists of a sequence of nodes where each node contains a value and two pointers: `next` and `prev`. Unlike arrays, inserting or deleting nodes at the head or tail requires $O(1)$ constant time with zero array re-indexing overhead:

```javascript
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.length++;
    return node;
  }

  remove(node) {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;

    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;

    this.length--;
  }
}
```

## Hash Tables with Collision Chaining

A **Hash Table** stores key-value pairs by computing a numeric hash index from string keys. When two distinct keys hash to the same bucket index (a collision), chaining stores entries in a linked list or bucket array:

```javascript
class HashTable {
  constructor(size = 53) {
    this.buckets = new Array(size);
  }

  #hash(key) {
    let total = 0;
    const PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      total = (total * PRIME + key.charCodeAt(i)) % this.buckets.length;
    }
    return total;
  }

  set(key, value) {
    const index = this.#hash(key);
    if (!this.buckets[index]) this.buckets[index] = [];
    this.buckets[index].push([key, value]);
  }

  get(key) {
    const index = this.#hash(key);
    if (!this.buckets[index]) return undefined;
    const match = this.buckets[index].find(entry => entry[0] === key);
    return match ? match[1] : undefined;
  }
}
```

## Binary Search Tree (BST)

A **Binary Search Tree** is a hierarchical tree structure where every node has at most two children, satisfying the BST invariant: all values in the left subtree are strictly smaller than the node, and all values in the right subtree are strictly greater:

```javascript
class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() { this.root = null; }

  insert(value) {
    const newNode = new BSTNode(value);
    if (!this.root) { this.root = newNode; return this; }

    let current = this.root;
    while (true) {
      if (value === current.value) return undefined; // No duplicates
      if (value < current.value) {
        if (!current.left) { current.left = newNode; return this; }
        current = current.left;
      } else {
        if (!current.right) { current.right = newNode; return this; }
        current = current.right;
      }
    }
  }

  contains(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }
}
```

## Min and Max Priority Heaps

A **Heap** is a complete binary tree where parent nodes maintain a strict ordering relationship with their children (parent $\le$ children in a Min-Heap, parent $\ge$ children in a Max-Heap).

Heaps are stored efficiently inside flat arrays where child indices are calculated arithmetically (`left = 2i + 1`, `right = 2i + 2`), providing $O(\log N)$ insertions and $O(1)$ priority extraction.

## Graph Data Structures

Graphs represent networks of interconnected nodes (vertices) and edges. Graphs can be directed or undirected, weighted or unweighted. In JavaScript, graphs are most efficiently represented using an **Adjacency List** stored in a `Map`.

## Trie (Prefix Tree for Autocomplete)

A **Trie** is a specialized tree used for storing associative strings where keys are character sequences. It delivers blazing-fast $O(K)$ prefix search (where $K$ is string length), making it ideal for search engines and autocomplete dropdowns:

```javascript
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char);
    }
    current.isEndOfWord = true;
  }

  startsWithPrefix(prefix) {
    let current = this.root;
    for (const char of prefix) {
      if (!current.children.has(char)) return false;
      current = current.children.get(char);
    }
    return true;
  }
}
```

## Production-Grade LRU Cache

An **LRU (Least Recently Used) Cache** maintains an item capacity limit. When the cache exceeds capacity, it evicts the least recently accessed item in $O(1)$ time. We implement this using a combination of a `Map` (for $O(1)$ lookup) and a `DoublyLinkedList` (for $O(1)$ order reordering):

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.list = new DoublyLinkedList();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    this.list.remove(node);
    this.list.append(node.value);
    return node.value.val;
  }

  put(key, val) {
    if (this.cache.has(key)) {
      this.list.remove(this.cache.get(key));
    } else if (this.cache.size >= this.capacity) {
      const lruNode = this.list.head;
      this.list.remove(lruNode);
      this.cache.delete(lruNode.value.key);
    }

    const newNode = this.list.append({ key, val });
    this.cache.set(key, newNode);
  }
}
```

## Summary

Advanced data structures provide optimal computational efficiency for specialized problems. Doubly Linked Lists support $O(1)$ insertions and removals at boundaries. Binary Search Trees deliver $O(\log N)$ average search and insertion. Tries provide instant $O(K)$ prefix lookups for autocompletion, and LRU Caches pair Hash Maps with Linked Lists to guarantee $O(1)$ eviction and retrieval.

## Best Practices

1. **Choose the Right Structure for the Access Pattern**: Use Hash Maps for key lookups, Stacks for undo history, Queues for pipeline processing, and Tries for text search.
2. **Use Built-in `Map` for Ordered Key-Value Storage**: JavaScript `Map` preserves insertion order natively and provides $O(1)$ performance without prototype overhead.
3. **Beware of Tree Imbalance in BSTs**: Standard BSTs can degenerate into $O(N)$ linked lists if inserted with sorted data; use self-balancing trees (AVL or Red-Black) for worst-case guarantees.
4. **Implement LRU Caching for Client-Side API Caches**: Prevent memory exhaustion when caching heavy image or API responses by enforcing strict LRU capacity limits.
5. **Encapsulate Custom Structures with Clean APIs**: Expose clean methods (`push`, `pop`, `insert`, `search`) and hide internal node pointer manipulation.
