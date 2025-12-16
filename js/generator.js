// ═══════════════════════════════════════════════════════
// ЛОКАЛЬНЫЙ ГЕНЕРАТОР ЗАДАНИЙ
// ═══════════════════════════════════════════════════════

// Утилиты
function shuffle(array) {
    var result = array.slice();
    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
    return result;
}

function pickRandom(array, count) {
    return shuffle(array).slice(0, count);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ═══════════════════════════════════════════════════════
// ГЛАВНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ
// ═══════════════════════════════════════════════════════

function generateWorksheet(subject, grade, topic, taskTypes, difficulty, tasksCount) {
    console.log("🎲 Локальная генерация:", subject, grade, topic);
    
    var generator = getGenerator(subject, topic);
    
    if (!generator) {
        console.log("⚠️ Генератор не найден, используем AI");
        return null; // Сигнал использовать AI
    }
    
    return generator(grade, topic, taskTypes, difficulty, tasksCount);
}

function getGenerator(subject, topic) {
    var topicLower = (topic || "").toLowerCase();
    
    // Русский язык
    if (subject === "russian") {
        if (topicLower.indexOf("оконч") !== -1) return generateEndingsWorksheet;
        if (topicLower.indexOf("склонен") !== -1) return generateDeclensionWorksheet;
        if (topicLower.indexOf("падеж") !== -1) return generateCasesWorksheet;
        if (topicLower.indexOf("спряжен") !== -1) return generateConjugationWorksheet;
        if (topicLower.indexOf("безудар") !== -1) return generateUnstressedVowelsWorksheet;
        if (topicLower.indexOf("парн") !== -1) return generatePairedConsonantsWorksheet;
        if (topicLower.indexOf("жи") !== -1 || topicLower.indexOf("ши") !== -1) return generateSpellingRulesWorksheet;
    }
    
    // Математика
    if (subject === "math") {
        if (topicLower.indexOf("сложен") !== -1) return generateAdditionWorksheet;
        if (topicLower.indexOf("вычит") !== -1) return generateSubtractionWorksheet;
        if (topicLower.indexOf("умнож") !== -1 || topicLower.indexOf("таблиц") !== -1) return generateMultiplicationWorksheet;
        if (topicLower.indexOf("делен") !== -1) return generateDivisionWorksheet;
        if (topicLower.indexOf("счёт") !== -1 || topicLower.indexOf("счет") !== -1) return generateCountingWorksheet;
        if (topicLower.indexOf("состав") !== -1) return generateNumberCompositionWorksheet;
    }
    
    // Логика
    if (subject === "logic") {
        if (topicLower.indexOf("лишн") !== -1) return generateOddOneOutWorksheet;
        if (topicLower.indexOf("ряд") !== -1 || topicLower.indexOf("законом") !== -1) return generateSequenceWorksheet;
    }
    
    return null;
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: ОКОНЧАНИЯ СУЩЕСТВИТЕЛЬНЫХ
// ═══════════════════════════════════════════════════════

function generateEndingsWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var allNouns = WORD_BANKS.nouns.decl1.concat(WORD_BANKS.nouns.decl2, WORD_BANKS.nouns.decl3);
    
    // Задание 1: Вставь окончание (простое)
    tasks.push(generateEndingsTask1());
    
    // Задание 2: Е или И?
    tasks.push(generateEndingsTask2());
    
    // Задание 3: Текст с пропусками
    tasks.push(generateEndingsTask3());
    
    // Задание 4: Исправь ошибки
    tasks.push(generateEndingsTask4());
    
    // Задание 5: Поставь в нужный падеж
    tasks.push(generateEndingsTask5());
    
    return {
        title: "📝 Окончания существительных",
        subtitle: "Русский язык, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Отлично! Ты разобрался в окончаниях! 🌟"
    };
}

function generateEndingsTask1() {
    var nouns = pickRandom(WORD_BANKS.nouns.decl1.concat(WORD_BANKS.nouns.decl3), 6);
    var cases = ["gen", "dat", "prep"];
    var caseQuestions = {gen: "кого? чего?", dat: "кому? чему?", prep: "о ком? о чём?"};
    var caseNames = {gen: "Р.п.", dat: "Д.п.", prep: "П.п."};
    var prepositions = {gen: ["у", "от", "до", "из", "без"], dat: ["к", "по"], prep: ["о", "на", "в"]};
    
    var elements = [];
    var answers = [];
    
    nouns.forEach(function(noun) {
        var caseKey = cases[randomInt(0, cases.length - 1)];
        var prep = prepositions[caseKey][randomInt(0, prepositions[caseKey].length - 1)];
        var form = noun[caseKey];
        var masked = maskEnding(noun.word, form);
        var declNum = getDeclension(noun.word);
        
        elements.push(prep + " " + masked + " (" + caseQuestions[caseKey] + ")");
        answers.push(prep + " " + form.toUpperCase().slice(-2).toLowerCase() === form.slice(-2) 
            ? form.slice(0, -1) + form.slice(-1).toUpperCase() 
            : form + " (" + declNum + " скл., " + caseNames[caseKey] + ")");
    });
    
    return {
        level: "⭐",
        level_name: "Вставь окончание",
        instruction: "Вставь пропущенное окончание. Определи склонение и падеж.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateEndingsTask2() {
    // Выбираем слова 1 и 3 склонения для сравнения Е/И
    var decl1 = pickRandom(WORD_BANKS.nouns.decl1, 3);
    var decl3 = pickRandom(WORD_BANKS.nouns.decl3, 3);
    var mixed = shuffle(decl1.concat(decl3));
    
    var elements = [];
    var answers = [];
    
    mixed.forEach(function(noun) {
        var isDecl3 = WORD_BANKS.nouns.decl3.indexOf(noun) !== -1;
        var caseKey = "prep"; // Предложный падеж
        var form = noun[caseKey];
        var prep = "на";
        
        // Маскируем последнюю букву
        var masked = form.slice(0, -1) + "_";
        
        elements.push(prep + " " + masked + " (-е/-и)");
        
        var ending = isDecl3 ? "И" : "Е";
        var declNum = isDecl3 ? "3" : "1";
        answers.push(prep + " " + form.slice(0, -1) + ending + " (" + declNum + " скл., П.п.)");
    });
    
    return {
        level: "⭐⭐",
        level_name: "Е или И?",
        instruction: "Выбери правильное окончание: Е или И?",
        content: "Помни: в 3 склонении в Р.п., Д.п., П.п. пишется И",
        elements: elements,
        answers: answers
    };
}

function generateEndingsTask3() {
    var nouns = pickRandom(WORD_BANKS.nouns.decl1, 4);
    var templates = [
        "Мы вышли из {0} и пошли к {1}.",
        "У {2} остановились отдохнуть.",
        "На {3} сидела птица."
    ];
    
    var text = "";
    var elements = [];
    var answers = [];
    var prepositions = ["из", "к", "у", "на"];
    var cases = ["gen", "dat", "gen", "prep"];
    var caseNames = ["Р.п.", "Д.п.", "Р.п.", "П.п."];
    
    nouns.forEach(function(noun, i) {
        var form = noun[cases[i]];
        var masked = maskEnding(noun.word, form);
        var prep = prepositions[i];
        
        elements.push(prep + " " + masked + " →");
        answers.push(prep + " " + highlightEnding(noun.word, form) + " (" + caseNames[i] + ")");
    });
    
    // Создаём текст
    text = "Мы вышли " + prepositions[0] + " " + maskEnding(nouns[0].word, nouns[0][cases[0]]) + 
           " и пошли " + prepositions[1] + " " + maskEnding(nouns[1].word, nouns[1][cases[1]]) + ". " +
           prepositions[2].charAt(0).toUpperCase() + prepositions[2].slice(1) + " " + 
           maskEnding(nouns[2].word, nouns[2][cases[2]]) + " остановились. " +
           prepositions[3].charAt(0).toUpperCase() + prepositions[3].slice(1) + " " + 
           maskEnding(nouns[3].word, nouns[3][cases[3]]) + " пели птицы.";
    
    return {
        level: "⭐⭐⭐",
        level_name: "Текст с пропусками",
        instruction: "Спиши текст, вставляя пропущенные окончания.",
        content: text,
        elements: elements,
        answers: answers
    };
}

function generateEndingsTask4() {
    // Генерируем предложения с ОШИБКАМИ
    var nouns = pickRandom(WORD_BANKS.nouns.decl1.concat(WORD_BANKS.nouns.decl3), 4);
    var elements = [];
    var answers = [];
    
    nouns.forEach(function(noun) {
        var isDecl3 = WORD_BANKS.nouns.decl3.some(function(n) { return n.word === noun.word; });
        var caseKey = "prep";
        var correctForm = noun[caseKey];
        
        // Создаём НЕПРАВИЛЬНУЮ форму
        var wrongEnding = isDecl3 ? "е" : "и";
        var wrongForm = correctForm.slice(0, -1) + wrongEnding;
        
        var sentence = "Мы говорили о " + wrongForm + ".";
        if (randomInt(0, 1) === 0) {
            sentence = "Дети играли на " + wrongForm + ".";
        }
        
        var correctEnding = isDecl3 ? "И" : "Е";
        
        elements.push(sentence);
        answers.push(correctForm.slice(0, -1) + correctEnding + " (не " + wrongForm + ")");
    });
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Исправь ошибки",
        instruction: "В каждом предложении найди и исправь ошибку в окончании.",
        content: "Внимание: в КАЖДОМ предложении есть ошибка!",
        elements: elements,
        answers: answers
    };
}

function generateEndingsTask5() {
    var nouns = pickRandom(WORD_BANKS.nouns.decl1.concat(WORD_BANKS.nouns.decl3), 5);
    var templates = [
        {prep: "к", caseKey: "dat", caseName: "Д.п."},
        {prep: "о", caseKey: "prep", caseName: "П.п."},
        {prep: "по", caseKey: "dat", caseName: "Д.п."},
        {prep: "от", caseKey: "gen", caseName: "Р.п."},
        {prep: "без", caseKey: "gen", caseName: "Р.п."}
    ];
    
    var elements = [];
    var answers = [];
    
    nouns.forEach(function(noun, i) {
        var tmpl = templates[i % templates.length];
        var correctForm = noun[tmpl.caseKey];
        var isDecl3 = WORD_BANKS.nouns.decl3.some(function(n) { return n.word === noun.word; });
        var declNum = isDecl3 ? "3" : (WORD_BANKS.nouns.decl1.some(function(n) { return n.word === noun.word; }) ? "1" : "2");
        
        // Слово в НАЧАЛЬНОЙ форме в скобках!
        elements.push(tmpl.prep + " (" + noun.word + ") →");
        answers.push(tmpl.prep + " " + correctForm + " (" + declNum + " скл., " + tmpl.caseName + ")");
    });
    
    return {
        level: "⭐⭐⭐⭐⭐",
        level_name: "Поставь в нужный падеж",
        instruction: "Измени слово в скобках так, чтобы получилось правильное словосочетание.",
        content: "",
        elements: elements,
        answers: answers
    };
}

// Вспомогательные функции
function maskEnding(base, form) {
    // Находим общую часть и маскируем окончание
    var common = 0;
    for (var i = 0; i < Math.min(base.length, form.length); i++) {
        if (base[i].toLowerCase() === form[i].toLowerCase()) common++;
        else break;
    }
    if (common < 2) common = Math.min(base.length, form.length) - 2;
    return form.slice(0, common) + "_";
}

function highlightEnding(base, form) {
    var common = 0;
    for (var i = 0; i < Math.min(base.length, form.length); i++) {
        if (base[i].toLowerCase() === form[i].toLowerCase()) common++;
        else break;
    }
    if (common < 2) common = Math.min(base.length, form.length) - 2;
    return form.slice(0, common) + form.slice(common).toUpperCase();
}

function getDeclension(word) {
    if (WORD_BANKS.nouns.decl1.some(function(n) { return n.word === word; })) return "1";
    if (WORD_BANKS.nouns.decl2.some(function(n) { return n.word === word; })) return "2";
    if (WORD_BANKS.nouns.decl3.some(function(n) { return n.word === word; })) return "3";
    return "?";
}
// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: СКЛОНЕНИЕ СУЩЕСТВИТЕЛЬНЫХ
// ═══════════════════════════════════════════════════════

function generateDeclensionWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    
    tasks.push(generateDeclensionTask1()); // Определи склонение
    tasks.push(generateDeclensionTask2()); // Распредели по склонениям
    tasks.push(generateDeclensionTask3()); // Подбери другое склонение
    tasks.push(generateDeclensionTask4()); // Найди в тексте
    tasks.push(generateDeclensionTask5()); // Особые случаи
    
    return {
        title: "📚 Склонение существительных",
        subtitle: "Русский язык, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Молодец! Склонения покорены! 📚"
    };
}

