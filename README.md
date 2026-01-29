# Social Networking App

## Quick Start

### Local Development

1. Clone the repo

```bash
git clone https://github.com/asinthelol/social-networking-app.git
cd social-networking-app
```

2. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Run the backend

```bash
cd ../backend
uvicorn app.main:app --reload
```

Backend runs on [http://127.0.0.1:8000](http://127.0.0.1:8000)

5. Run the frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

Frontend runs on [http://localhost:3000](http://localhost:3000)

## How To Use

1. Register a new account (optional: check "Register as Admin" for admin privileges)
2. Log in with your credentials
3. Create posts, upload images, and share your thoughts
4. Search for users and add them as friends
5. View your personalized feed with posts from friends
6. Comment on posts and interact with the community
7. Visit user profiles to see their posts and friends
8. Admin users can delete any post or user account

## Features

- User authentication and authorization
- Admin role system with elevated permissions
- Create, edit, and delete posts
- Image uploads for profiles and posts
- Friend connections and social network
- Search users and posts
- Comment system

## Built With

- **Frontend**: Next.js, React, TypeScript, Tailwind
- **Backend**: Python, SQLAlchemy, FastAPI, Pydantic
- **Database**: SQLite
- **Deployment (For Schoolwork)**: Docker, AWS EC2, RDS

## License

I don't care what you do with it, just don't say you made this.

---

### by kevin tolbert

![UML Diagram](frontend/graphviz.svg)
