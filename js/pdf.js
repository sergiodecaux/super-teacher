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
    html += '<title>' + (data.title || "Рабочий лист") + '</title>';
    html += '<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap" rel="stylesheet">';
    html += '<style>';
    html += 'body { font-family: Comfortaa, sans-serif; margin: 0; padding: 0; }';
    html += '.page { width: 210mm; min-height: 297mm; padding: 15mm; box-sizing: border-box; background: ' + theme.bg + '; page-break-after: always; }';
    html += '.page:last-child { page-break-after: auto; }';
    html += '.header { text-align: center; margin-bottom: 20px; }';
    html += '.title { font-size: 24px; font-weight: 700; color: ' + theme.accent + '; margin-bottom: 5px; }';
    html += '.subtitle { font-size: 14px; color: #666; }';
    html += '.level { font-size: 18px; margin-bottom: 10px; }';
    html += '.info-row { display: flex; gap: 20px; margin-bottom: 15px; flex-wrap: wrap; }';
    html += '.info-item { display: flex; align-items: center; gap: 5px; font-size: 14px; }';
    html += '.info-item span:first-child { font-weight: 600; }';
    html += '.info-line { flex: 1; border-bottom: 1px solid #333; min-width: 80px; }';
    html += '.instruction { background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid ' + theme.accent + '; }';
    html += '.instruction-title { font-weight: 600; margin-bottom: 5px; }';
    html += '.content { margin-bottom: 15px; font-style: italic; }';
    html += '.elements { margin-bottom: 20px; }';
    html += '.element { background: white; padding: 10px 15px; margin-bottom: 8px; border-radius: 8px; font-size: 16px; }';
    html += '.work-area { border: 2px dashed #ccc; border-radius: 10px; padding: 20px; min-height: 100px; margin-bottom: 15px; }';
    html += '.work-area-title { font-size: 12px; color: #999; margin-bottom: 10px; }';
    html += '.footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; }';
    html += '.rating { display: flex; gap: 5px; }';
    html += '.star { font-size: 20px; color: #ddd; }';
    html += '.done-msg { font-size: 14px; color: ' + theme.accent + '; font-weight: 600; }';
    html += '.page-num { font-size: 12px; color: #999; text-align: center; margin-top: 10px; }';
    html += '.theme-icons { font-size: 12px; letter-spacing: 2px; }';
    html += '@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    html += '</style></head><body>';
    
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var levelEmoji = (theme.emoji || "⭐🌟✨💫").charAt(i % 4) || "⭐";
        
        html += '<div class="page">';
        
        // Заголовок
        html += '<div class="header">';
        html += '<div class="title">' + levelEmoji + ' ' + (data.title || "Рабочий лист") + '</div>';
        html += '<div class="subtitle">' + (data.subtitle || "") + '</div>';
        html += '<div class="level">' + (task.level || "⭐") + ' ' + (task.level_name || "Задание") + '</div>';
        html += '</div>';
        
        // Поля для имени
        html += '<div class="info-row">';
        html += '<div class="info-item"><span>👤 Имя:</span><div class="info-line"></div></div>';
        html += '<div class="info-item"><span>📅 Дата:</span><div class="info-line"></div></div>';
        html += '<div class="info-item"><span>📚 Класс:</span><div class="info-line"></div></div>';
        html += '</div>';
        
        // Инструкция
        html += '<div class="instruction">';
        html += '<div class="instruction-title">📝 ' + (task.instruction || "Выполни задание") + '</div>';
        if (task.content) {
            html += '<div class="content">' + task.content + '</div>';
        }
        html += '</div>';
        
        // Элементы задания
        if (task.elements && task.elements.length > 0) {
            html += '<div class="elements">';
            for (var j = 0; j < task.elements.length; j++) {
                html += '<div class="element">' + task.elements[j] + '</div>';
            }
            html += '</div>';
        }
        
        // Место для работы
        html += '<div class="work-area">';
        html += '<div class="work-area-title">✏️ Место для решения:</div>';
        html += '<div style="color: #ccc; font-size: 14px;">🎨 Нарисуй или запиши здесь</div>';
        html += '</div>';
        
        // Футер
        html += '<div class="footer">';
        html += '<div><span style="font-size: 12px;">Оценка:</span><div class="rating">☆☆☆☆☆</div></div>';
        html += '<div class="done-msg">Задание ' + (i + 1) + ' выполнено! ' + levelEmoji + '</div>';
        html += '<div><span style="font-size: 12px;">Учитель:</span><div class="info-line" style="width: 60px;"></div></div>';
        html += '</div>';
        
        html += '<div class="page-num"><span class="theme-icons">' + theme.emoji + '</span>Страница ' + (i + 1) + ' из ' + totalPages + '</div>';
        html += '</div>';
    }
    
    html += '</body></html>';
    return html;
}

function generateAnswersHTML(data) {
    var tasks = data.tasks || [];
    
    var html = '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">';
    html += '<title>Ответы: ' + (data.title || "Рабочий лист") + '</title>';
    html += '<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap" rel="stylesheet">';
    html += '<style>';
    html += 'body { font-family: Comfortaa, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }';
    html += 'h1 { color: #7c3aed; }';
    html += '.task { background: #f8f9fa; padding: 15px; margin-bottom: 15px; border-radius: 10px; border-left: 4px solid #7c3aed; }';
    html += '.task-title { font-weight: 600; margin-bottom: 10px; }';
    html += '.answers { display: flex; flex-direction: column; gap: 5px; }';
    html += '.answer { padding: 5px 10px; background: white; border-radius: 5px; }';
    html += '</style></head><body>';
    
    html += '<h1>🔑 Ответы: ' + (data.title || "Рабочий лист") + '</h1>';
    
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        html += '<div class="task">';
        html += '<div class="task-title">' + (task.level || "⭐") + ' ' + (task.level_name || "Задание " + (i+1)) + '</div>';
        
        if (task.answers && task.answers.length > 0) {
            html += '<div class="answers">';
            for (var j = 0; j < task.answers.length; j++) {
                html += '<div class="answer">' + (j + 1) + '. ' + task.answers[j] + '</div>';
            }
            html += '</div>';
        } else {
            html += '<div style="color: #999;">Нет ответов</div>';
        }
        
        html += '</div>';
    }
    
    html += '</body></html>';
    return html;
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