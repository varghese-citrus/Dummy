import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { EditHistorySelectors as es } from "../selectors/edit-history.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsUserLoginHistoryTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Edit History Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "DEMO-TEST",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await userLoginHistoryPageTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Edit History Page Test";
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

async function userLoginHistoryPageTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    const role = Deno.env.get("ROLE");
    if (role?.includes("admin")) {
      await page.waitForSelector(es.armatusLink);
      await page.click(es.armatusLink);
      await page.waitForTimeout(5000);

      await page.waitForSelector(es.editBtn);
      await page.click(es.editBtn);
      await navigationPromise;
      await page.waitForTimeout(15000);

      const elements = [
        es.editHistoryHeading,
        es.datePicker,
        es.HistoryFor,
        es.applyBtn,
        es.resetBtn,
        es.downloadBtn,
      ];
      const elementNames = [
        "edit history",
        "date picker",
        "history select",
        "apply button",
        "reset button",
        "download button",
      ];
      const title = await page.title();
      if (title) {
        logger.info("title verify success");
        await page.waitForTimeout(5000);

        for (let i = 0; i <= elements.length - 1; i++) {
          await page
            .waitForSelector(elements[i], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`${elementNames[i]} visible properly`);
            })
            .catch(() => {
              logger.error(`${elementNames[i]} not visible properly`);
              errors.push(`${elementNames[i]} not visible properly`);
            });
          await page.waitForTimeout(3000);
        }
        await page.click(es.datePicker);
        await page.waitForTimeout(4000);
        let num;
        let datePickAttr1;
        let datePickAttr2;
        let flag = 0;
        let i = 1;
        do {
          num = await getRandomNumberBetween(1, 31);
          await page.waitForTimeout(2000);
          datePickAttr1 = await page.evaluate(
            (el) => el.getAttribute("aria-selected"),
            (
              await page.$x(es.date(Number(num)))
            )[0]
          );
          datePickAttr2 = await page.evaluate(
            (el) => el.getAttribute("aria-disabled"),
            (
              await page.$x(es.date(Number(num)))
            )[0]
          );
          await page.waitForTimeout(2000);
          if (
            datePickAttr1.toString().match("false") &&
            datePickAttr2.toString().match("false")
          ) {
            flag = 1;
            const dateBtn = await page.$x(es.date(Number(num)));
            await dateBtn[0].click();
            logger.info(`date ${num} picked`);
            await page.waitForTimeout(5000);
            await page.click(es.HistoryFor);
            await page.waitForTimeout(4000);
            const num1 = await getRandomNumberBetween(1, 4);
            const sel = await page.$x(es.selectOptions(num1));
            await sel[0].click();
            logger.info("history for selected");
            await page.waitForTimeout(10000);
            await page
              .$eval(es.dataTable, (elem) => {
                return elem.style.display !== "none";
              })
              .then(() => {
                logger.info("data table visible properly");
              })
              .catch(() => {
                logger.error("data table not visible properly");
                errors.push("data table not visible properly");
              });
          } else {
            i++;
          }
          if (flag == 1 || i == 31) {
            break;
          }
        } while (i > 0);
      } else {
        logger.error("title verify failed");
        errors.push("title verify failed");
      }
    } else {
      logger.warn(
        "role is not admin!,please provide admin as role for further testing"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Edit History Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsUserLoginHistoryTest();
