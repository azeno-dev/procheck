export interface Database {
  url: string;
}

export interface Constants {
  env: string;
  database: Database;
}

export const Constants: Constants = {
  env: 'dev',
  database: { 
    url: "http://192.168.100.137:6152",    
  }
}