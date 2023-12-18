import { useMemo } from 'react';

export interface IHintConfig {
  id: number;
  hints: string[];
}

const useHintConfig = (): IHintConfig[] => {
  return useMemo(() => {
    return [];
  }, []);
};

export default useHintConfig;
