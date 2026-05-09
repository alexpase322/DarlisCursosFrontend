import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Award, CheckCircle2, XCircle, Loader2, RotateCw } from "lucide-react";

const QuizPage = () => {
    const { id: courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: Set(optionIds) }
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { attempt, reveal }

    useEffect(() => { fetchQuiz(); }, [courseId]);

    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/quizzes/course/${courseId}`);
            setQuiz(data.quiz);
            setAttempts(data.attempts || []);
            setAnswers({});
            setResult(null);
        } catch (err) {
            if (err.response?.status === 404) {
                toast.error("Este curso aún no tiene examen");
                navigate(`/course/${courseId}`);
            } else {
                toast.error("Error al cargar el examen");
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleOption = (questionId, optionId) => {
        if (result) return;
        setAnswers(prev => {
            const next = { ...prev };
            const set = new Set(next[questionId] || []);
            // Detectar si la pregunta tiene 1 sola correcta o varias.
            const q = quiz.questions.find(qq => qq._id === questionId);
            const isMulti = false; // Para simplificar UX: tratamos cada pregunta como single-choice por defecto.
            if (isMulti) {
                if (set.has(optionId)) set.delete(optionId); else set.add(optionId);
            } else {
                set.clear();
                set.add(optionId);
            }
            next[questionId] = set;
            return next;
        });
    };

    const submit = async () => {
        if (submitting) return;
        // Validar todas respondidas
        const missing = quiz.questions.filter(q => !(answers[q._id] && answers[q._id].size > 0));
        if (missing.length > 0) {
            toast.error(`Te faltan ${missing.length} pregunta(s) por responder`);
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                answers: quiz.questions.map(q => ({
                    questionId: q._id,
                    selectedOptionIds: [...(answers[q._id] || [])]
                }))
            };
            const { data } = await axios.post(`/quizzes/${quiz._id}/attempts`, payload);
            setResult(data);
            if (data.attempt.passed) {
                toast.success(`¡Aprobaste! ${data.attempt.scorePercent}%`);
            } else {
                toast.error(`Obtuviste ${data.attempt.scorePercent}%. Necesitas ${data.attempt.passingScore}%`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al enviar");
        } finally {
            setSubmitting(false);
        }
    };

    const retry = () => {
        setResult(null);
        setAnswers({});
        fetchQuiz();
    };

    if (loading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>;
    }
    if (!quiz) return null;

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
                <Link to={`/course/${courseId}`} className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854]">{quiz.title}</h1>
                    <p className="text-gray-500 text-sm">
                        {quiz.questions.length} preguntas · necesitas {quiz.passingScore}% para aprobar
                    </p>
                </div>
            </div>

            {quiz.description && (
                <div className="bg-[#FDE5E5]/40 border border-[#FDE5E5] rounded-2xl p-4 mb-4 text-sm text-[#1B3854]">
                    {quiz.description}
                </div>
            )}

            {attempts.length > 0 && !result && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Intentos anteriores</p>
                    <div className="flex flex-wrap gap-2">
                        {attempts.map(a => (
                            <span key={a._id} className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {a.scorePercent}% {a.passed ? '✓' : '✗'}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {result && (
                <div className={`rounded-2xl p-6 mb-6 text-center ${
                    result.attempt.passed
                        ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300'
                        : 'bg-gradient-to-br from-red-50 to-amber-50 border-2 border-amber-300'
                }`}>
                    <div className="flex justify-center mb-3">
                        {result.attempt.passed
                            ? <Award size={48} className="text-emerald-600" />
                            : <XCircle size={48} className="text-red-500" />}
                    </div>
                    <p className="text-3xl font-bold text-[#1B3854]">{result.attempt.scorePercent}%</p>
                    <p className="text-sm text-gray-600 mt-1">
                        {result.attempt.correctCount} de {result.attempt.totalQuestions} correctas
                    </p>
                    <p className={`text-base font-bold mt-2 ${result.attempt.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                        {result.attempt.passed ? '¡Aprobaste el examen! Curso completado.' : `Necesitas al menos ${result.attempt.passingScore}%. Puedes intentarlo de nuevo.`}
                    </p>
                    <div className="flex justify-center gap-3 mt-5">
                        <button onClick={retry} className="flex items-center gap-2 px-5 py-2.5 bg-[#905361] text-white rounded-xl hover:bg-[#5E2B35] font-bold">
                            <RotateCw size={16} /> {result.attempt.passed ? 'Hacer de nuevo' : 'Reintentar'}
                        </button>
                        <Link to={`/course/${courseId}`} className="px-5 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 font-bold">
                            Volver al curso
                        </Link>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {quiz.questions.map((q, i) => {
                    const selected = answers[q._id] || new Set();
                    const reveal = result?.reveal?.find(r => String(r.questionId) === String(q._id));
                    const correctIds = new Set((reveal?.correctOptionIds || []).map(String));
                    return (
                        <div key={q._id} className="bg-white border border-gray-100 rounded-2xl p-5">
                            <p className="font-bold text-[#1B3854] mb-3">
                                <span className="text-[#905361] mr-2">{i + 1}.</span>{q.text}
                            </p>
                            <div className="space-y-2">
                                {q.options.map(opt => {
                                    const isSelected = selected.has(opt._id);
                                    const isCorrect = correctIds.has(String(opt._id));
                                    let cls = "border-gray-200 bg-white hover:bg-gray-50";
                                    if (result) {
                                        if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
                                        else if (isSelected && !isCorrect) cls = "border-red-300 bg-red-50";
                                        else cls = "border-gray-200 bg-gray-50/50 opacity-60";
                                    } else if (isSelected) {
                                        cls = "border-[#905361] bg-[#FDE5E5]";
                                    }
                                    return (
                                        <button
                                            key={opt._id}
                                            type="button"
                                            disabled={!!result}
                                            onClick={() => toggleOption(q._id, opt._id)}
                                            className={`w-full text-left px-4 py-3 border-2 rounded-xl text-sm flex items-center gap-3 transition ${cls}`}
                                        >
                                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                isSelected || (result && isCorrect) ? 'border-[#905361] bg-[#905361]' : 'border-gray-300'
                                            }`}>
                                                {(isSelected || (result && isCorrect)) && <span className="w-2 h-2 bg-white rounded-full" />}
                                            </span>
                                            <span className={result && isCorrect ? 'font-bold text-emerald-800' : ''}>{opt.text}</span>
                                            {result && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 ml-auto" />}
                                            {result && isSelected && !isCorrect && <XCircle size={16} className="text-red-500 ml-auto" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {result && reveal?.explanation && (
                                <p className="mt-3 text-xs text-gray-500 italic bg-gray-50 p-2 rounded">{reveal.explanation}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {!result && (
                <div className="mt-6 flex justify-end gap-3">
                    <Link to={`/course/${courseId}`} className="px-5 py-3 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 font-bold">
                        Cancelar
                    </Link>
                    <button
                        onClick={submit}
                        disabled={submitting}
                        className="px-6 py-3 bg-[#905361] text-white rounded-xl hover:bg-[#5E2B35] font-bold flex items-center gap-2 disabled:opacity-60"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Award size={18} />}
                        {submitting ? 'Enviando...' : 'Entregar examen'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
