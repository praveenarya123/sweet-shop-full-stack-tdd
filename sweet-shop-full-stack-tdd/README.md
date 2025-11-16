# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory with user authentication, role-based access control, and comprehensive inventory management features.

## 🚀 Features

### Authentication & Authorization
- **User Registration & Login** - JWT-based authentication
- **Role-Based Access Control** - Admin and regular user roles
- **Protected Routes** - Secure API endpoints and frontend routes
- **Session Management** - Persistent login with local storage

### Sweet Inventory Management
- **Browse Sweets** - View all available sweets with images and details
- **Search & Filter** - Search by name and filter by category
- **Real-time Stock Updates** - Live inventory tracking
- **Purchase System** - Users can purchase sweets with quantity selection
- **Admin Controls** - Full CRUD operations for sweets management
- **Restock Functionality** - Admins can restock inventory

### User Interface
- **Modern Design** - Beautiful gradient backgrounds and card layouts
- **Responsive Layout** - Mobile-first design that works on all devices
- **Loading States** - Skeleton loaders and spinners for better UX
- **Toast Notifications** - User feedback for all actions
- **Disabled States** - Out-of-stock items clearly marked and disabled
- **Dark Mode Support** - Built-in dark mode compatibility

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - High-quality React components
- **React Hook Form** - Form validation and management
- **Zod** - Schema validation
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Better-SQLite3** - Fast, embedded database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **TypeScript** - Type-safe API development

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-shop-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup** (Optional)
   Create a `.env.local` file in the root directory:
   ```env
   JWT_SECRET=your-secret-key-change-in-production
   ```
   Note: The app will work with default values if no `.env` file is provided.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Demo Accounts

The application comes pre-seeded with demo accounts:

**Admin Account:**
- Email: `admin@sweetshop.com`
- Password: `admin123`

**Regular User Account:**
- Email: `user@sweetshop.com`
- Password: `user123`

### User Workflows

#### As a Regular User:
1. Login or register a new account
2. Browse available sweets
3. Use search and category filters
4. Select quantity and purchase sweets
5. Out-of-stock items are automatically disabled

#### As an Admin:
1. Login with admin credentials
2. View all sweets with admin controls
3. Add new sweets with the "Add Sweet" button
4. Edit existing sweets
5. Delete sweets from inventory
6. Restock items by entering quantity

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: 201 Created
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "jwt-token",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Sweet Management Endpoints

#### Get All Sweets
```http
GET /api/sweets?search=chocolate&category=Chocolate

Response: 200 OK
{
  "sweets": [
    {
      "id": 1,
      "name": "Dark Chocolate Bar",
      "description": "Rich 70% dark chocolate",
      "price": 4.99,
      "stock_quantity": 25,
      "image_url": "https://...",
      "category": "Chocolate",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Sweet
```http
GET /api/sweets/{id}

Response: 200 OK
{
  "sweet": { ... }
}
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "description": "Delicious chocolate",
  "price": 4.99,
  "stock_quantity": 50,
  "image_url": "https://...",
  "category": "Chocolate"
}

Response: 201 Created
{
  "sweet": { ... }
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 5.99
}

Response: 200 OK
{
  "sweet": { ... }
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/{id}
Authorization: Bearer {admin-token}

Response: 200 OK
{
  "message": "Sweet deleted successfully"
}
```

#### Purchase Sweet
```http
POST /api/sweets/{id}/purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 2
}

Response: 200 OK
{
  "message": "Purchase successful",
  "sweet": { ... }
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/{id}/restock
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "quantity": 10
}

Response: 200 OK
{
  "message": "Restock successful",
  "sweet": { ... }
}
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user')) DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Sweets Table
```sql
CREATE TABLE sweets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 📁 Project Structure

```
sweet-shop-management/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── login/route.ts
│   │   │   │   └── me/route.ts
│   │   │   └── sweets/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           ├── route.ts
│   │   │           ├── purchase/route.ts
│   │   │           └── restock/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # Shadcn/UI components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── SweetCard.tsx
│   │   ├── SweetFormDialog.tsx
│   │   └── SweetsShop.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── db.ts            # Database setup and seeding
│   │   ├── auth.ts          # JWT utilities
│   │   ├── api-client.ts    # Frontend API client
│   │   └── utils.ts
│   └── hooks/
├── public/
├── sweetshop.db             # SQLite database (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with 10 salt rounds
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Admin-only endpoints protected
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Parameterized queries
- **Authorization Checks** - All protected routes verified