function generateDeclensionTask1() {
    var decl1 = pickRandom(WORD_BANKS.nouns.decl1, 2);
    var decl2 = pickRandom(WORD_BANKS.nouns.decl2, 2);
    var decl3 = pickRandom(WORD_BANKS.nouns.decl3, 2);
    var all = shuffle(decl1.concat(decl2, decl3));
    
    var elements = [];
    var answers = [];
    
    all.forEach(function(noun) {
        elements.push(noun.word + " — ?");
        answers.push(getDeclension(noun.word) + " скл.");
    });
    
    return {
        level: "⭐",
        level_name: "Определи склонение",
        instruction: "Определи склонение существительного.",
        content: "1 скл. — ж.р. и м.р. на -а/-я; 2 скл. — м.р. и ср.р.; 3 скл. — ж.р. на ь",
        elements: elements,
        answers: answers
    };
}

function generateDeclensionTask2() {
    var decl1 = pickRandom(WORD_BANKS.nouns.decl1, 3);
    var decl2 = pickRandom(WORD_BANKS.nouns.decl2, 2);
    var decl3 = pickRandom(WORD_BANKS.nouns.decl3, 3);
    var all = shuffle(decl1.concat(decl2, decl3));
    
    var words = all.map(function(n) { return n.word; }).join(", ");
    
    return {
        level: "⭐⭐",
        level_name: "Распредели по склонениям",
        instruction: "Запиши слова в три столбика по склонениям.",
        content: "Слова: " + words,
        elements: [
            "1 склонение: ?",
            "2 склонение: ?",
            "3 склонение: ?"
        ],
        answers: [
            decl1.map(function(n) { return n.word; }).join(", "),
            decl2.map(function(n) { return n.word; }).join(", "),
            decl3.map(function(n) { return n.word; }).join(", ")
        ]
    };
}

