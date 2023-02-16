// deno-lint-ignore-file no-explicit-any
import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { partswtyratesSelectors as pwrs } from "../selectors/parts_wtyrates.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpspartswtyratesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0150] ${site.name} Parts wty rates Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0150",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await parts_wtyrates_Test(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Login Page Test";
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

async function parts_wtyrates_Test(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(8000);
    const role = Deno.env.get("ROLE");
    if (role?.includes("admin")) {
      await page.waitForTimeout(3000);
      await page.waitForSelector(pwrs.Armatus_admin);
      await page.click(pwrs.Armatus_admin);
      logger.info("Armatus admin clicked");
      await page.waitForTimeout(5000);
      await page.waitForSelector(pwrs.Parts_wtyrates);
      await page.click(pwrs.Parts_wtyrates);
      logger.info("Parts_wtyrates Menu clicked");
      await navigationPromise;
      await page.waitForTimeout(15000);
      const actual_title = await page.title();
      logger.info(actual_title);
      if (actual_title == "WarrantyRates Parts") {
        logger.info("Warranty Rates Parts  title is verified");
        const H_text = await page.$x(pwrs.heading_text);
        const Heading_text_displayed: string = await (
          await H_text[0].getProperty("textContent")
        ).jsonValue();
        if (Heading_text_displayed.includes("Warranty Rates Parts")) {
          logger.info("Warranty Rates Labor verify success");
          await page.waitForTimeout(2000);
          await page.waitForSelector(pwrs.select_month_from_list);
          await page.click(pwrs.select_month_from_list);
          await page.waitForTimeout(5000);
          const num = await getRandomNumberBetween(1, 33);
          const _monthMl = await page.$x(pwrs.month(num));
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
          const datePicker = await page.waitForSelector(pwrs.datePicker, {
            visible: true,
            timeout: 4000,
          });

          if (datePicker != null) {
            logger.info("date picker visible properly");
            await page.waitForTimeout(15000);
            const monthRangeStart: any = await page.$eval(
              pwrs.monthRangeStart,
              (element) => element.getAttribute("value")
            );
            await page.waitForTimeout(5000);
            const monthRangeEnd: any = await page.$eval(
              pwrs.monthRangeEnd,
              (element) => element.getAttribute("value")
            );
            await page.waitForTimeout(5000);
            const m = monthsArr.filter((obj) => {
              if (obj.month == month.split("-")[0]) {
                return obj;
              }
            });
            if (monthRangeStart == m[0].id && monthRangeEnd == m[0].id) {
              logger.info("month start and end range verify success");
              await page.waitForTimeout(2000);
              const mStartXpath = await page.$x(pwrs.monthStartRange);
              await mStartXpath[0].click();
              await page.waitForTimeout(4000);
              let num = await getRandomNumberBetween(10, 15);
              let dayXpath = await page.$x(pwrs.dayRange(num));
              await dayXpath[0].click();
              await page.waitForTimeout(4000);
              logger.info("month start date selected");
              const mEndXpath = await page.$x(pwrs.monthEndRange);
              await mEndXpath[0].click();
              await page.waitForTimeout(4000);
              num = await getRandomNumberBetween(20, 25);
              dayXpath = await page.$x(pwrs.dayRange(num));
              await dayXpath[0].click();
              await page.waitForTimeout(4000);
              logger.info("month end date selected");
              const applyBtn = await page.$x(pwrs.applyBtn);
              await applyBtn[0].click();
              await page.waitForTimeout(20000);
              logger.info("apply button clicked");
              await page
                .$eval(pwrs.dataTab, (elem) => {
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
        logger.error("Warranty Rates Parts title is failed");
        errors.push("Warranty Rates Parts title is failed");
      }
    } else {
      logger.warn(
        "role is not admin,please provide admin as role for further testing"
      );
    }
    ts.assert(
      errors.length == 0,
      `Errors in parts wty rates Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpspartswtyratesTest();
