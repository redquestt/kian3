import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BoardStyle, GeneratedQuestion, ShopItem } from './types';
import { BOARD_STYLES, CORRECT_ANSWER_SOUND_URL, INCORRECT_ANSWER_SOUND_URL } from './constants';
import { generateQuestions, generateFlashcard } from './services/geminiService';
import Loader from './components/Loader';
import QuestionCard from './components/QuestionCard';
import { 
  BrainIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ZoomInIcon, 
  ZoomOutIcon, 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  FitToWidthIcon,
  TrophyIcon,
  XMarkIcon,
  FolderOpenIcon
} from './components/Icon';
import { playSound } from './utils/audioPlayer';
import useGamification from './hooks/useGamification';
import StatsModal from './components/StatsModal';
import ToastNotification from './components/ToastNotification';
import { isToday } from './utils/dateUtils';

declare const pdfjsLib: any;

const PROGRESS_STORAGE_KEY = 'concurseiroAtivoProgress';

interface ProgressData {
  totalPages: number;
  currentPage: number;
  scale: number;
  questionsByPage: Record<string, GeneratedQuestion[]>;
  sessionErrors: GeneratedQuestion[];
  sessionDate: string;
}

// --- DESKTOP UI COMPONENTS ---
const MenuBar: React.FC<{ onOpenFile: () => void }> = ({ onOpenFile }) => (
  <header className="bg-bg-secondary px-4 py-2 border-b border-border-color/50 flex items-center gap-4 flex-shrink-0">
    <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to">
      Kian
    </h1>
    <nav>
      <button onClick={onOpenFile} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
        Arquivo
      </button>
    </nav>
  </header>
);

