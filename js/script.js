import { get, getAll } from "./funcUtil.js";
import domEl from "./domElements.js";

domEl.playText.addEventListener("click", (e) => {
  App.bringToFront(domEl.availableContainer);
});

domEl.createText.addEventListener("click", () => {
  App.bringToFront(domEl.createContainer);
});

domEl.headerContainer.addEventListener("mousemove", (e) => {
  domEl.cursor.style.display = "block";
  domEl.cursor.style.left = e.pageX + "px";
  domEl.cursor.style.top = e.pageY + "px";
  domEl.cursor.classList.remove("cursor-grow");
  domEl.headerLogo.classList.remove("text-black");

  if (e.target.classList.contains("header__logo")) {
    domEl.cursor.classList.add("cursor-grow");
    domEl.headerLogo.classList.add("text-black");
  }
});

domEl.headerContainer.addEventListener("mouseleave", (e) => {
  domEl.cursor.style.display = "none";
  domEl.headerLogo.classList.remove("text-black");
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

const playQuestionTitles = getAll(".play__title");
const playQuestionTime = get(".play__time");
const playScore = get(".play__score");
const playAnswers = getAll(".play__answer");

/////////////////////////////////////

class Quiz {
  constructor(qName) {
    this[qName] = [];
  }

  displayQuizName() {
    const questionsHeader = get(".questions__header");

    domEl.quizNameInput.style.display = "none";
    domEl.quizNameBtn.style.display = "none";

    const quizHeading = document.createElement("h2");
    quizHeading.setAttribute("class", "questions__name");
    quizHeading.textContent = domEl.quizNameInput.value;
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
    questionPoints = 100
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
    this.questionId = Math.ceil(Math.random() * 500);
  }
}

class App {
  constructor() {
    this.currentQuizName = "";
    this.quizQuestions = [];
    this.score = 0;
    this.currentQuestion = 0;
    this.selectedAnswer;
    this.resetTimer;
    this.correctlyAnswered = 0;

    this.sounds = {
      clockAudio: new Audio("../audio/playing.wav"),
      success: new Audio("../audio/success-1.mp3"),
      failure: new Audio("../audio/failure.mp3"),
      over: new Audio("./audio/over.mp3"),
    };

    this.quizes = [
      {
        tech: [
          {
            questionTitle: "What is java? 1",
            answer1: "A language",
            answer2: "A compiler",
            answer3: "An interpreter",
            answer4: "A software",
            correctAnswer: "answer1",
            questionType: "quiz",
            questionTime: 5,
            questionPoints: 100,
            questionId: 28,
          },
          {
            questionTitle: "What is c++? 2",
            answer1: "A software",
            answer2: "A movie",
            answer3: "A software",
            answer4: "A place",
            correctAnswer: "answer3",
            questionTime: 4,
            questionType: "trueorfalse",
            questionPoints: 200,
            questionId: 18,
          },
          {
            questionTitle: "What is c++? 3",
            answer1: "A software",
            answer2: "A movie",
            answer3: "A software",
            answer4: "A place",
            correctAnswer: "answer3",
            questionTime: 10,
            questionType: "trueorfalse",
            questionPoints: 200,
            questionId: 18,
          },

          {
            questionTitle: "What is phone? 4",
            answer1: "A bubble",
            answer2: "pj10",
            answer3: "crypto",
            answer4: "laptop",
            correctAnswer: "answer3",
            questionTime: 10,
            questionType: "trueorfalse",
            questionPoints: 200,
            questionId: 18,
          },

          {
            questionTitle: "What is c# 5",
            answer1: "A mech",
            answer2: "A tech",
            answer3: "A food",
            answer4: "An animal",
            correctAnswer: "answer2",
            questionTime: 5,
            questionType: "trueorfalse",
            questionPoints: 200,
            questionId: 18,
          },

          {
            questionTitle: "What is compiler? 6",
            answer1: "A phone",
            answer2: "A company",
            answer3: "A person",
            answer4: "A food",
            correctAnswer: "answer4",
            questionTime: 5,
            questionType: "trueorfalse",
            questionPoints: 200,
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
            questionPoints: 100,
            questionId: 28,
          },
        ],
      },
    ];

    // this.populateQuestions();
    this.disbaleInputs();
    // this.fetchQuestion();

    this.getLocalStorage();

    this.renderQuizes();

    // EVENT LISTENERS
    domEl.quizNameBtn.addEventListener("click", () => {
      const userEntered = domEl.quizNameInput.value;

      if (!userEntered) {
        this.displayPopup("Please enter the quiz name");
        return;
      }

      const quiz = new Quiz(userEntered);

      quiz.displayQuizName();

      this.currentQuizName = userEntered;

      this.quizes.push(quiz);

      this.enableInputs();
    });

    domEl.nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!this.formValidate()) {
          this.displayPopup("Please complete the form");
          return;
        }

        this.addNewQuestion();

        this.renderQuestions();

        this.reset();
      });
    });

    domEl.finishBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!this.formValidate()) {
          this.displayPopup("Please complete the form");
          return;
        }
        App.bringToFront(domEl.availableContainer);

        this.addNewQuestion();

        this.renderQuestions();

        this.setLocalStorage();

        this.renderQuizes();

        this.reset();
      });
    });

    domEl.allQuestionsContainer.addEventListener("click", (e) => {
      this.selectQuestion(e);
      this.deleteQuestion(e);
    });

    domEl.quizesContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("available__delete")) {
        this.deleteQuiz(e);
        return;
      }

      App.bringToFront(domEl.playContainer);
      this.selectQuiz(e);

      this.questionPopup();
    });

    domEl.submitQuestion.addEventListener("click", () => {
      clearInterval(this.resetTimer);
      this.changeColors();
      this.checkAnswer();
      this.sounds.clockAudio.pause();
      domEl.submitQuestion.style.display = "none";
      domEl.playBtn.style.display = "block";
    });

    domEl.playBtn.addEventListener("click", () => {
      if (this.currentQuestion >= this.quizQuestions.length - 1) {
        this.winnerPopup();
        domEl.winnerPopup.classList.add("play__winner-show");
        this.sounds.over.play();
        return;
      }
      this.removeColors();
      this.removeSelected();
      this.currentQuestion++;
      this.fetchQuestion();
      // this.questionTimer();

      for (let sound in this.sounds) {
        this.sounds[sound].pause();
      }

      domEl.playBtn.style.display = "none";
      domEl.submitQuestion.style.display = "block";

      this.questionPopup();
    });

    domEl.winnerClose.addEventListener("click", () => {
      domEl.winnerPopup.classList.remove("play__winner-show");
      this.resetValues();
      this.removeColors();
      this.removeSelected();

      domEl.playBtn.style.display = "none";
      domEl.submitQuestion.style.display = "block";

      App.bringToFront(domEl.availableContainer);
    });

    playAnswers.forEach((answer) => {
      answer.addEventListener("click", this.selectAnswer.bind(this));
    });

    domEl.headerLogo.addEventListener("click", () => {
      App.bringToFront(domEl.playOrCreate);

      this.removeColors();
      this.removeSelected();

      this.resetValues();

      domEl.playBtn.style.display = "none";
      domEl.submitQuestion.style.display = "block";

      playScore.textContent = this.score;
    });
  }

  static bringToFront(container) {
    const containers = [
      domEl.playContainer,
      domEl.createContainer,
      domEl.availableContainer,
    ];

    containers.forEach((container) =>
      container.classList.remove("bring-to-front")
    );

    container.classList.add("bring-to-front");
  }

  setLocalStorage() {
    localStorage.setItem("quizes", JSON.stringify(this.quizes));
  }

  getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("quizes"));

    if (!data) return;

    this.quizes = data;
  }

  ///////////////////////////
  selectQuiz(e) {
    let selectedQuizName = e.target.closest(".available__quiz-box").dataset
      .quiz;

    const selectedQuiz = this.quizes.find((quiz) => {
      const quizObject = Object.entries(quiz);

      for (let [quizName, questions] of quizObject) {
        return quizName === selectedQuizName;
      }
    });

    this.quizQuestions = selectedQuiz[selectedQuizName];

    this.fetchQuestion();
    // this.questionTimer();
  }

  deleteQuiz(e) {
    const deleteQuizName = e.target.closest(".available__quiz-box").dataset
      .quiz;

    const remainingQuizes = this.quizes.filter((quiz) => {
      const quizObject = Object.entries(quiz);

      for (let [quizName, questions] of quizObject) {
        return quizName !== deleteQuizName;
      }
    });
    this.quizes = remainingQuizes;
    this.setLocalStorage();
    this.renderQuizes();
  }
  ///////////////////////////
  questionTimer() {
    let timeLeft = this.quizQuestions[this.currentQuestion].questionTime;

    this.sounds.clockAudio.play();

    this.resetTimer = setInterval(() => {
      timeLeft--;
      playQuestionTime.textContent = timeLeft;
      if (timeLeft === 0) {
        clearInterval(this.resetTimer);
        this.sounds.clockAudio.pause();
        this.checkAnswer();
        this.changeColors();

        domEl.submitQuestion.style.display = "none";
        domEl.playBtn.style.display = "block";
      }
    }, 1000);
  }

  fetchQuestion() {
    const points = +this.quizQuestions[this.currentQuestion].questionPoints;

    if (points === 100) playScore.textContent = "Standard";
    if (points === 200) playScore.textContent = "Double";
    if (points === 0) playScore.textContent = "No points";

    playQuestionTime.textContent =
      this.quizQuestions[this.currentQuestion].questionTime;

    playQuestionTitles.forEach(
      (title) =>
        (title.textContent =
          this.quizQuestions[this.currentQuestion].questionTitle)
    );

    playAnswers.forEach((answer, index) => {
      if (index == 0)
        answer.textContent = this.quizQuestions[this.currentQuestion].answer1;
      if (index == 1)
        answer.textContent = this.quizQuestions[this.currentQuestion].answer2;
      if (index == 2)
        answer.textContent = this.quizQuestions[this.currentQuestion].answer3;
      if (index == 3)
        answer.textContent = this.quizQuestions[this.currentQuestion].answer4;
    });
  }

  selectAnswer(e) {
    this.removeSelected();
    e.currentTarget.classList.toggle("selected-answer");
    this.selectedAnswer = e.currentTarget.dataset.selected;
  }

  removeSelected() {
    playAnswers.forEach((answer) => answer.classList.remove("selected-answer"));
  }

  checkAnswer() {
    const points = +this.quizQuestions[this.currentQuestion].questionPoints;
    console.log(points);
    if (
      this.selectedAnswer ===
      this.quizQuestions[this.currentQuestion].correctAnswer
    ) {
      if (points === 100) this.score += 100;
      if (points === 200) this.score += 200;
      if (points === 0) this.score += 0;

      this.sounds.success.load();
      this.sounds.success.play();
      // this.score += 100;
      this.correctlyAnswered++;
      // playScore.textContent = this.score;
    } else {
      this.sounds.failure.load();
      this.sounds.failure.play();
    }
  }

  changeColors() {
    playAnswers.forEach((answer) => {
      answer.classList.add("wrong-answer");
    });

    const correctAnswerEl =
      +this.quizQuestions[this.currentQuestion].correctAnswer.slice(-1);

    playAnswers[correctAnswerEl - 1].classList.add("correct-answer");
  }

  removeColors() {
    playAnswers.forEach((answer) => {
      answer.classList.remove("correct-answer", "wrong-answer");
    });
  }

  renderQuizes() {
    domEl.quizesContainer.textContent = "";

    console.log(this.quizes);

    this.quizes.forEach((quiz, index) => {
      const quizObject = Object.entries(quiz);

      for (let [quizName, questions] of quizObject) {
        this.displayQuiz(quizName, questions, index);
      }
    });
  }

  displayQuiz(quizName, questions, index) {
    let color = Math.ceil(Math.random() * 4);

    let html = `
    <div class="available__quiz-box" data-quiz="${quizName}">
          <div class="available__heading">
            <span class="available__number">${index + 1}</span>
            <p>${quizName}</p>
          </div>
          <div class="available__info available__info--${color}">
            <div class="available__questions-box">
              <span class="available__questions">${questions.length}</span>
            </div>
            <p class="available__text">questions</p>
            <i class="fa-solid fa-trash-can available__delete"></i>
          </div>
        </div>`;

    domEl.quizesContainer.insertAdjacentHTML("beforeend", html);
  }

  enableInputs() {
    domEl.inputs.forEach((input) => (input.disabled = false));

    domEl.selects.forEach((select) => (select.disabled = false));

    domEl.questionsForm.classList.remove("disabled");

    for (let child of domEl.container.children)
      child.classList.remove("disabled");
  }

  disbaleInputs() {
    const inputs = getAll("input:not([name = 'quiz__name-input'])");

    inputs.forEach((input) => (input.disabled = true));

    domEl.selects.forEach((select) => (select.disabled = true));
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

    domEl.selects.forEach((select, index) => {
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

    // console.log(this.quizes);
  }

  currentQuizArr() {
    const currentQuizIndex = this.quizes.findIndex((quiz) => {
      for (let obj in quiz) return obj === this.currentQuizName;
    });

    return this.quizes[currentQuizIndex][this.currentQuizName];
  }

  renderQuestions() {
    domEl.allQuestionsContainer.textContent = "";

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
    domEl.allQuestionsContainer.insertAdjacentHTML("beforeend", html);
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
    const selectedRadio = get('input[type="radio"]:checked');

    inputs.forEach((input) => (input.value = ""));

    selectedRadio.checked = false;

    answerInputs.forEach((inputEl) => {
      changeAnswerInputBg(inputEl, "#fff", "none");
    });

    // domEl.selects.forEach((select) => {
    //   select.value = select.selected;
    // });
  }

  resetValues() {
    this.currentQuizName = "";
    this.quizQuestions = [];
    this.score = 0;
    this.currentQuestion = 0;
    this.selectedAnswer;
    this.resetTimer;
    this.correctlyAnswered = 0;
  }

  displayPopup(message) {
    const popupBox = document.createElement("p");
    popupBox.textContent = message;
    popupBox.setAttribute("class", "notification-popup");
    domEl.questionsForm.append(popupBox);
  }

  questionPopup() {
    this.fetchQuestion();

    domEl.playPopup.classList.add("play__popup-show");
    domEl.playBar.classList.add("play__bar-grow");

    setTimeout(() => {
      domEl.playPopup.classList.remove("play__popup-show");
      this.questionTimer();
    }, 3000);
  }

  winnerPopup() {
    domEl.winnerTotal.textContent = this.quizQuestions.length;
    domEl.winnerScore.textContent = this.score;
    domEl.winnerCorrect.textContent = this.correctlyAnswered;
    domEl.winnerPercentage.innerText = Math.trunc(
      (this.correctlyAnswered / this.quizQuestions.length) * 100
    );
  }
}

let app = new App();
