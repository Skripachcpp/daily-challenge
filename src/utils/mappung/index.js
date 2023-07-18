import { xml2json, js2xml } from "xml-js";
import format from "xml-formatter";

// --

function to00(value) {
  if (value > 9) return value.toString();
  if (value <= 0) return "0" + (-value).toString();

  return "0" + value.toString();
}

function dateDayToText(value) {
  switch (value) {
    case 1:
      return "пн";
    case 2:
      return "вт";
    case 3:
      return "ср";
    case 4:
      return "чт";
    case 5:
      return "пт";
    case 6:
      return "сб";
    case 0:
      return "вс";
  }

  return "";
}

// --

export async function xmlNormalize(fileText) {
  let rx = "<day date=.*? (.*?)>";
  let replace = fileText.match(new RegExp(rx, "g")).map((a) => {
    let origin = a;
    let matched = origin.match(new RegExp(rx));
    let target = origin.replace(matched[1] + ">", `week="${matched[1]}">`);

    return { target, origin };
  });

  for (let i = 0; i < replace.length; i++) {
    const { target, origin } = replace[i];
    fileText = fileText.replace(origin, target);
  }

  return fileText;
}

export async function xmlToJson(fileText) {
  let fileNormalizeText = await xmlNormalize(fileText);

  let fileJson = JSON.parse(xml2json(`<root>${fileNormalizeText}</root>`))
    .elements[0].elements;

  return fileJson;
}

export async function dailyChallenge(fileText) {
  let elements = await xmlToJson(fileText);

  let days = [];
  for (let element of elements) {
    let day = { ...element.attributes };

    day.tags = element.elements.map((elm) => ({
      tag: elm.name,
      ...(elm.attributes || {}),
      text: elm.elements[0].text,
    }));

    days.push(day);
  }

  return days;
}

export async function fileToJson(text) {
  if (!text) {
    let now = new Date();

    let date = `${to00(now.getDate())}.${to00(
      now.getMonth() + 1
    )}.${now.getFullYear()}`;

    let week = dateDayToText(now.getDay());
    let lastDay = { date, week };

    if (!lastDay.tags) lastDay.tags = [];

    return [lastDay];
  }

  return await dailyChallenge(text);
}

// -----------------------------------

export async function jsonToFile(dailyChallengeData) {
  let target = [];

  for (let day of dailyChallengeData) {
    let elements = [];

    for (let tag of day.tags) {
      let element = {
        type: "element",
        name: tag.tag,
        attributes: {},
        elements: [
          {
            type: "text",
            text: tag.text,
          },
        ],
      };

      if (tag.time) element.attributes.time = tag.time;
      if (tag.fr) element.attributes.fr = tag.fr;
      if (tag.to) element.attributes.to = tag.to;

      if (Object.keys(element.attributes).length <= 0) {
        delete element.attributes;
      }

      elements.push(element);
    }

    target.push({
      type: "element",
      name: "day",
      attributes: {
        date: day.date,
        week: day.week,
      },
      elements: elements,
    });
  }

  let xml = js2xml({
    elements: [
      {
        type: "element",
        name: "_root",
        elements: target,
      },
    ],
  });

  xml = format(xml, {
    indentation: "  ",
    collapseContent: true,
    lineSeparator: "\n",
  });

  xml = xml.replace("<_root>", "");
  xml = xml.replace("</_root>", "");
  xml = xml.replace(/^ {2}/g, "");

  let lines = xml.match(/.*/g);
  lines = lines.map((line) => {
    line.replace(/^ {2}/, "");
  });

  return lines.filter((a) => a).join("\n");
}
