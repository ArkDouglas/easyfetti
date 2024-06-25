#!/usr/bin/env node

import chalk from "chalk";
import cliCursor from "cli-cursor";

const width = process.stdout.columns;
const confettiHeight = 10; // Number of lines to use for confetti
const colors = [
  chalk.red,
  chalk.green,
  chalk.yellow,
  chalk.blue,
  chalk.magenta,
  chalk.cyan,
];

function clearConfetti() {
  process.stdout.write("\x1B[?25l"); // Hide cursor
  process.stdout.write("\x1B[s"); // Save cursor position
  process.stdout.write("\x1B[" + confettiHeight + "A"); // Move cursor up to start of confetti
  for (let i = 0; i < confettiHeight; i++) {
    process.stdout.write("\x1B[2K"); // Clear entire line
    process.stdout.write("\x1B[1B"); // Move cursor down one line
  }
  process.stdout.write("\x1B[" + confettiHeight + "A"); // Move cursor back up to the start of confetti
  // Restore cursor position
  process.stdout.write("\x1B[?25h"); // Show cursor
}

function drawFrame() {
  process.stdout.write("\x1B[" + confettiHeight + "A"); // Move cursor up to start of confetti
  for (let i = 0; i < confettiHeight; i++) {
    process.stdout.write("\x1B[2K"); // Clear entire line
    let line = "";
    for (let j = 0; j < width; j++) {
      line +=
        Math.random() > 0.98
          ? colors[Math.floor(Math.random() * colors.length)]("*")
          : " ";
    }
    process.stdout.write(line + "\n");
  }
}

function animateConfetti(duration = 5000) {
  cliCursor.hide();
  const startTime = Date.now();
  process.stdout.write("\x1B[?25l"); // Hide cursor

  const interval = setInterval(() => {
    drawFrame();
    if (Date.now() - startTime > duration) {
      clearInterval(interval);
      cliCursor.show();
      clearConfetti(); // Clear the confetti area
      process.stdout.write(
        chalk.green("\n🎉 Celebration complete! Here are your results: 🎉\n"),
      );
    }
  }, 100); // Redraw every 100ms
}

const args = process.argv.slice(2);
if (args.includes("celebrate")) {
  animateConfetti();
} else {
  console.log("Type 'npx easy-confetti celebrate' to throw confetti!");
}
