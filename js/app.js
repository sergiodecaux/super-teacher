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
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// AI ФУНКЦИИ (добавлено в app.js)
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════

var AI_API_URL = "/api/groq";
var AI_MODELS = ["llama-3.1-70b-versatile", "llama-3.1-8b-instant"];
var AI_TEMPERATURE = 0.3;
var AI_SYSTEM_PROMPT = "Ты генератор учебных карточек для начальной школы России. Возвращай ТОЛЬКО JSON.";

var AI_TOPIC_DATA = {
"окончан": {"title":"📝 Окончания существительных","subtitle":"Русский язык, 3-4 класс","tasks":[{"level":"⭐","level_name":"Вставь окончание","instruction":"Вставь пропущенное окончание. Определи склонение и падеж.","content":"","elements":["на парт_ (на чём?)","у дорог_ (у чего?)","к бабушк_ (к кому?)","в тетрад_ (в чём?)","без сол_ (без чего?)","о мам_ (о ком?)"],"answers":["на партЕ (1 скл., П.п.)","у дорогИ (1 скл., Р.п.)","к бабушкЕ (1 скл., Д.п.)","в тетрадИ (3 скл., П.п.)","без солИ (3 скл., Р.п.)","о мамЕ (1 скл., П.п.)"]},{"level":"⭐⭐","level_name":"Е или И?","instruction":"Выбери правильное окончание: Е или И?","content":"Помни: в 3 склонении в Р.п., Д.п., П.п. пишется И","elements":["на площад_ (-е/-и)","в деревн_ (-е/-и)","к подруг_ (-е/-и)","в тетрад_ (-е/-и)","на лошад_ (-е/-и)","о жизн_ (-е/-и)"],"answers":["на площадИ (3 скл., П.п.)","в деревнЕ (1 скл., П.п.)","к подругЕ (1 скл., Д.п.)","в тетрадИ (3 скл., П.п.)","на лошадИ (3 скл., П.п.)","о жизнИ (3 скл., П.п.)"]},{"level":"⭐⭐⭐","level_name":"Текст с пропусками","instruction":"Спиши, вставляя пропущенные окончания.","content":"От деревн_ до речк_ дорога шла через поле. У дорог_ росла берёза.","elements":["от деревн_ →","до речк_ →","у дорог_ →"],"answers":["от деревнИ (Р.п.)","до речкИ (Р.п.)","у дорогИ (Р.п.)"]},{"level":"⭐⭐⭐⭐","level_name":"Исправь ошибки","instruction":"Найди и исправь ошибки в окончаниях.","content":"","elements":["Дети играли на площаде.","Книга лежит на столи.","Мы говорили о жизне."],"answers":["на площадИ","на столЕ","о жизнИ"]},{"level":"⭐⭐⭐⭐⭐","level_name":"Поставь в падеж","instruction":"Поставь слово в скобках в нужный падеж.","content":"","elements":["подойти к (изгородь) →","мечтать о (профессия) →","дойти до (площадь) →"],"answers":["к изгородИ","о профессиИ","до площадИ"]}],"motivation":"Отлично! 🌟"},
"склонен": {"title":"📚 Склонение существительных","subtitle":"Русский язык, 3-4 класс","tasks":[{"level":"⭐","level_name":"Определи склонение","instruction":"Определи склонение существительного.","content":"1 скл. — ж.р. и м.р. на -а/-я; 2 скл. — м.р. и ср.р.; 3 скл. — ж.р. на ь","elements":["земля — ?","конь — ?","ночь — ?","дядя — ?","солнце — ?","мышь — ?"],"answers":["1 скл.","2 скл.","3 скл.","1 скл.","2 скл.","3 скл."]},{"level":"⭐⭐","level_name":"Распредели","instruction":"Запиши слова в три столбика.","content":"Слова: метель, черешня, корабль, загадка, степь, вода","elements":["1 склонение:","2 склонение:","3 склонение:"],"answers":["черешня, загадка, вода","корабль","метель, степь"]},{"level":"⭐⭐⭐","level_name":"Подбери другое склонение","instruction":"Подбери близкое по значению слово другого склонения.","content":"","elements":["папа (1 скл.) →","лошадка (1 скл.) →","мышка (1 скл.) →"],"answers":["отец (2 скл.)","лошадь (3 скл.)","мышь (3 скл.)"]},{"level":"⭐⭐⭐⭐","level_name":"Найди в тексте","instruction":"Выпиши существительные, определи склонение.","content":"Бабушка повела Надю на ферму. Ночь была тёплой.","elements":["Выпиши существительные:"],"answers":["бабушка(1), Надю(1), ферму(1), ночь(3)"]},{"level":"⭐⭐⭐⭐⭐","level_name":"Сложные случаи","instruction":"Определи склонение особых слов.","content":"","elements":["путь — ?","время — ?","кофе — ?"],"answers":["разносклоняемое","разносклоняемое","несклоняемое"]}],"motivation":"Молодец! 📚"},
"падеж": {"title":"📖 Падежи существительных","subtitle":"Русский язык, 3-4 класс","tasks":[{"level":"⭐","level_name":"Определи падеж","instruction":"Определи падеж выделенного существительного.","content":"","elements":["МАЛЬЧИК читает.","Вижу СОБАКУ.","Подарок для МАМЫ.","Иду к БАБУШКЕ.","Горжусь БРАТОМ.","Думаю о ЛЕТЕ."],"answers":["И.п.","В.п.","Р.п.","Д.п.","Т.п.","П.п."]},{"level":"⭐⭐","level_name":"Поставь в падеж","instruction":"Поставь слово в нужный падеж.","content":"","elements":["для (сестра) →","к (школа) →","с (друг) →","о (книга) →"],"answers":["для сестрЫ","к школЕ","с другОМ","о книгЕ"]},{"level":"⭐⭐⭐","level_name":"Вопросы падежей","instruction":"Напиши вопросы каждого падежа.","content":"","elements":["И.п. — ?","Р.п. — ?","Д.п. — ?","В.п. — ?","Т.п. — ?","П.п. — ?"],"answers":["кто? что?","кого? чего?","кому? чему?","кого? что?","кем? чем?","о ком? о чём?"]},{"level":"⭐⭐⭐⭐","level_name":"Просклоняй","instruction":"Просклоняй слово КНИГА.","content":"","elements":["И.п. —","Р.п. —","Д.п. —","В.п. —","Т.п. —","П.п. —"],"answers":["книга","книги","книге","книгу","книгой","о книге"]},{"level":"⭐⭐⭐⭐⭐","level_name":"Составь предложения","instruction":"Поставь слова в нужный падеж.","content":"","elements":["(Девочка) читает (книга).","Мы идём к (река)."],"answers":["Девочка читает книгу.","Мы идём к реке."]}],"motivation":"Ты знаешь падежи! 📖"},
"спряжен": {"title":"🔤 Спряжение глаголов","subtitle":"Русский язык, 4 класс","tasks":[{"level":"⭐","level_name":"Определи спряжение","instruction":"Определи спряжение глагола.","content":"","elements":["читать — ?","говорить — ?","писать — ?","смотреть — ?","играть — ?","строить — ?"],"answers":["I спр.","II спр.","I спр.","II спр. (искл.)","I спр.","II спр."]},{"level":"⭐⭐","level_name":"Вставь окончание","instruction":"Вставь окончание глагола.","content":"","elements":["он чита_т","они говор_т","мы пиш_м","ты смотр_шь"],"answers":["читаЕт","говорЯт","пишЕм","смотрИшь"]},{"level":"⭐⭐⭐","level_name":"Глаголы-исключения","instruction":"Запиши глаголы-исключения II спряжения.","content":"","elements":["4 на -АТЬ:","7 на -ЕТЬ:"],"answers":["гнать, держать, дышать, слышать","видеть, ненавидеть, смотреть, вертеть, обидеть, зависеть, терпеть"]},{"level":"⭐⭐⭐⭐","level_name":"Е или И?","instruction":"Выбери окончание.","content":"","elements":["он дыш_т","они слыш_т","мы вид_м"],"answers":["дышИт","слышАт","видИм"]},{"level":"⭐⭐⭐⭐⭐","level_name":"Проспрягай","instruction":"Проспрягай глагол ПИСАТЬ.","content":"","elements":["я —","ты —","он —","мы —","вы —","они —"],"answers":["пишу","пишешь","пишет","пишем","пишете","пишут"]}],"motivation":"Ты освоил спряжение! 🔤"}
};

