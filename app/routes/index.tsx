import { useEffect } from "react";
import {
  ActionFunction,
  ErrorBoundaryComponent,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";
import Authenticated from "~/components/home/authenticated";
import Unauthenticated from "~/components/home/unauthenticated";
import { User } from "~/models/user";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";
import toast, { Toaster } from "react-hot-toast";
import { db } from "~/utils/db.server";
import { CatchBoundaryComponent } from "@remix-run/react/routeModules";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  const session = await getSession(request);
  const error = await session.get(authenticator.sessionErrorKey);
  return { user, error };
};

interface ActionData {
  fieldErrors?: {
    slug: string | undefined;
    target: string | undefined;
  };
  fields?: {
    slug: string | null;
    target: string | null;
  };
  success?: boolean;
}

function badRequest(data: ActionData) {
  return json(data, { status: 400 });
}

async function validateSlug(slug: unknown) {
  if (typeof slug !== "string") {
    return `Slug must be a string of atleast 1 character`;
  }
  if (slug.includes("/") || slug.includes(" ")) {
    return `Slug cannot include any spaces or /`;
  }
  if (
    await db.shortlink.findUnique({
      where: { slug },
    })
  ) {
    return `Record with slug ${slug} already exists`;
  }
}

function validateTarget(target: unknown) {
  if (typeof target !== "string") {
    return `Target must be a string of atleast 1 character`;
  }
  const urlRegex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  );
  if (!target.match(urlRegex)) {
    return `Target should be a valid url`;
  }
}

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Response("You're not authorized to create a shortlink", {
      status: 401,
    });
  }
  const form = await request.formData();
  const slug = form.get("slug");
  const target = form.get("target");
  const fieldErrors = {
    slug: await validateSlug(slug),
    target: validateTarget(target),
  };
  const fields = {
    slug: slug ? String(slug) : "",
    target: target ? String(target) : "",
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await db.shortlink.create({ data: fields });
  return { success: true, fields: { slug: "", target: "" } };
};

export default function Index() {
  const loaderData = useLoaderData<{ user: User; error: any }>();
  const actionData = useActionData<ActionData>();
  useEffect(() => {
    if (loaderData.error && loaderData.error.message) {
      toast.error(loaderData.error.message, {
        style: {
          background: "#11171f",
          color: "#fff",
        },
      });
    }

    if (actionData?.success) {
      toast.success("Successfully created shortlink");
    }
  }, [actionData]);
  return (
    <>
      <Toaster />
      {loaderData.user ? (
        <Authenticated
          user={loaderData.user}
          slug={actionData?.fields?.slug}
          target={actionData?.fields?.target}
          fieldErrors={actionData?.fieldErrors}
        />
      ) : (
        <Unauthenticated />
      )}
    </>
  );
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  if (caught.status === 401) {
    return <p>{caught.data}</p>;
  }
  return <div>Something went wrong</div>;
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <div>{error}</div>;
};
