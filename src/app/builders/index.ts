import { GluegunToolbox } from 'gluegun'
import IAnswers from '../flow/IAnswers'
import BackendJavascriptBuilderProject from './implementations/BackendJavascriptBuilderProject'
import IBuilderProject from './models/IBuilderProject'
import BackendTypescriptBuilderProject from './implementations/BackendTypescriptBuilderProject'
import BackendPythonBuilderProject from './implementations/BackendPythonBuilderProject'
import FrontendJavascriptBuilderProject from './implementations/FrontendJavascriptBuilderProject'
import FrontendTypescriptBuilderProject from './implementations/FrontendTypescriptBuilderProject'
import LambdaBuilderProject from './implementations/LambdaBuilderProject'
import MobileJavascriptBuilderProject from './implementations/MobileJavascriptBuilderProject'
import MobileTypescriptBuilderProject from './implementations/MobileTypescriptBuilderProject'

export default function findBuilder(
  answers: IAnswers,
  toolbox: GluegunToolbox
): IBuilderProject | null {
  if (answers.projectKindAnswer === 'Backend') {
    if (answers.projectRuntimeAnswer === 'API') {
      if (answers.backendLanguageAnswer === 'NodeJS') {
        if (answers.nodejsLanguageAnswer === 'Javascript') {
          return new BackendJavascriptBuilderProject(toolbox)
        }
        return new BackendTypescriptBuilderProject(toolbox)
      }

      return new BackendPythonBuilderProject(toolbox)
    }

    return new LambdaBuilderProject(toolbox)
  }

  if (answers.projectKindAnswer === 'Frontend') {
    if (answers.nodejsLanguageAnswer === 'Javascript') {
      return new FrontendJavascriptBuilderProject(toolbox)
    }

    return new FrontendTypescriptBuilderProject(toolbox)
  }

  if (answers.projectKindAnswer === 'Mobile') {
    if (answers.nodejsLanguageAnswer === 'Javascript') {
      return new MobileJavascriptBuilderProject(toolbox)
    }

    return new MobileTypescriptBuilderProject(toolbox)
  }

  return null
}
