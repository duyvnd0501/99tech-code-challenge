# Real-time Leaderboard API Module - Technical Specification

## Overview

This module provides the backend API for a real-time leaderboard system, displaying the top 10 users with the highest scores. The system is designed with security mechanisms to prevent cheating and ensure score data integrity.

## System Architecture

```mermaid
graph TB
    Client[Client Application]
    API[API Gateway]
    Auth[Authentication Service]
    Score[Score Service]
    Verify[Verification Service]
    DB[(Database)]
    Cache[(Redis Cache)]
    WS[WebSocket Server]
    
    Client -->|1. Complete Action| Client
    Client -->|2. Request Token| Auth
    Auth -->|3. Generate Token| Auth
    Auth -->|4. Return Token| Client
    Client -->|5. Submit Score + Token| API
    API -->|6. Validate Request| Verify
    Verify -->|7. Verify Token| Verify
    Verify -->|8. Check Rate Limit| Cache
    Verify -->|9. Validate Score| Verify
    Verify -->|10. Update Score| Score
    Score -->|11. Write to DB| DB
    Score -->|12. Update Cache| Cache
    Score -->|13. Broadcast Update| WS
    WS -->|14. Real-time Update| Client
    
    Client -->|Get Leaderboard| API
    API -->|Read from Cache| Cache
    Cache -->|Cache Miss| DB
```

## Functional Requirements

### 1. Leaderboard Display

**Endpoint:** `GET /api/leaderboard`

**Description:** Retrieve the list of top 10 users with the highest scores.

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user123",
        "username": "player_one",
        "score": 15000,
        "lastUpdated": "2025-12-29T10:30:00Z"
      }
    ],
    "timestamp": "2025-12-29T10:30:15Z"
  }
}
```

**Caching Strategy:**
- Cache TTL: 5 seconds
- Cache key: `leaderboard:top10`
- Invalidate on score update

---

### 2. Score Update

**Endpoint:** `POST /api/score/update`

**Description:** Update user score after completing an action.

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
X-Request-ID: <unique_request_id>
```

**Request Body:**
```json
{
  "actionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scoreIncrement": 100,
  "actionType": "COMPLETE_TASK",
  "metadata": {
    "actionId": "action_12345",
    "timestamp": "2025-12-29T10:30:00Z",
    "clientHash": "sha256_hash_of_action_data"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "previousScore": 14900,
    "newScore": 15000,
    "scoreIncrement": 100,
    "rank": 1,
    "rankChange": 0
  }
}
```

**Response (Error - Invalid Token):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Action token is invalid or expired",
    "timestamp": "2025-12-29T10:30:15Z"
  }
}
```

---

### 3. Action Token Generation

**Endpoint:** `POST /api/action/token`

**Description:** Generate an authentication token for a specific action.

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "actionType": "COMPLETE_TASK",
  "actionId": "action_12345",
  "expectedScore": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "actionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-12-29T10:35:00Z",
    "actionId": "action_12345"
  }
}
```

---

### 4. WebSocket Real-time Updates

**WebSocket Endpoint:** `wss://api.example.com/ws/leaderboard`

**Connection:**
```javascript
const ws = new WebSocket('wss://api.example.com/ws/leaderboard');
ws.send(JSON.stringify({
  type: 'authenticate',
  token: 'JWT_TOKEN'
}));
```

**Server Messages:**
```json
{
  "type": "leaderboard_update",
  "data": {
    "leaderboard": [...],
    "timestamp": "2025-12-29T10:30:15Z"
  }
}
```

```json
{
  "type": "rank_change",
  "data": {
    "userId": "user123",
    "oldRank": 2,
    "newRank": 1,
    "score": 15000
  }
}
```

## Security Mechanisms

### 1. Two-Token System

**JWT Token (User Authentication):**
- Issued upon user login
- Lifetime: 24 hours
- Contains: userId, role, permissions

**Action Token (Action Verification):**
- Issued when user starts an action
- Lifetime: 5 minutes
- Contains: userId, actionId, actionType, expectedScore, timestamp
- One-time use only (token invalidated after use)

