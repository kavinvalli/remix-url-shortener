import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import {
  ErrorBoundaryComponent,
  LoaderFunction,
  redirect,
  useCatch,
  useParams,
} from "remix";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const shortlink = await db.shortlink.findUnique({ where: { slug } });
  if (!shortlink) {
    throw new Response("Shortlink not found", { status: 404 });
  }
  return redirect(shortlink.target);
};

// This is needed for remix to render the CatchBoundary
export default function Slug() {
  return <p>Something</p>;
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return (
      <div className="text-white">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-md font-bold">Shortlink {params.slug} not found</p>
      </div>
    );
  }
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold">Something went wrong...</h1>
    </div>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const params = useParams();
  return (
    <div className="text-white">
      <h3 className="text-lg">
        There was an error loading shortlink {params.slug}
      </h3>
    </div>
  );
};
