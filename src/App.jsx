import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import CadastroCidadao from './pages/CadastroCidadao';
import Login from './pages/Login';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export default function App() {
  const [session, setSession] = useState(null);

  const isAdmin = useMemo(() => session?.role === 'admin', [session]);
  const isLeader = useMemo(() => session?.role === 'leader', [session]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
          <Routes>
            <Route
              path="/login"
              element={session ? <Navigate to="/" replace /> : <Login onLogin={setSession} />}
            />
            <Route
              path="/"
              element={
                session ? (
                  <Home session={session} onLogout={() => setSession(null)} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/cadastro-cidadao"
              element={
                session ? (
                  <CadastroCidadao session={session} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={isAdmin || isLeader ? '/' : '/login'}
                  replace
                />
              }
            />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </QueryClientProvider>
  );
}