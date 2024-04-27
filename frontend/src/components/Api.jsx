import axios from 'axios'

const uri = process.env.REACT_APP_APIURL;

export function sendRequest(method, body, url) {
  const requestOptions = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body,
  };
  const response = fetch(url, requestOptions);
  if (method === "DELETE") {
    return response;
  } else if (response.ok) {
    const data = await response.json();
    return data;
  } else if (response.status === 401) {
    throw new Error("Unauthorized");
  } else {
    throw new Error(
      "Server responds with " + response.status + " : " + response.statusText
    );
  }
}
export function getToken(json) {
  return sendRequest("POST", JSON.stringify(json), endpoints.access);
}
export function deleteToken(json) {
  return sendRequest("DELETE", JSON.stringify(json), endpoints.access);
}
export function registerUser(json) {
  return sendRequest("POST", JSON.stringify(json), endpoints.users);
}

export function getUser(uid) {
  return sendRequest("GET", null, endpoints.users + "/" + uid);
}