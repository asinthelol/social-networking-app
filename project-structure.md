# Social Networking App - Project Structure

```
social-networking-app/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── details/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx           # Own profile
│   │   │   └── [id]/
│   │   │       └── page.tsx       # User profile
│   │   ├── login/
│   │   │   └── page.tsx           # Optional
│   │   └── register/
│   │       └── page.tsx
│   ├── features/
│   │   ├── posts/
│   │   │   ├── components/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostDetail.tsx
│   │   │   │   ├── CreatePost.tsx
│   │   │   │   └── PostFeed.tsx
│   │   │   └── hooks/
│   │   │       ├── usePosts.ts
│   │   │       └── useCreatePost.ts
│   │   ├── comments/
│   │   │   ├── components/
│   │   │   │   ├── CommentSection.tsx
│   │   │   │   └── CommentItem.tsx
│   │   │   └── hooks/
│   │   │       └── useComments.ts
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   ├── ProfileCard.tsx
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   └── EditProfile.tsx
│   │   │   └── hooks/
│   │   │       └── useProfile.ts
│   │   ├── friends/
│   │   │   ├── components/
│   │   │   │   ├── FriendsList.tsx
│   │   │   │   └── FriendCard.tsx
│   │   │   └── hooks/
│   │   │       └── useFriends.ts
│   │   └── search/
│   │       ├── components/
│   │       │   ├── SearchBar.tsx
│   │       │   ├── SearchResults.tsx
│   │       │   └── UserResult.tsx
│   │       └── hooks/
│   │           └── useSearch.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Layout.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   └── hooks/
│   │       └── useApi.ts
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
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── upload_utils.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── router.py
│   │       ├── users.py
│   │       ├── posts.py
│   │       ├── comments.py
│   │       ├── friends.py
│   │       ├── feed.py
│   │       ├── search.py
│   │       └── upload.py
│   ├── uploads/
│   │   ├── profile_pictures/
│   │   └── post_images/
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

### Pages
1. **Home** (`/`) - Public feed or personalized feed
2. **Search** (`/search`) - Search users and posts with results
3. **Post Details** (`/details/[id]`) - Individual post with comments
4. **Login** (`/login`) - Login page (optional)
5. **Register** (`/register`) - Registration page (optional)
6. **Own Profile** (`/profile`) - Current user's profile
7. **User Profile** (`/profile/[id]`) - View other user's profile

### Backend API Endpoints
- **Users**: GET, POST, PUT, DELETE users
- **Posts**: CRUD operations, get by user
- **Comments**: Create, read, delete on posts
- **Friends**: Add, remove, list friends
- **Feed**: Personalized feed, public feed
- **Search**: Search users and posts
- **Upload**: Profile pictures, post images

### Features
- User profiles
- Posts
- Comments on posts
- Friend connections
- News feed/timeline
- Search functionality
- Image uploads
