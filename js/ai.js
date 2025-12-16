// Системный промпт
const SYSTEM_PROMPT = `Ты учитель. Пиши ТОЛЬКО по-русски.

ЗАПРЕЩЕНО: купи, сходи, приготовь, посмотри видео

РАЗРЕШЕНО: реши примеры, напиши ответ, вставь букву, соедини, найди лишнее`;

// Промпт для генерации
function buildPrompt(userRequest) {
    return `Сделай 5 заданий.

Тема: ${userRequest}

ПРАВИЛА:
1. Только русский язык
2. 6-8 примеров в каждом задании
3. Укажи ответы в answers
4. НЕ пиши: купи, сходи, приготовь

Ответ в формате JSON:
{
  "title": "Название с эмодзи",
  "subtitle": "Описание",
  "tasks": [
    {
      "level": "⭐",
      "level_name": "Разминка",
      "instruction": "Что делать (Пример: ...)",
      "content": "Условие",
      "elements": ["задание1", "задание2", "задание3", "задание4", "задание5", "задание6"],
      "answers": ["ответ1", "ответ2", "ответ3", "ответ4", "ответ5", "ответ6"]
    }
  ],
  "motivation": "Похвала ⭐"
}

Ответ (только JSON):`;
}

// Вызов Groq API
async function callGroqAI(userRequest, apiKey) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: buildPrompt(userRequest) }
            ],
            max_tokens: 4000,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Ошибка API");
    }
    
    const data = await response.json();
    const text = data.choices[0].message.content;
    
    return extractJSON(text);
}

// Извлечение JSON из ответа
function extractJSON(text) {
    // Убираем markdown
    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    
    // Ищем JSON
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
        throw new Error("JSON не найден в ответе");
    }
    
    try {
        const data = JSON.parse(match[0]);
        return validateAndFix(data);
    } catch (e) {
        throw new Error("Ошибка парсинга JSON");
    }
}

// Валидация и исправление данных
function validateAndFix(data) {
    if (!data.title || !data.tasks) {
        throw new Error("Неверный формат данных");
    }
    
    // Проверяем на плохие слова
    const text = JSON.stringify(data).toLowerCase();
    const badWords = ["купи", "покупай", "сходи", "приготовь"];
    for (const word of badWords) {
        if (text.includes(word)) {
            throw new Error(`Некорректное задание: "${word}"`);
        }
    }
    
    // Дополняем данные
    data.subtitle = data.subtitle || "Развивающие задания";
    data.motivation = data.motivation || "Молодец! ⭐";
    
    data.tasks.forEach((task, i) => {
        task.level = task.level || LEVEL_ICONS[i] || "⭐";
        task.level_name = task.level_name || LEVEL_NAMES[i] || `Задание ${i + 1}`;
        task.elements = task.elements || [];
        task.answers = task.answers || [];
        task.content = task.content || "";
        task.instruction = task.instruction || "Выполни задание";
    });
    
    return data;
}