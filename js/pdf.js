// ═══════════════════════════════════════════════════════
// ГЕНЕРАЦИЯ HTML ДЛЯ ПЕЧАТИ — КОМПАКТНАЯ ВЕРСИЯ
// 2 карточки на странице A4
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
    var totalPages = Math.ceil(tasks.length / 2); // 2 карточки на страницу
    
    var html = '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">';
    html += '<title>' + escapeHtmlPdf(data.title || "Рабочий лист") + '</title>';
    html += '<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap" rel="stylesheet">';
    html += '<style>';
    
    // Основные стили
    html += '* { box-sizing: border-box; margin: 0; padding: 0; }';
    html += 'body { font-family: Comfortaa, sans-serif; margin: 0; padding: 0; background: #eee; }';
    
    // Кнопки печати
    html += '.print-btn-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: flex; gap: 10px; }';
    html += '.print-btn { padding: 12px 24px; font-size: 16px; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; font-family: Comfortaa, sans-serif; transition: transform 0.2s, box-shadow 0.2s; }';
    html += '.print-btn:hover { transform: scale(1.05); }';
    html += '.print-btn-primary { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); }';
    html += '.print-btn-secondary { background: white; color: #7c3aed; border: 2px solid #7c3aed; }';
    
    // Страница A4
    html += '.page { ';
    html += '  width: 210mm; ';
    html += '  min-height: 297mm; ';
    html += '  padding: 8mm 10mm; ';
    html += '  margin: 10px auto; ';
    html += '  background: white; ';
    html += '  box-shadow: 0 2px 10px rgba(0,0,0,0.1); ';
    html += '  page-break-after: always; ';
    html += '  display: flex; ';
    html += '  flex-direction: column; ';
    html += '  gap: 6mm; ';
    html += '}';
    html += '.page:last-child { page-break-after: auto; }';
    
    // Карточка задания (половина страницы)
    html += '.card { ';
    html += '  background: ' + theme.bg + '; ';
    html += '  border-radius: 12px; ';
    html += '  padding: 10px 14px; ';
    html += '  flex: 1; ';
    html += '  display: flex; ';
    html += '  flex-direction: column; ';
    html += '  min-height: 138mm; ';
    html += '  max-height: 140mm; ';
    html += '  overflow: hidden; ';
    html += '  border: 2px solid ' + theme.accent + '22; ';
    html += '}';
    
    // Заголовок карточки
    html += '.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; flex-shrink: 0; }';
    html += '.card-header-text { flex: 1; }';
    html += '.card-title { font-size: 14px; font-weight: 700; color: ' + theme.accent + '; margin-bottom: 2px; }';
    html += '.card-subtitle { font-size: 10px; color: #666; }';
    html += '.card-level { font-size: 11px; margin-top: 3px; color: #333; font-weight: 600; }';
    html += '.card-mascot img { width: 40px; height: 40px; object-fit: contain; }';
    
    // Инфо-строка
    html += '.info-row { display: flex; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; flex-shrink: 0; }';
    html += '.info-item { display: flex; align-items: center; gap: 3px; font-size: 10px; }';
    html += '.info-item span:first-child { font-weight: 600; }';
    html += '.info-line { border-bottom: 1px solid #333; min-width: 50px; height: 14px; }';
    
    // Инструкция
    html += '.instruction { background: white; padding: 6px 10px; border-radius: 8px; margin-bottom: 6px; border-left: 3px solid ' + theme.accent + '; flex-shrink: 0; }';
    html += '.instruction-title { font-weight: 600; font-size: 11px; }';
    html += '.instruction-content { font-size: 10px; font-style: italic; color: #555; margin-top: 2px; }';
    
    // Элементы
    html += '.elements { margin-bottom: 6px; flex-shrink: 0; }';
    html += '.element { background: white; padding: 4px 8px; margin-bottom: 3px; border-radius: 6px; font-size: 11px; border: 1px solid #e0e0e0; line-height: 1.3; }';
    
    // Место для работы (компактное)
    html += '.work-area { border: 1.5px dashed #ccc; border-radius: 8px; padding: 6px 10px; flex: 1; min-height: 30px; }';
    html += '.work-area-title { font-size: 9px; color: #888; margin-bottom: 4px; }';
    html += '.work-lines { display: flex; flex-direction: column; gap: 0; }';
    html += '.work-line { border-bottom: 1px solid #ddd; height: 16px; }';
    
    // Футер карточки
    html += '.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 5px; border-top: 1px solid #ddd; margin-top: 5px; flex-shrink: 0; }';
    html += '.rating { font-size: 12px; color: #ddd; letter-spacing: 1px; }';
    html += '.rating-label { font-size: 9px; color: #888; }';
    html += '.done-msg { font-size: 10px; color: ' + theme.accent + '; font-weight: 600; }';
    html += '.teacher-sign { font-size: 9px; color: #666; }';
    
    // Разделитель между карточками
    html += '.card-divider { border-top: 1px dashed #ccc; margin: 0; flex-shrink: 0; }';
    
    // Номер страницы
    html += '.page-footer { text-align: center; font-size: 9px; color: #999; padding-top: 4px; flex-shrink: 0; }';
    html += '.theme-icons { letter-spacing: 2px; margin-right: 8px; }';
    
    // Стили для печати
    html += '@media print { ';
    html += '  body { background: white; }';
    html += '  .print-btn-container { display: none !important; }';
    html += '  .page { margin: 0; box-shadow: none; min-height: 297mm; width: 210mm; }';
    html += '  .card { break-inside: avoid; }';
    html += '  @page { size: A4; margin: 0; }';
    html += '}';
    
    html += '</style></head><body>';
    
    // Кнопки печати
    html += '<div class="print-btn-container">';
    html += '<button class="print-btn print-btn-primary" onclick="window.print()">🖨️ Распечатать</button>';
    html += '<button class="print-btn print-btn-secondary" onclick="window.close()">✕ Закрыть</button>';
    html += '</div>';
    
    // Генерируем страницы (по 2 карточки на страницу)
    for (var pageNum = 0; pageNum < totalPages; pageNum++) {
        html += '<div class="page">';
        
        // Две карточки на странице
        for (var cardIdx = 0; cardIdx < 2; cardIdx++) {
            var taskIdx = pageNum * 2 + cardIdx;
            if (taskIdx >= tasks.length) break;
            
            var task = tasks[taskIdx];
            var levelEmoji = theme.emoji.charAt(taskIdx % theme.emoji.length) || "⭐";
            var mascotPath = getMascotUrl(themeKey);
            
            // Добавляем разделитель между карточками
            if (cardIdx === 1) {
                html += '<div class="card-divider"></div>';
            }
            
            html += '<div class="card">';
            
            // Заголовок
            html += '<div class="card-header">';
            html += '  <div class="card-header-text">';
            html += '    <div class="card-title">' + levelEmoji + ' ' + escapeHtmlPdf(data.title || "Рабочий лист") + '</div>';
            html += '    <div class="card-subtitle">' + escapeHtmlPdf(data.subtitle || "") + '</div>';
            html += '    <div class="card-level">' + escapeHtmlPdf(task.level || "⭐") + ' ' + escapeHtmlPdf(task.level_name || "Задание") + '</div>';
            html += '  </div>';
            html += '  <div class="card-mascot"><img src="' + mascotPath + '" alt=""></div>';
            html += '</div>';
            
            // Поля для имени
            html += '<div class="info-row">';
            html += '<div class="info-item"><span>👤</span><div class="info-line"></div></div>';
            html += '<div class="info-item"><span>📅</span><div class="info-line"></div></div>';
            html += '<div class="info-item"><span>📚</span><div class="info-line"></div></div>';
            html += '</div>';
            
            // Инструкция
            html += '<div class="instruction">';
            html += '<div class="instruction-title">📝 ' + escapeHtmlPdf(task.instruction || "Выполни задание") + '</div>';
            if (task.content) {
                html += '<div class="instruction-content">' + escapeHtmlPdf(task.content) + '</div>';
            }
            html += '</div>';
            
            // Элементы (ограничиваем количество для компактности)
            if (task.elements && task.elements.length > 0) {
                html += '<div class="elements">';
                var maxElements = Math.min(task.elements.length, 8); // Максимум 8 элементов
                for (var j = 0; j < maxElements; j++) {
                    html += '<div class="element">' + escapeHtmlPdf(task.elements[j]) + '</div>';
                }
                if (task.elements.length > maxElements) {
                    html += '<div class="element" style="color: #888; font-style: italic;">... и ещё ' + (task.elements.length - maxElements) + '</div>';
                }
                html += '</div>';
            }
            
            // Рабочая зона (компактная)
            html += '<div class="work-area">';
            html += '<div class="work-area-title">✏️ Решение:</div>';
            html += '<div class="work-lines">';
            var numLines = 3; // Меньше линий
            for (var k = 0; k < numLines; k++) {
                html += '<div class="work-line"></div>';
            }
            html += '</div>';
            html += '</div>';
            
            // Футер
            html += '<div class="card-footer">';
            html += '<div>';
            html += '<div class="rating-label">Оценка:</div>';
            html += '<div class="rating">☆☆☆☆☆</div>';
            html += '</div>';
            html += '<div class="done-msg">✓ Задание ' + (taskIdx + 1) + '</div>';
            html += '<div class="teacher-sign">Учитель: _____</div>';
            html += '</div>';
            
            html += '</div>'; // .card
        }
        
        // Футер страницы
        html += '<div class="page-footer"><span class="theme-icons">' + theme.emoji + '</span>Страница ' + (pageNum + 1) + ' из ' + totalPages + '</div>';
        
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
    html += 'body { font-family: Comfortaa, sans-serif; padding: 15px; max-width: 210mm; margin: 0 auto; background: #f5f5f5; font-size: 12px; }';
    
    // Кнопки
    html += '.print-btn-container { position: fixed; bottom: 15px; right: 15px; z-index: 1000; display: flex; gap: 8px; }';
    html += '.print-btn { padding: 10px 20px; font-size: 14px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; font-family: Comfortaa, sans-serif; }';
    html += '.print-btn:hover { transform: scale(1.05); }';
    html += '.print-btn-primary { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; }';
    html += '.print-btn-secondary { background: white; color: #7c3aed; border: 2px solid #7c3aed; }';
    
    html += '.container { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 50px; }';
    html += 'h1 { color: #7c3aed; margin-bottom: 15px; font-size: 18px; }';
    html += '.task { background: #f8f9fa; padding: 12px; margin-bottom: 12px; border-radius: 10px; border-left: 3px solid #7c3aed; }';
    html += '.task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }';
    html += '.task-title { font-weight: 600; font-size: 13px; color: #333; }';
    html += '.task-level { font-size: 12px; color: #7c3aed; }';
    html += '.answers { display: flex; flex-direction: column; gap: 4px; }';
    html += '.answer { display: flex; gap: 8px; padding: 6px 10px; background: white; border-radius: 6px; font-size: 11px; border: 1px solid #e0e0e0; }';
    html += '.answer-num { font-weight: 600; color: #7c3aed; min-width: 20px; }';
    html += '.answer-text { color: #333; }';
    html += '.no-answers { color: #999; font-style: italic; padding: 8px; font-size: 11px; }';
    
    // Печать
    html += '@media print { ';
    html += '  body { background: white; padding: 10px; }';
    html += '  .print-btn-container { display: none !important; }';
    html += '  .container { box-shadow: none; margin-top: 0; padding: 10px; }';
    html += '  .task { break-inside: avoid; }';
    html += '}';
    
    html += '</style></head><body>';
    
    // Кнопки
    html += '<div class="print-btn-container">';
    html += '<button class="print-btn print-btn-primary" onclick="window.print()">🖨️ Печать</button>';
    html += '<button class="print-btn print-btn-secondary" onclick="window.close()">✕</button>';
    html += '</div>';
    
    html += '<div class="container">';
    html += '<h1>🔑 Ответы: ' + escapeHtmlPdf(data.title || "Рабочий лист") + '</h1>';
    
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        html += '<div class="task">';
        
        html += '<div class="task-header">';
        html += '<div class="task-title">' + (i+1) + '. ' + escapeHtmlPdf(task.level_name || "Задание") + '</div>';
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