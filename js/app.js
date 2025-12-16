// ═══════════════════════════════════════════════════════
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ═══════════════════════════════════════════════════════

let currentWorksheet = null;
let currentMode = "ai";


// ═══════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    initModeButtons();
    initExamples();
    initConstructor();
    initButtons();
    initQuickButtons();
    loadApiKey();
});


// ═══════════════════════════════════════════════════════
// РЕЖИМЫ
// ═══════════════════════════════════════════════════════

function initModeButtons() {
    document.querySelectorAll(".mode-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            currentMode = btn.dataset.mode;
            
            document.getElementById("ai-mode").classList.toggle("hidden", currentMode !== "ai");
            document.getElementById("constructor-mode").classList.toggle("hidden", currentMode !== "constructor");
        });
    });
}


// ═══════════════════════════════════════════════════════
// ПРИМЕРЫ ЗАПРОСОВ
// ═══════════════════════════════════════════════════════

function initExamples() {
    const toggle = document.querySelector(".toggle-examples");
    const content = document.querySelector(".examples-content");
    
    if (toggle && content) {
        toggle.addEventListener("click", () => {
            content.classList.toggle("hidden");
        });
    }
    
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderExamples(btn.dataset.tab);
        });
    });
    
    renderExamples("preschool");
}

function renderExamples(category) {
    const list = document.getElementById("examples-list");
    if (!list) return;
    
    const examples = EXAMPLES[category] || [];
    
    list.innerHTML = examples.map(ex => 
        `<button class="example-btn">${ex}</button>`
    ).join("");
    
    list.querySelectorAll(".example-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("user-request").value = btn.textContent;
            document.querySelector(".examples-content").classList.add("hidden");
        });
    });
}


// ═══════════════════════════════════════════════════════
// КОНСТРУКТОР
// ═══════════════════════════════════════════════════════

function initConstructor() {
    const slider = document.getElementById("tasks-count");
    const value = document.getElementById("tasks-count-value");
    
    if (slider && value) {
        slider.addEventListener("input", () => {
            value.textContent = slider.value;
            renderTaskCards(parseInt(slider.value));
        });
        
        renderTaskCards(3);
    }
}

function renderTaskCards(count) {
    const container = document.getElementById("tasks-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    for (let i = 0; i < count; i++) {
        const color = LEVEL_COLORS[i % LEVEL_COLORS.length];
        const icon = LEVEL_ICONS[i % LEVEL_ICONS.length];
        const name = LEVEL_NAMES[i % LEVEL_NAMES.length];
        
        container.innerHTML += `
        <div class="task-card" style="border-left-color: ${color}">
            <h4>${icon} Задание ${i + 1}</h4>
            <div class="row">
                <div class="input-group">
                    <label>Название:</label>
                    <input type="text" id="task-name-${i}" value="${name}">
                </div>
                <div class="input-group">
                    <label>Инструкция:</label>
                    <input type="text" id="task-instr-${i}" value="Выполни задание. Напиши ответ.">
                </div>
            </div>
            <div class="input-group">
                <label>Описание/условие:</label>
                <input type="text" id="task-content-${i}" placeholder="Например: Реши примеры">
            </div>
            <div class="row">
                <div class="input-group">
                    <label>Элементы (каждый с новой строки):</label>
                    <textarea id="task-elem-${i}" rows="4">2+3=☐
4+1=☐
5+2=☐
3+3=☐
1+6=☐
4+4=☐</textarea>
                </div>
                <div class="input-group">
                    <label>Ответы (каждый с новой строки):</label>
                    <textarea id="task-ans-${i}" rows="4">5
5
7
6
7
8</textarea>
                </div>
            </div>
        </div>`;
    }
}


// ═══════════════════════════════════════════════════════
// КНОПКИ
// ═══════════════════════════════════════════════════════

