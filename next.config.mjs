import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  silent: true,
  sourcemaps: { disable: true },
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
