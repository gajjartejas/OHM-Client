const validatePort = (port: string): boolean => {
  return validateNum(port, 1, 65535);
};

function validateNum(input: string, min: number, max: number): boolean {
  var num = +input;
  return num >= min && num <= max && input === num.toString();
}

export default validatePort;
