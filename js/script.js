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
  }
}

class App {
  constructor() {
    this.currentQuizName = "";

    this.quizes = [
      {
        tech: [
          { question: "What is java?" },
          { answer1: "A language" },
          { answer2: "A compiler" },
          { answer3: "An interpreter" },
          { answer4: "A software" },
        ],
      },
      {
        food: [
          { question: "What is java?" },
          { answer1: "A language" },
          { answer2: "A compiler" },
          { answer3: "An interpreter" },
          { answer4: "A software" },
        ],
      },
    ];

    // this.disbaleInputs();

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

        this.reset();
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
    const radioInputs = [...getAll("input[type='radio']")];
    return radioInputs.some((input) => input.checked);
  }

  addNewQuestion() {
    const inputs = getAll(
      "input[type = 'text']:not([name = 'quiz__name-input'])"
    );

    const selects = getAll("select");

    const radioInputs = [...getAll("input[type='radio']")];

    let questionTitle,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
      questionType,
      questionTime,
      questionPoints;

    correctAnswer = radioInputs.filter((radioInput) => radioInput.checked)[0]
      .value;

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

    this.displayQuestion(question);
    console.log(this.quizes);

    const currentQuizIndex = this.quizes.findIndex((quiz) => {
      for (let obj in quiz) return obj === this.currentQuizName;
    });

    this.quizes[currentQuizIndex][this.currentQuizName].push(question);

    return question;
  }

  displayQuestion({ questionTitle, questionTime }) {
    let html = `
    <div class="questions__box">
          <div class="questions__heading">
            <span class="questions__number">1</span>
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
            <i class="fa-solid fa-trash-can question__delete"></i>
          </div>
        </div>`;

    allQuestionsContainer.insertAdjacentHTML("beforeend", html);
  }

  reset() {
    const inputs = getAll("input[type = 'text']");
    const selects = getAll("select");
    // const selectedRadio = get('input[type="radio"]:checked');
    inputs.forEach((input) => (input.value = ""));
    // selectedRadio.checked = false;
    answerInputs.forEach((inputEl) => {
      changeAnswerInputBg(inputEl, "#fff", "none");
    });
  }
}

let app = new App();

// addQuestion() {
//   quiz1.tech.push(new Question(this.question));
//   console.log("kk");
// }

// class QuizTry {
//   constructor(qName) {
//     this[qName] = [];
//   }
// }

// class QuestionTry {
//   constructor(q, a1, a2, a3, a4) {
//     this.q = q;
//     this.a1 = a1;
//     this.a2 = a2;
//     this.a3 = a3;
//     this.a4 = a4;
//   }
// }

// let quiz1 = new QuizTry("tech");
// let quiz2 = new QuizTry("food");

// quiz1.tech.push(new Question("bWhat is my Name?", "bala", "20", "jal", "dev"));
// quiz1.tech.push(new Question("jeeto"));

// console.log(quiz1);
// console.log(quiz2);
