# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a699a879-9bdb-4d05-8b39-59b56f30ae5c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utilities (API client, auth)
├── pages/             # Page components
├── stores/            # Zustand stores
├── types/             # TypeScript type definitions
└── App.tsx           # Main app component
```

## ✨ Project Overview

SpendSwift is a comprehensive Purchase Request (PR) Management System designed to streamline the procurement process. It features a multi-role approval workflow, a state machine for managing PR states, and a modern, user-friendly interface.

### Key Features

- **Multi-Role Approval Workflow**: A flexible approval process involving multiple user roles.
- **PR State Machine**: A robust state machine to manage the lifecycle of a purchase request.
- **File Uploads**: Attach quotes and other relevant documents to PRs.
- **Notifications**: Keep users informed about the status of their PRs.
- **Role-Based Access Control (RBAC)**: Secure access to features based on user roles.

### User Roles

- **USER**: Can create and submit PRs.
- **DIRECT_MANAGER**: Approves PRs from their direct reports.
- **ACCOUNTANT**: Verifies the financial details of PRs.
- **FINAL_MANAGER**: Gives the final approval for PRs.
- **ADMIN**: Manages users and system settings.

### PR State Machine

The lifecycle of a purchase request follows this path:

`DRAFT` → `SUBMITTED` → `DM_APPROVED` → `ACCT_APPROVED` → `FINAL_APPROVED` → `FUNDS_TRANSFERRED`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PHP 8.2+ (for backend)
- Composer (for PHP dependencies)

### Installation

1. **Clone and install dependencies:**
   ```bash
   # Unix/Mac/WSL
   cd spend-swift-main
   npm install
   
   # Windows PowerShell
   cd spend-swift-main
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Unix/Mac/WSL
   cp .env.example .env
   
   # Windows PowerShell
   Copy-Item .env.example .env
   ```
   
   Update `.env` with your API endpoint:
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_DEMO_MODE=false
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   # Unix/Mac/WSL
   cd backend
   
   # Windows PowerShell
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Set up environment variables:**
   ```bash
   # Unix/Mac/WSL
   cp .env.example .env
   
   # Windows PowerShell
   Copy-Item .env.example .env
   ```

4. **Generate an application key:**
   ```bash
   php artisan key:generate
   ```

5. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

6. **Start the backend server:**
   ```bash
   php artisan serve
   ```
   ```
- shadcn-ui
- Tailwind CSS
