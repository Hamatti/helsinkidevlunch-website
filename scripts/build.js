const Sqrl = require("squirrelly");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const TEMPLATE_DIR = "templates";
const DATA_DIR = "data";
const BUILD_DIR = "build";
const ASSETS_DIR = "assets";

function renderDatetime(datetime) {
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

  return `${day}.${month} ${hours}:${minutes}`;
}

/* INDEX PAGE */
const indexTemplate = fs.readFileSync(
  path.join(TEMPLATE_DIR, "index.html"),
  "utf-8"
);

const { events } = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "events.json"))
);

const newestEvent = events[events.length - 1];

const htmlContext = {
  ...newestEvent,
  datetime: renderDatetime(newestEvent.datetime),
};

const htmlOutput = Sqrl.render(indexTemplate, htmlContext);

fs.writeFileSync(path.join(BUILD_DIR, "index.html"), htmlOutput);
console.log(`HTML built!`);

/* RSS FEED */
const rssTemplate = fs.readFileSync(
  path.join(TEMPLATE_DIR, "feed.xml"),
  "utf-8"
);

events.reverse();
const rssContext = {
  events: events.map((ev) => {
    return {
      ...ev,
      humanDatetime: renderDatetime(ev.datetime),
      uuid: uuidv4(),
    };
  }),
  updatedAt: new Date().toISOString(),
};

const rssOutput = Sqrl.render(rssTemplate, rssContext);

fs.writeFileSync(path.join(BUILD_DIR, "feed.xml"), rssOutput);
console.log(`RSS built`);

fs.copyFileSync(
  path.join(ASSETS_DIR, "main.css"),
  path.join(BUILD_DIR, "main.css")
);
