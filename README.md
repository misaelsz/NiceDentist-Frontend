# NiceDentist Frontend

Modern React frontend for the NiceDentist dental clinic management system.

## 🚀 Technologies

- **React 18** - Main library
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **React Router v6** - Routing
- **Axios** - HTTP client
- **CSS Modules** - Styling

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── NotificationList.tsx
│   └── index.ts
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── index.ts
├── hooks/              # Custom hooks
│   ├── useLoading.ts
│   ├── useNotification.ts
│   └── index.ts
├── modules/            # Main modules/features
│   ├── auth/           # Authentication module
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── auth.css
│   ├── dashboard/      # Dashboard module
│   │   ├── Dashboard.tsx
│   │   ├── DashboardStats.tsx
│   │   └── dashboard.css
│   ├── customers/      # Customer management module
│   │   ├── CustomerList.tsx
│   │   ├── CustomerForm.tsx
│   │   ├── CustomerDetails.tsx
│   │   └── customers.css
│   ├── dentists/       # Dentist management module
│   │   ├── DentistList.tsx
│   │   ├── DentistForm.tsx
│   │   ├── DentistProfile.tsx
│   │   └── dentists.css
│   ├── appointments/   # Appointment management module
│   │   ├── AppointmentCalendar.tsx
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentList.tsx
│   │   ├── AvailableSlots.tsx
│   │   └── appointments.css
│   ├── schedule/       # Schedule management module
│   │   ├── DentistSchedule.tsx
│   │   ├── WeeklyView.tsx
│   │   ├── DayView.tsx
│   │   └── schedule.css
│   ├── reports/        # Reports and analytics module
│   │   ├── AppointmentReports.tsx
│   │   ├── CustomerReports.tsx
│   │   ├── FinancialReports.tsx
│   │   └── reports.css
│   ├── notifications/  # Notification management module
│   │   ├── NotificationCenter.tsx
│   │   ├── EmailSettings.tsx
│   │   └── notifications.css
│   ├── admin/          # Admin panel module
│   │   ├── UserManagement.tsx
│   │   ├── SystemSettings.tsx
│   │   ├── RolePermissions.tsx
│   │   └── admin.css
│   ├── profile/        # User profile module
│   │   ├── UserProfile.tsx
│   │   ├── ChangePassword.tsx
│   │   ├── ProfileSettings.tsx
│   │   └── profile.css
│   └── index.ts
├── services/           # Services and APIs
│   ├── api.ts
│   ├── authService.ts
│   ├── customerService.ts
│   ├── dentistService.ts
│   ├── appointmentService.ts
│   └── index.ts
├── styles/             # Global styles
│   └── global.css
├── types/              # TypeScript definitions
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🛠️ How to Run

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
VITE_AUTH_API_URL=http://localhost:5000
VITE_MANAGER_API_URL=http://localhost:5001
```

### Backend APIs
The frontend consumes two APIs:

1. **Auth API** (localhost:5000) - Authentication and authorization
2. **Manager API** (localhost:5001) - Management of customers, dentists and appointments

## 📋 System Modules

### 🔐 Authentication Module
- [x] Login form with JWT authentication
- [ ] User registration
- [ ] Password reset
- [ ] Email verification
- [ ] Two-factor authentication (2FA)

### 📊 Dashboard Module
- [x] Main dashboard with overview stats
- [ ] Today's appointments widget
- [ ] Quick actions panel
- [ ] Recent activities feed
- [ ] System notifications

### � Customer Management Module
- [ ] Customer list with search and filters
- [ ] Customer registration form
- [ ] Customer profile view/edit
- [ ] Customer appointment history
- [ ] Customer communication log
- [ ] Customer billing information

### 🦷 Dentist Management Module
- [ ] Dentist list and profiles
- [ ] Dentist registration/onboarding
- [ ] Specialization and credentials management
- [ ] Dentist schedule configuration
- [ ] Performance analytics
- [ ] Working hours management

### 📅 Appointment Management Module
- [ ] Interactive appointment calendar
- [ ] Appointment booking form
- [ ] Available time slots finder
- [ ] Appointment status management
- [ ] Appointment notifications
- [ ] Appointment history
- [ ] Recurring appointments
- [ ] Appointment conflicts resolution

### ⏰ Schedule Management Module
- [ ] Dentist schedule overview
- [ ] Weekly/monthly calendar views
- [ ] Time slot blocking
- [ ] Holiday and vacation management
- [ ] Schedule templates
- [ ] Emergency slots management

### � Reports and Analytics Module
- [ ] Appointment analytics
- [ ] Customer insights
- [ ] Revenue reports
- [ ] Dentist performance metrics
- [ ] Cancellation analytics
- [ ] Custom report builder
- [ ] Data export (PDF, Excel)

### 🔔 Notification Management Module
- [ ] Email notification settings
- [ ] Appointment reminders
- [ ] System alerts
- [ ] Notification templates
- [ ] Delivery status tracking

### ⚙️ Admin Panel Module
- [ ] User management (CRUD)
- [ ] Role and permission management
- [ ] System configuration
- [ ] Audit logs
- [ ] Database backup/restore
- [ ] System health monitoring

### 👤 User Profile Module
- [ ] Personal profile management
- [ ] Password change
- [ ] Notification preferences
- [ ] Theme settings
- [ ] Language selection
- [ ] Account security settings

### 🏥 Additional Planned Modules
- [ ] **Inventory Management** - Dental supplies and equipment
- [ ] **Financial Management** - Billing, payments, insurance
- [ ] **Patient Records** - Medical history, treatment plans
- [ ] **Treatment Planning** - Dental procedures and plans
- [ ] **Document Management** - File uploads, X-rays, documents
- [ ] **Integration Hub** - Third-party integrations
- [ ] **Mobile App** - React Native companion app

## � User Roles and Permissions

### 🔹 Customer/Patient
- View own appointments
- Book new appointments
- Cancel appointments
- Update personal profile
- View treatment history

### 🔸 Dentist
- View personal schedule
- Manage own appointments
- View patient information
- Update appointment status
- Access treatment plans

### 🔷 Manager
- Full CRUD operations on customers
- Full CRUD operations on dentists
- Manage all appointments
- Generate reports
- System configuration

### 🔶 Admin
- All manager permissions
- User management
- System administration
- Audit logs access
- Database management

## �🎨 Padrões e Convenções

## 🎨 Design System

### Color Palette
```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --background: #f8fafc;
  --surface: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
}
```

### Component Patterns
```typescript
// Functional component with TypeScript
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Implementation
};
```

### Custom Hooks
```typescript
// Loading state hook
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const withLoading = async <T>(promise: Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await promise;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isLoading, setLoading, withLoading };
};
```

### CSS Naming (BEM)
```css
.component-name {
  /* Base styles */
}

