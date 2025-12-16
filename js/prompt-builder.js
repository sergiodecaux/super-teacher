// ═══════════════════════════════════════════════════════
// ДАННЫЕ ДЛЯ КОНСТРУКТОРА ПРОМПТОВ
// ═══════════════════════════════════════════════════════

const TOPICS = {
    math: {
        preschool: [
            "Счёт до 5",
            "Счёт до 10", 
            "Сравнение: больше-меньше",
            "Геометрические фигуры"
        ],
        "1": [
            "Сложение до 10",
            "Вычитание до 10",
            "Сложение и вычитание до 10",
            "Состав числа 10",
            "Сравнение чисел"
        ],
        "2": [
            "Сложение до 20",
            "Вычитание до 20", 
            "Сложение до 100 (круглые)",
            "Умножение на 2",
            "Умножение на 3"
        ],
        "3": [
            "Таблица умножения на 4-5",
            "Таблица умножения на 6-7",
            "Деление",
            "Порядок действий",
            "Уравнения"
        ],
        "4": [
            "Многозначные числа",
            "Умножение в столбик",
            "Деление в столбик",
            "Дроби",
            "Задачи на движение"
        ]
    },
    russian: {
        preschool: [
            "Буквы А, О, У",
            "Гласные звуки",
            "Первая буква в слове"
        ],
        "1": [
            "Гласные буквы",
            "Согласные буквы",
            "Деление на слоги",
            "Ударение",
            "Большая буква в именах"
        ],
        "2": [
            "Безударные гласные О/А",
            "Безударные гласные Е/И",
            "ЖИ-ШИ, ЧА-ЩА, ЧУ-ЩУ",
            "Парные согласные",
            "Мягкий знак"
        ],
        "3": [
            "Падежи существительных",
            "Определи падеж",
            "Склонение существительных",
            "Окончания существительных 1 склонения",
            "Окончания существительных 2 склонения",
            "Окончания существительных 3 склонения",
            "Род существительных",
            "Части речи"
        ],
        "4": [
            "Падежи — все падежи",
            "Окончания существительных",
            "Склонение — все склонения",
            "Спряжение глаголов",
            "Окончания глаголов I и II спряжения",
            "Безударные окончания глаголов",
            "Однородные члены предложения",
            "Знаки препинания"
        ]
    },
    reading: {
        preschool: [
            "Сказки о животных",
            "Потешки и загадки"
        ],
        "1": [
            "Русские народные сказки",
            "Стихи А. Барто",
            "Сказки К. Чуковского"
        ],
        "2": [
            "Сказки А.С. Пушкина",
            "Рассказы Н. Носова",
            "Пословицы и поговорки"
        ],
        "3": [
            "Басни И.А. Крылова",
            "Рассказы о животных",
            "Былины"
        ],
        "4": [
            "Сказы П. Бажова",
            "Рассказы о войне",
            "Стихи о природе"
        ]
    },
    logic: {
        preschool: [
            "Найди лишнее (простое)",
            "Продолжи ряд",
            "Найди пару"
        ],
        "1": [
            "Найди лишнее",
            "Что сначала, что потом",
            "Закономерности"
        ],
        "2": [
            "Логические цепочки",
            "Сравнение",
            "Группировка"
        ],
        "3": [
            "Логические задачи",
            "Истина и ложь",
            "Ребусы"
        ],
        "4": [
            "Сложные логические задачи",
            "Комбинаторика",
            "Задачи на смекалку"
        ]
    },
    world: {
        preschool: [
            "Времена года",
            "Домашние животные",
            "Дикие животные"
        ],
        "1": [
            "Живая и неживая природа",
            "Растения",
            "Животные"
        ],
        "2": [
            "Погода",
            "Вода в природе",
            "Красная книга"
        ],
        "3": [
            "Тело человека",
            "Экология",
            "Природные зоны"
        ],
        "4": [
            "Материки и океаны",
            "История России",
            "Государство"
        ]
    },
    english: {
        preschool: [
            "Цвета (Colours)",
            "Числа 1-5 (Numbers)"
        ],
        "1": [
            "Алфавит A-M",
            "Алфавит N-Z",
            "Числа 1-10",
            "Цвета"
        ],
        "2": [
            "Животные (Animals)",
            "Семья (Family)",
            "Еда (Food)"
        ],
        "3": [
            "Дни недели",
            "Месяцы",
            "Глагол to be"
        ],
        "4": [
            "Present Simple",
            "Множественное число",
            "Вопросы"
        ]
    }
};

