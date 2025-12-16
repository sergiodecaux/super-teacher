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
// ГЕНЕРАЦИЯ AI
// ═══════════════════════════════════════════════════════

async function generateWithAI() {
    var apiKeyInput = document.getElementById("api-key");
    var apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";
    
    // Получаем промпт
    var request = "";
    if (typeof getBuiltPrompt === "function") {
        request = getBuiltPrompt();
    }
    
    if (!request) {
        showError("Выбери тему!");
        return;
    }
    
    if (!apiKey) {
        showError("Введи API ключ Groq!");
        return;
    }
    
    console.log("📝 Промпт:", request);
    
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
    if (statTheme) statTheme.textContent = theme.emoji + " " + theme.name;
    
    if (preview) {
        var html = "";
        for (var j = 0; j < tasks.length; j++) {
            var task = tasks[j];
            var color = LEVEL_COLORS[j % LEVEL_COLORS.length];
            
            var elementsHtml = "";
            var elems = task.elements || [];
            for (var k = 0; k < Math.min(elems.length, 6); k++) {
                elementsHtml += '<span class="element-chip">' + elems[k] + '</span>';
            }
            if (elems.length > 6) {
                elementsHtml += '<span class="element-chip more">+' + (elems.length - 6) + '</span>';
            }
            
            html += 
                '<div class="task-preview" style="border-left: 4px solid ' + color + '">' +
                    '<h4>' + task.level + ' ' + task.level_name + '</h4>' +
                    '<div class="instruction">📝 ' + task.instruction + '</div>' +
                    (task.content ? '<p>' + task.content + '</p>' : '') +
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
