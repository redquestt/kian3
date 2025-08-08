
import { BoardStyle, Level, Badge, BadgeRarity, ShopItem } from './types';

export const BOARD_STYLES: BoardStyle[] = [
  BoardStyle.CEBRASPE,
  BoardStyle.FGV,
  BoardStyle.INEP,
  BoardStyle.FUVEST,
];

export const CORRECT_ANSWER_SOUND_URL = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXAzNAARVFhYWAAAAAUAAANtaW5vcl92ZXJzaW9uADAAE1RZRVIAAAAEAAADMjAxNBUNDA3//vRkAAADYkAAAAAADAAAP0AAABpAAAAgAAAAAACYpITU5LjY0AICBwIAAAAAA//vRkYgAADYkAAAAAADAAAP0AAABpAAAAgAAAAAACYpITU5LjY_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_';
export const INCORRECT_ANSWER_SOUND_URL = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXAzNAARVFhYWAAAAAUAAANtaW5vcl92ZXJzaW9uADAAE1RZRVIAAAAEAAADMjAxNBUNDA7//vRkAAAGYA0AAAAAADAAAP1AAADRAAAgAAAAAACYpITU5LjY0AICBwIAAAAAA//vRkYgAGYA0AAAAAADAAAP1AAADRAAAgAAAAAACYpITU5LjY0AICBwIAAAAAA//vRkZgAGYA0AAAAAADAAAP1AAADRAAAgAAAAAACYpITU5LjY0AICBwIAAAAAA//vRlJAAAAAGwAAADRAAAgAAAAAACYpITU5LjY0AAUDwIAAdGVuZwAAAAgAAAADaXNvNjM5LTI';

// --- GAMIFICATION CONSTANTS ---

export const GAMIFICATION_STORAGE_KEY = 'concurseiroAtivoGamification';
export const DEFAULT_THEME_ID = 'theme-kian-dark';

export const REWARDS = {
    PAGE_COMPLETED: { xp: 5, tokens: 20 }, // When questions are generated
    CORRECT_ANSWER: { xp: 10, tokens: 15 },
};

export const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'theme-steampunk',
        name: 'Tema Steampunk',
        description: 'Engrenagens, bronze e vapor. Para o estudioso com um toque de inventor.',
        cost: 1000,
        requiredLevel: 4,
        icon: '⚙️',
    },
    {
        id: 'theme-cyberpunk',
        name: 'Tema Cyberpunk',
        description: 'Luzes de neon, cromo e noites chuvosas. Estude no futuro distópico.',
        cost: 1500,
        requiredLevel: 5,
        icon: '🌃',
    },
];


export const LEVELS: Level[] = [
    { name: "Noviço", minXp: 0, icon: "🔰" },
    { name: "Aprendiz", minXp: 100, icon: "🧠" },
    { name: "Estudante", minXp: 250, icon: "📚" },
    { name: "Veterano", minXp: 500, icon: "🧑‍🏫" },
    { name: "Especialista", minXp: 1000, icon: "💡" },
    { name: "Mestre", minXp: 2000, icon: "🏆" },
    { name: "Sábio", minXp: 5000, icon: "🦉" },
];

