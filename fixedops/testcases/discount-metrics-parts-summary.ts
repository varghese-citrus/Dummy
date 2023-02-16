import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsDiscountSummaryTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0059] ${site.name} FixedOps Discount Summary Parts Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0059",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await disSummaryPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Summary Parts Page Common Test";
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

async function disSummaryPageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ds.disMetricsLink);
    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("discount link clicked!!!");

    // const discountSummaryTab = await page.$x(ds.discountSummaryTab);
    // await discountSummaryTab[0].click();
    // await page.waitForTimeout(10000);
    // logger.info("Discount summary tab clicked");

    const title = await page.title();

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      const [ovrHeading] = await page.$x(ds.disSummaryHeading);

      const heading: string = await (
        await ovrHeading.getProperty("textContent")
      ).jsonValue();

      heading == "Discount Metrics"
        ? logger.info("Discount Summary page heading verify success")
        : [
            logger.info("Discount Summary page heading verify failed"),
            errors.push("Discount Summary page heading verify failed"),
          ];

      await page.waitForXPath(ds.servDataAsOf);
      const x = await page.$x(ds.servDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();

      str.split(":")[0].includes("Data as of")
        ? logger.info("data as of field properly displayed")
        : [
            logger.info("data as of field not properly displayed"),
            errors.push("data as of field not properly displayed"),
          ];

      const partsTab = await page.$x(ds.partsTab);
      await partsTab[0].click();
      await page.waitForTimeout(10000);
      logger.info("Parts tab clicked");

      const monthSel1 = await page.$x(ds.month1Select);
      await monthSel1[0].click();
      await page.waitForTimeout(4000);

      const num1 = await getRandomNumberBetween(1, 12);
      const month1 = await page.$x(ds.getMonth(num1));
      await month1[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 1 selected");

      const t = await page.$x(ds.advSelect);
      await t[0].click();
      await page.waitForTimeout(4000);
      logger.info("Advisor dropdown clicked");

      let num;
      let adv;
      let advSelectLiStatus;
      let flag = 0;
      let i = 1;
      do {
        num = await getRandomNumberBetween(1, 8);
        adv = await page.$x(ds.advSelectLi(num));
        await page.waitForTimeout(2000);

        advSelectLiStatus = await page.evaluate(
          (el) => el.hasAttribute("style"),
          adv[0]
        );
        await page.waitForTimeout(2000);

        if (advSelectLiStatus == false) {
          flag = 1;
        } else {
          i++;
        }

        if (flag == 1) {
          break;
        }
      } while (i > 0);

      await adv[0].click();
      await page.waitForTimeout(15000);
      logger.info("Advisor selected from dropdown");
      await page
        .$eval(ds.dataTab, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Discount Summary Parts Data display properly");
        })
        .catch(() => {
          logger.info("Discount Summary Parts Data not properly displayed");
          errors.push("Discount Summary Parts Data not properly displayed");
        });
    } else {
      logger.error("Discount Summary Parts page title verify failed");
      errors.push("Discount Summary Parts page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Discount Summary Parts Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountSummaryTest();
