import {
  getDomElement as get,
  getAllDomElements as getAll,
} from "./funcUtil.js";

const play = get(".play__heading span");
const create = get(".create__heading span");
const playContainer = get(".container__play");
const createContainer = get(".container__create");

play.addEventListener("click", () => {
  playContainer.style.transform = "translateY(-200%)";
});

create.addEventListener("click", () => {
  createContainer.style.transform = "translateY(-100%)";
});

const answerInputs = getAll(".answer__input");
let maxChars = 75;

const changeAnswerInputBg = function (inputEl, color, display) {
  inputEl.parentElement.style.background = color;
  inputEl.nextElementSibling.style.display = display;
};

answerInputs.forEach((answerInput) => {
  answerInput.addEventListener("input", (e) => {
    const inputEl = e.target;
    const bgColor = inputEl.parentElement.dataset.color;
    let charsTyped = inputEl.value.length;

    changeAnswerInputBg(inputEl, bgColor, "block");

    if (charsTyped <= maxChars)
      inputEl.nextElementSibling.nextElementSibling.textContent =
        maxChars - charsTyped;
    else inputEl.value = inputEl.value.substring(0, maxChars);

    if (!inputEl.value) {
      changeAnswerInputBg(inputEl, "#fff", "none");
    }
  });
});

//////////////////////////////////////

const nextBtns = getAll(".btn--next");
const quizNameInput = get(".quiz__name-input");
const quizNameBtn = get(".quiz__name-btn");

// const allQuestionsContainer = document.querySelector(".questions__all");
const allQuestionsContainer = get(".questions__all");
const quizesContainer = get(".available__quizes-box");
const finishBtns = getAll(".btn--finish");
const playQuestionTitle = get(".play__title");
const playQuestionTime = get(".play__time");
const playScore = get(".play__score");
const playAnswers = getAll(".play__answer");

class Quiz {
  constructor(qName) {
    this[qName] = [];
  }

  displayQuizName() {
    const questionsHeader = get(".questions__header");

    quizNameInput.style.display = "none";
    quizNameBtn.style.display = "none";

    const quizHeading = document.createElement("h2");
    quizHeading.setAttribute("class", "questions__name");
    quizHeading.textContent = quizNameInput.value;
    questionsHeader.appendChild(quizHeading);
  }
}

class Question {
  constructor(
    questionTitle,
    answer1,
    answer2,
    answer3,
    answer4,
    correctAnswer,
    questionType = "quiz",
    questionTime = "20",
    questionPoints = "standard"
  ) {
    this.questionTitle = questionTitle;
    this.answer1 = answer1;
    this.answer2 = answer2;
    this.answer3 = answer3;
    this.answer4 = answer4;
    this.correctAnswer = correctAnswer;
    this.questionType = questionType;
    this.questionTime = questionTime;
    this.questionPoints = questionPoints;
    this.questionId = Math.ceil(Math.random() * 100);
  }
}

class App {
  constructor() {
    this.currentQuizName = "";
    this.score = 0;
    this.currentQuestion = 0;

    this.quizes = [
      {
        tech: [
          {
            questionTitle: "What is java?",
            answer1: "A language",
            answer2: "A compiler",
            answer3: "An interpreter",
            answer4: "A software",
            correctAnswer: "answer1",
            questionType: "quiz",
            questionTime: 10,
            questionPoints: "standard",
            questionId: 28,
          },
          {
            questionTitle: "What is c++?",
            answer1: "A software",
            answer2: "A movie",
            answer3: "A software",
            answer4: "A place",
            correctAnswer: "answer3",
            questionTime: 5,
            questionType: "trueorfalse",
            questionPoints: "double",
            questionId: 18,
          },
        ],
      },
      {
        food: [
          {
            questionTitle: "What is java?",
            answer1: "A language",
            answer2: "A compiler",
            answer3: "An interpreter",
            answer4: "A software",
            correctAnswer: "answer1",
            questionType: "quiz",
            questionPoints: "standard",
            questionId: 28,
          },
        ],
      },
    ];

    // this.populateQuestions();
    // this.disbaleInputs();
    this.fetchQuestion();

    quizNameBtn.addEventListener("click", () => {
      if (!quizNameInput.value) return;

      const quiz = new Quiz(quizNameInput.value);

      quiz.displayQuizName();

      this.currentQuizName = quizNameInput.value;

      this.quizes.push(quiz);

      this.enableInputs();
    });

    nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!this.formValidate()) {
          alert("Please Fill out the form");
          return;
        }
        this.addNewQuestion();

