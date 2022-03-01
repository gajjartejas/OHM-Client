export interface ICardValueViewModel {
  id: number;
  name: string;
  currentValue: string;
  minValue: string;
  maxValue: string;
}

export interface ICardViewModel {
  id: number;
  values: ICardValueViewModel[] | null;
  title: string;
  sections: ICardViewModel[] | null;
}
