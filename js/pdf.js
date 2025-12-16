// ═══════════════════════════════════════════════════════
// ГЕНЕРАЦИЯ HTML ДЛЯ ПЕЧАТИ
// ═══════════════════════════════════════════════════════

var PRINT_THEMES = {
    default: { bg: "#f8f9fa", accent: "#7c3aed", emoji: "⭐🌟✨💫" },
    pirates: { bg: "#fff8e1", accent: "#5d4037", emoji: "🏴‍☠️⚓🦜💰" },
    space: { bg: "#e8eaf6", accent: "#3f51b5", emoji: "🚀🌟👨‍🚀🛸" },
    animals: { bg: "#e8f5e9", accent: "#388e3c", emoji: "🦁🐘🦒🐵" },
    sweets: { bg: "#fce4ec", accent: "#e91e63", emoji: "🍭🍬🧁🍩" },
    dinosaurs: { bg: "#efebe9", accent: "#6d4c41", emoji: "🦖🦕🌋🥚" },
    fairytale: { bg: "#f3e5f5", accent: "#9c27b0", emoji: "🏰👸🐉✨" },
    nature: { bg: "#e0f2f1", accent: "#00897b", emoji: "🌿🌸🦋🌻" }
};

function getThemeStyles(themeName) {
    var theme = PRINT_THEMES[themeName] || PRINT_THEMES.default;
    return theme;
}

