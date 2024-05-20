import { defineConfig } from 'drizzle-kit'

import { getConfig } from './src/infrastructure/config'

const config = getConfig()

// If I export it with a name, it doesn't work
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  schema: 'src/db/schema/*.ts',
  out: 'src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.db.databaseUrl,
  },
})
