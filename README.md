# 99Tech Code Challenge

Brief description of solutions for the code challenge problems.

## Problem 4: Three ways to sum to N
File: `problem-4/index.ts`

Implemented 3 methods to calculate the sum of numbers from 1 to N using TypeScript.

## Problem 5: Crude Server (Product API)
Folder: `problem-5/`

A complete Backend project built with **Node.js, Express, and TypeScript**.
-   **Features**: Provides CRUD APIs (Create, Read, Update, Delete) for "Product" resources.
-   **Architecture**: Clean Architecture, clear separation between Controller, Service, and Repository.
-   **Database**: Uses PostgreSQL combined with TypeORM.
-   **Tools**:
    -   Supports Docker & Docker Compose for easy deployment.
    -   Integrated Swagger UI for API documentation.
    -   Includes Unit Tests with Jest and Supertest.

## Problem 6: Architecture (Leaderboard API)
File: `problem-6/LEADERBOARD_API_SPEC.md`

Technical Specification for a Real-time Leaderboard module.
-   **Goal**: Design a system to display the Top 10 players with the highest scores, updating live.
-   **Key Contents**:
    -   Data Flow Diagram and System Architecture.
    -   Detailed API endpoint specifications (Update Score, Get Leaderboard).
    -   Security Mechanisms: JWT Authentication combined with Action Tokens to prevent cheating.
    -   Caching Strategy with Redis and Real-time updates via WebSocket.
