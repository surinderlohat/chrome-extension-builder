#!/usr/bin/env node
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { fileURLToPath } from 'node:url';
import { questions } from './options.mjs';
import { Utilities } from './utilities.mjs';

// Setup Programs
const program = new Command();

program
  .command('create-app')
  .description('CLI to Build Chrome Extensions utilities')
  .version('1.0')
  .usage(`${chalk.green('<extension-name>')} [options]`)
  .option('--debug', 'Debug App for errors details')
  .action(async options => {
    process.env.IS_DEBUG = options.debug;
    console.log(program.description());
    console.log(chalk.green('Welcome to create-chrome-extension a Simple CLI to create your chrome extensions'));
    // Ask Questions from User
    const answers = await inquirer.prompt(questions);
    console.log('---------------------------------------------');
    try {
      const __filename = path.dirname(fileURLToPath(import.meta.url));
      const destinationPath = path.resolve(process.cwd(), answers.name);
      const rootPath = path.resolve(__filename, 'templates');
      Utilities.debugLogs('rootPath', rootPath);
      Utilities.debugLogs('destinationPath', destinationPath);
      const isExist = await fs.pathExists(destinationPath);
      Utilities.debugLogs('is files path exist', isExist);

      if (isExist) {
        const message = `Folder with name ${answers.name} already exist try to use different name or remove this folder and try again!`;
        console.log(chalk.red(message));
        process.exit(1);
      }
      // const files = await fs.readdir(destinationPath);
      // if (files.length) {
      //   console.log(files);
      //   console.log(chalk.red('This destination path is not empty you can clear your directory and try again!'));
      //   process.exit(1);
      // }
      console.log(chalk.yellow('Creating your extension app....'));
      // copy template files from source to destination
      // TODO: Enable other options in upcoming releases
      const template = answers.template || 'simple-js-extension';
      fs.copySync(path.resolve(rootPath, template), path.resolve(destinationPath));
      fs.copySync(path.resolve(rootPath, 'images'), path.resolve(destinationPath, 'images'));

      console.log('Update manifest file', destinationPath);
      // read template file and update the information
      const file = await fs.readJSON(path.resolve(destinationPath, 'manifest.json'));
      const newFile = Object.assign(file, {
        name: answers.name,
        description: answers.description,
      });

      // Create package file in project directory
      await fs.writeFile(path.join(destinationPath, 'manifest.json'), JSON.stringify(newFile, null, 2));

      console.log(chalk.green('Your extension app created successfully! Happy coding. :)'));
      console.log(chalk.blue('Please show some support by giving start to this repo'));
      console.log(chalk.green('https://github.com/surinderlohat/create-chrome-extension.git'));
    } catch (error) {
      console.log('file', error);
    }
  })
  .on('--help', () => {
    console.log(`Only ${chalk.green('<extension-name>')} is required.`);
  })
  .on('error', () => {
    console.log(chalk.red('Some error happen'));
  });

program.parse(process.argv);
