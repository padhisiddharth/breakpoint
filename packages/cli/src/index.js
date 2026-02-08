#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const program = new commander_1.Command();
console.log(chalk_1.default.cyan(figlet_1.default.textSync('AI Test Engineer', { horizontalLayout: 'full' })));
program
    .version('1.0.0')
    .description('A terminal-first AI-powered testing tool');
program
    .command('init')
    .description('Initialize ai-test-engineer in the current directory')
    .action(() => {
    console.log(chalk_1.default.green('Initializing project configuration...'));
    // TODO: implementation
});
program
    .command('run')
    .description('Run the AI test generation and execution pipeline')
    .option('-p, --path <path>', 'Path to codebase', '.')
    .action((options) => {
    console.log(chalk_1.default.yellow(`Scanning codebase at: ${options.path}`));
    // TODO: implementation
});
program
    .command('report')
    .description('Generate and view test reports')
    .action(() => {
    console.log(chalk_1.default.blue('Generating report...'));
    // TODO: implementation
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map