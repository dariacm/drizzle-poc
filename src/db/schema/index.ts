import * as usersSchema from './users'
import * as workflowsSchema from './workflows'

export type SCHEMA_TYPE = typeof usersSchema & typeof workflowsSchema

export const schema = {
  ...usersSchema,
  ...workflowsSchema
}