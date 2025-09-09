import { buildApp } from "./app";
import { ENV } from "./config/env";

const app = buildApp();

app.listen({ port: ENV.PORT_NUM, host: "0.0.0.0" })
  .then((address) => app.log.info(`🚀 workforce-svc up at ${address}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
