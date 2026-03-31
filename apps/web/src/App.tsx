import { useLayoutEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { useAppStore } from '@/store/app-store';
import { Dashboard } from './pages/Dashboard';
import { LoadSave } from './pages/LoadSave';
import { Party } from './pages/Party';
import { Boxes } from './pages/Boxes';
import { Trainer } from './pages/Trainer';
import { Inventory } from './pages/Inventory';
import { MysteryGifts } from './pages/MysteryGifts';
import { Legality } from './pages/Legality';
import { SettingsPage } from './pages/SettingsPage';
import { CheatCodes } from './pages/CheatCodes';
import { Pokedex } from './pages/Pokedex';

function ThemeRoot({ children }: { children: ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeRoot>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/load" element={<LoadSave />} />
          <Route path="/party" element={<Party />} />
          <Route path="/boxes" element={<Boxes />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/mystery-gifts" element={<MysteryGifts />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/legality" element={<Legality />} />
          <Route path="/cheat-codes" element={<CheatCodes />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      </ThemeRoot>
    </BrowserRouter>
  );
}
