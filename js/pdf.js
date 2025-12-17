// ═══════════════════════════════════════════════════════
// ГЕНЕРАЦИЯ HTML ДЛЯ ПЕЧАТИ — 3 КАРТОЧКИ НА СТРАНИЦУ
// Карточки для вырезания и вклеивания в тетрадь
// ═══════════════════════════════════════════════════════

var STATIC_BASE_URL = "";

var PRINT_THEMES = {
    default:  { bg: "#f8f9fa", accent: "#7c3aed", emoji: "⭐🌟✨💫" },
    pirates:  { bg: "#fff8e1", accent: "#5d4037", emoji: "🏴‍☠️⚓🦜💰" },
    space:    { bg: "#e8eaf6", accent: "#3f51b5", emoji: "🚀🌟👨‍🚀🛸" },
    animals:  { bg: "#e8f5e9", accent: "#388e3c", emoji: "🦁🐘🦒🐵" },
    sweets:   { bg: "#fce4ec", accent: "#e91e63", emoji: "🍭🍬🧁🍩" },
    dinosaurs:{ bg: "#efebe9", accent: "#6d4c41", emoji: "🦖🦕🌋🥚" },
    fairytale:{ bg: "#f3e5f5", accent: "#9c27b0", emoji: "🏰👸🐉✨" },
    mouse:    { bg: "#eff6ff", accent: "#3b82f6", emoji: "🐭🧀⭐🎈" }
};

function getThemeStyles(themeName) {
    var theme = PRINT_THEMES[themeName] || PRINT_THEMES.default;
    return theme;
}

function getMascotUrl(themeKey) {
    var base = (typeof STATIC_BASE_URL === "string" ? STATIC_BASE_URL : "").trim();

    if (base) {
        base = base.replace(/\/$/, "");
        return base + "/img/themes/" + themeKey + "/mascot.svg";
    }

    if (typeof window !== "undefined" &&
        window.location &&
        window.location.protocol.indexOf("http") === 0) {

        var origin = window.location.origin;
        var path = window.location.pathname.split("/").slice(0, -1).join("/");
        return origin + path + "/img/themes/" + themeKey + "/mascot.svg";
    }

    return "img/themes/" + themeKey + "/mascot.svg";
}

