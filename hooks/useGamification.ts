
import { useState, useEffect, useCallback } from 'react';
import { GamificationState, Toast, ShopItem } from '../types';
import { GAMIFICATION_STORAGE_KEY, REWARDS, LEVELS, BADGES, DEFAULT_THEME_ID } from '../constants';
import { isToday, isYesterday } from '../utils/dateUtils';

const defaultState: GamificationState = {
    levelIndex: 0,
    xp: 0,
    tokens: 0,
    activeTheme: DEFAULT_THEME_ID,
    unlockedThemes: [DEFAULT_THEME_ID],
    lastSessionDate: null,
    studyStreak: 0,
    unlockedBadges: [],
    pagesReadPerPdf: {},
    completedPagesPerPdf: {},
    totalCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
};

const useGamification = () => {
    const [state, setState] = useState<GamificationState>(() => {
        try {
            const savedState = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                // Ensure new fields have default values if loading old state
                return { 
                    ...defaultState, 
                    ...parsedState,
                    unlockedThemes: parsedState.unlockedThemes || [DEFAULT_THEME_ID],
                    activeTheme: parsedState.activeTheme || DEFAULT_THEME_ID,
                };
            }
        } catch (e) {
            console.error("Failed to load gamification state", e);
        }
        return defaultState;
    });

    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, icon?: string) => {
        const newToast = { id: Date.now(), message, icon };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => {
            setToasts(currentToasts => currentToasts.filter(t => t.id !== newToast.id));
        }, 3900);
    }, []);

    const checkBadges = useCallback((newState: GamificationState) => {
        const newlyUnlocked: string[] = [];

        for (const badge of BADGES) {
            if (newState.unlockedBadges.includes(badge.id)) continue;

            let shouldUnlock = false;
            switch (badge.id) {
                case 'FIRST_STEPS':
                    if (newState.totalCorrectAnswers >= 1) shouldUnlock = true;
                    break;
                case 'SHARP_STUDENT_10':
                    if (newState.totalCorrectAnswers >= 10) shouldUnlock = true;
                    break;
                case 'PAGE_TURNER_10':
                    if (Object.values(newState.pagesReadPerPdf).some(pages => new Set(pages).size >= 10)) shouldUnlock = true;
                    break;
                case 'BOOKWORM_50':
                    if (Object.values(newState.pagesReadPerPdf).some(pages => new Set(pages).size >= 50)) shouldUnlock = true;
                    break;
                case 'CONSISTENT_3':
                    if (newState.studyStreak >= 3) shouldUnlock = true;
                    break;
                case 'WEEKLY_WARRIOR_7':
                    if (newState.studyStreak >= 7) shouldUnlock = true;
                    break;
                case 'MASTER_MIND':
                    if (LEVELS[newState.levelIndex]?.name === 'Mestre') shouldUnlock = true;
                    break;
            }
            if (shouldUnlock) {
                newlyUnlocked.push(badge.id);
            }
        }

        if (newlyUnlocked.length > 0) {
            newlyUnlocked.forEach(badgeId => {
                const unlockedBadge = BADGES.find(b => b.id === badgeId);
                if (unlockedBadge) {
                    addToast(`Emblema Desbloqueado: ${unlockedBadge.name}`, unlockedBadge.icon);
                }
            });
            return { unlockedBadges: [...newState.unlockedBadges, ...newlyUnlocked] };
        }
        return {};
    }, [addToast]);

    const updateState = useCallback((updater: (prevState: GamificationState) => Partial<GamificationState>) => {
        setState(prevState => {
            const changes = updater(prevState);
            if (Object.keys(changes).length === 0) return prevState;

            const intermediateState = { ...prevState, ...changes };

            const nextLevel = LEVELS[intermediateState.levelIndex + 1];
            let newLevelIndex = intermediateState.levelIndex;
            if (nextLevel && intermediateState.xp >= nextLevel.minXp) {
                newLevelIndex = intermediateState.levelIndex + 1;
                addToast(`Você subiu para o Nível ${LEVELS[newLevelIndex].name}!`, LEVELS[newLevelIndex].icon);
            }

            const badgeUpdates = checkBadges({ ...intermediateState, levelIndex: newLevelIndex });

            return { ...intermediateState, levelIndex: newLevelIndex, ...badgeUpdates };
        });
    }, [checkBadges, addToast]);

    useEffect(() => {
        try {
            localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to save gamification state", e);
        }
    }, [state]);

    useEffect(() => {
        const today = new Date();
        const lastSession = state.lastSessionDate ? new Date(state.lastSessionDate) : null;

        if (!lastSession || !isToday(lastSession)) {
             let newStreak = 1;
             if (lastSession && isYesterday(lastSession)) {
                newStreak = state.studyStreak + 1;
             }
             updateState(() => ({
                lastSessionDate: today.toISOString(),
                studyStreak: newStreak,
             }));
             if (newStreak > 1) {
                addToast(`${newStreak} dias de sequência!`, '🔥');
             }
        }
    }, []);

    const logPageRead = useCallback((pdfId: string, pageNum: number) => {
        updateState(prev => {
            const pagesForPdf = prev.pagesReadPerPdf[pdfId] || [];
            if (!pagesForPdf.includes(pageNum)) {
                 // Only track the page for badges, no direct rewards.
                return {
                    pagesReadPerPdf: {
                        ...prev.pagesReadPerPdf,
                        [pdfId]: [...pagesForPdf, pageNum],
                    }
                };
            }
            return {};
        });
    }, [updateState]);

    const logPageCompleted = useCallback((pdfId: string, pageNum: number) => {
        updateState(prev => {
            const completedPages = prev.completedPagesPerPdf[pdfId] || [];
            if (!completedPages.includes(pageNum)) {
                addToast(`+${REWARDS.PAGE_COMPLETED.xp} XP, +${REWARDS.PAGE_COMPLETED.tokens} 🪙 por concluir a página!`, '⭐');
                return {
                    xp: prev.xp + REWARDS.PAGE_COMPLETED.xp,
                    tokens: prev.tokens + REWARDS.PAGE_COMPLETED.tokens,
                    completedPagesPerPdf: {
                        ...prev.completedPagesPerPdf,
                        [pdfId]: [...completedPages, pageNum],
                    },
                };
            }
            return {};
        });
    }, [updateState, addToast]);

    const logAnswer = useCallback((isCorrect: boolean) => {
        updateState(prev => {
            const updates: Partial<GamificationState> = {
                totalQuestionsAnswered: prev.totalQuestionsAnswered + 1
            };
            if (isCorrect) {
                updates.xp = prev.xp + REWARDS.CORRECT_ANSWER.xp;
                updates.tokens = prev.tokens + REWARDS.CORRECT_ANSWER.tokens;
                updates.totalCorrectAnswers = prev.totalCorrectAnswers + 1;
                addToast(`+${REWARDS.CORRECT_ANSWER.tokens} 🪙 por resposta correta!`, '✅');
            }
            return updates;
        });
    }, [updateState, addToast]);

    const purchaseTheme = useCallback((item: ShopItem) => {
        if (state.tokens < item.cost) {
            addToast("Tokens insuficientes!", '❌');
            return;
        }
        if (state.levelIndex < item.requiredLevel) {
            addToast(`Requer Nível ${LEVELS[item.requiredLevel].name}`, '🔒');
            return;
        }
        if (state.unlockedThemes.includes(item.id)) {
            addToast("Você já possui este tema!", '🤔');
            return;
        }

        updateState(prev => ({
            tokens: prev.tokens - item.cost,
            unlockedThemes: [...prev.unlockedThemes, item.id]
        }));
        addToast(`Tema ${item.name} comprado!`, item.icon);

    }, [state.tokens, state.levelIndex, state.unlockedThemes, updateState, addToast]);

    const setActiveTheme = useCallback((themeId: string) => {
        if(state.unlockedThemes.includes(themeId)) {
            updateState(() => ({ activeTheme: themeId }));
            addToast("Tema aplicado!", '🎨');
        }
    }, [state.unlockedThemes, updateState, addToast]);

    return { state, toasts, logPageRead, logAnswer, logPageCompleted, purchaseTheme, setActiveTheme, addToast };
};

export default useGamification;
