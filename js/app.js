// ═══════════════════════════════════════════════════════
// СОСТОЯНИЕ
// ═══════════════════════════════════════════════════════

var currentWorksheet = null;
var currentMode = "ai";


// ═══════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Страница загружена");
    console.log("📦 generateWorksheet:", typeof generateWorksheet);
    console.log("📦 callGroqAI:", typeof callGroqAI);
    
    initModeButtons();
    initPromptBuilder();
    initConstructor();
    initButtons();
    loadApiKey();
});


// ═══════════════════════════════════════════════════════
// РЕЖИМЫ
// ═══════════════════════════════════════════════════════

function initModeButtons() {
    var buttons = document.querySelectorAll(".mode-btn");
    buttons.forEach(function(btn) {
        btn.addEventListener("click", function() {
            buttons.forEach(function(b) { b.classList.remove("active"); });
            btn.classList.add("active");
            
            currentMode = btn.dataset.mode;
            
            var aiMode = document.getElementById("ai-mode");
            var constructorMode = document.getElementById("constructor-mode");
            var resultSection = document.getElementById("result-section");
            
            if (aiMode) aiMode.classList.toggle("hidden", currentMode !== "ai");
            if (constructorMode) constructorMode.classList.toggle("hidden", currentMode !== "constructor");
            if (resultSection) resultSection.classList.add("hidden");
        });
    });
}


// ═══════════════════════════════════════════════════════
// КОНСТРУКТОР
// ═══════════════════════════════════════════════════════

function initConstructor() {
    var slider = document.getElementById("tasks-count");
    var value = document.getElementById("tasks-count-value");
    
    if (slider && value) {
        slider.addEventListener("input", function() {
            value.textContent = slider.value;
            renderTaskCards(parseInt(slider.value));
        });
        renderTaskCards(3);
    }
}

function renderTaskCards(count) {
    var container = document.getElementById("tasks-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    for (var i = 0; i < count; i++) {
        var color = LEVEL_COLORS[i % LEVEL_COLORS.length];
        var icon = LEVEL_ICONS[i % LEVEL_ICONS.length];
        var name = LEVEL_NAMES[i % LEVEL_NAMES.length];
        
        container.innerHTML += 
            '<div class="task-card" style="border-left: 4px solid ' + color + '">' +
                '<h4>' + icon + ' Задание ' + (i + 1) + '</h4>' +
                '<div class="input-group">' +
                    '<label>Название:</label>' +
                    '<input type="text" id="task-name-' + i + '" value="' + name + '">' +
                '</div>' +
                '<div class="input-group">' +
                    '<label>Инструкция:</label>' +
                    '<input type="text" id="task-instr-' + i + '" value="Выполни задание.">' +
                '</div>' +
                '<div class="input-group">' +
                    '<label>Элементы (по одному на строку):</label>' +
                    '<textarea id="task-elem-' + i + '" rows="4">2 + 3 = __\n4 + 1 = __\n5 + 2 = __</textarea>' +
                '</div>' +
                '<div class="input-group">' +
                    '<label>Ответы (по одному на строку):</label>' +
                    '<textarea id="task-ans-' + i + '" rows="4">5\n5\n7</textarea>' +
                '</div>' +
            '</div>';
    }
}


// ═══════════════════════════════════════════════════════
// КНОПКИ
// ═══════════════════════════════════════════════════════

