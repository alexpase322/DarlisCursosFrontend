import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
// Iconos modernos
import { 
    Send, 
    Plus, 
    Search, 
    MessageSquare, 
    MoreVertical, 
    Phone, 
    Video,
    X,
    Smile,
    Trash2 // <--- Nuevo icono
} from "lucide-react";

// Conexión fuera del componente
const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");

function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // Estado para modal
  const [showModal, setShowModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  
  // Estado visual para búsqueda local en sidebar
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Cargar conversaciones
  useEffect(() => {
    getConversations();
  }, []);

  // 2. Escuchar mensajes
  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (currentChat && (currentChat._id === message.conversationId || currentChat.messages)) {
         setMessages((prev) => [...prev, { ...message, sender: { _id: message.sender } }]); 
      }
    });

    return () => {
        socket.off("receive_message");
    }
  }, [currentChat]);

  // 3. Scroll automático
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getConversations = async () => {
    try {
      const res = await axios.get("/chat");
      setConversations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAvailableUsers = async () => {
    try {
        const res = await axios.get("/chat/users");
        setAvailableUsers(res.data);
        setShowModal(true);
    } catch (error) {
        console.log(error);
    }
  };

  const startChat = async (receiverId) => {
      try {
          const res = await axios.post("/chat", { receiverId });
          setShowModal(false);
          const exists = conversations.find(c => c._id === res.data._id);
          if(!exists) setConversations([res.data, ...conversations]);
          
          handleChatSelect(res.data);
      } catch (error) {
          toast.error("Error iniciando chat");
      }
  };

  const handleChatSelect = (chat) => {
      setCurrentChat(chat);
      setMessages(chat.messages || []);
      socket.emit("join_room", chat._id);
  };

  // --- NUEVA FUNCIÓN: ELIMINAR CHAT ---
  const handleDeleteChat = async () => {
      if(!currentChat) return;
      if(!window.confirm("¿Seguro que quieres eliminar esta conversación? Se borrará para ambos.")) return;

      try {
          await axios.delete(`/chat/${currentChat._id}`);
          
          // Actualizar estado local
          setConversations(conversations.filter(c => c._id !== currentChat._id));
          setCurrentChat(null);
          setMessages([]);
          toast.success("Chat eliminado");
      } catch (error) {
          console.error(error);
          toast.error("Error al eliminar chat");
      }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
        conversationId: currentChat._id,
        text: newMessage,
    };

    const optimisticMsg = {
        sender: user,
        text: newMessage,
        createdAt: Date.now()
    };
    
    socket.emit("send_message", { 
        conversationId: currentChat._id, 
        message: { sender: user._id, text: newMessage, createdAt: Date.now() } 
    });

    setMessages([...messages, optimisticMsg]);
    setNewMessage("");

    try {
      await axios.post("/chat/message", messageData);
    } catch (err) {
      console.log(err);
    }
  };

  // Filtrar conversaciones para el sidebar
  const filteredConversations = conversations.filter(c => {
      const other = c.members.find(m => m._id !== user._id);
      return other?.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* SIDEBAR: Lista de Chats */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-white">
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-2xl text-[#1B3854]">Mensajes</h2>
                <button 
                    onClick={getAvailableUsers} 
                    className="bg-[#FDE5E5] text-[#905361] p-2 rounded-full hover:bg-[#905361] hover:text-white transition shadow-sm"
                    title="Nuevo Chat"
                >
                    <Plus size={20} />
                </button>
            </div>
            
            {/* Buscador */}
            <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar chats..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#905361]/20 outline-none transition"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Lista Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                    No tienes conversaciones activas.
                </div>
            )}
            
            {filteredConversations.map((c) => {
                const otherUser = c.members.find(m => m._id !== user._id);
                const isActive = currentChat?._id === c._id;
                
                return (
                    <div 
                        key={c._id} 
                        onClick={() => handleChatSelect(c)}
                        className={`p-4 mx-2 my-1 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                            isActive 
                            ? 'bg-[#FDE5E5] shadow-sm' 
                            : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="relative">
                            <img src={otherUser?.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <p className={`font-bold text-sm truncate ${isActive ? 'text-[#905361]' : 'text-gray-800'}`}>
                                    {otherUser?.username}
                                </p>
                                <span className="text-[10px] text-gray-400">Ahora</span>
                            </div>
                            <p className={`text-xs truncate ${isActive ? 'text-[#905361]/80' : 'text-gray-500'}`}>
                                {c.lastMessage || "Inicia la conversación"}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#F7F2EF]">
        {currentChat ? (
          <>
            {/* Header del Chat */}
            <div className="h-20 px-6 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <img src={currentChat.members.find(m => m._id !== user._id)?.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    <div>
                        <span className="font-bold text-[#1B3854] block text-lg leading-tight">
                            {currentChat.members.find(m => m._id !== user._id)?.username}
                        </span>
                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> En línea
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                    <button className="hover:text-[#1B3854] hover:bg-gray-100 p-2 rounded-full transition"><Phone size={20} /></button>
                    <button className="hover:text-[#1B3854] hover:bg-gray-100 p-2 rounded-full transition"><Video size={20} /></button>
                    
                    {/* BOTÓN ELIMINAR CHAT (NUEVO) */}
                    <button 
                        onClick={handleDeleteChat} 
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                        title="Eliminar conversación"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                        <MessageSquare size={48} />
                        <p className="mt-2 text-sm">Saluda para comenzar la charla</p>
                    </div>
                )}

                {messages.map((m, idx) => {
                    const isMe = m.sender._id === user._id || m.sender === user._id;
                    return (
                        <div ref={scrollRef} key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`max-w-[70%] px-5 py-3 shadow-sm text-sm leading-relaxed relative group ${
                                    isMe 
                                    ? 'bg-[#1B3854] text-white rounded-2xl rounded-tr-sm' 
                                    : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100'
                                }`}
                            >
                                <p>{m.text}</p>
                                <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-[#905361]/20 focus-within:border-[#905361] transition-all">
                    
                    <button type="button" className="p-2 text-gray-400 hover:text-[#1B3854] transition">
                        <Smile size={24} />
                    </button>
                    
                    <input 
                        type="text" 
                        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 ml-2"
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    
                    <button 
                        type="submit" 
                        className={`p-3 rounded-full transition-all duration-300 ${
                            newMessage.trim() 
                            ? 'bg-[#905361] text-white shadow-md hover:bg-[#5E2B35] transform hover:scale-105' 
                            : 'bg-gray-200 text-gray-400 cursor-default'
                        }`}
                        disabled={!newMessage.trim()}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-white">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={40} className="text-gray-300" />
            </div>
            <p className="text-xl font-medium text-gray-400">Selecciona un chat</p>
            <p className="text-sm">O inicia una nueva conversación desde el menú</p>
          </div>
        )}
      </div>

      {/* MODAL NUEVO CHAT */}
      {showModal && (
          <div className="fixed inset-0 bg-[#1B3854]/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-3xl shadow-2xl w-96 max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-[#1B3854]">Nueva Conversación</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition"><X size={20}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {availableUsers.map(u => (
                        <div 
                            key={u._id} 
                            onClick={() => startChat(u._id)} 
                            className="flex items-center gap-4 p-3 hover:bg-[#FDE5E5] cursor-pointer rounded-2xl transition-colors group"
                        >
                            <img src={u.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-gray-700 group-hover:text-[#905361]">{u.username}</span>
                        </div>
                    ))}
                    {availableUsers.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-4">No hay otros usuarios disponibles.</p>
                    )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

export default ChatPage;