### 2. Server-side Validation

```mermaid
flowchart TD
    Start[Score Update Request] --> ValidateJWT{Validate JWT Token}
    ValidateJWT -->|Invalid| Reject1[Return 401 Unauthorized]
    ValidateJWT -->|Valid| ValidateAction{Validate Action Token}
    ValidateAction -->|Invalid/Expired| Reject2[Return 403 Forbidden]
    ValidateAction -->|Valid| CheckUsed{Token Already Used?}
    CheckUsed -->|Yes| Reject3[Return 409 Conflict]
    CheckUsed -->|No| RateLimit{Check Rate Limit}
    RateLimit -->|Exceeded| Reject4[Return 429 Too Many Requests]
    RateLimit -->|OK| ValidateScore{Validate Score Value}
    ValidateScore -->|Invalid| Reject5[Return 400 Bad Request]
    ValidateScore -->|Valid| CheckHash{Verify Client Hash}
    CheckHash -->|Mismatch| Reject6[Return 400 Bad Request]
    CheckHash -->|Match| MarkUsed[Mark Token as Used]
    MarkUsed --> UpdateDB[Update Score in Database]
    UpdateDB --> InvalidateCache[Invalidate Leaderboard Cache]
    InvalidateCache --> Broadcast[Broadcast via WebSocket]
    Broadcast --> Success[Return 200 OK]
```

### 3. Rate Limiting

**Per User:**
- Maximum 10 score updates per minute
- Maximum 100 score updates per hour

**Per IP:**
- Maximum 50 requests per minute
- Maximum 500 requests per hour

**Implementation:** Redis with sliding window algorithm

### 4. Score Validation

- Verify `expectedScore` in action token matches `scoreIncrement` in request
- Check if `actionId` has not been used before
- Validate timestamp is not too old (< 5 minutes)
- Verify client hash to ensure data integrity

### 5. Anti-Cheat Measures

**Anomaly Detection:**
- Detect abnormal patterns (too many points in short time)
- Detect multiple accounts from same IP/device
- Detect abnormal score increments

**Audit Logging:**
- Log all score updates
- Log failed validation attempts
- Log suspicious activities

## Database Structure

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    score BIGINT DEFAULT 0,
    rank INTEGER,
    last_score_update TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_banned BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_score ON users(score DESC);
