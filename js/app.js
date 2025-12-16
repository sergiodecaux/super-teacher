// Состояние приложения
let currentWorksheet = null;
let currentMode = "ai";

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    initModeButtons();
    initExamples();
    initConstructor();
    initButtons();
    loadApiKey();
});

// Переключение режимов
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

// Примеры запросов
function initExamples() {
    const toggle = document.querySelector(".toggle-examples");
    const content = document.querySelector(".examples-content");
    
    toggle.addEventListener("click", () => {
        content.classList.toggle("hidden");
    });
    
    // Табы
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
    const examples = EXAMPLES[category] || [];
    
    list.innerHTML = examples.map(ex => 
        `<button class="example-btn">${ex}</button>`
    ).join("");
    
    list.querySelectorAll(".example-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("user-request").value = btn.textContent;
        });
    });
}

// Конструктор
function initConstructor() {
    const slider = document.getElementById("tasks-count");
    const value = document.getElementById("tasks-count-value");
    
    slider.addEventListener("input", () => {
        value.textContent = slider.value;
        renderTaskCards(parseInt(slider.value));
    });
    
    renderTaskCards(3);
}

function renderTaskCards(count) {
    const container = document.getElementById("tasks-container");
    container.innerHTML = "";
    
    for (let i = 0; i < count; i++) {
        container.innerHTML += `
        <div class="task-card">
            <h4>${LEVEL_ICONS[i] || "⭐"} Задание ${i + 1}</h4>
            <div class="row">
                <div class="input-group">
                    <label>Название:</label>
                    <input type="text" id="task-name-${i}" value="${LEVEL_NAMES[i] || 'Задание'}">
                </div>
                <div class="input-group">
                    <label>Инструкция:</label>
                    <input type="text" id="task-instr-${i}" value="Реши примеры. Напиши ответ.">
                </div>
            </div>
            <div class="input-group">
                <label>Описание:</label>
                <input type="text" id="task-content-${i}" placeholder="Условие задания">
            </div>
            <div class="row">
                <div class="input-group">
                    <label>Элементы (каждый с новой строки):</label>
                    <textarea id="task-elements-${i}" rows="4">2+3=☐
4+1=☐
5+2=☐
3+3=☐
1+6=☐
4+4=☐</textarea>
                </div>
                <div class="input-group">
                    <label>Ответы (каждый с новой строки):</label>
                    <textarea id="task-answers-${i}" rows="4">5
5
7
6
7
8</textarea>
                </div>
            </div>
        </div>
        `;
    }
}

// Кнопки
function initButtons() {
    // Генерация AI
    document.getElementById("generate-btn").addEventListener("click", generateWithAI);
    
    // Демо
    document.getElementById("demo-btn").addEventListener("click", () => {
        currentWorksheet = DEMO_WORKSHEET;
        showResult();
    });
    
    // Очистить
    document.getElementById("clear-btn").addEventListener("click", () => {
        document.getElementById("user-request").value = "";
        currentWorksheet = null;
        hideResult();
    });
    
    // Создать из конструктора
    document.getElementById("create-worksheet-btn").addEventListener("click", createFromConstructor);
    
    // Скачать
    document.getElementById("download-worksheet").addEventListener("click", () => {
        if (currentWorksheet) {
            const html = generateWorksheetHTML(currentWorksheet);
            downloadHTML(html, `worksheet_${Date.now()}.html`);
        }
    });
    
    document.getElementById("download-answers").addEventListener("click", () => {
        if (currentWorksheet) {
            const html = generateAnswersHTML(currentWorksheet);
            downloadHTML(html, `answers_${Date.now()}.html`);
        }
    });
    
    // Быстрые кнопки
    document.querySelectorAll(".quick-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("user-request").value = btn.dataset.request;
            document.querySelectorAll(".mode-btn")[0].click(); // Переключаемся на AI
        });
    });
    
    // Сохранение API ключа
    document.getElementById("api-key").addEventListener("change", (e) => {
        localStorage.setItem("groq_api_key", e.target.value);
    });
}

// Загрузка API ключа
function loadApiKey() {
    const saved = localStorage.getItem("groq_api_key");
    if (saved) {
        document.getElementById("api-key").value = saved;
    }
}

// Генерация через AI
async function generateWithAI() {
    const request = document.getElementById("user-request").value.trim();
    const apiKey = document.getElementById("api-key").value.trim();
    
    if (!request) {
        showError("Введи описание задания!");
        return;
    }
    
    if (!apiKey) {
        showError("Введи API ключ Groq! Получить бесплатно: console.groq.com");
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

// Создание из конструктора
function createFromConstructor() {
    const title = document.getElementById("custom-title").value;
    const subtitle = document.getElementById("custom-subtitle").value;
    const motivation = document.getElementById("custom-motivation").value;
    const count = parseInt(document.getElementById("tasks-count").value);
    
    const tasks = [];
    for (let i = 0; i < count; i++) {
        const elements = document.getElementById(`task-elements-${i}`).value.split("\n").filter(e => e.trim());
        const answers = document.getElementById(`task-answers-${i}`).value.split("\n").filter(a => a.trim());
        
        tasks.push({
            level: LEVEL_ICONS[i] || "⭐",
            level_name: document.getElementById(`task-name-${i}`).value,
            instruction: document.getElementById(`task-instr-${i}`).value,
            content: document.getElementById(`task-content-${i}`).value,
            elements: elements,
            answers: answers
        });
    }
    
    currentWorksheet = { title, subtitle, tasks, motivation };
    showResult();
}

// Показать результат
function showResult() {
    if (!currentWorksheet) return;
    
    document.getElementById("empty-state").classList.add("hidden");
    document.getElementById("result-section").classList.remove("hidden");
    
    document.getElementById("result-title").textContent = currentWorksheet.title;
    document.getElementById("result-subtitle").textContent = currentWorksheet.subtitle;
    
    const tasks = currentWorksheet.tasks || [];
    const totalElements = tasks.reduce((sum, t) => sum + (t.elements?.length || 0), 0);
    
    document.getElementById("stat-tasks").textContent = tasks.length;
    document.getElementById("stat-elements").textContent = totalElements;
    document.getElementById("stat-theme").textContent = document.getElementById("theme-select").value;
    
    // Предпросмотр заданий
    const preview = document.getElementById("tasks-preview");
    preview.innerHTML = tasks.map((task, i) => `
        <div class="task-preview">
            <h4>${task.level} ${task.level_name}</h4>
            <div class="instruction">📝 ${task.instruction}</div>
            ${task.content ? `<p>${task.content}</p>` : ""}
            <div class="elements">
                ${(task.elements || []).map(el => `<span class="element-chip">${el}</span>`).join("")}
            </div>
        </div>
    `).join("");
    
    document.getElementById("motivation-box").textContent = "🎉 " + currentWorksheet.motivation;
}

// Скрыть результат
function hideResult() {
    document.getElementById("result-section").classList.add("hidden");
    document.getElementById("empty-state").classList.remove("hidden");
}

// Загрузка
function showLoading(show) {
    document.getElementById("loading").classList.toggle("hidden", !show);
}

// Ошибка
function showError(message) {
    const el = document.getElementById("error-message");
    el.textContent = "❌ " + message;
    el.classList.remove("hidden");
}

function hideError() {
    document.getElementById("error-message").classList.add("hidden");
}