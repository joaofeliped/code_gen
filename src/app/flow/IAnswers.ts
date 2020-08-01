export default interface IAnswers {
  projectNameAnswer?: string
  projectKindAnswer?: 'Backend' | 'Frontend' | 'Mobile'
  projectRuntimeAnswer?: 'API' | 'Lambda'
  backendLanguageAnswer?: 'NodeJS' | 'Python'
  nodejsLanguageAnswer?: 'Javascript' | 'Typescript'
  httpTypeAnswer?: 'GraphQL' | 'Rest'
  useDatabaseAnswer?: boolean
}
