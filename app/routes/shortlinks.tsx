import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { Link, LoaderFunction, useCatch, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

interface IShortlink {
  slug: string;
  target: string;
}

export const loader: LoaderFunction = async () => {
  try {
    const shortlinks: IShortlink[] = await db.shortlink.findMany();
    return { shortlinks };
  } catch (error) {
    throw new Response("Something went wrong", { status: 500 });
  }
};

const Shortlinks = () => {
  const loaderData = useLoaderData<{ shortlinks: IShortlink[] }>();
  return (
    <div className="text-white w-full max-w-md">
      <h2 className="text-3xl mb-6">Shortlinks</h2>
      <div>
        {loaderData.shortlinks.length > 0 ? (
          loaderData.shortlinks.map((shortlink) => (
            <a href={shortlink.target} target="_blank">
              <div className="bg-gray-700 w-full p-6 mb-2 rounded">
                {shortlink.slug}
              </div>
            </a>
          ))
        ) : (
          <div>
            Nothing there yet.... create one <Link to="/">here</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  return (
    <div className="text-white">
      <h1 className="text-xl font-bold">Something went wrong</h1>
    </div>
  );
};

export default Shortlinks;
