import { GluegunToolbox } from 'gluegun'

export default (toolbox: GluegunToolbox): void => {
  const {
    template,
    filesystem: { separator },
  } = toolbox

  async function createRootFiles(projectName: string): Promise<void> {
    console.log('criando root files')
    console.log(projectName)

    await template.generate({
      template: 'root/values.yml.ejs',
      target: `${projectName}${separator}values.yml`,
      props: { name: projectName },
    })
  }

  toolbox.createRootFiles = createRootFiles
}
