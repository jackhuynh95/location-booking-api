# Admin App

Vite React reviewer UI for the `location-booking-api` assignment.

## Stack

- React 19
- TypeScript
- Vite
- Plain CSS
- `lucide-react` icons

## Local Development

Start the backend from `apps/server`, then run:

```bash
npm install
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

Open `http://localhost:5173/admin/`.

## Reviewer Flow

1. From `apps/server`, run migrations and seed the assignment data:

```bash
npm run migration:run
npm run seed:locations
```

2. Open the admin UI and refresh the location hierarchy.
3. If the seed has not been loaded, the admin shows the exact seed command to run.
4. Use the create/update location form for quick CRUD review.
5. Use the booking validation form to submit valid or invalid booking requests and inspect API errors.

The admin reads backend APIs directly. It does not bundle assignment sample rows.

## Production Build

```bash
npm run build
```

Vite writes static assets to `apps/admin/dist` with base path `/admin/`. The server Dockerfile copies those assets into `public/admin` inside the NestJS runtime image.
