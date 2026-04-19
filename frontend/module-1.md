 # Module 1 Foundation and Inventory Management

  ## Summary

  Build Module 1 as the first real vertical slice: a routed React frontend for item inventory
  management backed by the existing GET/POST/PUT/DELETE /api/items API. The frontend
  foundation will use react-router-dom for route structure, Ant Design for application shell
  and forms, and Tailwind CSS for layout, spacing, and visual polish. The first shipped route
  will be /items, with a modern inventory dashboard UI using a table plus add/edit drawer
  flow and reusable feature components.

  ## Implementation Changes

  - Replace the Vite starter UI with an app shell rooted in main.tsx using:
      - RouterProvider with createBrowserRouter from react-router-dom
      - Ant Design ConfigProvider for app-wide theme tokens
      - global Tailwind-driven CSS variables for a modern light theme
  - Define the initial route tree as:
      - / redirects to /items
      - /items renders Module 1
      - a basic not-found route for unknown paths
  - Create a reusable app layout with:
      - fixed sidebar or compact top navigation for future modules
      - consistent page header component
      - shared content container and section card components
  - Add a frontend app structure that is modular by feature, not by file type. Use a shape
    like:
      - app/ for router, providers, layout
      - features/items/ for Module 1 UI, types, hooks, API adapter
      - shared/ for reusable UI wrappers, formatting helpers, empty/loading/error states
  - Module 1 page behavior:
      - inventory header with title, short module description, and primary Add Item action
      - searchable/filterable items table using Ant Design Table
      - columns: item name, description, variants summary, base price, last updated, actions
      - actions: edit and delete per row, with delete confirmation
      - empty state for first-use inventory
  - Item create/edit UX:
      - use an Ant Design Drawer for both create and edit flows
      - use one reusable item form component for both modes
      - fields: name, description, basePrice, variants
      - variants use dynamic name/value rows via Form.List, matching the existing backend
        schema
      - validation:
          - item name required
          - base price required and numeric, minimum 0
          - each variant row requires both name and value
          - ignore blank variant rows before submit
  - Data flow and API integration:
      - add a typed API client for /api/items
      - centralize API base URL with VITE_API_BASE_URL, defaulting to
        http://localhost:5000/api
      - on page load fetch items and render loading/error states
      - on create/update/delete, refresh local list optimistically where simple, otherwise
        refetch after success
      - show success and failure feedback with Ant Design message
  - UI direction:
      - keep Ant Design components as the interaction base
      - use Tailwind for spacing, responsive grid/layout, background treatment, and custom
        visual hierarchy
      - use a crisp light dashboard aesthetic with subtle gradients, soft borders, strong
        headings, and consistent radius/shadow tokens
      - keep components mobile-safe even if the primary CRUD experience is desktop-first

  ## Public APIs / Interfaces / Types

  - Frontend route contract:
      - /items becomes the first application route
      - / redirects to /items
  - Frontend item types should mirror the backend:
      - ItemVariant = { name: string; value: string }
      - Item = { _id: string; name: string; description?: string; variants: ItemVariant[];
        basePrice: number; createdAt: string; updatedAt: string }
      - ItemFormValues = { name: string; description?: string; basePrice: number; variants:
        ItemVariant[] }
  - Environment contract:
      - VITE_API_BASE_URL for frontend API targeting
  - No backend schema or endpoint changes are required for Module 1 unless existing API
    behavior proves inconsistent during implementation.

  ## Test Plan

  - Routing:
      - / redirects to /items
      - unknown route renders not-found UI
  - Inventory page states:
      - loading state while fetching items
      - empty state when API returns zero items
      - error state when API fails
      - populated table renders correct item data and variant summary
  - Form behavior:
      - create drawer opens and validates required fields
      - invalid variant rows block submit
  - CRUD flows:
      - creating an item updates the list and closes the drawer

  ## Assumptions and Defaults

  - Module 1 includes real backend integration now, not mock data.
  - The current backend item API and Mongo schema remain the source of truth.
  - Variants are implemented as dynamic name/value pairs, matching the backend and your
    selected preference.
  - The initial CRUD flow uses a table plus drawer pattern, matching your selected
    preference.
  - react-router-dom is used for the app base even though newer React Router docs note
    package-level re-exports; this keeps the current dependency choice aligned with your
    request.
  - The first pass focuses on frontend foundation plus Module 1 only; invoice creation, PDF,
    and history modules stay out of scope for this iteration.