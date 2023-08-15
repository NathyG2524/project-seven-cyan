// import { ConnectionOptions } from "typeorm";
// // eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
// import * as dotenv from "dotenv";

// if (process.env.NODE_ENV === "local") {
//   dotenv.config({ path: "./env/local.env" });
// }
////
// Check typeORM documentation for more information.
export const DbConfig = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: true,
  logger: "file",

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: ["src/migrations/**/*{.ts,.js}"],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: "src/migrations",
  },
};
//export config;