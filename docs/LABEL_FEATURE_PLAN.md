---
name: Label feature implementation
overview: "Add a user-owned Label model and single-label association with Todo: each todo has at most one label; label picker next to due date in the create form, single label below due date in list items, and a /settings/labels page to list and add labels (drawer, same pattern as add-todo)."
todos:
  - id: step-1-schema-labels
    content: "Step 1: Add Label model and User.labels in Prisma; run prisma generate (labels only, no Todo yet)"
    status: pending
  - id: step-2-labels-api
    content: "Step 2: Implement GET and POST /api/labels (auth, user-scoped)"
    status: pending
  - id: step-3-indexeddb-labels
    content: "Step 3: Add labels store in IndexedDB (getLabels, putLabels, clearLabels); after create label fetch all and store"
    status: pending
  - id: step-4-add-label-button
    content: "Step 4: Add label button (drawer + form; POST → fetch all → putLabels)"
    status: pending
  - id: step-5-listing-labels
    content: "Step 5: Settings labels page — list labels from IndexedDB"
    status: pending
  - id: step-6-browse-link
    content: "Step 6: Add link to /settings/labels on the browse page (browse will be settings later; keep it simple for now)"
    status: pending
  - id: step-7-schema-todo
    content: "Step 7: Add Todo.labelId and Todo.label in Prisma; run prisma generate; add labelId to schemas/todo.ts"
    status: pending
  - id: step-8-todos-api-sync
    content: "Step 8: Add labelId to GET /api/todos, sync route, and bulkUpsertTodos"
    status: pending
  - id: step-9-client-data
    content: "Step 9: Add labelId to TodoItem, IndexedDB, and todo-sync types/serialization"
    status: pending
  - id: step-10-label-picker
    content: "Step 10: Add single-select label picker next to due date (labels from IndexedDB)"
    status: pending
  - id: step-11-todo-item-label
    content: "Step 11: Show label chip below due date (resolve name from IndexedDB)"
    status: pending
isProject: false
---

# Label feature implementation

## Scope

- **Labels**: User-owned; each label has at least a name (optional: color later).
- **Association**: Each todo has **at most one label** (stored as optional `labelId: string | null`).
- **UI**: In the Add-Todo drawer, a label button **next to** the existing due-date button; in the todo list, the label (if any) shown **below** the due date line; a **settings page** at `/settings/labels` to list and add labels (drawer for add, same pattern as add-todo).

## Data model

### Backend (Prisma + MongoDB)

- **New model `Label`** in [prisma/schema.prisma](prisma/schema.prisma):
  - `id` (ObjectId), `name` (String), optional `color` (String?), `userId` (ObjectId), timestamps.
  - Relation: `User` has many `Label`; `Label` belongs to `User`.
- **Todo**:
  - Add optional `labelId String? @db.ObjectId` and relation `label Label?` (or store only `labelId` and resolve via lookup). Many todos can share the same label; each todo has at most one.

### Client (IndexedDB)

- **Todos**: Extend `TodoItem` with `labelId?: string | null` in [lib/indexeddb.ts](lib/indexeddb.ts). Bump `DB_VERSION` when adding todo changes or the labels store; existing todo records get `labelId` undefined (treat as `null`).
- **Labels store**: Add a second object store in the same DB (e.g. `labels-store`) and a `LabelItem` type (id, name, color?, createdAt, updatedAt). Provide:
  - **Read**: `getLabels()` – return all labels from IndexedDB (used for settings list, picker, and resolving labelId → name in todo items).
  - **Write**: `putLabels(labels: LabelItem[])` – replace all labels in IndexedDB with the fetched list (call after syncing from API).
  - **Clear**: `clearLabels()` – remove all labels (e.g. on sign-out, like `clearTodos()`).
- **Flow**: User creates label → `POST /api/labels` → on success → `GET /api/labels` → store result in IndexedDB via `putLabels()`. All UI that displays labels (settings page, todo form picker, todo item) **read from IndexedDB**. Optionally: when opening the labels settings page or the add-todo drawer, trigger a background fetch of `GET /api/labels` and write to IndexedDB so local cache stays fresh when online.

