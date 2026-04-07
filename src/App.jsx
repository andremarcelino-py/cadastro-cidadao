import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import CadastroCidadao from './pages/CadastroCidadao';
import { Toaster } from 'sonner'; // 

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-cidadao" element={<CadastroCidadao />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </QueryClientProvider>
  );
}