// ═══════════════════════════════════════════════════════
// ПРОМПТЫ ДЛЯ AI
// ═══════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Ты — опытный учитель начальных классов в российской школе.

ТВОЯ ЗАДАЧА: Создавать разнообразные, интересные задания для детей.

СТРОГИЕ ПРАВИЛА:
1. Пиши ТОЛЬКО на русском языке
2. Задания должны выполняться КАРАНДАШОМ НА БУМАГЕ
3. Каждое задание должно быть УНИКАЛЬНЫМ — не повторяй слова и примеры
4. Используй РАЗНЫЕ типы заданий в одном листе

ЗАПРЕЩЕНО использовать слова: купи, сходи, приготовь, посмотри видео, открой сайт

РАЗРЕШЁННЫЕ ТИПЫ ЗАДАНИЙ:
- Реши примеры / уравнения
- Вставь пропущенную букву / слово
- Соедини линией
- Найди лишнее
- Расставь по порядку
- Сравни (числа, слова, героев)
- Подчеркни / обведи
- Допиши предложение
- Найди ошибку
- Раздели на группы
- Подбери пару (антоним, синоним, рифму)
- Восстанови последовательность
- Ответь на вопросы по тексту

ВАЖНО ДЛЯ РАЗНООБРАЗИЯ:
- Используй разные формулировки инструкций
- Меняй порядок слов в предложениях
- Применяй разные эмодзи
- Чередуй простые и сложные задания
- Добавляй элемент игры и приключения`;


function buildPrompt(userRequest) {
    return `Создай рабочий лист с 5 РАЗНЫМИ заданиями.

ТЕМА: ${userRequest}

КРИТИЧЕСКИ ВАЖНО:
1. Каждое задание должно быть ДРУГОГО ТИПА
2. НЕ повторяй одинаковые слова/примеры
3. Используй 6-8 разных элементов в каждом задании
4. Добавь интересные, игровые формулировки
5. Обязательно укажи правильные ответы