### Sync and API payloads

- **GET /api/todos**: Include `labelId: string | null` in each todo in the response.
- **POST /api/todos/sync**: Accept and persist `labelId` in upsert payload (see [lib/mongo-todo-bulk.ts](lib/mongo-todo-bulk.ts) and Prisma `Todo` updates).
- **New endpoints for labels**:
  - `GET /api/labels` – list labels for the current user.
  - `POST /api/labels` – create a label (body: `{ name: string, color?: string }`).
  - Optional later: `PATCH /api/labels/[id]`, `DELETE /api/labels/[id]`.

Client sync types and serialization in [lib/todo-sync.ts](lib/todo-sync.ts) (e.g. `ServerTodo`, `parseTodo`, `setPending` payload) must include `labelId` so that local todos and pending sync payloads carry the label.

## UI

### 1. Label picker next to due date (create-todo form)

- **Location**: [app/(authed)/today/_forms/todo-form.tsx](app/(authed)/today/_forms/todo-form.tsx) – in the same `flex` row as `DueDatePicker` (around the existing `<div className="flex flex-wrap items-center gap-2">`), add a second control **next to** the due-date button.
- **Behavior**:
  - A button (e.g. "Label" with a tag icon) that opens a popover or dropdown listing the user's labels **from IndexedDB** (via `getLabels()`). User selects **one** label or "None" to clear.
  - Optional: simple "Create label" inline (input + submit) that calls `POST /api/labels` and then selects the new label (and syncs labels to IndexedDB).
- **Form state**: Add `labelId: string | null` to the form schema (and `TodoSchema` / form defaultValues). On submit, pass `labelId` into `addTodo` and into the sync payload.

### 2. Label below due date (todo list item)

- **Location**: [app/(authed)/_components/todo-item.tsx](app/(authed)/_components/todo-item.tsx). The due date is rendered in a `<span>` with calendar icon and `dueDateLabel` (lines 90–100). Add a **second row** below that span when `todo.labelId` is set, showing a single small chip/badge with the label name (and color if added later). Resolve `todo.labelId` to a name using the same label list (from API or parent-provided lookup).

Data flow: parent reads labels from IndexedDB (`getLabels()`) and passes either the resolved label name to `TodoItem` or a lookup so the item can resolve `labelId` → name. Prefer parent resolving once so `TodoItem` stays presentational.

### 3. Settings labels page (`/settings/labels`)

- **Route**: New page at `app/(authed)/settings/labels/page.tsx`. Ensure the `(authed)` layout wraps it (same as `/today`). Users reach it via a link on the browse page (Step 4); browse will become a settings hub later.
- **Page content**:
  - **List**: Display the user's labels **from IndexedDB** (`getLabels()`). Each row shows label name (and optional color). Optional later: edit/delete per row.
  - **Add button**: A primary button (e.g. "Add label") that opens a **drawer** (same pattern as [add-todo-button.tsx](app/(authed)/today/_components/add-todo-button.tsx): `Drawer` with `DrawerTrigger` + `DrawerContent`).
- **Add-label drawer**:
  - **Reference**: Same UX as Add Todo: bottom drawer, `DrawerTitle` / `DrawerDescription` (sr-only or visible), content area with a form.
  - **Form**: Input for label name (required); optional color. Submit → `POST /api/labels`. **On success**: fetch `GET /api/labels`, write result to IndexedDB via `putLabels()`, then close drawer, re-read labels from IndexedDB for the list, toast success. On error: toast error.
  - **State**: Use a ref for the form (e.g. reset after submit), and `useTransition` for pending. Reuse the same Drawer component from `@/components/ui/drawer`.
- **Files**: New page component; optionally `LabelForm` and `AddLabelButton`. List reads from IndexedDB (e.g. a hook that returns labels from `getLabels()` and optionally triggers a background fetch + `putLabels()` when the page mounts so the cache is fresh).

