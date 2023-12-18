import validateNum from 'app/utils/validateNum';

const validatePort = (port: string): boolean => {
  return validateNum(port, 1, 65535);
};

export default validatePort;
