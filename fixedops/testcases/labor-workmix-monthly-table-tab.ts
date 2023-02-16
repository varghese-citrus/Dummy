import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0126] ${site.name} FixedOps Labor Work Mix Page Monthly Table Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0126",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageMonthlyTableTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Monthly Table Tab Test";
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

async function laborWorkMixPageMonthlyTableTabTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor work mix link clicked!!!");
    const title = await page.title();
    if (title == "Labor Work Mix") {
      logger.info("labor work miss title verify success");
      const tabs = [lw.tab_1, lw.tab_2, lw.tab_3, lw.tab_4];
      for (let i = 0; i <= tabs.length - 1; i++) {
        const tab = await page.$x(tabs[i]);
        await page.waitForTimeout(4000);
        const tabname = await (
          await tab[0].getProperty("textContent")
        ).jsonValue();
        await tab[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);
        const monthlyTables = await page.waitForXPath(lw.monthlyTablesTitle, {
          visible: true,
        });
        if (monthlyTables != null) {
          logger.info("monthly tables span visible properly");
          const tables = [
            lw.sales,
            lw.solidHours,
            lw.grossProfit,
            lw.elr,
            lw.jobCount,
            lw.workMix,
          ];
          const btns = [lw.resetBtn, lw.dIcon];
          const btnName: string[] = ["reset layout", "download Icon"];
          for (let k = 0; k <= btns.length - 1; k++) {
            await page
              .waitForSelector(btns[k], {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.error(
                  `${btnName[k]} button present under ${tabname},verification failed`
                );
                errors.push(
                  `${btnName[k]} button present under ${tabname},verification failed`
                );
              })
              .catch(() => {
                logger.info(
                  `${btnName[k]} button not present under ${tabname},verification success`
                );
              });
          }
          for (let j = 0; j <= tables.length - 1; j++) {
            const text = await page.$eval(
              tables[j],
              (element) => element.textContent
            );
            await page.waitForTimeout(4000);
            await page
              .waitForSelector(tables[j], {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info(
                  `monthly tables button ${text} properly displayed under ${tabname}`
                );
              })
              .catch(() => {
                logger.error(
                  `monthly tables button ${text} not properly displayed under ${tabname}`
                );
                errors.push(
                  `monthly tables button ${text} not properly displayed under ${tabname}`
                );
              });
            await page.waitForTimeout(4000);
          }
        } else {
          logger.error("monthly tables span not visible properly");
        }
      }
    } else {
      logger.info("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixTest();
