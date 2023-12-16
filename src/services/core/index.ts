import jsCookie from "js-cookie";
import {encode} from "qss";
import {getClientSideCookie} from "libs/auth";
import {baseUrl} from "constans/config";

interface FetchOptions {
  body: FormData;
  json: object;
  mode: string;
  params: object;
  prefix: string;
  headers: object;
  isPrivate: boolean;
  local: boolean;
  manualUrl: boolean;
  version: number;
  isUsingException: boolean;
}

export class CoreAPI {
  setToken = ({token}: {token: string}) => {
    jsCookie.set("auth_token", token, {
      expires: 7,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });
  };

  setUserId = ({user_id}: {user_id: string}) => {
    jsCookie.set("user_id", user_id, {
      expires: 7,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });
  };

  getUserId = (): string => getClientSideCookie().user_id as string;

  private getToken = (): string => {
    const {token} = getClientSideCookie();

    return token as string;
  };

  private intercept500Error = async (err: UniversalType) => {
    if (err?.status === 500) {
      const customErr = {
        ...err,
        message: "Something went wrong on the server. Please try again later",
      };
      await Promise.reject(customErr);
    }
  };

  private intercept401Error = async (err: UniversalType) => {
    if (err?.status !== 401) return;
  };

  private getUrl = (
    params: object | undefined,
    path: string,
    manualUrl: boolean,
    prefix: string,
  ) => {
    const search = params ? encode(params, "?") : "";

    const url = manualUrl ? path : `${baseUrl}/api/${prefix}${path}${search}`;

    return url;
  };

  fetch = async <TResult = UniversalType>(
    path = "/",
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
    {
      body,
      json,
      params,
      headers,
      prefix = "la",
      isPrivate = false,
      manualUrl = false,
    }: Partial<FetchOptions> = {},
  ): Promise<TResult> => {
    const url = this.getUrl(params, path, manualUrl, prefix);

    if (isPrivate) {
      const token = this.getToken();

      if (token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const resp = await fetch(url, {
        method,
        headers: {
          ...(json && {"content-type": "application/json"}),
          Accept: "application/json",
          ...headers,
        },
        body: body ?? (json ? JSON.stringify(json) : null),
        // credentials: 'include', // disabled
      });

      if (resp?.statusText === "No Content") {
        // bypass when it is csrf-cookie request
        return await Promise.resolve({} as TResult);
      }

      const jsonBody = await resp?.json();

      let responseBody = {...jsonBody};

      if (method !== "GET") {
        if (!resp?.ok) return await Promise.reject(jsonBody);
      }

      if (Array.isArray(jsonBody)) {
        responseBody = [...jsonBody];
      }

      return await Promise.resolve(responseBody);
    } catch (err: UniversalType) {
      // deal with ntwork error / CORS error
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        console.error("failed to get proper response from api server", err);
      }

      this.intercept500Error(err);
      this.intercept401Error(err);

      // get response
      if (typeof err.json === "function") {
        const data = await err.json();
        err.response = {data};
      }

      if (typeof err?.response?.json === "function") {
        const data = await err.response.json();
        err.response = {data};
      }

      return await Promise.reject(err);
    }
  };
}
