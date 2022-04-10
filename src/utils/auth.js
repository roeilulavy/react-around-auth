// export const BASE_URL = "https://register.nomoreparties.co";
export const BASE_URL = "https://roy-server.students.nomoreparties.sbs";

export const signup = (email, password ) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => {
      try {
        return response.json();
      } catch (e) {
        return console.error("Response catch Error: " + e);
      }
    })
    .catch((err) => console.error("Error: " + err));
};

export const signin = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => {
      try {
          return response.json();
      } catch (e) {
        return console.error("Response catch Error: " + e);
      }
    })
    .then((data) => {
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
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.error(err));
};
