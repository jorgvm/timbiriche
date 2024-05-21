"use client";

/**
 * Test if Sentry integration works
 */
const Page = () => {
  return (
    <button
      type="button"
      onClick={() => {
        throw new Error("Sentry Frontend Error tesssst");
      }}
    >
      Throw Sentry error
    </button>
  );
};

export default Page;
