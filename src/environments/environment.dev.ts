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
    apiKey: 'AIzaSyAMzothQWENfYx_dcMySLdRvsJbmc7xkxo',
    authDomain: 'ntrivia-86e25.firebaseapp.com',
    databaseURL: 'https://ntrivia-86e25.firebaseio.com',
    projectId: 'ntrivia-86e25',
    storageBucket: 'ntrivia-86e25.appspot.com',
    messagingSenderId: '579311413632'
  },
  'functionsUrl': 'https://us-central1-rwa-trivia-dev-e57fc.cloudfunctions.net/'
};
