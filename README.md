# MegaBlog

A full-stack blogging platform where users can sign up, write rich-text posts with featured images, and manage their own content. Built with React and Appwrite as the backend.

**Live Demo:** [appwrite-megablog-seven.vercel.app](https://appwrite-megablog-seven.vercel.app)

## Features
- User authentication (signup, login, logout) using Appwrite Auth
- Create, edit and delete blog posts
- Rich text editor for writing posts
- Featured image upload and storage with Appwrite Storage
- Post status (active / inactive)
- Search posts by title, content, or category
- Comments and likes on posts
- Persistent light and dark themes
- Only the author can edit or delete their own posts
- Protected routes for logged-in users
- Global state management with Redux Toolkit
- Responsive UI built with Tailwind CSS

## Tech Stack
- **Frontend:** React, Vite, React Router, Redux Toolkit, React Hook Form, Tailwind CSS
- **Backend (BaaS):** Appwrite (Authentication, Database, Storage)
- **Editor:** TinyMCE

## Project Structure
```
src/
  appwrite/     # Appwrite service and auth config
  components/   # Reusable UI components
  pages/        # Route-level pages
  store/        # Redux store and slices
  conf/         # Environment config
```

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- An Appwrite project (Cloud or self-hosted)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Muskan-Kumari708/appwrite-megablog.git
cd appwrite-megablog
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root folder (copy `.env.sample`)
```
VITE_APPWRITE_URL=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_COLLECTION_ID=
VITE_APPWRITE_COMMENTS_TABLE_ID=
VITE_APPWRITE_LIKES_TABLE_ID=
VITE_APPWRITE_BUCKET_ID=
VITE_TINYMCE_API_KEY=
```

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
npm run preview
```

## Appwrite Setup

1. Create a project, database, and posts table with `title`, `content`, `featuredImage`, `status`, `userId`, and `category` columns. Add a `category` varchar column to an existing posts table.
2. Create a comments table with `postId`, `userId`, `userName`, and `content` columns. Add an index on `postId`.
3. Create a likes table with `postId` and `userId` columns. Add a unique index on `(postId, userId)` to prevent duplicate likes.
4. Enable Row Security on the comments and likes tables. Grant table-level Read to Any and Create to Users; leave table-level Update/Delete ungranted. The app assigns each new comment/like row's delete permission to its author.
5. For posts, grant the authenticated Users role the Read/Create permissions your app needs. Add required owner update/delete row permissions for existing posts according to your current Appwrite security setup.
6. Create a storage bucket for featured images and configure public read access if visitors should see post images.
7. Add your development and deployed domains under **Settings > Platforms**, then copy the IDs into `.env`.

The comments and likes tables are public to read by design. Do not store private data in those tables.

## Author
**Muskan Kumari**
GitHub: [@Muskan-Kumari708](https://github.com/Muskan-Kumari708)