function initButtons() {
    // Генерация AI
    const generateBtn = document.getElementById("generate-btn");
    if (generateBtn) {
        generateBtn.addEventListener("click", generateWithAI);
    }
    
    // Демо
    const demoBtn = document.getElementById("demo-btn");
    if (demoBtn) {
        demoBtn.addEventListener("click", () => {
            currentWorksheet = DEMO_WORKSHEET;
            showResult();
        });
    }
    
    // Очистить
    const clearBtn = document.getElementById("clear-btn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            document.getElementById("user-request").value = "";
            currentWorksheet = null;
            hideResult();
        });
    }
    
    // Создать из конструктора
    const createBtn = document.getElementById("create-worksheet-btn");
    if (createBtn) {
        createBtn.addEventListener("click", createFromConstructor);
    }
    
    // Скачать рабочий лист
    const downloadWorksheet = document.getElementById("download-worksheet");
    if (downloadWorksheet) {
        downloadWorksheet.addEventListener("click", () => {
            if (currentWorksheet) {
                const theme = document.getElementById("theme-select").value;
                const html = generateWorksheetHTML(currentWorksheet, theme);
                downloadHTML(html, `worksheet_${Date.now()}.html`);
            }
        });
    }
    
    // Скачать ответы
    const downloadAnswers = document.getElementById("download-answers");
    if (downloadAnswers) {
        downloadAnswers.addEventListener("click", () => {
            if (currentWorksheet) {
                const html = generateAnswersHTML(currentWorksheet);
                downloadHTML(html, `answers_${Date.now()}.html`);
            }
        });
    }
    
    // API ключ - сохранение при вводе
    const apiKeyInput = document.getElementById("api-key");
    if (apiKeyInput) {
        apiKeyInput.addEventListener("input", (e) => {
            localStorage.setItem("groq_api_key", e.target.value);
        });
        apiKeyInput.addEventListener("change", (e) => {
            localStorage.setItem("groq_api_key", e.target.value);
        });
    }
}

function initQuickButtons() {
    document.querySelectorAll(".quick-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const request = btn.dataset.request;
            document.getElementById("user-request").value = request;
            
            // Переключаемся на AI режим
            document.querySelectorAll(".mode-btn")[0].click();
        });
    });
}


// ═══════════════════════════════════════════════════════
// API КЛЮЧ
// ═══════════════════════════════════════════════════════

function loadApiKey() {
    const saved = localStorage.getItem("groq_api_key");
    if (saved) {
        const input = document.getElementById("api-key");
        if (input) input.value = saved;
    }
}


// ═══════════════════════════════════════════════════════
// ГЕНЕРАЦИЯ ЧЕРЕЗ AI
// ═══════════════════════════════════════════════════════

