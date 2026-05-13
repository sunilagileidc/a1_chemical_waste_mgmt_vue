// localStorageWrapper.js
const localStorageWrapper = {
    setItem(key, value) {
      // Perform necessary operations to set the item in localStorage
      localStorage.setItem(key, value);
    },
    getItem(key) {
      // Perform necessary operations to get the item from localStorage
      return localStorage.getItem(key);
    },
    removeItem(key) {
      // Perform necessary operations to remove the item from localStorage
      localStorage.removeItem(key);
    },
  };
  
  export default localStorageWrapper;
  