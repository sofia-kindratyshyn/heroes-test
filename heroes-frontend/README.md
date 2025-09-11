# Heroes Frontend

A modern React application for managing superhero profiles with a clean, responsive interface. Built with TypeScript, React Query, and modern React patterns.

## 🚀 Features

- **Superhero Management**: Create, read, update, and delete superhero profiles
- **Image Gallery**: Upload and display multiple images per hero
- **Search & Pagination**: Find heroes quickly with real-time search and paginated results
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Form Validation**: Client-side validation with React Hook Form
- **State Management**: Efficient state management with Zustand and React Query
- **Draft Saving**: Auto-save form drafts to prevent data loss

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **React Query (TanStack Query)** - Server state management and caching
- **React Hook Form** - Performant form handling
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful notifications
- **CSS Modules** - Scoped styling
- **Modern Normalize** - CSS reset

## 📁 Project Structure

```
src/
├── components/
│   ├── App/                    # Main app component
│   ├── HeroesList/             # Hero listing with search and pagination
│   ├── pages/
│   │   ├── CreateHero/         # Create/Edit hero form
│   │   └── HeroDetails/        # Hero detail view
│   ├── Pagination/             # Pagination component
│   ├── SearchField/            # Search input component
│   └── Sidebar/                # Navigation sidebar
├── servises/
│   ├── heroServises.ts         # API service functions
│   └── store/
│       └── heroDraft.tsx       # Zustand store for form drafts
├── assets/                     # Static assets
└── main.tsx                    # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd heroes-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Features Overview

### Hero Management
- **Create Heroes**: Add new superheroes with detailed information
- **Edit Heroes**: Update existing hero profiles
- **Delete Heroes**: Remove heroes with confirmation
- **View Details**: Comprehensive hero profile pages

### Search & Navigation
- **Real-time Search**: Search heroes by name with debounced input
- **Pagination**: Navigate through large hero collections
- **Responsive Navigation**: Sidebar navigation for easy access

### Form Features
- **Auto-save Drafts**: Form data is automatically saved as you type
- **File Upload**: Upload multiple images per hero
- **Validation**: Client-side form validation with error messages
- **Clear Form**: Reset form data with one click

### Data Management
- **Optimistic Updates**: UI updates immediately for better UX
- **Cache Management**: Efficient data caching with React Query
- **Error Handling**: Graceful error handling with user-friendly messages

## 🎨 UI Components

### HeroesList
- Displays paginated list of heroes
- Search functionality with debounced input
- Card-based layout with hero avatars
- Quick action buttons (Details, Edit)

### CreateHero/EditHero
- Comprehensive form for hero data
- File upload for multiple images
- Real-time validation
- Draft auto-saving
- Form reset functionality

### HeroDetails
- Detailed hero profile view
- Image gallery
- Superpowers list
- Action buttons (Edit, Delete)
- Responsive layout

### Pagination
- Page navigation controls
- Previous/Next buttons
- Page number indicators
- Responsive design

## 🔌 API Integration

The frontend connects to a REST API with the following endpoints:

- `GET /superhero` - Get paginated heroes list
- `GET /superhero/:id` - Get hero by ID
- `POST /superhero` - Create new hero
- `PUT /superhero/:id` - Update hero
- `DELETE /superhero/:id` - Delete hero

### API Configuration

The API base URL is configured in `src/servises/heroServises.ts`:

```typescript
axios.defaults.baseURL = "https://heroes-test.onrender.com";
```

## 🎯 Key Features

### State Management
- **React Query**: Handles server state, caching, and synchronization
- **Zustand**: Manages client-side state (form drafts)
- **React Hook Form**: Manages form state and validation

### Performance Optimizations
- **Debounced Search**: Prevents excessive API calls
- **Placeholder Data**: Smooth transitions between pages
- **Optimistic Updates**: Immediate UI feedback
- **Code Splitting**: Automatic route-based code splitting

### User Experience
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Responsive Design**: Works on all device sizes

## 🎨 Styling

The project uses CSS Modules for scoped styling:
- Component-specific styles
- Responsive design patterns
- Modern CSS features
- Consistent design system

## 🧪 Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Modern React Patterns**: Hooks, functional components
- **Component Architecture**: Reusable, composable components

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid and Flexbox

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sofia Kindratyshyn**
- Email: sofia25kind@gmail.com

---

For backend documentation, see the `heroes-backend` directory.