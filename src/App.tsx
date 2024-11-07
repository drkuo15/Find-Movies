import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Home from './pages/home';
import Movie from './pages/movieDetails';
import WatchList from './pages/watchList';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/watchlist" element={<WatchList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
