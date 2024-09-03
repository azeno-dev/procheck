export interface Database {
  url: string;
}

export interface Email {
  api: string;
  transporter: string;
  form: string;
  token: string;
}

export interface Sameday {
  api: string;
  pref: string;
}


export interface Constants {
  env: string;
  database: Database;
  email: Email;
  sameday: Sameday;
  primaryPage: string;
  pageStart: string;
}

export const Constants: Constants = {
  env: import.meta.env.NODE_ENV || 'dev',
  database: { 
    // url: "http://192.168.100.137:6152",    
    url: "https://awb-api-checker.azeno.dev",    
    // url: import.meta.env.VUE_APP_API_AUTH ?? "http://192.168.100.137:6152/",
  },
  email: {
    api: "https://email-api.azeno.dev",
    transporter: "smtp_azeno_contact",
    form: "contact@azeno.ro",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkF6ZW5vIiwiaWF0IjoxNTE2MjM5MDIyfQ.8v_AbV5f_vJzIX-cj9IPXH4AdyqxIm6yOJGiAJqO5EQ"
  },
  sameday: {
    api: "https://api.sameday.ro",
    pref: "api",
  },
  primaryPage: "/integrations/import",
  pageStart: "/integrations",
}