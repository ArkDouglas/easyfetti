#!/usr/bin/env node
import chalk from "chalk";
import { exec } from "child_process";
import cliCursor from "cli-cursor";
import fs from "fs";

// Define terminal dimensions and confetti settings
const width = process.stdout.columns;
const confettiHeight = 10; // Define the number of lines confetti will occupy
const colors = [
  chalk.red,
  chalk.green,
  chalk.yellow,
  chalk.blue,
  chalk.magenta,
  chalk.cyan,
];

/**
 * Clears the confetti from the terminal.
 * Uses ANSI escape codes to manipulate terminal cursor and clear text.
 */
function clearConfetti() {
  process.stdout.write("\x1B[?25l"); // Hide cursor
  process.stdout.write("\x1B[s"); // Save cursor position
  process.stdout.write("\x1B[" + confettiHeight + "A"); // Move cursor up to start of confetti

  for (let i = 0; i < confettiHeight; i++) {
    process.stdout.write("\x1B[2K"); // Clear entire line
    process.stdout.write("\x1B[1B"); // Move cursor down one line
  }

  process.stdout.write("\x1B[" + confettiHeight + "A"); // Move cursor back to the start
  process.stdout.write("\x1B[?25h"); // Show cursor
}

/**
 * Draws a single frame of confetti.
 */
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
    process.stdout.write(line);

    if (i < confettiHeight - 1) {
      process.stdout.write("\n"); // Move to the next line only if it's not the last confetti line
    }
  }
}

/**
 * Animates confetti over a specified duration.
 * @param {number} duration - Duration in milliseconds for the confetti animation.
 */
function animateConfetti(duration = 5000) {
  cliCursor.hide();
  const startTime = Date.now();

  const interval = setInterval(() => {
    drawFrame();

    if (Date.now() - startTime > duration) {
      clearInterval(interval);
      cliCursor.show();
      clearConfetti();
      displayMessages(); // Display any buffered messages after animation
    }
  }, 100); // Redraw every 100ms
}

// Message buffering for asynchronous operation outputs
let messageBuffer = [];

/**
 * Installs the react-confetti package using npm.
 * Buffers output messages and resolves upon completion.
 */
async function installReactConfetti() {
  console.log(chalk.yellow("Starting the installation of react-confetti..."));

  return new Promise((resolve, reject) => {
    const child = exec("npm install react-confetti");

    child.stdout.on("data", (data) => messageBuffer.push(data.toString()));
    child.stderr.on("data", (data) => messageBuffer.push(data.toString()));

    child.on("close", (code) => {
      if (code === 0) {
        messageBuffer.push("react-confetti installed successfully!");
        resolve();
      } else {
        messageBuffer.push("Installation failed with code " + code);
        reject(new Error("Installation failed"));
      }
    });
  });
}

/**
 * Displays all messages that have been buffered during asynchronous operations.
 */
function displayMessages() {
  messageBuffer.forEach((msg) => console.log(msg));
  messageBuffer = []; // Clear buffer after displaying messages
}

/**
 * Writes a specified message to a file named "result.txt".
 * @param {string} data - Data to write to the file.
 */
function writeFile(data) {
  fs.writeFile("result.txt", data, "utf8", (err) => {
    if (err) {
      messageBuffer.push("Error writing file: " + err);
    } else {
      messageBuffer.push("File successfully written!");
    }
  });
}

// Main command line argument handling
const args = process.argv.slice(2);
if (args.includes("celebrate")) {
  installReactConfetti()
    .then(() => {
      animateConfetti();
      writeFile("Congratulations! The celebration was a success!");
    })
    .catch((error) => console.error(error));
} else {
  console.log("Type 'npx easyfetti celebrate' to throw confetti!");
}
