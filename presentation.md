# Technical Presentation: 99Tech Code Challenge Solutions

This document outlines the technical approach and solutions for the 3 coding problems.

## Problem 4: Three ways to sum to N

**Objective**: Calculate the summation of integers from 1 to N.

1.  **Method A: Mathematical Formula (Gauss)**
    -   **Approach**: Uses the arithmetic progression formula `n * (n + 1) / 2`.
    -   **Complexity**: Time `O(1)`, Space `O(1)`.
    -   **Pros**: Extremely fast, efficient, constant time regardless of N.
    -   **Cons**: Potential integer overflow for very large N (though JS uses double-precision floats, safety limits apply).

2.  **Method B: Recursion**
    -   **Approach**: Recursive call `sumToNB(n) = n + sumToNB(n-1)` with base case `n <= 1`.
    -   **Complexity**: Time `O(n)`, Space `O(n)` (call stack).
    -   **Pros**: Elegant, functional programming style.
    -   **Cons**: Inefficient in environments without Tail Call Optimization (like standard Node.js). Risk of **Stack Overflow** for large N.

3.  **Method C: Iteration (Loop)**
    -   **Approach**: Standard `for` loop accumulating the sum.
    -   **Complexity**: Time `O(n)`, Space `O(1)`.
    -   **Pros**: Robust, easy to understand, memory efficient (no stack overhead).
    -   **Cons**: Slower than O(1) formula for massive numbers, but generally sufficient for most use cases.

---

## Problem 5: Crude Server (Product API)

**Objective**: Build a backend server with CRUD capabilities for a "Product" resource.

### Technology Stack
-   **Runtime**: Node.js
-   **Framework**: Express.js (Lightweight, flexible).
-   **Language**: TypeScript (Type safety, better DX).
-   **Database**: PostgreSQL (Relational data integrity).
-   **ORM**: TypeORM (Data mapping, migrations, abstraction).

### Architecture: Clean Architecture
The project is structured to separate concerns, ensuring maintainability and testability:
-   **Controller Layer** (`src/controller`): Handles HTTP requests, validation, parsing, and sending responses.
-   **Service Layer** (`src/service`): Contains business logic, independent of HTTP concerns.
-   **Repository/Entity Layer** (`src/entity`, `data-source`): Manages database interactions and data modeling.

### Key Features
-   **CRUD Operations**: Create, Read (List/Detail), Update, Delete products with proper input validation.
-   **Documentation**: Integrated **Swagger UI** for interactive API exploration and testing.
-   **Dockerization**: `docker-compose.yml` included for easy containerized deployment of the app and database.
-   **Testing**: Unit tests setup with **Jest** and **Supertest** for reliable endpoints.

---

## Problem 6: Architecture (Leaderboard API)

**Objective**: Design a real-time module to display the specific Top 10 user scores.

### System Components
1.  **API Handler**: Manages score submission and leaderboard retrieval.
2.  **WebSocket Server**: Pushes real-time updates to connected clients when the top 10 changes.
3.  **Redis Cache**: Stores the sorted leaderboard (using Sorted Sets `ZSET`) for ultra-fast retrieval and ranking.
4.  **Database (PostgreSQL)**: Persists permanent score records and user data.

### Workflow
-   **Score Update**:
    1.  User performs an action -> Dispatch `update_score` request.
    2.  Validate **JWT** and **Action Token** (Anti-cheat mechanism).
    3.  Update SQL Database for persistence.
    4.  Update Redis ZSET for real-time ranking.
    5.  **Check**: If the Top 10 list implies a change -> Broadcast new list via WebSocket to all live clients.
    
-   **Get Leaderboard**:
    1.  Fetch directly from Redis (O(logN)) for low latency response.

### Security Measures
-   **JWT & Authentication**: Ensures only logged-in users can post scores.
-   **Action Tokens**: Prevents unauthorized API calls/replay attacks or automated bot submissions.
-   **Rate Limiting**: Protects against spamming score updates.
