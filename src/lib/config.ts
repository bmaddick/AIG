export const config = {
  dominion: {
    protocol: process.env.DOMINION_PROTOCOL || "https",
    host: process.env.DOMINION_HOST || "",
    port: process.env.DOMINION_PORT || "",
    apiKey: process.env.DOMINION_API_KEY || "",
    clientSecret: process.env.DOMINION_CLIENT_SECRET || "",
  },
} as const;

export function getDominionBaseUrl(): string {
  const { protocol, host, port } = config.dominion;
  if (!host) {
    throw new Error("DOMINION_HOST environment variable is not set");
  }
  return port ? `${protocol}://${host}:${port}` : `${protocol}://${host}`;
}
