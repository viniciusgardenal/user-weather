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
      if (err.response) {
        setError(err.response.data.error || 'Ocorreu um erro na validação dos dados.');
      } else {
        setError('Erro de conexão. Verifique se o servidor backend está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-md rounded-lg max-w-2xl mx-auto">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
    Cadastrar Novo Usuário
  </h2>
  
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Campo Nome */}
    <div>
      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
        Nome:
      </label>
      <input 
        id="name" 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
    
    {/* Campo Email */}
    <div>
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
        Email:
      </label>
      <input 
        id="email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
    
    {/* Exibição de Erro */}
    {error && (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p>{error}</p>
      </div>
    )}
    
    {/* Botão de Envio */}
    <button 
      type="submit" 
      disabled={loading}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Cadastrando...' : 'Cadastrar'}
    </button>
  </form>
</div>
  );
};

export default CreateUser;