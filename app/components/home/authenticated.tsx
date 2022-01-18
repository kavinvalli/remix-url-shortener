import { useEffect, useState } from "react";
import { Form } from "remix";
import { User } from "~/models/user";

interface IAuthenticatedProps {
  user: User;
  slug: string | null | undefined;
  target: string | null | undefined;
  fieldErrors?: {
    slug: string | undefined;
    target: string | undefined;
  };
}

const Authenticated: React.FC<IAuthenticatedProps> = ({
  user,
  slug: _slug,
  target: _target,
  fieldErrors,
}) => {
  const [slug, setSlug] = useState(_slug);
  const [target, setTarget] = useState(_target);
  useEffect(() => {
    setSlug(_slug);
    setTarget(_target);
  }, [_slug, _target]);
  return (
    <Form
      method="post"
      className="p-12 bg-gray-700 w-full max-w-md rounded mx-4"
    >
      <h2 className="text-white text-lg mb-4">
        Hi <span className="uppercase text-2xl font-bold">{user.name}</span>
      </h2>
      <div className="relative mb-4">
        <input
          id="slug"
          name="slug"
          className="peer h-10 w-full border-b-2 border-gray-400 text-white placeholder-transparent focus:outline-none focus:border-white bg-transparent text-sm"
          placeholder="target"
          value={slug ?? ""}
          onChange={(e) =>
            setSlug(e.target.value.split("/").join("").split(" ").join(""))
          }
        />
        <label
          htmlFor="slug"
          className="absolute left-0 -top-3.5 text-white text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm text-sm"
        >
          Slug
        </label>
        {fieldErrors?.slug && (
          <p className="text-red-500 text-xs">{fieldErrors?.slug}</p>
        )}
      </div>
      <div className="relative mb-4">
        <input
          id="target"
          name="target"
          type="text"
          className="w-full h-10 text-sm text-white placeholder-transparent bg-transparent border-b-2 border-gray-400 peer focus:outline-none focus:border-white"
          placeholder="target"
          value={target ?? ""}
          onChange={(e) => setTarget(e.target.value.split(" ").join(""))}
        />
        <label
          htmlFor="target"
          className="absolute left-0 -top-3.5 text-white text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm text-sm"
        >
          Target
        </label>
        {fieldErrors?.target && (
          <p className="text-red-500 text-xs">{fieldErrors?.target}</p>
        )}
      </div>
      <div className="flex justify-end w-full">
        <button
          type="submit"
          className="flex items-center px-4 py-3 font-bold text-white uppercase bg-gray-800 rounded"
        >
          submit
        </button>
      </div>
    </Form>
  );
};

export default Authenticated;
