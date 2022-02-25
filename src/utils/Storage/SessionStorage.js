export function getSessionStorage() {
  return sessionStorage.getItem("user");
}

export function setSessionStorage(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

export function clearSessionStorage() {
  sessionStorage.clear();
}
