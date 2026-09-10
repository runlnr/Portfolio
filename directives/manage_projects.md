# Directive: Manage Portfolio Projects

## Goal
Add, modify, or reorder projects displayed on Works, Case Studies, and Hero Carousels.

## Primary Data File
`js/projects-data.js` contains the `SWAG_PROJECTS` array.

## Project Object Schema
```javascript
{
  id: "project-slug",           // Unique URL slug (e.g. "wide-angle")
  number: "01",                 // 2-digit index string
  title: "WIDE ANGLE",          // Uppercase project title
  category: "Template",         // Category badge
  client: "Wide Angle",         // Client brand name
  year: "2026",                 // Release year
  field: "Interaction Design",  // Discipline/industry
  disciplines: "Art Direction, UI/UX",
  image: "https://...",         // Cover image URL or local path
  tagline: "Short tagline for header",
  description: "Full case study narrative...",
  services: "Art Direction, UI/UX Design, Development",
  credits: [
    { role: "Art Director", name: "Leon Kade" },
    { role: "Designer", name: "Noa Ferren" }
  ],
  gallery: [
    "https://...",
    "https://..."
  ]
}
```

## Adding a New Project
1. Append the new object to `SWAG_PROJECTS` in `js/projects-data.js`.
2. Update the counter `(15)` in the HTML navigation files if project count changes.
3. Verify the case study renders properly by visiting `http://localhost:3000/project.html?id=<your-slug>`.
