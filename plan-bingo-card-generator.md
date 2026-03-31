# Plan: Fullstack Bingo Card Generator

## TL;DR

Build a learning-focused web application for creating, editing, and tracking Bingo cards. User creates cards of custom sizes, marks cells as complete, and system stores progress in a database. This plan follows a **3-phase iterative approach**: foundation setup → core features → enhancement, with GitHub issues and testing at each step. Tech stack: **Next.js (frontend) + Express (backend) + MongoDB (database)** deployed to Vercel + Railway.

---

## Phase 0: Project Setup & Planning (Duration: 2-3 hours)

This phase establishes the repository, project structure, and planning artifacts.

### Steps

1. **Create GitHub repository**
   - Create repository named `bingo-card-generator`
   - Add comprehensive README with project description, feature list, tech stack, and setup instructions
   - Add necessary initial files: `.gitignore`, `LICENSE`, `.env.example`
   - Create 3 milestone issues: `v1-MVP`, `v2-Testing`, `v3-Polish`

2. **Create GitHub Issue Templates**
   - Create `.github/ISSUE_TEMPLATE/feature.md` for feature requests
   - Create `.github/ISSUE_TEMPLATE/bug.md` for bug reports
   - Set up GitHub Project board (board + columns: "Backlog", "In Progress", "Review", "Done")

3. **Create initial project structure**
   - `frontend/` — Next.js application directory
   - `backend/` — Express server directory
   - `database-schema/` — MongoDB schema documentation
   - `.github/` — GitHub workflows and issue templates
   - `DEVELOPMENT.md` — Detailed local development guide with explanations

4. **Document API contract** (in DEVELOPMENT.md + `backend/API_SPEC.md`)
   - List all REST endpoints the frontend will call
   - Define request/response formats
   - Example: `GET /api/cards`, `POST /api/cards`, `PATCH /api/cards/:id`, `DELETE /api/cards/:id`

**Verification**: README renders on GitHub, issue templates appear when creating issues, project board is visible with at least 1 milestone.

---

## Phase 1: MVP - Core Bingo Functionality (Duration: 8-12 hours)

This phase implements the minimum viable product: card creation, editing, persistence, and win detection.

### 1A: Backend Foundation (Duration: 3-4 hours)

_Parallel with 1B (frontend can start immediately with mock API)_

**Steps:**

1. **Initialize Express server**
   - Create `backend/` folder structure:
     ```
     backend/
     ├── src/
     │   ├── server.ts          — server entry point
     │   ├── routes/            — API routes
     │   ├── models/            — Mongoose schemas
     │   ├── controllers/        — request handlers
     │   └── middleware/         — CORS, error handling
     ├── .env.example
     ├── package.json
     └── tsconfig.json
     ```
   - Install dependencies: `express`, `mongoose`, `cors`, `dotenv`, `typescript`
   - Create basic server with CORS enabled and 404 handler

2. **Set up MongoDB connection**
   - Create Mongoose connection in `backend/src/db.ts`
   - Document how environment variables work (create `.env.example` with `MONGODB_URI`)
   - Add connection error handling and retry logic comments

3. **Implement BingoCard Mongoose schema** (`backend/src/models/BingoCard.ts`)
   - Fields: `_id` (MongoDB auto), `title` (string), `gridSize` (number: 3-5), `cells` (array of objects: `{id, text, checked}`), `createdAt`, `updatedAt`
   - Add validation: gridSize between 3-5, cell text max 50 chars
   - Include code comments explaining each field's purpose

4. **Implement API controllers** (`backend/src/controllers/cardController.ts`)
   - `getAllCards()` — fetch all cards (GET /api/cards)
   - `getCardById(id)` — fetch single card (GET /api/cards/:id)
   - `createCard(gridSize, title)` — create new card (POST /api/cards)
   - `updateCard(id, cells)` — mark cells checked/unchecked (PATCH /api/cards/:id)
   - `deleteCard(id)` — delete card (DELETE /api/cards/:id)
   - Add parameter validation and error responses with meaningful messages

5. **Set up routes** (`backend/src/routes/cards.ts`)
   - Wire controllers to Express routes for all CRUD operations
   - Add error middleware: catch-all handler that logs and responds with status 500

