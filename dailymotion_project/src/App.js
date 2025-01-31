import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Single from './pages/Single';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>

          <Route index element={<Home />} />
          <Route path='/single/:id' element={<Single />} />
          <Route path='/search/:searchKey' element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/watchlist" element={<Watchlist />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
