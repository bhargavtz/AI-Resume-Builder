# API Reference

Complete reference for all API endpoints in the AI Resume Builder application.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API routes (except webhooks and public shares) require authentication via Clerk.

**Headers:**
```
Cookie: __session=<clerk_session_token>
```

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* optional error details */ }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |
| `AI_SERVICE_ERROR` | AI service unavailable |

---

## Resume Endpoints

### Create Resume

Create a new resume.

**Endpoint:** `POST /api/resumes`

**Request Body:**
```json
{
  "title": "Software Engineer Resume"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Software Engineer Resume",
    "userId": "user_123",
    "content": {},
    "themeColor": "#3b82f6",
    "templateId": "modern",
    "status": "draft",
    "createdAt": "2025-12-11T05:30:00.000Z",
    "updatedAt": "2025-12-11T05:30:00.000Z"
  }
}
```

---

### Get All Resumes

Retrieve all resumes for the authenticated user with filtering and pagination.

**Endpoint:** `GET /api/resumes`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |
| `status` | string | all | Filter by status: `draft`, `complete`, `archived` |
| `search` | string | - | Search in resume titles |
| `sortBy` | string | recent | Sort order: `recent`, `alphabetical`, `created` |

**Example Request:**
```
GET /api/resumes?page=1&limit=10&status=draft&search=engineer&sortBy=recent
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumes": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Software Engineer Resume",
        "status": "draft",
        "updatedAt": "2025-12-11T05:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5,
      "hasMore": true
    },
    "filters": {
      "status": "draft",
      "search": "engineer",
      "sortBy": "recent"
    }
  }
}
```

---

### Get Resume by ID

Retrieve a specific resume.

**Endpoint:** `GET /api/resumes/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Software Engineer Resume",
    "content": {
      "personalDetails": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "summary": "Experienced software engineer...",
      "experience": [],
      "education": [],
      "skills": []
    }
  }
}
```

---

### Update Resume

Update resume content or metadata.

**Endpoint:** `PUT /api/resumes/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": {
    "personalDetails": {
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "themeColor": "#10b981",
  "status": "complete"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated resume */ }
}
```

---

### Delete Resume

Soft delete a resume.

**Endpoint:** `DELETE /api/resumes/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Resume deleted successfully"
  }
}
```

---

## AI Endpoints

### Generate Summary

Generate a professional summary using AI.

**Endpoint:** `POST /api/ai/generate-summary`

**Request Body:**
```json
{
  "jobTitle": "Software Engineer",
  "experience": "5 years of full-stack development",
  "skills": "React, Node.js, TypeScript"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Experienced Software Engineer with 5 years..."
  }
}
```

**Rate Limit:** 10 requests per minute

---

### Generate Bullet Points

Generate work experience bullet points.

**Endpoint:** `POST /api/ai/generate-bullets`

**Request Body:**
```json
{
  "jobTitle": "Senior Developer",
  "context": "experience",
  "companyName": "Tech Corp",
  "experience": "Led development team",
  "skills": "React, Node.js"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bullets": [
      "Led a team of 5 developers...",
      "Architected scalable solutions...",
      "Improved performance by 40%..."
    ]
  }
}
```

---

### ATS Score Analysis

Analyze resume for ATS compatibility.

**Endpoint:** `POST /api/ai/ats-score`

**Request Body:**
```json
{
  "resumeContent": { /* full resume content */ },
  "jobDescription": "Optional job description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "feedback": "Your resume is well-optimized...",
    "suggestions": [
      "Add more quantifiable achievements",
      "Include relevant keywords"
    ]
  }
}
```

---

### Generate Cover Letter

Create a personalized cover letter.

**Endpoint:** `POST /api/ai/cover-letter`

**Request Body:**
```json
{
  "resumeContent": { /* resume content */ },
  "jobTitle": "Software Engineer",
  "companyName": "Tech Corp",
  "jobDescription": "Optional job description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "coverLetter": "Dear Hiring Manager,\n\nI am writing..."
  }
}
```

---

### Suggest Skills

Get AI-powered skill suggestions.

**Endpoint:** `POST /api/ai/suggest-skills`

**Request Body:**
```json
{
  "jobTitle": "Frontend Developer",
  "industry": "Technology",
  "currentSkills": ["React", "JavaScript"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "GraphQL"
    ]
  }
}
```

---

### Improve Resume

Get AI suggestions for resume improvement.

**Endpoint:** `POST /api/ai/improve-resume`

**Request Body:**
```json
{
  "resumeContent": { /* resume content */ },
  "targetJobTitle": "Senior Software Engineer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "Add more quantifiable metrics",
      "Highlight leadership experience",
      "Include relevant certifications"
    ]
  }
}
```

---

## Share Endpoints

### Create Share Link

Generate a shareable link for a resume.

**Endpoint:** `POST /api/resumes/:id/share`

**Request Body (Optional):**
```json
{
  "expiryDays": 30,
  "maxViews": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shareToken": "abc123def456",
    "shareUrl": "https://your-domain.com/share/abc123def456",
    "expiresAt": "2026-01-11T05:30:00.000Z"
  }
}
```

---

### Access Shared Resume

View a shared resume (public endpoint).

**Endpoint:** `GET /api/share/:token`

**Response:**
```json
{
  "success": true,
  "data": {
    "resume": { /* resume content */ },
    "viewsRemaining": 95
  }
}
```

---

## Webhook Endpoints

### Clerk Webhook

Handle Clerk user lifecycle events.

**Endpoint:** `POST /api/webhooks/clerk`

**Headers:**
```
svix-id: msg_...
svix-timestamp: 1234567890
svix-signature: v1,signature...
```

**Events Handled:**
- `user.created`
- `user.updated`
- `user.deleted`

---

## Rate Limiting

All AI endpoints are rate-limited:

- **Limit**: 10 requests per minute per user
- **Window**: 60 seconds

**Rate Limit Headers:**
```
X-RateLimit-Remaining: 8
X-Request-ID: abc123def456
```

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "retryAfter": 45
  }
}
```

---

## Examples

### Complete Resume Creation Flow

```javascript
// 1. Create resume
const createRes = await fetch('/api/resumes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'My Resume' })
});
const { data: resume } = await createRes.json();

// 2. Generate summary
const summaryRes = await fetch('/api/ai/generate-summary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jobTitle: 'Software Engineer',
    experience: '5 years',
    skills: 'React, Node.js'
  })
});
const { data: { summary } } = await summaryRes.json();

// 3. Update resume
await fetch(`/api/resumes/${resume._id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: { summary }
  })
});
```

---

**Need Help?** Check the [Troubleshooting Guide](./troubleshooting.md) or [report an issue](https://github.com/bhargavtz/AI-Resume-Builder/issues).
