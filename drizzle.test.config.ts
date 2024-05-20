import { defineConfig } from 'drizzle-kit'

// If I export it with a name, it doesn't work
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  schema: 'src/db/schema/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://serviceuser:pass@localhost:5432/service_db_test',
  },
})