export const BADGES: Badge[] = [
    {
        id: 'FIRST_STEPS',
        name: 'Primeiros Passos',
        description: 'Responda sua primeira questão corretamente.',
        icon: '👟',
        rarity: BadgeRarity.Common,
    },
    {
        id: 'SHARP_STUDENT_10',
        name: 'Estudante Afiado',
        description: 'Acerte 10 questões.',
        icon: '🎯',
        rarity: BadgeRarity.Common,
    },
     {
        id: 'PERFECT_10',
        name: 'Sequência Perfeita',
        description: 'Acerte 10 questões seguidas.',
        icon: '🔥',
        rarity: BadgeRarity.Rare,
    },
    {
        id: 'PAGE_TURNER_10',
        name: 'Vira-Páginas',
        description: 'Leia 10 páginas em um único PDF.',
        icon: '📖',
        rarity: BadgeRarity.Common,
    },
    {
        id: 'BOOKWORM_50',
        name: 'Leitor Voraz',
        description: 'Leia 50 páginas em um único PDF.',
        icon: '📚',
        rarity: BadgeRarity.Rare,
    },
    {
        id: 'CONSISTENT_3',
        name: 'Consistência é a Chave',
        description: 'Estude por 3 dias seguidos.',
        icon: '🗓️',
        rarity: BadgeRarity.Common,
    },
    {
        id: 'WEEKLY_WARRIOR_7',
        name: 'Guerreiro Semanal',
        description: 'Mantenha uma sequência de 7 dias de estudo.',
        icon: '⚔️',
        rarity: BadgeRarity.Rare,
    },
    {
        id: 'MASTER_MIND',
        name: 'Mente de Mestre',
        description: 'Alcance o nível Mestre.',
        icon: '👑',
        rarity: BadgeRarity.Epic,
    },
];

// --- PROMPT TEMPLATES ---

export const MASTER_PROMPT_TEMPLATE = `
<system_instructions>
Você é um especialista em avaliação educacional e um mestre na elaboração de questões para exames de alto impacto no Brasil. Sua tarefa é analisar o texto fornecido e gerar um conjunto de questões no estilo da banca examinadora especificada, seguindo um processo de raciocínio sofisticado e deliberado, inspirado na "Arquitetônica da Confusão". Seu objetivo não é criar "pegadinhas" aleatórias, mas sim testes que medem profundidade de conhecimento, vigilância cognitiva e raciocínio crítico.
</system_instructions>

<board_style_instructions>
{{BOARD_STYLE_INSTRUCTIONS}}
</board_style_instructions>

<general_methodology_instructions>
Para criar questões que efetivamente discriminem candidatos de alta e baixa proficiência, utilize as seguintes técnicas metodológicas:
- **Hierarquia Cognitiva:** Formule questões que exijam diferentes níveis de pensamento (Identificar -> Comparar -> Relacionar -> Inferir -> Propor). Construa distratores (alternativas incorretas) que correspondam a níveis cognitivos inferiores ou a erros conceituais comuns e plausíveis. O candidato deve escolher a *melhor* e *mais completa* resposta, não apenas uma resposta possível.
- **Ancoragem no Texto:** Cada questão, resposta correta e justificação deve ser rigorosamente fundamentada no <source_text>. A 'justification_anchor' deve ser uma citação direta e contínua, não uma paráfrase, que prove inequivocamente a validade da resposta.
- **Profundidade sobre Abrangência:** Em vez de cobrir superficialmente muitos tópicos, priorize a extração de múltiplos conceitos, fatos ou princípios distintos de um mesmo parágrafo denso em informação, se possível. O objetivo é explorar a profundidade do conteúdo.
</general_methodology_instructions>

{{EXISTING_QUESTIONS_SECTION}}

<source_text>
{{PAGE_CONTENT}}
</source_text>

<task_instructions>
Analise o <source_text> e gere um total de {{NUM_QUESTIONS}} questões que sigam estritamente as <board_style_instructions> e a <general_methodology_instructions>.

IMPORTANTE: Se a seção <existing_questions> for fornecida, você DEVE garantir que as novas questões sejam conceitualmente diferentes das existentes. Não repita os mesmos fatos ou abordagens. Explore outras partes do texto ou outros ângulos dos mesmos tópicos.

Siga este Processo de Raciocínio (Cadeia de Pensamento):
1.  **Leitura Estratégica:** Leia o <source_text> para entender os conceitos centrais e identificar os parágrafos ou seções mais densos em informação.
2.  **Identificação de Alvos:** Para CADA uma das {{NUM_QUESTIONS}} questões a serem geradas:
    a. Identifique um conceito, fato, princípio ou nuance testável e significativo que ainda não tenha sido abordado nas <existing_questions>.
    b. **Aplicação da Metodologia da Banca:** Formule o enunciado e as alternativas (se aplicável) aplicando rigorosamente as técnicas descritas nas <board_style_instructions>. A questão deve ser um reflexo autêntico da "personalidade" da banca.
    c. Determine a resposta correta com base no texto.
    d. Localize e extraia a frase ou trecho contínuo e exato do <source_text> que serve como prova direta para a resposta ('justification_anchor'). A precisão aqui é crucial.
3.  **Formatação Final:** Formate a saída como um array JSON contendo {{NUM_QUESTIONS}} objetos. Cada objeto deve seguir o schema definido, contendo as chaves: "question_text", "options" (um objeto JSON se for múltipla escolha, omitido para Certo/Errado), "correct_answer" (a string 'Certo' ou 'Errado' para Cebraspe, ou a letra da alternativa correta para outras bancas), e "justification_anchor".
</task_instructions>
`;

