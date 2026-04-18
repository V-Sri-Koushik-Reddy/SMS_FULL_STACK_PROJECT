# 🎓 SMS Fullstack (Student Management System)

A full-stack **Student Management System (SMS)** with authentication, protected routes, and a clean dashboard UI. Built using **Node.js, Express, and Vanilla JavaScript** with a focus on simplicity and real-world backend structure.

---

## 🚀 Features

### 🔐 Authentication

* JWT-based login system
* Protected API routes using middleware
* Token storage & handling on frontend
* Default admin login
* Register UI with success feedback

### 👨‍🎓 Student Management

* ➕ Add student
* 📋 View all students
* ✏️ Update student details
* ❌ Delete student
* 🔍 Search & filter functionality

### 🎨 Frontend Experience

* Glassmorphism login/register UI
* Dark-themed dashboard
* Single-page authentication flow (`auth.html`)
* Enter key support for faster interaction
* Clean, responsive layout

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* JSON Web Tokens (JWT)

### Frontend

* HTML
* CSS (Custom Dark Theme)
* Vanilla JavaScript

### Database

* ❗ In-memory storage (no external DB)

---

## 📁 Project Structure

```id="struct01"
sms-fullstack/
├── backend/                         (Node.js + Express)
│   ├── server.js                    # Entry point, middleware setup
│   ├── package.json                 # Dependencies
│   │
│   ├── utils/
│   │   └── jwtUtils.js              # signToken() / verifyToken()
│   │
│   ├── models/
│   │   ├── userModel.js             # Hardcoded admin user
│   │   └── studentModel.js          # In-memory CRUD helpers
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js        # protect() — Bearer JWT check
│   │   ├── validationMiddleware.js  # Input validation
│   │   └── errorMiddleware.js       # Global error handling
│   │
│   ├── controllers/
│   │   ├── authController.js        # Login logic
│   │   └── studentController.js     # CRUD + search/filter
│   │
│   └── routes/
│       ├── authRoutes.js            # POST /auth/login (public)
│       └── studentRoutes.js         # All routes protected
│
└── frontend/                        (HTML + CSS + Vanilla JS)
    ├── auth.html                    # Login + Register (SPA flow)
    ├── login.html                   # Optional standalone login UI
    ├── index.html                   # Protected dashboard
    ├── style.css                    # Dark theme styling
    ├── auth.js                      # Token helpers + authFetch()
    └── script.js                    # CRUD, search, filter, UI logic
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```id="cmd01"
git clone https://github.com/your-username/sms-fullstack.git
cd sms-fullstack
```

---

### 2️⃣ Install Backend Dependencies

```id="cmd02"
cd backend
npm install
```

---

### 3️⃣ Run the Server

```id="cmd03"
node server.js
```

Server runs at:

```id="cmd04"
http://localhost:5004
```

---

### 4️⃣ Open Frontend

Open in browser:

```id="cmd05"
frontend/auth.html
```

---

## 🔐 Authentication Flow

### 🆕 Register (Frontend)

* Available inside `auth.html`
* User enters name, email, password
* Shows success message:

  ```
  ✅ User registered successfully
  ```
* Automatically switches to login mode after 1.5 seconds

⚠️ **Note:**

* Registration is currently **frontend-based**
* Backend uses a **hardcoded admin user**
* Registered users are not persisted (demo behavior)

---

### 🔑 Login

* User logs in via `/auth/login`
* Backend validates credentials
* JWT token is returned
* Token stored in browser (localStorage)
* Used for all protected API calls

---

## 🔑 Default Admin Credentials

```id="cred01"
Email: admin@gmail.com
Password: admin123
```

---

## 📡 API Endpoints

### 🔐 Auth

```id="api01"
POST /auth/login
```

---

### 👨‍🎓 Students (Protected)

```id="api02"
GET    /students
POST   /students
PUT    /students/:id
DELETE /students/:id
```

---

## 🔒 Protected Route Example

```id="api03"
GET /students
Authorization: Bearer <token>
```

---

## 🧠 Key Concepts Used

* Express middleware architecture
* JWT authentication & authorization
* REST API design
* Modular backend structure
* In-memory data handling
* Frontend token management

---

## ⚠️ Limitations

* No database (data resets on restart)
* Only one hardcoded admin user
* Register is frontend-only (not persisted)
* No role-based access control

---

## 🚀 Future Improvements

* MongoDB integration (persistent storage)
* Backend register API
* Multiple user support
* Role-based access (Admin/User)
* Pagination & advanced filtering
* UI improvements (toast notifications)
* Deployment (Render / Vercel)

---

## 📌 Notes

* Backend must be running before using frontend
* Uses `fetch()` for API communication
* Token stored in browser localStorage

---

## 👨‍💻 Author

**Koushik Reddy**

---

## ⭐ Support

If you found this useful:

* ⭐ Star the repository
* 🍴 Fork and build on it
* 🚀 Use it in your projects

---
