import {
  type LinksFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useFetcher,
  // useLocation,
} from "@remix-run/react";
import styles from "./__private.css";
import logo from "../../public/CLP-logos/CLP-logos_transparent.png";
import { Pressable } from "@cl-privacy/components/pressable";
import stylesPressable from "@cl-privacy/components/pressable/styles.css";
import { Avatar } from "@cl-privacy/components/avatar";
import stylesAvatar from "@cl-privacy/components/avatar/styles.css";
import { appName } from "~/utils/appName";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuPopover,
  MenuItems,
} from "@cl-privacy/components/menu-button";
import stylesMenuButton from "@cl-privacy/components/menu-button/styles.css";
import { useAuthenticityToken } from "remix-utils";
import { getAvatarColors } from "~/utils/getAvatarColors";
import { authenticator } from "~/utils/auth.server";
import { type User } from "~/utils/User.server";
import { getAccessToken, getInterceptors, sdk } from "~/sdk";
import { getSession, destroySession } from "~/utils/session.server";
// import { useInterval } from "usehooks-ts";

export const handle = {
  id: "__private",
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesMenuButton },
    { rel: "stylesheet", href: stylesPressable },
    { rel: "stylesheet", href: stylesAvatar },
  ];
};

export type LoaderData = { user: User; accessToken: string | undefined };

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const resData = await sdk.getMe({
    interceptors: await getInterceptors(request),
  });
  if (resData.res.status === 401) {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/login", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }
  const accessToken = await getAccessToken(request);
  const out: LoaderData = { user, accessToken };
  return json(out);
};

export default function Route() {
  const data = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  // const location = useLocation();
  const csrf = useAuthenticityToken();
  const { user } = data;
  const avatarColors = getAvatarColors(user.uuid);

  // useInterval(
  //   () => {
  //     fetcher.submit(
  //       { redirectTo: location.pathname + location.search },
  //       {
  //         action: "/update-refresh-token",
  //         method: "post",
  //         replace: true,
  //       }
  //     );
  //   },
  //   // 10 min
  //   // ms
  //   600000
  // );

  return (
    <div className="__private-root">
      <header>
        <div>
          <div>
            <Pressable as={Link} to="/" title={appName} aria-label={appName}>
              <img src={logo} alt={appName} height={28} className="logo" />
            </Pressable>
          </div>
          <div>
            {/* https://remix.run/docs/en/v1/guides/data-writes#graduate-to-form-and-add-pending-ui */}
            <Menu>
              <MenuButton as={Pressable}>
                <Avatar
                  fallback={{ fallback: user.firstName ?? "", ...avatarColors }}
                  size="xs"
                />
              </MenuButton>
              <MenuPopover>
                <div className="__private_menu_user">
                  <div>
                    {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                  </div>
                  <div>{user.email}</div>
                </div>
                <MenuItems>
                  <MenuItem
                    onSelect={() =>
                      fetcher.submit(
                        { csrf },
                        { action: "/logout", method: "post" }
                      )
                    }
                  >
                    Sign Out
                  </MenuItem>
                </MenuItems>
              </MenuPopover>
            </Menu>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