function initButtons() {
    var generateBtn = document.getElementById("generate-btn");
    var demoBtn = document.getElementById("demo-btn");
    var createBtn = document.getElementById("create-worksheet-btn");
    var downloadWorksheetBtn = document.getElementById("download-worksheet");
    var downloadAnswersBtn = document.getElementById("download-answers");
    var backBtn = document.getElementById("back-btn");
    var apiKeyInput = document.getElementById("api-key");
    
    if (generateBtn) {
        generateBtn.addEventListener("click", generateWithAI);
    }
    
    if (demoBtn) {
        demoBtn.addEventListener("click", function() {
            currentWorksheet = DEMO_WORKSHEET;
            showResult();
        });
    }
    
    if (createBtn) {
        createBtn.addEventListener("click", createFromConstructor);
    }
    
    if (downloadWorksheetBtn) {
        downloadWorksheetBtn.addEventListener("click", function() {
            if (currentWorksheet && typeof generateWorksheetHTML === "function") {
                var theme = document.getElementById("theme-select");
                var themeValue = theme ? theme.value : "default";
                var html = generateWorksheetHTML(currentWorksheet, themeValue);
                downloadHTML(html, "worksheet_" + Date.now() + ".html");
            }
        });
    }
    
    if (downloadAnswersBtn) {
        downloadAnswersBtn.addEventListener("click", function() {
            if (currentWorksheet && typeof generateAnswersHTML === "function") {
                var html = generateAnswersHTML(currentWorksheet);
                downloadHTML(html, "answers_" + Date.now() + ".html");
            }
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener("click", function() {
            var resultSection = document.getElementById("result-section");
            if (resultSection) resultSection.classList.add("hidden");
        });
    }
    
    if (apiKeyInput) {
        apiKeyInput.addEventListener("input", function(e) {
            localStorage.setItem("groq_api_key", e.target.value);
        });
    }
}


// ═══════════════════════════════════════════════════════
// API КЛЮЧ
// ═══════════════════════════════════════════════════════

function loadApiKey() {
    var saved = localStorage.getItem("groq_api_key");
    if (saved) {
        var input = document.getElementById("api-key");
        if (input) input.value = saved;
    }
}


// ═══════════════════════════════════════════════════════
// ГЕНЕРАЦИЯ ЗАДАНИЙ (ГЛАВНАЯ ФУНКЦИЯ)
// ═══════════════════════════════════════════════════════

async function generateWithAI() {
    // Получаем параметры из конструктора промптов
    var subject = document.getElementById("subject-select")?.value || "";
    var grade = document.getElementById("grade-select")?.value || "";
    var topic = document.getElementById("topic-select")?.value || "";
    var customTopic = document.getElementById("custom-topic")?.value?.trim() || "";
    var tasksNum = parseInt(document.getElementById("tasks-num")?.value) || 5;
    var difficulty = document.querySelector(".diff-btn.active")?.dataset.diff || "mixed";
    
    // Определяем тему
    var finalTopic = customTopic || topic;
    
    if (!subject) {
        showError("Выбери предмет!");
        return;
    }
    
    if (!finalTopic) {
        showError("Выбери или напиши тему!");
        return;
    }
    
    console.log("📝 Генерация:", subject, grade, finalTopic);
    
    // Получаем выбранные типы заданий
    var taskTypes = [];
    document.querySelectorAll("#task-types input:checked").forEach(function(cb) {
        taskTypes.push(cb.value);
    });
    
    showLoading(true);
    hideError();
    
    try {
        // Сначала пробуем локальную генерацию
        if (typeof generateWorksheet === "function") {
            console.log("🎲 Пробуем локальную генерацию...");
            
            var localResult = generateWorksheet(subject, grade, finalTopic, taskTypes, difficulty, tasksNum);
            
            if (localResult) {
                console.log("✅ Локальная генерация успешна!");
                currentWorksheet = localResult;
                showResult();
                showLoading(false);
                return;
            }
            
            console.log("⚠️ Локальный генератор не найден для этой темы, используем AI...");
        }
        
        // Если локальная генерация не сработала — используем AI
        var apiKeyInput = document.getElementById("api-key");
        var apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";
        
        if (!apiKey) {
            showError("Для этой темы нужен API ключ Groq. Получи бесплатно: console.groq.com/keys");
            showLoading(false);
            return;
        }
        
        // Формируем промпт для AI
        var request = "";
        if (typeof getBuiltPrompt === "function") {
            request = getBuiltPrompt();
        } else {
            request = subject + ", " + grade + " класс. Тема: " + finalTopic;
        }
        
        console.log("🤖 Запрос к AI:", request);
        
        if (typeof callGroqAI === "function") {
            currentWorksheet = await callGroqAI(request, apiKey);
            showResult();
        } else {
            throw new Error("AI модуль не загружен");
        }
        
    } catch (error) {
        console.error("❌ Ошибка:", error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}


// ═══════════════════════════════════════════════════════
// СОЗДАНИЕ ИЗ КОНСТРУКТОРА
// ═══════════════════════════════════════════════════════

function createFromConstructor() {
    var titleInput = document.getElementById("custom-title");
    var subtitleInput = document.getElementById("custom-subtitle");
    var motivationInput = document.getElementById("custom-motivation");
    var countInput = document.getElementById("tasks-count");
    
    var title = titleInput ? titleInput.value : "Мои задания";
    var subtitle = subtitleInput ? subtitleInput.value : "";
    var motivation = motivationInput ? motivationInput.value : "Молодец! ⭐";
    var count = countInput ? parseInt(countInput.value) : 3;
    
    var tasks = [];
    
    for (var i = 0; i < count; i++) {
        var elemInput = document.getElementById("task-elem-" + i);
        var ansInput = document.getElementById("task-ans-" + i);
        var nameInput = document.getElementById("task-name-" + i);
        var instrInput = document.getElementById("task-instr-" + i);
        
        var elemText = elemInput ? elemInput.value : "";
        var ansText = ansInput ? ansInput.value : "";
        
        var elements = elemText.split("\n").map(function(e) { return e.trim(); }).filter(function(e) { return e; });
        var answers = ansText.split("\n").map(function(a) { return a.trim(); }).filter(function(a) { return a; });
        
        if (elements.length > 0) {
            tasks.push({
                level: LEVEL_ICONS[i % LEVEL_ICONS.length],
                level_name: nameInput ? nameInput.value : LEVEL_NAMES[i % LEVEL_NAMES.length],
                instruction: instrInput ? instrInput.value : "Выполни задание.",
                content: "",
                elements: elements,
                answers: answers
            });
        }
    }
    
    if (tasks.length === 0) {
        alert("Добавь хотя бы одно задание!");
        return;
    }
    
    currentWorksheet = {
        title: title,
        subtitle: subtitle,
        tasks: tasks,
        motivation: motivation
    };
    
    showResult();
}


// ═══════════════════════════════════════════════════════
// ОТОБРАЖЕНИЕ РЕЗУЛЬТАТА
// ═══════════════════════════════════════════════════════

function showResult() {
    if (!currentWorksheet) return;
    
    var resultSection = document.getElementById("result-section");
    var resultTitle = document.getElementById("result-title");
    var resultSubtitle = document.getElementById("result-subtitle");
    var statTasks = document.getElementById("stat-tasks");
    var statElements = document.getElementById("stat-elements");
    var statTheme = document.getElementById("stat-theme");
    var preview = document.getElementById("tasks-preview");
    var motivationBox = document.getElementById("motivation-box");
    
    if (resultSection) resultSection.classList.remove("hidden");
    if (resultTitle) resultTitle.textContent = currentWorksheet.title;
    if (resultSubtitle) resultSubtitle.textContent = currentWorksheet.subtitle;
    
    var tasks = currentWorksheet.tasks || [];
    var totalElements = 0;
    for (var i = 0; i < tasks.length; i++) {
        totalElements += (tasks[i].elements ? tasks[i].elements.length : 0);
    }
    
    if (statTasks) statTasks.textContent = tasks.length;
    if (statElements) statElements.textContent = totalElements;
    
    var themeSelect = document.getElementById("theme-select");
    var themeName = themeSelect ? themeSelect.value : "default";
    var theme = THEMES[themeName] || THEMES.default;

    // Цвета темы для предпросмотра
    var themeStyles;
    if (typeof PRINT_THEMES !== "undefined") {
        themeStyles = PRINT_THEMES[themeName] || PRINT_THEMES.default;
    } else {
        themeStyles = { bg: "#f8f9fa", accent: "#7c3aed" };
    }

    if (statTheme) statTheme.textContent = theme.emoji + " " + theme.name;
    
    if (preview) {
        var html = "";
        var mascotSrc = "img/themes/" + themeName + "/mascot.svg";
        var bgColor = themeStyles.bg || "#ffffff";

        for (var j = 0; j < tasks.length; j++) {
            var task = tasks[j];
            var color = LEVEL_COLORS[j % LEVEL_COLORS.length];
            
            var elementsHtml = "";
            var elems = task.elements || [];
            for (var k = 0; k < Math.min(elems.length, 6); k++) {
                elementsHtml += '<span class="element-chip">' + escapeHtml(elems[k]) + '</span>';
            }
            if (elems.length > 6) {
                elementsHtml += '<span class="element-chip more">+' + (elems.length - 6) + '</span>';
            }
            
            html += 
                '<div class="task-preview" style="border-left: 4px solid ' + color + '; background:' + bgColor + ';">' +
                    '<div class="task-preview-header">' +
                        '<h4 class="task-preview-title">' + escapeHtml(task.level || "") + ' ' + escapeHtml(task.level_name || ("Задание " + (j + 1))) + '</h4>' +
                        '<img class="task-mascot" src="' + mascotSrc + '" alt="Тема: ' + escapeHtml(theme.name) + '">' +
                    '</div>' +
                    '<div class="instruction">📝 ' + escapeHtml(task.instruction || "Выполни задание.") + '</div>' +
                    (task.content ? '<p>' + escapeHtml(task.content) + '</p>' : '') +
                    '<div class="elements">' + elementsHtml + '</div>' +
                '</div>';
        }
        preview.innerHTML = html;
    }
    
    if (motivationBox) {
        motivationBox.textContent = "🎉 " + currentWorksheet.motivation;
    }
    
    if (resultSection) {
        resultSection.scrollIntoView({ behavior: "smooth" });
    }
}

// Экранирование HTML для безопасности
function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// ═══════════════════════════════════════════════════════
// ЗАГРУЗКА И ОШИБКИ
// ═══════════════════════════════════════════════════════

function showLoading(show) {
    var loading = document.getElementById("loading");
    var generateBtn = document.getElementById("generate-btn");
    
    if (loading) {
        if (show) {
            loading.classList.remove("hidden");
        } else {
            loading.classList.add("hidden");
        }
    }
    
    if (generateBtn) {
        generateBtn.disabled = show;
        generateBtn.textContent = show ? "⏳ Генерация..." : "✨ Создать задания";
    }
}

function showError(message) {
    var errorEl = document.getElementById("error-message");
    if (errorEl) {
        errorEl.textContent = "❌ " + message;
        errorEl.classList.remove("hidden");
    }
}

function hideError() {
    var errorEl = document.getElementById("error-message");
    if (errorEl) {
        errorEl.classList.add("hidden");
    }
}

function downloadHTML(content, filename) {
    var blob = new Blob([content], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}