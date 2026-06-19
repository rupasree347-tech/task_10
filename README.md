# Task 10 – Advanced CRUD Application with Dashboard Analytics

**Altrodav Technologies · Full Stack Developer Assessment**

---

## 📁 Folder Structure

```
task10/
├── frontend/
│   └── register_page/          # React + Vite frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── Dashboard.jsx     # Q1 – Stat cards
│       │   │   ├── SearchBar.jsx     # Q6 – Search by name / ID
│       │   │   ├── Filters.jsx       # Q6 – Filter by status / category
│       │   │   ├── RecordTable.jsx   # Q3/Q4/Q5 – Read, Edit, Delete
│       │   │   ├── RecordForm.jsx    # Q2/Q4 – Add & Edit modal
│       │   │   ├── Analytics.jsx     # Q7 – Charts
│       │   │   └── Toast.jsx         # Notification helper
│       │   ├── App.jsx               # Router
│       │   ├── App.css               # Global styles (Q8 responsive)
│       │   ├── api.js                # Fetch wrappers for all endpoints
│       │   ├── DashboardPage.jsx     # Main page – wires all components
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   ├── middleware/
│   │   └── validate.js         # express-validator error handler
│   ├── routes/
│   │   ├── records.js          # POST/GET/GET:id/PUT/DELETE /records
│   │   ├── dashboard.js        # GET /dashboard/analytics
│   │   └── categories.js       # GET /categories
│   ├── server.js               # Express entry point
│   ├── .env.example
│   └── package.json
│
├── database/
│   └── schema.sql              # All tables, seed data, views
│
└── README.md
```

---

## ⚙️ Project Setup Steps

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14 (or MySQL 8 with minor driver swap)
- npm

---

### 1 · Database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE task10_db;"

# Run the schema (creates tables + seeds data)
psql -U postgres -d task10_db -f database/schema.sql
```

---

### 2 · Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env: set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

# Start (production)
npm start

# Start (development with auto-reload)
npm run dev
```

The API will be available at **http://localhost:5000**

---

### 3 · Frontend

```bash
cd frontend/register_page

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will open at **http://localhost:3000**

> The `vite.config.js` proxies `/records`, `/dashboard`, and `/categories`
> to `http://localhost:5000`, so no CORS issues during development.

---

## 🌐 API Documentation

Base URL: `http://localhost:5000`

| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/records`                | List all records (supports filters)  |
| GET    | `/records?search=Alice`   | Search by name                       |
| GET    | `/records?searchId=3`     | Search by ID                         |
| GET    | `/records?status=Active`  | Filter by status                     |
| GET    | `/records?category_id=1`  | Filter by category                   |
| GET    | `/records/:id`            | Get single record                    |
| POST   | `/records`                | Create new record                    |
| PUT    | `/records/:id`            | Update existing record               |
| DELETE | `/records/:id`            | Delete record                        |
| GET    | `/dashboard/analytics`    | Summary + charts data                |
| GET    | `/categories`             | List all categories                  |

### POST /records – Request body

```json
{
  "name":        "Alice Johnson",
  "email":       "alice@example.com",
  "category_id": 1,
  "status":      "Active",
  "notes":       "Optional notes"
}
```

### GET /dashboard/analytics – Response shape

```json
{
  "success": true,
  "data": {
    "summary":              { "total_records": 10, "active_records": 5, "completed_records": 3, "pending_records": 2 },
    "categoryDistribution": [{ "category": "Student", "count": 6 }, ...],
    "statusDistribution":   [{ "status": "Active", "count": 5 }, ...],
    "monthlyTrend":         [{ "month": "Jun 2025", "count": 3 }, ...]
  }
}
```

---

## ✅ Features Implemented

| # | Requirement                               | Status |
|---|-------------------------------------------|--------|
| Q1 | Dashboard: Total / Active / Completed / Pending cards | ✅ |
| Q2 | Create – Add Record modal with validation | ✅ |
| Q3 | Read – Records table with all fields      | ✅ |
| Q4 | Update – Edit modal pre-filled with existing data | ✅ |
| Q5 | Delete – Confirmation prompt before deletion | ✅ |
| Q6 | Search by Name, Search by ID, Filter by Status, Filter by Category | ✅ |
| Q7 | Analytics: Category Distribution (Pie), Status Distribution (Bar), Monthly Trend (Line) | ✅ |
| Q8 | Responsive layout: Desktop / Tablet / Mobile | ✅ |

---

## 🗄️ Database Design

### Tables

**users** – Application users (email, hashed password, role)

**categories** – Record categories (Student, Teacher, Admin)

**records** – Core entity: name, email, category_id (FK), status, notes, timestamps

**analytics** – Optional pre-aggregated snapshot table

### Relationships

```
categories (1) ──< records (many)
```

### Views

- `vw_dashboard_summary` – Aggregate counts by status
- `vw_category_distribution` – Record count per category
- `vw_monthly_trend` – Monthly creation count

---

## 🔒 Security

- Input validation via `express-validator` on all POST/PUT endpoints
- Parameterised queries (no raw SQL string interpolation)
- CORS configured via `cors` middleware
- Error messages never expose internal stack traces to the client

---

## 🛠️ Tech Stack

| Layer    | Technology                            |
|----------|---------------------------------------|
| Frontend | React 19, React Router 7, Recharts 3, Vite 8 |
| Backend  | Node.js, Express 4, express-validator |
| Database | PostgreSQL 14+ (MySQL compatible)     |
| Styling  | Pure CSS3 with CSS custom properties  |
