const apiSettings = {
  serverUrl: 'https://around.nomoreparties.co',
  groupId: 'group-12',
  token: '652541db-3ac9-4c6c-9895-39ab2ae4c9f3',
};

const processResponse = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(`${res.status} ${res.statusText}`);
};

class Api {
  constructor({ serverUrl, groupId, token }) {
    this._serverUrl = serverUrl;
    this._groupId = groupId;
    this._token = token;
  }

  setup() {
    this._mainUrl = `${this._serverUrl}/v1/${this._groupId}`;
    this._headers = {
      authorization: this._token,
      'Content-Type': 'application/json',
    };
  }

  addNewCard({ name, link }) {
    return fetch(`${this._mainUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(processResponse);
  }

  getUserData() {
    return fetch(`${this._mainUrl}/users/me`, {
      headers: this._headers,
    }).then(processResponse);
  }

  removeLike(cardId) {
    return fetch(`${this._mainUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(processResponse);
  }

  addLike(cardId) {
    return fetch(`${this._mainUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: this._headers,
    }).then(processResponse);
  }

  changeLikeCardStatus(cardId, isNotLiked) {
    return isNotLiked ? this.addLike(cardId) : this.removeLike(cardId);
  }

  setUserData({ name, about }) {
    return fetch(`${this._mainUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(processResponse);
  }

  setUserAvatar(avatarLink) {
    return fetch(`${this._mainUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({ avatar: avatarLink }),
    }).then(processResponse);
  }

  removeCard(cardId) {
    return fetch(`${this._mainUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(processResponse);
  }

  getInitialCardsData() {
    return fetch(`${this._mainUrl}/cards`, { headers: this._headers }).then(
      processResponse
    );
  }

  getInitialData() {
    return Promise.all([this.getUserData(), this.getInitialCardsData()]);
  }
}

const api = new Api({
  serverUrl: apiSettings.serverUrl,
  groupId: apiSettings.groupId,
  token: apiSettings.token,
});

api.setup();

export default api;