export const FLASHCARD_PROMPT_TEMPLATE = `
<system_instructions>
Você é um assistente de estudos especializado em criar flashcards eficazes para memorização. Sua tarefa é transformar uma questão de concurso complexa e seu contexto em um flashcard simples, direto e conceitual.
</system_instructions>

<context>
A seguir estão uma questão de concurso e o trecho do texto original que justifica a resposta correta.
- **Questão Original:** "{{QUESTION_TEXT}}"
- **Justificativa (Texto Fonte):** "{{JUSTIFICATION_ANCHOR}}"
</context>

<task_instructions>
Baseado no <context>, crie um único flashcard para ajudar um estudante a memorizar o conceito principal. O flashcard deve ter uma frente (uma pergunta direta ou um termo-chave) e um verso (a resposta concisa e clara).

**Regras:**
1.  **Frente (front):** Deve ser uma pergunta curta e direta que capture a essência do tópico. Evite o formato da questão original (múltipla escolha ou Certo/Errado).
2.  **Verso (back):** Deve ser a resposta direta e objetiva para a pergunta da frente, extraída ou resumida da justificativa.
3.  **Conceitual e Sucinto:** O objetivo é a memorização rápida, não um teste complexo.

**Formato da Saída:**
Formate a saída como um único objeto JSON com as chaves "front" e "back".
</task_instructions>
`;

