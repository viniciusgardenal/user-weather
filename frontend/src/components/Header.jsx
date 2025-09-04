// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="app-header">
    <h1>Gerenciador de Usuários e Clima</h1>
    <nav>
      <Link to="/">Lista de Usuários</Link>
      <Link to="/users/new">Cadastrar Usuário</Link>
      <Link to="/weather">Consultar Clima</Link>
    </nav>
  </header>
);

export default Header;