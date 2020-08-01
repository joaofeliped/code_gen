import { GluegunToolbox } from 'gluegun'
import IBuilderProject from '../models/IBuilderProject'
import IAnswers from '../../flow/IAnswers'

interface IRequestCodeDirectoryFiles {
  answers: IAnswers
  codeDirectory: string
}

interface IRequestSrcDirectoryFiles {
  srcDirectory: string
}

interface IRequestConfigDirectoryFiles {
  configDirectory: string
}

interface IRequestConfigDatabase {
  answers: IAnswers
  rootDirectory: string
  codeDirectory: string
  srcDirectory: string
  configDirectory: string
}

interface IRequestConfigGraphQL {
  answers: IAnswers
  srcDirectory: string
  appDirectory: string
}

interface IRequestConfigRest {
  answers: IAnswers
  srcDirectory: string
}

class BackendJavascriptBuilderProject implements IBuilderProject {
  private toolbox: GluegunToolbox

  constructor(toolbox: GluegunToolbox) {
    this.toolbox = toolbox
  }

  public async build(answers: IAnswers): Promise<void> {
    const {
      createRootFiles,
      template,
      filesystem: { dir, separator },
    } = this.toolbox
    const { rootDirectory, codeDirectory } = await createRootFiles(answers)

    const testsDirectory = dir(`${codeDirectory}${separator}__tests__`).path()
    dir(`${testsDirectory}${separator}integration`)
    dir(`${testsDirectory}${separator}unit`)

    dir(`${codeDirectory}${separator}tmp`)

    const srcDirectory = dir(`${codeDirectory}${separator}src`).path()
    const appDirectory = dir(`${srcDirectory}${separator}app`).path()

    dir(`${appDirectory}${separator}controllers`)
    dir(`${appDirectory}${separator}errors`)
    dir(`${appDirectory}${separator}middlewares`)
    dir(`${appDirectory}${separator}models`)
    dir(`${appDirectory}${separator}services`)

    const configDirectory = dir(`${srcDirectory}${separator}config`).path()

    await this.createCodeDirectoryFiles({ codeDirectory, answers })
    await this.createSrcDirectoryFiles({ srcDirectory })
    await this.createConfigDirectoryFiles({ configDirectory })
    await this.configGraphQL({ appDirectory, srcDirectory, answers })
    await this.configDatabase({
      rootDirectory,
      codeDirectory,
      srcDirectory,
      configDirectory,
      answers,
    })
  }

  private async configRest({
    answers,
    srcDirectory,
  }: IRequestConfigRest): Promise<void> {
    const {
      template,
      patching: { update },
      filesystem: { separator },
    } = this.toolbox

    const { httpTypeAnswer, projectNameAnswer } = answers

    if (httpTypeAnswer === 'Rest') {
      await template.generate({
        template: 'backend/api/nodejs/javascript/src/app.rest.js.ejs',
        target: `${srcDirectory}${separator}app.js`,
      })

      await template.generate({
        template: 'backend/api/nodejs/javascript/src/routes.js.ejs',
        target: `${srcDirectory}${separator}routes.js`,
      })

      await template.generate({
        template: 'backend/api/nodejs/javascript/src/server.rest.js.ejs',
        target: `${srcDirectory}${separator}server.js`,
        props: { name: projectNameAnswer },
      })
    }
  }

  private async configGraphQL({
    answers,
    srcDirectory,
    appDirectory,
  }: IRequestConfigGraphQL): Promise<void> {
    const {
      template,
      patching: { update },
      filesystem: { separator },
    } = this.toolbox

    const { httpTypeAnswer, projectNameAnswer } = answers

    if (httpTypeAnswer === 'GraphQL') {
      await template.generate({
        template: 'backend/api/nodejs/javascript/src/app.graphql.js.ejs',
        target: `${srcDirectory}${separator}app.js`,
      })

      await template.generate({
        template: 'backend/api/nodejs/javascript/src/server.graphql.js.ejs',
        target: `${srcDirectory}${separator}server.js`,
        props: { name: projectNameAnswer },
      })

      await template.generate({
        template: 'backend/api/nodejs/javascript/src/schema.graphql.ejs',
        target: `${srcDirectory}${separator}schema.graphql`,
      })

      await template.generate({
        template:
          'backend/api/nodejs/javascript/src/app/resolvers/resolvers.js.ejs',
        target: `${appDirectory}${separator}resolvers${separator}resolvers.js`,
      })

      // await update(`${codeDirectory}${separator}package.json`, (pkg) => {
      //   pkg.postbuild = "cp ./src/schema.graphql ./dist",

      //   return pkg
      // })
    }
  }