const TASK_TYPES = {
    math: [
        { id: "solve", label: "➕ Реши примеры", default: true },
        { id: "compare", label: "⚖️ Сравни числа", default: true },
        { id: "missing", label: "❓ Найди пропущенное" },
        { id: "problems", label: "📝 Задачи" },
        { id: "sequence", label: "🔢 Продолжи ряд" }
    ],
    russian: [
        { id: "insert", label: "✏️ Вставь букву", default: true },
        { id: "syllables", label: "➗ Раздели на слоги", default: true },
        { id: "stress", label: "📢 Поставь ударение" },
        { id: "error", label: "🔍 Найди ошибку" },
        { id: "groups", label: "📦 Раздели на группы" }
    ],
    reading: [
        { id: "match", label: "🔗 Соедини героя и сказку", default: true },
        { id: "order", label: "📋 Что сначала, что потом", default: true },
        { id: "quote", label: "💬 Кто это сказал?" },
        { id: "title", label: "📖 Узнай произведение" }
    ],
    logic: [
        { id: "odd", label: "❌ Найди лишнее", default: true },
        { id: "pattern", label: "🔄 Продолжи ряд", default: true },
        { id: "pairs", label: "👯 Найди пару" },
        { id: "order", label: "📋 Расставь по порядку" }
    ],
    world: [
        { id: "groups", label: "📦 Раздели на группы", default: true },
        { id: "truefalse", label: "✅ Верно/неверно", default: true },
        { id: "match", label: "🔗 Соедини" },
        { id: "fill", label: "📝 Допиши" }
    ],
    english: [
        { id: "translate", label: "🔄 Переведи", default: true },
        { id: "match", label: "🔗 Соедини слово и перевод", default: true },
        { id: "fill", label: "✏️ Вставь букву" },
        { id: "order", label: "📝 Составь слово" }
    ]
};

const SUBJECT_NAMES = {
    math: "Математика",
    russian: "Русский язык", 
    reading: "Литературное чтение",
    world: "Окружающий мир",
    logic: "Логика",
    english: "Английский язык"
};

const GRADE_NAMES = {
    preschool: "дошкольников (5-6 лет)",
    "1": "1 класса (6-7 лет)",
    "2": "2 класса (7-8 лет)",
    "3": "3 класса (8-9 лет)",
    "4": "4 класса (9-10 лет)"
};

const DIFFICULTY_PROMPTS = {
    easy: "Задания ПРОСТЫЕ, для начинающих. Маленькие числа (до 10), короткие слова.",
    medium: "Задания СРЕДНЕЙ сложности, стандартные для этого возраста.",
    hard: "Задания СЛОЖНЫЕ, для продвинутых учеников.",
    mixed: "Задания РАЗНОЙ сложности: от простых к сложным."
};


// ═══════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ КОНСТРУКТОРА
// ═══════════════════════════════════════════════════════

