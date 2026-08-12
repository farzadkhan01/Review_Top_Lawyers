<!-- @format -->

# Demo Data Rules

All current data is fictional.

## Lawyer

Each lawyer should support:

- id
- slug
- name
- title
- specialty
- practiceAreas
- location
- rating
- reviewCount
- image
- shortBio
- fullBio
- yearsOfExperience
- education
- languages
- phone
- email
- reviews

---

## Practice Area

Each practice area should support:

- id
- slug
- name
- description
- image/icon
- lawyerCount

---

## Article

Each article should support:

- id
- slug
- title
- excerpt
- content
- category
- author
- publishedAt
- image
- readingTime

---

## Reviews

Reviews are fictional demo content.

They should have:

- reviewer name
- rating
- date
- text

Do not imply that these reviews are from real people.

---

## Replacement Strategy

When real client data becomes available:

1. Replace data files or connect them to the backend.
2. Keep component APIs stable where possible.
3. Do not rewrite the UI unnecessarily.