## Files to touch (summary)

| Layer       | File                                                                            | Change                                                                                                             |
| ----------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Schema      | `prisma/schema.prisma`                                                          | Add `Label` model; add `User.labels`; add `Todo.labelId` (optional) and `Todo.label` relation                      |
| Generated   | `models/` (via `prisma generate`)                                               | New Label model and updated Todo model                                                                             |
| Validation  | `schemas/todo.ts`                                                               | Add `labelId` to todo schema (optional string)                                                                     |
| Local DB    | `lib/indexeddb.ts`                                                              | `TodoItem.labelId`; new labels store + `LabelItem`, `getLabels()`, `putLabels()`, `clearLabels()`; bump DB_VERSION |
| Sync        | `lib/todo-sync.ts`                                                              | Include `labelId` in `ServerTodo`, `parseTodo`, and pending payload to `/api/todos/sync`                           |
| API         | `app/api/todos/route.ts`                                                        | Return `labelId` (and optionally label name) for each todo                                                       |
| API         | `app/api/todos/sync/route.ts` + `lib/mongo-todo-bulk.ts`                        | Accept and persist `labelId` in sync body and bulk upsert                                                          |
| API         | New `app/api/labels/route.ts` (and optional `[id]`)                             | GET (list), POST (create) for current user                                                                         |
| Form        | `app/(authed)/today/_forms/todo-form.tsx`                                       | Add `labelId` to form schema and defaultValues; add **single-select** label picker next to `DueDatePicker`         |
| Add todo    | `app/(authed)/today/_components/add-todo-button.tsx`                            | Pass `labelId` from form into `addTodo` and ensure sync payload includes it                                       |
| List item   | `app/(authed)/_components/todo-item.tsx`                                        | Below the due-date line, render **one** label chip when `todo.labelId` is set (resolve name via parent or API)    |
| Labels data | New component or hook                                                           | Fetch `GET /api/labels`; expose list for single-select picker and for resolving label id to name in list items    |
| Settings    | New `app/(authed)/settings/labels/page.tsx`                                     | Page that lists user labels and an "Add label" button                                                              |
| Settings    | New `app/(authed)/settings/labels/_components/add-label-button.tsx` (or inline) | Drawer + trigger; form inside calls `POST /api/labels` (reference add-todo-button)                                 |
| Settings    | New `app/(authed)/settings/labels/_forms/label-form.tsx`                        | Optional: form with name (required); submit handler passed from parent                                             |
| Browse      | `app/(authed)/browse/page.tsx`                                                  | Add link to `/settings/labels` on the browse page (browse will become a settings hub later; keep simple for now)   |

## Implementation steps

Develop **manage/create labels** first (Steps 1–6), then **integrate labels into todos** (Steps 7–11).

**Step 1 — Schema (labels only)**

- Add `Label` model in `prisma/schema.prisma` (id, name, color?, userId, timestamps; relation to User).
- Add `labels Label[]` on `User`.
- Run `pnpm prisma generate`. Do not add `Todo.labelId` yet.

**Step 2 — Labels API**

- Create `app/api/labels/route.ts`: `GET` returns current user's labels; `POST` accepts `{ name, color? }`, creates label for user, returns created label. Use `auth()` and enforce `session?.user?.id`.

**Step 3 — IndexedDB labels store and sync**

- In `lib/indexeddb.ts`: add a **labels store** (e.g. `labels-store`, keyPath `id`). Define `LabelItem` (id, name, color?, createdAt, updatedAt). Bump `DB_VERSION`; in `onupgradeneeded` create the new store (keep existing todos store). Add `getLabels(): Promise<LabelItem[]>`, `putLabels(labels: LabelItem[]): Promise<void>` (replace all labels in the store), and `clearLabels(): Promise<void>` (for sign-out). Call `clearLabels()` from the same place that calls `clearTodos()` on sign-out.
- **Flow**: When user creates a label: on `POST /api/labels` success → `GET /api/labels` → `putLabels(response)`. All UI that shows labels reads from IndexedDB via `getLabels()`. Optionally: when opening settings/labels page or add-todo drawer, run a background `GET /api/labels` and `putLabels()` to refresh the cache when online.

