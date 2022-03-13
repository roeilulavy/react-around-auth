class Api {
  constructor(options) {
    this._url = options.baseUrl;
    this._token = options.token;
  }

  _checkResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Error ${response.status}, ${response.statusText}`);
  }

  async getInitialCards() {
    const response = await fetch(`${this._url}/cards`, {
      headers: { authorization: this._token },
    });
    return this._checkResponse(response);
  }

  async getUserInfo() {
    const response = await fetch(`${this._url}/users/me`, {
      headers: { authorization: this._token },
    });
    return this._checkResponse(response);
  }

  async setUserInfo(name, about) {
    const response = await fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, about: about }),
    });
    return this._checkResponse(response);
  }

  async setUserAvatar(avatar) {
    const response = await fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar: avatar }),
    });
    return this._checkResponse(response);
  }

  async addNewCard(name, link) {
    const response = await fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, link: link }),
    });
    return this._checkResponse(response);
  }

  async deleteCard(cardId) {
    const response = await fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers: { authorization: this._token },
    });
    return this._checkResponse(response);
  }

  async changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      const response = await fetch(`${this._url}/cards/likes/${cardId}`, {
        method: "PUT",
        headers: { authorization: this._token },
      });
      return this._checkResponse(response);
    } else {
      const response = await fetch(`${this._url}/cards/likes/${cardId}`, {
        method: "DELETE",
        headers: { authorization: this._token },
      });
      return this._checkResponse(response);
    }
  }
}

export default new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-12",
  token: "03197c45-af19-4b1d-a978-69b8bedd3378",
});
