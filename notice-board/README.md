# Notice Board

A full-stack Notice Board built for the Reno Platforms web development assignment. It supports creating, reading, updating, and deleting notices with server-side validation, Prisma + MySQL persistence, and responsive UI.

## Tech Stack

- Next.js (Pages Router) + TypeScript
- Prisma + TiDB Cloud (MySQL)
- Tailwind CSS
- Zod (server-side validation)
- Vercel (deployment)

## Features

- Notice list with responsive cards
- Shared create/edit form
- Delete confirmation before removal
- Urgent notices sorted first via Prisma `orderBy`
- Red **Urgent** badge on urgent notices
- Optional image URL field (bonus)
- Server-side validation in API routes

## Run Locally

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Add your hosted MySQL connection string to `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/notice_board?sslaccept=strict"
```

4. Push the Prisma schema to your database:

```bash
npx prisma db push
npx prisma generate
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/notices` | List all notices (Urgent first) |
| POST | `/api/notices` | Create a notice |
| GET | `/api/notices/[id]` | Get one notice |
| PUT | `/api/notices/[id]` | Update a notice |
| DELETE | `/api/notices/[id]` | Delete a notice |

## Deploy on Vercel

1. Push the project to a public GitHub repository.
2. Import the repo into Vercel.
3. Add the `DATABASE_URL` environment variable in Vercel project settings.
4. Deploy.
5. Run `npx prisma db push` once against the production database if tables are not created yet.

## One Thing I Would Improve With More Time

Add proper image upload support (for example with Cloudinary) instead of only accepting image URLs, plus pagination and search/filter by category on the notice list page.

## AI Usage

AI was used to:

- Plan the project structure and Prisma setup steps
- Generate initial boilerplate for API routes, form components, and validation schemas
- Troubleshoot TiDB/Prisma connection issues (provider mismatch and Prisma 7 config)
- Draft the README structure

All code was reviewed, adapted, and tested locally before submission.