**Step 4 — Add label button**

- Create the **add-label** UI: a button (e.g. "Add label") that opens a bottom drawer (same pattern as [add-todo-button](app/(authed)/today/_components/add-todo-button.tsx)). Drawer content: form with label name (required). Submit → `POST /api/labels`; **on success** → fetch `GET /api/labels` → `putLabels(result)` → close drawer, toast. Use ref + `useTransition`. Optionally extract `AddLabelButton` in `_components/add-label-button.tsx` and `LabelForm` in `_forms/label-form.tsx`. The button can live on a minimal placeholder page at `app/(authed)/settings/labels/page.tsx` for now (page can be just the button and a heading).

**Step 5 — Listing labels**

- On the settings labels page: **list labels from IndexedDB** (`getLabels()`). Render the list (e.g. name per row) and integrate the Add label button from Step 4 so the page shows both the list and the button. After adding a label, re-read from IndexedDB so the list updates (state/hook that refreshes after `putLabels()`).

**Step 6 — Link to labels on browse page**

- On the [browse page](app/(authed)/browse/page.tsx), add a link to `/settings/labels` (e.g. "Labels" or "Manage labels") so users can reach the labels settings. The browse page will serve as a settings hub in the future; for now keep it simple (just the link).

**Step 7 — Schema (todo integration)**

- Add `labelId String? @db.ObjectId` and `label Label?` relation on `Todo` in `prisma/schema.prisma`. Add `todos Todo[]` on `Label` if desired.
- Run `pnpm prisma generate`.
- Add `labelId` to `schemas/todo.ts` (optional string).

**Step 8 — Todos API and sync (labelId)**

- In `app/api/todos/route.ts`: include `labelId` in each todo in the JSON response.
- In `app/api/todos/sync/route.ts`: allow `labelId` in each upsert item in the request body.
- In `lib/mongo-todo-bulk.ts`: add `labelId` to the type and to the `$set` in the bulk write.

**Step 9 — Client data (IndexedDB and sync)**

- In `lib/indexeddb.ts`: add `labelId?: string | null` to `TodoItem`; include it in `addTodo`, `updateTodo`, `putTodo`; bump `DB_VERSION` if needed (existing todos get labelId undefined → treat as null).
- In `lib/todo-sync.ts`: add `labelId` to `ServerTodo`, `parseTodo`/`serverTodoToItem`, and to the serialized payload in `setPending` and the body sent in `pushPendingChanges`.

**Step 10 — Label picker in todo form**

- Labels for the picker come **from IndexedDB** (`getLabels()`). Optionally trigger a background fetch + `putLabels()` when the add-todo drawer opens so the list is fresh.
- In `app/(authed)/today/_forms/todo-form.tsx`: add `labelId` to form schema and defaultValues; add a single-select label control (button + popover/dropdown) next to `DueDatePicker` in the same row; on submit pass `labelId` in the form value.
- In `add-todo-button.tsx`: pass `labelId` from form into `addTodo` and ensure the todo (and thus sync payload) includes it.

**Step 11 — Label in todo list item**

- Parent that renders the todo list reads labels from IndexedDB (`getLabels()`) and resolves `todo.labelId` → name (e.g. lookup map or pass `labelName` into the item).
- In `app/(authed)/_components/todo-item.tsx`: below the due-date row, when `todo.labelId` is set, render one small chip/badge with the resolved label name.

## Optional follow-ups

- Color for labels and use it in chips and in the add-label form.
- Edit/delete label on the settings page (PATCH/DELETE `/api/labels/[id]` + row actions); after change, fetch all labels and update IndexedDB.
