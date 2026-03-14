import { app } from "./app";

app.listen(3000, ({ hostname, port }) => {
  console.info(`Server running at http://${hostname}:${port}`);
});
