import axios from "axios";
import { env } from "./env";

let tokenGetter = null;

/**
 * Registers Clerk's token retrieval function with our API utility.
 */

export function setApiTokenGetter(getter) {
    tokenGetter = getter;
}

const  api = axios.create({
    baseURL: env.backendUrl,
    withCredentials: false,
})

// interceptor to inject clerk's JWT credential conflicts when using header tokens
api.interceptors.request.use(async (config) => {
  if (!tokenGetter) return config;

  const token = await tokenGetter();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


//safely extracts clean error messages from network issues or backend responses
function getErrorMsg(error) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      "Request failed"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

//Centalized rresponse validator that unpacks our apiresponse envelope
function handleResponse(response) {
  const data = response.data;

  if (!data.success) {
    throw new Error(
      data.message ||
        data.errors?.[0]?.message ||
        "Request failed"
    );
  }

  return data.data; // return only the clean payload(er, user, products)
}

export async function apiGet(url, config) {
  try {
    const response = await api.get(url, config);

    return handleResponse(response);
  } catch (error) {
  throw new Error(getErrorMsg(error), { cause: error });
  }
}

export async function apiPost(url,body, config) {
  try {
    const response = await api.post(url, body, config);

    return handleResponse(response);
  } catch (error) {
  throw new Error(getErrorMsg(error), { cause: error });
  }
}

export async function apiPut(url,body, config) {
  try {
    const response = await api.put(url, body, config);

    return handleResponse(response);
  } catch (error) {
  throw new Error(getErrorMsg(error), { cause: error });
  }
}

export async function apiPatch(url, body, config) {
  try {
    const response = await api.patch(url, body, config);
    return handleResponse(response);
  } catch (error) {
    throw new Error(getErrorMsg(error), { cause: error });
  }
}

export async function apiDelete(url, config) {
  try {
    const response = await api.delete(url, config);
    return handleResponse(response);
  } catch (error) {
    throw new Error(getErrorMsg(error), { cause: error });
  }
}

