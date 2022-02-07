import { Outlet } from "remix";

const ShortlinksRoute = () => {
  return (
    <div className="text-white w-full max-w-md">
      <h2 className="text-3xl mb-6">Shortlinks</h2>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ShortlinksRoute;
