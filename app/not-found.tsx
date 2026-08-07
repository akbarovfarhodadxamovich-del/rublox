'use client';

import React, { useState } from 'react';
import { Home, ArrowLeft, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Установлен новый пароль
  const DEV_PASSWORD = 'ROBLOXDEVS';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.trim() === DEV_PASSWORD) {
      localStorage.setItem('unlocked_all_levels', 'true');
      localStorage.setItem('player_level', '10');
      alert('🔓 Успешно! Режим разработчика активирован.');
      router.push('/');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black">
      <div className="max-w-xl w-full text-center space-y-6 border border-white/20 p-8 rounded-xl bg-neutral-950 shadow-2xl relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-block border border-white/30 px-3 py-1 rounded text-xs tracking-widest uppercase text-neutral-400">
          Error 404
        </div>

        <h1 className="text-7xl font-black tracking-tighter">404</h1>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Страница не найдена</h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Запрашиваемый вами ресурс не существует, был перемещен или удален из системы. Проверьте правильность введенного адреса.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/20 text-white text-xs font-bold rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          
          <a
            href="/"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-lg transition shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>На главную</span>
          </a>
        </div>

        {/* Блок ввода пароля */}
        <form onSubmit={handleUnlock} className="pt-4 border-t border-white/10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-neutral-500 tracking-wider">
            <KeyRound className="w-3 h-3" />
            <span>DEV ACCESS (Пароль: ROBLOXDEVS)</span>
          </div>
          <div className="flex gap-2 w-full max-w-xs">
            <input
              type="text"
              placeholder="Введите пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-neutral-900 border text-xs px-3 py-1.5 rounded-lg text-white focus:outline-none transition ${
                error ? 'border-red-500 text-red-500' : 'border-white/20 focus:border-white'
              }`}
            />
            <button
              type="submit"
              className="bg-neutral-800 hover:bg-neutral-700 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition font-bold"
            >
              OK
            </button>
          </div>
        </form>

        <div className="text-[10px] text-neutral-600 tracking-wider">
          ROBLOX ENVIRONMENT • MONOCHROME SYSTEM
        </div>
      </div>
    </div>
  );
}