// eslint-disable-next-line no-restricted-imports
import axios from "axios";
import { API_URL } from "../modules/common/constants";

export { handleApiError, http };

const http = axios.create();

http.defaults.baseURL = API_URL;
http.defaults.withCredentials = true;

http.interceptors.request.use(function (config) {
  if (!config.headers) {
    config.headers = {};
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }

  return { ...config };
});

type BusinessErrorCode =
  | "USER_ALREADY_EXISTS"
  | "USER_DOES_NOT_EXIST"
  | "GAME_ALREADY_STARTED"
  | "GAME_NOT_FOUND"
  | "USER_ALREADY_JOINED_GAME"
  | "UNEXPECTED";
type RequestStatusCode = number;
type HandlerKeys = RequestStatusCode | BusinessErrorCode;

const handleApiError = <T>(
  err: unknown,
  handlers: { [k in HandlerKeys]?: () => T } & { default: () => T }
): T => {
  const defaultHandler = handlers.default;

  if (isAxiosErr(err)) {
    const handler =
      handlers[err.response.status as HandlerKeys] ||
      handlers[err.response.data.code as HandlerKeys] ||
      defaultHandler;

    return handler();
  }

  return defaultHandler();
};

interface AxiosErr<D> {
  response: {
    status: number;
    data: D;
  };
}

interface AxiosErrDefaultData {
  code: BusinessErrorCode;
}

const isAxiosErr = <D = AxiosErrDefaultData>(
  err: unknown
): err is AxiosErr<D> => {
  return !!(err as AxiosErr<D>)?.response?.data;
};
