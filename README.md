# Grimoire Infini

A magical real-time multiplayer card game built with SvelteKit, Three.js, and Firebase.

## Features

- **3D Card Interface** - Interactive 3D card game using Three.js
- **Real-time Multiplayer** - Synchronized gameplay across multiple clients
- **Firebase Backend** - Real-time database and authentication
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: SvelteKit, TypeScript, Three.js
- **Backend**: Firebase Firestore
- **Styling**: TailwindCSS, Skeleton UI
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Martriss/GPE.git
cd GPE

# Install dependencies
cd front
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to play Grimoire Infini.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
front/
├── src/
│   ├── lib/
│   │   ├── game/
│   │   │   ├── managers/     # Game controllers
│   │   │   └── objects/      # 3D game objects
│   │   └── firebase/         # Firebase configuration
│   └── routes/               # SvelteKit pages
└── static/                   # Static assets
```

## Key Components

- **MultiplayerController** - Manages real-time game synchronization
- **SceneManager** - Handles 3D scene and card rendering
- **Firebase Integration** - Real-time database operations

## License

MIT