function generateWorksheetHTML(data, themeName) {
    var themeKey = themeName || "default";
    var theme = getThemeStyles(themeKey);
    var tasks = data.tasks || [];
    var totalTasks = tasks.length;
    var cardsPerPage = 3;
    var totalPages = Math.ceil(tasks.length / cardsPerPage);
    
    var html = '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">';
    html += '<title>' + escapeHtmlPdf(data.title || "Рабочий лист") + '</title>';
    html += '<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap" rel="stylesheet">';
    html += '<style>';
    
    // Основные стили
    html += '* { box-sizing: border-box; margin: 0; padding: 0; }';
    html += 'body { font-family: Comfortaa, sans-serif; margin: 0; padding: 0; background: #eee; }';
    
    // Кнопки печати
    html += '.print-btn-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: flex; gap: 10px; }';
    html += '.print-btn { padding: 12px 24px; font-size: 16px; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; font-family: Comfortaa, sans-serif; transition: transform 0.2s; }';
    html += '.print-btn:hover { transform: scale(1.05); }';
    html += '.print-btn-primary { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); }';
    html += '.print-btn-secondary { background: white; color: #7c3aed; border: 2px solid #7c3aed; }';
    
    // Страница A4
    html += '.page { ';
    html += '  width: 210mm; ';
    html += '  min-height: 297mm; ';
    html += '  padding: 5mm 7mm; ';
    html += '  margin: 10px auto; ';
    html += '  background: white; ';
    html += '  box-shadow: 0 2px 10px rgba(0,0,0,0.1); ';
    html += '  page-break-after: always; ';
    html += '  display: flex; ';
    html += '  flex-direction: column; ';
    html += '  gap: 0; ';
    html += '}';
    html += '.page:last-child { page-break-after: auto; }';
    
    // Карточка задания (1/3 страницы ≈ 93mm высота)
    html += '.card { ';
    html += '  background: ' + theme.bg + '; ';
    html += '  border: 2px dashed #aaa; '; // Пунктир для вырезания!
    html += '  border-radius: 8px; ';
    html += '  padding: 6px 10px; ';
    html += '  height: 93mm; ';
    html += '  display: flex; ';
    html += '  flex-direction: column; ';
    html += '  overflow: hidden; ';
    html += '  position: relative; ';
    html += '}';
    
    // Ножницы — подсказка для вырезания
    html += '.scissors { position: absolute; top: -2px; left: 10px; font-size: 10px; color: #999; }';
    
    // Заголовок карточки (компактный)
    html += '.card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-shrink: 0; }';
    html += '.card-mascot img { width: 28px; height: 28px; object-fit: contain; }';
    html += '.card-header-text { flex: 1; }';
    html += '.card-title { font-size: 11px; font-weight: 700; color: ' + theme.accent + '; line-height: 1.2; }';
    html += '.card-level { font-size: 9px; color: #555; margin-top: 1px; }';
    
    // Поля: имя и дата в одну строку
    html += '.info-row { display: flex; gap: 8px; margin-bottom: 4px; flex-shrink: 0; font-size: 9px; }';
    html += '.info-item { display: flex; align-items: center; gap: 2px; }';
    html += '.info-line { border-bottom: 1px solid #555; width: 45px; height: 12px; }';
    
    // Инструкция (очень компактная)
    html += '.instruction { background: white; padding: 4px 8px; border-radius: 6px; margin-bottom: 4px; border-left: 3px solid ' + theme.accent + '; flex-shrink: 0; }';
    html += '.instruction-title { font-weight: 600; font-size: 9px; line-height: 1.3; }';
    html += '.instruction-content { font-size: 8px; color: #555; margin-top: 2px; line-height: 1.2; }';
    
    // Элементы задания
    html += '.elements { flex: 1; overflow: hidden; margin-bottom: 3px; }';
    html += '.element { background: white; padding: 3px 6px; margin-bottom: 2px; border-radius: 4px; font-size: 10px; border: 1px solid #ddd; line-height: 1.25; }';
    
    // Место для ответа (минимальное)
    html += '.work-area { border: 1px solid #ccc; border-radius: 6px; padding: 3px 6px; min-height: 18px; background: #fafafa; flex-shrink: 0; }';
    html += '.work-area-title { font-size: 8px; color: #888; }';
    html += '.work-line { border-bottom: 1px solid #ddd; height: 14px; }';
    
    // Футер карточки (минимальный)
    html += '.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 3px; flex-shrink: 0; font-size: 8px; color: #888; }';
    html += '.rating { font-size: 10px; color: #ddd; letter-spacing: 0; }';
    html += '.task-num { color: ' + theme.accent + '; font-weight: 600; }';
    
    // Стили для печати
    html += '@media print { ';
    html += '  body { background: white; }';
    html += '  .print-btn-container { display: none !important; }';
    html += '  .page { margin: 0; box-shadow: none; min-height: 297mm; width: 210mm; padding: 5mm 7mm; }';
    html += '  .card { border: 2px dashed #888; }'; // Чётче для печати
    html += '  @page { size: A4; margin: 0; }';
    html += '}';
    
    html += '</style></head><body>';
    
    // Кнопки печати
    html += '<div class="print-btn-container">';
    html += '<button class="print-btn print-btn-primary" onclick="window.print()">🖨️ Распечатать</button>';
    html += '<button class="print-btn print-btn-secondary" onclick="window.close()">✕ Закрыть</button>';
    html += '</div>';
    
    // Генерируем страницы (по 3 карточки)
    for (var pageNum = 0; pageNum < totalPages; pageNum++) {
        html += '<div class="page">';
        
        // Три карточки на странице
        for (var cardIdx = 0; cardIdx < cardsPerPage; cardIdx++) {
            var taskIdx = pageNum * cardsPerPage + cardIdx;
            if (taskIdx >= tasks.length) break;
            
            var task = tasks[taskIdx];
            var levelEmoji = theme.emoji.charAt(taskIdx % theme.emoji.length) || "⭐";
            var mascotPath = getMascotUrl(themeKey);
            
            html += '<div class="card">';
            
            // Ножницы
            html += '<div class="scissors">✂️ - - - - -</div>';
            
            // Заголовок
            html += '<div class="card-header">';
            html += '  <div class="card-mascot"><img src="' + mascotPath + '" alt=""></div>';
            html += '  <div class="card-header-text">';
            html += '    <div class="card-title">' + levelEmoji + ' ' + escapeHtmlPdf(data.title || "Задание") + '</div>';
            html += '    <div class="card-level">' + escapeHtmlPdf(task.level || "⭐") + ' ' + escapeHtmlPdf(task.level_name || "") + '</div>';
            html += '  </div>';
            html += '</div>';
            
            // Имя и дата
            html += '<div class="info-row">';
            html += '<div class="info-item">👤<div class="info-line"></div></div>';
            html += '<div class="info-item">📅<div class="info-line"></div></div>';
            html += '<div class="info-item">📚<div class="info-line"></div></div>';
            html += '</div>';
            
            // Инструкция
            html += '<div class="instruction">';
            html += '<div class="instruction-title">📝 ' + escapeHtmlPdf(task.instruction || "Выполни задание") + '</div>';
            if (task.content && task.content.length < 80) {
                html += '<div class="instruction-content">' + escapeHtmlPdf(task.content) + '</div>';
            }
            html += '</div>';
            
            // Элементы (ограничиваем для компактности)
            if (task.elements && task.elements.length > 0) {
                html += '<div class="elements">';
                var maxElements = Math.min(task.elements.length, 6); // Макс 6 элементов
                for (var j = 0; j < maxElements; j++) {
                    // Обрезаем длинные элементы
                    var elemText = task.elements[j];
                    if (elemText.length > 50) {
                        elemText = elemText.substring(0, 47) + '...';
                    }
                    html += '<div class="element">' + escapeHtmlPdf(elemText) + '</div>';
                }
                if (task.elements.length > maxElements) {
                    html += '<div class="element" style="color:#888; font-style:italic;">+ещё ' + (task.elements.length - maxElements) + '</div>';
                }
                html += '</div>';
            }
            
            // Место для ответа (1 линия)
            html += '<div class="work-area">';
            html += '<div class="work-area-title">✏️ Ответ:</div>';
            html += '<div class="work-line"></div>';
            html += '</div>';
            
            // Футер
            html += '<div class="card-footer">';
            html += '<div class="rating">☆☆☆☆☆</div>';
            html += '<div class="task-num">№' + (taskIdx + 1) + '</div>';
            html += '<div>Учитель: ____</div>';
            html += '</div>';
            
            html += '</div>'; // .card
        }
        
        html += '</div>'; // .page
    }
    
    html += '</body></html>';
    return html;
}

