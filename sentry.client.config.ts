// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c73becbbee86ffd8107ad7c275d4d27c@o4507293150216192.ingest.de.sentry.io/4507293167517776",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
