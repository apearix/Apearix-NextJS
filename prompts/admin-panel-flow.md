# Apearix Admin Panel - Comprehensive Integration Plan

## 1. Project Overview & Requirements
The goal is to deeply integrate all 12 NestJS backend API CRUDs into the Next.js (App Router) admin panel. The integration must perfectly map all endpoints, ensure robust CRUD workflows (Add, Edit, List, Delete), and follow the exact design language (UI/UX) present in the `dashboard/page.tsx` and admin components, maintaining 100% responsiveness and maximum security.

## 2. Architecture & Theming Analysis
- **API Fetching:** 
  - Server Components will use `src/lib/serverApi.ts` for initial data fetching to ensure fast loads and secure, token-based SSR. 
  - Client Components (mutations like Create, Update, Delete) will use `src/lib/clientApi.ts`.
- **Layout & Structure:** New admin pages go inside `src/app/(roles)/admin/[module]/page.tsx`. `Navbar.tsx` and `Footer.tsx` provide the layout shell.
- **Styling:** We rely purely on Tailwind CSS classes (`bg-surface-alt`, `bg-background`, `border-border-subtle`, `text-heading`, `text-muted`, `bg-primary`, `hover:bg-primary-hover`). Avoid adding custom CSS in `globals.css` unless for root variables.
- **Icons:** We use `lucide-react` for all iconography.

## 3. NestJS API Modules to Integrate
Based on the backend structure (`E:\DKProjects\Apearix-NestJS\src\`), the following resources need full CRUD integration:
1. `dashboard` (Stats/Overview)
2. `users`
3. `roles`
4. `blogs`
5. `categories`
6. `category-types`
7. `faqs`
8. `pages`
9. `products`
10. `services`
11. `settings`

## 4. Phase 1: Reusable Component Architecture (The "Admin UI Kit")
Before building the individual pages, we must establish consistent, reusable UI components in `src/components/admin/`:
- `DataTable.tsx`: A generic, responsive table component supporting actions.
- `ActionModal.tsx`: A reusable slide-over/popup modal for Create/Edit forms.
- `ConfirmDeleteModal.tsx`: A standard warning modal for deleting records.
- `PageHeader.tsx`: Needs to be utilized uniformly across all module pages.

## 5. Phase 2: System Setup & Dashboard
1. **Dashboard:** Refactor `dashboard/page.tsx` to fetch dynamic stats via `serverApi('/admin/dashboard')`.
2. **Settings:** Create a dynamic form in `settings` that fetches current configs and updates them via API.

## 6. Phase 3: Taxonomy & CMS Setup
1. **Category Types & Categories:** Implement list views, Create/Edit Modals, and Delete actions using `serverApi` (read) and `clientApi` (write).
2. **Blogs & Pages:** Implement fully featured forms handling content strings, status toggles, and metadata.
3. **FAQs:** Question/Answer standard CRUD.

## 7. Phase 4: Business Data Integration
1. **Services & Products:** Standardize the tables and forms to accommodate pricing, features, and descriptions.
2. **Users & Roles:** Build robust access control tables and assign-role functionality.

## 8. Phase 5: Final Review & Quality Assurance
1. **End-to-End Testing:** Verify Create, Read, Update, and Delete actions on every module.
2. **Responsiveness Audit:** Ensure UI holds up at 375px (mobile) and 768px (tablet).
3. **Build Check:** Run `npm run build` to catch TS/Next errors.

## Execution Rules
- **Modify over recreate:** Always modify existing folders (`src/app/(roles)/admin/blogs` etc.) instead of recreating them.
- **Security:** Ensure `requireAuth` is used with `serverApi` and `clientApi` so unauthorized access is blocked.
- **Error Handling:** Use safe JSON parsing and standard Error throws, caught gracefully in the UI.
