export const getDomElement = function (selection) {
  const element = document.querySelector(selection);

  if (element) return element;
  else throw Error(selection + " Element does not exist in HTML");
};

export const getAllDomElements = function (selection) {
  const elements = document.querySelectorAll(selection);

  if (elements) return elements;
  else throw Error(selection + " Elements does not exist in HTML");
};
