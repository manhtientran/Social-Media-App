const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_SECRET_KEY",
  postgresUri:
    process.env.POSTGRES_URI ||
    process.env.POSTGRES_HOST ||
    "postgresql://" +
      (process.env.DATABASE_USER || "postgres") +
      ":" +
      (process.env.DATABASE_PASSWORD || "postgres") +
      "@" +
      (process.env.IP || "localhost") +
      ":" +
      (process.env.POSTGRES_PORT || "5432") +
      "/" +
      (process.env.DATABASE_NAME || "socialMediaApp"),
};

export default config;
