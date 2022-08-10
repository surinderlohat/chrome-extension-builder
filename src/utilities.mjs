import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import validateProjectName from 'validate-npm-package-name';
import { isClearDirectory } from './options.mjs';

const formatAppName = name => {
  return name
    .replace(/-/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(word => word.substring(0, 1).toUpperCase() + word.substring(1))
    .join(' ');
};

// display logs in debug mode only
const debugLogs = (type, message) => process.env.IS_DEBUG && console.log(type, message);

// if directory not empty then wait for your input
const isDirectoryEmpty = async destinationPath => {
  const files = await fs.readdir(destinationPath);
  if (files.length) {
    const answers = await inquirer.prompt(isClearDirectory);
    if (answers.retry) {
      isDirectoryEmpty(destinationPath);
    }
  }
};

const validateAppName = name => {
  const validationResult = validateProjectName(name);
  if (validationResult.validForNewPackages) {
    return true;
  }
  // Show errors in debug mode
  if (process.env.IS_DEBUG) {
    console.log('Hii from DEBUGG mode');
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
  }
  if (validationResult.warnings?.length) {
    return validationResult.warnings[0] || '';
  }
  return validationResult.errors[0] || '';
};

const printValidationResults = results => {
  if (typeof results !== 'undefined') {
    results.forEach(error => console.error(chalk.red(`  *  ${error}`)));
  }
};

// Exit from the process if no project name is provided
const validateProject = (program, projectName) => {
  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<extension-name>')}`);
    console.log();
    console.log('For example:');
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-extension-name')}`);
    console.log();
    console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
    process.exit(1);
  }
};

export const Utilities = {
  debugLogs,
  validateProject,
  formatAppName,
  validateAppName,
  printValidationResults,
  isDirectoryEmpty,
};
