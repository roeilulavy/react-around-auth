export const BASE_URL = "https://register.nomoreparties.co";

export const signup = ( password, email ) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => {
      try {
        if (response.status === 200) {
          return response.json();
        }
      } catch(e){
        // return e;
        return console.error("Response catch Error: " + e);
      }
    })
    .catch((err) => console.log("Error: "+err));
};

export const signin = (password, email ) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
  .then((response => response.json()))
  .then((data) => {
    console.log(data.token);
    if (data.token) {
      localStorage.setItem('jwt', data.token);
      return data;
    }
    })
    .catch((err) => console.log(err));
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log(err));
};
