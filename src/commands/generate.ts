import { GluegunToolbox } from 'gluegun'
import start, { askNameProject } from '../app/flow/Start'

export default {
  name: 'generate',
  alias: ['g'],
  description: 'Create a new project',
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    await start(toolbox, askNameProject)
  },
}
