# Staff Khata: API Documentation

Welcome to the Staff Khata API. This backend provides a multi-tenant, role-based system for gym management.

## 🚀 Getting Started

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT (Bearer Token)
- **Multi-Tenancy**: All tenant-specific requests **MUST** include the `X-Gym-ID` header.

### Headers
| Header | Value | Description |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <token>` | Obtained after login. |
| `X-Gym-ID` | `<gym_id>` | The ID of the gym being accessed. |
| `Accept` | `application/json` | Required for all requests. |

---

## 🔐 1. Authentication

### Register
`POST /auth/register`
- **Body**:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Administrator",
    "gym_id": "gym_123"
}
```

### Login
`POST /auth/login`
- **Body**:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
- **Response**: Returns `access_token` and `user` object.

### Profile
`GET /auth/profile`
- **Auth**: Required

---

## 📊 2. Dashboard

### Admin Stats
`GET /dashboard/admin/stats`
- **Auth**: Administrator / SuperAdmin
- **Header**: `X-Gym-ID` required.

### Revenue Chart
`GET /dashboard/revenue-chart`
- **Auth**: Administrator / SuperAdmin

---

## 👥 3. Management

### Members (List/Create)
`GET /members` | `POST /members`
- **Auth**: Administrator
- **Header**: `X-Gym-ID` required.

### Trainers (List/Create)
`GET /trainers` | `POST /trainers`
- **Auth**: Administrator

---

## 🗓️ 4. Scheduling

### Class List
`GET /classes`
- **Auth**: All Roles

### Book Class
`POST /classes/{id}/book`
- **Auth**: Customer

---

## 🏋️ 5. Workout & Nutrition

### Search Ingredients
`GET /ingredients?search=apple`
- **Auth**: All Roles

### Progress Log
`POST /progress`
- **Body**:
```json
{
    "user_id": "user_id",
    "weight": 75.5,
    "date": "2024-04-25"
}
```

---

## ⚙️ 6. Inventory

### Equipment List
`GET /machines`
- **Auth**: Administrator

---

## 💳 7. Payments

### Payment History
`GET /payments/history`
- **Auth**: Administrator / Customer
