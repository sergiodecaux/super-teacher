// Генерация HTML рабочего листа
function generateWorksheetHTML(data, theme) {
    const tasks = data.tasks || [];
    
    let tasksHTML = "";
    tasks.forEach((task, i) => {
        const levelClass = `level-${(i % 5) + 1}`;
        const elementsHTML = (task.elements || []).map(el => 
            `<div class="element-card">${el}</div>`
        ).join("");
        
        tasksHTML += `
        <div class="task-page">
            <div class="page-number">Страница ${i + 1} из ${tasks.length}</div>
            
            <div class="task-header ${levelClass}">
                <div class="worksheet-title">${data.title}</div>
                <div class="worksheet-subtitle">${data.subtitle}</div>
                <div class="task-level">${task.level} ${task.level_name}</div>
            </div>
            
            <div class="student-info">
                <div class="info-field">
                    <span class="info-label">👤 Имя:</span>
                    <div class="info-line"></div>
                </div>
                <div class="info-field">
                    <span class="info-label">📅 Дата:</span>
                    <div class="info-line-short"></div>
                </div>
            </div>
            
            <div class="instruction-box">📝 ${task.instruction}</div>
            
            ${task.content ? `<div class="content-text">${task.content}</div>` : ""}
            
            <div class="elements-grid">${elementsHTML}</div>
            
            <div class="answer-section">
                <span class="answer-label">✏️ Место для решения:</span>
                <div class="answer-lines">
                    <div class="answer-line"></div>
                    <div class="answer-line"></div>
                </div>
            </div>
            
            <div class="drawing-zone">
                <div class="drawing-header">🎨 Нарисуй или запиши</div>
                <div class="drawing-area"></div>
            </div>
            
            <div class="page-footer">
                <div class="stars-section">
                    <span>Оценка:</span>
                    <div class="stars-row">☆☆☆☆☆</div>
                </div>
                <div class="motivation-bubble">
                    ${i === tasks.length - 1 ? data.motivation : `Задание ${i + 1} из ${tasks.length}`}
                </div>
            </div>
        </div>
        `;
    });
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>${data.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&family=Patrick+Hand&display=swap');
        @page { size: A4; margin: 10mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Comfortaa', sans-serif; background: #fff; }
        
        .task-page {
            width: 210mm; min-height: 287mm; max-height: 287mm;
            padding: 12mm; margin: 0 auto; position: relative;
            page-break-after: always; background: #fff;
        }
        .task-page:last-child { page-break-after: avoid; }
        
        .page-number {
            position: absolute; bottom: 8px; left: 50%;
            transform: translateX(-50%); font-size: 11px; color: #999;
        }
        
        .task-header {
            text-align: center; padding: 15px; border-radius: 15px;
            margin-bottom: 15px; border: 3px solid;
        }
        .task-header.level-1 { background: #e8f5e9; border-color: #4CAF50; }
        .task-header.level-2 { background: #fffde7; border-color: #FFEB3B; }
        .task-header.level-3 { background: #fff3e0; border-color: #FF9800; }
        .task-header.level-4 { background: #ffebee; border-color: #f44336; }
        .task-header.level-5 { background: #f3e5f5; border-color: #9C27B0; }
        
        .worksheet-title { font-size: 22px; font-weight: 700; font-family: 'Patrick Hand', cursive; }
        .worksheet-subtitle { font-size: 12px; color: #666; margin: 5px 0; }
        .task-level { display: inline-block; padding: 5px 15px; background: #fff; border-radius: 20px; font-weight: bold; }
        
        .student-info {
            display: flex; justify-content: space-between; gap: 20px;
            margin-bottom: 15px; padding: 10px 15px; background: #f5f5f5; border-radius: 10px;
        }
        .info-field { display: flex; align-items: center; gap: 10px; }
        .info-label { font-size: 13px; font-weight: bold; }
        .info-line { width: 120px; height: 25px; border-bottom: 2px solid #333; }
        .info-line-short { width: 80px; height: 25px; border-bottom: 2px solid #333; }
        
        .instruction-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; padding: 15px 20px; border-radius: 12px;
            margin-bottom: 15px; font-size: 16px; font-family: 'Patrick Hand', cursive;
        }
        
        .content-text {
            font-size: 15px; margin-bottom: 15px; padding: 10px 15px;
            background: #fafafa; border-radius: 10px; border-left: 4px solid #2196F3;
        }
        
        .elements-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px; margin-bottom: 20px;
        }
        .element-card {
            background: #fff; border: 2px dashed #bbb; border-radius: 12px;
            padding: 15px; font-size: 18px; font-family: 'Patrick Hand', cursive;
            text-align: center; min-height: 50px;
        }
        
        .answer-section {
            margin-top: auto; padding: 15px; background: #fffde7;
            border: 2px solid #ffc107; border-radius: 12px;
        }
        .answer-label { font-size: 14px; font-weight: bold; margin-bottom: 10px; display: block; }
        .answer-lines { display: flex; flex-direction: column; gap: 15px; }
        .answer-line { height: 30px; border-bottom: 2px dotted #999; }
        
        .drawing-zone { margin-top: 15px; border: 3px dashed #aaa; border-radius: 12px; }
        .drawing-header { background: #e3f2fd; padding: 8px; text-align: center; font-size: 12px; font-weight: bold; }
        .drawing-area { height: 60px; background: linear-gradient(#eee 1px, transparent 1px), linear-gradient(90deg, #eee 1px, transparent 1px); background-size: 15px 15px; }
        
        .page-footer {
            display: flex; justify-content: space-between; align-items: center;
            margin-top: 15px; padding-top: 10px; border-top: 2px dashed #ddd;
        }
        .stars-section { font-size: 12px; }
        .stars-row { font-size: 24px; color: #ffc107; }
        .motivation-bubble {
            padding: 10px 15px; background: #e8f5e9; border: 2px solid #4caf50;
            border-radius: 15px; font-size: 12px; font-weight: bold; color: #2e7d32;
        }
        
        .print-btn {
            position: fixed; bottom: 20px; right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border: none; padding: 15px 30px; border-radius: 30px;
            font-size: 16px; cursor: pointer; font-family: 'Comfortaa', sans-serif;
        }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    ${tasksHTML}
    <button class="print-btn" onclick="window.print()">🖨️ Распечатать</button>
</body>
</html>`;
}

// Генерация HTML с ответами
function generateAnswersHTML(data) {
    const tasks = data.tasks || [];
    
    let answersHTML = "";
    tasks.forEach((task, i) => {
        const levelClass = `level-${(i % 5) + 1}`;
        const answersItems = (task.answers || []).map((ans, j) => 
            `<div class="answer-item"><span class="num">${j + 1}</span><span class="text">${ans}</span></div>`
        ).join("");
        
        answersHTML += `
        <div class="task-answers ${levelClass}">
            <div class="task-title">${task.level} ${task.level_name}</div>
            <div class="answers-grid">${answersItems || '<span style="color:#999">Нет ответов</span>'}</div>
        </div>
        `;
    });
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Ответы: ${data.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Comfortaa', sans-serif; padding: 20px; background: #fff; }
        
        .answers-page { max-width: 800px; margin: 0 auto; }
        
        .answers-header {
            text-align: center; padding: 20px; border-radius: 15px; margin-bottom: 25px;
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border: 3px solid #1976d2;
        }
        .answers-header h1 { color: #1565c0; font-size: 22px; margin-bottom: 10px; }
        .badge { background: #1976d2; color: white; padding: 5px 15px; border-radius: 20px; font-size: 11px; }
        
        .task-answers {
            background: #fff; border: 2px solid #e0e0e0; border-radius: 12px;
            padding: 15px 20px; margin-bottom: 15px;
        }
        .task-answers.level-1 { border-left: 5px solid #4CAF50; }
        .task-answers.level-2 { border-left: 5px solid #FFEB3B; }
        .task-answers.level-3 { border-left: 5px solid #FF9800; }
        .task-answers.level-4 { border-left: 5px solid #f44336; }
        .task-answers.level-5 { border-left: 5px solid #9C27B0; }
        
        .task-title { font-weight: bold; font-size: 14px; margin-bottom: 12px; }
        .answers-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .answer-item {
            display: flex; align-items: center; gap: 8px; padding: 6px 12px;
            background: #f0f7f0; border-radius: 8px; border: 1px solid #c8e6c9;
        }
        .answer-item .num {
            background: #4CAF50; color: white; width: 22px; height: 22px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 11px; font-weight: bold;
        }
        .answer-item .text { color: #1b5e20; font-weight: bold; }
        
        .footer-note {
            text-align: center; margin-top: 25px; padding: 15px;
            background: #fff3e0; border-radius: 10px; color: #e65100;
        }
        
        .print-btn {
            position: fixed; bottom: 20px; right: 20px;
            background: #4CAF50; color: white; border: none; padding: 15px 30px;
            border-radius: 30px; font-size: 16px; cursor: pointer;
        }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <div class="answers-page">
        <div class="answers-header">
            <h1>🔑 ОТВЕТЫ ДЛЯ УЧИТЕЛЯ</h1>
            <div style="font-size: 16px; margin: 10px 0;">${data.title}</div>
            <span class="badge">👨‍🏫 Только для проверки</span>
        </div>
        ${answersHTML}
        <div class="footer-note">⚠️ Не показывайте ответы ученикам до проверки!</div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Распечатать</button>
</body>
</html>`;
}

// Скачивание файла
function downloadHTML(content, filename) {
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}