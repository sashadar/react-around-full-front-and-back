/* const apiSettings = {
  serverUrl: 'https://around.nomoreparties.co',
  groupId: 'group-12',
  token: '652541db-3ac9-4c6c-9895-39ab2ae4c9f3',
}; */

const BASE_URL = 'http://localhost:3000';

const processResponse = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(`${res.status} ${res.statusText}`);
};

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  addNewCard({ name, link, token }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(processResponse);
  }

  getUserData(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(processResponse);
  }

  removeLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(processResponse);
  }

  addLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: this._headers,
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
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(processResponse);
  }

  setUserAvatar({ avatarLink, token }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({ avatar: avatarLink }),
    }).then(processResponse);
  }

  removeCard({ cardId, token }) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(processResponse);
  }

  getInitialCardsData(token) {
    return fetch(`${this._baseUrl}/cards`, { headers: this._headers }).then(
      processResponse
    );
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
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export default api;
