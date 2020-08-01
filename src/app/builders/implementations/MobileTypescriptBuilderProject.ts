import { GluegunToolbox } from 'gluegun'
import IBuilderProject from '../models/IBuilderProject'
import IAnswers from '../../flow/IAnswers'

class MobileTypescriptBuilderProject implements IBuilderProject {
  private toolbox: GluegunToolbox

  constructor(toolbox: GluegunToolbox) {
    this.toolbox = toolbox
  }

  public async build(answers: IAnswers): Promise<void> {
    const {
      print: { error },
    } = this.toolbox
    console.log('start build')
    await error("Sorry, we don't have mobile projects yet")
  }
}

export default MobileTypescriptBuilderProject
