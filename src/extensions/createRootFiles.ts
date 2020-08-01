import { GluegunToolbox } from 'gluegun'
import IAnswers from '../app/flow/IAnswers'

interface IResponse {
  rootDirectory: string
  codeDirectory: string
}

export default (toolbox: GluegunToolbox): void => {
  const {
    template,
    filesystem: { separator, dir },
  } = toolbox

  async function createRootFiles(answers: IAnswers): Promise<IResponse> {
    const { projectNameAnswer } = answers

    const rootDirectory = dir(projectNameAnswer).path()
    const codeDirectory = dir(`${rootDirectory}${separator}code`).path()

    await template.generate({
      template: 'root/values.yml.ejs',
      target: `${rootDirectory}${separator}values.yml`,
      props: { name: projectNameAnswer },
    })

    await template.generate({
      template: 'root/sonar-project.properties.ejs',
      target: `${rootDirectory}${separator}sonar-project.properties`,
    })

    await template.generate({
      template: 'root/README.md.ejs',
      target: `${rootDirectory}${separator}README.md`,
      props: { name: projectNameAnswer },
    })

    if (answers.backendLanguageAnswer === 'NodeJS') {
      await template.generate({
        template: 'root/Dockerfile.nodejs.ejs',
        target: `${rootDirectory}${separator}Dockerfile`,
      })
    }

    await template.generate({
      template: 'root/.gitlab-ci.yml.ejs',
      target: `${rootDirectory}${separator}.gitlab-ci.yml`,
    })

    await template.generate({
      template: 'root/.gitignore.ejs',
      target: `${rootDirectory}${separator}.gitignore`,
    })

    await template.generate({
      template: 'root/.dockerignore.ejs',
      target: `${rootDirectory}${separator}.dockerignore`,
    })

    return {
      rootDirectory,
      codeDirectory,
    }
  }

  toolbox.createRootFiles = createRootFiles
}
