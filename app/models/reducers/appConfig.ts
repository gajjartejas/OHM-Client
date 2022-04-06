export interface IAppConfigState {
  path: string;
  port: number;
  refreshInterval: number;
  username: string | null;
  password: string | null;
}
