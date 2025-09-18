# SpendSwift: Purchase Request Management System

![SpendSwift Logo](public/favicon.ico) 

A comprehensive solution for managing both purchase requests and project requests across organizations with a multi-role approval workflow.

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [User Roles and Permissions](#-user-roles-and-permissions)
- [Core Modules](#-core-modules)
- [Technical Features](#-technical-features)
- [Getting Started](#-getting-started)
- [API Integration](#-api-integration)
- [UI Components](#-ui-components)
- [Workflows](#-workflows)
- [Development Guidelines](#-development-guidelines)

## 📋 Overview

SpendSwift is an enterprise-grade Purchase Request (PR) and Project Request Management System designed to streamline procurement and project approval processes. It features a sophisticated multi-role approval workflow, state machines for managing request lifecycles, and a modern, responsive interface with multilingual support including RTL languages.

## ✨ Features

### Core Features

- **Dual Request Types**: 
  - Purchase Requests: For goods and services acquisition
  - Project Requests: For initiatives requiring multiple resources and extended timelines

- **Multi-Stage Approval Workflow**: Configurable approval chains based on request type, amount, and department

- **State Machines**: Robust state management for request lifecycles

- **Role-Based Access Control**: Granular permissions based on user roles

- **Multilingual Support**: Complete interface translation with English and Arabic languages

- **RTL Support**: Full Right-to-Left layout support for Arabic

- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

- **Dashboard Analytics**: Real-time insights into request statuses, approval metrics, and spending patterns

### Additional Features

- **File Attachments**: Upload quotes, specifications, and supporting documents
- **Notifications**: In-app alerts for request updates and required actions
- **Audit Trails**: Comprehensive logging of all system actions
- **Custom Reporting**: Generate reports with filterable parameters
- **Export Functionality**: Export data to Excel/CSV formats
- **Budget Integration**: Track spending against department budgets
- **User Directory Integration**: Connect with organizational user directories

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   ├── dashboard/      # Dashboard components
│   │   └── stats-grid.tsx
│   ├── layout/         # Layout components
│   │   ├── AppLayout.tsx
│   │   └── sidebar.tsx
│   ├── pr/             # Purchase Request components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
│   ├── use-language.ts  # Language and RTL support
│   ├── use-translation.ts # Translation functionality
│   └── use-toast.ts     # Toast notifications
├── lib/                # Utilities
│   ├── api.ts          # API client
│   ├── auth.ts         # Authentication utilities
│   ├── translations.ts # Translation system
│   └── utils.ts        # General utilities
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── PRCreate.tsx    # Create new requests
│   ├── PRDetails.tsx   # Request details view
│   ├── PRList.tsx      # Request listing
│   └── Approvals.tsx   # Approval management
├── stores/             # State management
│   ├── authStore.ts    # Authentication state
│   └── prStore.ts      # Request state management
├── types/              # TypeScript type definitions
│   └── index.ts        # Core type definitions
└── App.tsx             # Main app component
```

## 👥 User Roles and Permissions

### USER
- Create purchase and project requests
- View own requests
- Edit own pending requests
- Cancel own pending requests
- Receive notifications about request status

### DIRECT_MANAGER
- All USER permissions
- Approve/reject requests from team members
- View team requests and statistics
- Access department-level reports

### ACCOUNTANT
- Process approved requests
- Update financial information
- Mark requests as funded
- View financial reports and statistics
- Generate accounting exports

### FINAL_MANAGER
- Final approval authority
- View organizational-wide request data
- Access comprehensive analytics
- Approve high-value requests

### ADMIN
- Manage users and roles
- Configure system settings
- Define approval workflows
- Access audit logs
- Manage department and budget settings

## 📚 Core Modules

### Authentication System
- Secure login and session management
- Role-based route protection
- Token-based authentication with refresh capabilities
- Password reset functionality

**Key Files**: `Login.tsx`, `authStore.ts`, `auth.ts`, `ProtectedRoute.tsx`, `RoleGuard.tsx`

### Request Management
- Create, view, edit, and track both purchase and project requests
- Different form fields based on request type
- File attachment support
- Request history and audit trail

**Key Files**: `PRCreate.tsx`, `PRDetails.tsx`, `PRList.tsx`, `prStore.ts`

### Purchase Request Specific Features
- Item-based structure with quantities and costs
- Vendor information management
- Delivery timeline tracking
- Budget allocation tracking

### Project Request Specific Features
- Project timeline management
- Resource allocation planning
- Milestone tracking
- Risk assessment documentation
- Team member assignment

### Approval Workflow
- Multi-stage approval process
- Role-specific approval actions
- Comments and feedback system
- Approval history tracking

**Key Files**: `Approvals.tsx`, `ApprovalActions.tsx`

### Dashboard and Analytics
- Overview of request statistics
- Department performance metrics
- Approval time analytics
- Budget utilization charts
- Filterable by date range, department, and request type

**Key Files**: `Dashboard.tsx`, `stats-grid.tsx`

### User Management
- User creation and editing
- Role assignment
- Department management
- User activity logs

**Key Files**: `AdminUsers.tsx`

### Notification System
- In-app notification center
- Status update notifications
- Action required alerts
- Notification preferences

**Key Files**: `notification-dropdown.tsx`, `use-notifications.ts`

### Reporting System
- Custom report generation
- Export to multiple formats
- Scheduled reports
- Visual data presentation

**Key Files**: `Reports.tsx`

## 🛠 Technical Features

### Multilingual Support
- Runtime language switching
- Translation keys for all user-facing text
- Language persistence in user preferences
- Support for English and Arabic with expandability

**Key Files**: `translations.ts`, `use-translation.ts`, `use-language.ts`, `language-toggle.tsx`

### RTL Support
- Complete Right-to-Left layout adaptation
- Proper text alignment and flow direction
- Component mirroring for RTL languages
- Bidirectional UI elements

**Key Files**: `index.css` (RTL styles), `use-language.ts`

### State Management
- Custom store implementation
- Efficient state updates
- Persistent state where needed
- Type-safe state access

**Key Files**: `authStore.ts`, `prStore.ts`

### Form Handling
- Field validation
- Conditional form fields
- Multi-step forms
- File uploads

**Key Files**: Various form components

### API Integration
- RESTful API communication
- Request/response interceptors
- Error handling
- Response caching
- Authentication header management

**Key Files**: `api.ts`

### Performance Optimizations
- Component memoization
- Lazy loading
- Virtual scrolling for long lists
- Image optimization
- Bundle size optimization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PHP 8.2+ (for backend)
- Composer (for PHP dependencies)

### Frontend Installation

1. **Clone and install dependencies:**
   ```bash
   # Unix/Mac/WSL
   cd spend-swift
   npm install
   
   # Windows PowerShell
   cd spend-swift
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Unix/Mac/WSL
   cp .env.example .env
   
   # Windows PowerShell
   Copy-Item .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_DEMO_MODE=false
   VITE_DEFAULT_LANGUAGE=en
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
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

## 🔄 API Integration

### API Endpoints

#### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout
- `GET /api/auth/user`: Get current user details
- `POST /api/auth/refresh`: Refresh authentication token

#### Purchase Requests
- `GET /api/requests`: List all accessible requests
- `GET /api/requests/{id}`: Get request details
- `POST /api/requests`: Create new request
- `PUT /api/requests/{id}`: Update existing request
- `DELETE /api/requests/{id}`: Delete draft request
- `POST /api/requests/{id}/submit`: Submit request for approval
- `POST /api/requests/{id}/approve`: Approve request
- `POST /api/requests/{id}/reject`: Reject request
- `GET /api/requests/stats`: Get request statistics

#### Users and Departments
- `GET /api/users`: List users
- `GET /api/departments`: List departments
- `GET /api/roles`: List available roles

#### Settings
- `GET /api/settings`: Get system settings
- `PUT /api/settings`: Update system settings

### Authentication
The API uses token-based authentication. Include the token in the Authorization header:
```
Authorization: Bearer {token}
```

## 🧩 UI Components

SpendSwift includes a comprehensive set of UI components built on shadcn/ui and Tailwind CSS:

### Layout Components
- App layouts with sidebar navigation
- Content containers
- Card layouts
- Grid systems

### Form Components
- Text inputs and text areas
- Dropdowns and select menus
- Checkboxes and radio buttons
- Date and time pickers
- File uploaders
- Form validation

### Data Display Components
- Tables with sorting and filtering
- Data cards
- Status badges
- Progress indicators
- Charts and graphs

### Navigation Components
- Sidebar navigation
- Breadcrumbs
- Tabs
- Pagination

### Feedback Components
- Toast notifications
- Alert dialogs
- Progress spinners
- Error messages

### Action Components
- Buttons (primary, secondary, danger)
- Dropdown menus
- Action menus
- Toggle switches

## 🔄 Workflows

### Purchase Request Workflow
1. User creates a purchase request
2. User submits request for approval (changes state to SUBMITTED)
3. Direct manager reviews and approves/rejects
4. If approved, accountant reviews financial details
5. Final manager provides final approval for high-value requests
6. Accountant marks as funds transferred
7. Request is complete

### Project Request Workflow
1. User creates a project request with extended project details
2. User submits request for approval
3. Direct manager reviews and approves/rejects
4. If approved, request is forwarded to final manager
5. Final manager reviews project details and approves/rejects
6. If approved, accountant allocates budget
7. Project kickoff is scheduled

### State Machine
Purchase and project requests follow this state path:

`DRAFT` → `SUBMITTED` → `DM_APPROVED` → `ACCT_APPROVED` → `FINAL_APPROVED` → `FUNDS_TRANSFERRED`

Additional states include:
- `REJECTED`: Request was denied
- `CANCELLED`: Request was cancelled by the requester
- `ON_HOLD`: Request is temporarily paused
- `RETURNED`: Request returned for changes

## 💻 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Document complex functions with JSDoc comments

### State Management
- Use local component state for UI-specific state
- Use stores for shared application state
- Keep store updates atomic and focused

### Component Development
- Create reusable components for repeated UI patterns
- Use composition over inheritance
- Implement proper prop validation with TypeScript
- Consider accessibility in all component designs

### Performance Considerations
- Memoize expensive calculations with useMemo
- Prevent unnecessary re-renders with React.memo and useCallback
- Implement virtualization for long lists
- Optimize bundle size with code splitting

### Multilingual Development
- Use translation keys for all user-visible text
- Test layouts in both LTR and RTL modes
- Consider text expansion/contraction in different languages

---

## Technologies Used

- React 18+
- TypeScript
- Tailwind CSS
- Shadcn UI
- Vite
- Laravel (Backend)
- React Router
- Custom store implementation
- Recharts for data visualization

---

© 2025 SpendSwift. All Rights Reserved.
