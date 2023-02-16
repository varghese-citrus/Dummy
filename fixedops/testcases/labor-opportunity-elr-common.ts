import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborOppertunityElrSelectors as wl } from "../selectors/labor-opportunity-elr.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborOpportunityElrPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0078] ${site.name} FixedOps Labor Opportunity Effective Labor Rate Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0078",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOpportunityElrPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Effective Labor Rate Page Common Test";
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

async function laborOpportunityElrPageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(5000);
    await page.waitForSelector(wl.whatIfElrLink);
    await page.click(wl.whatIfElrLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("what if opportunity elr link clicked!!!");

    const title = await page.title();

    if (title == "“What If” Opportunity Effective Labor Rate") {
      logger.info(
        "“What If” Opportunity Effective Labor Rate title verify success"
      );

      const ids = [
        wl.lastQtrBaselineElrCompInput,
        wl.lastQtrBaselineElrMaintInput,
        wl.lastQtrBaselineElrRepairInput,
        wl.whatIfGoalElrCompInput,
        wl.whatIfGoalElrMaintInput,
        wl.whatIfGoalElrRepairInput,
      ];

      const labels = [
        wl.lastQtrBaselineElrCompInputLabel,
        wl.lastQtrBaselineElrMaintInputLabel,
        wl.lastQtrBaselineElrRepairInputLabel,
        wl.whatIfGoalElrCompInputLabel,
        wl.whatIfGoalElrMaintInputLabel,
        wl.whatIfGoalElrRepairInputLabel,
      ];

      const annualDatas = [
        wl.annualOpportunityCompetetive,
        wl.annualOpportunityMaintenance,
        wl.annualOpportunityRepair,
        wl.annualOpportunityTotal,
      ];
      const [ovrHeading] = await page.$x(wl.whatIfElrHeading);
      await page.waitForTimeout(2000);
      const heading: string = await (
        await ovrHeading.getProperty("textContent")
      ).jsonValue();
      heading == "“What If” Opportunity - Effective Labor Rate"
        ? logger.info("what if opportunity elr page heading verify success")
        : [
            logger.info("what if opportunity elr page heading verify failed"),
            errors.push("what if opportunity elr page heading verify failed"),
          ];
      await page.waitForTimeout(2000);
      const x = await page.$x(wl.whatIfElrDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();

      str.split(":")[0].includes("Data as of")
        ? logger.info("data as of field properly displayed")
        : [
            logger.info("data as of field not properly displayed"),
            errors.push("data as of field not properly displayed"),
          ];

      await page.waitForTimeout(2000);
      const y = await page.$x(wl.lastQtrBaselineHeading);
      const lastQtrBaselineHeading: string = await (
        await y[0].getProperty("textContent")
      ).jsonValue();

      lastQtrBaselineHeading.includes("Last Qtr Baseline:")
        ? logger.info("Last Qtr Baseline heading properly displayed")
        : [
            logger.error("Last Qtr Baseline heading not properly displayed"),
            errors.push("Last Qtr Baseline heading not properly displayed"),
          ];

      await page.waitForTimeout(2000);
      const z = await page.$x(wl.whatIfGoalHeading);
      const whatIfGoalHeading: string = await (
        await z[0].getProperty("textContent")
      ).jsonValue();

      whatIfGoalHeading.includes(`"What If" Goal:`)
        ? logger.info(`"What If" Goal heading properly displayed`)
        : [
            logger.error(`"What If" Goal heading not properly displayed`),
            errors.push(`"What If" Goal heading not properly displayed`),
          ];
      await page.waitForTimeout(5000);

      for (let i = 0; i <= 5; i++) {
        const xpath = await page.$x(labels[i]);
        const name = await (
          await xpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);
        await page
          .waitForSelector(ids[i], {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`${name} input field display properly`);
          })
          .catch(() => {
            logger.error(`${name} input field not properly displayed`);
            errors.push(`${name} input field not properly displayed`);
          });
        await page.waitForTimeout(5000);
      }
      const [annualHeadingXpath] = await page.$x(wl.annualHeading);
      await page.waitForTimeout(2000);
      const annualHeading: string = await (
        await annualHeadingXpath.getProperty("textContent")
      ).jsonValue();

      if (annualHeading == "Annual Opportunity") {
        logger.info("annual heading verify success");

        const dataTabName = ["Competitive", "Maintenance", "Repair", "Total"];

        for (let i = 0; i <= annualDatas.length - 1; i++) {
          await page.waitForTimeout(2000);
          await page
            .waitForSelector(annualDatas[i], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`${dataTabName[i]} field display properly`);
            })
            .catch(() => {
              logger.error(`${dataTabName[i]} field not properly displayed`);
              errors.push(`${dataTabName[i]} field not properly displayed`);
            });
          await page.waitForTimeout(5000);
        }
      } else {
        logger.error("annual heading verify failed");
        errors.push("annual heading verify failed");
      }
    } else {
      console.error("what if opportunity page title verify failed");
      errors.push("what if opportunity page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Opportunity Effective Labor Rate Page: ${errors.join(
        "\n"
      )}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborOpportunityElrPageTest();
