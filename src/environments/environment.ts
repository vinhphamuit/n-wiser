// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
import { IConfig } from './iconfig';

export const environment = {
  production: false
};

export const CONFIG: IConfig = {
  'firebaseConfig': {
    apiKey: 'AIzaSyAqSJgn64UBZUbc7p7UDKSLOoburAENGDw',
    authDomain: 'rwa-trivia-dev-e57fc.firebaseapp.com',
    databaseURL: 'https://rwa-trivia-dev-e57fc.firebaseio.com',
    projectId: 'rwa-trivia-dev-e57fc',
    storageBucket: 'rwa-trivia-dev-e57fc.appspot.com',
    messagingSenderId: '701588063269'
  },
  'functionsUrl': 'http://localhost:5000/rwa-trivia-dev-e57fc/us-central1'
};
