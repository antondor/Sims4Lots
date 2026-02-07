SimsLots Hub

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-Inertia-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Typescript-Blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

> **A modern, high-performance platform for The Sims 4 community to share and discover residential and community builds.**

SimsLots Hub is a Full-Stack Single Page Application (SPA) built with the monolith-first approach using **Laravel** and **Inertia.js**. It features a robust filtering system, optimized media delivery, and a complete moderation workflow.

---

Key Features

For Users
* **Smart Search & Filtering:** Filter lots by size (e.g., 64x64), type (Residential/Community), furnishing status, and CC (Custom Content).
* **Responsive UI:** Fully responsive design built with **Shadcn UI** and Tailwind CSS.
* **User Profiles:** Custom avatars, biography, and portfolio links.
* **Favorites System:** Save lots for later.
* **Secure Account Management:** Email verification flow with "change requests" (old email stays active until the new one is verified).

For Admins
* **Moderation Queue:** Review pending submissions before they go live.
* **Approval/Rejection Workflow:** Approve lots or reject them with a custom reason sent via email notifications.
* **Dashboard:** Quick overview of platform statistics.

Technical Highlights
* **Image Optimization:** Automatic generation of **WebP thumbnails** and resizing using *Intervention Image* to ensure 90+ Google Lighthouse performance scores.
* **Cloud Storage:** Integration with **Cloudflare R2 (S3)** for scalable media storage.
* **Lazy Loading:** Implemented native lazy loading with fetch priority management for LCP optimization.
* **Type Safety:** Fully typed frontend with **TypeScript**.

---

Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Laravel 11, PHP 8.2+, MySQL |
| **Frontend** | React 18, Inertia.js, TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI, Lucide Icons |
| **Storage** | Cloudflare R2 (AWS S3 Compatible) |
| **Tools** | Vite, Docker (Sail), Supervisor |

## ⚙️ Installation (Local Development)

1. **Clone the repository**
   ```bash
   git clone [https://github.com/antondor/Sims4Lots.git](https://github.com/antondor/Sims4Lots.git)
   cd Sims4Lots

2. **Install dependencies**
    ```bash
    composer install
    npm install
    
3. **Environment Setup**
    ```bash
    cp .env.example .env
    php artisan key:generate

4. **Run Migrations**
    ```bash
    php artisan migrate

5. **Start Development Server**
    ```bash
    npm run dev
    php artisan serve
