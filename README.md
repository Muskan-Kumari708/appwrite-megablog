# MegaBlog

A full-stack blogging platform where users can sign up, write rich-text posts with featured images, and manage their own content. Built with React and Appwrite as the backend.

**Live Demo:** (add your deployed link here)

## Features
- User authentication (signup, login, logout) using Appwrite Auth
- Create, edit and delete blog posts
- Rich text editor for writing posts
- Featured image upload and storage with Appwrite Storage
- Post status (active / inactive)
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

3. Create a `.env` file in the root folder (see `.env.example`)
```
VITE_APPWRITE_URL=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_COLLECTION_ID=
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
1. Create a project in the Appwrite console
2. Create a database and a collection for posts (title, slug, content, featuredImage, status, userId)
3. Create a storage bucket for images
4. Add your app's domain under **Settings > Platforms**
5. Copy the IDs into your `.env` file



## Future Improvements
- Comments and likes
- Search and categories
- Dark mode

## Author
**Muskan Kumari**
GitHub: [@Muskan-Kumari708](https://github.com/Muskan-Kumari708)
