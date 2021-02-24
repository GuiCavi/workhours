import path from "path";
import fs from "fs";
import moment, { Moment } from "moment";
import "moment/locale/pt-br";

const DEFAULT_FORMAT = "YYYY-MM-DD";
const OUTPUT_FORMAT = "L";
const HOUR_OUTPUT_FORMAT = "LT";

const generateRandomTime = (hours: number[]) => {
  const randomHour = hours[Math.floor(Math.random() * 2)];
  let randomMinute = 0;

  if (randomHour === hours[0]) {
    randomMinute = [57, 58, 59][Math.floor(Math.random() * 3)];
  } else if (randomHour === hours[1]) {
    randomMinute = [0, 1, 2, 3][Math.floor(Math.random() * 4)];
  }

  const entryHour = moment(`${randomHour}:${randomMinute}`, "HH:mm");

  return entryHour;
}

const createCSVFile = (lines: string[]) => {
  const dirname = path.join(__dirname, "..", "files");

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }

  fs.writeFileSync(path.join(dirname, `${moment().format("DD-MM")}.csv`), lines.join("\n"));
}

const generateHours = (startDate: Moment, endDate: Moment) => {
  const from = startDate.clone();
  const data = [];

  for (let currentMoment = from; currentMoment.isSameOrBefore(endDate); currentMoment.add(1, "day")) {
    if (currentMoment.isoWeekday() === 6 || currentMoment.isoWeekday() === 7) continue;

    const date = currentMoment.format(OUTPUT_FORMAT);

    const entryHour = generateRandomTime([8, 9]);
    const intervalEntryHour = generateRandomTime([11, 12]);
    const intervalExitHour = generateRandomTime([12, 13]);
    const exitHour = generateRandomTime([17, 18]);

    const csvLine = [
      date,
      entryHour.format(HOUR_OUTPUT_FORMAT),
      intervalEntryHour.format(HOUR_OUTPUT_FORMAT),
      intervalExitHour.format(HOUR_OUTPUT_FORMAT),
      exitHour.format(HOUR_OUTPUT_FORMAT),
    ].join(",")

    data.push(csvLine);
  }

  createCSVFile(data);
}

generateHours(moment("2021-01-25", DEFAULT_FORMAT), moment("2021-02-24", DEFAULT_FORMAT));