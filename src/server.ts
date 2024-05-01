import { Server } from "http";
import app from "./app";

const port = 3000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`Ph Health Care is listening on port ${port}`);
  });

  const existHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server close");
      });
    }

    process.exit(1);
  };

  // cloase the server for uncaughtException
  process.on("uncaughtException", (error) => {
    console.log(error);
    existHandler();
  });

  // cloase the server for unhandledRejection
  process.on("unhandledRejection", (error) => {
    console.log(error);
    existHandler();
  });
}

main();
