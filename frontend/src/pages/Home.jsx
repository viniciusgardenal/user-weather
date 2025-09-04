import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await api.get('/users', { params: filters });
      setUsers(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError('Não foi possível carregar os usuários. Verifique se o servidor backend está rodando.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <div className="filters">
        <input
          type="text" name="name" placeholder="Filtrar por nome..."
          value={filters.name} onChange={handleFilterChange}
        />
        <input
          type="text" name="email" placeholder="Filtrar por email..."
          value={filters.email} onChange={handleFilterChange}
        />
      </div>

      {error && <p className="error">{error}</p>}
      
      {loading ? <p>Carregando...</p> : !error && (
        <table className="user-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><Link to={`/users/${user.id}`}>Ver Detalhes</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;