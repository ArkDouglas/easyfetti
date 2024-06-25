#!/usr/bin/env node

import chalk from "chalk";
import cliCursor from "cli-cursor";
import readline from "readline";

const width = process.stdout.columns;
const height = process.stdout.rows;
const colors = [
  chalk.red,
  chalk.green,
  chalk.yellow,
  chalk.blue,
  chalk.magenta,
  chalk.cyan,
];

function clearScreen() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

function drawFrame() {
  clearScreen();
  for (let i = 0; i < height; i++) {
    let line = "";
    for (let j = 0; j < width; j++) {
      if (Math.random() > 0.98) {
        line += colors[Math.floor(Math.random() * colors.length)]("*");
      } else {
        line += " ";
      }
    }
    console.log(line);
  }
}

function animateConfetti(duration = 5000) {
  cliCursor.hide();
  const startTime = Date.now();

  const interval = setInterval(() => {
    drawFrame();
    if (Date.now() - startTime > duration) {
      clearInterval(interval);
      cliCursor.show();
      clearScreen(); // This will clear the terminal once the animation is complete
      console.log(
        chalk.green("🎉 Celebration complete! Here are your results: 🎉"),
      );
      // Display results or perform other actions here
    }
  }, 100); // Redraw every 100ms
}

// Command handling
const args = process.argv.slice(2);
if (args.includes("celebrate")) {
  animateConfetti();
} else {
  console.log("Type 'npx easy-confetti celebrate' to throw confetti!");
}
