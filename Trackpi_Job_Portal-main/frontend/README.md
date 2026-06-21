# TrackPi Job Portal - Frontend

A modern, responsive job portal application built with React and Vite. This frontend provides an intuitive interface for job seekers and employers, featuring role-based access, resume generation, and seamless job management.

## 🚀 Technology Stack

This project leverages a robust modern tech stack to ensure performance, scalability, and a great developer experience.

### Core
- **[React](https://react.dev/)**: ^19.2.0 - A JavaScript library for building user interfaces.
- **[Vite](https://vitejs.dev/)**: ^7.2.4 - Next Generation Frontend Tooling.
- **[React Router DOM](https://reactrouter.com/)**: ^7.11.0 - Declarative routing for React web applications.

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)**: ^3.4.13 - A utility-first CSS framework for rapid UI development.
- **[Framer Motion](https://www.framer.com/motion/)**: ^12.23.26 - A production-ready motion library for React.
- **[Lucide React](https://lucide.dev/)**: ^0.562.0 - Beautiful & consistent icons.
- **[Remix Icon](https://remixicon.com/)**: ^4.7.0 - Open-source neutral-style system symbols.

### Data & Authentication
- **[Axios](https://axios-http.com/)**: ^1.13.2 - Promise based HTTP client for the browser and node.js.
- **[@react-oauth/google](https://github.com/MomenSherif/react-oauth)**: ^0.13.4 - Google OAuth2 integration for React.

### Features
- **[html2canvas](https://html2canvas.hertzen.com/)**: ^1.4.1 - Screenshots with JavaScript.
- **[jsPDF](https://github.com/parallax/jsPDF)**: ^4.0.0 - Client-side PDF generation (used for Resume generation).

## 🛠️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

## 📦 Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd Trackpi_Job_Portal/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🚀 Usage

The following scripts are available in the project:

### Development
Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The app will typically be available at `http://localhost:5173`.

### Production Build
Build the app for production:
```bash
npm run build
```
This will compile the application into the `dist` directory.

### Preview Production Build
Locally preview the production build:
```bash
npm run preview
```

### Linting
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 📂 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, and styles
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context for state management
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages/routes
│   ├── services/        # API service calls
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
└── tailwind.config.js   # Tailwind CSS configuration
```

## 📄 License

[License Information Here]
