export const TOKEN_KEY = "@motohub-Token";
export const USER_KEY = "@motohub-User";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null && localStorage.getItem(USER_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => localStorage.getItem(USER_KEY);
export const login = (token, userId) => {
  localStorage.setItem(USER_KEY, userId);
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};