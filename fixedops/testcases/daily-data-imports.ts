import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { StoreSettingSelectors as ss } from "../selectors/store-setting.ts";
import { DailyDataImportsSelectors as ds } from "../selectors/daily-data-imports.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsDailyDataImportsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0040] ${site.name} FixedOps Daily Data Imports Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0040",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await dailyDataImportsPageTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Daily Data Imports Page Test";
          execMetrics.labels.object.finalizeOn = new Date();
          metrics.record(execMetrics);
          await metrics.persistUitMetrics(metrics);
          throw error;
        }
        metrics.record(execMetrics);
        execMetrics.labels.object.finalizeOn = new Date();
        await metrics.persistUitMetrics(metrics);
      },
      sanitizeOps: false,
      sanitizeResources: false,
    });
  });
}

async function dailyDataImportsPageTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(10000);

    const role = Deno.env.get("ROLE");

    if (role?.includes("admin")) {
      await page.waitForSelector(ss.armatusAdminLink);
      await page.click(ss.armatusAdminLink);
      logger.info("armatus admin expand collapse link clicked");
      await page.waitForTimeout(5000);

      await page.waitForSelector(ds.dailyDataImportsLink);
      await page.click(ds.dailyDataImportsLink);
      await navigationPromise;
      await page.waitForTimeout(15000);
      logger.info("daily data imports link clicked");

      const title = await page.title();

      if (title == "Daily Data Imports") {
        logger.info("daily data imports title verify success");
        await page.waitForTimeout(2000);
        const heading = await page.$x(ds.dailyDataImportsHeading);
        const pageHeading = await (
          await heading[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        if (pageHeading == "Daily Data Imports") {
          logger.info("daily data imports heading verify success");

          await page
            .waitForXPath(ds.selectDateParagraph, {
              visible: true,
              timeout: 2000,
            })
            .then(() => {
              logger.info("select date range mentioning visible properly");
            })
            .catch(() => {
              logger.error("select date range mentioning not visible properly");
              errors.push("select date range mentioning not visible properly");
            });
          await page.waitForTimeout(2000);
          await page.waitForSelector(ds.datePicker);
          await page.click(ds.datePicker);
          await page.waitForTimeout(4000);

          const monthYear = await page.$eval(
            ds.datePickerMonthYear,
            (element) => element.textContent
          );

          const date = new Date();
          const cusMonthYear =
            date.toLocaleString("default", { month: "long" }) +
            date.getFullYear();

          if (
            monthYear.toString().replace(/\s/g, "") ==
            cusMonthYear.toString().replace(/\s/g, "")
          ) {
            logger.info("month and year verified success");
            await page.waitForTimeout(2000);

            let num;
            let datePick;
            let flag = 0;

            let i = 1;
            do {
              num = await getRandomNumberBetween(1, 31);
              await page.waitForTimeout(2000);

              datePick = await page.evaluate(
                (el) => el.getAttribute("aria-selected"),
                (
                  await page.$x(ds.date(Number(num)))
                )[0]
              );

              await page.waitForTimeout(2000);

              if (datePick.toString().match("false")) {
                flag = 1;
                const dateBtn = await page.$x(ds.date(Number(num)));
                await dateBtn[0].click();
                logger.info(`date ${num} picked`);
                await page.waitForTimeout(10000);
                const dataTable = await page.$eval(ds.dataTable, (elem) => {
                  return elem.style.display !== "none";
                });
                dataTable
                  ? logger.info("data table visible properly")
                  : [
                      logger.error("data table not visible properly"),
                      errors.push("data table not visible properly"),
                    ];
              } else {
                i++;
              }
              if (flag == 1 || i == 31) {
                break;
              }
            } while (i > 0);
          } else {
            logger.error("month and year verified failed");
            errors.push("month and year verified failed");
          }
        } else {
          logger.error("daily data imports heading verify failed");
          errors.push("daily data imports heading verify failed");
        }
      } else {
        logger.error("daily data imports title verify failed");
        errors.push("daily data imports title verify failed");
      }
    } else {
      logger.warn(
        "role is not admin!,please provide admin as role for further testing"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Daily Data Imports Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDailyDataImportsTest();
