import { get, getAll } from './funcUtil.js';
import domEl from './domElements.js';
import quizzes from './quizzesData.js';
import Question from './question.js';
import Quiz from './quiz.js';
import './cursor.js';

class App {
  constructor() {
    this.currentQuizName = '';
    this.quizQuestions = [];
    this.score = 0;
    this.currentQuestion = 0;
    this.selectedAnswer;
    this.resetTimer;
    this.correctlyAnswered = 0;
    this.playAnswerEls = [];

    this.sounds = {
      clockAudio: new Audio('../audio/playing.wav'),
      success: new Audio('../audio/success-1.mp3'),
      failure: new Audio('../audio/failure.mp3'),
      over: new Audio('./audio/over.mp3'),
    };

    this.quizes = quizzes;

    const fetchQuiz = async () => {
      const result = await fetch('http://127.0.0.1:8000/api/v1/quiz');
      const data = await result.json();
      const quiz = Object.entries(data);
      this.displayQuiz(quiz[0][0], quiz[0][1], quizzes.length);
    };

    // fetchQuiz();

    this.disbaleInputs();

    this.getLocalStorage();

    this.renderQuizes();

    // EVENT LISTENERS

    domEl.playText.addEventListener('click', (e) => {
      this.bringToFront(domEl.availableContainer);
    });

    domEl.createText.addEventListener('click', () => {
      this.bringToFront(domEl.createContainer);
    });

    domEl.quizNameBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const userEntered = domEl.quizNameInput.value;

      if (!userEntered) {
        this.displayPopup('Please enter the quiz name');
        return;
      }

      const quiz = new Quiz(userEntered);

      quiz.displayQuizName();

      this.currentQuizName = userEntered;

      this.quizes.push(quiz);

      domEl.quizHeaderBox.style.display = 'none';

      this.enableInputs();
    });

    domEl.questionsForm.addEventListener('click', () => {
      this.detectCharacters();
    });

    domEl.nextBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.formValidate()) {
          this.displayPopup('Please complete the form');
          return;
        }

        this.addNewQuestion();

        this.renderQuestions();

        this.resetInputs();
      });
    });

    domEl.finishBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.formValidate()) {
          this.displayPopup('Please complete the form');
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

    domEl.allQuestionsContainer.addEventListener('click', (e) => {
      this.selectQuestion(e); //work later
      this.deleteQuestion(e);
    });

    domEl.quizesContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('available__delete')) {
        this.deleteQuiz(e);
        return;
      }

      if (e.target.closest('.available__quiz-box')) {
        this.bringToFront(domEl.playContainer);

        this.selectQuiz(e);

        this.questionPopup();
      }
    });

    domEl.questionType.addEventListener('change', () => {
      domEl.answerContainer.textContent = '';
      this.selectType();
    });

    domEl.submitQuestion.addEventListener('click', () => {
      clearInterval(this.resetTimer);

      this.changeOptionsColors();

      this.checkAnswer();

      this.sounds.clockAudio.pause();

      domEl.submitQuestion.style.display = 'none'; //later

      domEl.playBtn.style.display = 'block';
    });

    domEl.playBtn.addEventListener('click', () => {
      if (this.currentQuestion >= this.quizQuestions.length - 1) {
        this.winnerPopup();

        this.sounds.over.play();

        return;
      }

      this.removeOptionsColors();

      this.removeSelectedAnswer();

      this.currentQuestion++;

      this.removeSound();

      domEl.playBtn.style.display = 'none'; //;ater
      domEl.submitQuestion.style.display = 'block';

      this.questionPopup();
    });

    domEl.winnerClose.addEventListener('click', () => {
      domEl.winnerPopup.classList.remove('play__winner-show');

      this.resetValues();

      this.removeOptionsColors();

      this.removeSelectedAnswer();

      domEl.playBtn.style.display = 'none'; //later
      domEl.submitQuestion.style.display = 'block';

      this.bringToFront(domEl.availableContainer);
    });

    domEl.playAnswersContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('play__answer')) {
        this.removeSelectedAnswer();
        this.selectAnswer(e);
      }
    });

    domEl.headerLogo.addEventListener('click', () => {
      this.bringToFront(domEl.playOrCreate);

      this.removeOptionsColors();

      this.removeSelectedAnswer();

      this.resetValues();

      this.removeSound();

      domEl.playBtn.style.display = 'none'; //later
      domEl.submitQuestion.style.display = 'block';

      domEl.playScore.textContent = this.score;
    });
  }

  detectCharacters() {
    const answerInputs = getAll('.answer__input');

    answerInputs.forEach((answerInput) => {
      const maxChars = 75;

      answerInput.addEventListener('input', (e) => {
        const inputEl = e.target;
        const bgColor = inputEl.parentElement.dataset.color;
        let charsTyped = inputEl.value.length;

        this.changeAnswerInputBg(inputEl, bgColor, 'block');

        if (charsTyped <= maxChars) inputEl.nextElementSibling.nextElementSibling.textContent = maxChars - charsTyped;
        else inputEl.value = inputEl.value.substring(0, maxChars);

        if (!inputEl.value) {
          this.changeAnswerInputBg(inputEl, '#fff', 'none');
        }
      });
    });
  }

  selectType() {
    const colorArr = [null, '#ff0000', '#0542b9', '#f5a23d', '#106b03'];

    let questionCount;

    if (domEl.questionType.value === 'trueorfalse') questionCount = 3;
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

      domEl.answerContainer.insertAdjacentHTML('beforeend', html);

      this.detectCharacters();
    }
  }

  bringToFront(container) {
    const containers = [domEl.playContainer, domEl.createContainer, domEl.availableContainer];

    containers.forEach((cont) => cont.classList.remove('bring-to-front'));

    container.classList.add('bring-to-front');
  }

  setLocalStorage() {
    localStorage.setItem('quizes', JSON.stringify(this.quizes));
  }

  getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('quizes'));

    if (!data) return;

    this.quizes = data;
  }

  selectQuiz(e) {
    let selectedQuizName = e.target.closest('.available__quiz-box').dataset.quiz;

    const selectedQuiz = this.quizes.find((quiz) => {
      const quizObject = Object.entries(quiz);

      for (let [quizName, questions] of quizObject) {
        return quizName === selectedQuizName;
      }
    });

    this.quizQuestions = selectedQuiz[selectedQuizName];
  }

  deleteQuiz(e) {
    const deleteQuizName = e.target.closest('.available__quiz-box').dataset.quiz;

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

        domEl.submitQuestion.style.display = 'none'; //later
        domEl.playBtn.style.display = 'block';
      }
    }, 1000);
  }

  fetchQuestion() {
    //later

    const questionData = this.quizQuestions[this.currentQuestion];

    const points = questionData.questionPoints;

    if (points === 100) domEl.playScore.textContent = 'Standard';
    if (points === 200) domEl.playScore.textContent = 'Double';
    if (points === 0) domEl.playScore.textContent = 'No points';

    domEl.playQuestionTime.textContent = questionData.questionTime;

    domEl.playQuestionTitles.forEach((title) => (title.textContent = questionData.questionTitle));

    domEl.playAnswersContainer.textContent = '';

    let questionCount;

    if (questionData.questionType === 'trueorfalse') questionCount = 3;
    else questionCount = 5;

    for (let i = 1; i < questionCount; i++) {
      let html = `
    <div class="play__answer play__answer--${i}" data-selected="answer${i}">
      <div class="play__shape play__shape--${i}"></div>
      <p class="play__selected">${questionData[`answer${i}`]}</p>
    </div>`;

      domEl.playAnswersContainer.insertAdjacentHTML('beforeend', html);
    }
    this.playAnswerEls = [...domEl.playAnswersContainer.children];
  }

  removeSelectedAnswer() {
    this.playAnswerEls.forEach((answer) => answer.classList.remove('selected-answer'));
  }

  selectAnswer(e) {
    e.target.classList.toggle('selected-answer');

    this.selectedAnswer = e.target.dataset.selected;
  }

  checkAnswer() {
    const points = +this.quizQuestions[this.currentQuestion].questionPoints;

    if (this.selectedAnswer === this.quizQuestions[this.currentQuestion].correctAnswer) {
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
      answer.classList.add('wrong-answer');
    });

    const correctAnswerEl = +this.quizQuestions[this.currentQuestion].correctAnswer.slice(-1) - 1;

    this.playAnswerEls[correctAnswerEl].classList.add('correct-answer');
  }

  removeOptionsColors() {
    this.playAnswerEls.forEach((answer) => {
      answer.classList.remove('correct-answer', 'wrong-answer');
    });
  }

  renderQuizes() {
    domEl.quizesContainer.textContent = '';

    this.quizes.forEach((quiz, index) => {
      const quizObject = Object.entries(quiz);

      for (let [quizName, questions] of quizObject) {
        this.displayQuiz(quizName, questions, index);
      }
    });
  }

  displayQuiz(quizName, questions, index) {
    let color = Math.ceil(Math.random() * 4);

    const shortenQuizName = (name) => (name.length > 12 ? name.slice(0, 12) + '...' : name);

    let html = `
    <div class="available__quiz-box" data-quiz="${quizName}">
          <div class="available__heading">
            <span class="available__number">${index + 1}</span>
            <p>${shortenQuizName(quizName)}</p>
          </div>
          <div class="available__info available__info--${color}">
            <div class="available__questions-box">
              <span class="available__questions">${questions.length}</span>
            </div>
            <p class="available__text">questions</p>
            <i class="fa-solid fa-trash-can available__delete"></i>
          </div>
        </div>`;

    domEl.quizesContainer.insertAdjacentHTML('beforeend', html);
  }

  enableInputs() {
    domEl.inputs.forEach((input) => (input.disabled = false));

    domEl.selects.forEach((select) => (select.disabled = false));

    domEl.questionsForm.classList.remove('disabled');

    for (let child of domEl.container.children) child.classList.remove('disabled');
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
    const inputs = [...getAll("input[type = 'text']:not([name = 'quiz__name-input'])")];

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
    const inputs = getAll("input[type = 'text']:not([name = 'quiz__name-input'])");

    const selectedRadio = get('input[type="radio"]:checked');

    let questionTitle, answer1, answer2, answer3, answer4, correctAnswer, questionType, questionTime, questionPoints;

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
    domEl.allQuestionsContainer.textContent = '';

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
              questionTitle.length > 13 ? questionTitle.substring(0, 10) + '...' : questionTitle
            }</p>
            <div class="question__timer-box">
              <span class="question__timer">${questionTime}</span>
            </div>
            <i class="fa-solid fa-trash-can question__delete" data-id="${questionId}"></i>
          </div>
        </div>`;
    domEl.allQuestionsContainer.insertAdjacentHTML('beforeend', html);
  }

  deleteQuestion(e) {
    if (e.target.classList.contains('question__delete')) {
      const deleteQuestionId = +e.target.dataset.id;

      const deleteQuestionIndex = this.currentQuizArr().findIndex(
        (question) => question.questionId === deleteQuestionId
      );

      this.currentQuizArr().splice(deleteQuestionIndex, 1);

      e.target.parentElement.parentElement.remove();

      this.currentQuizArr().forEach((question) => this.renderQuestions(question));
    }
  }

  selectQuestion(e) {
    if (e.target.closest('.questions__box')) {
      //work later
    }
  }

  resetInputs() {
    const inputs = getAll("input[type = 'text']");

    const selectedRadio = get('input[type="radio"]:checked');

    const answerInputs = getAll('.answer__input');

    inputs.forEach((input) => (input.value = ''));

    selectedRadio.checked = false;

    answerInputs.forEach((inputEl) => {
      this.changeAnswerInputBg(inputEl, '#fff', 'none');
    });

    // domEl.selects.forEach((select) => {
    //   select.value = select.selected;
    // });
  }

  resetValues() {
    this.currentQuizName = '';
    this.quizQuestions = [];
    this.score = 0;
    this.currentQuestion = 0;
    this.selectedAnswer;
    this.resetTimer;
    this.correctlyAnswered = 0;
  }

  displayPopup(message) {
    const popupBox = document.createElement('p');
    popupBox.textContent = message;
    popupBox.setAttribute('class', 'notification-popup');
    domEl.questionsForm.append(popupBox);
  }

  questionPopup() {
    this.fetchQuestion();

    domEl.playPopup.classList.add('play__popup-show');
    domEl.playBar.classList.add('play__bar-grow');

    setTimeout(() => {
      domEl.playPopup.classList.remove('play__popup-show');
      this.questionTimer();
    }, 3000);
  }

  changeAnswerInputBg(inputEl, color, display) {
    inputEl.parentElement.style.background = color;
    inputEl.nextElementSibling.style.display = display;
    inputEl.style.color = 'white';
  }

  winnerPopup() {
    domEl.winnerPopup.classList.add('play__winner-show');

    domEl.winnerTotal.textContent = this.quizQuestions.length;

    domEl.winnerScore.textContent = this.score;

    domEl.winnerCorrect.textContent = this.correctlyAnswered;

    domEl.winnerPercentage.innerText = Math.trunc((this.correctlyAnswered / this.quizQuestions.length) * 100);
  }

  removeSound() {
    for (let sound in this.sounds) {
      this.sounds[sound].pause();
    }
  }
}

let app = new App();
