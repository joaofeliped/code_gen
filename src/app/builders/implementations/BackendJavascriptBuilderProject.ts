import { GluegunToolbox } from 'gluegun'
import IBuilderProject from '../models/IBuilderProject'
import IAnswers from '../../flow/IAnswers'

class BackendJavascriptBuilderProject implements IBuilderProject {
  private toolbox: GluegunToolbox

  constructor(toolbox: GluegunToolbox) {
    this.toolbox = toolbox
  }

  public async build(answers: IAnswers): Promise<void> {
    const { createRootFiles } = this.toolbox
    console.log('start build')
    console.log(answers)

    await createRootFiles(answers.projectNameAnswer)
  }
}

export default BackendJavascriptBuilderProject