async function generateWithAI() {
    const requestInput = document.getElementById("user-request");
    const apiKeyInput = document.getElementById("api-key");
    
    const request = requestInput ? requestInput.value.trim() : "";
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";
    
    if (!request) {
        showError("Введи описание задания или выбери пример!");
        return;
    }
    
    if (!apiKey) {
        showError("Введи API ключ Groq! Получить бесплатно: console.groq.com/keys");
        return;
    }
    
    if (!apiKey.startsWith("gsk_")) {
        showError("Неверный формат ключа. Ключ должен начинаться с gsk_");
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        currentWorksheet = await callGroqAI(request, apiKey);
        showResult();
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}


// ═══════════════════════════════════════════════════════
// СОЗДАНИЕ ИЗ КОНСТРУКТОРА
// ═══════════════════════════════════════════════════════

function createFromConstructor() {
    const title = document.getElementById("custom-title")?.value || "Мои задания";
    const subtitle = document.getElementById("custom-subtitle")?.value || "Развивающие упражнения";
    const motivation = document.getElementById("custom-motivation")?.value || "Молодец! ⭐";
    const count = parseInt(document.getElementById("tasks-count")?.value || "3");
    
    const tasks = [];
    
    for (let i = 0; i < count; i++) {
        const elementsText = document.getElementById(`task-elem-${i}`)?.value || "";
        const answersText = document.getElementById(`task-ans-${i}`)?.value || "";
        
        const elements = elementsText.split("\n").map(e => e.trim()).filter(e => e);
        const answers = answersText.split("\n").map(a => a.trim()).filter(a => a);
        
        tasks.push({
            level: LEVEL_ICONS[i % LEVEL_ICONS.length],
            level_name: document.getElementById(`task-name-${i}`)?.value || LEVEL_NAMES[i],
            instruction: document.getElementById(`task-instr-${i}`)?.value || "Выполни задание",
            content: document.getElementById(`task-content-${i}`)?.value || "",
            elements: elements,
            answers: answers
        });
    }
    
    // Проверка
    const hasContent = tasks.some(t => t.elements.length > 0);
    if (!hasContent) {
        alert("Добавь хотя бы одно задание с элементами!");
        return;
    }
    
    currentWorksheet = { title, subtitle, tasks, motivation };
    showResult();
}


// ═══════════════════════════════════════════════════════
// ОТОБРАЖЕНИЕ РЕЗУЛЬТАТА
// ═══════════════════════════════════════════════════════

function showResult() {
    if (!currentWorksheet) return;
    
    // Скрываем пустое состояние
    const emptyState = document.getElementById("empty-state");
    if (emptyState) emptyState.classList.add("hidden");
    
    // Показываем результат
    const resultSection = document.getElementById("result-section");
    if (resultSection) resultSection.classList.remove("hidden");
    
    // Заполняем данные
    const titleEl = document.getElementById("result-title");
    const subtitleEl = document.getElementById("result-subtitle");
    
    if (titleEl) titleEl.textContent = currentWorksheet.title;
    if (subtitleEl) subtitleEl.textContent = currentWorksheet.subtitle;
    
    // Статистика
    const tasks = currentWorksheet.tasks || [];
    const totalElements = tasks.reduce((sum, t) => sum + (t.elements?.length || 0), 0);
    const themeName = document.getElementById("theme-select")?.value || "default";
    const theme = THEMES[themeName] || THEMES.default;
    
    const statTasks = document.getElementById("stat-tasks");
    const statElements = document.getElementById("stat-elements");
    const statTheme = document.getElementById("stat-theme");
    
    if (statTasks) statTasks.textContent = tasks.length;
    if (statElements) statElements.textContent = totalElements;
    if (statTheme) statTheme.textContent = theme.emoji + " " + theme.name;
    
    // Предпросмотр заданий
    const preview = document.getElementById("tasks-preview");
    if (preview) {
        preview.innerHTML = tasks.map((task, i) => {
            const color = LEVEL_COLORS[i % LEVEL_COLORS.length];
            const elementsHTML = (task.elements || []).map(el => 
                `<span class="element-chip">${el}</span>`
            ).join("");
            
            return `
            <div class="task-preview" style="border-left-color: ${color}">
                <h4>${task.level} ${task.level_name}</h4>
                <div class="instruction">📝 ${task.instruction}</div>
                ${task.content ? `<p>${task.content}</p>` : ''}
                <div class="elements">${elementsHTML}</div>
                <div class="elements-count">Упражнений: ${task.elements?.length || 0}</div>
            </div>`;
        }).join("");
    }
    
    // Мотивация
    const motivationBox = document.getElementById("motivation-box");
    if (motivationBox) {
        motivationBox.textContent = "🎉 " + currentWorksheet.motivation;
    }
}

function hideResult() {
    const resultSection = document.getElementById("result-section");
    const emptyState = document.getElementById("empty-state");
    
    if (resultSection) resultSection.classList.add("hidden");
    if (emptyState) emptyState.classList.remove("hidden");
}


// ═══════════════════════════════════════════════════════
// ЗАГРУЗКА И ОШИБКИ
// ═══════════════════════════════════════════════════════

function showLoading(show) {
    const loading = document.getElementById("loading");
    if (loading) {
        loading.classList.toggle("hidden", !show);
    }
}

function showError(message) {
    const errorEl = document.getElementById("error-message");
    if (errorEl) {
        errorEl.textContent = "❌ " + message;
        errorEl.classList.remove("hidden");
    }
}

function hideError() {
    const errorEl = document.getElementById("error-message");
    if (errorEl) {
        errorEl.classList.add("hidden");
    }
}