## 🎨 UI Components

The application uses Shadcn/UI components including:
- Card, Button, Input, Select
- Dialog, Alert, Badge
- Form components with validation
- Skeleton loaders
- Toast notifications (Sonner)

## 🚦 Error Handling

- **Frontend**: Toast notifications for user feedback
- **Backend**: Proper HTTP status codes and error messages
- **Validation**: Form validation with clear error messages
- **Loading States**: Spinners and disabled buttons during operations

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid layouts adapt to screen size
- Touch-friendly buttons and inputs

## 🧪 Testing

To test the application:

1. **Authentication Flow**
   - Register a new account
   - Login with demo accounts
   - Verify token persistence

2. **User Features**
   - Browse sweets
   - Search and filter
   - Purchase items
   - Check out-of-stock handling

3. **Admin Features**
   - Add new sweets
   - Edit existing sweets
   - Delete sweets
   - Restock inventory

## 🤖 My AI Usage

This project was developed as a TDD Kata exercise with AI assistance. Here's how AI tools were utilized throughout the development process:

### Planning & Architecture
- **AI Tool**: Claude (Anthropic)
- **Usage**: Designed the overall system architecture, database schema, and API structure
- **Benefits**: Rapid prototyping of the full-stack architecture with best practices

### Backend Development
- **AI Tool**: Claude with code generation
- **Usage**: 
  - Created SQLite database setup with Better-SQLite3
  - Implemented JWT authentication system
  - Built RESTful API endpoints with proper error handling
  - Developed role-based access control middleware
- **Benefits**: Consistent API design patterns and comprehensive error handling

### Frontend Development
- **AI Tool**: Claude with React/Next.js expertise
- **Usage**:
  - Built React components with TypeScript
  - Implemented form validation with React Hook Form and Zod
  - Created responsive UI with Tailwind CSS
  - Developed state management with Context API
- **Benefits**: Type-safe components with proper validation and error states

### UI/UX Design
- **AI Tool**: Claude for component composition
- **Usage**:
  - Designed component hierarchy and layouts
  - Implemented Shadcn/UI components
  - Created responsive grid systems
  - Added loading states and user feedback
- **Benefits**: Modern, accessible UI with excellent user experience

### Documentation
- **AI Tool**: Claude for technical writing
- **Usage**: Generated comprehensive README with:
  - Setup instructions
  - API documentation
  - Usage examples
  - Project structure overview
- **Benefits**: Clear, professional documentation for developers

### Code Quality
- **AI Tool**: Claude for code review suggestions
- **Usage**:
  - TypeScript type safety
  - Error handling patterns
  - Security best practices
  - Performance optimizations
- **Benefits**: Production-ready code with industry standards

### Learning Outcomes
Working with AI on this project demonstrated:
- How AI can accelerate full-stack development
- The importance of clear requirements and prompts
- AI's ability to maintain consistency across large codebases
- The value of AI-generated documentation
- The role of human oversight in AI-assisted development

### AI Limitations Encountered
- Required human guidance for specific business logic
- Needed iteration for complex state management
- Database seeding required manual data review
- UI/UX decisions benefited from human input

## 🔄 Future Enhancements

Potential features for future development:
- Order history tracking
- Shopping cart functionality
- Payment integration
- Email notifications
- Product reviews and ratings
- Advanced analytics dashboard
- Multi-language support
- Image upload functionality
- Export reports (CSV/PDF)
- Inventory alerts

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Shadcn/UI** - Beautiful React components
- **Next.js Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS framework
- **Better-SQLite3** - Fast SQLite database
- **AI Assistance** - Claude by Anthropic

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built with ❤️ using Next.js, TypeScript, and AI assistance**