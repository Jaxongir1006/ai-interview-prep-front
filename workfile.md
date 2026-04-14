# Dashboard API JSON Contracts

This file defines the JSON formats needed to connect the frontend dashboard to the backend cleanly.

The dashboard should load from one aggregate endpoint first:

```http
GET /api/v1/dashboard/overview?range=7d
Authorization: Bearer <access_token>
```

Use smaller endpoints later for filtering, pagination, refreshes, or detail views.

## Shared Rules

- Use ISO 8601 UTC timestamps for exact events: `2026-04-14T10:30:00Z`.
- Use `YYYY-MM-DD` for chart buckets.
- Scores should be integers from `0` to `100`.
- Durations should be seconds, not formatted strings.
- Topics should include stable IDs plus display names.
- Chart arrays should be sorted oldest to newest.
- Return empty arrays instead of omitting sections.
- Return `null` for unavailable scores, not `0`.

Allowed trend values:

```json
["up", "down", "flat", "new"]
```

Allowed priority values:

```json
["low", "medium", "high"]
```

## Main Dashboard Overview Response

```json
{
  "user": {
    "id": "user_123",
    "full_name": "John Developer",
    "email": "john@example.com",
    "avatar_url": null,
    "target_role": {
      "id": "python",
      "name": "Python Backend"
    },
    "experience_level": {
      "id": "mid",
      "name": "Mid-Level"
    }
  },
  "stats": {
    "total_interviews": {
      "value": 48,
      "delta_percent": 12,
      "delta_direction": "up"
    },
    "average_score": {
      "value": 87,
      "delta_percent": 5,
      "delta_direction": "up"
    },
    "current_streak_days": {
      "value": 7,
      "is_record": true
    },
    "total_practice_seconds": {
      "value": 86400,
      "delta_percent": 18,
      "delta_direction": "up"
    }
  },
  "performance": {
    "range": "7d",
    "summary": {
      "average_score": 87,
      "score_delta_percent": 15,
      "interviews_completed": 8,
      "practice_seconds": 14400
    },
    "points": [
      {
        "date": "2026-04-08",
        "label": "Wed",
        "average_score": 68,
        "interviews_completed": 1,
        "practice_seconds": 1800
      }
    ]
  },
  "topics": {
    "items": [
      {
        "id": "algorithms",
        "name": "Algorithms",
        "score": 85,
        "questions_answered": 25,
        "correctness_rate": 0.85,
        "average_time_seconds": 360,
        "trend": "up",
        "level": "strong"
      }
    ],
    "weak": [
      {
        "id": "security",
        "name": "Security",
        "score": 65,
        "questions_answered": 12,
        "reason": "Lowest average score in the selected range.",
        "recommended_action": "Review authentication, authorization, and SQL injection prevention."
      }
    ],
    "strong": [
      {
        "id": "api_design",
        "name": "API Design",
        "score": 90,
        "questions_answered": 20,
        "reason": "Consistently high scores across recent sessions."
      }
    ]
  },
  "recent_activity": {
    "items": [
      {
        "session_id": "session_123",
        "title": "Python Backend Interview",
        "status": "completed",
        "score": 87,
        "started_at": "2026-04-14T09:30:00Z",
        "completed_at": "2026-04-14T10:30:00Z",
        "duration_seconds": 3600,
        "question_count": 5,
        "answered_count": 5,
        "topics": [
          {
            "id": "algorithms",
            "name": "Algorithms"
          }
        ]
      }
    ],
    "next_cursor": null
  },
  "recommendations": {
    "recommended_topics": [
      {
        "id": "security",
        "name": "Security",
        "priority": "high",
        "reason": "Your Security score is below your overall average."
      }
    ],
    "next_interview": {
      "target_role": {
        "id": "python",
        "name": "Python Backend"
      },
      "experience_level": {
        "id": "mid",
        "name": "Mid-Level"
      },
      "topics": [
        {
          "id": "security",
          "name": "Security"
        }
      ],
      "difficulty": "medium",
      "question_count": 5,
      "estimated_duration_seconds": 3600
    }
  }
}
```

## Frontend Mapping

| Dashboard UI | JSON path |
| --- | --- |
| Welcome text | `user.full_name` |
| Total interviews card | `stats.total_interviews` |
| Average score card | `stats.average_score` |
| Streak card | `stats.current_streak_days` |
| Practice time card | `stats.total_practice_seconds` |
| Performance chart | `performance.points` |
| Topic bar chart | `topics.items` |
| Weak topics list | `topics.weak` |
| Strong topics list | `topics.strong` |
| Recent activity list | `recent_activity.items` |
| Recent activity pagination | `recent_activity.next_cursor` |
| CTA topic chips | `recommendations.recommended_topics` |
| Start interview defaults | `recommendations.next_interview` |

## Smaller Dashboard Endpoints

```http
GET /api/v1/dashboard/stats?range=30d
GET /api/v1/dashboard/performance-trend?range=30d&topic_id=algorithms
GET /api/v1/dashboard/topics?range=30d
GET /api/v1/dashboard/recent-activity?limit=10&cursor=session_123
GET /api/v1/dashboard/recommendations
```

## Empty State

For a new user, keep the same response shape and return empty arrays:

```json
{
  "stats": {
    "total_interviews": {
      "value": 0,
      "delta_percent": 0,
      "delta_direction": "flat"
    },
    "average_score": {
      "value": null,
      "delta_percent": 0,
      "delta_direction": "flat"
    },
    "current_streak_days": {
      "value": 0,
      "is_record": false
    },
    "total_practice_seconds": {
      "value": 0,
      "delta_percent": 0,
      "delta_direction": "flat"
    }
  },
  "performance": {
    "range": "7d",
    "summary": {
      "average_score": null,
      "score_delta_percent": 0,
      "interviews_completed": 0,
      "practice_seconds": 0
    },
    "points": []
  },
  "topics": {
    "items": [],
    "weak": [],
    "strong": []
  },
  "recent_activity": {
    "items": [],
    "next_cursor": null
  },
  "recommendations": {
    "recommended_topics": []
  }
}
```

## Error Format

Use the same error shape across dashboard APIs:

```json
{
  "code": "DASHBOARD_UNAVAILABLE",
  "message": "Dashboard data is temporarily unavailable.",
  "details": "Try again later."
}
```
