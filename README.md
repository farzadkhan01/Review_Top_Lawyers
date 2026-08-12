<!-- @format -->

# Review Top Lawyers

A modern, responsive lawyer discovery and directory platform built with **Next.js** and **JavaScript**.

Review Top Lawyers allows users to discover lawyers by practice area, location, ratings, and other relevant information. The platform also includes lawyer profiles, articles, reviews, and contact functionality.

> **Note:** This project currently uses fictional/demo lawyers, reviews, contact information, and other content. Real client content and assets can be added later.

## ✨ Features

- Modern and professional legal directory interface
- Responsive design for desktop, tablet, and mobile
- Lawyer directory with:
  - Search
  - Practice-area filtering
  - Location filtering
  - Rating filtering
  - Sorting

- Individual lawyer profile pages
- Practice-area pages
- Lawyer ratings and reviews
- Featured lawyers and ranking-style discovery sections
- Articles and individual article pages
- Related articles and lawyer recommendations
- Global search connected to the lawyer directory
- Contact form with validation and submission states
- Responsive mobile navigation
- Subtle animations and interactions
- Dynamic SEO metadata
- Accessible form controls and semantic HTML
- Custom 404 handling
- Data-driven architecture for easy content replacement

## 🛠️ Tech Stack

- **Next.js** — App Router
- **JavaScript / JSX**
- **Tailwind CSS**
- **Framer Motion**
- **ESLint**

The project intentionally uses JavaScript instead of TypeScript.

## 📁 Project Structure

The project follows a modular structure separating pages, reusable components, data, utilities, and configuration.

```text
app/
├── about/
├── articles/
├── contact/
├── directory/
├── lawyers/
├── layout.js
├── not-found.js
└── page.js

components/
├── articles/
├── forms/
├── home/
├── layout/
├── lawyers/
├── practice-areas/
└── ui/

data/
├── articles.js
├── lawyers.js
└── practiceAreas.js

lib/
├── constants.js
├── contact.js
├── search.js
└── utils.js

public/
└── static assets
```

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your system.

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into the project directory:

```bash
cd review-top-lawyers
```

Install dependencies:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Lint

```bash
npm run lint
```

## 🔎 Search

The global search interface is already integrated with the lawyer directory.

Search requests are passed through the URL:

```text
/directory?q=search-term
```

The current implementation uses local demo data. It is structured so that a more advanced search system or backend can be introduced later without rebuilding the overall UI.

## 📊 Demo Data

The application currently uses local JavaScript data files for:

- Lawyers
- Practice areas
- Articles
- Reviews
- Contact information

This makes the project easy to demonstrate without requiring a database.

Real client data can replace the existing demo data later.

## 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile
- Small mobile screens

The UI has been tested at narrow mobile widths to ensure the primary layouts remain usable without horizontal overflow.

## 📈 SEO & Accessibility

The application includes:

- Dynamic page metadata
- Route-specific titles and descriptions
- Open Graph metadata where appropriate
- Semantic HTML
- Accessible form labels
- Keyboard-friendly controls
- Visible focus states
- Accessible validation messages
- Responsive layouts

## ⚠️ Current Limitations

This version is a frontend/demo implementation.

The following are intentionally not connected to a backend:

- Database
- Authentication
- Real search service
- Email delivery
- Contact form API
- Payments
- CMS
- Admin dashboard

The contact form currently demonstrates the complete UI and validation flow but does not send real emails.

## 🔮 Future Improvements

Potential future integrations include:

- Real lawyer database
- Backend/API
- Advanced search
- Authentication
- Lawyer account management
- Real review system
- Real contact/email service
- CMS for articles
- Admin dashboard
- Real client imagery and branding
- Production analytics

## 📄 License

This project is intended for the project/client described by the repository owner.

All demo content, lawyer profiles, reviews, images, and contact information are fictional placeholders unless otherwise stated.
