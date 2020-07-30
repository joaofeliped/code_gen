import { GluegunToolbox } from 'gluegun'

export default (toolbox: GluegunToolbox): void => {
  const {
    print: { success },
  } = toolbox

  async function createRootFiles(projectName: string): Promise<void> {}

  toolbox.createRootFiles = createRootFiles
}
