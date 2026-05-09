import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, Save, Loader2, Award } from "lucide-react";

const emptyQuestion = () => ({
    text: "",
    options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false }
    ],
    explanation: ""
});

const QuizEditor = () => {
    const { id: courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("Examen final del curso");
    const [description, setDescription] = useState("");
    const [passingScore, setPassingScore] = useState(70);
    const [isActive, setIsActive] = useState(true);
    const [questions, setQuestions] = useState([emptyQuestion()]);

    useEffect(() => { fetchQuiz(); }, [courseId]);

    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/quizzes/admin/course/${courseId}`);
            if (data.quiz) {
                setTitle(data.quiz.title);
                setDescription(data.quiz.description || "");
                setPassingScore(data.quiz.passingScore || 70);
                setIsActive(data.quiz.isActive !== false);
                setQuestions(data.quiz.questions.length ? data.quiz.questions : [emptyQuestion()]);
            }
        } catch (e) { /* primera vez */ }
        finally { setLoading(false); }
    };

    const addQuestion = () => {
        if (questions.length >= 10) { toast.error("Máximo 10 preguntas"); return; }
        setQuestions([...questions, emptyQuestion()]);
    };
    const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));
    const updateQuestion = (i, field, value) => {
        const next = [...questions]; next[i] = { ...next[i], [field]: value }; setQuestions(next);
    };
    const addOption = (qi) => {
        const next = [...questions];
        if (next[qi].options.length >= 6) { toast.error("Máximo 6 opciones"); return; }
        next[qi].options = [...next[qi].options, { text: "", isCorrect: false }];
        setQuestions(next);
    };
    const removeOption = (qi, oi) => {
        const next = [...questions];
        if (next[qi].options.length <= 2) { toast.error("Mínimo 2 opciones"); return; }
        next[qi].options = next[qi].options.filter((_, idx) => idx !== oi);
        setQuestions(next);
    };
    const updateOption = (qi, oi, field, value) => {
        const next = [...questions];
        // Si marca una como correcta y solo queremos 1 correcta, desmarcar otras
        if (field === 'isCorrect' && value === true) {
            next[qi].options = next[qi].options.map((o, idx) => ({ ...o, isCorrect: idx === oi }));
        } else {
            next[qi].options[oi] = { ...next[qi].options[oi], [field]: value };
        }
        setQuestions(next);
    };

    const save = async () => {
        if (saving) return;
        // Validaciones
        for (const [i, q] of questions.entries()) {
            if (!q.text.trim()) return toast.error(`Pregunta ${i + 1} sin texto`);
            if (q.options.some(o => !o.text.trim())) return toast.error(`Pregunta ${i + 1}: hay opciones vacías`);
            if (!q.options.some(o => o.isCorrect)) return toast.error(`Pregunta ${i + 1}: marca al menos una correcta`);
        }
        setSaving(true);
        try {
            await axios.put(`/quizzes/admin/course/${courseId}`, {
                title, description, passingScore, isActive, questions
            });
            toast.success("Quiz guardado");
        } catch (e) {
            toast.error(e.response?.data?.message || "Error al guardar");
        } finally { setSaving(false); }
    };

    const remove = async () => {
        if (!window.confirm("¿Eliminar el quiz de este curso?")) return;
        try {
            await axios.delete(`/quizzes/admin/course/${courseId}`);
            toast.success("Quiz eliminado");
            setTitle("Examen final del curso"); setDescription(""); setPassingScore(70); setQuestions([emptyQuestion()]);
        } catch (e) { toast.error("Error al eliminar"); }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>;

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
                <Link to={`/admin/course/${courseId}`} className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854] flex items-center gap-2">
                        <Award size={24} className="text-[#905361]" /> Examen del curso
                    </h1>
                    <p className="text-gray-500 text-sm">Crea hasta 10 preguntas. Aprueba la alumna cuando supere el porcentaje mínimo.</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 space-y-3">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Título</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Descripción (opcional)</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">% mínimo para aprobar</label>
                        <input type="number" min="0" max="100" value={passingScore} onChange={(e) => setPassingScore(+e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                    </div>
                    <label className="flex items-end gap-2 text-sm pb-2">
                        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        Visible para alumnas
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                {questions.map((q, qi) => (
                    <div key={qi} className="bg-white border border-gray-100 rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3 gap-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Pregunta {qi + 1}</span>
                            <button onClick={() => removeQuestion(qi)} className="text-red-500 hover:bg-red-50 p-1 rounded" title="Eliminar pregunta">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <input
                            value={q.text}
                            onChange={(e) => updateQuestion(qi, 'text', e.target.value)}
                            placeholder="Escribe la pregunta..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3 font-bold text-[#1B3854]"
                        />
                        <div className="space-y-2 mb-3">
                            {q.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => updateOption(qi, oi, 'isCorrect', !opt.isCorrect)}
                                        className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                                            opt.isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 bg-white'
                                        }`}
                                        title={opt.isCorrect ? 'Correcta' : 'Marcar como correcta'}
                                    >
                                        {opt.isCorrect ? '✓' : ''}
                                    </button>
                                    <input
                                        value={opt.text}
                                        onChange={(e) => updateOption(qi, oi, 'text', e.target.value)}
                                        placeholder={`Opción ${oi + 1}`}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                    <button onClick={() => removeOption(qi, oi)} className="text-gray-400 hover:text-red-500 p-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => addOption(qi)} className="text-xs font-bold text-[#905361] hover:underline flex items-center gap-1">
                            <Plus size={12} /> Agregar opción
                        </button>
                        <div className="mt-3">
                            <input
                                value={q.explanation}
                                onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)}
                                placeholder="Explicación (opcional, se muestra al ver el resultado)"
                                className="w-full px-3 py-2 border border-gray-100 bg-gray-50 rounded-lg text-xs italic"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={addQuestion} className="mt-4 w-full py-3 border-2 border-dashed border-[#905361]/30 text-[#905361] rounded-2xl font-bold hover:bg-[#FDE5E5] flex items-center justify-center gap-2">
                <Plus size={16} /> Agregar pregunta {questions.length}/10
            </button>

            <div className="mt-6 flex justify-between gap-3">
                <button onClick={remove} className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold flex items-center gap-1">
                    <Trash2 size={14} /> Eliminar quiz
                </button>
                <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-[#905361] text-white rounded-xl hover:bg-[#5E2B35] font-bold flex items-center gap-2 disabled:opacity-60">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? "Guardando..." : "Guardar quiz"}
                </button>
            </div>
        </div>
    );
};

export default QuizEditor;
