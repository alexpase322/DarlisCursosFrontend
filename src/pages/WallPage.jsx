import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
// Importamos iconos modernos
import { Image, Send, Heart, MessageCircle, Trash2, X, MoreHorizontal } from "lucide-react";

function WallPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("content", newPostContent);
    if (newPostImage) formData.append("image", newPostImage);

    try {
      const res = await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts([res.data, ...posts]);
      setNewPostContent("");
      setNewPostImage(null);
      toast.success("¡Publicado con éxito!");
    } catch (error) {
      toast.error("Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: res.data } : post
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("¿Estás segura de eliminar esta publicación?")) return;
    try {
      await axios.delete(`/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
      toast.success("Eliminado");
    } catch (error) {
      toast.error("No tienes permiso para eliminar esto");
    }
  };

  const handleComment = async (postId) => {
    if(!commentText.trim()) return;
    try {
        const res = await axios.post(`/posts/${postId}/comment`, { text: commentText });
        setPosts(posts.map(post => 
            post._id === postId ? { ...post, comments: res.data } : post
        ));
        setCommentText("");
    } catch (error) {
        toast.error("Error al comentar");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      
      {/* 1. CAJA DE PUBLICAR (Diseño Minimalista) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 transition-shadow hover:shadow-md">
        <div className="flex gap-4">
          <img 
            src={user.avatar} 
            alt="Yo" 
            className="w-12 h-12 rounded-full object-cover border-2 border-[#FDE5E5]" 
          />
          <div className="flex-1">
            <textarea
              className="w-full bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FDE5E5] resize-none text-gray-700 placeholder-gray-400 transition-all border border-transparent focus:border-[#905361]/20"
              rows="2"
              placeholder={`¿Qué hay de nuevo, ${user.username}?`}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
            
            {/* Preview de imagen */}
            {newPostImage && (
                <div className="mt-3 relative inline-block group">
                    <img src={URL.createObjectURL(newPostImage)} alt="Preview" className="h-32 rounded-xl object-cover shadow-sm border border-gray-200" />
                    <button 
                        onClick={() => setNewPostImage(null)} 
                        className="absolute -top-2 -right-2 bg-white text-gray-500 hover:text-red-500 rounded-full p-1 shadow-md border border-gray-200 transition"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mt-4 border-t border-gray-50 pt-3">
              <label className="cursor-pointer text-gray-500 hover:text-[#905361] hover:bg-[#FDE5E5] px-4 py-2 rounded-xl transition-all text-sm font-medium flex items-center gap-2">
                <Image size={18} />
                <span>Foto</span>
                <input type="file" className="hidden" accept="image/*" onChange={e => setNewPostImage(e.target.files[0])} />
              </label>
              
              <button 
                onClick={handleCreatePost}
                disabled={loading || (!newPostContent && !newPostImage)}
                className="bg-[#905361] text-white px-6 py-2 rounded-full font-bold hover:bg-[#5E2B35] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                {loading ? (
                    <span className="animate-pulse">Publicando...</span>
                ) : (
                    <>
                        <span>Publicar</span>
                        <Send size={16} />
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEED DE POSTS */}
      <div className="space-y-6">
        {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            
            {/* Header del Post */}
            <div className="p-5 flex justify-between items-start">
                <div className="flex gap-3 items-center">
                    <img src={post.author?.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    <div>
                        <h4 className="font-bold text-[#1B3854] text-sm">{post.author?.username}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            {post.author?.role === 'admin' && (
                                <span className="bg-[#1B3854] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">ADMIN</span>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Menú de opciones (Eliminar) */}
                {(user._id === post.author?._id || user.role === 'admin') && (
                    <button 
                        onClick={() => handleDelete(post._id)} 
                        className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition"
                        title="Eliminar publicación"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Contenido Texto */}
            <div className="px-5 pb-3">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>

            {/* Contenido Imagen */}
            {post.image && (
                <div className="w-full bg-gray-50 border-y border-gray-50">
                    <img src={post.image} alt="Contenido" className="w-full max-h-[500px] object-cover" />
                </div>
            )}

            {/* Footer de Acciones */}
            <div className="px-5 py-4">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                            post.likes.includes(user._id) 
                            ? 'text-[#905361]' 
                            : 'text-gray-400 hover:text-[#905361]'
                        }`}
                    >
                        <Heart 
                            size={20} 
                            className={post.likes.includes(user._id) ? "fill-current" : ""} 
                        />
                        <span>{post.likes.length || ""}</span>
                    </button>
                    
                    <button 
                        onClick={() => setOpenCommentsId(openCommentsId === post._id ? null : post._id)}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#1B3854] transition-colors"
                    >
                        <MessageCircle size={20} />
                        <span>{post.comments.length || ""}</span>
                    </button>
                </div>

                {/* Sección de Comentarios */}
                {openCommentsId === post._id && (
                    <div className="mt-4 pt-4 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
                        
                        {/* Lista de comentarios */}
                        <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {post.comments.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-2">No hay comentarios aún. ¡Sé la primera!</p>
                            ) : (
                                post.comments.map((comment, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <img src={comment.user?.avatar} className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0" />
                                        <div className="bg-[#F7F2EF] px-4 py-2 rounded-2xl rounded-tl-none text-sm text-gray-700 w-full">
                                            <span className="font-bold text-[#1B3854] text-xs block mb-0.5">{comment.user?.username}</span>
                                            {comment.text}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input para comentar */}
                        <div className="flex gap-2 items-center relative">
                            <input 
                                type="text" 
                                placeholder="Escribe un comentario bonito..." 
                                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-[#905361] focus:ring-1 focus:ring-[#905361] transition-all"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                            />
                            <button 
                                onClick={() => handleComment(post._id)} 
                                className="absolute right-2 p-1.5 bg-[#1B3854] text-white rounded-full hover:bg-[#905361] transition-colors"
                                disabled={!commentText.trim()}
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default WallPage;