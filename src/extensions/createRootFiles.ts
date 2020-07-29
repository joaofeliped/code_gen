import { GluegunToolbox } from 'gluegun'

export default (toolbox: GluegunToolbox): void => {
  const {
    print: { success },
  } = toolbox

  async function createRootFiles(folder, name): Promise<void> {
    success(`Generated ${folder}/${name}.`)
  }

  toolbox.createRootFiles = createRootFiles
}
