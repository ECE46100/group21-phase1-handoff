#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const install_1 = require("./commands/install");
const analyze_1 = require("./commands/analyze");
const program = new commander_1.Command();
program
    .name("ECE461_Team_Project")
    .version("1.0.0")
    .description("ECE461 Team Project - cli tool for measuring the security metrics of npm packages available on GitHub.");
program
    .command("install")
    .description("Installs the depndencies neededto run the CLI.")
    .action(install_1.install);
program
    .argument("<packageURL>", 'URL of the package on GitHub.')
    .description("Return the security metrics of the package from the provided URL on GitHub.")
    .action(analyze_1.analyze);
program.parse(process.argv);
