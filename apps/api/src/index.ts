import { app } from "./app";

app.listen(process.env.PORT, ({ hostname, port }) => {
  console.log(`Server running at http://${hostname}:${port}`);
});
