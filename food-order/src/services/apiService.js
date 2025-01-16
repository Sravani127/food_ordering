import { toast } from "react-toastify";
import { userId } from "../constants";
import { useDispatch } from "react-redux";
import store, { setLoading } from "../store";

const API_BASE_URL = "http://localhost:3001";

async function handleRequest(url, options, method) {
  try {
    store.dispatch(setLoading(true));
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) {
      console.error("Failed to make the API request", response);
      if (response.status === 401) {
        localStorage.clear();
        window.alert("Your login time was expired, Please login again");
        window.location.href = "/login";
      }
      if (method !== "GET") {
        toast.error(response?.statusText);
      }
    }

    return await response.json();
  } finally {
    store.dispatch(setLoading(false));
  }
}

export async function getRequest(url) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  return await handleRequest(url, options, "GET");
}

export async function postRequest(url, payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(payload),
  };

  return await handleRequest(url, options, "POST");
}

export async function putRequest(url, payload) {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(payload),
  };

  return await handleRequest(url, options, "PATCH");
}

export async function patchRequest(url, payload) {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(payload),
  };

  return await handleRequest(url, options, "PATCH");
}

export async function deleteRequest(url) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  return await handleRequest(url, options, "DELETE");
}
