const BASE_URL = 'https://api.alexdar.students.nomoredomainssbs.ru';

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
