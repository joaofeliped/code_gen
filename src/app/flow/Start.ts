import { GluegunToolbox } from 'gluegun'
import IAnswers from './IAnswers'

interface IQuestion {
  type: 'input' | 'select' | 'confirm'
  name: string
  message: string
  choices?: any[]
  next?(answer?: string): IQuestion
  isLast(answer?: string): boolean
}

const askNodejsLanguage: IQuestion = {
  type: 'select',
  name: 'nodejsLanguageAnswer',
  message: 'Javascript or Typescript?',
  choices: ['Javascript', 'Typescript'],
  isLast: () => true,
}

const askBackendLanguage: IQuestion = {
  type: 'select',
  name: 'backendLanguageAnswer',
  message: 'What language do you want?',
  choices: ['NodeJS', 'Python'],
  isLast: () => false,
  next: () => askNodejsLanguage,
}

const askProjectRuntime: IQuestion = {
  type: 'select',
  name: 'projectRuntimeAnswer',
  message: 'What runtime do you want?',
  choices: ['API', 'Lambda'],
  isLast: () => false,
  next: () => askBackendLanguage,
}

const askProjectKind: IQuestion = {
  type: 'select',
  name: 'projectKindAnswer',
  message: 'What kind of project do you want?',
  choices: ['Backend', 'Frontend', 'Mobile'],
  isLast: () => false,
  next: () => askProjectRuntime,
}

const askNameProject: IQuestion = {
  type: 'input',
  name: 'projectNameAnswer',
  message: 'What is the project name?',
  isLast: () => false,
  next: () => askProjectKind,
}

const answer: IAnswers = {}

export default async function start(
  toolbox: GluegunToolbox,
  nextQuestion?: IQuestion
): Promise<IAnswers> {
  const {
    prompt: { ask },
  } = toolbox

  if (!nextQuestion) {
    nextQuestion = askNameProject
  }

  const questionAnswer = await ask(nextQuestion)

  answer[nextQuestion.name] = questionAnswer[nextQuestion.name]

  if (nextQuestion.isLast()) {
    return answer
  }

  nextQuestion = nextQuestion.next(answer[nextQuestion.name])

  return start(toolbox, nextQuestion)
}
