// ═══════════════════════════════════════════════════════
// ДАННЫЕ ДЛЯ КОНСТРУКТОРА ПРОМПТОВ
// ═══════════════════════════════════════════════════════

const TOPICS = {
    math: {
        preschool: ["Счёт до 5", "Счёт до 10", "Сравнение чисел"],
        "1": ["Сложение до 10", "Вычитание до 10", "Состав числа"],
        "2": ["Сложение до 20", "Вычитание до 20", "Умножение на 2-3"],
        "3": ["Таблица умножения", "Деление", "Уравнения"],
        "4": ["Многозначные числа", "Дроби", "Задачи на движение"]
    },
    russian: {
        preschool: ["Буквы", "Гласные звуки"],
        "1": ["Гласные и согласные", "Деление на слоги", "Ударение"],
        "2": ["Безударные гласные", "Парные согласные", "ЖИ-ШИ, ЧА-ЩА"],
        "3": [
            "Склонение существительных",
            "Три склонения существительных",
            "Определи склонение",
            "Падежи существительных", 
            "Определи падеж",
            "Родительный падеж",
            "Дательный падеж",
            "Творительный падеж",
            "Предложный падеж",
            "Окончания существительных 1 склонения",
            "Окончания существительных 2 склонения",
            "Окончания существительных 3 склонения"
        ],
        "4": [
            "Падежи — закрепление",
            "Окончания существительных",
            "Склонение — закрепление",
            "Спряжение глаголов",
            "I и II спряжение",
            "Окончания глаголов",
            "Безударные окончания"
        ]
    },
    reading: {
        preschool: ["Сказки о животных"],
        "1": ["Русские народные сказки", "Стихи Барто"],
        "2": ["Сказки Пушкина", "Рассказы Носова", "Пословицы"],
        "3": ["Басни Крылова", "Былины"],
        "4": ["Сказы Бажова", "Рассказы о войне"]
    },
    logic: {
        preschool: ["Найди лишнее", "Продолжи ряд"],
        "1": ["Найди лишнее", "Закономерности"],
        "2": ["Логические цепочки", "Сравнение"],
        "3": ["Логические задачи", "Ребусы"],
        "4": ["Сложные задачи", "Комбинаторика"]
    },
    world: {
        preschool: ["Времена года", "Животные"],
        "1": ["Живая и неживая природа", "Растения"],
        "2": ["Погода", "Вода в природе"],
        "3": ["Тело человека", "Природные зоны"],
        "4": ["История России", "Материки"]
    },
    english: {
        preschool: ["Цвета", "Числа 1-5"],
        "1": ["Алфавит", "Числа 1-10"],
        "2": ["Животные", "Семья"],
        "3": ["Дни недели", "Глагол to be"],
        "4": ["Present Simple", "Вопросы"]
    }
};

const TASK_TYPES = {
    math: [
        { id: "solve", label: "➕ Реши примеры", default: true },
        { id: "problems", label: "📝 Задачи", default: true },
        { id: "equations", label: "🔣 Уравнения" },
        { id: "compare", label: "⚖️ Сравнение" }
    ],
    russian: [
        { id: "write", label: "✏️ Запишите слова", default: true },
        { id: "insert", label: "📝 Вставьте буквы", default: true },
        { id: "define", label: "🔍 Определите", default: true },
        { id: "group", label: "📦 Распределите по группам" },
        { id: "change", label: "🔄 Образуйте слова" },
        { id: "text", label: "📖 Работа с текстом" },
        { id: "sentences", label: "📄 Составьте предложения" }
    ],
    reading: [
        { id: "match", label: "🔗 Соедини", default: true },
        { id: "order", label: "📋 Порядок событий" },
        { id: "proverbs", label: "💬 Пословицы" }
    ],
    logic: [
        { id: "odd", label: "❌ Найди лишнее", default: true },
        { id: "pattern", label: "🔄 Продолжи ряд", default: true }
    ],
    world: [
        { id: "groups", label: "📦 Группировка", default: true },
        { id: "truefalse", label: "✅ Верно/неверно" }
    ],
    english: [
        { id: "translate", label: "🔄 Переведи", default: true },
        { id: "match", label: "🔗 Соедини" }
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
    preschool: "дошкольников",
    "1": "1 класса",
    "2": "2 класса",
    "3": "3 класса",
    "4": "4 класса"
};

const DIFFICULTY_PROMPTS = {
    easy: "Простые задания для начинающих.",
    medium: "Задания средней сложности.",
    hard: "Сложные задания для продвинутых.",
    mixed: "Задания разной сложности: от простых к сложным."
};


// ═══════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════════

function initPromptBuilder() {
    const subjectSelect = document.getElementById("subject-select");
    const gradeSelect = document.getElementById("grade-select");
    const topicSelect = document.getElementById("topic-select");
    const customTopic = document.getElementById("custom-topic");
    const tasksNum = document.getElementById("tasks-num");
    const extraWishes = document.getElementById("extra-wishes");
    
    subjectSelect?.addEventListener("change", () => {
        updateTopics();
        updateTaskTypes();
        updatePromptPreview();
    });
    
    gradeSelect?.addEventListener("change", () => {
        updateTopics();
        updatePromptPreview();
    });
    
    [topicSelect, customTopic, tasksNum, extraWishes].forEach(el => {
        el?.addEventListener("change", updatePromptPreview);
        el?.addEventListener("input", updatePromptPreview);
    });
    
    document.querySelectorAll(".diff-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updatePromptPreview();
        });
    });
    
    tasksNum?.addEventListener("input", () => {
        const val = document.getElementById("tasks-num-value");
        if (val) val.textContent = tasksNum.value;
        updatePromptPreview();
    });
    
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
    const subject = document.getElementById("subject-select")?.value || "russian";
    const container = document.getElementById("task-types");
    
    if (!container) return;
    
    const types = TASK_TYPES[subject] || TASK_TYPES.russian;
    
    container.innerHTML = types.map(type => `
        <label class="task-type-checkbox">
            <input type="checkbox" value="${type.id}" ${type.default ? 'checked' : ''}>
            <span>${type.label}</span>
        </label>
    `).join("");
    
    container.querySelectorAll("input").forEach(cb => {
        cb.addEventListener("change", updatePromptPreview);
    });
}


function getSelectedTaskTypes() {
    const checkboxes = document.querySelectorAll("#task-types input:checked");
    return Array.from(checkboxes).map(cb => {
        return cb.parentElement.querySelector("span").textContent.replace(/^[^\s]+\s/, "");
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
        prompt += `, ${gradeName}`;
    }
    
    if (topicText) {
        prompt += `. Тема: ${topicText}`;
    }
    
    if (taskTypes.length > 0) {
        prompt += `. Типы заданий: ${taskTypes.join(", ")}`;
    }
    
    prompt += `. ${DIFFICULTY_PROMPTS[difficulty]}`;
    prompt += ` ${tasksNum} карточек.`;
    
    if (extraWishes) {
        prompt += ` ${extraWishes}`;
    }
    
    return prompt;
}


function getBuiltPrompt() {
    return buildUserPrompt();
}