function initPromptBuilder() {
    const subjectSelect = document.getElementById("subject-select");
    const gradeSelect = document.getElementById("grade-select");
    const topicSelect = document.getElementById("topic-select");
    const customTopic = document.getElementById("custom-topic");
    const tasksNum = document.getElementById("tasks-num");
    const extraWishes = document.getElementById("extra-wishes");
    
    // Обновление тем при выборе предмета/класса
    subjectSelect?.addEventListener("change", () => {
        updateTopics();
        updateTaskTypes();
        updatePromptPreview();
    });
    
    gradeSelect?.addEventListener("change", () => {
        updateTopics();
        updatePromptPreview();
    });
    
    // Обновление превью при любом изменении
    [topicSelect, customTopic, tasksNum, extraWishes].forEach(el => {
        el?.addEventListener("change", updatePromptPreview);
        el?.addEventListener("input", updatePromptPreview);
    });
    
    // Кнопки сложности
    document.querySelectorAll(".diff-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updatePromptPreview();
        });
    });
    
    // Слайдер количества
    tasksNum?.addEventListener("input", () => {
        const val = document.getElementById("tasks-num-value");
        if (val) val.textContent = tasksNum.value;
        updatePromptPreview();
    });
    
    // Инициализация
    updateTaskTypes();
    updatePromptPreview();
}


function updateTopics() {
    const subject = document.getElementById("subject-select")?.value;
    const grade = document.getElementById("grade-select")?.value;
    const topicSelect = document.getElementById("topic-select");
    
    if (!topicSelect) return;
    
    topicSelect.innerHTML = '<option value="">— Выбери тему —</option>';
    
    if (subject && grade && TOPICS[subject]?.[grade]) {
        TOPICS[subject][grade].forEach(topic => {
            const option = document.createElement("option");
            option.value = topic;
            option.textContent = topic;
            topicSelect.appendChild(option);
        });
    }
}


function updateTaskTypes() {
    const subject = document.getElementById("subject-select")?.value || "math";
    const container = document.getElementById("task-types");
    
    if (!container) return;
    
    const types = TASK_TYPES[subject] || TASK_TYPES.math;
    
    container.innerHTML = types.map(type => `
        <label class="task-type-checkbox">
            <input type="checkbox" value="${type.id}" ${type.default ? 'checked' : ''}>
            <span>${type.label}</span>
        </label>
    `).join("");
    
    // Добавляем обработчики
    container.querySelectorAll("input").forEach(cb => {
        cb.addEventListener("change", updatePromptPreview);
    });
}


function getSelectedTaskTypes() {
    const checkboxes = document.querySelectorAll("#task-types input:checked");
    return Array.from(checkboxes).map(cb => {
        const label = cb.parentElement.querySelector("span").textContent;
        // Убираем эмодзи в начале
        return label.replace(/^[^\s]+\s/, "");
    });
}


function updatePromptPreview() {
    const preview = document.getElementById("prompt-preview-text");
    if (!preview) return;
    
    const prompt = buildUserPrompt();
    preview.textContent = prompt || "Выбери предмет и класс...";
}


function buildUserPrompt() {
    const subject = document.getElementById("subject-select")?.value;
    const grade = document.getElementById("grade-select")?.value;
    const topic = document.getElementById("topic-select")?.value;
    const customTopic = document.getElementById("custom-topic")?.value?.trim();
    const tasksNum = document.getElementById("tasks-num")?.value || 5;
    const extraWishes = document.getElementById("extra-wishes")?.value?.trim();
    const difficulty = document.querySelector(".diff-btn.active")?.dataset.diff || "mixed";
    
    if (!subject) return "";
    
    const subjectName = SUBJECT_NAMES[subject];
    const gradeName = grade ? GRADE_NAMES[grade] : "";
    const topicText = customTopic || topic || "";
    const taskTypes = getSelectedTaskTypes();
    
    let prompt = subjectName;
    
    if (gradeName) {
        prompt += ` для ${gradeName}`;
    }
    
    if (topicText) {
        prompt += `. Тема: ${topicText}`;
    }
    
    if (taskTypes.length > 0) {
        prompt += `. Типы заданий: ${taskTypes.join(", ")}`;
    }
    
    prompt += `. ${DIFFICULTY_PROMPTS[difficulty]}`;
    
    prompt += ` Сделай ${tasksNum} заданий.`;
    
    if (extraWishes) {
        prompt += ` ${extraWishes}`;
    }
    
    return prompt;
}


// Функция для app.js
function getBuiltPrompt() {
    return buildUserPrompt();
}