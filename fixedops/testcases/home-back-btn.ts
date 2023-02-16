import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { HomeSelectors as hs } from "../selectors/home.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsHomeTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0068] ${site.name} FixedOps Home Page Back Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0068",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await homePageBackButtonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Home Page Back Button Test";
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

async function homePageBackButtonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    const title = await page.title();

    if (title == "Home") {
      logger.info(`${title} page title verify success!!!`);

      await page.reload();
      await navigationPromise;
      await page.waitForTimeout(15000);

      await page
        .waitForXPath(hs.noData, { visible: true, timeout: 2000 })
        .then(async () => {
          logger.warn("there is no data in MTD");
          await page.click(hs.toggleBtn);
          await page.waitForTimeout(4000);
          const lastThreeMonthLi = await page.$x(hs.lastThreeMonthLi);
          await lastThreeMonthLi[0].click();
          await page.waitForTimeout(10000);
          logger.info("last three month toggle selected");

          let xpath;
          for (let j = 35; j <= 53; j++) {
            let id;

            if (
              j == 45 ||
              j == 47 ||
              j == 48 ||
              j == 49 ||
              j == 50 ||
              j == 52
            ) {
              continue;
            } else {
              id = `visualization_13${j}`;
              xpath = hs.backBtnId(id);
            }
            const height = await page.evaluate("window.scrollY");

            const backBtn = await page.$x(xpath);

            await page.waitForTimeout(2000);
            await page.evaluate((element) => {
              element.scrollIntoView(
                0,
                parseInt(element.getBoundingClientRect().y)
              );
            }, backBtn[0]);
            await page.waitForTimeout(2000);

            await backBtn[0].click();
            await page.waitForTimeout(5000);

            const scrollHeightAfterClick = await page.evaluate(
              "window.scrollY"
            );

            height == scrollHeightAfterClick
              ? logger.info(`return to top button(${id}) working properly`)
              : [
                  logger.error(
                    `return to top button(${id}) not working properly`
                  ),
                  errors.push(
                    `return to top button(${id}) not working properly`
                  ),
                ];

            await page.waitForTimeout(10000);
          }
        })
        .catch(async () => {
          logger.info("default MTD having data");
          await page.waitForTimeout(2000);
          let xpath;
          for (let j = 35; j <= 53; j++) {
            let id;

            if (
              j == 45 ||
              j == 47 ||
              j == 48 ||
              j == 49 ||
              j == 50 ||
              j == 52
            ) {
              continue;
            } else {
              id = `visualization_13${j}`;
              xpath = hs.backBtnId(id);
            }
            const height = await page.evaluate("window.scrollY");
            const backBtn = await page.$x(xpath);

            await page.waitForTimeout(2000);
            await page.evaluate((element) => {
              element.scrollIntoView(
                0,
                parseInt(element.getBoundingClientRect().y)
              );
            }, backBtn[0]);
            await page.waitForTimeout(2000);

            await backBtn[0].click();
            await page.waitForTimeout(5000);

            const scrollHeightAfterClick = await page.evaluate(
              "window.scrollY"
            );

            height == scrollHeightAfterClick
              ? logger.info(`return to top button(${id}) working properly`)
              : [
                  logger.error(
                    `return to top button(${id}) not working properly`
                  ),
                  errors.push(
                    `return to top button(${id}) not working properly`
                  ),
                ];

            await page.waitForTimeout(10000);
          }
        });
    } else {
      logger.error("home page title verify failed");
      errors.push("home page title verify failed");
    }
    ts.assert(errors.length == 0, `Error in Home page: ${errors.join("\n")}`);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsHomeTest();
