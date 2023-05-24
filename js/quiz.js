import { get, getAll } from './funcUtil.js';
import domEl from './domElements.js';
class Quiz {
  constructor(qName) {
    this[qName] = [];
  }

  displayQuizName() {
    //later
    const questionsHeader = get('.questions__header');

    domEl.quizNameInput.style.display = 'none';
    domEl.quizNameBtn.style.display = 'none';

    const quizHeading = document.createElement('h2');
    quizHeading.setAttribute('class', 'questions__name');
    quizHeading.textContent = domEl.quizNameInput.value;
    questionsHeader.appendChild(quizHeading);
  }
}

export default Quiz;
