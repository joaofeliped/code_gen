import { GluegunToolbox } from 'gluegun'

export default {
  name: 'generate',
  alias: ['g'],
  description: 'Create a new project',
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const {
      parameters,
      // print: { info },
    } = toolbox

    const name = parameters.first
  },
}
