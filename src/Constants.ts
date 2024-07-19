export interface Database {
  url: string;
}

export interface Constants {
  env: string;
  database: Database;
}

export const Constants: Constants = {
  env: import.meta.env.NODE_ENV || 'dev',
  database: { 
    // url: "http://192.168.100.137:6152",    
    url: "https://awb-api-checker.azeno.dev",    
    // url: import.meta.env.VUE_APP_API_AUTH ?? "http://192.168.100.137:6152/",
  }
}