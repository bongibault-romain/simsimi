declare namespace NodeJS {
    export interface ProcessEnv {
      TOKEN: string;
      MAX_LENGTH: string | undefined;
      HOST: string;
      USER: string;
      PASSWORD: string;
      DATABASE: string;
    }
  }