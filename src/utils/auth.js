export const BASE_URL = "https://register.nomoreparties.co";

export const signup = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => {
      console.log(response);
      try {
        if (response.status === 400) {
          return { status: 400, data: response.json() };
        } else {
          return { status: 201, data: response.json() };
        }
      } catch (e) {
        return console.error("Response catch Error: " + e);
      }
    })
    .catch((err) => console.log("Error: " + err));
};

export const signin = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => {
      console.log(response);
      try {
        if (response.status === 400) {
          return { status: 400, data: response.json() };
        } else if (response.status === 401) {
          return { status: 401, data: response.json() };
        } else {
          return response.json();
        }
      } catch (e) {
        return console.error("Response catch Error: " + e);
      }
    })
    .then((data) => {
      console.log(data.token);
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        return data;
      }
    })
    .catch((err) => console.log(err));
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
