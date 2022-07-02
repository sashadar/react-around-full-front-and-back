/* const apiSettings = {
  serverUrl: 'https://around.nomoreparties.co',
  groupId: 'group-12',
  token: '652541db-3ac9-4c6c-9895-39ab2ae4c9f3',
}; */

/* headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
 */
const BASE_URL = 'http://localhost:3000';
/* const BASE_URL = 'https://around.nomoreparties.co/v1/group-12'; */

const processResponse = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(`${res.status} ${res.statusText}`);
};

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  addNewCard({ name, link, token }) {
    /* console.log(`api.addnewcard: name: ${name}`);
    console.log(`api.addnewcard: link: ${link}`);
    console.log(`api.addnewcard: token: ${token}`); */

    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(processResponse);
  }

  getUserData(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    }).then(processResponse);
  }

  removeLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    }).then(processResponse);
  }

  addLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    }).then(processResponse);
  }

  changeLikeCardStatus({ cardId, isNotLiked, token }) {
    return isNotLiked
      ? this.addLike(cardId, token)
      : this.removeLike(cardId, token);
  }

  setUserData({ name, about, token }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(processResponse);
  }

  setUserAvatar({ avatarLink, token }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar: avatarLink }),
    }).then(processResponse);
  }

  removeCard({ cardId, token }) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    }).then(processResponse);
  }

  getInitialCardsData(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    }).then(processResponse);
  }

  getInitialData({ token }) {
    return Promise.all([
      this.getUserData(token),
      this.getInitialCardsData(token),
    ]);
  }
}

const api = new Api({
  baseUrl: BASE_URL,
});

export default api;
