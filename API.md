# API Documentation - Explore France

## Base URL

```
http://localhost:5000/api
```

## Response Format

All endpoints return JSON responses.

### Success Response
```json
{
  "id": "...",
  "name": "...",
  ...
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Regions Endpoints

### List All Regions

```http
GET /regions
```

**Response:** Array of regions
```json
[
  {
    "id": "abc123",
    "name": "Île-de-France",
    "description": "The heart of France...",
    "image_url": "https://...",
    "highlights": ["Eiffel Tower", "Louvre", "Notre-Dame"],
    "created_at": "2026-04-21T10:00:00Z",
    "updated_at": "2026-04-21T10:00:00Z"
  }
]
```

### Get Single Region

```http
GET /regions/:id
```

**Parameters:**
- `id` (string, required) - Region ID

**Response:** Single region object

### Create Region

```http
POST /regions
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Provence",
  "description": "A sun-drenched paradise famous for lavender fields",
  "image_url": "https://images.pexels.com/...",
  "highlights": ["Lavender Fields", "Nice", "Monaco"]
}
```

**Response:** Created region with ID and timestamps

**Status:** 201 Created

### Update Region

```http
PUT /regions/:id
```

**Parameters:**
- `id` (string, required) - Region ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "image_url": "https://...",
  "highlights": ["Updated", "Highlights"]
}
```

**Response:** Updated region object

**Status:** 200 OK

### Delete Region

```http
DELETE /regions/:id
```

**Parameters:**
- `id` (string, required) - Region ID

**Response:**
```json
{
  "success": true,
  "message": "Region deleted"
}
```

**Status:** 200 OK

---

## Quizzes Endpoints

### List All Quizzes

```http
GET /quizzes
```

**Response:** Array of quizzes with related region info
```json
[
  {
    "id": "quiz123",
    "title": "French Landmarks",
    "description": "Test your knowledge...",
    "region_id": "region123",
    "regions": {
      "id": "region123",
      "name": "Île-de-France"
    },
    "difficulty": "medium",
    "created_by": "admin123",
    "created_at": "2026-04-21T10:00:00Z"
  }
]
```

### Get Single Quiz with Questions

```http
GET /quizzes/:id
```

**Parameters:**
- `id` (string, required) - Quiz ID

**Response:** Quiz object with questions array
```json
{
  "id": "quiz123",
  "title": "French Landmarks",
  "description": "...",
  "difficulty": "medium",
  "questions": [
    {
      "id": "q1",
      "quiz_id": "quiz123",
      "question_text": "What is the capital of France?",
      "options": [
        {"id": "a", "text": "Paris"},
        {"id": "b", "text": "Lyon"},
        {"id": "c", "text": "Marseille"},
        {"id": "d", "text": "Toulouse"}
      ],
      "correct_answer": "a",
      "order_index": 0
    }
  ]
}
```

### Create Quiz

```http
POST /quizzes
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "French Landmarks",
  "description": "Test your knowledge of iconic French sites",
  "region_id": "region123",
  "difficulty": "medium",
  "questions": [
    {
      "question_text": "What is the capital of France?",
      "options": [
        {"id": "a", "text": "Paris"},
        {"id": "b", "text": "Lyon"},
        {"id": "c", "text": "Marseille"},
        {"id": "d", "text": "Toulouse"}
      ],
      "correct_answer": "a"
    },
    {
      "question_text": "Which is the tallest tower in Paris?",
      "options": [
        {"id": "a", "text": "Arc de Triomphe"},
        {"id": "b", "text": "Eiffel Tower"},
        {"id": "c", "text": "Notre-Dame"},
        {"id": "d", "text": "Sacré-Cœur"}
      ],
      "correct_answer": "b"
    }
  ]
}
```

**Response:** Created quiz object

**Status:** 201 Created

### Update Quiz

```http
PUT /quizzes/:id
```

**Parameters:**
- `id` (string, required) - Quiz ID

**Request Body:** Same as create (all questions are replaced)

**Note:** Updating a quiz will delete all old questions and create new ones.

**Response:** Updated quiz object

**Status:** 200 OK

### Delete Quiz

```http
DELETE /quizzes/:id
```

**Parameters:**
- `id` (string, required) - Quiz ID

**Response:**
```json
{
  "success": true,
  "message": "Quiz deleted"
}
```

**Status:** 200 OK

---

## Health Check Endpoint

### Server Status

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-21T10:00:00Z"
}
```

**Status:** 200 OK

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Name and description are required"
}
```

### 404 Not Found
```json
{
  "error": "Region not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create region"
}
```

---

## cURL Examples

### Create a Region

```bash
curl -X POST http://localhost:5000/api/regions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alsace",
    "description": "Where French and German cultures blend",
    "image_url": "https://images.pexels.com/photos/1320684/...",
    "highlights": ["Strasbourg", "Route des Vins", "Colmar"]
  }'
```

### Create a Quiz

```bash
curl -X POST http://localhost:5000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "French Cuisine",
    "description": "How well do you know French food?",
    "region_id": "region-id-here",
    "difficulty": "easy",
    "questions": [
      {
        "question_text": "What is Coq au Vin?",
        "options": [
          {"id": "a", "text": "Chicken braised in red wine"},
          {"id": "b", "text": "Duck confit"},
          {"id": "c", "text": "Fish stew"}
        ],
        "correct_answer": "a"
      }
    ]
  }'
```

### Fetch All Quizzes

```bash
curl http://localhost:5000/api/quizzes | jq .
```

### Update a Region

```bash
curl -X PUT http://localhost:5000/api/regions/region-id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "description": "Updated description",
    "image_url": "https://...",
    "highlights": ["New", "Highlights"]
  }'
```

### Delete a Quiz

```bash
curl -X DELETE http://localhost:5000/api/quizzes/quiz-id
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, add:

```bash
npm install express-rate-limit
```

---

## Authentication

Currently, the API has no authentication. For production, implement:

1. JWT tokens for authenticated endpoints
2. Admin-only routes for create/update/delete
3. CORS configuration for specific domains

---

## Data Validation

### Region

- `name`: Required, string (1-255 chars)
- `description`: Required, string (1+ chars)
- `image_url`: Optional, valid URL
- `highlights`: Optional, array of strings

### Quiz

- `title`: Required, string (1-255 chars)
- `description`: Required, string (1+ chars)
- `region_id`: Optional, valid region ID
- `difficulty`: Required, one of: easy, medium, hard
- `questions`: Optional, array of question objects

### Question

- `question_text`: Required, string (1+ chars)
- `options`: Required, array with 2-4 options
- `correct_answer`: Required, must match option ID (a, b, c, d)

Each option must have:
- `id`: Single letter (a, b, c, d)
- `text`: Option text

---

## Response Time

- List endpoints: ~50-100ms
- Single item endpoints: ~30-50ms
- Create/Update/Delete: ~100-200ms

Performance depends on MySQL query complexity and network latency.

---

## Pagination

Pagination is not currently implemented. For large datasets, implement:

```http
GET /api/regions?page=1&limit=20
```

---

## Filtering

Filtering is not currently implemented. Future versions could support:

```http
GET /api/quizzes?difficulty=easy
GET /api/quizzes?region_id=region123
```

---

## Database Connection

The API uses MySQL connection pooling with a limit of 10 concurrent connections. Ensure your database can handle the connection pool size.