.component-name__element {
  /* Element styles */
}

.component-name--modifier {
  /* Modifier styles */
}
```

## 🔒 Authentication Flow

The system uses JWT tokens stored in localStorage:

1. Login → Receives JWT token
2. Token is automatically included in all requests
3. Automatic refresh when needed
4. Logout → Removes token and redirects

## 📱 Responsive Design

Mobile-first design with breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Build and Deploy

```bash
# Build for production
npm run build

# Preview build
npm run preview

# Analyze bundle
npm run analyze
```

## 🚀 Deployment Options

### Docker

#### Production Build
```bash
# Build Docker image
docker build -t nicedentist-frontend .

# Run container
docker run -p 3000:80 nicedentist-frontend

# Using npm scripts
npm run docker:build
npm run docker:run
```

#### Development with Docker
```bash
# Build development image
docker build -f Dockerfile.dev -t nicedentist-frontend-dev .

# Run development container with hot reload
docker run -p 3001:3000 -v "$(pwd):/app" -v /app/node_modules nicedentist-frontend-dev

# Using npm scripts
npm run docker:build-dev
npm run docker:run-dev
```

#### Docker Compose
```bash
# Production
docker-compose up -d

# Development
docker-compose --profile dev up -d

# Stop services
docker-compose down

# Using npm scripts
npm run docker:up        # Production
npm run docker:up-dev    # Development
npm run docker:down      # Stop
```

### Static Hosting
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Development Roadmap

### Phase 1 (Current)
- [x] Authentication system
- [x] Dashboard foundation
- [ ] Customer management
- [ ] Basic appointment booking

### Phase 2
- [ ] Dentist management
- [ ] Advanced scheduling
- [ ] Notification system
- [ ] Reports foundation

### Phase 3
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Integrations
- [ ] Advanced features

## 📄 License

This project is licensed under the MIT License.

---

**NiceDentist Frontend** - Building the future of dental clinic management 🦷✨
