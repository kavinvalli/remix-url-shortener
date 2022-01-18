import { Authenticator, AuthorizationError } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { login, User } from "~/models/user";
import { sessionStorage } from "./session.server";

export let authenticator = new Authenticator<User>(sessionStorage);

if (!process.env.GITHUB_CLIENT_ID) throw new Error("Missing GITHUB_CLIENT_ID");
if (!process.env.GITHUB_CLIENT_SECRET)
  throw new Error("Missing GITHUB_CLIENT_SECRET");
const {
  GITHUB_CLIENT_ID: clientID,
  GITHUB_CLIENT_SECRET: clientSecret,
  APP_URL,
} = process.env;

authenticator.use(
  new GitHubStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${APP_URL}/auth/github/callback`,
    },
    async (profile) => {
      if (profile.profile.emails[0].value === process.env.ALLOWED_EMAIL)
        return login(
          profile.profile.name.givenName,
          profile.profile.emails[0].value
        );
      throw new AuthorizationError(
        "You're not allowed to login to this platform"
      );
    }
  )
);
