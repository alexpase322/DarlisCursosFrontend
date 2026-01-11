import { useState } from 'react';
import axios from '../../api/axios'; // <--- Importación correcta (sube 2 niveles)

const InviteUser = () => {
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      // Necesitamos el token del admin para usar esta ruta protegida
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post('/auth/invite', { email }, config);
      
      setLink(data.link);
      alert('Invitación generada correctamente');
      setEmail('');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error al invitar');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Invitar Nuevo Estudiante</h2>
      
      <form onSubmit={handleInvite} className="flex gap-4 items-end mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="estudiante@ejemplo.com"
            required
          />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded h-10 hover:bg-green-700">
          Generar Link
        </button>
      </form>

      {link && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm break-all">
          <p className="font-bold text-yellow-800">Copia este enlace y envíalo:</p>
          <p className="text-gray-700 mt-1">{link}</p>
        </div>
      )}
    </div>
  );
};

export default InviteUser;