import { Sdk, type Interceptors } from "./sdk/Sdk";
import { authenticator } from "./utils/auth.server";
import { apiBaseUrl } from "./utils/config.server";
import { getSession, destroySession } from "./utils/session.server";
import { cache } from "./utils/cache.server";
import { redirect, type Session } from "@remix-run/node";

export const sdk = new Sdk({ baseUrl: apiBaseUrl });

export async function getInterceptors(request: Request): Promise<Interceptors> {
  return {
    req: async (req) => {
      // Get access token from cache. If it's not in the cache, just
      // do the original request, which should result in a 401 and the
      // request being retried with a new access token.
      const accessToken = await getAccessToken(request);
      if (!accessToken) {
        return req;
      }
      req.headers.append("x-api-token", accessToken);
      return req;
    },
    res: async (req, res) => {
      // TODO: should this only be for GET?
      if (res.status === 401) {
        // Meh. The redirect is pretty nuclear.
        if (req.method === "GET") {
          const session = await getSession(request.headers.get("Cookie"));
          throw redirect("/login", {
            headers: { "Set-Cookie": await destroySession(session) }
          });
        }
        return res;
      }
      return res;
    }
  };
}

export async function getAccessToken(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return getCacheItem(session).then((x) => x?.accessToken);
}

// cache: userUuid -> { accessToken, refreshToken }

async function getCacheItem(session: Session) {
  const userUuid = session?.get?.(authenticator.sessionKey)?.uuid;
  if (!userUuid) {
    return null;
  }
  return cache.get(userUuid) as any;
}

export function setCacheItem(userUuid: string, value: any) {
  return cache.set(userUuid, value);
}
