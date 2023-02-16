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
      name: `[AEC-FOCP-UI-FN-LD-0072] ${site.name} FixedOps Home Page Radio Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0072",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await homePageRadioBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Home Page Radio Button Test";
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

async function homePageRadioBtnTest(baseURL: string) {
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

      const siteId = Deno.env.get("FOPC_SITE_ID");
      const rBtns = [hs.radioBtn1, hs.radioBtn2, hs.radioBtn3, hs.radioBtn4];
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

          if (
            siteId == "billknight2022" ||
            siteId == "cliffharris2022" ||
            siteId == "sawyermotors2022"
          ) {
            for (let i = 0; i <= rBtns.length - 1; i++) {
              const rBtn = await page.$x(rBtns[i]);
              await page.waitForTimeout(5000);

              await rBtn[0].click();
              await page.waitForTimeout(5000);

              switch (i) {
                case 0: {
                  const missesBtn = await page.$x(hs.viewMissesBtn1);
                  await missesBtn[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(5000);

                  const x = await page.$x(hs.missestitles);
                  await page.waitForTimeout(5000);

                  const text: string = await (
                    await x[0].getProperty("textContent")
                  ).jsonValue();
                  text
                    .toString()
                    .includes("Customer Pay Repair - Labor Target Misses")
                    ? logger.info(`rBtn ${i + 1} working properly`)
                    : [
                        logger.error(`rBtn ${i + 1} not working properly`),
                        errors.push(`rBtn ${i + 1} not working properly`),
                      ];
                  break;
                }
                case 1: {
                  const missesBtn = await page.$x(hs.viewMissesBtn1);
                  await missesBtn[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(5000);
                  const x = await page.$x(hs.missestitles);
                  await page.waitForTimeout(5000);

                  const text: string = await (
                    await x[0].getProperty("textContent")
                  ).jsonValue();
                  text
                    .toString()
                    .includes("Internal Repair - Labor Target Misses")
                    ? logger.info(`rBtn ${i + 1} working properly`)
                    : [
                        logger.error(`rBtn ${i + 1} not working properly`),
                        errors.push(`rBtn ${i + 1} not working properly`),
                      ];
                  break;
                }
                case 2: {
                  const missesBtn = await page.$x(hs.viewMissesBtn2);
                  await missesBtn[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(5000);
                  const x = await page.$x(hs.missestitles);
                  await page.waitForTimeout(5000);

                  const text: string = await (
                    await x[0].getProperty("textContent")
                  ).jsonValue();
                  text
                    .toString()
                    .includes("Customer Pay Repair - Parts Target Misses")
                    ? logger.info(`rBtn ${i + 1} working properly`)
                    : [
                        logger.error(`rBtn ${i + 1} not working properly`),
                        errors.push(`rBtn ${i + 1} not working properly`),
                      ];
                  break;
                }
                case 3: {
                  const missesBtn = await page.$x(hs.viewMissesBtn2);
                  await missesBtn[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(5000);
                  const x = await page.$x(hs.missestitles);
                  await page.waitForTimeout(5000);

                  const text: string = await (
                    await x[0].getProperty("textContent")
                  ).jsonValue();
                  text
                    .toString()
                    .includes("Internal Repair - Parts Target Misses")
                    ? logger.info(`rBtn ${i + 1} working properly`)
                    : [
                        logger.error(`rBtn ${i + 1} not working properly`),
                        errors.push(`rBtn ${i + 1} not working properly`),
                      ];
                  break;
                }
                default: {
                  null;
                  break;
                }
              }
              await page.goBack();
              await page.waitForTimeout(8000);
              await page.reload();
              await navigationPromise;
              await page.waitForTimeout(20000);
            }
          } else {
            logger.warn(
              "radio buttons are available only for billknight,cliffharris,sawyermotors"
            );
          }
        })
        .catch(async () => {
          logger.info("default MTD having data");
          if (
            siteId == "billknight2022" ||
            siteId == "cliffharris2022" ||
            siteId == "sawyermotors2022"
          ) {
            for (let i = 0; i <= rBtns.length - 1; i++) {
              const rBtn = await page.$x(rBtns[i]);
              await page.waitForTimeout(5000);
              await rBtn[0].click();
              await page.waitForTimeout(5000);

              switch (i) {
                case 0: {
                  const missesBtn = await page.$x(hs.viewMissesBtn1);
                  await missesBtn[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(5000);

                  const x = await page.$x(hs.missestitles);
                  await page.waitForTimeout(5000);

                  const text: string = await (
                    await x[0].getProperty("textContent")
                  ).jsonValue();
                  text
                    .toString()
                    .includes("Customer Pay Repair - Labor Target Misses")
                    ? logger.info(`rBtn ${i + 1} working properly`)
                    : [
                        logger.error(`rBtn ${i + 1} not working properly`),
                        errors.push(`rBtn ${i + 1} not working properly`),
                      ];
                  break;
                }
                case 1: {
                  const missesBtn = await page.$x(hs.viewMissesBtn1);
                  await missesBtn[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(5000);
                  const x = await page.$x(hs.missestitles);
                  await page.waitForTimeout(5000);

                  const text: string = await (
                    await x[0].getProperty("textContent")
                  ).jsonValue();
                  text
                    .toString()
                    .includes("Internal Repair - Labor Target Misses")
                    ? logger.info(`rBtn ${i + 1} working properly`)
                    : [
                        logger.error(`rBtn ${i + 1} not working properly`),
                        errors.push(`rBtn ${i + 1} not working properly`),
                      ];
                  break;
                }
                case 2: {
                  const missesBtn = await page.$x(hs.viewMissesBtn2);
                  await missesBtn[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(5000);
                  const x = await page.$x(hs.missestitles);
                  await page.waitForTimeout(5000);

                  const text: string = await (
                    await x[0].getProperty("textContent")
                  ).jsonValue();
                  text
                    .toString()
                    .includes("Customer Pay Repair - Parts Target Misses")
                    ? logger.info(`rBtn ${i + 1} working properly`)
                    : [
                        logger.error(`rBtn ${i + 1} not working properly`),
                        errors.push(`rBtn ${i + 1} not working properly`),
                      ];
                  break;
                }
                case 3: {
                  const missesBtn = await page.$x(hs.viewMissesBtn2);
                  await missesBtn[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(5000);
                  const x = await page.$x(hs.missestitles);
                  await page.waitForTimeout(5000);

                  const text: string = await (
                    await x[0].getProperty("textContent")
                  ).jsonValue();
                  text
                    .toString()
                    .includes("Internal Repair - Parts Target Misses")
                    ? logger.info(`rBtn ${i + 1} working properly`)
                    : [
                        logger.error(`rBtn ${i + 1} not working properly`),
                        errors.push(`rBtn ${i + 1} not working properly`),
                      ];
                  break;
                }
              }
              await page.goBack();
              await page.waitForTimeout(8000);
              await page.reload();
              await navigationPromise;
              await page.waitForTimeout(20000);
            }
          } else {
            logger.warn(
              "radio buttons are available only for billknight,cliffharris,sawyermotors"
            );
          }
        });
    } else {
      logger.error("home page title verify failed");
      errors.push("home page title verify failed");
    }
    ts.assert(errors.length == 0, `Error in  Home page: ${errors.join("\n")}`);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsHomeTest();
