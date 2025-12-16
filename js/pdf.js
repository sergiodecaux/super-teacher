// ═══════════════════════════════════════════════════════
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ═══════════════════════════════════════════════════════

function getThemeStyles(themeName) {
    const theme = THEMES[themeName] || THEMES.default;
    return {
        gradient: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`,
        accent: theme.accent,
        decorations: theme.decorations || ["⭐", "🌟", "✨", "💫"],
        background: theme.background || "#fff"
    };
}


// ═══════════════════════════════════════════════════════
// ГЕНЕРАЦИЯ РАБОЧЕГО ЛИСТА
// ═══════════════════════════════════════════════════════

function generateWorksheetHTML(data, themeName) {
    themeName = themeName || "default";
    const theme = getThemeStyles(themeName);
    const tasks = data.tasks || [];
    
    let tasksHTML = "";
    
    tasks.forEach((task, i) => {
        const decoration = theme.decorations[i % theme.decorations.length];
        const elementsHTML = (task.elements || []).map(el => 
            `<div class="element">${el}</div>`
        ).join('');
        
        tasksHTML += `
        <div class="task-page" style="background: ${theme.background};">
            <div class="decorations">
                <span class="decor decor-tl">${theme.decorations[0]}</span>
                <span class="decor decor-tr">${theme.decorations[1]}</span>
                <span class="decor decor-bl">${theme.decorations[2]}</span>
                <span class="decor decor-br">${theme.decorations[3]}</span>
            </div>
            
            <div class="page-number">Страница ${i + 1} из ${tasks.length}</div>
            
            <div class="header" style="background: ${theme.gradient};">
                <div class="title">${decoration} ${data.title}</div>
                <div class="subtitle">${data.subtitle}</div>
                <div class="level" style="color: ${theme.accent};">${task.level} ${task.level_name}</div>
            </div>
            
            <div class="info">
                <div class="info-item">
                    <span>👤 Имя:</span>
                    <div class="info-line"></div>
                </div>
                <div class="info-item">
                    <span>📅 Дата:</span>
                    <div class="info-line short"></div>
                </div>
                <div class="info-item">
                    <span>📚 Класс:</span>
                    <div class="info-line short"></div>
                </div>
            </div>
            
            <div class="instruction" style="background: ${theme.gradient};">
                📝 ${task.instruction}
            </div>
            
            ${task.content ? `<div class="content">${task.content}</div>` : ''}
            
            <div class="elements">${elementsHTML}</div>
            
            <div class="answer-box">
                <div class="answer-label">✏️ Место для решения:</div>
                <div class="answer-line"></div>
                <div class="answer-line"></div>
                <div class="answer-line"></div>
            </div>
            
            <div class="drawing-area">
                <div class="drawing-header">🎨 Нарисуй или запиши здесь</div>
                <div class="drawing-space"></div>
            </div>
            
            <div class="footer">
                <div class="stars">
                    <span>Оценка:</span>
                    <div class="star-row">☆☆☆☆☆</div>
                </div>
                <div class="motivation" style="background: ${theme.accent}15; border-color: ${theme.accent}; color: ${theme.accent};">
                    ${i === tasks.length - 1 ? data.motivation : `Задание ${i + 1} выполнено! ${decoration}`}
                </div>
                <div class="teacher">
                    <span>Учитель:</span>
                    <div class="grade-circle"></div>
                </div>
            </div>
        </div>`;
    });
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>${data.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Patrick+Hand&display=swap');
        
        @page { size: A4; margin: 10mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Comfortaa', sans-serif; background: #e0e0e0; }
        
        .task-page {
            width: 210mm;
            min-height: 287mm;
            max-height: 287mm;
            padding: 12mm;
            margin: 0 auto 20px;
            position: relative;
            overflow: hidden;
            page-break-after: always;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }
        .task-page:last-child { page-break-after: avoid; }
        
        .decorations { position: absolute; inset: 0; pointer-events: none; }
        .decor { position: absolute; font-size: 24px; opacity: 0.5; }
        .decor-tl { top: 8px; left: 10px; }
        .decor-tr { top: 8px; right: 10px; }
        .decor-bl { bottom: 8px; left: 10px; }
        .decor-br { bottom: 8px; right: 10px; }
        
        .page-number {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: #999;
        }
        
        .header {
            text-align: center;
            padding: 15px 20px;
            border-radius: 15px;
            margin-bottom: 12px;
            color: white;
        }
        .title {
            font-size: 22px;
            font-weight: 700;
            font-family: 'Patrick Hand', cursive;
        }
        .subtitle {
            font-size: 12px;
            margin: 5px 0;
            opacity: 0.9;
        }
        .level {
            display: inline-block;
            padding: 5px 15px;
            background: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin-top: 8px;
        }
        
        .info {
            display: flex;
            justify-content: space-between;
            padding: 10px 15px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-bottom: 12px;
        }
        .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
        }
        .info-line {
            width: 100px;
            height: 22px;
            border-bottom: 2px solid #333;
        }
        .info-line.short { width: 60px; }
        
        .instruction {
            color: white;
            padding: 12px 18px;
            border-radius: 12px;
            margin-bottom: 12px;
            font-size: 15px;
            font-family: 'Patrick Hand', cursive;
        }
        
        .content {
            padding: 10px 15px;
            background: #fafafa;
            border-radius: 10px;
            border-left: 4px solid #2196F3;
            margin-bottom: 12px;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .elements {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 10px;
            margin-bottom: 12px;
        }
        .element {
            background: #fff;
            border: 2px dashed #ccc;
            border-radius: 10px;
            padding: 12px 8px;
            font-size: 15px;
            font-family: 'Patrick Hand', cursive;
            text-align: center;
            min-height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1.3;
        }
        
        .answer-box {
            padding: 12px;
            background: #fffde7;
            border: 2px solid #ffc107;
            border-radius: 10px;
            margin-bottom: 12px;
        }
        .answer-label {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .answer-line {
            height: 28px;
            border-bottom: 2px dotted #999;
            margin: 6px 0;
        }
        
        .drawing-area {
            border: 2px dashed #aaa;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 12px;
        }
        .drawing-header {
            background: #e3f2fd;
            padding: 6px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
        }
        .drawing-space {
            height: 50px;
            background: 
                linear-gradient(#eee 1px, transparent 1px),
                linear-gradient(90deg, #eee 1px, transparent 1px);
            background-size: 12px 12px;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            border-top: 2px dashed #ddd;
        }
        .stars {
            font-size: 11px;
            text-align: center;
        }
        .star-row {
            font-size: 20px;
            color: #ffc107;
            letter-spacing: 2px;
        }
        .motivation {
            padding: 8px 12px;
            border: 2px solid;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            max-width: 180px;
            text-align: center;
        }
        .teacher {
            font-size: 11px;
            text-align: center;
        }
        .grade-circle {
            width: 35px;
            height: 35px;
            border: 2px solid #333;
            border-radius: 50%;
            background: #fff;
            margin-top: 5px;
        }
        
        .print-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
            font-family: 'Comfortaa', sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 1000;
        }
        .print-btn:hover { transform: scale(1.05); }
        
        @media print {
            body { background: white; }
            .task-page { box-shadow: none; margin: 0; }
            .print-btn { display: none; }
        }
    </style>
</head>
<body>
    ${tasksHTML}
    <button class="print-btn" onclick="window.print()">🖨️ Распечатать все</button>
</body>
</html>`;
}


// ═══════════════════════════════════════════════════════
// ГЕНЕРАЦИЯ ОТВЕТОВ
// ═══════════════════════════════════════════════════════

function generateAnswersHTML(data) {
    const tasks = data.tasks || [];
    
    let answersHTML = "";
    
    tasks.forEach((task, i) => {
        const answersItems = (task.answers || []).map((ans, j) => 
            `<div class="answer-item">
                <span class="num">${j + 1}</span>
                <span class="text">${ans}</span>
            </div>`
        ).join('');
        
        answersHTML += `
        <div class="task-block level-${(i % 5) + 1}">
            <div class="task-title">${task.level} ${task.level_name}</div>
            <div class="answers-grid">
                ${answersItems || '<span class="no-answers">Ответы не указаны</span>'}
            </div>
        </div>`;
    });
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Ответы: ${data.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap');
        
        @page { size: A4; margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Comfortaa', sans-serif; padding: 20px; background: #fff; }
        
        .container { max-width: 800px; margin: 0 auto; }
        
        .header {
            text-align: center;
            padding: 25px;
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-radius: 15px;
            margin-bottom: 25px;
            border: 3px solid #1976d2;
        }
        .header h1 {
            color: #1565c0;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .header .title {
            font-size: 18px;
            color: #333;
            margin-bottom: 10px;
        }
        .badge {
            display: inline-block;
            background: #1976d2;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
        }
        
        .task-block {
            background: #fff;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 15px;
        }
        .task-block.level-1 { border-left: 5px solid #4CAF50; }
        .task-block.level-2 { border-left: 5px solid #8BC34A; }
        .task-block.level-3 { border-left: 5px solid #FFEB3B; }
        .task-block.level-4 { border-left: 5px solid #FF9800; }
        .task-block.level-5 { border-left: 5px solid #f44336; }
        
        .task-title {
            font-weight: bold;
            font-size: 15px;
            margin-bottom: 12px;
            color: #333;
        }
        
        .answers-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .answer-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #e8f5e9;
            border-radius: 8px;
            border: 1px solid #c8e6c9;
        }
        .answer-item .num {
            background: #4CAF50;
            color: white;
            min-width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        .answer-item .text {
            color: #2e7d32;
            font-weight: 600;
            font-size: 13px;
        }
        
        .no-answers {
            color: #999;
            font-style: italic;
        }
        
        .footer-note {
            text-align: center;
            margin-top: 25px;
            padding: 15px;
            background: #fff3e0;
            border-radius: 10px;
            color: #e65100;
            font-size: 13px;
            border: 2px dashed #ffcc80;
        }
        
        .print-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
            font-family: 'Comfortaa', sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .print-btn:hover { transform: scale(1.05); }
        
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔑 ОТВЕТЫ ДЛЯ УЧИТЕЛЯ</h1>
            <div class="title">${data.title}</div>
            <span class="badge">👨‍🏫 Только для проверки</span>
        </div>
        
        ${answersHTML}
        
        <div class="footer-note">
            ⚠️ Не показывайте ответы ученикам до проверки работы!
        </div>
    </div>
    
    <button class="print-btn" onclick="window.print()">🖨️ Распечатать</button>
</body>
</html>`;
}


// ═══════════════════════════════════════════════════════
// СКАЧИВАНИЕ
// ═══════════════════════════════════════════════════════

function downloadHTML(content, filename) {
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}