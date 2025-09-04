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
    <div className="p-8 bg-white shadow-md rounded-lg max-w-2xl mx-auto">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
    Detalhes do Usuário
  </h2>
  
  <div className="space-y-4 text-lg">
    <p>
      <strong className="font-semibold text-gray-500 mr-2">ID:</strong>
      <span className="text-gray-800 font-mono text-sm break-all">{user.id}</span>
    </p>
    <p>
      <strong className="font-semibold text-gray-500 mr-2">Nome:</strong>
      <span className="text-gray-800">{user.name}</span>
    </p>
    <p>
      <strong className="font-semibold text-gray-500 mr-2">Email:</strong>
      <span className="text-gray-800">{user.email}</span>
    </p>
  </div>
  
  <Link 
    to="/" 
    className="inline-block mt-8 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition-colors duration-200"
  >
    &larr; Voltar para a lista
  </Link>
</div>
  );
};

export default UserDetails;