function validateNum(input: string, min: number, max: number): boolean {
  const num = +input;
  return num >= min && num <= max && input === num.toString();
}

export default validateNum;
