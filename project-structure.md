# Social Networking App - Project Structure

```
social-networking-app/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── profile/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── feed/
│   │   │   └── page.tsx
│   │   └── friends/
│   │       └── page.tsx
│   ├── features/
│   │   ├── auth/
│   │   ├── posts/
│   │   │   ├── components/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   └── CreatePost.tsx
│   │   │   └── hooks/
│   │   ├── comments/
│   │   │   └── components/
│   │   │       └── CommentSection.tsx
│   │   ├── profile/
│   │   │   └── components/
│   │   │       └── ProfileCard.tsx
│   │   └── friends/
│   │       └── components/
│   │           └── FriendsList.tsx
│   ├── shared/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   └── hooks/
│   ├── types/
│   │   └── global.d.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── components.json
│   └── next.config.ts
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
