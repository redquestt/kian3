declare global {
    interface ImportMeta {
        env: {
            VITE_GEMINI_API_KEY?: string;
        };
    }
}

import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BoardStyle, GeneratedQuestion } from '../types';
import { MASTER_PROMPT_TEMPLATE, BOARD_STYLE_INSTRUCTIONS_MAP, FLASHCARD_PROMPT_TEMPLATE } from '../constants';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const getResponseSchema = (boardStyle: BoardStyle) => {
    const properties: any = {
        question_text: {
            type: Type.STRING,
            description: 'O enunciado completo da questão.',
        },
        correct_answer: {
            type: Type.STRING,
            description: boardStyle === BoardStyle.CEBRASPE 
                ? "A resposta correta, que deve ser 'Certo' ou 'Errado'."
                : 'A letra da alternativa correta (e.g., "A", "B").',
        },
        justification_anchor: {
            type: Type.STRING,
            description: 'O trecho exato e contínuo do texto original que justifica a resposta.',
        },
    };

    if (boardStyle !== BoardStyle.CEBRASPE) {
        properties.options = {
            type: Type.OBJECT,
            description: 'Um objeto com as alternativas de múltipla escolha.',
            properties: {
                A: { type: Type.STRING },
                B: { type: Type.STRING },
                C: { type: Type.STRING },
                D: { type: Type.STRING },
                E: { type: Type.STRING },
            }
        };
    }
    
    return {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: properties,
        },
    };
};

export const generateQuestions = async (
    pageContent: string,
    boardStyle: BoardStyle,
    numQuestions: number,
    existingQuestions: GeneratedQuestion[] = []
): Promise<GeneratedQuestion[]> => {
    
    if (!apiKey) {
        console.error("API key for Gemini is not configurada.");
        return Promise.reject("Chave de API não encontrada. Por favor, configure VITE_GEMINI_API_KEY no .env.");
    }
    
    const boardInstructions = BOARD_STYLE_INSTRUCTIONS_MAP[boardStyle];

    const existingQuestionsSection = existingQuestions.length > 0
        ? `<existing_questions>
A seguir estão os enunciados de questões que já foram geradas para este texto. Crie questões completamente novas e diferentes destas. Não repita os mesmos conceitos ou abordagens.
${JSON.stringify(existingQuestions.map(q => q.question_text))}
</existing_questions>`
        : '';
    
    const prompt = MASTER_PROMPT_TEMPLATE
        .replace('{{BOARD_STYLE_INSTRUCTIONS}}', boardInstructions)
        .replace('{{EXISTING_QUESTIONS_SECTION}}', existingQuestionsSection)
        .replace('{{PAGE_CONTENT}}', pageContent)
        .replace(/{{NUM_QUESTIONS}}/g, String(numQuestions));

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: getResponseSchema(boardStyle),
                temperature: 0.4, // Slightly increased for more variety in regeneration
                topK: 40,
                topP: 0.95,
            }
        });

    const jsonText = (response.text ?? '').trim();
        const generatedQuestions = JSON.parse(jsonText);
        
        if (!Array.isArray(generatedQuestions)) {
            throw new Error("A API não retornou um array JSON válido.");
        }

        return generatedQuestions as GeneratedQuestion[];

    } catch (error) {
        console.error("Erro ao gerar questões:", error);
        let errorMessage = "Ocorreu um erro desconhecido ao gerar as questões.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Falha ao gerar questões. Motivo: ${errorMessage}`);
    }
};

export const generateFlashcard = async (
    questionText: string,
    justificationAnchor: string
): Promise<{ front: string; back:string }> => {
    if (!apiKey) {
        throw new Error("Chave de API não encontrada. Configure VITE_GEMINI_API_KEY no .env.");
    }
    
    const prompt = FLASHCARD_PROMPT_TEMPLATE
        .replace('{{QUESTION_TEXT}}', questionText)
        .replace('{{JUSTIFICATION_ANCHOR}}', justificationAnchor);

    const schema = {
        type: Type.OBJECT,
        properties: {
            front: { type: Type.STRING, description: "A frente do flashcard (pergunta)." },
            back: { type: Type.STRING, description: "O verso do flashcard (resposta)." }
        },
        required: ["front", "back"]
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.2,
            }
        });

    const jsonText = (response.text ?? '').trim();
        const flashcardData = JSON.parse(jsonText);

        if (!flashcardData.front || !flashcardData.back) {
            throw new Error("A API não retornou um flashcard com 'front' e 'back'.");
        }

        return flashcardData as { front: string; back: string };

    } catch (error) {
        console.error("Erro ao gerar flashcard:", error);
        let errorMessage = "Ocorreu um erro desconhecido ao gerar o flashcard.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Falha ao gerar flashcard. Motivo: ${errorMessage}`);
    }
};
