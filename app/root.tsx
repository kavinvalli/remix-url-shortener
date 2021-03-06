import {
  ErrorBoundaryComponent,
  Form,
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import {
  CatchBoundaryComponent,
  LinksFunction,
} from "@remix-run/react/routeModules";
import tailwindStyles from "./tailwind.css";
import { authenticator } from "./services/auth.server";
import { User } from "./models/user";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStyles }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  return { user };
};

export default function App() {
  const data = useLoaderData<{ user: User }>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-800 w-full h-full min-h-screen flex justify-center items-center">
        {data.user && (
          <div className="flex absolute text-white top-5 right-5 items-center">
            <Link to="/" className="m-2">
              Home
            </Link>
            <Link to="/shortlinks" className="m-2">
              Shortlinks
            </Link>
            <Form
              action="/logout"
              method="post"
              className="m-2 bg-gray-700 p-4"
            >
              <button type="submit">Logout</button>
            </Form>
          </div>
        )}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  return <div>{caught.status}</div>;
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <div>{error}</div>;
};
