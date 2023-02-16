import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { laborwtyratesSelectors as lwrs } from "../selectors/labor_wtyrates.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsLaborWtyRatesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0076] ${site.name} Labor Warranty Rates Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0076",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWtyRatesTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Labor Warranty Rates Test";
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
async function laborWtyRatesTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(4000);

    const role = Deno.env.get("ROLE");
    if (role?.includes("admin")) {
      await page.waitForTimeout(3000);

      await page.waitForSelector(lwrs.Armatus_admin);
      await page.click(lwrs.Armatus_admin);
      logger.info("Armatus admin clicked");
      await page.waitForTimeout(5000);
      await page.waitForSelector(lwrs.Labor_wtyrates);
      await page.click(lwrs.Labor_wtyrates);
      logger.info("Labor_wtyrates Menu clicked");
      await navigationPromise;
      await page.waitForTimeout(15000);
      const actual_title = await page.title();

      if (actual_title == "Warranty Rates Labor") {
        logger.info("Labor_wtyrates page is visible!!!");

        const H_text = await page.$x(lwrs.heading_text);
        const Heading_text_displayed: string = await (
          await H_text[0].getProperty("innerText")
        ).jsonValue();
        await page.waitForTimeout(2000);

        if (Heading_text_displayed.includes("Warranty Rates Labor")) {
          logger.info("Warranty Rates Labor verify success");
          await page.waitForTimeout(2000);
          await page.waitForSelector(lwrs.select_month_from_list);
          await page.click(lwrs.select_month_from_list);
          await page.waitForTimeout(5000);

          const num = await getRandomNumberBetween(1, 33);

          const _monthMl = await page.$x(lwrs.month(num));
          await _monthMl[0].click();
          await page.waitForTimeout(4000);

          const month: string = await (
            await _monthMl[0].getProperty("textContent")
          ).jsonValue();

          const monthsArr = [
            { id: 1, month: "Jan" },
            { id: 2, month: "Feb" },
            { id: 3, month: "Mar" },
            { id: 4, month: "Apr" },
            { id: 5, month: "May" },
            { id: 6, month: "Jun" },
            { id: 7, month: "Jul" },
            { id: 8, month: "Aug" },
            { id: 9, month: "Sep" },
            { id: 10, month: "Oct" },
            { id: 11, month: "Nov" },
            { id: 12, month: "Dec" },
          ];

          const datePicker = await page.$eval(lwrs.datePicker, (elem) => {
            return elem.style.display !== "none";
          });

          if (datePicker) {
            logger.info("date picker visible properly");

            const monthRangeStartXpath = await page.$x(lwrs.monthRangeStart);
            const monthRangeStart = await (
              await monthRangeStartXpath[0].getProperty("value")
            ).jsonValue();

            const monthRangeEndXpath = await page.$x(lwrs.monthRangeEnd);
            const monthRangeEnd = await (
              await monthRangeEndXpath[0].getProperty("value")
            ).jsonValue();

            const m = monthsArr.filter((obj) => {
              if (obj.month == month.split("-")[0]) {
                return obj;
              }
            });

            if (monthRangeStart == m[0].id && monthRangeEnd == m[0].id) {
              logger.info("month start and end range verify success");
              await page.waitForTimeout(2000);

              const mStartXpath = await page.$x(lwrs.monthStartRange);
              await mStartXpath[0].click();
              await page.waitForTimeout(4000);

              let num = await getRandomNumberBetween(10, 15);
              let dayXpath = await page.$x(lwrs.dayRange(num));
              await dayXpath[0].click();
              await page.waitForTimeout(4000);
              logger.info("month start date selected");

              const mEndXpath = await page.$x(lwrs.monthEndRange);
              await mEndXpath[0].click();
              await page.waitForTimeout(4000);

              num = await getRandomNumberBetween(20, 25);
              dayXpath = await page.$x(lwrs.dayRange(num));
              await dayXpath[0].click();
              await page.waitForTimeout(4000);
              logger.info("month end date selected");

              const applyBtn = await page.$x(lwrs.applyBtn);
              await applyBtn[0].click();
              await page.waitForTimeout(20000);
              logger.info("apply button clicked");

              await page
                .$eval(lwrs.dataTab, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info("data table display properly");
                })
                .catch(() => {
                  logger.error("data table not display properly");
                  errors.push("data table not display properly");
                });
              await page.waitForTimeout(2000);
            } else {
              logger.error("month start and end range verify failed");
              errors.push("month start and end range verify failed");
            }
          } else {
            logger.error("date picker not visible properly");
            errors.push("date picker not visible properly");
          }
        } else {
          logger.error("labor wty heading verify failed");
          errors.push("labor wty heading verify failed");
        }
      } else {
        logger.error("labor wty rates page  is not available!!!");
        errors.push("labor wty rates page  is not available!!!");
      }
    } else {
      logger.warn(
        "role is not admin,please provide admin as role for further testing"
      );
    }
    ts.assert(
      errors.length == 0,
      `Errors in labor wty rates Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWtyRatesTest();
