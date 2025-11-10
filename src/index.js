import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors'

const app = new Hono()
app.use('/*', cors())

app.all('/:id', async function(c) {
  const { DB_TABLE, DBSTORE } = env(c);
  const { results } = await DBSTORE
    .prepare(`SELECT * FROM ${DB_TABLE} WHERE id = ? LIMIT 1`)
    .bind(c.req.param('id'))
    .run();
  if (results.length != 1) return c.text("Link not found");
  return c.redirect(results[0].target, 307);
});

app.all('/', (c) => {
  return c.redirect("/index", 307);
});

export default app;
