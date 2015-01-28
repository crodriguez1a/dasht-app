export var hasLocalStorage = (() => {
  var lsTest = 'ls-feature-detect';
  try {
    localStorage.setItem(lsTest, lsTest);
    localStorage.removeItem(lsTest);
    return true;
  } catch(exception) {
    return false;
  }
})();
