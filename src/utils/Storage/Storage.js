export function getLocalStorage(endpoint) {
    return localStorage.getItem(endpoint);
  }
  
  export function setLocalStorage(endpoint,user) {
    let existingUser;
    if (JSON.parse(getLocalStorage(endpoint)) !== null) {
      existingUser = JSON.parse(getLocalStorage(endpoint));
    } else {
      existingUser = [];
    }
    existingUser.push(user);
    localStorage.setItem(endpoint, JSON.stringify(existingUser));
  }
  
  export function clearLocalStorage() {
    localStorage.clear();
  }
  