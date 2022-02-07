import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import {
  ActionFunction,
  Link,
  LoaderFunction,
  useFetcher,
  useLoaderData,
} from "remix";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

interface IShortlink {
  id: string;
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

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Response("You're not authorized to create a shortlink", {
      status: 401,
    });
  }
  const form = await request.formData();
  const id = form.get("id")?.toString();
  try {
    return db.shortlink.delete({ where: { id } });
  } catch (error) {
    return { error: true, message: (error as Error).message };
  }
};

const Shortlinks = () => {
  const loaderData = useLoaderData<{ shortlinks: IShortlink[] }>();

  return (
    <div>
      {loaderData.shortlinks.length > 0 ? (
        loaderData.shortlinks.map((shortlink) => (
          <Shortlink key={shortlink.id} shortlink={shortlink} />
        ))
      ) : (
        <div>
          Nothing there yet.... create one <Link to="/">here</Link>
        </div>
      )}
    </div>
  );
};

const Shortlink: React.FC<{ shortlink: IShortlink }> = ({ shortlink }) => {
  const fetcher = useFetcher();
  let isDeleting = fetcher.submission?.formData.get("id") === shortlink.id;
  let isFailedDeletion = fetcher.data?.error;

  return (
    <>
      {isFailedDeletion && (
        <div className="bg-red-300 bg-opacity-90 border border-red-400 rounded-md text-red-900 py-4 px-6 my-2">
          {fetcher.data?.message}
        </div>
      )}
      <Link to={"/shortlinks/" + shortlink.slug}>
        <div
          className={
            "bg-gray-700 w-full p-6 mb-2 rounded flex justify-between items-center" +
            (isDeleting ? " hidden" : "")
          }
        >
          <p>{shortlink.slug}</p>
          <fetcher.Form method="delete" action="/shortlinks">
            <input type="hidden" name="id" value={shortlink.id} />
            <button
              type="submit"
              className={
                "rounded-sm p-2" +
                (isFailedDeletion ? " bg-red-500" : " bg-gray-800")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </fetcher.Form>
        </div>
      </Link>
    </>
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
