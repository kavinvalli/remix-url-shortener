import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { LoaderFunction, useCatch, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const shortlink = await db.shortlink.findUnique({ where: { slug } });
  if (!shortlink) {
    throw new Response("Shortlink not found", { status: 404 });
  }

  return shortlink;
};

const ShortlinkRoute = () => {
  const shortlink = useLoaderData();
  return (
    <div>
      <div className="mb-3">
        <h3 className="font-bold text-xl">Slug:</h3> {shortlink.slug}
      </div>
      <div>
        <h3 className="font-bold text-xl">Target:</h3>
        <a href={shortlink.target} target="_blank" className="underline">
          {shortlink.target}
        </a>
      </div>
    </div>
  );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  if (caught.status === 404) {
    return <div>Shortlink not found</div>;
  }
  return (
    <div>
      <h1>Something went wrong</h1>
    </div>
  );
};

export default ShortlinkRoute;
