import { app } from "./app";

app.listen(3000, ({ hostname, port }) => {
  console.log(`Server running at http://${hostname}:${port}`);
});
