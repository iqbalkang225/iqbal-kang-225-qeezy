import { get, getAll } from './funcUtil.js';
export default {
  headerContainer: get('.header'),
  cursor: get('.header__cursor'),
  headerLogo: get('.header__logo'),
  answerInputs: getAll('.answer__input'),
  // QUESTION HEADING ElEMENTS
  nextBtns: getAll('.btn--next'),
  quizNameInput: get('.quiz__name-input'),
  quizNameBtn: get('.quiz__name-btn'),
  quizHeaderBox: get('.quiz__header-box'),

  // QUESTION INPUT ELEMENTS
  inputs: getAll('input'),
  selects: getAll('select'),
  container: get('.container__create'),
  questionsForm: get('.questions__form'),
  questionType: get('.questions__type'),
  answerContainer: get('.questions__answers'),

  allQuestionsContainer: get('.questions__all'),
  quizesContainer: get('.available__quizes-box'),
  finishBtns: getAll('.btn--finish'),
  submitQuestion: get('.play__submit'),

  playText: get('.container__button--play'),
  createText: get('.container__button--create'),
  playContainer: get('.container__play'),
  createContainer: get('.container__create'),
  availableContainer: get('.container__available'),
  playBtn: get('.play__next'),
  playOrCreate: get('.container__playorcreate'),
  playPopup: get('.play__question-popup'),
  playBar: get('.play__bar'),
  playQuestionTitles: getAll('.play__title'),
  playQuestionTime: get('.play__time'),
  playScore: get('.play__score'),
  playAnswersContainer: get('.play__answers'),

  winnerPopup: get('.play__winner-popup'),
  winnerClose: get('.play__winner-close'),
  winnerScore: get('.play__winner-score'),
  winnerPercentage: get('.play__winner-percentage'),
  winnerCorrect: get('.play__winner-correct'),
  winnerTotal: get('.play__winner-total'),
};
