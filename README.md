# Dynamic Table Component

This project implements a feature-rich, interactive data table component built with Next.js, TypeScript, and shadcn/ui. The table is designed for prototyping data-intensive applications with a focus on user experience and interactivity.

![Table Overview](/public/table-preview/table-overview.png)

## Features

### 1. Column Management
- **Column Visibility**: Toggle the visibility of any column through the Columns dropdown menu
- **Default Visibility**: First 10 columns are visible by default
- **Fixed Columns**: Pin important columns to keep them visible while scrolling horizontally
- **Fixed Column Grouping**: All pinned columns are grouped at the beginning of the table for better usability

### 2. Sorting Functionality
- **Header Sorting**: Click on any column header to sort by that column
- **Sort Direction**: Toggle between ascending and descending order
- **Sort Dropdown**: Use the dedicated Sort By dropdown to select sorting options
- **Visual Indicators**: Clear icons showing the current sort direction

### 3. Row Editing
- **Inline Editing**: Click on any cell (except ID) to edit its content
- **Edit Controls**: Confirmation (✓) and cancellation (✗) buttons for each edit
- **Visual Feedback**: Hover states and edit icons indicate editable cells
- **Mock API Integration**: Changes are logged to the console (simulating API calls)

### 4. Pagination
- **Page Navigation**: First, Previous, Next, and Last page buttons
- **Page Selection**: Direct selection of specific pages
- **Entry Information**: Shows current range and total number of entries
- **Configurable**: Adjustable page size and current page

### 5. Responsive Design
- **Horizontal Scrolling**: Table scrolls horizontally when there are many columns
- **Fixed Column Locking**: Pinned columns remain visible during horizontal scrolling
- **Consistent Styling**: Maintains visual consistency across fixed and scrollable sections
- **Mobile-Friendly**: Adapts to different screen sizes

### 6. Visual Enhancements
- **Alternating Row Colors**: Even/odd row styling for better readability
- **Hover States**: Interactive elements show hover effects
- **Shadow Effects**: Visual separation between fixed and scrollable sections
- **Dark Mode Support**: Compatible with light and dark themes

## Technical Implementation

The table is built using a component-based architecture:

- **DataTable**: Main component that handles rendering and state management
- **TableFilters**: Controls for filtering, column visibility, and sorting
- **Types**: Strong TypeScript typing for all table-related data structures

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prototyping Mode

This project is currently in prototyping mode with the following constraints:

1. Frontend development only - creating UI mockups without backend integration
2. Using dummy JSON data to represent application data
3. Implementing navigation between components
4. Making buttons responsive
5. No backend logic connections

This is a pure UI/UX prototyping phase to visualize the application before implementing actual functionality.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
