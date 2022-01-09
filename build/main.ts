#!/usr/bin/env node
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import YAML from "yaml";


let [, , projectsPath = 'projects', outputFile = 'projects.ts'] = process.argv;

const cwd = process.cwd();
const importBack = '../'.repeat(outputFile.split('/').length - 1);
const oldProjectPath = projectsPath;
const importProject = (project = '') => join(importBack, oldProjectPath, project);
projectsPath = join(cwd, projectsPath);
outputFile = join(cwd, outputFile);

console.log('==] Find projects...');

async function main() {
  const projects = await readdir(projectsPath);
  const sourceFileData = await readFile(outputFile, 'utf-8');
  const testIndex = (e: string) => /\/\*([^\*]+)\*\//.test(e);
  const sourceRows = sourceFileData.split(/\n/);
  const preIndex = sourceRows.findIndex(testIndex);
  const preRows = sourceRows.splice(0, preIndex + 1);
  const postIndex = sourceRows.findIndex(testIndex);
  const postRows = sourceRows.splice(postIndex);

  const projectsDefinations = await Promise.all(
    projects
      .map(
        async project => {
          console.log(`==] Input project "${project}"`);
          const projectPath = join(projectsPath, project);
          const manifest = await readFile(join(projectPath, 'manifest.yml'), 'utf-8');
          const manifestObject = YAML.parse(manifest);
          const { readme = null, screenshots = null, ...info } = manifestObject;
          const readmeOutput = {};
          const importPath = importProject(project);
          const screenshotsOutput = [];

          if (readme) {
            if (typeof readme != 'object')
              throw new Error('Property readme need object!');

            for (const lang in readme)
              readmeOutput[lang] = `{{ import('${join(importPath, readme[lang])}?raw') }}`;
          }

          if (screenshots) {
            if (typeof screenshots != 'string')
              throw new Error('Property screnshots need string!');

            const screenshotsDirectory = join(projectPath, screenshots);
            const screenshotsFiles = await readdir(screenshotsDirectory);
            for (const file of screenshotsFiles) {
              screenshotsOutput.push({
                name: file,
                value: `{{ import('${join(importPath, screenshots, file)}?url') }}`
              });
            }
          }

          return JSON.stringify({
            id: project,
            ...info,
            screenshots: screenshotsOutput.length ? screenshotsOutput : null,
            readme: readmeOutput
          }, null, 2)
            .replace(/("\{\{\s+|\s+\}\}")/g, '')
            .replace(/"([^"]+)"\:/g, '$1:')
            .replace(/"/g, `'`)
            .replace(/null/g, 'undefined');
        }
      )
      .map(
        async (promise, index) => {
          return promise.catch(error => {
            console.warn(`==] Error compile "${projects[index]}" of "${error?.messate ?? error}"`);
          });
        }
      )
  );

  const prevSpaces = /(\s+)/.exec(preRows[preRows.length - 1])[1].length;
  const spaces = ' '.repeat(prevSpaces);
  const outputDefinations = projectsDefinations.filter(e => (e || '').trim()).join(',\n\n').split(/\n/).map(e => spaces + e);
  const outputFileData = [...preRows, ...outputDefinations, ...postRows].join('\n');
  await writeFile(outputFile, outputFileData);
}

main().catch(console.error);