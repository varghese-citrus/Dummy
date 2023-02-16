import { testingAsserts as ts } from "../deps-test.ts";
import { startLogger } from "../utilities/utils.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { ChartSelectors as cs } from "../selectors/charts.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsChartsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0025] ${site.name} Charts Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0025",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await ChartsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Charts Page Test";
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

async function ChartsTest(baseURL: string) {
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
      await page.waitForTimeout(4000);
      await page
        .waitForSelector(cs.armatusLink, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          logger.info("armatus link is visible properly");
          await page.click(cs.armatusLink);
          await page.waitForTimeout(5000);
          logger.info("armatus link is clicked");
          await page.click(cs.charts);
          await navigationPromise;
          await page.waitForTimeout(15000);
        })
        .catch(() => {
          logger.error("armatus link is not visible properly");
          errors.push("armatus link is not visible properly");
        });

      const pageTitle = await page.title();
      if (pageTitle == "Charts") {
        await page.waitForTimeout(4000);
        logger.info("page title verify success");
        const elements = [cs.heading, cs.downloadBtn, cs.resetLayout];
        const elementNames = ["heading", "download button", "reset button"];

        for (let i = 0; i < elements.length; i++) {
          await page
            .waitForXPath(elements[i], {
              visible: true,
              timeout: 4000,
            })
            .then(async () => {
              await page.waitForTimeout(4000);
              logger.info(`${elementNames[i]} visible properly`);
            })
            .catch(() => {
              logger.error(`${elementNames[i]} not visible properly`);
              errors.push(`${elementNames[i]} not visible properly`);
            });
          await page.waitForTimeout(2000);
        }

        await page
          .$eval(cs.dataTable, (elem) => {
            return elem.style.display !== "none";
          })
          .then(async () => {
            await page.waitForTimeout(2000);
            logger.info("data table display properly");
          })
          .catch(() => {
            logger.error("data table not display properly");
            errors.push("data table not display properly");
          });
      } else {
        logger.error("page title verify failed");
        errors.push("page title verify failed");
      }
    } else {
      logger.warn(
        "Role is not admin,please pass role as admin for further testing"
      );
    }
    ts.assert(errors.length == 0, `Error in Charts Page:${errors.join("\n")}`);
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsChartsTest();
