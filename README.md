# Härnösands FF Website

This is the official website for Härnösands FF, built with Next.js and designed to be easily editable through a custom editor interface.

## Features

- **Dynamic Content Editing**: Easily update text, images, and links directly on the page through an intuitive editor.
- **Section Customization**: Modify colors, font sizes, and other properties for various sections like Hero, Stats, About Club, Partners Carousel, and Upcoming Events.
- **Responsive Design**: Optimized for various screen sizes, from mobile to desktop.
- **API Integration**: Fetches news and calendar events from external APIs.
- **Authentication**: Secure login for administrators to access the editor.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or Yarn

### Installation

1.  Clone the repository:
    \`\`\`bash
    git clone https://github.com/your-username/harnosand-ff-website.git
    cd harnosand-ff-website
    \`\`\`
2.  Install dependencies:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

\`\`\`env
# Example:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
# AUTH_SECRET=your_auth_secret_here
\`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

### Running the Production Server

\`\`\`bash
npm start
# or
yarn start
\`\`\`

## Project Structure

-   `app/`: Next.js App Router pages and API routes.
    -   `api/`: API routes for news and calendar events.
    -   `editor/`: The custom editor page.
    -   `actions/`: Server Actions for content saving and authentication.
-   `components/`: Reusable React components.
    -   `sections/`: Components for different sections of the homepage (Hero, Stats, About Club, etc.).
    -   `ui/`: Shadcn UI components.
-   `lib/`: Utility functions and data.
    -   `content-store.ts`: Manages the page content state and persistence.
    -   `partners-data.ts`: Data for partners.
    -   `utils.ts`: General utility functions.
-   `public/`: Static assets like images.
-   `styles/`: Global CSS styles.

## Editor Usage

Navigate to `/editor` to access the content editor.
- Click on any text, button, or image to open the right-side panel and modify its properties.
- Use the "Spara ändringar" (Save Changes) button to persist your modifications.
- Use the "Återställ" (Reset) button to revert to default content.

## Contributing

Feel free to contribute by opening issues or submitting pull requests.
\`\`\`
