import invariant from "tiny-invariant";

export const _sessionSecret = process.env.SESSION_SECRET;
invariant(_sessionSecret, "SESSION_SECRET not set.");
export const sessionSecret = _sessionSecret;

const _apiBaseUrl = process.env.API_BASE_URL;
invariant(_apiBaseUrl, "API_BASE_URL not set.");
export const apiBaseUrl = _apiBaseUrl;