  private async configDatabase({
    rootDirectory,
    codeDirectory,
    srcDirectory,
    configDirectory,
    answers,
  }: IRequestConfigDatabase): Promise<void> {
    const {
      template,
      patching: { update, append, prepend },
      filesystem: { separator, dir },
    } = this.toolbox

    const { useDatabaseAnswer } = answers

    if (useDatabaseAnswer) {
      await template.generate({
        template: 'backend/api/nodejs/javascript/src/config/database.js.ejs',
        target: `${configDirectory}${separator}database.js`,
      })

      const databaseDirectory = dir(
        `${srcDirectory}${separator}database`
      ).path()

      dir(`${databaseDirectory}${separator}migrations`).path()
      dir(`${databaseDirectory}${separator}seeds`).path()

      await template.generate({
        template: 'backend/api/nodejs/javascript/src/database/index.js.ejs',
        target: `${databaseDirectory}${separator}index.js`,
      })

      await template.generate({
        template: 'backend/api/nodejs/javascript/.sequelizerc.ejs',
        target: `${codeDirectory}${separator}.sequelizerc`,
      })

      // await update(`${codeDirectory}${separator}package.json`, (pkg) => {
      //   pkg.pretest = 'NODE_ENV=test sequelize db:migrate'
      //   pkg.posttest = 'NODE_ENV=test sequelize db:migrate:undo:all'

      //   return pkg
      // })

      await append(
        `${codeDirectory}${separator}.env`,
        '\nPOSTGRES_USER=\nPOSTGRES_PASSWORD=\nPOSTGRES_HOST=\nPOSTGRES_DATABASE=\nPOSTGRES_DIALECT=\n'
      )

      await append(
        `${codeDirectory}${separator}.env.example`,
        '\nPOSTGRES_USER=\nPOSTGRES_PASSWORD=\nPOSTGRES_HOST=\nPOSTGRES_DATABASE=\nPOSTGRES_DIALECT=\n'
      )

      await prepend(
        `${codeDirectory}${separator}entrypoint.sh`,
        'npx sequelize db:migrate && \\\nnpx sequelize db:seed:all && \\\n'
      )

      await append(
        `${rootDirectory}${separator}values.yml`,
        '\n\tPOSTGRES_USER:\n\tPOSTGRES_PASSWORD:\n\tPOSTGRES_HOST:\n\tPOSTGRES_DATABASE:\n\tPOSTGRES_DIALECT:\n'
      )
    }
  }

  private async createCodeDirectoryFiles({
    answers: { projectNameAnswer },
    codeDirectory,
  }: IRequestCodeDirectoryFiles): Promise<void> {
    const {
      template,
      filesystem: { separator },
    } = this.toolbox

    await template.generate({
      template: 'backend/api/nodejs/javascript/package.json.ejs',
      target: `${codeDirectory}${separator}package.json`,
      props: { name: projectNameAnswer },
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/nodemon.json.ejs',
      target: `${codeDirectory}${separator}nodemon.json`,
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/jest.config.js.ejs',
      target: `${codeDirectory}${separator}jest.config.js`,
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/entrypoint.sh.ejs',
      target: `${codeDirectory}${separator}entrypoint.sh`,
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/.prettierrc.ejs',
      target: `${codeDirectory}${separator}.prettierrc`,
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/.eslintrc.js.ejs',
      target: `${codeDirectory}${separator}.eslintrc.js`,
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/.env.example.ejs',
      target: `${codeDirectory}${separator}.env.example`,
      props: { name: projectNameAnswer },
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/.env.ejs',
      target: `${codeDirectory}${separator}.env`,
      props: { name: projectNameAnswer },
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/.env.test.ejs',
      target: `${codeDirectory}${separator}.env.test`,
      props: { name: projectNameAnswer },
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/.editorconfig.ejs',
      target: `${codeDirectory}${separator}.editorconfig`,
    })
  }

  private async createSrcDirectoryFiles({
    srcDirectory,
  }: IRequestSrcDirectoryFiles): Promise<void> {
    const {
      template,
      filesystem: { separator },
    } = this.toolbox

    await template.generate({
      template: 'backend/api/nodejs/javascript/src/bootstrap.js.ejs',
      target: `${srcDirectory}${separator}bootstrap.js`,
    })
  }

  private async createConfigDirectoryFiles({
    configDirectory,
  }: IRequestConfigDirectoryFiles): Promise<void> {
    const {
      template,
      filesystem: { separator },
    } = this.toolbox

    await template.generate({
      template: 'backend/api/nodejs/javascript/src/config/sentry.js.ejs',
      target: `${configDirectory}${separator}sentry.js`,
    })

    await template.generate({
      template: 'backend/api/nodejs/javascript/src/config/logger.js.ejs',
      target: `${configDirectory}${separator}logger.js`,
    })
  }
}

export default BackendJavascriptBuilderProject
