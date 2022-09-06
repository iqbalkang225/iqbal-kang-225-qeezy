import { get, getAll } from "./funcUtil.js";
import domEl from "./domElements.js";

//////////////////////////////////////

/////////////////////////////////////

class Quiz {
  constructor(qName) {
    this[qName] = [];
  }

  displayQuizName() {
    //later
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
    this.questionPoints = +questionPoints;
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
    this.playAnswerEls = [];

    this.sounds = {
      clockAudio: new Audio("../audio/playing.wav"),
      success: new Audio("../audio/success-1.mp3"),
      failure: new Audio("../audio/failure.mp3"),
      over: new Audio("./audio/over.mp3"),
    };

    // this.quizes = [
    //   {
    //     tech: [
    //       {
    //         questionTitle: "What is java? 1",
    //         answer1: "A language",
    //         answer2: "A compiler",
    //         answer3: "An interpreter",
    //         answer4: "A software",
    //         correctAnswer: "answer1",
    //         questionType: "quiz",
    //         questionTime: 5,
    //         questionPoints: 100,
    //         questionId: 28,
    //       },
    //       {
    //         questionTitle: "What is c++? 2",
    //         answer1: "A software",
    //         answer2: "A movie",
    //         correctAnswer: "answer1",
    //         questionTime: 4,
    //         questionType: "trueorfalse",
    //         questionPoints: 200,
    //         questionId: 18,
    //       },
    //       {
    //         questionTitle: "What is c++? 3",
    //         answer1: "A software",
    //         answer2: "A movie",
    //         answer3: "A software",
    //         answer4: "A place",
    //         correctAnswer: "answer3",
    //         questionTime: 10,
    //         questionType: "quiz",
    //         questionPoints: 200,
    //         questionId: 18,
    //       },

    //       {
    //         questionTitle: "What is phone? 4",
    //         answer1: "A bubble",
    //         answer2: "pj10",
    //         answer3: "crypto",
    //         answer4: "laptop",
    //         correctAnswer: "answer2",
    //         questionTime: 10,
    //         questionType: "trueorfalse",
    //         questionPoints: 200,
    //         questionId: 18,
    //       },

    //       {
    //         questionTitle: "What is c# 5",
    //         answer1: "A mech",
    //         answer2: "A tech",
    //         answer3: "A food",
    //         answer4: "An animal",
    //         correctAnswer: "answer2",
    //         questionTime: 5,
    //         questionType: "quiz",
    //         questionPoints: 200,
    //         questionId: 18,
    //       },

    //       {
    //         questionTitle: "What is compiler? 6",
    //         answer1: "A phone",
    //         answer2: "A company",
    //         answer3: "A person",
    //         answer4: "A food",
    //         correctAnswer: "answer1",
    //         questionTime: 5,
    //         questionType: "trueorfalse",
    //         questionPoints: 200,
    //         questionId: 18,
    //       },
    //     ],
    //   },
    //   {
    //     food: [
    //       {
    //         questionTitle: "What is java?",
    //         answer1: "A language",
    //         answer2: "A compiler",
    //         answer3: "An interpreter",
    //         answer4: "A software",
    //         correctAnswer: "answer1",
    //         questionType: "quiz",
    //         questionPoints: 100,
    //         questionId: 28,
    //       },
    //     ],
    //   },
    // ];

    this.quizes = [
      {
        travel: [
          {
            questionTitle: "Which of the following is the nickname of Japan?",
            answer1: "land of thousand lakes",
            answer2: "land of golden pagoda",
            answer3: "land of the rising sun",
            answer4: "none of the above",
            correctAnswer: "answer3",
            questionType: "quiz",
            questionTime: 20,
            questionPoints: 100,
            questionId: 28,
          },
          {
            questionTitle: "What is the most populous country in Africa?",
            answer1: "nigeria",
            answer2: "chad",
            answer3: "cameroon",
            answer4: "morocco",
            correctAnswer: "answer1",
            questionTime: 15,
            questionType: "quiz",
            questionPoints: 200,
            questionId: 18,
          },
          {
            questionTitle:
              "Approximately 60 per cent of the world’s lakes can be found in Canada.",
            answer1: "False",
            answer2: "True",
            correctAnswer: "answer2",
            questionTime: 10,
            questionType: "trueorfalse",
            questionPoints: 100,
            questionId: 48,
          },

          {
            questionTitle:
              "What is the most southerly capital city in the world?",
            answer1: "Cape Town, South Africa",
            answer2: "Buenos Aires, Argentina",
            answer3: "Wellington, New Zealand",
            answer4: "Canberra, Australia",
            correctAnswer: "answer3",
            questionTime: 10,
            questionType: "quiz",
            questionPoints: 200,
            questionId: 18,
          },

          {
            questionTitle:
              "Which country in the world is comprised of up to 180,000 islands?",
            answer1: "Malaysia",
            answer2: "Finland",
            answer3: "Norway",
            answer4: "Japan",
            correctAnswer: "answer2",
            questionTime: 15,
            questionType: "quiz",
            questionPoints: 100,
            questionId: 58,
          },

          {
            questionTitle: "What is the largest harbour in Europe?",
            answer1: "Rotterdam, the Netherlands",
            answer2: "Hamburg, Germany",
            answer3: "Antwerp, Belgium",
            answer4: "Bremerhaven, Germany",
            correctAnswer: "answer1",
            questionTime: 20,
            questionType: "quiz",
            questionPoints: 200,
            questionId: 40,
          },

          {
            questionTitle:
              "Volga river flows through Moscow, the capital of Russia?",
            answer1: "True",
            answer2: "False",
            correctAnswer: "answer1",
            questionTime: 10,
            questionType: "trueorfalse",
            questionPoints: 100,
            questionId: 80,
          },

          {
            questionTitle: "What is the currency of Hungary?",
            answer1: "Hungarian euro",
            answer2: "Hungarian dollar",
            answer3: "Hungarian rupee",
            answer4: "Hungarian forint",
            correctAnswer: "answer4",
            questionTime: 30,
            questionType: "quiz",
            questionPoints: 200,
            questionId: 10,
          },
        ],
      },
      {
        random: [
          {
            questionTitle: "What is the only food that cannot go bad?",
            answer1: "Dark chocolate",
            answer2: "Peanut butter",
            answer3: "Canned tuna",
            answer4: "Honey",
            correctAnswer: "answer4",
            questionTime: 10,
            questionType: "quiz",
            questionPoints: 100,
            questionId: 28,
          },

          {
            questionTitle: "What sport has been played on the moon?",
            answer1: "Frisbee",
            answer2: "Soccer",
            answer3: "Golf",
            answer4: "Bocce ball",
            correctAnswer: "answer3",
            questionType: "quiz",
            questionTime: 30,
            questionPoints: 200,
            questionId: 43,
          },

          {
            questionTitle: "Which country’s national animal is a unicorn?",
            answer1: "Denmark",
            answer2: "Scotland",
            answer3: "France",
            answer4: "New Zealand",
            correctAnswer: "answer2",
            questionTime: 20,
            questionType: "quiz",
            questionPoints: 100,
            questionId: 45,
          },

          {
            questionTitle:
              "Dr. Pepper is the oldest soft drink in the United States?",
            answer1: "True",
            answer2: "False",
            correctAnswer: "answer1",
            questionTime: 20,
            questionType: "trueorfalse",
            questionPoints: 100,
            questionId: 44,
          },

          {
            questionTitle:
              "What element does the chemical symbol Au stand for?",
            answer1: "Silver",
            answer2: "Magnesium",
            answer3: "Salt",
            answer4: "Gold",
            correctAnswer: "answer4",
            questionTime: 15,
            questionType: "quiz",
            questionPoints: 200,
            questionId: 32,
          },

          {
            questionTitle:
              "Which of these EU countries does not use the euro as its currency?",
            answer1: "Poland",
            answer2: "Denmark",
            answer3: "Sweden",
            answer4: "All of the above",
            correctAnswer: "answer4",
            questionTime: 30,
            questionType: "quiz",
            questionPoints: 100,
            questionId: 55,
          },

          {
            questionTitle: "Octopus has three hearts?",
            answer1: "False",
            answer2: "True",
            correctAnswer: "answer2",
            questionTime: 10,
            questionType: "trueorfalse",
            questionPoints: 200,
            questionId: 57,
          },

          {
            questionTitle: "What’s the name of Hagrid’s pet spider?",
            answer1: "Crookshanks",
            answer2: "Nigini",
            answer3: "Aragog",
            answer4: "Mosag",
            correctAnswer: "answer3",
            questionTime: 15,
            questionType: "quiz",
            questionPoints: 100,
            questionId: 60,
          },

          {
            questionTitle:
              "What animal is the closest living relative of a human?",
            answer1: "Gorillas",
            answer2: "Monkeys",
            answer3: "Homo sapiens",
            answer4: "Bonobos",
            correctAnswer: "answer4",
            questionTime: 15,
            questionType: "quiz",
            questionPoints: 100,
            questionId: 60,
          },

          {
            questionTitle: "How many islands are in Hawaii?",
            answer1: "137",
            answer2: "7",
            answer3: "11",
            answer4: "48",
            correctAnswer: "answer1",
            questionTime: 15,
            questionType: "quiz",
            questionPoints: 100,
            questionId: 60,
          },
        ],
      },
    ];

    this.disbaleInputs();

    this.getLocalStorage();

    this.renderQuizes();

    // EVENT LISTENERS

    domEl.playText.addEventListener("click", (e) => {
      this.bringToFront(domEl.availableContainer);
    });

    domEl.createText.addEventListener("click", () => {
      this.bringToFront(domEl.createContainer);
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

    domEl.questionsForm.addEventListener("click", () => {
      this.detectCharacters();
    });

    domEl.nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!this.formValidate()) {
          this.displayPopup("Please complete the form");
          return;
        }

        this.addNewQuestion();

        this.renderQuestions();

        this.resetInputs();
      });
    });

    domEl.finishBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!this.formValidate()) {
          this.displayPopup("Please complete the form");
          return;
        }
        this.bringToFront(domEl.availableContainer);

        this.addNewQuestion();

        this.renderQuestions();

        this.setLocalStorage();

        this.renderQuizes();

        this.resetInputs();
      });
    });

    domEl.allQuestionsContainer.addEventListener("click", (e) => {
      this.selectQuestion(e); //work later
      this.deleteQuestion(e);
    });

    domEl.quizesContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("available__delete")) {
        this.deleteQuiz(e);
        return;
      }

      if (e.target.closest(".available__quiz-box")) {
        this.bringToFront(domEl.playContainer);

        this.selectQuiz(e);

        this.questionPopup();
      }
    });

    domEl.questionType.addEventListener("change", () => {
      domEl.answerContainer.textContent = "";
      this.selectType();
    });

    domEl.submitQuestion.addEventListener("click", () => {
      clearInterval(this.resetTimer);

      this.changeOptionsColors();

      this.checkAnswer();

      this.sounds.clockAudio.pause();

      domEl.submitQuestion.style.display = "none"; //later

      domEl.playBtn.style.display = "block";
    });

    domEl.playBtn.addEventListener("click", () => {
      if (this.currentQuestion >= this.quizQuestions.length - 1) {
        this.winnerPopup();

        this.sounds.over.play();

        return;
      }

      this.removeOptionsColors();

      this.removeSelectedAnswer();

      this.currentQuestion++;

      this.removeSound();

      domEl.playBtn.style.display = "none"; //;ater
      domEl.submitQuestion.style.display = "block";

      this.questionPopup();
    });

    domEl.winnerClose.addEventListener("click", () => {
      domEl.winnerPopup.classList.remove("play__winner-show");

      this.resetValues();

      this.removeOptionsColors();

      this.removeSelectedAnswer();

      domEl.playBtn.style.display = "none"; //later
      domEl.submitQuestion.style.display = "block";

      this.bringToFront(domEl.availableContainer);
    });

    domEl.playAnswersContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("play__answer")) {
        this.removeSelectedAnswer();
        this.selectAnswer(e);
      }
    });

    domEl.headerLogo.addEventListener("click", () => {
      this.bringToFront(domEl.playOrCreate);

      this.removeOptionsColors();

      this.removeSelectedAnswer();

      this.resetValues();

      this.removeSound();

      domEl.playBtn.style.display = "none"; //later
      domEl.submitQuestion.style.display = "block";

      domEl.playScore.textContent = this.score;
    });
  }

  detectCharacters() {
    const answerInputs = getAll(".answer__input");

    answerInputs.forEach((answerInput) => {
      const maxChars = 75;

      answerInput.addEventListener("input", (e) => {
        const inputEl = e.target;
        const bgColor = inputEl.parentElement.dataset.color;
        let charsTyped = inputEl.value.length;

        this.changeAnswerInputBg(inputEl, bgColor, "block");

        if (charsTyped <= maxChars)
          inputEl.nextElementSibling.nextElementSibling.textContent =
            maxChars - charsTyped;
        else inputEl.value = inputEl.value.substring(0, maxChars);

        if (!inputEl.value) {
          this.changeAnswerInputBg(inputEl, "#fff", "none");
        }
      });
    });
  }

  selectType() {
    const colorArr = [null, "#ff0000", "#0542b9", "#f5a23d", "#106b03"];

    let questionCount;

    if (domEl.questionType.value === "trueorfalse") questionCount = 3;
    else questionCount = 5;

    for (let i = 1; i < questionCount; i++) {
      let html = `
      <div
      class="questions__answer questions__answer--${i}"
      data-color="${colorArr[i]}"
    >
      <div class="questions__shape-box questions__shape-box--${i}">
        <div class="questions__shape questions__shape--${i}"></div>
      </div>

      <input
        type="text"
        class="answer__input answer__input--${i}"
        placeholder="Add answer ${i}"
        required
      />

      <input
        type="radio"
        name="answer"
        value="answer${i}"
        class="answer answer--${i}"
      />

      <span class="questions__length">75</span>
    </div>`;

      domEl.answerContainer.insertAdjacentHTML("beforeend", html);

      this.detectCharacters();
    }
  }

  bringToFront(container) {
    const containers = [
      domEl.playContainer,
      domEl.createContainer,
      domEl.availableContainer,
    ];

    containers.forEach((cont) => cont.classList.remove("bring-to-front"));

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

  questionTimer() {
    let timeLeft = this.quizQuestions[this.currentQuestion].questionTime;

    this.sounds.clockAudio.load();
    this.sounds.clockAudio.play();

    this.resetTimer = setInterval(() => {
      timeLeft--;

      domEl.playQuestionTime.textContent = timeLeft;

      if (timeLeft === 0) {
        clearInterval(this.resetTimer);

        this.sounds.clockAudio.pause();

        this.checkAnswer();

        this.changeOptionsColors();

        domEl.submitQuestion.style.display = "none"; //later
        domEl.playBtn.style.display = "block";
      }
    }, 1000);
  }

  // fetchQuestion() {
  //   const points = +this.quizQuestions[this.currentQuestion].questionPoints;

  //   if (points === 100) domEl.playScore.textContent = "Standard";
  //   if (points === 200) domEl.playScore.textContent = "Double";
  //   if (points === 0) domEl.playScore.textContent = "No points";

  //   domEl.playQuestionTime.textContent =
  //     this.quizQuestions[this.currentQuestion].questionTime;

  //   domEl.playQuestionTitles.forEach(
  //     (title) =>
  //       (title.textContent =
  //         this.quizQuestions[this.currentQuestion].questionTitle)
  //   );

  //   domEl.playAnswers.forEach((answer, index) => {
  //     //later
  //     if (index == 0)
  //       answer.textContent = this.quizQuestions[this.currentQuestion].answer1;
  //     if (index == 1)
  //       answer.textContent = this.quizQuestions[this.currentQuestion].answer2;
  //     if (index == 2)
  //       answer.textContent = this.quizQuestions[this.currentQuestion].answer3;
  //     if (index == 3)
  //       answer.textContent = this.quizQuestions[this.currentQuestion].answer4;
  //   });
  // }

  fetchQuestion() {
    //later

    const questionData = this.quizQuestions[this.currentQuestion];

    const points = questionData.questionPoints;

    console.log(points);

    if (points === 100) domEl.playScore.textContent = "Standard";
    if (points === 200) domEl.playScore.textContent = "Double";
    if (points === 0) domEl.playScore.textContent = "No points";

    domEl.playQuestionTime.textContent = questionData.questionTime;

    domEl.playQuestionTitles.forEach(
      (title) => (title.textContent = questionData.questionTitle)
    );

    domEl.playAnswersContainer.textContent = "";

    let questionCount;

    if (questionData.questionType === "trueorfalse") questionCount = 3;
    else questionCount = 5;

    for (let i = 1; i < questionCount; i++) {
      let html = `
    <div class="play__answer play__answer--${i}" data-selected="answer${i}">
      <div class="play__shape play__shape--${i}"></div>
      <p class="play__selected">${questionData[`answer${i}`]}</p>
    </div>`;

      domEl.playAnswersContainer.insertAdjacentHTML("beforeend", html);
    }
    this.playAnswerEls = [...domEl.playAnswersContainer.children];
  }

  removeSelectedAnswer() {
    this.playAnswerEls.forEach((answer) =>
      answer.classList.remove("selected-answer")
    );
  }

  selectAnswer(e) {
    e.target.classList.toggle("selected-answer");

    this.selectedAnswer = e.target.dataset.selected;
  }

  checkAnswer() {
    const points = +this.quizQuestions[this.currentQuestion].questionPoints;

    if (
      this.selectedAnswer ===
      this.quizQuestions[this.currentQuestion].correctAnswer
    ) {
      if (points === 100) this.score += 100;
      if (points === 200) this.score += 200;
      if (points === 0) this.score += 0;

      this.sounds.success.load();

      this.sounds.success.play();

      this.correctlyAnswered++;
    } else {
      this.sounds.failure.load();

      this.sounds.failure.play();
    }
  }

  changeOptionsColors() {
    this.playAnswerEls.forEach((answer) => {
      answer.classList.add("wrong-answer");
    });

    const correctAnswerEl =
      +this.quizQuestions[this.currentQuestion].correctAnswer.slice(-1) - 1;

    this.playAnswerEls[correctAnswerEl].classList.add("correct-answer");
  }

  removeOptionsColors() {
    this.playAnswerEls.forEach((answer) => {
      answer.classList.remove("correct-answer", "wrong-answer");
    });
  }

  renderQuizes() {
    domEl.quizesContainer.textContent = "";

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

  resetInputs() {
    const inputs = getAll("input[type = 'text']");

    const selectedRadio = get('input[type="radio"]:checked');

    const answerInputs = getAll(".answer__input");

    inputs.forEach((input) => (input.value = ""));

    selectedRadio.checked = false;

    answerInputs.forEach((inputEl) => {
      this.changeAnswerInputBg(inputEl, "#fff", "none");
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

  changeAnswerInputBg(inputEl, color, display) {
    inputEl.parentElement.style.background = color;
    inputEl.nextElementSibling.style.display = display;
  }

  winnerPopup() {
    domEl.winnerPopup.classList.add("play__winner-show");

    domEl.winnerTotal.textContent = this.quizQuestions.length;

    domEl.winnerScore.textContent = this.score;

    domEl.winnerCorrect.textContent = this.correctlyAnswered;

    domEl.winnerPercentage.innerText = Math.trunc(
      (this.correctlyAnswered / this.quizQuestions.length) * 100
    );
  }

  removeSound() {
    for (let sound in this.sounds) {
      this.sounds[sound].pause();
    }
  }
}

let app = new App();

// this.quizes = [
//   {
//     travel: [
//       {
//         questionTitle: "Which of the following is the nickname of Japan?",
//         answer1: "land of thousand lakes",
//         answer2: "land of golden pagoda",
//         answer3: "land of the rising sun",
//         answer4: "none of the above",
//         correctAnswer: "answer3",
//         questionType: "quiz",
//         questionTime: 20,
//         questionPoints: 100,
//         questionId: 28,
//       },
//       {
//         questionTitle: "What is the most populous country in Africa?",
//         answer1: "nigeria",
//         answer2: "chad",
//         answer3: "cameroon",
//         answer4: "morocco",
//         correctAnswer: "answer1",
//         questionTime: 15,
//         questionType: "quiz",
//         questionPoints: 200,
//         questionId: 18,
//       },
//       {
//         questionTitle:
//           "Approximately 60 per cent of the world’s lakes can be found in Canada.",
//         answer1: "False",
//         answer2: "True",
//         correctAnswer: "answer2",
//         questionTime: 10,
//         questionType: "trueorfalse",
//         questionPoints: 100,
//         questionId: 48,
//       },

//       {
//         questionTitle: "What is the most southerly capital city in the world?",
//         answer1: "Cape Town, South Africa",
//         answer2: "Buenos Aires, Argentina",
//         answer3: "Wellington, New Zealand",
//         answer4: "Canberra, Australia",
//         correctAnswer: "answer3",
//         questionTime: 10,
//         questionType: "quiz",
//         questionPoints: 200,
//         questionId: 18,
//       },

//       {
//         questionTitle:
//           "Which country in the world is comprised of up to 180,000 islands?",
//         answer1: "Malaysia",
//         answer2: "Finland",
//         answer3: "Norway",
//         answer4: "Japan",
//         correctAnswer: "answer2",
//         questionTime: 15,
//         questionType: "quiz",
//         questionPoints: 100,
//         questionId: 58,
//       },

//       {
//         questionTitle: "What is the largest harbour in Europe?",
//         answer1: "Rotterdam, the Netherlands",
//         answer2: "Hamburg, Germany",
//         answer3: "Antwerp, Belgium",
//         answer4: "Bremerhaven, Germany",
//         correctAnswer: "answer1",
//         questionTime: 20,
//         questionType: "quiz",
//         questionPoints: 200,
//         questionId: 40,
//       },

//       {
//         questionTitle:
//           "Volga river flows through Moscow, the capital of Russia?",
//         answer1: "True",
//         answer2: "False",
//         correctAnswer: "answer1",
//         questionTime: 10,
//         questionType: "trueorfalse",
//         questionPoints: 100,
//         questionId: 80,
//       },

//       {
//         questionTitle: "What is the currency of Hungary?",
//         answer1: "Hungarian euro",
//         answer2: "Hungarian dollar",
//         answer3: "Hungarian rupee",
//         answer4: "Hungarian forint",
//         correctAnswer: "answer4",
//         questionTime: 30,
//         questionType: "quiz",
//         questionPoints: 200,
//         questionId: 10,
//       },
//     ],
//   },
//   {
//     random: [
//       {
//         questionTitle: "What is the only food that cannot go bad?",
//         answer1: "Dark chocolate",
//         answer2: "Peanut butter",
//         answer3: "Canned tuna",
//         answer4: "Honey",
//         correctAnswer: "answer4",
//         questionTime: 10,
//         questionType: "quiz",
//         questionPoints: 100,
//         questionId: 28,
//       },

//       {
//         questionTitle: "What sport has been played on the moon?",
//         answer1: "Frisbee",
//         answer2: "Soccer",
//         answer3: "Golf",
//         answer4: "Bocce ball",
//         correctAnswer: "answer3",
//         questionType: "quiz",
//         questionTime: 30,
//         questionPoints: 200,
//         questionId: 43,
//       },

//       {
//         questionTitle: "Which country’s national animal is a unicorn?",
//         answer1: "Denmark",
//         answer2: "Scotland",
//         answer3: "France",
//         answer4: "New Zealand",
//         correctAnswer: "answer2",
//         questionTime: 20,
//         questionType: "quiz",
//         questionPoints: 100,
//         questionId: 45,
//       },

//       {
//         questionTitle:
//           "Dr. Pepper is the oldest soft drink in the United States?",
//         answer1: "True",
//         answer2: "False",
//         correctAnswer: "answer1",
//         questionTime: 20,
//         questionType: "trueorfalse",
//         questionPoints: 100,
//         questionId: 44,
//       },

//       {
//         questionTitle: "What element does the chemical symbol Au stand for?",
//         answer1: "Silver",
//         answer2: "Magnesium",
//         answer3: "Salt",
//         answer4: "Gold",
//         correctAnswer: "answer4",
//         questionTime: 15,
//         questionType: "quiz",
//         questionPoints: 200,
//         questionId: 32,
//       },

//       {
//         questionTitle:
//           "Which of these EU countries does not use the euro as its currency?",
//         answer1: "Poland",
//         answer2: "Denmark",
//         answer3: "Sweden",
//         answer4: "All of the above",
//         correctAnswer: "answer4",
//         questionTime: 30,
//         questionType: "quiz",
//         questionPoints: 100,
//         questionId: 55,
//       },

//       {
//         questionTitle: "Octopus has three hearts?",
//         answer1: "False",
//         answer2: "True",
//         correctAnswer: "answer2",
//         questionTime: 10,
//         questionType: "trueorfalse",
//         questionPoints: 200,
//         questionId: 57,
//       },

//       {
//         questionTitle: "What’s the name of Hagrid’s pet spider?",
//         answer1: "Crookshanks",
//         answer2: "Nigini",
//         answer3: "Aragog",
//         answer4: "Mosag",
//         correctAnswer: "answer3",
//         questionTime: 15,
//         questionType: "quiz",
//         questionPoints: 100,
//         questionId: 60,
//       },

//       {
//         questionTitle: "What animal is the closest living relative of a human?",
//         answer1: "Gorillas",
//         answer2: "Monkeys",
//         answer3: "Homo sapiens",
//         answer4: "Bonobos",
//         correctAnswer: "answer4",
//         questionTime: 15,
//         questionType: "quiz",
//         questionPoints: 100,
//         questionId: 60,
//       },

//       {
//         questionTitle: "How many islands are in Hawaii?",
//         answer1: "137",
//         answer2: "7",
//         answer3: "11",
//         answer4: "48",
//         correctAnswer: "answer1",
//         questionTime: 15,
//         questionType: "quiz",
//         questionPoints: 100,
//         questionId: 60,
//       },
//     ],
//   },
// ];