        this.renderQuestions();

        this.reset();
      });
    });

    allQuestionsContainer.addEventListener("click", (e) => {
      this.deleteQuestion(e);
      this.selectQuestion(e);
    });

    playAnswers.forEach((answer) => {
      answer.addEventListener("click", (e) => {
        this.checkAnswer(e);
      });
    });

    finishBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        quizesContainer.textContent = "";

        this.quizes.forEach((quiz) => {
          const quizObject = Object.entries(quiz);

          for (let [quizName, questions] of quizObject) {
            this.displayQuiz(quizName, questions);
          }
        });
      });
    });
  }

  populateQuestions() {
    let html = `
    <div class="play__slide">
        <div class="play__header">
          <h2 class="play__title">What is java?</h2>

          <div class="play__info">
            <div class="play__timer-box">
              <span class="play__time">20</span>
            </div>
            <h4>score: <span class="play__score">500 </span></h4>
          </div>
        </div>

        <div class="play__answers">
          <div class="play__answer play__answer--1">
            <div class="play__shape play__shape--1"></div>
            <p class="play__selected">Answer</p>
          </div>

          <div class="play__answer play__answer--2">
            <div class="play__shape play__shape--2"></div>
            <p class="play__selected">Answer</p>
          </div>

          <div class="play__answer play__answer--3">
            <div class="play__shape play__shape--3"></div>
            <p class="play__selected">Answer</p>
          </div>

          <div class="play__answer play__answer--4">
            <div class="play__shape play__shape--4"></div>
            <p class="play__selected">Answer</p>
          </div>
        </div>
      </div>
    `;
    containerPlay.insertAdjacentHTML("beforeend", html);
  }

  fetchQuestion() {
    let questionsData = this.quizes[0].tech;

    playQuestionTime.textContent =
      questionsData[this.currentQuestion].questionTime;
    playScore.textContent = this.score;
    playQuestionTitle.textContent =
      questionsData[this.currentQuestion].questionTitle;
    playAnswers.forEach((answer, index) => {
      if (index == 0)
        answer.textContent = questionsData[this.currentQuestion].answer1;
      if (index == 1)
        answer.textContent = questionsData[this.currentQuestion].answer2;
      if (index == 2)
        answer.textContent = questionsData[this.currentQuestion].answer3;
      if (index == 3)
        answer.textContent = questionsData[this.currentQuestion].answer4;
    });
  }

  checkAnswer(e) {
    let questionsData = this.quizes[0].tech;
    const selectedAnswer = e.target.dataset.selected;

    if (selectedAnswer === questionsData[this.currentQuestion].correctAnswer) {
      this.score += 100;
      this.currentQuestion++;
      this.fetchQuestion();
    }
  }

  displayQuiz(quizName, questions) {
    let html = `
    <div class="available__quiz-box">
          <div class="available__heading">
            <span class="available__number">1</span>
            <p>${quizName}</p>
          </div>
          <div class="available__info">
            <div class="available__questions-box">
              <span class="available__questions">${questions.length}</span>
            </div>
            <p class="available__text">questions</p>
            <i class="fa-solid fa-trash-can available__delete"></i>
          </div>
        </div>`;

    quizesContainer.insertAdjacentHTML("beforeend", html);
  }

  enableInputs() {
    const inputs = getAll("input");
    const selects = getAll("select");
    const container = get(".container__create");
    const questionsForm = get(".questions__form");

    inputs.forEach((input) => (input.disabled = false));
    selects.forEach((select) => (select.disabled = false));
    questionsForm.classList.remove("disabled");
    for (let child of container.children) child.classList.remove("disabled");
  }

  disbaleInputs() {
    const inputs = getAll("input:not([name = 'quiz__name-input'])");
    const selects = getAll("select");
    inputs.forEach((input) => (input.disabled = true));
    selects.forEach((select) => (select.disabled = true));
  }

  formValidate() {
    if (this.inputsValidator() && this.radioInputValidator()) return true;
    else return false;
  }

  inputsValidator() {
    const inputs = [
      ...getAll("input[type = 'text']:not([name = 'quiz__name-input'])"),
    ];

    return inputs.every((input) => input.value);
  }

  radioInputValidator() {
    try {
      const radio = get('input[type="radio"]:checked');
      return radio.checked;
    } catch {
      return false;
    }
  }

  addNewQuestion() {
    const inputs = getAll(
      "input[type = 'text']:not([name = 'quiz__name-input'])"
    );

    const selects = getAll("select");

    const selectedRadio = get('input[type="radio"]:checked');

    let questionTitle,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
      questionType,
      questionTime,
      questionPoints;

    correctAnswer = selectedRadio.value;

    inputs.forEach((input, index) => {
      if (index === 0) questionTitle = input.value;
      if (index === 1) answer1 = input.value;
      if (index === 2) answer2 = input.value;
      if (index === 3) answer3 = input.value;
      if (index === 4) answer4 = input.value;
    });

    selects.forEach((select, index) => {
      if (index === 0) questionType = select.value;
      if (index === 1) questionTime = select.value;
      if (index === 2) questionPoints = select.value;
    });

    let question = new Question(
      questionTitle,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
      questionType,
      questionTime,
      questionPoints
    );

    this.currentQuizArr().push(question);

    // return question;

    console.log(this.quizes);
  }

  currentQuizArr() {
    const currentQuizIndex = this.quizes.findIndex((quiz) => {
      for (let obj in quiz) return obj === this.currentQuizName;
    });

    return this.quizes[currentQuizIndex][this.currentQuizName];
  }

  renderQuestions() {
    allQuestionsContainer.textContent = "";

    this.currentQuizArr().forEach((question, index) => {
      this.displayQuestion(question, index);
    });
  }

  displayQuestion({ questionTitle, questionTime, questionId }, index) {
    let html = `
    <div class="questions__box">
          <div class="questions__heading">
            <span class="questions__number">${index + 1}</span>
            <p>Quiz</p>
          </div>
          <div class="question__info">
            <p class="question">${
              questionTitle.length > 13
                ? questionTitle.substring(0, 10) + "..."
                : questionTitle
            }</p>
            <div class="question__timer-box">
              <span class="question__timer">${questionTime}</span>
            </div>
            <i class="fa-solid fa-trash-can question__delete" data-id="${questionId}"></i>
          </div>
        </div>`;
    allQuestionsContainer.insertAdjacentHTML("beforeend", html);
  }

  deleteQuestion(e) {
    if (e.target.classList.contains("question__delete")) {
      const deleteQuestionId = +e.target.dataset.id;

      const deleteQuestionIndex = this.currentQuizArr().findIndex(
        (question) => question.questionId === deleteQuestionId
      );

      this.currentQuizArr().splice(deleteQuestionIndex, 1);

      e.target.parentElement.parentElement.remove();

      this.currentQuizArr().forEach((question) =>
        this.renderQuestions(question)
      );
    }
  }

  selectQuestion(e) {
    if (e.target.closest(".questions__box")) {
      //work later
    }
  }

  reset() {
    const inputs = getAll("input[type = 'text']");
    const selects = getAll("select");
    const selectedRadio = get('input[type="radio"]:checked');

    inputs.forEach((input) => (input.value = ""));

    selectedRadio.checked = false;

    answerInputs.forEach((inputEl) => {
      changeAnswerInputBg(inputEl, "#fff", "none");
    });
  }
}

let app = new App();
