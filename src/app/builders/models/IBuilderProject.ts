import IAnswers from '../../flow/IAnswers'

export default interface IBuilderProject {
  build(answers: IAnswers): Promise<void>
}
