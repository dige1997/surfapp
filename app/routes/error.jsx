import { Link } from "react-router-dom";
export default function Example() {
  return (
    <>
      <main className="relative isolate min-h-full">
        <img
          src="https://cdn.pixabay.com/photo/2017/08/10/01/11/field-2616740_1280.jpg"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover "
          style={{
            filter: "grayscale(100%) contrast(1.5) brightness(0.7)",
            backgroundPosition: "center",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8 text-gray-50">
          <p className="text-base font-semibold leading-8 text-white">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 text-base  sm:mt-6">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex justify-center">
            <Link to="/event" className="text-sm font-semibold leading-7 ">
              <span aria-hidden="true">&larr;</span> Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
