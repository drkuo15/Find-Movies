import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Home from './pages/home';
import Movie from './pages/movieDetails';
import WatchList from './pages/watchList';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/watchlist" element={<WatchList />} />
          </Routes>
          <Toaster position="bottom-center" richColors />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
