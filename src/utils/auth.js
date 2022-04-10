export const BASE_URL = "https://roy-server.students.nomoreparties.sbs";

function checkResponse(response) {
  console.log(response)
  if (response.ok) {
      return response.json();
  }

  if (response.status === 409) {
    return Promise.reject({status: response.status, message: 'User already exist!'});
  } else if (response.status === 500) {
    return Promise.reject({status: response.status, message: 'Internal Server Error'});
  } else {
    return Promise.reject({status: response.status, message: response.statusText});
  }
}

export async function signup (email, password ) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  });
  return checkResponse(response);    
};

export async function signin (email, password ) {
  const response = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  });
  return checkResponse(response);    
};

export async function checkToken (token) {

  if (!token) {
    console.error('There is no Token')
    throw new Error('No token found');
  }

  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
    return checkResponse(response);
};
