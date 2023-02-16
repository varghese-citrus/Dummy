import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsOpportunitySelectors as po } from "../selectors/parts-opportunity.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOpportunityTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0153] ${site.name} FixedOps Parts Opportunity Hrsro Gp Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0153]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOpportunityCommonCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Opportunity Hrsro Gp Common Test";
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
async function partsOpportunityCommonCheck(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(po.partsMenu);
    await page.click(po.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(po.partsOpportunity);
    await page.click(po.partsOpportunity);
    logger.info("Parts Opportunity clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "“What If” Opportunity Hrs Per RO & Parts GP%") {
      logger.info("Opportunity title verified success");

      const ids = [
        po.lastQtrHrsPerROInput,
        po.lastQtrPartsGpInput,
        po.whatIfTargetHrsPerROInput,
        po.whatIfTargetPartsGpInput,
      ];

      const labels = [
        po.lastQtrBaselineHprInputLabel,
        po.lastQtrBaselinePartsGpInputLabel,
        po.whatIfGoalTarHroInputLabel,
        po.whatIfGoalPartsGpInputLabel,
      ];

      const annualDatas = [
        po.annualOpportunityCombined,
        po.annualOpportunityGrossProfit,
        po.annualOpportunityHrsPerRo,
        po.annualOpportunityJointEffect,
      ];
      const [ovrHeading] = await page.$x(po.opportunityHeading);
      await page.waitForTimeout(2000);
      const heading: string = await (
        await ovrHeading.getProperty("textContent")
      ).jsonValue();
      heading == "“What If” Opportunity - Hrs Per RO & Parts GP%"
        ? logger.info("what if opportunity page heading verify success")
        : [
            logger.info("what if opportunity page heading verify failed"),
            errors.push("what if opportunity page heading verify failed"),
          ];
      await page.waitForTimeout(2000);
      const x = await page.$x(po.whatIfDataAsOf);
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
      const y = await page.$x(po.lastQtrBaselineHeading);
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
      const z = await page.$x(po.whatIfGoalHeading);
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
      for (let i = 0; i <= 3; i++) {
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
      const [annualHeadingXpath] = await page.$x(po.annualHeading);
      await page.waitForTimeout(2000);
      const annualHeading: string = await (
        await annualHeadingXpath.getProperty("textContent")
      ).jsonValue();
      if (annualHeading == "Annual Opportunity") {
        logger.info("annual heading verify success");
        const dataTabName = [
          "Hours Per RO",
          "Gross Profit %",
          "Joint Effect",
          "Combined",
        ];
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
      `Error in Parts Opportunity Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOpportunityTest();