function generateDeclensionTask3() {
    var pairs = [
        {word1: "папа", decl1: "1", word2: "отец", decl2: "2"},
        {word1: "мама", decl1: "1", word2: "мать", decl2: "3"},
        {word1: "лошадка", decl1: "1", word2: "лошадь", decl2: "3"},
        {word1: "мышка", decl1: "1", word2: "мышь", decl2: "3"},
        {word1: "тетрадка", decl1: "1", word2: "тетрадь", decl2: "3"},
        {word1: "ночка", decl1: "1", word2: "ночь", decl2: "3"},
        {word1: "дверка", decl1: "1", word2: "дверь", decl2: "3"},
        {word1: "кроватка", decl1: "1", word2: "кровать", decl2: "3"}
    ];
    
    var selected = pickRandom(pairs, 4);
    var elements = [];
    var answers = [];
    
    selected.forEach(function(pair) {
        elements.push(pair.word1 + " (" + pair.decl1 + " скл.) → ? (" + pair.decl2 + " скл.)");
        answers.push(pair.word2 + " (" + pair.decl2 + " скл.)");
    });
    
    return {
        level: "⭐⭐⭐",
        level_name: "Подбери слово другого склонения",
        instruction: "К каждому слову подбери близкое по значению слово другого склонения.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateDeclensionTask4() {
    var sentences = [
        {text: "Бабушка испекла пирог.", nouns: [{w: "бабушка", d: "1"}, {w: "пирог", d: "2"}]},
        {text: "Ночь была тёплой.", nouns: [{w: "ночь", d: "3"}]},
        {text: "Мальчик читает книгу.", nouns: [{w: "мальчик", d: "2"}, {w: "книгу", d: "1"}]},
        {text: "Дети играли во дворе.", nouns: [{w: "дети", d: "3"}, {w: "дворе", d: "2"}]},
        {text: "Мама готовит обед.", nouns: [{w: "мама", d: "1"}, {w: "обед", d: "2"}]},
        {text: "Лошадь бежит по дороге.", nouns: [{w: "лошадь", d: "3"}, {w: "дороге", d: "1"}]}
    ];
    
    var selected = pickRandom(sentences, 3);
    var fullText = selected.map(function(s) { return s.text; }).join(" ");
    
    var byDecl = {1: [], 2: [], 3: []};
    selected.forEach(function(s) {
        s.nouns.forEach(function(n) {
            byDecl[n.d].push(n.w);
        });
    });
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Найди в тексте",
        instruction: "Выпиши все существительные и определи их склонение.",
        content: fullText,
        elements: [
            "1 склонение:",
            "2 склонение:",
            "3 склонение:"
        ],
        answers: [
            byDecl[1].join(", ") || "—",
            byDecl[2].join(", ") || "—",
            byDecl[3].join(", ") || "—"
        ]
    };
}