6. **Create Railway deployment config**
   - Add `.env` to Railway (MONGODB_URI from MongoDB Atlas)
   - Document how to redeploy after code changes

**Verification:**

- Run locally: `npm run dev` starts server on port 5000
- Test endpoints in curl/Postman: create card → get all → update → delete all work
- Database shows new entries after each request
- Error handling: invalid gridSize returns 400, missing ID returns 404

### 1B: Frontend Foundation (Duration: 3-4 hours)

_Can run in parallel with 1A_

**Steps:**

1. **Initialize Next.js project**
   - Create `frontend/` directory:
     ```
     npx create-next-app@latest frontend --typescript
     ```
   - Setup includes: TypeScript, ESLint, Tailwind CSS (for quick styling)
   - Keep default app structure

2. **Set up API client** (`frontend/lib/api.ts`)
   - Create fetch wrapper with error handling
   - Base URL from env var (`.env.local`: `NEXT_PUBLIC_API_URL`)
   - Create methods: `fetchCards()`, `createCard()`, `updateCard()`, `deleteCard()`
   - Document each method with JSDoc comments
   - Handle network errors gracefully (return default values, show UI errors)

3. **Create page structure**
   - `frontend/app/page.tsx` — main page (card list + create form)
   - `frontend/app/card/[id]/page.tsx` — card editor page
   - Add basic navigation between pages

4. **Implement CardList component** (`frontend/components/CardList.tsx`)
   - Fetch and display all cards on mount
   - Show: title, grid size, completion progress (e.g., "8/9 cells marked")
   - Add buttons: "Edit", "Delete"
   - Add "New Card" button

5. **Implement CardEditor component** (`frontend/components/CardEditor.tsx`)
   - Display grid of cells based on gridSize
   - Each cell is editable text input + checkbox
   - Save button calls backend UPDATE endpoint
   - Show success/error message on save
   - Add win detection: if all cells checked, show "🎉 Bingo! You won!"

6. **Implement CreateCardForm component** (`frontend/components/CreateCardForm.tsx`)
   - Input fields: Card title, grid size (dropdown 3-5)
   - Submit creates card and redirects to editor
   - Show loading state during submit

7. **Set up Vercel deployment config**
   - Add `vercel.json` (optional, for custom output)
   - Document that env var `NEXT_PUBLIC_API_URL` must be set in Vercel dashboard

**Verification:**

- Run locally: `npm run dev` opens frontend on http://localhost:3000
- CreateCardForm creates new card and navigates to editor
- CardEditor displays cells correctly and can toggle checkboxes
- Save updates database (refresh page shows persisted state)
- CardList shows all cards with correct completion progress

### 1C: Integration Testing (Duration: 1-2 hours)

**Steps:**

1. **Create backend tests** (`backend/test/controllers.test.ts` or `backend/test/cards.integration.test.ts`)
   - Use `jest` + `supertest` for integration testing
   - Test each CRUD endpoint with valid and invalid inputs
   - Example tests:
     - `POST /api/cards` with valid data creates card ✓
     - `POST /api/cards` with gridSize=10 returns 400 ✓
     - `GET /api/cards/:id` returns correct card ✓
     - `PATCH /api/cards/:id` marks cells checked ✓
     - `DELETE /api/cards/:id` removes card ✓
   - Add comments explaining what each test validates

2. **Create frontend tests** (`frontend/__tests__/components.test.tsx`)
   - Use `jest` + `@testing-library/react`
   - Test CardList renders cards fetched from API
   - Test CardEditor checkbox toggle updates UI
   - Test CreateCardForm submits correctly
   - Mock API responses to avoid real server calls

3. **Add test scripts to package.json**
   - Backend: `npm run test` runs Jest with coverage
   - Frontend: `npm run test` runs Jest tests

**Verification**: All tests pass locally, coverage > 70% for controllers/main components.

### End of Phase 1 Deliverables:

- GitHub Issues created: 5-8 detailed issues covering each step
- Fully functional Bingo card CRUD application
- Cards persist in MongoDB and load on page refresh
- Win detection message appears when all cells marked
- All endpoints tested
- Deployed to Vercel (frontend) + Railway (backend)

---

## Phase 2: Enhancement & Polish (Duration: 4-6 hours)

### 2A: Save/Download Feature (Optional for v2)

