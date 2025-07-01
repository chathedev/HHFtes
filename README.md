# Härnösands HF Website

This is the official website for Härnösands HF, a handball club.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable React components, including UI components from shadcn/ui.
- `lib/`: Utility functions and content management logic.
- `public/`: Static assets like images and fonts.
- `styles/`: Global CSS styles.

## Getting Started

1.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`
2.  **Run the development server**:
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Editor Mode

This application includes an editor mode for managing page content.

-   **Access Editor**: Navigate to `/editor`
-   **Login**: Use the password defined in your `API_SECRET` environment variable.

## Technologies Used

-   Next.js 14 (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Lucide React Icons
