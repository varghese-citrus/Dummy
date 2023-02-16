// deno-lint-ignore-file
import { Page, Logger, XLSX } from "../deps-test.ts";

export async function getRandomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function startLogger() {
  const logger = new Logger();
  const logStatus = Deno.env.get("LOG");
  if (logStatus == "disable") {
    logger.disableConsole();
    return logger;
  } else if (logStatus == "enable") {
    logger.enableConsole();
    return logger;
  } else {
    return logger;
  }
}

export async function dragAndDrop(
  page: Page,
  originSelector: any,
  destinationSelector: any
) {
  const origin: any = await page.waitForSelector(originSelector);
  const destination: any = await page.waitForSelector(destinationSelector);
  const ob = await origin?.boundingBox();
  const db = await destination?.boundingBox();
  await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2);
  await page.waitForTimeout(5000);
  await page.mouse.down();
  await page.waitForTimeout(5000);
  await page.mouse.move(db.x + db.width / 2, db.y + db.height / 2);
  await page.waitForTimeout(5000);
  await page.mouse.up();
  await page.waitForTimeout(5000);
}

export async function getData(sheetName: string) {
  try {
    const workbook = await XLSX.readFile("../testdata/suntrup.xlsx");
    //const first_worksheet = await workbook.Sheets[workbook.SheetNames[0]];
    //const sheetNames = workbook.SheetNames;
    const first_worksheet = await workbook.Sheets[`${sheetName}`];
    const data: any = XLSX.utils.sheet_to_row_object_array(first_worksheet);
    return data;
  } catch (err) {
    console.error(err);
  }
}
export async function digits(num: number, count = 0): Promise<any> {
  if (num) {
    return digits(Math.floor(num / 10), ++count);
  }
  return count;
}
