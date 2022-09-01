import { get, getAll } from "./funcUtil.js";
export default {
  // QUESTION HEADING ElEMENTS
  nextBtns: getAll(".btn--next"),
  quizNameInput: get(".quiz__name-input"),
  quizNameBtn: get(".quiz__name-btn"),

  // QUESTION INPUT ELEMENTS
  inputs: getAll("input"),
  selects: getAll("select"),
  container: get(".container__create"),
  questionsForm: get(".questions__form"),

  allQuestionsContainer: get(".questions__all"),
  quizesContainer: get(".available__quizes-box"),
  finishBtns: getAll(".btn--finish"),
  submitQuestion: get(".play__submit"),

  playText: get(".play__heading span"),
  createText: get(".create__heading span"),
  playContainer: get(".container__play"),
  createContainer: get(".container__create"),
  availableContainer: get(".container__available"),
};
