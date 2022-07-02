/* const BASE_URL = 'https://register.nomoreparties.co'; */
const BASE_URL = 'http://localhost:3000';
/* const BASE_URL = 'https://around.nomoreparties.co/v1/group-12'; */
/* const BASE_URL = 'https://register.nomoreparties.co'; */

const processResponse = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(`${res.status} ${res.statusText}`);
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: password,
      email: email,
    }),
  }).then(processResponse);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then(processResponse)
    .then((data) => {
      console.log(
        `(front)auth.js: setting token to dataStorage. token: ${data.token}`
      );
      localStorage.setItem('token', data.token);
      return data;
    });
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(processResponse);
  /* .then((data) => data) */
};
