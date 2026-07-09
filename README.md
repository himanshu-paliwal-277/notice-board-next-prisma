# Notice Board

A notice board app with full CRUD support, built with Next.js, Prisma, and MySQL.

## Tech Stack

- Next.js (Pages Router) + TypeScript
- Prisma + TiDB Cloud (MySQL)
- Tailwind CSS
- Zod

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/notice_board?sslaccept=strict"
```

3. Set up the database:

```bash
npx prisma db push
npx prisma generate
```

4. Start the app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add `DATABASE_URL` in Environment Variables.
4. Set **Framework Preset** to **Next.js** and leave **Root Directory** empty.
5. Deploy.

## One Thing I Would Improve With More Time

Add image upload support and pagination on the notice list page.
