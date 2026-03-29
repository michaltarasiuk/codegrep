declare namespace NodeJS {
  interface ProcessEnv {
    WEB_URL: string;
    API_URL: string;
    DATABASE_URL: string;
    GROQ_API_KEY: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_BASE_URL: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
  }
}
