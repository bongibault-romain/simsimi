declare namespace NodeJS {
    export interface ProcessEnv {
      TOKEN: string;
      MAX_LENGTH: string | undefined;
    }
  }