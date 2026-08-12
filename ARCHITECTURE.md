<!-- @format -->

# Architecture

## Routes

app/
├── page.js
├── directory/
│ ├── page.js
│ └── [practiceArea]/
│ └── page.js
├── lawyers/
│ └── [slug]/
│ └── page.js
├── about/
│ └── page.js
├── articles/
│ ├── page.js
│ └── [slug]/
│ └── page.js
└── contact/
└── page.js

---

## Components

components/
├── layout/
│ ├── Header.jsx
│ ├── Footer.jsx
│ └── MobileNavigation.jsx
│
├── home/
│ ├── Hero.jsx
│ ├── RankingSection.jsx
│ ├── PracticeAreas.jsx
│ ├── FeaturedLawyers.jsx
│ ├── WhyChooseUs.jsx
│ └── CTASection.jsx
│
├── lawyers/
│ ├── LawyerCard.jsx
│ ├── LawyerGrid.jsx
│ ├── LawyerFilters.jsx
│ ├── LawyerProfile.jsx
│ ├── Rating.jsx
│ └── ReviewList.jsx
│
├── articles/
│ ├── ArticleCard.jsx
│ └── ArticleGrid.jsx
│
├── forms/
│ └── ContactForm.jsx
│
└── ui/
├── Button.jsx
├── Container.jsx
├── SectionHeading.jsx
├── Badge.jsx
└── EmptyState.jsx

---

## Data

data/
├── lawyers.js
├── practiceAreas.js
├── articles.js
└── testimonials.js

---

## Utilities

lib/
├── utils.js
└── search.js

Keep reusable non-UI logic here.

---

## Public Assets

public/
├── images/
├── icons/
└── logo/

Use placeholders when actual client assets are unavailable.

---

## Rules

Pages compose sections and components.

Components should not contain large datasets.

Data files contain demo content.

Utility functions contain reusable logic.

Do not put everything into one giant component.
