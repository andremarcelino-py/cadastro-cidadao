import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import CadastroCidadao from './pages/CadastroCidadao';
import Login from './pages/Login';
import { Toaster } from 'sonner';
import { supabase } from './utils/supabase';

const queryClient = new QueryClient();

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      if (!supabase) {
        setLoadingSession(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const authSession = data.session;

      if (!authSession?.user) {
        if (mounted) {
          setSession(null);
          setLoadingSession(false);
        }
        return;
      }

      const { data: perfil } = await supabase
        .from('perfis')
        .select('nome, funcao')
        .eq('id', authSession.user.id)
        .maybeSingle();

      if (mounted) {
        setSession({
          userId: authSession.user.id,
          email: authSession.user.email,
          nome: perfil?.nome || authSession.user.user_metadata?.nome || '',
          funcao: perfil?.funcao || 'lider'
        });
        setLoadingSession(false);
      }
    };

    hydrateSession();

    const { data: listener } = supabase
      ? supabase.auth.onAuthStateChange(async (_event, authSession) => {
          if (!authSession?.user) {
            setSession(null);
            return;
          }

          const { data: perfil } = await supabase
            .from('perfis')
            .select('nome, funcao')
            .eq('id', authSession.user.id)
            .maybeSingle();

          setSession({
            userId: authSession.user.id,
            email: authSession.user.email,
            nome: perfil?.nome || authSession.user.user_metadata?.nome || '',
            funcao: perfil?.funcao || 'lider'
          });
        })
      : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = useMemo(() => !!session, [session]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
          {loadingSession ? (
            <div className="min-h-screen flex items-center justify-center text-slate-300">Carregando...</div>
          ) : (
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Home
                    session={session}
                    onLogout={async () => {
                      if (supabase) await supabase.auth.signOut();
                      setSession(null);
                    }}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/cadastro-cidadao"
              element={
                isAuthenticated ? (
                  <CadastroCidadao session={session} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? '/' : '/login'} replace />
              }
            />
          </Routes>
          )}
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </QueryClientProvider>
  );
}