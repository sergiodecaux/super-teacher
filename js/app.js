// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// AI.JS - РАБОТА С API
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════

const API_URL = "/api/groq";
const MODELS = ["llama-3.1-70b-versatile", "llama-3.1-8b-instant"];
const TEMPERATURE = 0.3;

const SYSTEM_PROMPT = `Ты генератор учебных карточек для начальной школы России.
Возвращай ТОЛЬКО JSON. Никакого текста до или после JSON.`;

const TEMPLATES = {
    "окончан": {
        title: "📝 Окончания существительных",
        subtitle: "Русский язык, 3-4 класс"
    },
    "склонен": {
        title: "📚 Склонение существительных", 
        subtitle: "Русский язык, 3-4 класс"
    },
    "падеж": {
        title: "📖 Падежи существительных",
        subtitle: "Русский язык, 3-4 класс"
    },
    "спряжен": {
        title: "🔤 Спряжение глаголов",
        subtitle: "Русский язык, 4 класс"
    },
    "математ": {
        title: "🧮 Математика",
        subtitle: "Примеры и задачи"
    }
};

function buildPrompt(userRequest) {
    const requestLower = userRequest.toLowerCase();
    
    let template = { title: "📝 Рабочий лист", subtitle: "" };
    for (const [key, tmpl] of Object.entries(TEMPLATES)) {
        if (new RegExp(key, 'i').test(requestLower)) {
            template = tmpl;
            break;
        }
    }

    return `Создай 5 учебных карточек.

ТЕМА: ${userRequest}
НАЗВАНИЕ: ${template.title}

Каждая карточка должна содержать:
- level: "⭐" до "⭐⭐⭐⭐⭐"
- level_name: название задания
- instruction: что делать ученику
- elements: массив из 6-8 заданий с пропусками (_) или вопросами (?)
- answers: массив правильных ответов

ПРИМЕР ПРАВИЛЬНОГО ЗАДАНИЯ:
{
  "level": "⭐",
  "level_name": "Вставь окончание",
  "instruction": "Вставь пропущенное окончание существительного.",
  "content": "",
  "elements": [
    "на парт_ (на чём?)",
    "у дорог_ (у чего?)",
    "к бабушк_ (к кому?)",
    "в тетрад_ (в чём?)",
    "без сол_ (без чего?)",
    "о мам_ (о ком?)"
  ],
  "answers": [
    "на партЕ (1 скл., П.п.)",
    "у дорогИ (1 скл., Р.п.)",
    "к бабушкЕ (1 скл., Д.п.)",
    "в тетрадИ (3 скл., П.п.)",
    "без солИ (3 скл., Р.п.)",
    "о мамЕ (1 скл., П.п.)"
  ]
}

ВАЖНО:
- elements — это ЗАДАНИЯ с пропусками, НЕ готовые ответы!
- Пропуски обозначай символом _
- В каждом задании 6-8 элементов

ВЕРНИ ТОЛЬКО JSON:
{
  "title": "${template.title}",
  "subtitle": "${template.subtitle}",
  "tasks": [...5 заданий...],
  "motivation": "Молодец! ⭐"
}`;
}

async function callGroqAI(userRequest, apiKey) {
    console.log("🚀 callGroqAI:", userRequest);
    
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
                    temperature: TEMPERATURE
                })
            });
            
            if (response.status === 429) {
                console.log("⚠️ Лимит, ждём...");
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
            
            console.log("📄 Ответ:", text.substring(0, 200));
            
            const worksheet = parseWorksheet(text);
            if (worksheet) return worksheet;
            
        } catch (error) {
            console.error(`❌ ${model}:`, error.message);
            continue;
        }
    }
    
    throw new Error("Ошибка генерации. Попробуй ещё раз.");
}

