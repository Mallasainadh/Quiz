
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (username !== "" && password !== "") {
            localStorage.setItem("quizUsername", username);
            window.location.href = "quiz.html";
        } else {
            alert("Please enter your username and password.");
        }
    });
}

const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
    forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();

        if (email !== "") {
            alert(
                "Password reset functionality needs an email service or backend."
            );
        }
    });
}

/* QUIZ PAGE */
const questionElement = document.getElementById("question");

if (questionElement) {
    const questions = [
        {
            question: "1. What is the capital of India?",
            options: ["Mumbai", "New Delhi", "Chennai", "Hyderabad"],
            answer: "New Delhi"
        },
        {
            question: "2. Which planet is known as the Red Planet?",
            options: ["Earth", "Venus", "Mars", "Jupiter"],
            answer: "Mars"
        },
        {
            question: "3. How many days are there in a week?",
            options: ["5", "6", "7", "8"],
            answer: "7"
        },
        {
            question: "4. Which language is used to style web pages?",
            options: ["HTML", "CSS", "JavaScript", "Python"],
            answer: "CSS"
        },
        {
            question: "5. Which animal is known as the King of the Jungle?",
            options: ["Tiger", "Elephant", "Lion", "Bear"],
            answer: "Lion"
        }
    ];

    let currentQuestion = 0;
    const selectedAnswers = [];

    const optionsElement = document.getElementById("options");
    const questionNumber = document.getElementById("questionNumber");
    const previousBtn = document.getElementById("previousBtn");
    const nextBtn = document.getElementById("nextBtn");
    const message = document.getElementById("message");

    function showQuestion() {
        const q = questions[currentQuestion];

        questionNumber.textContent =
            `Question ${currentQuestion + 1} of ${questions.length}`;

        questionElement.textContent = q.question;
        optionsElement.innerHTML = "";

        q.options.forEach(function (option) {
            const label = document.createElement("label");
            label.style.display = "block";
            label.style.margin = "12px 0";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "answer";
            radio.value = option;
            radio.style.width = "auto";
            radio.style.marginRight = "10px";

            if (selectedAnswers[currentQuestion] === option) {
                radio.checked = true;
            }

            radio.addEventListener("change", function () {
                selectedAnswers[currentQuestion] = option;
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            optionsElement.appendChild(label);
        });

        previousBtn.disabled = currentQuestion === 0;
        nextBtn.textContent =
            currentQuestion === questions.length - 1
                ? "Finish Quiz"
                : "Next";

        message.textContent = "";
    }

    previousBtn.addEventListener("click", function () {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
        }
    });

    nextBtn.addEventListener("click", function () {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            let score = 0;

            questions.forEach(function (q, index) {
                if (selectedAnswers[index] === q.answer) {
                    score++;
                }
            });

            localStorage.setItem("quizScore", score);
            localStorage.setItem("quizTotal", questions.length);

            window.location.href = "result.html";
        }
    });

    showQuestion();
}

/* RESULTS PAGE */
const scoreElement = document.getElementById("score");

if (scoreElement) {
    const score = Number(localStorage.getItem("quizScore")) || 0;
    const total = Number(localStorage.getItem("quizTotal")) || 5;
    const percentage = Math.round((score / total) * 100);

    scoreElement.textContent = `Your Score: ${score} / ${total}`;

    document.getElementById("percentage").textContent =
        `Percentage: ${percentage}%`;

    document.getElementById("retryBtn").addEventListener("click", function () {
        window.location.href = "quiz.html";
    });

    document.getElementById("leaderboardBtn").addEventListener("click", function () {
        window.location.href = "leaderboard.html";
    });
}

/* LEADERBOARD PAGE */
const leaderboardBody = document.getElementById("leaderboardBody");

if (leaderboardBody) {
    const username = localStorage.getItem("quizUsername") || "Guest";
    const score = Number(localStorage.getItem("quizScore")) || 0;
    const total = Number(localStorage.getItem("quizTotal")) || 5;

    const leaderboard = JSON.parse(
        localStorage.getItem("quizLeaderboard") || "[]"
    );

    leaderboard.push({
        name: username,
        score: score,
        total: total
    });

    leaderboard.sort(function (a, b) {
        return (b.score / b.total) - (a.score / a.total);
    });

    localStorage.setItem("quizLeaderboard", JSON.stringify(leaderboard));

    leaderboardBody.innerHTML = "";

    leaderboard.forEach(function (player, index) {
        const row = document.createElement("tr");

        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;

        const nameCell = document.createElement("td");
        nameCell.textContent = player.name;

        const scoreCell = document.createElement("td");
        scoreCell.textContent = `${player.score}/${player.total}`;

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        leaderboardBody.appendChild(row);
    });

    document.getElementById("playAgainBtn").addEventListener("click", function () {
        window.location.href = "quiz.html";
    });
}
