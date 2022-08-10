import { Utilities } from './utilities.mjs';

export const questions = [
  // {
  //   type: 'list',
  //   name: 'template',
  //   message: 'Select your extension template',
  //   choices: [
  //     'simple-js-extension',
  //     'simple-typescript-extension',
  //     'extension-with-react-js',
  //     'extension-with-react-typescript',
  //   ],
  //   validate: input => {
  //     console.log('input', input);
  //     if (input !== 'simple-js-extension') {
  //       return `${input} is coming in future releases, Please select simple-js-extension`;
  //     }
  //     return 'Error here';
  //   },
  // },
  {
    type: 'input',
    name: 'name',
    message: 'Enter Your Project Name',
    default: 'just-another-extension',
    validate: input => {
      if (!input.length) {
        return 'Project Name is required';
      }
      return Utilities.validateAppName(input) || true;
    },
  },
  {
    type: 'input',
    name: 'description',
    message: 'Enter Your Project Description',
    default: 'Chrome extension built with create-chrome-extension',
  },
];

export const isClearDirectory = [
  {
    type: 'confirm',
    name: 'retry',
    message: 'This destination path is not empty you can clear your directory and retry',
  },
];
