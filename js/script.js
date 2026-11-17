// Menu responsivo
const menuToggle = document.querySelector("#menu-toggle");
const siteNav = document.querySelector("#site-nav");

menuToggle.addEventListener("click", () => {
    const menuIsOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", menuIsOpen);
    menuToggle.setAttribute("aria-label", menuIsOpen ? "Fechar menu" : "Abrir menu");
});

siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    });
});

// Checklist: calcula o progresso conforme os itens marcados
const checklistItems = document.querySelectorAll("[data-task]");
const progressNumber = document.querySelector("#progress-number");
const progressRing = document.querySelector("#progress-ring");
const progressMessage = document.querySelector("#progress-message");
const resetChecklist = document.querySelector("#reset-checklist");

function updateChecklist() {
    const total = checklistItems.length;
    const completed = document.querySelectorAll("[data-task]:checked").length;
    const percentage = Math.round((completed / total) * 100);

    progressNumber.textContent = `${percentage}%`;
    progressRing.style.background = `conic-gradient(var(--cyan) ${percentage * 3.6}deg, rgba(148,163,184,.16) 0deg)`;
    progressRing.setAttribute("aria-label", `${percentage}% concluído`);

    if (completed === 0) {
        progressMessage.textContent = "Você ainda não marcou nenhum item.";
    } else if (completed === total) {
        progressMessage.textContent = "Parabéns! Você revisou todos os cuidados.";
    } else {
        progressMessage.textContent = `${completed} de ${total} cuidados marcados.`;
    }
}

checklistItems.forEach((item) => item.addEventListener("change", updateChecklist));
resetChecklist.addEventListener("click", () => {
    checklistItems.forEach((item) => { item.checked = false; });
    updateChecklist();
});

// Quiz de cinco perguntas
const questions = [
    {
        question: "Qual atitude é mais segura ao pagar com cartão em uma maquininha?",
        answers: [
            "Entregar o cartão para o atendente.",
            "Conferir o valor e manter o cartão sob seu controle.",
            "Digitar a senha sem conferir o visor."
        ],
        correct: 1,
        explanation: "Isso mesmo! Confira o valor e mantenha o cartão com você durante a operação."
    },
    {
        question: "O visor da maquininha está apagado e a pessoa pede para você digitar a senha. O que fazer?",
        answers: [
            "Digitar a senha rapidamente.",
            "Repetir a operação várias vezes.",
            "Interromper o pagamento e procurar outra forma segura."
        ],
        correct: 2,
        explanation: "Correto. Não conclua pagamentos quando não conseguir conferir as informações."
    },
    {
        question: "Qual é uma atitude importante ao usar um computador compartilhado?",
        answers: [
            "Salvar a senha no navegador para facilitar o próximo acesso.",
            "Usar seu login e encerrar a sessão ao terminar.",
            "Deixar seus documentos abertos para continuar depois."
        ],
        correct: 1,
        explanation: "Exatamente. Use sua própria conta e encerre a sessão ao finalizar."
    },
    {
        question: "Você percebe uma compra que não reconhece no aplicativo do banco. Qual deve ser a atitude?",
        answers: [
            "Ignorar e esperar alguns dias.",
            "Compartilhar a senha com alguém para pedir ajuda.",
            "Contatar o banco pelos canais oficiais e bloquear o cartão se necessário."
        ],
        correct: 2,
        explanation: "Correto! Agir rapidamente e usar canais oficiais ajuda a proteger sua conta."
    },
    {
        question: "Qual comportamento ajuda na segurança física do laboratório?",
        answers: [
            "Manter líquidos longe dos equipamentos e organizar os cabos.",
            "Puxar os cabos para afastar o computador.",
            "Desativar o antivírus quando o computador estiver lento."
        ],
        correct: 0,
        explanation: "Muito bem! Organização, cuidado com líquidos e respeito aos equipamentos evitam acidentes."
    }
];

let currentQuestion = 0;
let score = 0;
let answerSelected = false;

const questionCount = document.querySelector("#question-count");
const quizScoreLabel = document.querySelector("#quiz-score-label");
const quizProgressBar = document.querySelector("#quiz-progress-bar");
const questionText = document.querySelector("#question-text");
const answersContainer = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const nextQuestionButton = document.querySelector("#next-question");
const quizContent = document.querySelector("#quiz-content");
const quizResult = document.querySelector("#quiz-result");
const resultTitle = document.querySelector("#result-title");
const resultDescription = document.querySelector("#result-description");

function renderQuestion() {
    const question = questions[currentQuestion];
    answerSelected = false;

    questionCount.textContent = `PERGUNTA ${currentQuestion + 1} DE ${questions.length}`;
    quizScoreLabel.textContent = `${score} acerto${score === 1 ? "" : "s"}`;
    quizProgressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionText.textContent = question.question;
    feedback.textContent = "";
    nextQuestionButton.disabled = true;
    nextQuestionButton.textContent = currentQuestion === questions.length - 1 ? "Ver resultado →" : "Próxima pergunta →";

    answersContainer.innerHTML = "";
    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer";
        button.textContent = answer;
        button.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    if (answerSelected) return;

    answerSelected = true;
    const question = questions[currentQuestion];
    const answerButtons = answersContainer.querySelectorAll(".answer");
    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) {
        score++;
        feedback.textContent = `✓ ${question.explanation}`;
    } else {
        feedback.textContent = `Não foi dessa vez. ${question.explanation}`;
    }

    answerButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) button.classList.add("correct");
        if (index === selectedIndex && !isCorrect) button.classList.add("wrong");
    });

    quizScoreLabel.textContent = `${score} acerto${score === 1 ? "" : "s"}`;
    nextQuestionButton.disabled = false;
}

function showResult() {
    quizContent.hidden = true;
    quizResult.hidden = false;
    quizScoreLabel.textContent = `${score} de ${questions.length} acertos`;

    if (score === questions.length) {
        resultTitle.textContent = "Excelente! Você está preparado.";
        resultDescription.textContent = "Você acertou todas as perguntas. Continue praticando esses cuidados no dia a dia.";
    } else if (score >= 3) {
        resultTitle.textContent = "Muito bem! Continue aprendendo.";
        resultDescription.textContent = `Você acertou ${score} de ${questions.length}. Revise as dicas e tente novamente para alcançar a pontuação máxima.`;
    } else {
        resultTitle.textContent = "Vamos reforçar os cuidados!";
        resultDescription.textContent = `Você acertou ${score} de ${questions.length}. Leia novamente as orientações e refaça o quiz. Informação ajuda a evitar prejuízos.`;
    }
}

nextQuestionButton.addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        showResult();
    }
});

document.querySelector("#restart-quiz").addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    quizContent.hidden = false;
    quizResult.hidden = true;
    renderQuestion();
});

renderQuestion();
updateChecklist();
