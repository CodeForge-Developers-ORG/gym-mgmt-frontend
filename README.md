# Staff Khata - Gym Management Platform

<p align="center">
  <img src="public/logo/logo.png" alt="Staff Khata Logo" width="250">
</p>

Staff Khata is a premium, high-performance SaaS platform designed for modern fitness businesses. It provides a comprehensive suite of tools to manage gym operations, member engagement, staff schedules, and financial tracking with a seamless, motion-driven user experience.

## 🚀 Live Application
**Application URL:** [https://gym.staffkhata.com/](https://gym.staffkhata.com/)

---

## 🔑 Authentication Access
The platform features separate entry points for different user roles to ensure security and streamlined workflows:

*   **Member & Staff Login:** [https://gym.staffkhata.com/](https://gym.staffkhata.com/)
    *   *The root URL serves as the primary gateway for gym members, trainers, and local administrators.*
*   **Super Admin Portal:** [https://gym.staffkhata.com/super-admin-login](https://gym.staffkhata.com/super-admin-login)
    *   *Dedicated secure portal for platform-wide management and multi-tenant control.*

---

## 🏗️ Project Architecture & Flow

### 1. The Ecosystem
Staff Khata is built on a distributed architecture consisting of:
*   **Next.js Frontend (This Repository):** A modern, React 19 / Next.js 16 application utilizing Tailwind CSS 4 for state-of-the-art styling.
*   **Laravel API Backend:** A robust, multi-tenant PHP backend managing all business logic, data persistence, and security.

### 2. User Flow
1.  **Onboarding:** Users register via the [Registration Page](https://gym.staffkhata.com/register).
2.  **Authentication:** Users authenticate through the specialized login portals. The frontend handles JWT token management and persists session data in `localStorage`.
3.  **Tenant Identification:** Every request to the backend includes a mandatory `X-Gym-ID` header, ensuring strict data isolation between different gym franchises.
4.  **Role-Based Routing:** Upon login, users are automatically redirected to their respective dashboards (e.g., `/customer`, `/staff`, `/admin`) based on their account permissions.

---

## 🛠️ Technology Stack
*   **Core Framework:** [Next.js 16.2.4](https://nextjs.org/) (App Router)
*   **Logic:** [React 19](https://react.dev/) / TypeScript
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
*   **Animations:** Standard CSS Keyframes & Framer Motion (Micro-animations)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **API Client:** Custom Fetch wrapper with automated header injection and error handling.

---

## 🛠️ Getting Started Locally

### Prerequisites
*   Node.js 20+
*   NPM / Yarn

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env.local`:
    ```env
    NEXT_PUBLIC_API_URL=https://api.gym.staffkhata.com/api
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

### Production Build
```bash
npm run build
npm start
```

---

© 2026 Staff Khata Gym Management. All rights reserved.
