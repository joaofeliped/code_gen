import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const name = parameters.first
  },
}
