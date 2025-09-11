export default interface CardTypeType {
  id?: string;
  name: string;
  rulesetId: string;
  properties: PropertiesCardTypeType[]
}

export interface PropertiesCardTypeType {
  name: string;
  acceptableValue: string;
  isOptional: boolean
}
