// src/pages/CreateUser.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/users', { name, email });
      alert('Usuário cadastrado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      // <-- MUDANÇA: Tratamento de erro mais robusto
      if (err.response) {
        // Erro vindo da API (ex: email duplicado)
        setError(err.response.data.error || 'Ocorreu um erro na validação dos dados.');
      } else {
        // Erro de conexão (backend fora do ar)
        setError('Erro de conexão. Verifique se o servidor backend está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Cadastrar Novo Usuário</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;