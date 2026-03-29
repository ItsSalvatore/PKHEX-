# PKHeX - Cross-Platform Pokémon Save Editor

A high-performance Progressive Web App (PWA) and React Native mobile app for editing Pokémon save files. Built with TypeScript, React, and modern tooling for maximum speed and offline capability.

## Architecture

```
pkhex-app/
├── packages/
│   ├── core/          @pkhex/core - TypeScript save file engine
│   │   ├── structures/   Pokemon, Trainer, Inventory types
│   │   ├── saves/        Save file detection and parsing (Gen 1-9)
│   │   ├── mystery-gift/ Mystery Gift database and parsing
│   │   ├── legality/     Legality checking engine
│   │   ├── data/         Species, moves, items, natures, types
│   │   └── util/         Crypto, checksums, binary utilities
│   └── shared/        @pkhex/shared - Shared types and config
├── apps/
│   ├── web/           React PWA (Vite + Tailwind + Framer Motion)
│   │   ├── pages/        Dashboard, Load, Party, Boxes, Trainer,
│   │   │                 Inventory, Mystery Gifts, Legality, Settings
│   │   ├── components/   Pokemon cards/editor, layout, common UI
│   │   ├── store/        Zustand state management
│   │   └── utils/        Sprites, file handling, IndexedDB
│   └── mobile/        React Native (Expo Router + NativeWind)
│       └── app/          Tab-based navigation with all screens
```

## Features

- **Save File Support**: Load and edit save files from Generations 1-9
- **Pokémon Editor**: Full stat viewer/editor with IV/EV/Nature display
- **PC Box Management**: Browse all boxes with visual Pokémon sprites
- **Trainer Info**: View and edit trainer profile, badges, play time
- **Inventory Management**: Browse and edit all item pouches
- **Mystery Gift Database**: Built-in database of 30+ mystery gifts across Gen 4-9
- **Legality Checker**: Scan all Pokémon for legality issues
- **PWA**: Install as app, works offline with service worker caching
- **Mobile**: React Native app for iOS and Android via Expo
- **Privacy First**: All processing happens locally - no server uploads

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core Engine | TypeScript, binary parsing |
| Web UI | React 19, Vite 6, Tailwind CSS 3 |
| Animations | Framer Motion |
| State | Zustand |
| Offline | Service Worker (Workbox), IndexedDB |
| Icons | Lucide React |
| Mobile | Expo 52, React Native, NativeWind |
| Build | npm workspaces monorepo |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install Dependencies

```bash
cd pkhex-app
npm install
```

### Development (Web)

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Development (Mobile)

```bash
npm run dev:mobile
```

Requires Expo Go app on your device or an emulator.

### Build for Production

```bash
npm run build
```

### Build Mobile (EAS)

```bash
cd apps/mobile
npx eas build --platform android
npx eas build --platform ios
```

## Supported Save Formats

| Generation | Games | File Sizes |
|-----------|-------|-----------|
| Gen 1 | Red/Blue/Yellow | 32 KB |
| Gen 2 | Gold/Silver/Crystal | 64 KB |
| Gen 3 | Ruby/Sapphire/Emerald/FRLG | 128 KB |
| Gen 4 | Diamond/Pearl/Platinum/HGSS | 512 KB |
| Gen 5 | Black/White/B2W2 | 1 MB |
| Gen 6 | X/Y/ORAS | ~400-480 KB |
| Gen 7 | Sun/Moon/USUM | ~430-440 KB |
| Gen 8 | Sword/Shield/BDSP/PLA | 1-2 MB |
| Gen 9 | Scarlet/Violet | 2+ MB |

## License

MIT - Based on PKHeX by kwsch and PKHeX.Everywhere by Arley Pádua.
