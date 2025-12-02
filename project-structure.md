# Social Networking App - Project Structure

```
social-networking-app/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── profile/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── feed/
│   │   │   └── page.tsx
│   │   └── friends/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── PostCard.tsx
│   │   ├── CommentSection.tsx
│   │   ├── ProfileCard.tsx
│   │   └── FriendsList.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── components.json
│   └── next.config.js
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── users.py
│   │       ├── posts.py
│   │       ├── comments.py
│   │       └── friends.py
│   ├── requirements.txt
│   ├── .env
│   └── database.db
│
└── project-structure.md
```

## Tech Stack

### Frontend
- **Next.js 14+**
- **TypeScript**
- **Shadcn/ui**
- **Tailwind CSS**

### Backend
- **FastAPI**
- **SQLite**
- **SQLAlchemy**
- **Pydantic**

## Core Features
- User profiles
- Posts
- Comments on posts
- Friend connections
- News feed/timeline