CREATE INDEX idx_users_rank ON users(rank);
```

### Score History Table
```sql
CREATE TABLE score_history (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action_id VARCHAR(100) UNIQUE NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    score_increment INTEGER NOT NULL,
    previous_score BIGINT NOT NULL,
    new_score BIGINT NOT NULL,
    action_token_hash VARCHAR(255) NOT NULL,
    client_ip VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_score_history_user ON score_history(user_id, created_at DESC);
CREATE INDEX idx_score_history_action ON score_history(action_id);
```

### Action Tokens Table
```sql
CREATE TABLE action_tokens (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action_id VARCHAR(100) UNIQUE NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    expected_score INTEGER NOT NULL,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_action_tokens_hash ON action_tokens(token_hash);
CREATE INDEX idx_action_tokens_user ON action_tokens(user_id, created_at DESC);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    severity VARCHAR(20), -- INFO, WARNING, CRITICAL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity, created_at DESC);
```

## Detailed Execution Flows

### Flow 1: User Completes Action and Updates Score

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Gateway
    participant Auth as Auth Service
    participant Token as Token Service
    participant Verify as Verification Service
    participant Score as Score Service
    participant DB as Database
    participant Redis as Redis Cache
    participant WS as WebSocket Server
    
    Note over C: User starts action
    C->>API: POST /api/action/token
    API->>Auth: Validate JWT
    Auth-->>API: JWT Valid
    API->>Token: Generate Action Token
    Token->>DB: Store token metadata
    Token->>Redis: Cache token (5 min TTL)
    Token-->>C: Return action token
    
    Note over C: User completes action
    C->>C: Calculate client hash
    C->>API: POST /api/score/update
    API->>Auth: Validate JWT
    Auth-->>API: JWT Valid
    API->>Verify: Validate Action Token
    Verify->>Redis: Check token exists
    Redis-->>Verify: Token found
    Verify->>Verify: Check token not used
    Verify->>Verify: Check not expired
    Verify->>Verify: Verify score matches
    Verify->>Verify: Verify client hash
    Verify->>Redis: Check rate limit
    Redis-->>Verify: Rate limit OK
    Verify-->>API: Validation passed
    
    API->>Token: Mark token as used
    Token->>DB: UPDATE action_tokens SET is_used=true
    Token->>Redis: Delete token from cache
    
    API->>Score: Update user score
    Score->>DB: BEGIN TRANSACTION
    Score->>DB: SELECT score FROM users FOR UPDATE
    Score->>DB: UPDATE users SET score = score + increment
    Score->>DB: INSERT INTO score_history
    Score->>DB: COMMIT TRANSACTION
    
    Score->>DB: Recalculate ranks (async)
    Score->>Redis: Invalidate leaderboard cache
    Score->>Redis: Update user score cache
    
    Score->>WS: Broadcast score update
    WS->>C: Real-time leaderboard update
    
    Score-->>API: Update successful
    API-->>C: Return new score and rank
```

### Flow 2: Get Leaderboard with Caching

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Gateway
    participant Cache as Redis Cache
    participant DB as Database
    
    C->>API: GET /api/leaderboard
    API->>Cache: GET leaderboard:top10
    
    alt Cache Hit
        Cache-->>API: Return cached data
        API-->>C: Return leaderboard (fast)
    else Cache Miss
        Cache-->>API: NULL
        API->>DB: SELECT top 10 users ORDER BY score DESC
        DB-->>API: Return user data
        API->>Cache: SET leaderboard:top10 (TTL: 5s)
        API-->>C: Return leaderboard
    end
```

## Recommended Tech Stack

### Backend Framework
- **Node.js + Express** or **NestJS** (TypeScript)
- **Python + FastAPI** (alternative)

### Database
- **PostgreSQL** - Primary database
- **Redis** - Caching and rate limiting

### Real-time Communication
- **Socket.io** or **WebSocket (ws library)**

### Authentication
- **JWT (jsonwebtoken)**
- **bcrypt** - Password hashing

### Security
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **joi** or **zod** - Input validation

### Monitoring
- **Winston** or **Pino** - Logging
- **Prometheus** + **Grafana** - Metrics
- **Sentry** - Error tracking

## API Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_TOKEN` | 401 | JWT token is invalid or expired |
| `INVALID_ACTION_TOKEN` | 403 | Action token is invalid or expired |
| `TOKEN_ALREADY_USED` | 409 | Action token has already been used |
| `RATE_LIMIT_EXCEEDED` | 429 | Request limit exceeded |
| `INVALID_SCORE` | 400 | Invalid score |
| `HASH_MISMATCH` | 400 | Client hash mismatch |
| `ACTION_NOT_FOUND` | 404 | Action not found |
| `USER_BANNED` | 403 | User is banned |
| `INTERNAL_ERROR` | 500 | Server error |

## Testing Requirements

### Unit Tests
- Token generation and validation
- Score calculation logic
- Rate limiting logic
- Hash verification

### Integration Tests
- Complete score update flow
- Leaderboard retrieval with caching
- WebSocket broadcasting
- Database transactions

### Load Tests
- 1000 concurrent users
- 10,000 requests per minute
- WebSocket connection stability

### Security Tests
- Token replay attacks
- Rate limit bypass attempts
- SQL injection attempts
- XSS attempts

## Deployment Considerations

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/leaderboard
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Action Token
ACTION_TOKEN_SECRET=your-action-token-secret
ACTION_TOKEN_EXPIRES_IN=5m

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# WebSocket
WS_PORT=3001
WS_PATH=/ws/leaderboard
```

### Performance Optimization
- Database connection pooling (min: 10, max: 50)
- Redis connection pooling
- Horizontal scaling with load balancer
- Database read replicas for leaderboard queries
- CDN for static assets

### Monitoring Metrics
- Request latency (p50, p95, p99)
- Error rate
- Active WebSocket connections
- Cache hit rate
- Database query performance
- Rate limit hits

---

## 📝 Improvement Notes

> [!TIP]
> ### Performance Improvements
> 
> 1. **Redis Sorted Sets**
>    - Use Redis Sorted Sets (`ZADD`, `ZRANGE`) to store leaderboard instead of simple caching
>    - Real-time updates without querying database
>    - Significantly reduce load on PostgreSQL
> 
> 2. **Batch Rank Recalculation**
>    - Instead of recalculating rank after every update, run a batch job every 30 seconds
>    - Use PostgreSQL window functions to calculate rank more efficiently
>    - Reduce number of UPDATE queries

> [!IMPORTANT]
> ### Security Improvements
> 
> 1. **Server-side Action Validation**
>    - Instead of client calculating `expectedScore`, server should calculate based on `actionType`
>    - Create a lookup table for score values of each action type
>    - Client only sends `actionId` and `actionType`, server verifies and calculates score
> 
> 2. **Device Fingerprinting**
>    - Implement device fingerprinting to detect multi-accounting
>    - Track IP, User-Agent, Canvas fingerprint, WebGL fingerprint
>    - Alert when detecting multiple accounts from same device
> 
> 3. **Proof of Work**
>    - Require client to solve a simple puzzle before submitting score
>    - Increase cost for attackers wanting to spam requests
>    - Use HashCash or similar

> [!NOTE]
> ### User Experience Improvements
> 
> 1. **Optimistic Updates**
>    - Client updates UI immediately (optimistic)
>    - Rollback if server rejects
>    - Improve perceived performance
> 
> 2. **Personal Rank Display**
>    - Besides top 10, display current user's rank
>    - Display users around them (±5 ranks)
>    - Create competitive motivation
> 
> 3. **Historical Data**
>    - API to view user's score history
>    - Statistical charts of progress over time
>    - Weekly/Monthly leaderboards

> [!WARNING]
> ### Scalability Improvements
> 
> 1. **Sharding Strategy**
>    - When user base is large, consider sharding database by region or user_id range
>    - Use Citus or PostgreSQL partitioning
> 
> 2. **Message Queue**
>    - Use RabbitMQ or Kafka for score updates
>    - Async processing to avoid blocking
>    - Retry mechanism for failed updates
> 
> 3. **Multi-region Deployment**
>    - Deploy API servers in multiple regions
>    - Use global load balancer (Cloudflare, AWS Global Accelerator)
>    - Database replication across regions

> [!CAUTION]
> ### Data Integrity Improvements
> 
> 1. **Blockchain-inspired Audit Trail**
>    - Each score update creates a hash chain
>    - Current hash = hash(previous_hash + current_data)
>    - Detect data tampering
> 
> 2. **Periodic Reconciliation**
>    - Run periodic job to verify total score in `users` table matches `score_history`
>    - Alert if inconsistency detected
> 
> 3. **Backup Strategy**
>    - Point-in-time recovery for PostgreSQL
>    - Redis persistence (AOF + RDB)
>    - Automated daily backups

> [!TIP]
> ### Monitoring & Analytics Improvements
> 
> 1. **Real-time Dashboard**
>    - Dashboard displaying real-time metrics
>    - Active users, requests/second, error rate
>    - Top actions, top users
> 
> 2. **Anomaly Detection**
>    - Machine learning model to detect cheating patterns
>    - Alert when anomalies detected
>    - Automatically flag suspicious accounts
> 
> 3. **A/B Testing Framework**
>    - Framework to test different scoring strategies
>    - Measure impact on user engagement
>    - Data-driven decision making

---

## Conclusion

This specification provides a comprehensive solution for a real-time leaderboard system with strong security features. The two-token architecture combined with server-side validation, rate limiting, and audit logging ensures data integrity and effectively prevents cheating.

The backend team can start implementation with basic endpoints and gradually add advanced features following the improvement suggestions above.
