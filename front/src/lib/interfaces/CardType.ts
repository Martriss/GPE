export default interface CardType {
  id?: string;
  rulesetId: string;
  name: string;
  nameLower: string;
  front: Face;
  back?: Face;
}

export interface Face {
  cardTypeId: string;
  skin: string;
  properties: FaceProperties[]
}

export interface FaceProperties {
  name: string;
  value: string;
}