function parseWorksheet(text) {
    text = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    
    try {
        const json = JSON.parse(
            match[0].replace(/,\s*}/g, "}").replace(/,\s*]/g, "]")
        );
        
        if (!json.tasks?.length) return null;
        
        const levels = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
        
        json.tasks = json.tasks.map((task, i) => ({
            level: task.level || levels[i],
            level_name: task.level_name || `Задание ${i+1}`,
            instruction: task.instruction || "Выполни задание.",
            content: task.content || "",
            elements: Array.isArray(task.elements) ? task.elements.filter(x => x) : [],
            answers: Array.isArray(task.answers) ? task.answers.filter(x => x) : []
        })).filter(t => t.elements.length > 0 || t.content);
        
        return {
            title: json.title || "Рабочий лист",
            subtitle: json.subtitle || "",
            tasks: json.tasks,
            motivation: json.motivation || "Молодец! ⭐"
        };
    } catch (e) {
        console.error("❌ Парсинг:", e.message);
        return null;
    }
}


// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// APP.JS - ОСНОВНАЯ ЛОГИКА
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════

let currentWorksheet = null;
let currentMode = "ai";

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM загружен");
    initModeButtons();
    if (typeof initPromptBuilder === 'function') initPromptBuilder();
    initConstructor();
    initButtons();
    loadApiKey();
});

function initModeButtons() {
    document.querySelectorAll(".mode-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentMode = btn.dataset.mode;
            document.getElementById("ai-mode")?.classList.toggle("hidden", currentMode !== "ai");
            document.getElementById("constructor-mode")?.classList.toggle("hidden", currentMode !== "constructor");
            document.getElementById("result-section")?.classList.add("hidden");
        });
    });
}

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
    
    const levels = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
    const names = ["Разминка", "Тренировка", "Закрепление", "Сложное", "Мастер"];
    const colors = ["#4CAF50", "#8BC34A", "#FFC107", "#FF9800", "#f44336"];
    
    container.innerHTML = "";
    
    for (let i = 0; i < count; i++) {
        container.innerHTML += `
        <div class="task-card" style="border-left: 4px solid ${colors[i % 5]}">
            <h4>${levels[i % 5]} Задание ${i + 1}</h4>
            <div class="input-group">
                <label>Название:</label>
                <input type="text" id="task-name-${i}" value="${names[i % 5]}">
            </div>
            <div class="input-group">
                <label>Инструкция:</label>
                <input type="text" id="task-instr-${i}" value="Выполни задание.">
            </div>
            <div class="input-group">
                <label>Элементы (по одному на строку):</label>
                <textarea id="task-elem-${i}" rows="4">2+3=_
4+1=_
5+2=_</textarea>
            </div>
            <div class="input-group">
                <label>Ответы (по одному на строку):</label>
                <textarea id="task-ans-${i}" rows="4">5
5
7</textarea>
            </div>
        </div>`;
    }
}

function initButtons() {
    document.getElementById("generate-btn")?.addEventListener("click", generateWithAI);
    
    document.getElementById("demo-btn")?.addEventListener("click", () => {
        if (typeof DEMO_WORKSHEET !== 'undefined') {
            currentWorksheet = DEMO_WORKSHEET;
            showResult();
        }
    });
    
    document.getElementById("create-worksheet-btn")?.addEventListener("click", createFromConstructor);
    
    document.getElementById("download-worksheet")?.addEventListener("click", () => {
        if (currentWorksheet && typeof generateWorksheetHTML === 'function') {
            const theme = document.getElementById("theme-select")?.value || "default";
            const html = generateWorksheetHTML(currentWorksheet, theme);
            downloadHTML(html, `worksheet_${Date.now()}.html`);
        }
    });
    
    document.getElementById("download-answers")?.addEventListener("click", () => {
        if (currentWorksheet && typeof generateAnswersHTML === 'function') {
            const html = generateAnswersHTML(currentWorksheet);
            downloadHTML(html, `answers_${Date.now()}.html`);
        }
    });
    
    document.getElementById("back-btn")?.addEventListener("click", () => {
        document.getElementById("result-section")?.classList.add("hidden");
    });
    
    const apiKeyInput = document.getElementById("api-key");
    if (apiKeyInput) {
        apiKeyInput.addEventListener("input", (e) => {
            localStorage.setItem("groq_api_key", e.target.value);
        });
    }
}