function generateAnswersHTML(data) {
    var tasks = data.tasks || [];
    
    var html = '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">';
    html += '<title>Ответы: ' + escapeHtmlPdf(data.title || "Рабочий лист") + '</title>';
    html += '<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap" rel="stylesheet">';
    html += '<style>';
    html += '* { box-sizing: border-box; }';
    html += 'body { font-family: Comfortaa, sans-serif; padding: 10px; max-width: 210mm; margin: 0 auto; background: #f5f5f5; font-size: 11px; }';
    
    // Кнопки
    html += '.print-btn-container { position: fixed; bottom: 15px; right: 15px; z-index: 1000; display: flex; gap: 8px; }';
    html += '.print-btn { padding: 10px 18px; font-size: 14px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; font-family: Comfortaa, sans-serif; }';
    html += '.print-btn:hover { transform: scale(1.05); }';
    html += '.print-btn-primary { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; }';
    html += '.print-btn-secondary { background: white; color: #7c3aed; border: 2px solid #7c3aed; }';
    
    html += '.container { background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 45px; }';
    html += 'h1 { color: #7c3aed; margin-bottom: 12px; font-size: 16px; }';
    html += '.task { background: #f8f9fa; padding: 10px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #7c3aed; }';
    html += '.task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }';
    html += '.task-title { font-weight: 600; font-size: 12px; color: #333; }';
    html += '.task-level { font-size: 11px; color: #7c3aed; }';
    html += '.answers { display: flex; flex-direction: column; gap: 3px; }';
    html += '.answer { display: flex; gap: 6px; padding: 4px 8px; background: white; border-radius: 5px; font-size: 10px; border: 1px solid #e0e0e0; }';
    html += '.answer-num { font-weight: 600; color: #7c3aed; min-width: 18px; }';
    html += '.answer-text { color: #333; }';
    html += '.no-answers { color: #999; font-style: italic; padding: 6px; font-size: 10px; }';
    
    // Печать — компактнее
    html += '@media print { ';
    html += '  body { background: white; padding: 5mm; font-size: 10px; }';
    html += '  .print-btn-container { display: none !important; }';
    html += '  .container { box-shadow: none; margin-top: 0; padding: 5px; }';
    html += '  .task { break-inside: avoid; padding: 6px; margin-bottom: 6px; }';
    html += '  h1 { font-size: 14px; margin-bottom: 8px; }';
    html += '  .answer { padding: 3px 6px; font-size: 9px; }';
    html += '}';
    
    html += '</style></head><body>';
    
    // Кнопки
    html += '<div class="print-btn-container">';
    html += '<button class="print-btn print-btn-primary" onclick="window.print()">🖨️</button>';
    html += '<button class="print-btn print-btn-secondary" onclick="window.close()">✕</button>';
    html += '</div>';
    
    html += '<div class="container">';
    html += '<h1>🔑 Ответы: ' + escapeHtmlPdf(data.title || "Рабочий лист") + '</h1>';
    
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        html += '<div class="task">';
        
        html += '<div class="task-header">';
        html += '<div class="task-title">№' + (i+1) + '. ' + escapeHtmlPdf(task.level_name || "Задание") + '</div>';
        html += '<div class="task-level">' + escapeHtmlPdf(task.level || "⭐") + '</div>';
        html += '</div>';
        
        if (task.answers && task.answers.length > 0) {
            html += '<div class="answers">';
            for (var j = 0; j < task.answers.length; j++) {
                html += '<div class="answer">';
                html += '<span class="answer-num">' + (j + 1) + '.</span>';
                html += '<span class="answer-text">' + escapeHtmlPdf(task.answers[j]) + '</span>';
                html += '</div>';
            }
            html += '</div>';
        } else {
            html += '<div class="no-answers">Ответы не указаны</div>';
        }
        
        html += '</div>';
    }
    
    html += '</div>';
    html += '</body></html>';
    return html;
}

// Экранирование HTML
function escapeHtmlPdf(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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