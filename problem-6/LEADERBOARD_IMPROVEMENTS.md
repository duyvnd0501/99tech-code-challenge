# Improvement Explanations: Leaderboard API Module

This document details specific improvements for the Real-time Leaderboard System derived from the original specification. These enhancements focus on scalability, security, user experience, and data integrity.

## 1. Performance Improvements

### 1.1 Redis Sorted Sets
**Why:**
Currently, if we only cache the top 10 list, we might still need to query the database frequently to recalculate ranks when specific user scores update.
**Improvement:**
Use Redis `Sorted Sets` (ZSET). Redis ZSETs are a data structure specifically designed for ranking monitoring.
-   **ZADD**: Add/update user score in O(log(N)).
-   **ZRANGE**: Get the top 10 list in O(log(N)+M).
-   **Operation**: The entire leaderboard lives in memory. We only write to the SQL database for persistence (backup). This removes read load effectively from the Postgres DB for leaderboard queries.

### 1.2 Batch Rank Recalculation
**Why:**
Recalculating the exact rank of *every* user after *every* score update is expensive for the database (`UPDATE users SET rank = ...`).
**Improvement:**
Instead of synchronous updates:
1.  Accumulate score changes in Redis or memory.
2.  Run a scheduled job (e.g., every 30s) to write these final scores to the SQL database.
3.  Use PostgreSQL Window Functions (`RANK() OVER (...)`) to update ranks in bulk.
This allows the database to breathe and handle write bursts efficiently.

---

## 2. Security Improvements

### 2.1 Server-side Action Validation
**Why:**
Trusting the client to send `expectedScore` is risky. A hacked client could send "Kill 1 Slime = 9999 points".
**Improvement:**
Move the "Truth" to the server.
1.  Define a configuration table: `{ "KILL_SLIME": 10, "KILL_BOSS": 500 }`.
2.  Client only sends `actionType: "KILL_SLIME"`.
3.  Server looks up the point value.
This prevents clients from manufacturing arbitrary scores.

### 2.2 Device Fingerprinting
**Why:**
Users may create 100 accounts to spam the leaderboard.
**Improvement:**
Collect metadata (IP, User Agent, Canvas Hash, Screen Resolution) to generate a "Device Fingerprint".
-   If 10 accounts share the same Device ID, flag them as "Suspicious".
-   Shadowban these accounts (they see themselves on the leaderboard, but nobody else does).

### 2.3 Proof of Work (PoW)
**Why:**
Bots can send thousands of requests per second.
**Improvement:**
Require the client to solve a small cryptographic puzzle (like finding a hash with leading zeros) before submitting a score.
-   Trivial for a human browser (10ms).
-   Expensive for a bot trying to spam 10,000 req/sec.

---

## 3. Scalability Improvements

### 3.1 Message Queue (Async Processing)
**Why:**
If the database locks up during a write, the API request might timeout, causing user frustration.
**Improvement:**
Decouple the API from the Database.
1.  API receives "Score Update".
2.  API pushes event to **RabbitMQ** or **Kafka**.
3.  API returns "202 Accepted" immediately to user.
4.  Worker processes consume the queue and update the DB at a controlled pace.
This prevents traffic spikes from bringing down the database.

### 3.2 Sharding
**Why:**
A single database table can get too big (millions of users).
**Improvement:**
Split the data.
-   **Geographic Sharding**: US users on DB-US, Asia users on DB-Asia.
-   **Range Sharding**: User IDs 1-1M on DB-1, 1M-2M on DB-2.
-   Note: This makes global leaderboards harder (requires aggregating data from shards), but regional leaderboards become very fast.

---

## 4. User Experience (UX)

### 4.1 Optimistic UI Updates
**Why:**
Waiting for the server to confirm "Score Updated" makes the game feel laggy.
**Improvement:**
The game client should immediately update the displayed score *visibly* before the server responds.
-   If the server returns OK -> Do nothing.
-   If the server returns Error -> Rollback the score and show an error message.
This makes the game feel "instantly" responsive.

### 4.2 "User + Neighbor" Rank
**Why:**
If I am Rank #15,000, seeing the Top 10 is irrelevant/demotivating.
**Improvement:**
Show the "Personal Leaderboard":
-   Display Rank #1 to #3 (The Idols).
-   Display Rank #14,995 to #15,005 (The User and their immediate rivals).
This keeps the user engaged by giving them beatable targets.

---

## 5. Data Integrity

### 5.1 Audit Chains
**Why:**
An admin (or hacker) could update the DB directly (`UPDATE users SET score = 9999`) without leaving a trace.
**Improvement:**
Create a blockchain-like hash for score history.
-   `History[N].hash = SHA256(History[N].data + History[N-1].hash)`
-   If someone manually changes a row in the middle, the entire hash chain breaks.
-   This proves that the score history has not been tampered with.

