// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
import { IConfig } from './iconfig';

export const environment = {
  production: false
};

export const CONFIG: IConfig = {
  'firebaseConfig' : {
    apiKey: 'AIzaSyAMzothQWENfYx_dcMySLdRvsJbmc7xkxo',
    authDomain: 'ntrivia-86e25.firebaseapp.com',
    databaseURL: 'https://ntrivia-86e25.firebaseio.com',
    projectId: 'ntrivia-86e25',
    storageBucket: 'ntrivia-86e25.appspot.com',
    messagingSenderId: '579311413632'
  },
   'functionsUrl': 'https://us-central1-ntrivia-86e25.cloudfunctions.net'
};
