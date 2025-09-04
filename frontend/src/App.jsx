import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import CreateUser from './pages/CreateUser.jsx';
import UserDetails from './pages/UserDetails.jsx';
import Weather from './pages/Weather.jsx';

function App() {
  return (
    <Router>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/new" element={<CreateUser />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;