const Toolbar: React.FC<any> = ({ 
  boardStyle, setBoardStyle, currentPage, totalPages, goToPreviousPage, goToNextPage,
  sessionErrors, handleReviewMistakes, isGeneratingQuestions, isReviewing,
  scale, handleZoomOut, handleZoomIn, handleFitToWidth, isFullscreen, handleToggleFullscreen
}) => (
  <div className="bg-bg-secondary/70 backdrop-blur-md border-b border-border-color/50 p-2 flex-shrink-0">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-3">
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="board-style" className="sr-only">Estilo da Banca</label>
            <select
              id="board-style"
              value={boardStyle}
              onChange={(e) => setBoardStyle(e.target.value as BoardStyle)}
              className="w-full sm:w-auto p-2 bg-bg-tertiary text-text-primary text-sm border border-border-color rounded-md focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition"
            >
              {BOARD_STYLES.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
         </div>
         <div className="flex items-center justify-center gap-3 flex-wrap order-first sm:order-none w-full sm:w-auto">
            <div className="flex items-center gap-2">
                <button onClick={goToPreviousPage} disabled={currentPage <= 1} className="p-1.5 rounded-md hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Página anterior">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="font-semibold text-sm tabular-nums">Página {currentPage} / {totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage >= totalPages} className="p-1.5 rounded-md hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Próxima página">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>

            {sessionErrors.length > 0 && (
              <button
                  onClick={handleReviewMistakes}
                  disabled={isGeneratingQuestions || isReviewing}
                  className="relative inline-flex items-center justify-center px-3 py-1 text-xs border-2 border-accent-error text-accent-error font-bold rounded-md hover:bg-accent-error/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-error disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:scale-100"
                  title="Gerar novas questões com base nos seus erros"
              >
                  {isReviewing ? (
                      <div className="w-4 h-4 mr-2 border-2 border-current border-solid rounded-full animate-spin border-t-transparent"></div>
                  ) : (
                    <>
                      <XMarkIcon className="w-4 h-4 mr-1.5" />
                      Revisão ({sessionErrors.length})
                    </>
                  )}
              </button>
            )}
         </div>
         <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-bg-tertiary rounded-md">
              <button onClick={handleZoomOut} className="p-1.5 rounded-md hover:bg-bg-interactive transition-colors" aria-label="Diminuir zoom">
                <ZoomOutIcon className="w-5 h-5" />
              </button>
              <span className="font-semibold tabular-nums w-12 text-center text-sm border-x border-border-color">{Math.round(scale * 100)}%</span>
              <button onClick={handleZoomIn} className="p-1.5 rounded-md hover:bg-bg-interactive transition-colors" aria-label="Aumentar zoom">
                <ZoomInIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center bg-bg-tertiary rounded-md">
              <button onClick={handleFitToWidth} className="p-1.5 rounded-md hover:bg-bg-interactive transition-colors" title="Ajustar à Largura" aria-label="Ajustar à Largura">
                <FitToWidthIcon className="w-5 h-5" />
              </button>
              <button onClick={handleToggleFullscreen} className="p-1.5 rounded-md hover:bg-bg-interactive transition-colors" title={isFullscreen ? "Sair da Tela Cheia" : "Entrar em Tela Cheia"} aria-label={isFullscreen ? "Sair da Tela Cheia" : "Entrar em Tela Cheia"}>
                {isFullscreen ? <ArrowsPointingInIcon className="w-5 h-5" /> : <ArrowsPointingOutIcon className="w-5 h-5" />}
              </button>
            </div>
         </div>
      </div>
  </div>
);

const StatusBar: React.FC<{ onOpenStats: () => void; tokens: number }> = ({ onOpenStats, tokens }) => (
  <footer className="bg-bg-secondary px-4 py-1.5 border-t border-border-color/50 flex items-center justify-end text-sm flex-shrink-0">
    <div className="flex items-center gap-4">
       <div className="flex items-center gap-1.5 font-bold text-yellow-400">
          <span className="text-lg">🪙</span>
          <span className="text-sm">{tokens}</span>
      </div>
      <button onClick={onOpenStats} className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors font-semibold">
        <TrophyIcon className="w-4 h-4" />
        <span className="text-xs">Jornada</span>
      </button>
    </div>
  </footer>
);

const WelcomeScreen: React.FC<{ onOpenFile: () => void, error: string | null }> = ({ onOpenFile, error }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to">
            Bem-vindo ao Kian
        </h2>
        <p className="mt-3 text-lg text-text-secondary max-w-xl mx-auto">
            Sua plataforma de estudo ativo. Transforme PDFs em uma experiência de aprendizado gamificada.
        </p>
        <button
            onClick={onOpenFile}
            className="mt-10 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to text-white font-bold rounded-lg hover:from-accent-gradient-from/80 hover:to-accent-gradient-to/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-primary transition-all duration-200 ease-in-out transform hover:scale-105"
        >
            <FolderOpenIcon className="w-6 h-6 mr-3" />
            Abrir PDF
        </button>
        {error && (
            <div className="mt-6 bg-accent-error/20 border border-accent-error text-accent-error px-4 py-3 rounded-md max-w-xl w-full text-sm" role="alert">
                <p>{error}</p>
            </div>
        )}
    </div>
);


// --- MAIN APP COMPONENT ---

const getPDFIdentifier = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;
const loadAllProgress = (): Record<string, ProgressData> => {
  try {
    const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return savedProgress ? JSON.parse(savedProgress) : {};
  } catch (e) {
    console.error("Failed to load progress from localStorage", e);
    return {};
  }
};
const saveAllProgress = (progress: Record<string, ProgressData>) => {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress to localStorage", e);
  }
};

