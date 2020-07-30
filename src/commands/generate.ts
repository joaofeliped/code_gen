import { GluegunToolbox } from 'gluegun'
import start from '../app/flow/Start'

export default {
  name: 'generate',
  alias: ['g'],
  description: 'Create a new project',
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const {
      parameters,
      // print: { info },
    } = toolbox

    const answers = await start(toolbox)

    console.log(answers)
  },
}
