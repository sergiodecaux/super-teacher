// ═══════════════════════════════════════════════════════
// НАСТРОЙКИ API
// ═══════════════════════════════════════════════════════

// Используем свой API прокси на Vercel
const API_URL = "/api/groq";

const MODELS = [
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768"
];


// ═══════════════════════════════════════════════════════
// ПРОМПТЫ
// ═══════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Ты — опытный учитель начальных классов в российской школе.

СТРОГИЕ ПРАВИЛА:
1. Пиши ТОЛЬКО на русском языке
2. Задания выполняются КАРАНДАШОМ НА БУМАГЕ
3. Каждое задание УНИКАЛЬНОЕ
4. Используй РАЗНЫЕ типы заданий

ЗАПРЕЩЕНО: купи, сходи, приготовь, видео, сайт

ТИПЫ ЗАДАНИЙ:
- Реши примеры
- Вставь букву/слово  
- Соедини линией
- Найди лишнее
- Расставь по порядку
- Сравни
- Подчеркни/обведи
- Допиши предложение
- Найди ошибку`;


function buildPrompt(userRequest) {
    return `Создай 5 заданий. ТЕМА: ${userRequest}

Ответ ТОЛЬКО JSON:
{
    "title": "Название с эмодзи",
    "subtitle": "Описание",
    "tasks": [
        {
            "level": "⭐",
            "level_name": "Разминка", 
            "instruction": "Что делать",
            "content": "Условие",
            "elements": ["1", "2", "3", "4", "5", "6"],
            "answers": ["1", "2", "3", "4", "5", "6"]
        },
        {"level": "⭐⭐", "level_name": "Разогрев", "instruction": "...", "content": "...", "elements": ["..."], "answers": ["..."]},
        {"level": "⭐⭐⭐", "level_name": "Тренировка", "instruction": "...", "content": "...", "elements": ["..."], "answers": ["..."]},
        {"level": "⭐⭐⭐⭐", "level_name": "Сложное", "instruction": "...", "content": "...", "elements": ["..."], "answers": ["..."]},
        {"level": "⭐⭐⭐⭐⭐", "level_name": "Мастер", "instruction": "...", "content": "...", "elements": ["..."], "answers": ["..."]}
    ],
    "motivation": "Молодец! ⭐"
}`;
}


// ═══════════════════════════════════════════════════════
// ВЫЗОВ API
// ═══════════════════════════════════════════════════════

async function callGroqAI(userRequest, apiKey) {
    
    for (const model of MODELS) {
        try {
            console.log(`🔄 Модель: ${model}`);
            
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: buildPrompt(userRequest) }
                    ],
                    max_tokens: 4000,
                    temperature: 0.8
                })
            });
            
            if (response.status === 429) {
                console.log("⚠️ Лимит, следующая модель...");
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }
            
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error?.message || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;
            
            if (!text) continue;
            
            console.log(`✅ Получено ${text.length} символов`);
            
            const worksheet = extractJSON(text);
            if (worksheet && validateWorksheet(worksheet)) {
                return worksheet;
            }
            
        } catch (error) {
            console.error(`❌ ${model}:`, error.message);
            continue;
        }
    }
    
    throw new Error("Ошибка генерации. Проверь API ключ Groq.");
}


// ═══════════════════════════════════════════════════════
// ОБРАБОТКА
// ═══════════════════════════════════════════════════════

function extractJSON(text) {
    text = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "");
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON не найден");
    
    let jsonStr = match[0].replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    return JSON.parse(jsonStr);
}

function validateWorksheet(data) {
    if (!data.title || !data.tasks?.length) return false;
    if (data.tasks.length < 3) return false;
    
    data.subtitle = data.subtitle || "Задания";
    data.motivation = data.motivation || "Молодец! ⭐";
    
    data.tasks.forEach((task, i) => {
        task.level = task.level || "⭐";
        task.level_name = task.level_name || `Задание ${i+1}`;
        task.elements = task.elements || [];
        task.answers = task.answers || [];
        task.content = task.content || "";
        task.instruction = task.instruction || "Выполни";
    });
    
    return true;
}