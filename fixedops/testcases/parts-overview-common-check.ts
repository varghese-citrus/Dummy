import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { partsoverviewSelectors as po } from "../selectors/parts-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0164] ${site.name} FixedOps Parts Overview Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0164]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Common Test";
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

async function partsOverviewCommonTest(baseURL: string) {
  let browser = null;
  const oBrowser = await fixedopsCommonLogin(baseURL);
  const page = oBrowser.page;
  browser = oBrowser.browser;
  const navigationPromise = oBrowser.navigationPromise;
  try {
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await page.waitForTimeout(4000);
    logger.info("parts menu clicked");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    logger.info("parts overview");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const title = await page.title();
    if (title == "CP Parts Overview") {
      logger.info("title verify success");
      const [partsOHeading] = await page.$x(po.pOverviewHeading);
      const heading: string = await (
        await partsOHeading.getProperty("textContent")
      ).jsonValue();
      heading == "CP Parts Overview"
        ? logger.info("Parts overview page heading verify success")
        : [
            logger.error("Parts overview page heading verify failed"),
            errors.push("Parts overview page heading verify failed"),
          ];

      await page.waitForXPath(po.dataAsOf);
      const x = await page.$x(po.dataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();

      str.split(":")[0].includes("Data as of")
        ? logger.info("data as of field properly displayed")
        : [
            logger.error("data as of field not properly displayed"),
            errors.push("data as of field not properly displayed"),
          ];
      await page.waitForXPath(po.resetLayout);
      const [pLbutton] = await page.$x(po.resetLayout);
      const resetB: string = await (
        await pLbutton.getProperty("textContent")
      ).jsonValue();
      resetB.includes("Reset Layout")
        ? logger.info("Reset layout present")
        : [
            logger.error("Reset layout not present"),
            errors.push("Reset layout not present"),
          ];
    } else {
      logger.error("title verify failed");
      errors.push("title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Overview: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    errors.push("parts overview common check failed");
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
