# Social Networking App - Project Structure

```
social-networking-app/
├── frontend/                    # Next.js Frontend
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
│   │   ├── ui/                 # Shadcn components
│   │   ├── PostCard.tsx
│   │   ├── CommentSection.tsx
│   │   ├── ProfileCard.tsx
│   │   └── FriendsList.tsx
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── utils.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── components.json         # Shadcn config
│   └── next.config.js
│
├── backend/                     # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app entry
│   │   ├── database.py         # SQLAlchemy setup
│   │   ├── models.py           # Database models
│   │   ├── schemas.py          # Pydantic schemas
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── users.py
│   │       ├── posts.py
│   │       ├── comments.py
│   │       └── friends.py
│   ├── requirements.txt
│   ├── .env
│   └── database.db             # SQLite database (generated)
│
└── project-structure.md         # This file
```

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Shadcn/ui** - Component library
- **Tailwind CSS** - Styling

### Backend
- **FastAPI** - Python web framework
- **SQLite** - Database
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation

## Core Features
- User profiles (CRUD)
- Posts (create, read, update, delete)
- Comments on posts
- Friend connections
- News feed/timeline