function generateWorksheetHTML(data, themeName) {
    var theme = getThemeStyles(themeName || "default");
    var tasks = data.tasks || [];
    var totalPages = tasks.length;
    
    var html = '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">';
    html += '<title>' + escapeHtmlPdf(data.title || "Рабочий лист") + '</title>';
    html += '<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap" rel="stylesheet">';
    html += '<style>';
    
    // Основные стили
    html += '* { box-sizing: border-box; margin: 0; padding: 0; }';
    html += 'body { font-family: Comfortaa, sans-serif; margin: 0; padding: 0; background: #eee; }';
    
    // Кнопка печати (скрывается при печати)
    html += '.print-btn-container { position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; gap: 10px; }';
    html += '.print-btn { padding: 15px 30px; font-size: 18px; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; font-family: Comfortaa, sans-serif; transition: transform 0.2s, box-shadow 0.2s; }';
    html += '.print-btn:hover { transform: scale(1.05); }';
    html += '.print-btn-primary { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); }';
    html += '.print-btn-secondary { background: white; color: #7c3aed; border: 2px solid #7c3aed; }';
    
    // Страница A4
    html += '.page { ';
    html += '  width: 210mm; ';
    html += '  height: 297mm; '; // Фиксированная высота!
    html += '  padding: 12mm 15mm; ';
    html += '  margin: 10px auto; ';
    html += '  background: ' + theme.bg + '; ';
    html += '  box-shadow: 0 2px 10px rgba(0,0,0,0.1); ';
    html += '  page-break-after: always; ';
    html += '  page-break-inside: avoid; ';
    html += '  overflow: hidden; '; // Обрезаем лишнее
    html += '  display: flex; ';
    html += '  flex-direction: column; ';
    html += '}';
    html += '.page:last-child { page-break-after: auto; }';
    
    // Заголовок
    html += '.header { text-align: center; margin-bottom: 12px; flex-shrink: 0; }';
    html += '.title { font-size: 22px; font-weight: 700; color: ' + theme.accent + '; margin-bottom: 4px; }';
    html += '.subtitle { font-size: 13px; color: #666; }';
    html += '.level { font-size: 16px; margin-top: 8px; color: #333; }';
    
    // Инфо-поля
    html += '.info-row { display: flex; gap: 15px; margin-bottom: 12px; flex-wrap: wrap; flex-shrink: 0; }';
    html += '.info-item { display: flex; align-items: center; gap: 5px; font-size: 13px; }';
    html += '.info-item span:first-child { font-weight: 600; }';
    html += '.info-line { flex: 1; border-bottom: 1px solid #333; min-width: 70px; height: 18px; }';
    
    // Инструкция
    html += '.instruction { background: white; padding: 12px 15px; border-radius: 10px; margin-bottom: 12px; border-left: 4px solid ' + theme.accent + '; flex-shrink: 0; }';
    html += '.instruction-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; }';
    html += '.content { font-size: 13px; font-style: italic; color: #555; margin-top: 6px; }';
    
    // Элементы задания
    html += '.elements { margin-bottom: 12px; flex-shrink: 0; }';
    html += '.element { background: white; padding: 8px 12px; margin-bottom: 6px; border-radius: 8px; font-size: 15px; border: 1px solid #e0e0e0; }';
    
    // Место для работы (занимает оставшееся место)
    html += '.work-area { border: 2px dashed #ccc; border-radius: 10px; padding: 15px; flex: 1; min-height: 80px; display: flex; flex-direction: column; }';
    html += '.work-area-title { font-size: 12px; color: #888; margin-bottom: 8px; }';
    html += '.work-area-hint { color: #bbb; font-size: 13px; }';
    html += '.work-lines { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; }';
    html += '.work-line { border-bottom: 1px solid #ddd; height: 25px; }';
    
    // Футер
    html += '.footer { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #ddd; margin-top: 10px; flex-shrink: 0; }';
    html += '.rating { font-size: 18px; color: #ddd; letter-spacing: 2px; }';
    html += '.done-msg { font-size: 13px; color: ' + theme.accent + '; font-weight: 600; }';
    html += '.teacher-sign { font-size: 11px; color: #666; }';
    
    // Номер страницы
    html += '.page-num { font-size: 11px; color: #999; text-align: center; margin-top: 8px; flex-shrink: 0; }';
    html += '.theme-icons { font-size: 10px; letter-spacing: 3px; margin-right: 10px; }';
    
    // Стили для печати
    html += '@media print { ';
    html += '  body { background: white; }';
    html += '  .print-btn-container { display: none !important; }';
    html += '  .page { margin: 0; box-shadow: none; height: 297mm; width: 210mm; }';
    html += '  @page { size: A4; margin: 0; }';
    html += '}';
    
    html += '</style></head><body>';
    
    // Кнопки печати
    html += '<div class="print-btn-container">';
    html += '<button class="print-btn print-btn-primary" onclick="window.print()">🖨️ Распечатать</button>';
    html += '<button class="print-btn print-btn-secondary" onclick="window.close()">✕ Закрыть</button>';
    html += '</div>';
    
    // Генерируем страницы
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var levelEmoji = theme.emoji.charAt(i % theme.emoji.length) || "⭐";
        
        html += '<div class="page">';
        
        // Заголовок
        html += '<div class="header">';
        html += '<div class="title">' + levelEmoji + ' ' + escapeHtmlPdf(data.title || "Рабочий лист") + '</div>';
        html += '<div class="subtitle">' + escapeHtmlPdf(data.subtitle || "") + '</div>';
        html += '<div class="level">' + escapeHtmlPdf(task.level || "⭐") + ' ' + escapeHtmlPdf(task.level_name || "Задание") + '</div>';
        html += '</div>';
        
        // Поля для имени
        html += '<div class="info-row">';
        html += '<div class="info-item"><span>👤 Имя:</span><div class="info-line"></div></div>';
        html += '<div class="info-item"><span>📅 Дата:</span><div class="info-line"></div></div>';
        html += '<div class="info-item"><span>📚 Класс:</span><div class="info-line"></div></div>';
        html += '</div>';
        
        // Инструкция
        html += '<div class="instruction">';
        html += '<div class="instruction-title">📝 ' + escapeHtmlPdf(task.instruction || "Выполни задание") + '</div>';
        if (task.content) {
            html += '<div class="content">' + escapeHtmlPdf(task.content) + '</div>';
        }
        html += '</div>';
        
        // Элементы задания
        if (task.elements && task.elements.length > 0) {
            html += '<div class="elements">';
            for (var j = 0; j < task.elements.length; j++) {
                html += '<div class="element">' + escapeHtmlPdf(task.elements[j]) + '</div>';
            }
            html += '</div>';
        }
        
        // Место для работы с линиями
        html += '<div class="work-area">';
        html += '<div class="work-area-title">✏️ Место для решения:</div>';
        html += '<div class="work-lines">';
        // Добавляем линии для письма
        for (var k = 0; k < 6; k++) {
            html += '<div class="work-line"></div>';
        }
        html += '</div>';
        html += '</div>';
        
        // Футер
        html += '<div class="footer">';
        html += '<div>';
        html += '<div style="font-size: 11px; color: #666; margin-bottom: 3px;">Оценка:</div>';
        html += '<div class="rating">☆☆☆☆☆</div>';
        html += '</div>';
        html += '<div class="done-msg">Задание ' + (i + 1) + ' выполнено! ' + levelEmoji + '</div>';
        html += '<div class="teacher-sign">Учитель: _________</div>';
        html += '</div>';
        
        html += '<div class="page-num"><span class="theme-icons">' + theme.emoji + '</span>Страница ' + (i + 1) + ' из ' + totalPages + '</div>';
        html += '</div>'; // end page
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
    html += 'body { font-family: Comfortaa, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: #f5f5f5; }';
    
    // Кнопка печати
    html += '.print-btn-container { position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; gap: 10px; }';
    html += '.print-btn { padding: 12px 25px; font-size: 16px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; font-family: Comfortaa, sans-serif; transition: transform 0.2s; }';
    html += '.print-btn:hover { transform: scale(1.05); }';
    html += '.print-btn-primary { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; }';
    html += '.print-btn-secondary { background: white; color: #7c3aed; border: 2px solid #7c3aed; }';
    
    html += '.container { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 60px; }';
    html += 'h1 { color: #7c3aed; margin-bottom: 25px; font-size: 24px; }';
    html += '.task { background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 12px; border-left: 4px solid #7c3aed; }';
    html += '.task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }';
    html += '.task-title { font-weight: 600; font-size: 16px; color: #333; }';
    html += '.task-level { font-size: 14px; color: #7c3aed; }';
    html += '.answers { display: flex; flex-direction: column; gap: 8px; }';
    html += '.answer { display: flex; gap: 10px; padding: 10px 15px; background: white; border-radius: 8px; font-size: 14px; border: 1px solid #e0e0e0; }';
    html += '.answer-num { font-weight: 600; color: #7c3aed; min-width: 25px; }';
    html += '.answer-text { color: #333; }';
    html += '.no-answers { color: #999; font-style: italic; padding: 10px; }';
    
    // Стили для печати
    html += '@media print { ';
    html += '  body { background: white; padding: 10px; }';
    html += '  .print-btn-container { display: none !important; }';
    html += '  .container { box-shadow: none; margin-top: 0; padding: 15px; }';
    html += '  .task { break-inside: avoid; }';
    html += '}';
    
    html += '</style></head><body>';
    
    // Кнопки
    html += '<div class="print-btn-container">';
    html += '<button class="print-btn print-btn-primary" onclick="window.print()">🖨️ Распечатать</button>';
    html += '<button class="print-btn print-btn-secondary" onclick="window.close()">✕ Закрыть</button>';
    html += '</div>';
    
    html += '<div class="container">';
    html += '<h1>🔑 Ответы: ' + escapeHtmlPdf(data.title || "Рабочий лист") + '</h1>';
    
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        html += '<div class="task">';
        
        html += '<div class="task-header">';
        html += '<div class="task-title">' + escapeHtmlPdf(task.level_name || "Задание " + (i+1)) + '</div>';
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
    
    html += '</div>'; // container
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