function buildAIPrompt(userRequest) {
    var requestLower = userRequest.toLowerCase();
    var example = null;
    
    for (var key in AI_TOPIC_DATA) {
        if (requestLower.indexOf(key) !== -1) {
            example = AI_TOPIC_DATA[key];
            break;
        }
    }
    
    if (example) {
        return "Создай рабочий лист похожий на этот, но с ДРУГИМИ словами:\n\n" +
               JSON.stringify(example, null, 2) + "\n\n" +
               "ТЕМА: " + userRequest + "\n\n" +
               "ВАЖНО: Используй ДРУГИЕ слова! Верни ТОЛЬКО JSON.";
    }
    
    return "Создай 5 учебных карточек.\nТЕМА: " + userRequest + "\n\nВерни JSON.";
}

async function callGroqAI(userRequest, apiKey) {
    console.log("🚀 callGroqAI вызван");
    
    for (var m = 0; m < AI_MODELS.length; m++) {
        var model = AI_MODELS[m];
        try {
            console.log("🔄 Модель:", model);
            
            var response = await fetch(AI_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: AI_SYSTEM_PROMPT },
                        { role: "user", content: buildAIPrompt(userRequest) }
                    ],
                    max_tokens: 4000,
                    temperature: AI_TEMPERATURE
                })
            });
            
            if (response.status === 429) {
                await new Promise(function(r) { setTimeout(r, 1000); });
                continue;
            }
            
            if (!response.ok) {
                var err = {};
                try { err = await response.json(); } catch(e) {}
                throw new Error(err.error ? err.error.message : "HTTP " + response.status);
            }
            
            var data = await response.json();
            var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
            
            if (!text) continue;
            
            console.log("📄 Ответ:", text.substring(0, 200));
            
            var worksheet = parseAIWorksheet(text);
            if (worksheet) return worksheet;
            
        } catch (error) {
            console.error("❌ Ошибка:", error.message);
            continue;
        }
    }
    
    throw new Error("Ошибка генерации. Попробуй ещё раз.");
}

function parseAIWorksheet(text) {
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    var match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    
    try {
        var json = JSON.parse(match[0].replace(/,\s*}/g, "}").replace(/,\s*]/g, "]"));
        
        if (!json.tasks || json.tasks.length < 1) return null;
        
        var levels = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
        
        for (var i = 0; i < json.tasks.length; i++) {
            var t = json.tasks[i];
            var elem = t.elements || [];
            var ans = t.answers || [];
            if (typeof elem === "string") elem = [elem];
            if (typeof ans === "string") ans = [ans];
            
            json.tasks[i] = {
                level: t.level || levels[i] || "⭐",
                level_name: t.level_name || "Задание " + (i+1),
                instruction: t.instruction || "Выполни.",
                content: t.content || "",
                elements: elem.filter(function(x){return x;}),
                answers: ans.filter(function(x){return x;})
            };
        }
        
        json.tasks = json.tasks.filter(function(t){ return t.elements.length > 0 || t.content; });
        
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