**Steps:**

1. Create backend endpoint `GET /api/cards/:id/export` that returns card as JSON
2. Create frontend Download button in CardEditor
3. Add "Export as PDF" button using `jsPDF` or `html2pdf` library
4. Document code patterns for file generation

### 2B: Local Storage Optimization (Recommended for v2)

**Steps:**

1. Implement client-side caching of card state
2. Add LocalStorage or IndexedDB for offline card editing
3. Sync when network returns
4. Document trade-offs of local vs. server storage

### 2C: Mobile Responsiveness

**Steps:**

1. Ensure grid and buttons work on mobile screens
2. Test on various breakpoints
3. Verify touch interactions work smoothly

---

## Relevant Files & Structure

```
bingo-card-generator/
├── backend/
│   ├── src/
│   │   ├── server.ts                      — Express setup
│   │   ├── db.ts                          — MongoDB connection
│   │   ├── models/BingoCard.ts            — Mongoose schema + validations
│   │   ├── controllers/cardController.ts  — Business logic for CRUD
│   │   ├── routes/cards.ts                — Express route handlers
│   │   └── middleware/errorHandler.ts     — Global error handling
│   ├── test/
│   │   └── cards.integration.test.ts      — API endpoint tests
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── API_SPEC.md                        — Complete endpoint documentation
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                     — Root layout
│   │   ├── page.tsx                       — Card list page
│   │   └── card/[id]/page.tsx             — Card editor page
│   ├── components/
│   │   ├── CardList.tsx                   — Display all cards
│   │   ├── CardEditor.tsx                 — Edit cells + checkbox
│   │   └── CreateCardForm.tsx             — Create new card
│   ├── lib/
│   │   └── api.ts                         — API fetch wrapper
│   ├── __tests__/
│   │   └── components.test.tsx            — Component tests
│   ├── .env.local.example
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature.md
│   │   └── bug.md
│   └── workflows/
│       └── ci.yml                         — Automated tests on push
├── DEVELOPMENT.md                         — Setup & architecture guide
├── README.md                              — Project overview
└── .gitignore
```

---

## Verification Checklist

### Phase 1 Success Criteria:

- [ ] GitHub repo created with README, templates, and project board
- [ ] Backend server runs locally, connects to MongoDB Atlas
- [ ] All 5 CRUD endpoints work via curl/Postman
- [ ] Frontend app loads, displays empty CardList
- [ ] Can create new card with custom size & title
- [ ] Card editor displays all cells as checkboxes + text
- [ ] Toggling checkboxes saves to database (verified via page refresh)
- [ ] Win message ("🎉 Bingo!") appears when all cells checked
- [ ] Deleting card removes from database and UI
- [ ] Backend tests pass (5+ test cases)
- [ ] Frontend tests pass (3+ component tests)
- [ ] Deployed: `vercel.app` URL loads frontend, backend responds from Railway

### Phase 2 Success Criteria (if attempted):

- [ ] Download button exports card as JSON file
- [ ] PDF export button works (file downloads)
- [ ] App works on mobile (grid responsive, buttons accessible)
- [ ] LocalStorage caches card state between refreshes

---

## GitHub Issues Template (Create 8-10 issues in order)

These issues should be created in the repository and added to the v1-MVP milestone:

1. **[Setup] Initialize repository and documentation** — README, DEVELOPMENT.md, issue templates
2. **[Backend] Set up Express server with MongoDB** — DB connection, basic server
3. **[Backend] Implement BingoCard schema and CRUD controllers** — Mongoose model + business logic
4. **[Backend] Create REST API endpoints for cards** — Routes and integration tests
5. **[Frontend] Initialize Next.js and API client** — Project setup, fetch wrapper
6. **[Frontend] Build CardList component** — Display all cards, delete functionality
7. **[Frontend] Build CardEditor component** — Display grid, mark cells, save changes
8. **[Frontend] Build CreateCardForm component** — Create new cards with custom size
9. **[Frontend] Implement win detection and UI feedback** — Bingo message
10. **[Testing] Add backend integration tests** — CRUD endpoint coverage
11. **[Testing] Add frontend component tests** — CardList, CardEditor, CreateCardForm
12. **[Deployment] Deploy backend to Railway and frontend to Vercel** — Production URLs

