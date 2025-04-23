# React Social Media App

A social media web application inspired by Facebook built with React, React Router, and React Query. Users can sign up, log in, edit profiles, upload images, search for users or posts, view a personalized feed, manage friend requests, and engage in posts via comments and likes.

## Features

- **Authentication**: Sign up and log in using JWT-based authentication.
- **Profile Management**: Edit user profiles and upload profile images with cropping functionality.
- **Feed**: “For You” page displaying an infinite scroll feed.
- **Search**: Search for users or posts.
- **Friend Requests**: View and manage incoming friend requests.
- **Posts**: Create, delete, and like posts; add and delete comments.
- **Real-time Data Fetching**: Efficient data management using React Query.
- **Routing**: Client-side routing powered by React Router.
- **Animations**: Smooth transitions using Framer Motion.
- **State Management**: Local React state and React Query for server state.

## Tech Stack

- React
- React Router v6
- TanStack React Query
- Axios & Fetch API
- js-cookie for cookie management
- react-easy-crop for image cropping
- Framer Motion for animations
- CSS Modules & Plain CSS

## Getting Started

### Prerequisites

- Node.js v14 or above
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jonaszmielke/fb_react.git
   cd fb_react
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:****
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Folder Structure

```
src/
├── app.jsx             # Root component and router setup
├── components/         # Reusable UI components
├── pages/              # Top-level pages (login, signup, home, user)
├── query/              # Data fetching functions
├── shared.css          # Global styles
└── ...                 # Other assets
```

## Available Scripts

In the project directory, you can run:

- `npm run dev` or `yarn dev` - Runs the app in development mode.
- `npm run build` or `yarn build` - Builds the app for production.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