function generateDeclensionTask5() {
    var special = [
        {word: "путь", answer: "разносклоняемое"},
        {word: "время", answer: "разносклоняемое (на -мя)"},
        {word: "имя", answer: "разносклоняемое (на -мя)"},
        {word: "пламя", answer: "разносклоняемое (на -мя)"},
        {word: "знамя", answer: "разносклоняемое (на -мя)"},
        {word: "кофе", answer: "несклоняемое"},
        {word: "пальто", answer: "несклоняемое"},
        {word: "метро", answer: "несклоняемое"},
        {word: "кино", answer: "несклоняемое"},
        {word: "какао", answer: "несклоняемое"}
    ];
    
    var selected = pickRandom(special, 5);
    
    return {
        level: "⭐⭐⭐⭐⭐",
        level_name: "Особые случаи",
        instruction: "Определи, к какой группе относятся эти слова.",
        content: "",
        elements: selected.map(function(s) { return s.word + " — ?"; }),
        answers: selected.map(function(s) { return s.answer; })
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: ПАДЕЖИ СУЩЕСТВИТЕЛЬНЫХ
// ═══════════════════════════════════════════════════════

function generateCasesWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    
    tasks.push(generateCasesTask1()); // Определи падеж
    tasks.push(generateCasesTask2()); // Поставь в падеж
    tasks.push(generateCasesTask3()); // Вопросы падежей
    tasks.push(generateCasesTask4()); // Просклоняй
    tasks.push(generateCasesTask5()); // Исправь падеж
    
    return {
        title: "📖 Падежи существительных",
        subtitle: "Русский язык, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты отлично знаешь падежи! 📖"
    };
}

function generateCasesTask1() {
    var nouns = pickRandom(WORD_BANKS.nouns.decl1.concat(WORD_BANKS.nouns.decl2), 6);
    var cases = [
        {key: "nom", name: "И.п.", template: "{WORD} читает книгу."},
        {key: "acc", name: "В.п.", template: "Я вижу {WORD}."},
        {key: "gen", name: "Р.п.", template: "Это дом {WORD}."},
        {key: "dat", name: "Д.п.", template: "Я иду к {WORD}."},
        {key: "inst", name: "Т.п.", template: "Я горжусь {WORD}."},
        {key: "prep", name: "П.п.", template: "Я думаю о {WORD}."}
    ];
    
    var elements = [];
    var answers = [];
    
    nouns.forEach(function(noun, i) {
        var caseInfo = cases[i % cases.length];
        var form = caseInfo.key === "nom" ? noun.word : noun[caseInfo.key];
        var sentence = caseInfo.template.replace("{WORD}", form.toUpperCase());
        
        elements.push(sentence);
        answers.push(caseInfo.name);
    });
    
    return {
        level: "⭐",
        level_name: "Определи падеж",
        instruction: "Определи падеж выделенного существительного.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateCasesTask2() {
    var nouns = pickRandom(WORD_BANKS.nouns.decl1, 4);
    var templates = [
        {prep: "для", caseKey: "gen", caseName: "Р.п."},
        {prep: "к", caseKey: "dat", caseName: "Д.п."},
        {prep: "с", caseKey: "inst", caseName: "Т.п."},
        {prep: "о", caseKey: "prep", caseName: "П.п."}
    ];
    
    var elements = [];
    var answers = [];
    
    nouns.forEach(function(noun, i) {
        var tmpl = templates[i];
        elements.push(tmpl.prep + " (" + noun.word + ") →");
        answers.push(tmpl.prep + " " + noun[tmpl.caseKey] + " (" + tmpl.caseName + ")");
    });
    
    return {
        level: "⭐⭐",
        level_name: "Поставь в нужный падеж",
        instruction: "Измени слово в скобках, чтобы получилось правильно.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateCasesTask3() {
    return {
        level: "⭐⭐⭐",
        level_name: "Вопросы падежей",
        instruction: "Напиши вопросы каждого падежа.",
        content: "",
        elements: [
            "Именительный — ?",
            "Родительный — ?",
            "Дательный — ?",
            "Винительный — ?",
            "Творительный — ?",
            "Предложный — ?"
        ],
        answers: [
            "кто? что?",
            "кого? чего?",
            "кому? чему?",
            "кого? что?",
            "кем? чем?",
            "о ком? о чём?"
        ]
    };
}

function generateCasesTask4() {
    var noun = pickRandom(WORD_BANKS.nouns.decl1, 1)[0];
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Просклоняй слово",
        instruction: "Просклоняй слово " + noun.word.toUpperCase() + " по всем падежам.",
        content: "",
        elements: [
            "И.п. (кто? что?) —",
            "Р.п. (кого? чего?) —",
            "Д.п. (кому? чему?) —",
            "В.п. (кого? что?) —",
            "Т.п. (кем? чем?) —",
            "П.п. (о ком? о чём?) —"
        ],
        answers: [
            noun.word,
            noun.gen,
            noun.dat,
            noun.acc,
            noun.inst,
            noun.prep
        ]
    };
}

function generateCasesTask5() {
    var nouns = pickRandom(WORD_BANKS.nouns.decl1, 3);
    var errors = [
        {wrong: "сестра", correct: "сестрЕ", case: "Д.п.", sentence: "Я подарил книгу {wrong}."},
        {wrong: "парк", correct: "паркЕ", case: "П.п.", sentence: "Мы гуляли в {wrong}."},
        {wrong: "поездка", correct: "поездкЕ", case: "П.п.", sentence: "Расскажи о {wrong}."}
    ];
    
    var elements = [];
    var answers = [];
    
    nouns.forEach(function(noun, i) {
        var template = errors[i % errors.length];
        elements.push(template.sentence.replace("{wrong}", noun.word));
        answers.push(noun[template.case === "Д.п." ? "dat" : "prep"] + " (" + template.case + ")");
    });
    
    return {
        level: "⭐⭐⭐⭐⭐",
        level_name: "Исправь падеж",
        instruction: "Найди ошибку в падеже и исправь.",
        content: "",
        elements: elements,
        answers: answers
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: СПРЯЖЕНИЕ ГЛАГОЛОВ
// ═══════════════════════════════════════════════════════

function generateConjugationWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    
    tasks.push(generateConjugationTask1()); // Определи спряжение
    tasks.push(generateConjugationTask2()); // Вставь окончание
    tasks.push(generateConjugationTask3()); // Исключения
    tasks.push(generateConjugationTask4()); // Е или И
    tasks.push(generateConjugationTask5()); // Проспрягай
    
    return {
        title: "🔤 Спряжение глаголов",
        subtitle: "Русский язык, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты освоил спряжение глаголов! 🔤"
    };
}

function generateConjugationTask1() {
    var conj1 = pickRandom(WORD_BANKS.verbs.conj1, 3);
    var conj2 = pickRandom(WORD_BANKS.verbs.conj2, 3);
    var all = shuffle(conj1.concat(conj2));
    
    var elements = [];
    var answers = [];
    
    all.forEach(function(verb) {
        var isConj1 = WORD_BANKS.verbs.conj1.some(function(v) { return v.inf === verb.inf; });
        elements.push(verb.inf + " — ?");
        answers.push(isConj1 ? "I спр." : "II спр.");
    });
    
    return {
        level: "⭐",
        level_name: "Определи спряжение",
        instruction: "Определи спряжение глагола по неопределённой форме.",
        content: "I спр. — на -ать, -ять, -еть, -уть (кроме искл.); II спр. — на -ить (+ исключения)",
        elements: elements,
        answers: answers
    };
}

function generateConjugationTask2() {
    var conj1 = pickRandom(WORD_BANKS.verbs.conj1, 3);
    var conj2 = pickRandom(WORD_BANKS.verbs.conj2, 3);
    var all = shuffle(conj1.concat(conj2));
    
    var pronouns = ["он", "они", "мы", "ты", "вы", "она"];
    var keys = ["on", "oni", "my", "ty", "vy", "on"];
    
    var elements = [];
    var answers = [];
    
    all.forEach(function(verb, i) {
        var pronoun = pronouns[i % pronouns.length];
        var key = keys[i % keys.length];
        var form = verb[key];
        var masked = maskVerbEnding(form);
        var isConj1 = WORD_BANKS.verbs.conj1.some(function(v) { return v.inf === verb.inf; });
        
        elements.push(pronoun + " " + masked);
        answers.push(form + " (" + (isConj1 ? "I" : "II") + " спр.)");
    });
    
    return {
        level: "⭐⭐",
        level_name: "Вставь окончание глагола",
        instruction: "Вставь пропущенное окончание. Определи спряжение.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateConjugationTask3() {
    return {
        level: "⭐⭐⭐",
        level_name: "Глаголы-исключения",
        instruction: "Вспомни и запиши глаголы-исключения II спряжения.",
        content: "",
        elements: [
            "4 глагола на -АТЬ:",
            "7 глаголов на -ЕТЬ:"
        ],
        answers: [
            "гнать, держать, дышать, слышать",
            "видеть, ненавидеть, смотреть, вертеть, обидеть, зависеть, терпеть"
        ]
    };
}

function generateConjugationTask4() {
    var exceptions = pickRandom(WORD_BANKS.verbs.exceptions, 5);
    var pronouns = ["он", "они", "мы", "ты", "она"];
    var keys = ["on", "oni", "my", "ty", "on"];
    
    var elements = [];
    var answers = [];
    
    exceptions.forEach(function(verb, i) {
        var pronoun = pronouns[i];
        var key = keys[i];
        var form = verb[key];
        var masked = maskVerbEnding(form);
        
        elements.push(pronoun + " " + masked);
        answers.push(form + " (II спр., искл.)");
    });
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Е или И в окончании?",
        instruction: "Вставь Е или И. Это глаголы-исключения!",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateConjugationTask5() {
    var verb = pickRandom(WORD_BANKS.verbs.conj1, 1)[0];
    
    return {
        level: "⭐⭐⭐⭐⭐",
        level_name: "Проспрягай глагол",
        instruction: "Проспрягай глагол " + verb.inf.toUpperCase() + " по лицам и числам.",
        content: "",
        elements: [
            "я —",
            "ты —",
            "он/она —",
            "мы —",
            "вы —",
            "они —"
        ],
        answers: [
            verb.ya,
            verb.ty,
            verb.on,
            verb.my,
            verb.vy,
            verb.oni
        ]
    };
}

function maskVerbEnding(form) {
    // Маскируем последние 2-3 буквы
    if (form.length > 4) {
        return form.slice(0, -2) + "_т";
    }
    return form.slice(0, -1) + "_";
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: БЕЗУДАРНЫЕ ГЛАСНЫЕ
// ═══════════════════════════════════════════════════════

function generateUnstressedVowelsWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var words = WORD_BANKS.unstressedVowels;
    
    // Задание 1: Вставь букву
    var selected1 = pickRandom(words, 6);
    tasks.push({
        level: "⭐",
        level_name: "Вставь букву",
        instruction: "Вставь пропущенную безударную гласную.",
        content: "",
        elements: selected1.map(function(w) { return w.word + " = ?"; }),
        answers: selected1.map(function(w) { return w.full + " (" + w.answer + ")"; })
    });
    
    // Задание 2: Подбери проверочное слово
    var selected2 = pickRandom(words, 6);
    tasks.push({
        level: "⭐⭐",
        level_name: "Подбери проверочное слово",
        instruction: "Запиши проверочное слово.",
        content: "",
        elements: selected2.map(function(w) { return w.full + " — ?"; }),
        answers: selected2.map(function(w) { return w.check; })
    });
    
    // Задание 3: О или А?
    var oaWords = words.filter(function(w) { return w.answer === "о" || w.answer === "а"; });
    var selected3 = pickRandom(oaWords, 6);
    tasks.push({
        level: "⭐⭐⭐",
        level_name: "О или А?",
        instruction: "Выбери правильную букву: О или А?",
        content: "",
        elements: selected3.map(function(w) { return w.word + " (-о-/-а-)"; }),
        answers: selected3.map(function(w) { return w.full + " (" + w.answer.toUpperCase() + "), проверка: " + w.check; })
    });
    
    // Задание 4: Е или И?
    var eiWords = words.filter(function(w) { return w.answer === "е" || w.answer === "и"; });
    var selected4 = pickRandom(eiWords, 6);
    tasks.push({
        level: "⭐⭐⭐⭐",
        level_name: "Е или И?",
        instruction: "Выбери правильную букву: Е или И?",
        content: "",
        elements: selected4.map(function(w) { return w.word + " (-е-/-и-)"; }),
        answers: selected4.map(function(w) { return w.full + " (" + w.answer.toUpperCase() + "), проверка: " + w.check; })
    });
    
    // Задание 5: Вставь букву и докажи
    var selected5 = pickRandom(words, 5);
    tasks.push({
        level: "⭐⭐⭐⭐⭐",
        level_name: "Вставь и докажи",
        instruction: "Вставь букву и запиши проверочное слово.",
        content: "",
        elements: selected5.map(function(w) { return w.word + " → ? (проверка: ?)"; }),
        answers: selected5.map(function(w) { return w.full + " (проверка: " + w.check + ")"; })
    });
    
    return {
        title: "✏️ Безударные гласные",
        subtitle: "Русский язык, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты научился проверять безударные гласные! ✏️"
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: ПАРНЫЕ СОГЛАСНЫЕ
// ═══════════════════════════════════════════════════════

function generatePairedConsonantsWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var words = WORD_BANKS.pairedConsonants;
    
    // Задание 1: Вставь букву
    var selected1 = pickRandom(words, 6);
    tasks.push({
        level: "⭐",
        level_name: "Вставь согласную",
        instruction: "Вставь пропущенную согласную на конце слова.",
        content: "",
        elements: selected1.map(function(w) { 
            return w.word.slice(0, -1) + "_ (" + w.letter + "/" + w.pair + ")"; 
        }),
        answers: selected1.map(function(w) { 
            return w.word + " (проверка: " + w.check + ")"; 
        })
    });
    
    // Задание 2: Подбери проверочное
    var selected2 = pickRandom(words, 6);
    tasks.push({
        level: "⭐⭐",
        level_name: "Подбери проверочное слово",
        instruction: "Запиши проверочное слово.",
        content: "",
        elements: selected2.map(function(w) { return w.word + " — ?"; }),
        answers: selected2.map(function(w) { return w.check; })
    });
    
    // Задание 3: Б или П?
    var bpWords = words.filter(function(w) { return w.letter === "б" || w.letter === "п"; });
    var selected3 = pickRandom(bpWords, 4);
    tasks.push({
        level: "⭐⭐⭐",
        level_name: "Б или П?",
        instruction: "Выбери правильную букву.",
        content: "",
        elements: selected3.map(function(w) { return w.word.slice(0, -1) + "_ (-б/-п)"; }),
        answers: selected3.map(function(w) { return w.word + " (" + w.letter.toUpperCase() + ")"; })
    });
    
    // Задание 4: Разные пары
    var selected4 = pickRandom(words, 6);
    tasks.push({
        level: "⭐⭐⭐⭐",
        level_name: "Разные пары согласных",
        instruction: "Вставь букву, запиши проверочное слово.",
        content: "",
        elements: selected4.map(function(w) { 
            return w.word.slice(0, -1) + "_ → ? (проверка: ?)"; 
        }),
        answers: selected4.map(function(w) { 
            return w.word + " (проверка: " + w.check + ")"; 
        })
    });
    
    // Задание 5: Найди ошибку
    var selected5 = pickRandom(words, 4);
    var elements5 = [];
    var answers5 = [];
    selected5.forEach(function(w) {
        var wrong = w.word.slice(0, -1) + w.pair; // Неправильное написание
        elements5.push("На улице сильный " + wrong + "."); // Пример с ошибкой
        answers5.push(w.word + " (не " + wrong + ")");
    });
    
    tasks.push({
        level: "⭐⭐⭐⭐⭐",
        level_name: "Найди ошибку",
        instruction: "Найди и исправь ошибку в слове.",
        content: "",
        elements: elements5,
        answers: answers5
    });
    
    return {
        title: "🔤 Парные согласные",
        subtitle: "Русский язык, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Парные согласные тебе покорились! 🔤"
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: ЖИ-ШИ, ЧА-ЩА, ЧУ-ЩУ
// ═══════════════════════════════════════════════════════

function generateSpellingRulesWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var rules = WORD_BANKS.spellingRules;
    
    // Задание 1: ЖИ-ШИ
    var zhishi = pickRandom(rules.zhiShi, 6);
    tasks.push({
        level: "⭐",
        level_name: "ЖИ-ШИ пиши с буквой И",
        instruction: "Вставь пропущенную букву.",
        content: "Помни: ЖИ-ШИ пиши с буквой И!",
        elements: zhishi,
        answers: zhishi.map(function(w) { return w.replace("_", "и"); })
    });
    
    // Задание 2: ЧА-ЩА
    var chascha = pickRandom(rules.chaScha, 6);
    tasks.push({
        level: "⭐⭐",
        level_name: "ЧА-ЩА пиши с буквой А",
        instruction: "Вставь пропущенную букву.",
        content: "Помни: ЧА-ЩА пиши с буквой А!",
        elements: chascha,
        answers: chascha.map(function(w) { return w.replace("_", "а"); })
    });
    
    // Задание 3: ЧУ-ЩУ
    var chuschu = pickRandom(rules.chuSchu, 6);
    tasks.push({
        level: "⭐⭐⭐",
        level_name: "ЧУ-ЩУ пиши с буквой У",
        instruction: "Вставь пропущенную букву.",
        content: "Помни: ЧУ-ЩУ пиши с буквой У!",
        elements: chuschu,
        answers: chuschu.map(function(w) { return w.replace("_", "у"); })
    });
    
    // Задание 4: Смешанное
    var mixed = shuffle(
        pickRandom(rules.zhiShi, 2).concat(
            pickRandom(rules.chaScha, 2),
            pickRandom(rules.chuSchu, 2)
        )
    );
    tasks.push({
        level: "⭐⭐⭐⭐",
        level_name: "Все правила вместе",
        instruction: "Вставь пропущенную букву. Вспомни правило!",
        content: "",
        elements: mixed,
        answers: mixed.map(function(w) {
            if (w.indexOf("ж_") !== -1 || w.indexOf("ш_") !== -1) return w.replace("_", "и");
            if (w.indexOf("ч_") !== -1 || w.indexOf("щ_") !== -1) {
                // Определяем по контексту
                if (rules.chaScha.indexOf(w) !== -1) return w.replace("_", "а");
                return w.replace("_", "у");
            }
            return w.replace("_", "и");
        })
    });
    
    // Задание 5: Составь слова
    tasks.push({
        level: "⭐⭐⭐⭐⭐",
        level_name: "Составь слова",
        instruction: "Составь и запиши слова с сочетаниями ЖИ, ШИ, ЧА, ЩА, ЧУ, ЩУ.",
        content: "",
        elements: [
            "Слово с ЖИ:",
            "Слово с ШИ:",
            "Слово с ЧА:",
            "Слово с ЩА:",
            "Слово с ЧУ:",
            "Слово с ЩУ:"
        ],
        answers: [
            "жизнь, жираф, ножи...",
            "шина, машина, мыши...",
            "чашка, часы, туча...",
            "роща, пища, площадь...",
            "чудо, хочу, молчу...",
            "щука, ищу, тащу..."
        ]
    });
    
    return {
        title: "📝 ЖИ-ШИ, ЧА-ЩА, ЧУ-ЩУ",
        subtitle: "Русский язык, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты знаешь все правила! 📝"
    };
}
// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: СЛОЖЕНИЕ
// ═══════════════════════════════════════════════════════

function generateAdditionWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var maxNum = getMaxNumber(grade, topic);
    
    // Задание 1: Простое сложение
    tasks.push(generateAdditionTask(maxNum, "⭐", "Разминка", 0.3));
    
    // Задание 2: Сложение посложнее
    tasks.push(generateAdditionTask(maxNum, "⭐⭐", "Тренировка", 0.5));
    
    // Задание 3: Ещё сложнее
    tasks.push(generateAdditionTask(maxNum, "⭐⭐⭐", "Закрепление", 0.7));
    
    // Задание 4: Найди неизвестное слагаемое
    tasks.push(generateMissingAddendTask(maxNum));
    
    // Задание 5: Сложные примеры или задачи
    tasks.push(generateAdditionTask(maxNum, "⭐⭐⭐⭐⭐", "Мастер", 1.0));
    
    return {
        title: "➕ Сложение",
        subtitle: "Математика, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты отлично складываешь числа! ➕"
    };
}

function getMaxNumber(grade, topic) {
    var topicLower = (topic || "").toLowerCase();
    
    if (topicLower.indexOf("до 5") !== -1) return 5;
    if (topicLower.indexOf("до 10") !== -1) return 10;
    if (topicLower.indexOf("до 20") !== -1) return 20;
    if (topicLower.indexOf("до 100") !== -1) return 100;
    
    if (grade === "preschool") return 5;
    if (grade === "1") return 10;
    if (grade === "2") return 20;
    if (grade === "3") return 100;
    if (grade === "4") return 1000;
    
    return 10;
}

function generateAdditionTask(maxNum, level, levelName, difficultyFactor) {
    var elements = [];
    var answers = [];
    var count = 6;
    
    for (var i = 0; i < count; i++) {
        var limit = Math.floor(maxNum * difficultyFactor) || 1;
        var a, b, sum;
        
        do {
            a = randomInt(1, limit);
            b = randomInt(1, limit);
            sum = a + b;
        } while (sum > maxNum);
        
        elements.push(a + " + " + b + " = __");
        answers.push(String(sum));
    }
    
    return {
        level: level,
        level_name: levelName,
        instruction: "Реши примеры.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateMissingAddendTask(maxNum) {
    var elements = [];
    var answers = [];
    var count = 5;
    
    for (var i = 0; i < count; i++) {
        var sum = randomInt(Math.floor(maxNum * 0.5), maxNum);
        var a = randomInt(1, sum - 1);
        var b = sum - a;
        
        if (randomInt(0, 1) === 0) {
            elements.push("__ + " + b + " = " + sum);
            answers.push(String(a));
        } else {
            elements.push(a + " + __ = " + sum);
            answers.push(String(b));
        }
    }
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Найди неизвестное",
        instruction: "Найди неизвестное слагаемое.",
        content: "",
        elements: elements,
        answers: answers
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: ВЫЧИТАНИЕ
// ═══════════════════════════════════════════════════════

function generateSubtractionWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var maxNum = getMaxNumber(grade, topic);
    
    tasks.push(generateSubtractionTask(maxNum, "⭐", "Разминка", 0.3));
    tasks.push(generateSubtractionTask(maxNum, "⭐⭐", "Тренировка", 0.5));
    tasks.push(generateSubtractionTask(maxNum, "⭐⭐⭐", "Закрепление", 0.7));
    tasks.push(generateMissingSubtrahendTask(maxNum));
    tasks.push(generateSubtractionTask(maxNum, "⭐⭐⭐⭐⭐", "Мастер", 1.0));
    
    return {
        title: "➖ Вычитание",
        subtitle: "Математика, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты отлично вычитаешь! ➖"
    };
}

function generateSubtractionTask(maxNum, level, levelName, difficultyFactor) {
    var elements = [];
    var answers = [];
    var count = 6;
    
    for (var i = 0; i < count; i++) {
        var limit = Math.floor(maxNum * difficultyFactor) || 2;
        var a = randomInt(2, limit);
        var b = randomInt(1, a - 1);
        var diff = a - b;
        
        elements.push(a + " - " + b + " = __");
        answers.push(String(diff));
    }
    
    return {
        level: level,
        level_name: levelName,
        instruction: "Реши примеры.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateMissingSubtrahendTask(maxNum) {
    var elements = [];
    var answers = [];
    var count = 5;
    
    for (var i = 0; i < count; i++) {
        var a = randomInt(Math.floor(maxNum * 0.5), maxNum);
        var b = randomInt(1, a - 1);
        var diff = a - b;
        
        var type = randomInt(0, 2);
        if (type === 0) {
            elements.push("__ - " + b + " = " + diff);
            answers.push(String(a));
        } else if (type === 1) {
            elements.push(a + " - __ = " + diff);
            answers.push(String(b));
        } else {
            elements.push(a + " - " + b + " = __");
            answers.push(String(diff));
        }
    }
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Найди неизвестное",
        instruction: "Найди неизвестное число.",
        content: "",
        elements: elements,
        answers: answers
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: УМНОЖЕНИЕ
// ═══════════════════════════════════════════════════════

function generateMultiplicationWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var topicLower = (topic || "").toLowerCase();
    
    // Определяем на какие числа умножаем
    var multipliers = [2, 3, 4, 5, 6, 7, 8, 9];
    
    if (topicLower.indexOf("на 2") !== -1) multipliers = [2];
    else if (topicLower.indexOf("на 3") !== -1) multipliers = [3];
    else if (topicLower.indexOf("на 2-3") !== -1 || topicLower.indexOf("на 2 и 3") !== -1) multipliers = [2, 3];
    else if (topicLower.indexOf("на 4") !== -1) multipliers = [4];
    else if (topicLower.indexOf("на 5") !== -1) multipliers = [5];
    
    tasks.push(generateMultiplicationTask(multipliers.slice(0, 2), "⭐", "Разминка"));
    tasks.push(generateMultiplicationTask(multipliers.slice(0, 3), "⭐⭐", "Тренировка"));
    tasks.push(generateMultiplicationTask(multipliers.slice(0, 5), "⭐⭐⭐", "Закрепление"));
    tasks.push(generateMissingFactorTask(multipliers));
    tasks.push(generateMultiplicationTask(multipliers, "⭐⭐⭐⭐⭐", "Мастер"));
    
    return {
        title: "✖️ Таблица умножения",
        subtitle: "Математика, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Таблица умножения покорена! ✖️"
    };
}

function generateMultiplicationTask(multipliers, level, levelName) {
    var elements = [];
    var answers = [];
    var count = 6;
    var used = {};
    
    for (var i = 0; i < count; i++) {
        var a, b, product;
        var attempts = 0;
        
        do {
            a = multipliers[randomInt(0, multipliers.length - 1)];
            b = randomInt(2, 9);
            product = a * b;
            attempts++;
        } while (used[a + "x" + b] && attempts < 20);
        
        used[a + "x" + b] = true;
        
        // Иногда меняем порядок множителей
        if (randomInt(0, 1) === 0) {
            elements.push(a + " × " + b + " = __");
        } else {
            elements.push(b + " × " + a + " = __");
        }
        answers.push(String(product));
    }
    
    return {
        level: level,
        level_name: levelName,
        instruction: "Реши примеры.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateMissingFactorTask(multipliers) {
    var elements = [];
    var answers = [];
    var count = 5;
    
    for (var i = 0; i < count; i++) {
        var a = multipliers[randomInt(0, multipliers.length - 1)];
        var b = randomInt(2, 9);
        var product = a * b;
        
        if (randomInt(0, 1) === 0) {
            elements.push("__ × " + b + " = " + product);
            answers.push(String(a));
        } else {
            elements.push(a + " × __ = " + product);
            answers.push(String(b));
        }
    }
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Найди множитель",
        instruction: "Найди неизвестный множитель.",
        content: "",
        elements: elements,
        answers: answers
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: ДЕЛЕНИЕ
// ═══════════════════════════════════════════════════════

function generateDivisionWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    
    tasks.push(generateDivisionTask([2, 3], "⭐", "Разминка"));
    tasks.push(generateDivisionTask([2, 3, 4, 5], "⭐⭐", "Тренировка"));
    tasks.push(generateDivisionTask([2, 3, 4, 5, 6], "⭐⭐⭐", "Закрепление"));
    tasks.push(generateMissingDivisorTask([2, 3, 4, 5, 6, 7, 8, 9]));
    tasks.push(generateDivisionTask([6, 7, 8, 9], "⭐⭐⭐⭐⭐", "Мастер"));
    
    return {
        title: "➗ Деление",
        subtitle: "Математика, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Деление тебе по плечу! ➗"
    };
}

function generateDivisionTask(divisors, level, levelName) {
    var elements = [];
    var answers = [];
    var count = 6;
    var used = {};
    
    for (var i = 0; i < count; i++) {
        var divisor, quotient, dividend;
        var attempts = 0;
        
        do {
            divisor = divisors[randomInt(0, divisors.length - 1)];
            quotient = randomInt(2, 9);
            dividend = divisor * quotient;
            attempts++;
        } while (used[dividend + "/" + divisor] && attempts < 20);
        
        used[dividend + "/" + divisor] = true;
        
        elements.push(dividend + " : " + divisor + " = __");
        answers.push(String(quotient));
    }
    
    return {
        level: level,
        level_name: levelName,
        instruction: "Реши примеры.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateMissingDivisorTask(divisors) {
    var elements = [];
    var answers = [];
    var count = 5;
    
    for (var i = 0; i < count; i++) {
        var divisor = divisors[randomInt(0, divisors.length - 1)];
        var quotient = randomInt(2, 9);
        var dividend = divisor * quotient;
        
        var type = randomInt(0, 1);
        if (type === 0) {
            elements.push(dividend + " : __ = " + quotient);
            answers.push(String(divisor));
        } else {
            elements.push("__ : " + divisor + " = " + quotient);
            answers.push(String(dividend));
        }
    }
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Найди неизвестное",
        instruction: "Найди неизвестное число.",
        content: "",
        elements: elements,
        answers: answers
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: СЧЁТ (для дошкольников и 1 класса)
// ═══════════════════════════════════════════════════════

function generateCountingWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var topicLower = (topic || "").toLowerCase();
    var maxNum = 10;
    
    if (topicLower.indexOf("до 5") !== -1) maxNum = 5;
    if (topicLower.indexOf("до 10") !== -1) maxNum = 10;
    if (topicLower.indexOf("до 20") !== -1) maxNum = 20;
    
    // Задание 1: Посчитай предметы
    tasks.push({
        level: "⭐",
        level_name: "Посчитай",
        instruction: "Посчитай предметы и напиши число.",
        content: "",
        elements: generateCountingElements(maxNum, 6),
        answers: generateCountingAnswers(maxNum, 6)
    });
    
    // Задание 2: Соседи числа
    tasks.push(generateNeighborsTask(maxNum));
    
    // Задание 3: Сравни числа
    tasks.push(generateCompareTask(maxNum));
    
    // Задание 4: Расставь по порядку
    tasks.push(generateOrderTask(maxNum));
    
    // Задание 5: Простое сложение
    tasks.push(generateAdditionTask(maxNum, "⭐⭐⭐⭐⭐", "Сложение", 0.5));
    
    return {
        title: "🔢 Счёт до " + maxNum,
        subtitle: grade === "preschool" ? "Подготовка к школе" : "Математика, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты умеешь считать! 🔢"
    };
}

function generateCountingElements(maxNum, count) {
    var emojis = ["🍎", "⭐", "🌸", "🐟", "🦋", "🍀", "🔵", "❤️", "🌟", "🐱"];
    var elements = [];
    
    for (var i = 0; i < count; i++) {
        var num = randomInt(1, Math.min(maxNum, 10));
        var emoji = emojis[randomInt(0, emojis.length - 1)];
        var str = "";
        for (var j = 0; j < num; j++) str += emoji + " ";
        elements.push(str + "= __");
    }
    
    return elements;
}

function generateCountingAnswers(maxNum, count) {
    // Нужно сгенерировать те же числа что и в elements
    // Для простоты вернём подсказку
    var answers = [];
    for (var i = 0; i < count; i++) {
        answers.push("(посчитай предметы)");
    }
    return answers;
}

function generateNeighborsTask(maxNum) {
    var elements = [];
    var answers = [];
    var count = 5;
    
    for (var i = 0; i < count; i++) {
        var num = randomInt(2, maxNum - 1);
        elements.push("__ , " + num + " , __");
        answers.push((num - 1) + " , " + num + " , " + (num + 1));
    }
    
    return {
        level: "⭐⭐",
        level_name: "Соседи числа",
        instruction: "Напиши соседей числа.",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateCompareTask(maxNum) {
    var elements = [];
    var answers = [];
    var count = 6;
    
    for (var i = 0; i < count; i++) {
        var a = randomInt(1, maxNum);
        var b = randomInt(1, maxNum);
        
        // Избегаем повторов
        while (b === a) {
            b = randomInt(1, maxNum);
        }
        
        elements.push(a + " ○ " + b);
        
        if (a > b) answers.push(a + " > " + b);
        else if (a < b) answers.push(a + " < " + b);
        else answers.push(a + " = " + b);
    }
    
    return {
        level: "⭐⭐⭐",
        level_name: "Сравни числа",
        instruction: "Поставь знак: > , < или =",
        content: "",
        elements: elements,
        answers: answers
    };
}

function generateOrderTask(maxNum) {
    var nums = [];
    var count = Math.min(5, maxNum);
    
    while (nums.length < count) {
        var n = randomInt(1, maxNum);
        if (nums.indexOf(n) === -1) nums.push(n);
    }
    
    var shuffled = shuffle(nums.slice());
    var sorted = nums.slice().sort(function(a, b) { return a - b; });
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Расставь по порядку",
        instruction: "Расставь числа от меньшего к большему.",
        content: "",
        elements: [shuffled.join(", ")],
        answers: [sorted.join(", ")]
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: СОСТАВ ЧИСЛА
// ═══════════════════════════════════════════════════════

function generateNumberCompositionWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var topicLower = (topic || "").toLowerCase();
    var targetNum = 10;
    
    if (topicLower.indexOf("5") !== -1) targetNum = 5;
    if (topicLower.indexOf("10") !== -1) targetNum = 10;
    if (topicLower.indexOf("20") !== -1) targetNum = 20;
    
    // Задание 1: Дополни до числа
    tasks.push(generateCompositionTask1(targetNum));
    
    // Задание 2: Разбей число
    tasks.push(generateCompositionTask2(targetNum));
    
    // Задание 3: Домики
    tasks.push(generateHouseTask(targetNum));
    
    // Задание 4: Найди пару
    tasks.push(generatePairTask(targetNum));
    
    // Задание 5: Все способы
    tasks.push(generateAllWaysTask(targetNum));
    
    return {
        title: "🏠 Состав числа " + targetNum,
        subtitle: "Математика, " + grade + " класс",
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты знаешь состав числа! 🏠"
    };
}

function generateCompositionTask1(targetNum) {
    var elements = [];
    var answers = [];
    
    for (var i = 1; i < targetNum; i++) {
        elements.push(i + " + __ = " + targetNum);
        answers.push(String(targetNum - i));
    }
    
    // Берём случайные 6
    var indices = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8].slice(0, elements.length)).slice(0, 6);
    
    return {
        level: "⭐",
        level_name: "Дополни до " + targetNum,
        instruction: "Какое число нужно добавить?",
        content: "",
        elements: indices.map(function(i) { return elements[i]; }),
        answers: indices.map(function(i) { return answers[i]; })
    };
}

function generateCompositionTask2(targetNum) {
    var elements = [];
    var answers = [];
    
    for (var i = 1; i < targetNum; i++) {
        elements.push(targetNum + " = " + i + " + __");
        answers.push(String(targetNum - i));
    }
    
    var indices = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8].slice(0, elements.length)).slice(0, 6);
    
    return {
        level: "⭐⭐",
        level_name: "Разбей число",
        instruction: "Разбей " + targetNum + " на два слагаемых.",
        content: "",
        elements: indices.map(function(i) { return elements[i]; }),
        answers: indices.map(function(i) { return answers[i]; })
    };
}

function generateHouseTask(targetNum) {
    var pairs = [];
    for (var i = 0; i <= targetNum; i++) {
        pairs.push([i, targetNum - i]);
    }
    
    var selected = pickRandom(pairs.slice(1, -1), 5);
    var elements = [];
    var answers = [];
    
    selected.forEach(function(pair) {
        if (randomInt(0, 1) === 0) {
            elements.push("[ __ | " + pair[1] + " ]");
            answers.push(String(pair[0]));
        } else {
            elements.push("[ " + pair[0] + " | __ ]");
            answers.push(String(pair[1]));
        }
    });
    
    return {
        level: "⭐⭐⭐",
        level_name: "Домики",
        instruction: "Заполни домик числа " + targetNum + ".",
        content: "🏠 Крыша: " + targetNum,
        elements: elements,
        answers: answers
    };
}

function generatePairTask(targetNum) {
    var nums = [];
    for (var i = 1; i < targetNum; i++) nums.push(i);
    var shuffled = shuffle(nums).slice(0, 6);
    
    return {
        level: "⭐⭐⭐⭐",
        level_name: "Найди пару",
        instruction: "Найди число, которое в сумме с данным даёт " + targetNum + ".",
        content: "",
        elements: shuffled.map(function(n) { return n + " + __ = " + targetNum; }),
        answers: shuffled.map(function(n) { return String(targetNum - n); })
    };
}

function generateAllWaysTask(targetNum) {
    var ways = [];
    for (var i = 1; i < targetNum; i++) {
        ways.push(i + " + " + (targetNum - i));
    }
    
    return {
        level: "⭐⭐⭐⭐⭐",
        level_name: "Все способы",
        instruction: "Запиши все способы получить " + targetNum + " из двух слагаемых.",
        content: "",
        elements: [targetNum + " = __ + __", targetNum + " = __ + __", targetNum + " = __ + __", "и так далее..."],
        answers: ways
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: НАЙДИ ЛИШНЕЕ
// ═══════════════════════════════════════════════════════

function generateOddOneOutWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var items = WORD_BANKS.oddOneOut;
    
    // Выбираем случайные наборы
    var selected = pickRandom(items, 5);
    
    selected.forEach(function(item, i) {
        var levels = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
        var names = ["Разминка", "Подумай", "Сложнее", "Ещё сложнее", "Мастер"];
        
        var shuffledItems = shuffle(item.items);
        
        tasks.push({
            level: levels[i],
            level_name: names[i],
            instruction: "Найди лишнее слово и объясни почему.",
            content: "",
            elements: [shuffledItems.join(", ")],
            answers: [item.odd + " — " + item.reason]
        });
    });
    
    return {
        title: "🔍 Найди лишнее",
        subtitle: "Логика, " + (grade === "preschool" ? "подготовка к школе" : grade + " класс"),
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты настоящий детектив! 🔍"
    };
}

// ═══════════════════════════════════════════════════════
// ГЕНЕРАТОР: ПРОДОЛЖИ РЯД
// ═══════════════════════════════════════════════════════

function generateSequenceWorksheet(grade, topic, taskTypes, difficulty, tasksCount) {
    var tasks = [];
    var sequences = WORD_BANKS.sequences;
    
    // Простые числовые (+1, +2)
    var simple = sequences.filter(function(s) { 
        return s.rule === "+2" || s.rule === "+2 (нечётные)" || s.rule === "+5"; 
    });
    
    // Средние
    var medium = sequences.filter(function(s) { 
        return s.rule === "+3" || s.rule === "+10" || s.rule === "-10" || s.rule === "-2"; 
    });
    
    // Сложные
    var hard = sequences.filter(function(s) { 
        return s.rule === "×2" || s.rule === "квадраты чисел" || s.rule === "Фибоначчи"; 
    });
    
    // Буквенные
    var letters = sequences.filter(function(s) { 
        return s.rule.indexOf("алфавит") !== -1 || s.rule.indexOf("дни") !== -1 || s.rule.indexOf("месяцы") !== -1; 
    });
    
    // Задание 1
    if (simple.length > 0) {
        var s1 = pickRandom(simple, 1)[0];
        tasks.push(createSequenceTask(s1, "⭐", "Разминка"));
    }
    
    // Задание 2
    if (medium.length > 0) {
        var s2 = pickRandom(medium, 1)[0];
        tasks.push(createSequenceTask(s2, "⭐⭐", "Тренировка"));
    }
    
    // Задание 3
    if (letters.length > 0) {
        var s3 = pickRandom(letters, 1)[0];
        tasks.push(createSequenceTask(s3, "⭐⭐⭐", "Буквы и слова"));
    }
    
    // Задание 4
    if (hard.length > 0) {
        var s4 = pickRandom(hard, 1)[0];
        tasks.push(createSequenceTask(s4, "⭐⭐⭐⭐", "Сложная закономерность"));
    }
    
    // Задание 5: Создай свой ряд
    tasks.push({
        level: "⭐⭐⭐⭐⭐",
        level_name: "Создай свой ряд",
        instruction: "Придумай свой числовой ряд с закономерностью.",
        content: "",
        elements: [
            "Мой ряд: __, __, __, __, __",
            "Закономерность: __"
        ],
        answers: ["(проверит учитель)", "(проверит учитель)"]
    });
    
    return {
        title: "🔢 Продолжи ряд",
        subtitle: "Логика, " + (grade === "preschool" ? "подготовка к школе" : grade + " класс"),
        tasks: tasks.slice(0, tasksCount || 5),
        motivation: "Ты разгадал все закономерности! 🔢"
    };
}

function createSequenceTask(seqData, level, levelName) {
    var seqStr = seqData.seq.join(", ") + ", __";
    
    return {
        level: level,
        level_name: levelName,
        instruction: "Продолжи ряд. Найди закономерность.",
        content: "",
        elements: [seqStr],
        answers: [seqData.next + " (правило: " + seqData.rule + ")"]
    };
}

// ═══════════════════════════════════════════════════════
// ЭКСПОРТ ГЛАВНОЙ ФУНКЦИИ
// ═══════════════════════════════════════════════════════

// Функция доступна глобально
window.generateWorksheet = generateWorksheet;