Each issue should include:

- Acceptance criteria (checkboxes)
- Links to relevant files
- Code examples or patterns to follow
- Learning notes explaining patterns used

---

## Key Code Patterns & Explanations

### Backend: Express + TypeScript

- **Controllers pattern**: Separate business logic from routes for testability
- **Middleware**: CORS enables frontend on different domain, error handler catches exceptions
- **Validation**: Check inputs before database queries to fail fast
- **Example learning note**: "Mongoose schemas provide runtime validation — this prevents invalid data in the database"

### Frontend: Next.js + React

- **Component composition**: Break UI into reusable parts (CardList, CardEditor, Form)
- **API client layer**: Centralize fetch calls so changes to API don't scatter across components
- **State management**: Use React hooks (`useState`, `useEffect`) for local state and data fetching
- **Example learning note**: "useEffect with empty dependency array runs once on mount — perfect for loading initial card list"

### Database: MongoDB + Mongoose

- **Document structure**: Each car is a document with cells array for flexible grid sizes
- **Indexing**: Index `_id` and `createdAt` for faster queries (noted in schema)
- **Validation**: Schema-level validation prevents invalid grid sizes
- **Example learning note**: "MongoDB stores data as JSON documents, so our `cells` array can grow dynamically without table migrations"

---

## Development Timeline & Milestones

| Phase        | Duration   | Milestone         | Key Deliverable                          |
| ------------ | ---------- | ----------------- | ---------------------------------------- |
| **Phase 0**  | 2-3 hrs    | Project Setup     | GitHub repo, issues, documentation       |
| **Phase 1A** | 3-4 hrs    | Backend MVP       | Express server, MongoDB, CRUD endpoints  |
| **Phase 1B** | 3-4 hrs    | Frontend MVP      | Next.js app, components, UI integration  |
| **Phase 1C** | 1-2 hrs    | Testing & Deploy  | Tests pass, deployed to Vercel + Railway |
| **Phase 2**  | 4-6 hrs    | Polish & Features | Optional enhancements (download, mobile) |
| **Total**    | ~14-20 hrs | v1.0 Release      | Fully functional Bingo app with tests    |

**Suggested pace**: 3-4 days at 10 hrs/week = ~4-6 hours per session

---

## Decisions & Scope

### Included in v1:

- ✓ Create cards with custom size (3x3 to 5x5)
- ✓ Edit card title and cell text
- ✓ Mark cells as checked/unchecked
- ✓ Win detection (all cells checked)
- ✓ CRUD operations (create, read, update, delete)
- ✓ Database persistence
- ✓ Full-stack testing

### Deferred to v2:

- ⚠️ Download/Export as file (in Phase 2)
- ⚠️ Print functionality (CSS media queries, future)
- ⚠️ Share/generate unique URLs (requires additional auth layer)
- ⚠️ User authentication / multi-user support

### Why these trade-offs:

- MVPs focus on core functionality first
- Download/print are enhancement UX features
- User authentication adds complexity (auth library, session handling) — save for after core works
- Sharing requires shortened URL service or auth — defer to v2

---

## Further Considerations

1. **Database Backups & Cleanup**
   - MongoDB Atlas free tier has limitations (512MB storage)
   - Recommendation: Plan to archive old cards after ~1 month or implement cleanup strategy in v2
   - For now: Manual export + deletion if quota approaches

2. **API Rate Limiting**
   - Consider adding rate limiting middleware if app gets heavy use
   - For v1 (learning project): Not necessary, but document as "Future: Add express-rate-limit"

3. **Environment Variables Security**
   - .env files with secrets (MONGODB_URI) must never be committed to git
   - Recommendation: Ensure .gitignore excludes .env, add .env.example with dummy values
   - Vercel & Railway dashboards will store actual values securely

---

## Next Steps (Ready for Implementation)

1. **Wait for approval** — Review plan above, suggest any changes
2. **Create issues in GitHub** — Use template list provided
3. **Start Phase 0** — Create repo and set up documentation
4. **Proceed with Phase 1A & 1B in parallel** — Backend and frontend development
5. **Integrate & test** — Phase 1C validates everything works together
6. **Deploy** — Push to Vercel + Railway
7. **Iterate** — Gather feedback, add Phase 2 features
