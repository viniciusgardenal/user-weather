import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Usuário não encontrado:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p>Carregando detalhes do usuário...</p>;
  if (!user) return (
    <div>
        <p>Usuário não encontrado.</p>
        <Link to="/">Voltar para a lista</Link>
    </div>
  );

  return (
    <div>
      <h2>Detalhes do Usuário</h2>
      <div className="user-details">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <br />
      <Link to="/">Voltar para a lista</Link>
    </div>
  );
};

export default UserDetails;