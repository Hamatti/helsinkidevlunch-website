const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const datepicker = require("inquirer-datepicker-prompt");
const { render } = require("squirrelly");
inquirer.registerPrompt("datetime", datepicker);

const database = JSON.parse(
  fs.readFileSync(path.join("data", "events.json"), "utf-8")
);

function formatDate(datetime) {
  const date = new Date(datetime);
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }

  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
}

async function main() {
  const { datetime } = await inquirer.prompt([
    {
      type: "datetime",
      name: "datetime",
      message: "When is the next lunch?",
      format: ["yyyy", "-", "mm", "-", "dd", " ", "HH", ":", "MM"],
      validate: (input) => !!input,
    },
  ]);

  const { location, url } = await inquirer.prompt([
    {
      type: "input",
      name: "location",
      message: "Where does the lunch take place? (hit enter for Bruuveri)",
      default: "Bruuveri",
    },
    {
      type: "input",
      name: "url",
      message: "URL to restaurant's site (hit enter for Bruuveri)",
      default: "https://bruuveri.fi/en",
    },
  ]);

  database.events.push({
    datetime: formatDate(datetime),
    location,
    url,
    updated: new Date().toISOString(),
  });

  fs.writeFileSync(path.join("data", "events.json"), JSON.stringify(database));
  console.log(`Wrote new event ${JSON.stringify({ datetime, location, url })}`);
}

main();