function loadApiKey() {
    const saved = localStorage.getItem("groq_api_key");
    if (saved) {
        const input = document.getElementById("api-key");
        if (input) input.value = saved;
    }
}

async function generateWithAI() {
    const apiKey = document.getElementById("api-key")?.value?.trim();
    
    // Получаем промпт
    let request = "";
    if (typeof getBuiltPrompt === 'function') {
        request = getBuiltPrompt();
    }
    if (!request) {
        request = document.getElementById("user-request")?.value?.trim() || "";
    }
    
    if (!request) {
        showError("Выбери тему или напиши запрос!");
        return;
    }
    
    if (!apiKey) {
        showError("Введи API ключ Groq!");
        return;
    }
    
    console.log("📝 Запрос:", request);
    
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

function createFromConstructor() {
    const title = document.getElementById("custom-title")?.value || "Мои задания";
    const subtitle = document.getElementById("custom-subtitle")?.value || "";
    const motivation = document.getElementById("custom-motivation")?.value || "Молодец! ⭐";
    const count = parseInt(document.getElementById("tasks-count")?.value || "3");
    
    const levels = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
    const tasks = [];
    
    for (let i = 0; i < count; i++) {
        const elements = (document.getElementById(`task-elem-${i}`)?.value || "")
            .split("\n").map(e => e.trim()).filter(e => e);
        const answers = (document.getElementById(`task-ans-${i}`)?.value || "")
            .split("\n").map(a => a.trim()).filter(a => a);
        
        if (elements.length > 0) {
            tasks.push({
                level: levels[i % 5],
                level_name: document.getElementById(`task-name-${i}`)?.value || `Задание ${i+1}`,
                instruction: document.getElementById(`task-instr-${i}`)?.value || "Выполни задание.",
                content: "",
                elements,
                answers
            });
        }
    }
    
    if (tasks.length === 0) {
        alert("Добавь хотя бы одно задание!");
        return;
    }
    
    currentWorksheet = { title, subtitle, tasks, motivation };
    showResult();
}

function showResult() {
    if (!currentWorksheet) return;
    
    document.getElementById("result-section")?.classList.remove("hidden");
    document.getElementById("result-title").textContent = currentWorksheet.title;
    document.getElementById("result-subtitle").textContent = currentWorksheet.subtitle;
    
    const tasks = currentWorksheet.tasks || [];
    const totalElements = tasks.reduce((sum, t) => sum + (t.elements?.length || 0), 0);
    
    document.getElementById("stat-tasks").textContent = tasks.length;
    document.getElementById("stat-elements").textContent = totalElements;
    
    const preview = document.getElementById("tasks-preview");
    if (preview) {
        preview.innerHTML = tasks.map((task, i) => {
            const colors = ["#4CAF50", "#8BC34A", "#FFC107", "#FF9800", "#f44336"];
            const elementsHtml = (task.elements || []).slice(0, 6)
                .map(el => `<span class="element-chip">${el}</span>`).join("");
            
            return `
            <div class="task-preview" style="border-left: 4px solid ${colors[i % 5]}">
                <h4>${task.level} ${task.level_name}</h4>
                <p class="instruction">📝 ${task.instruction}</p>
                ${task.content ? `<p>${task.content}</p>` : ''}
                <div class="elements">${elementsHtml}</div>
            </div>`;
        }).join("");
    }
    
    document.getElementById("motivation-box").textContent = "🎉 " + currentWorksheet.motivation;
    document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
}

function showLoading(show) {
    document.getElementById("loading")?.classList.toggle("hidden", !show);
    const btn = document.getElementById("generate-btn");
    if (btn) {
        btn.disabled = show;
        btn.textContent = show ? "⏳ Генерация..." : "✨ Создать задания";
    }
}

function showError(message) {
    const el = document.getElementById("error-message");
    if (el) {
        el.textContent = "❌ " + message;
        el.classList.remove("hidden");
    }
}

function hideError() {
    document.getElementById("error-message")?.classList.add("hidden");
}

function downloadHTML(content, filename) {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}