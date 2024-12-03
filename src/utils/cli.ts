#!/usr/bin/env node

import { Command } from "commander";
import { install } from "../commands/install.js";
import { analyze } from "../commands/analyze.js";

const program = new Command();

program
    .name("ECE461_Team_Project")
    .version("1.0.0")
    .description("ECE461 Team Project - cli tool for measuring the security metrics of npm packages available on GitHub.");

program
    .command("install")
    .description("Installs the dependencies needed to run the CLI.")
    .action(install);

program
    .argument("<packageURL>", 'URL of the package on GitHub.')
    .description("Return the security metrics of the package from the provided URL on GitHub.")
    // .action(analyze);

export { program };