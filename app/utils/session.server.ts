import { createCookieSessionStorage, type Session } from "@remix-run/node";
import { sessionSecret } from "./config.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "app_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NO_SECURE_COOKIE
      ? false
      : process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    // 14 days
    maxAge: 60 * 60 * 24 * 14,
    httpOnly: true,
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;

export type TFlashMessageType = "success" | "error";
export type TFlashMessage = { message: string; type: TFlashMessageType } | null;

const flashMessageKey = "flashMessage";

export function flashMessage(
  message: string,
  type: TFlashMessageType,
  session: Session
) {
  return session.flash(flashMessageKey, { message, type });
}

export function getFlashMessage(session: Session): TFlashMessage {
  return session.get(flashMessageKey) || null;
}
