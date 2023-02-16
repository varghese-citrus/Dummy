import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0181] ${site.name} FixedOps Parts Workmix Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0181]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixChartAddRemoveFavTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Chart Add Remove Test";
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

async function partsWorkmixChartAddRemoveFavTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    await page.waitForTimeout(5000);
    logger.info("Parts Menu clicked");
    const partsWrkMix = await page.$x(pw.partsWorkmixMenu);
    await partsWrkMix[0].click();
    await page.waitForTimeout(12000);
    logger.info("Parts Workmix clicked");
    const title = await page.title();
    const WrkmixChart = [
      pw.workMixChart_1,
      pw.workMixChart_2,
      pw.workMixChart_3,
      pw.workMixChart_4,
      pw.workMixChart_5,
      pw.workMixChart_6,
    ];
    if (title == "Parts Work Mix") {
      logger.info("parts workmix title verify success");
      const num = await getRandomNumberBetween(0, 5);
      const WrkmixChart_Id = WrkmixChart[num];
      await page.waitForTimeout(5000);
      let addRemFavBtn = await page.$x(pw.addRemFavBtn(num + 1));
      await page.waitForTimeout(5000);
      const buttonStatus: string = await (
        await addRemFavBtn[0].getProperty("title")
      ).jsonValue();
      const favLink = await page.$x(pw.favMenu);
      if (buttonStatus.includes("Add-to-Favorites")) {
        let addRemFavBtn = await page.$x(pw.addRemFavBtn(num + 1));
        await addRemFavBtn[0].click();
        await page.waitForTimeout(5000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(WrkmixChart_Id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`chart ${num + 1} added to favorite successfully`);
          })
          .catch(() => {
            logger.error(`chart ${num + 1} added to favorite failed`);
            errors.push(`chart ${num + 1} added to favorite failed`);
          });
        await page.waitForTimeout(5000);
        const partsWorkmix = await page.$x(pw.partsWorkmixMenu);
        await partsWorkmix[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);
        addRemFavBtn = await page.$x(pw.addRemFavBtn(num + 1));
        await addRemFavBtn[0].click();
        await page.waitForTimeout(5000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(WrkmixChart_Id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.error(`chart ${num + 1} removed from favorite fail`);
            errors.push(`chart ${num + 1} removed from favorite fail`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} removed from favorite success`);
          });
        await partsWrkMix[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);
      } else if (buttonStatus.includes("Remove-from-Favorites")) {
        await addRemFavBtn[0].click();
        await page.waitForTimeout(5000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);
        await page
          .waitForSelector(WrkmixChart_Id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.error(`chart ${num + 1} removed from favorite fail`);
            errors.push(`chart ${num + 1} removed from favorite fail`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} removed from favorite success`);
          });
        const partsWorkmix = await page.$x(pw.partsWorkmixMenu);
        await partsWorkmix[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);
        addRemFavBtn = await page.$x(pw.addRemFavBtn(num + 1));
        await addRemFavBtn[0].click();
        await page.waitForTimeout(5000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(WrkmixChart_Id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`chart ${num + 1} added to favorite success`);
          })
          .catch(() => {
            logger.error(`chart ${num + 1} added to favorite fail`);
            errors.push(`chart ${num + 1} added to favorite fail`);
          });
        await page.waitForTimeout(5000);
        await partsWorkmix[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);
      }
    } else {
      logger.error("parts workmix title verify failed");
      errors.push("parts workmix title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Parts Workmix: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