Ответ ТОЛЬКО в формате JSON:
{
    "title": "Яркое название с эмодзи",
    "subtitle": "Интересное описание",
    "tasks": [
        {
            "level": "⭐",
            "level_name": "Разминка",
            "instruction": "Чёткая инструкция с примером",
            "content": "Условие задания",
            "elements": ["элемент1", "элемент2", "элемент3", "элемент4", "элемент5", "элемент6"],
            "answers": ["ответ1", "ответ2", "ответ3", "ответ4", "ответ5", "ответ6"]
        },
        {
            "level": "⭐⭐",
            "level_name": "Разогрев",
            "instruction": "ДРУГОЙ тип задания",
            "content": "ДРУГОЕ условие",
            "elements": ["другие элементы"],
            "answers": ["другие ответы"]
        },
        {
            "level": "⭐⭐⭐",
            "level_name": "Тренировка",
            "instruction": "...",
            "content": "...",
            "elements": ["..."],
            "answers": ["..."]
        },
        {
            "level": "⭐⭐⭐⭐",
            "level_name": "Сложное",
            "instruction": "...",
            "content": "...",
            "elements": ["..."],
            "answers": ["..."]
        },
        {
            "level": "⭐⭐⭐⭐⭐",
            "level_name": "Для умников",
            "instruction": "...",
            "content": "...",
            "elements": ["..."],
            "answers": ["..."]
        }
    ],
    "motivation": "Весёлая похвала с эмодзи!"
}`;
}


// ═══════════════════════════════════════════════════════
// CORS ПРОКСИ
// ═══════════════════════════════════════════════════════

const CORS_PROXIES = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://cors-anywhere.herokuapp.com/"
];

// Прямой URL Groq API
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";


// ═══════════════════════════════════════════════════════
// ВЫЗОВ API
// ═══════════════════════════════════════════════════════

async function callGroqAI(userRequest, apiKey) {
    const models = [
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant", 
        "llama3-70b-8192",
        "mixtral-8x7b-32768"
    ];
    
    // Сначала пробуем напрямую
    for (const model of models) {
        try {
            console.log(`🔄 Пробуем модель: ${model}`);
            const result = await tryDirectRequest(model, userRequest, apiKey);
            if (result) return result;
        } catch (error) {
            console.log(`⚠️ Прямой запрос не удался: ${error.message}`);
        }
    }
    
    // Если прямые запросы не работают, пробуем через прокси
    console.log("🔄 Пробуем через CORS прокси...");
    
    for (const proxy of CORS_PROXIES) {
        for (const model of models.slice(0, 2)) { // Только первые 2 модели через прокси
            try {
                console.log(`🔄 Прокси ${proxy} + модель ${model}`);
                const result = await tryProxyRequest(proxy, model, userRequest, apiKey);
                if (result) return result;
            } catch (error) {
                console.log(`⚠️ Прокси не сработал: ${error.message}`);
                continue;
            }
        }
    }
    
    throw new Error("Не удалось подключиться к AI. Проверь интернет и API ключ, или попробуй позже.");
}


async function tryDirectRequest(model, userRequest, apiKey) {
    const response = await fetch(GROQ_API_URL, {
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
    
    return await handleResponse(response, model);
}


async function tryProxyRequest(proxyUrl, model, userRequest, apiKey) {
    const body = JSON.stringify({
        model: model,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildPrompt(userRequest) }
        ],
        max_tokens: 4000,
        temperature: 0.8
    });
    
    // Для allorigins нужно кодировать URL
    let url;
    if (proxyUrl.includes("allorigins")) {
        url = proxyUrl + encodeURIComponent(GROQ_API_URL);
    } else {
        url = proxyUrl + GROQ_API_URL;
    }
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        },
        body: body
    });
    
    return await handleResponse(response, model);
}


async function handleResponse(response, model) {
    if (response.status === 429) {
        console.log("⚠️ Лимит запросов, пробуем другую модель...");
        await new Promise(r => setTimeout(r, 1000));
        return null;
    }
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
        throw new Error("Пустой ответ от AI");
    }
    
    console.log(`✅ Получен ответ от ${model} (${text.length} символов)`);
    
    const worksheet = extractJSON(text);
    if (worksheet && validateWorksheet(worksheet)) {
        return worksheet;
    }
    
    return null;
}


// ═══════════════════════════════════════════════════════
// ОБРАБОТКА ОТВЕТА
// ═══════════════════════════════════════════════════════

function extractJSON(text) {
    text = text.replace(/```json\s*/gi, "");
    text = text.replace(/```\s*/gi, "");
    text = text.replace(/<[^>]+>/g, "");
    
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
        console.error("JSON не найден в ответе");
        throw new Error("AI не вернул данные в нужном формате");
    }
    
    try {
        let jsonStr = match[0];
        jsonStr = jsonStr.replace(/,\s*}/g, "}");
        jsonStr = jsonStr.replace(/,\s*]/g, "]");
        
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Ошибка парсинга JSON:", e);
        throw new Error("Ошибка обработки ответа AI");
    }
}


function validateWorksheet(data) {
    if (!data.title || !data.tasks || !Array.isArray(data.tasks)) {
        console.error("Неверная структура данных");
        return false;
    }
    
    if (data.tasks.length < 3) {
        console.error("Слишком мало заданий");
        return false;
    }
    
    const text = JSON.stringify(data).toLowerCase();
    const badWords = ["купи", "покупай", "сходи", "приготовь", "свари"];
    
    for (const word of badWords) {
        if (text.includes(word)) {
            console.error(`Найдено запрещённое слово: ${word}`);
            return false;
        }
    }
    
    data.subtitle = data.subtitle || "Развивающие задания";
    data.motivation = data.motivation || "Молодец! Ты справился! ⭐";
    
    data.tasks.forEach((task, i) => {
        task.level = task.level || LEVEL_ICONS[i] || "⭐";
        task.level_name = task.level_name || LEVEL_NAMES[i] || `Задание ${i + 1}`;
        task.elements = task.elements || [];
        task.answers = task.answers || [];
        task.content = task.content || "";
        task.instruction = task.instruction || "Выполни задание";
    });
    
    return true;
}