export const BOARD_STYLE_INSTRUCTIONS_MAP: Record<BoardStyle, string> = {
  [BoardStyle.CEBRASPE]: `**Filosofia Central:** Testar precisão, atenção e vigilância cognitiva. Cada item é um teste de alto risco.
**Instrução Crucial:** Ao gerar as questões, busque um equilíbrio entre assertivas com gabarito "Certo" e "Errado". Não favoreça um tipo sobre o outro.
**Formato:** Julgamento Certo/Errado.
**Técnicas de Elaboração:**
1.  **Para assertivas 'Certo':** Crie uma paráfrase fiel e precisa de uma afirmação contida no texto. A assertiva deve ser uma reafirmação correta de um conceito, fato ou regra do texto, mas com uma redação ligeiramente diferente para testar a compreensão, não a memorização pura.
2.  **Para assertivas 'Errado' (Técnicas de Distorção Sutil):**
    a. **Inversão Semântica:** Crie uma assertiva que parece correta, mas é invalidada pela inserção sutil de uma negação ("não", "jamais"), uma exceção ("exceto", "salvo"), ou pela troca de uma palavra-chave por seu antônimo (ex: "imprescindível" por "prescindível").
    b. **Generalização/Restrição Indevida:** Altere um quantificador. Se o texto fala "alguns casos", a assertiva pode generalizar para "todos os casos", ou vice-versa, tornando-a incorreta.
    c. **Sutilezas Gramaticais:** Explore a função lógica da pontuação ou a recategorização de palavras para criar uma interpretação errônea.
3.  **Interdisciplinaridade Densa:** Construa uma única e concisa assertiva que exija a integração de conhecimentos de diferentes áreas para ser julgada corretamente. Esta técnica pode ser usada para criar tanto assertivas 'Certas' quanto 'Erradas'.
**Saída:** A chave 'correct_answer' deve ser a string 'Certo' ou 'Errado'.`,
  [BoardStyle.FGV]: `**Filosofia Central:** Testar resistência cognitiva, raciocínio crítico sob pressão e interpretação de nuances conceituais e sintáticas.
**Formato:** Múltipla Escolha (A-E).
**Técnicas de Elaboração:**
1.  **Enunciado Labiríntico:** Crie um enunciado longo e narrativo (estudo de caso ou situação hipotética) que contenha detalhes contextuais que precisam ser filtrados pelo candidato. A primeira tarefa é separar o "sinal" do "ruído".
2.  **Inversão Sintática com Alteração de Sentido:** Utilize a ordem das palavras como um mecanismo de teste. Exemplo clássico: a diferença semântica entre "grande reportagem" (notável, de qualidade) e "reportagem grande" (extensa, longa).
3.  **Troca de Conceitos por Sinônimos Aparentes:** Use alternativas que trocam conceitos por termos com nuances distintas, testando a precisão lexical. Exemplo: a diferença entre "vários motivos" (quantidade) e "motivos vários" (diversidade).
4.  **Distratores Plausíveis:** As alternativas incorretas devem representar interpretações equivocadas, mas plausíveis, do estudo de caso apresentado no enunciado.
**Saída:** A chave 'correct_answer' deve ser a letra da alternativa correta (A, B, C, D ou E).`,
  [BoardStyle.INEP]: `**Filosofia Central:** Avaliar competências e habilidades, não a simples memorização, usando a Teoria de Resposta ao Item (TRI). Testar o "pensamento hierárquico".
**Formato:** Múltipla Escolha (A-E).
**Técnicas de Elaboração:**
1.  **Situação-Problema:** Apresente um texto-base (que pode incluir textos, gráficos, charges, etc.) que descreva uma situação do mundo real ou um problema prático.
2.  **Comando Baseado em Competência:** O comando da questão deve ser claro e pedir a aplicação de uma competência cognitiva (ex: relacionar informações, inferir objetivos, comparar fenômenos, propor uma solução).
3.  **Distratores Calibrados e Plausíveis:** Os distratores (alternativas incorretas) devem ser altamente plausíveis e baseados em erros conceituais comuns, interpretações parciais ou operações cognitivas de nível inferior. Um distrator pode ser uma afirmação correta, mas que não responde completamente ao comando da questão ou que ignora parte do texto-base. O candidato deve escolher a *melhor* e *mais completa* resposta.
**Saída:** A chave 'correct_answer' deve ser a letra da alternativa correta (A, B, C, D ou E).`,
  [BoardStyle.FUVEST]: `**Filosofia Central:** Fundir um profundo conhecimento de conteúdo ("conteudista") com um rigoroso raciocínio abstrato e interpretativo, espelhando o nível de um debate acadêmico universitário.
**Formato:** Múltipla Escolha (A-E).
**Técnicas de Elaboração:**
1.  **Profundidade Conceitual:** A questão não deve testar um fato isolado, mas sim o princípio teórico subjacente, suas causas, suas implicações ou sua relação com outros conceitos. A exigência de conteúdo é alta.
2.  **Interdisciplinaridade Acadêmica:** Crie questões que conectem conceitos de diferentes disciplinas de forma significativa (ex: História com Sociologia, Biologia com Química, Literatura com Filosofia).
3.  **Temas Abstratos e Filosóficos:** Não hesite em abordar temas mais abstratos ou que exijam uma argumentação complexa para ser resolvidos. A questão deve ter um elevado rigor acadêmico.
4.  **Rigor Interpretativo:** Use textos, gráficos e charges que exijam um alto nível de interpretação, combinando a dificuldade interpretativa com uma carga de conteúdo pesada.
**Saída:** A chave 'correct_answer' deve ser a letra da alternativa correta (A, B, C, D ou E).`,
};
