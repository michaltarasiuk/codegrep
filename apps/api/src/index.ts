import { app } from "./app";

const port = process.env.PORT ?? 3000;

app.listen(port, ({ hostname, port }) => {
  console.info(`Server running at http://${hostname}:${port}`);
});

export default app;
