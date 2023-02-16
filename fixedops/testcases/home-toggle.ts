import { Page, testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { HomeSelectors as hs } from "../selectors/home.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsHomeTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0073] ${site.name} FixedOps Home Page Toggle Select Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0073",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await homePageToggleTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Home Page Toggle Select Test";
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

async function homePageToggleTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    const title = await page.title();

    if (title == "Home") {
      logger.info("home page title verify success");
      await page.reload();
      await navigationPromise;
      await page.waitForTimeout(15000);
      const [kpiTitle] = await page.$x(hs.KpiScrTitle);
      const title = await (
        await kpiTitle.getProperty("textContent")
      ).jsonValue();

      title == "KPI Score Card"
        ? logger.info("home page heading verify success")
        : [
            logger.error("home page heading verify failed"),
            errors.push("home page heading verify failed"),
          ];

      await page
        .waitForSelector(hs.dataAsOf, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("data as of field properly displayed");
        })
        .catch(() => {
          logger.error("data as of field not properly displayed");
          errors.push("data as of field not properly displayed");
        });
      await page.waitForTimeout(10000);
      (await page.$$eval(hs.defaultToggle, (txts) =>
        txts.map((txt) => txt.getAttribute("value")).includes("MTD")
      ))
        ? logger.info("default toggle select MTD  check success")
        : [
            logger.error("default toggle select MTD  check fail"),
            errors.push("default toggle select MTD  check fail"),
          ];

      await page.waitForSelector(hs.toggleBtn);
      await page.click(hs.toggleBtn);
      await page.waitForTimeout(5000);

      const num = await getRandomNumberBetween(1, 10);

      const el = await page.$x(hs.tglBtnLi(num));
      const li = await (await el[0].getProperty("textContent")).jsonValue();
      await el[0].click();
      await navigationPromise;
      await page.waitForTimeout(10000);
      logger.info(`${li} selected`);

      const dataBody = await page.$x(hs.noDataDisplay);
      const noDataDisplay: string = await (
        await dataBody[0].getProperty("textContent")
      ).jsonValue();
      if (noDataDisplay.includes("No Data to Display")) {
        logger.warn(`no data to display under ${li}`);
      } else {
        logger.info("data is present based on toggle select");
        await page.waitForTimeout(5000);
        await graphsCheck(page);
        await page.waitForTimeout(15000);
      }
      await page.reload();
      await navigationPromise;
      await page.waitForTimeout(15000);

      await page.waitForSelector(hs.toggleBtn);
      await page.click(hs.toggleBtn);
      await page.waitForTimeout(5000);
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

async function graphsCheck(page: Page) {
  try {
    const ids = [
      hs.scoreCard,
      hs.chartContainer_1,
      hs.chartContainer_2,
      hs.chartContainer_3,
      hs.chartContainer_4,
      hs.chartContainer_11,
      hs.chartContainer_5,
      hs.chartContainer_6,
      hs.chartContainer_7,
      hs.chartContainer_8,
      hs.chartContainer_9,
      hs.chartContainer_10,
      hs.chartContainer_12,
      hs.chartContainer_13,
    ];

    for (let i = 0; i <= ids.length - 1; i++) {
      await page
        .$eval(ids[i], (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info(`graph ${i + 1} displayed properly`);
        })
        .catch(() => {
          logger.error(`graph ${i + 1} not displayed properly`);
          errors.push(`graph ${i + 1} not displayed properly`);
        });
    }
    const homeLink = await page.$x(hs.home);
    await homeLink[0].click();
    await page.waitForTimeout(15000);
  } catch (error) {
    console.log(error);
    errors.push("graph check test error");
  }
}