const App: React.FC = () => {
  // ...existing code...
  // ...existing code...
  const [boardStyle, setBoardStyle] = useState<BoardStyle>(BoardStyle.CEBRASPE);
  const [error, setError] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(3);
  const [pdfIdentifier, setPdfIdentifier] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [questionsByPage, setQuestionsByPage] = useState<Record<string, GeneratedQuestion[]>>({});
  const [sessionErrors, setSessionErrors] = useState<GeneratedQuestion[]>([]);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const gamification = useGamification();

  useEffect(() => {
    const htmlElement = document.documentElement;
    const themeClasses = Array.from(htmlElement.classList).filter(cls => cls.startsWith('theme-'));
    htmlElement.classList.remove(...themeClasses);
    if (gamification.state.activeTheme) {
      htmlElement.classList.add(gamification.state.activeTheme);
    }
    if (!htmlElement.classList.contains('dark')) {
        htmlElement.classList.add('dark');
    }
  }, [gamification.state.activeTheme]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    if (renderTaskRef.current) renderTaskRef.current.cancel();
    setIsRenderingPage(true);

    const render = async () => {
        try {
            const page = await pdfDoc.getPage(currentPage);
            const viewport = page.getViewport({ scale });
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                const task = page.render({ canvasContext: context, viewport: viewport });
                renderTaskRef.current = task;
                await task.promise;
                renderTaskRef.current = null;
                if (pdfIdentifier) gamification.logPageRead(pdfIdentifier, currentPage);
            }
        } catch (err: any) {
            if (err.name !== 'RenderingCancelledException') {
              console.error("Error rendering page", err);
              setError("Não foi possível renderizar a página do PDF.");
            }
        } finally {
            setIsRenderingPage(false);
        }
    };
    render();
    return () => { if (renderTaskRef.current) renderTaskRef.current.cancel(); };
  }, [pdfDoc, currentPage, scale, pdfIdentifier, gamification.logPageRead]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
        try {
            const identifier = getPDFIdentifier(selectedFile);
            const allProgress = loadAllProgress();
            const savedState = allProgress[identifier];

            setSessionErrors( (savedState?.sessionDate && isToday(new Date(savedState.sessionDate))) ? (savedState.sessionErrors || []) : []);
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            // ...existing code...
            setQuestionsByPage(savedState?.questionsByPage || {});
            setScale(savedState?.scale || 1.0);
            setTotalPages(pdf.numPages);
            setCurrentPage(savedState?.currentPage || 1);
            setPdfIdentifier(identifier);
            setPdfDoc(pdf);
        } catch (e) {
            console.error("Error loading PDF", e);
            setError("Não foi possível carregar o arquivo PDF. Pode estar corrompido ou em um formato não suportado.");
            setPdfDoc(null);
        }
    } else if (selectedFile) {
        setError('Por favor, selecione um arquivo PDF válido.');
    }
    if(event.target) event.target.value = ''; // Reset file input
  }, []);

  useEffect(() => {
    if (pdfIdentifier && pdfDoc) {
      const allProgress = loadAllProgress();
      const newProgressForFile: ProgressData = {
  totalPages, currentPage, scale, questionsByPage, sessionErrors, sessionDate: new Date().toISOString()
      };
      saveAllProgress({ ...allProgress, [pdfIdentifier]: newProgressForFile });
    }
  }, [pdfIdentifier, totalPages, currentPage, scale, questionsByPage, pdfDoc, sessionErrors]);

  const extractTextFromCurrentPage = useCallback(async (): Promise<string> => {
    if (!pdfDoc) throw new Error("PDF não carregado.");
    const page = await pdfDoc.getPage(currentPage);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((s: any) => s.str).join(' ');
    if (pageText.trim().length < 50) throw new Error("Não foi possível extrair texto suficiente desta página para gerar questões.");
    return pageText;
  }, [pdfDoc, currentPage]);

  const questionsCacheKey = `${currentPage}-${boardStyle}`;

  const handleGenerateClick = useCallback(async (isRegenerating = false) => {
    if (!pdfDoc || !pdfIdentifier) { setError('Por favor, carregue um arquivo PDF primeiro.'); return; }
    if (!isRegenerating) gamification.logPageCompleted(pdfIdentifier, currentPage);
    
    setIsGeneratingQuestions(true);
    setError(null);
    try {
      const pageText = await extractTextFromCurrentPage();
      const existingQuestions = isRegenerating ? (questionsByPage[questionsCacheKey] || []) : [];
      const newQuestions = await generateQuestions(pageText, boardStyle, numQuestions, existingQuestions);
      setQuestionsByPage(prev => ({ ...prev, [questionsCacheKey]: [...existingQuestions, ...newQuestions] }));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  }, [pdfDoc, pdfIdentifier, currentPage, boardStyle, extractTextFromCurrentPage, questionsCacheKey, numQuestions, questionsByPage, gamification.logPageCompleted]);

  const handleAnswerQuestion = (questionIndex: number, answer: string) => {
    const currentQuestions = questionsByPage[questionsCacheKey] || [];
    const question = currentQuestions[questionIndex];
    if (!question || question.userAnswer) return;

    const isCorrect = ((answer, correctAnswer) => {
        if (!answer) return false;
        const cleanedA = answer.trim().toLowerCase();
        const cleanedCA = correctAnswer.trim().toLowerCase();
        if (cleanedA === cleanedCA) return true;
        return (cleanedA === 'certo' && cleanedCA === 'correto') || (cleanedA === 'correto' && cleanedCA === 'certo');
    })(answer, question.correct_answer);

    playSound(isCorrect ? CORRECT_ANSWER_SOUND_URL : INCORRECT_ANSWER_SOUND_URL);
    gamification.logAnswer(isCorrect);
    
    if (!isCorrect) {
      setSessionErrors(prevErrors => {
          if (!prevErrors.some(err => err.question_text === question.question_text)) return [...prevErrors, question];
          return prevErrors;
      });
    }
    setQuestionsByPage(prev => {
        const pageQuestions = [...(prev[questionsCacheKey] || [])];
        pageQuestions[questionIndex] = { ...pageQuestions[questionIndex], userAnswer: answer };
        return { ...prev, [questionsCacheKey]: pageQuestions };
    });
  };

  const handleReviewMistakes = useCallback(async () => {
    if (sessionErrors.length === 0 || !pdfIdentifier) return;
    setIsReviewing(true);
    setError(null);
    try {
        const reviewPromises = sessionErrors.map(errorQuestion => 
            generateQuestions(errorQuestion.justification_anchor, boardStyle, 1, [errorQuestion])
            .catch(err => { console.error(`Failed to generate review question`, err); return []; })
        );
        const newReviewQuestions = (await Promise.all(reviewPromises)).flat();

        if (newReviewQuestions.length > 0) {
            setQuestionsByPage(prev => ({ ...prev, [questionsCacheKey]: [...(prev[questionsCacheKey] || []), ...newReviewQuestions] }));
        }
        setSessionErrors([]);
    } catch (err) {
      console.error("Error during mistake review:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao gerar a revisão.");
    } finally {
      setIsReviewing(false);
    }
  }, [sessionErrors, boardStyle, pdfIdentifier, questionsCacheKey, questionsByPage]);

  const handleGenerateFlashcard = useCallback(async (questionIndex: number) => {
    const pageQuestions = questionsByPage[questionsCacheKey] || [];
    const question = pageQuestions[questionIndex];
    if (!question || question.flashcard || question.isGeneratingFlashcard) return;

    setQuestionsByPage(prev => {
      const q = [...(prev[questionsCacheKey] || [])]; q[questionIndex] = { ...q[questionIndex], isGeneratingFlashcard: true };
      return { ...prev, [questionsCacheKey]: q };
    });
    try {
      const flashcard = await generateFlashcard(question.question_text, question.justification_anchor);
      setQuestionsByPage(prev => {
        const q = [...(prev[questionsCacheKey] || [])]; q[questionIndex] = { ...q[questionIndex], flashcard, isGeneratingFlashcard: false };
        return { ...prev, [questionsCacheKey]: q };
      });
      gamification.addToast('Flashcard criado com sucesso!', '⚡');
    } catch (err) {
      console.error("Failed to generate flashcard", err);
      gamification.addToast(err instanceof Error ? `Falha: ${err.message}` : 'Falha ao gerar flashcard.', '❌');
      setQuestionsByPage(prev => {
        const q = [...(prev[questionsCacheKey] || [])]; q[questionIndex] = { ...q[questionIndex], isGeneratingFlashcard: false };
        return { ...prev, [questionsCacheKey]: q };
      });
    }
  }, [questionsCacheKey, questionsByPage, gamification.addToast]);

  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const handleZoomIn = () => setScale(prev => prev + 0.25);
  const handleZoomOut = () => setScale(prev => Math.max(0.25, prev - 0.25));
  const handleFitToWidth = useCallback(async () => {
    if (!pdfDoc || !canvasContainerRef.current) return;
    try {
        const page = await pdfDoc.getPage(currentPage);
        const newScale = (canvasContainerRef.current.offsetWidth - 20) / page.getViewport({ scale: 1.0 }).width;
        setScale(newScale);
    } catch (e) { console.error("Error calculating fit-to-width", e); }
  }, [pdfDoc, currentPage]);
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(err => setError(`Error: ${err.message}`)); }
    else { if (document.exitFullscreen) document.exitFullscreen(); }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);
  
  const currentQuestions = questionsByPage[questionsCacheKey] || [];

  return (
    <div className="fixed inset-0 p-4 sm:p-8 md:p-10 lg:p-16 flex items-center justify-center font-sans">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
        <ToastNotification toasts={gamification.toasts} />
        <StatsModal 
          isOpen={isStatsModalOpen} 
          onClose={() => setIsStatsModalOpen(false)}
          gamificationState={gamification.state}
          onPurchaseTheme={gamification.purchaseTheme as (item: ShopItem) => void}
          onSelectTheme={gamification.setActiveTheme}
        />

        <div className="w-full h-full bg-bg-primary rounded-xl shadow-2xl flex flex-col overflow-hidden border border-border-color/50 text-text-primary">
            <MenuBar onOpenFile={() => fileInputRef.current?.click()} />
            {pdfDoc && <Toolbar 
              boardStyle={boardStyle} setBoardStyle={setBoardStyle}
              currentPage={currentPage} totalPages={totalPages} goToPreviousPage={goToPreviousPage} goToNextPage={goToNextPage}
              sessionErrors={sessionErrors} handleReviewMistakes={handleReviewMistakes} isGeneratingQuestions={isGeneratingQuestions} isReviewing={isReviewing}
              scale={scale} handleZoomOut={handleZoomOut} handleZoomIn={handleZoomIn} handleFitToWidth={handleFitToWidth}
              isFullscreen={isFullscreen} handleToggleFullscreen={handleToggleFullscreen}
            />}
            
            <main className="flex-grow flex flex-col overflow-y-auto bg-black/20">
              {!pdfDoc ? (
                  <WelcomeScreen onOpenFile={() => fileInputRef.current?.click()} error={error} />
              ) : (
                <div className="flex-grow p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                    <div ref={canvasContainerRef} className="relative bg-black/30 rounded-lg overflow-auto flex justify-center items-start min-h-[400px] lg:min-h-0">
                      {isRenderingPage && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
                              <div className="w-10 h-10 border-4 border-accent-primary border-solid rounded-full animate-spin border-t-transparent"></div>
                          </div>
                      )}
                      <canvas ref={canvasRef} className={`shadow-lg transition-opacity duration-300 ${isRenderingPage ? 'opacity-30' : 'opacity-100'}`} />
                    </div>

                    <div className="lg:overflow-y-auto space-y-6">
                       <div className="bg-bg-secondary p-4 rounded-lg space-y-3 text-center">
                          <div className="flex justify-center items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2">
                                <label htmlFor="num-questions" className="font-medium text-sm text-text-secondary">Questões:</label>
                                <select id="num-questions" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} disabled={isGeneratingQuestions || isReviewing} className="p-2 text-sm bg-bg-tertiary text-text-primary border border-border-color rounded-md focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition disabled:opacity-70">
                                  {[1,2,3,4,5,7,10].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                              </div>
                              <button onClick={() => handleGenerateClick(false)} disabled={isGeneratingQuestions || currentQuestions.length > 0 || isReviewing} className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to text-white font-bold text-sm rounded-md hover:from-accent-gradient-from/80 hover:to-accent-gradient-to/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-primary disabled:from-bg-tertiary disabled:to-bg-interactive disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 disabled:scale-100">
                                <BrainIcon className="w-5 h-5 mr-2" />
                                {currentQuestions.length > 0 ? 'Questões Geradas' : 'Página Concluída: Gerar Questões'}
                              </button>
                          </div>
                          {error && !isGeneratingQuestions && (
                            <div className="bg-accent-error/20 border border-accent-error text-accent-error p-3 rounded-md text-left text-xs" role="alert">
                              <p className="font-bold">Erro</p>
                              <p>{error}</p>
                            </div>
                          )}
                        </div>

                        {(isGeneratingQuestions || isReviewing) && <Loader message={isReviewing ? 'Revisando seus erros...' : 'Gerando questões...'} />}
                        
                        {currentQuestions.length > 0 && (
                          <div className="space-y-4 animate-fade-in">
                            {currentQuestions.map((q, index) => (
                                <QuestionCard key={`${currentPage}-${boardStyle}-${q.question_text.slice(0, 10)}-${index}`} question={q} index={index} onAnswer={(answer) => handleAnswerQuestion(index, answer)} onGenerateFlashcard={() => handleGenerateFlashcard(index)} />
                            ))}
                            <div className="pt-2 text-center">
                              <button onClick={() => handleGenerateClick(true)} disabled={isGeneratingQuestions || isReviewing} className="inline-flex items-center justify-center px-5 py-2 bg-accent-secondary text-white font-bold text-sm rounded-md hover:bg-accent-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-secondary disabled:bg-bg-tertiary disabled:cursor-not-allowed transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:scale-100">
                                <BrainIcon className="w-4 h-4 mr-2" />
                                {isGeneratingQuestions ? 'Gerando mais...' : 'Quero outras questões'}
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                </div>
              )}
            </main>
            
            {pdfDoc && <StatusBar onOpenStats={() => setIsStatsModalOpen(true)} tokens={gamification.state.tokens} />}
        </div>
    </div>
  );
};

export default App;
