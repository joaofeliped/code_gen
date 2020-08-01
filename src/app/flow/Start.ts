import { GluegunToolbox } from 'gluegun'
import IAnswers from './IAnswers'
import findBuilder from '../builders'

interface IQuestion {
  type: 'input' | 'select' | 'confirm'
  name: string
  message: string
  initial?: boolean
  choices?: any[]
  isLast(answer?: IAnswers): boolean
  next?(answer?: IAnswers): IQuestion
}

const askUseDatabase: IQuestion = {
  type: 'confirm',
  name: 'useDatabaseAnswer',
  message: 'Are you going to use database?',
  initial: true,
  isLast: () => true,
  next: () => {
    return null
  },
}

const askHttpType: IQuestion = {
  type: 'select',
  name: 'httpTypeAnswer',
  message: 'GraphQL or Rest?',
  choices: ['GraphQL', 'Rest'],
  isLast: () => false,
  next: () => {
    return askUseDatabase
  },
}

const askNodejsLanguage: IQuestion = {
  type: 'select',
  name: 'nodejsLanguageAnswer',
  message: 'Javascript or Typescript?',
  choices: ['Javascript', 'Typescript'],
  isLast: (answer) => {
    return answer.nodejsLanguageAnswer === 'Typescript'
  },
  next: () => {
    return askHttpType
  },
}

const askBackendLanguage: IQuestion = {
  type: 'select',
  name: 'backendLanguageAnswer',
  message: 'What language do you want?',
  choices: ['NodeJS', 'Python'],
  isLast: (answer) => {
    return answer[askBackendLanguage.name] === 'Python'
  },
  next: () => {
    return askNodejsLanguage
  },
}

const askProjectRuntime: IQuestion = {
  type: 'select',
  name: 'projectRuntimeAnswer',
  message: 'What runtime do you want?',
  choices: ['API', 'Lambda'],
  isLast: (answer) => {
    return answer[askProjectRuntime.name] === 'Lambda'
  },
  next: () => {
    return askBackendLanguage
  },
}

const askProjectKind: IQuestion = {
  type: 'select',
  name: 'projectKindAnswer',
  message: 'What kind of project do you want?',
  choices: ['Backend', 'Frontend', 'Mobile'],
  isLast: (answer) => {
    return (
      answer.projectKindAnswer === 'Frontend' ||
      answer.projectKindAnswer === 'Mobile'
    )
  },
  next: (answer) => {
    if (answer[askProjectKind.name] === 'Backend') {
      return askProjectRuntime
    }

    return askNodejsLanguage
  },
}

export const askNameProject: IQuestion = {
  type: 'input',
  name: 'projectNameAnswer',
  message: 'What is the project name?',
  isLast: () => false,
  next: () => askProjectKind,
}

const answers: IAnswers = {}

export default async function start(
  toolbox: GluegunToolbox,
  nextQuestion: IQuestion
): Promise<void> {
  const {
    print: { spin },
    prompt: { ask },
  } = toolbox

  const questionAnswer = await ask(nextQuestion)

  answers[nextQuestion.name] = questionAnswer[nextQuestion.name]

  if (nextQuestion.isLast(answers)) {
    const builder = findBuilder(answers, toolbox)

    const spinner = spin('Generating your project. Get ready to rock')
    try {
      await builder.build(answers)
      spinner.succeed('Yeah, your project is ready. Enjoy your adventure')
    } catch (error) {
      spinner.fail('Oh No. Something went wrong, contact your team to help you')
    }

    return
  }

  nextQuestion = nextQuestion.next(answers)

  start(toolbox, nextQuestion)
}
