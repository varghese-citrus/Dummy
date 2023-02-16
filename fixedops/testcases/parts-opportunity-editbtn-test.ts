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
      name: `[AEC-FOCP-UI-FN-LD-0152] ${site.name} FixedOps Parts Opportunity Edit Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0152]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOpportunityEditButtonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Opportunity Edit Button Test";
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
async function partsOpportunityEditButtonTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(po.partsMenu);
    await page.click(po.partsMenu);
    logger.info("Parts Menu clicked!!!");
    await navigationPromise;
    await page.waitForTimeout(5000);
    await page.waitForSelector(po.partsOpportunity);
    await page.click(po.partsOpportunity);
    logger.info("Parts Opportunity clicked!!!");
    await navigationPromise;
    await page.waitForTimeout(20000);
    const title = await page.title();
    if (title == "“What If” Opportunity Hrs Per RO & Parts GP%") {
      logger.info("Opportunity title verified success");
      await page.waitForTimeout(4000);
      const hrsPerRoInputValue = await page.$eval(
        po.whatIfTargetHrsPerROInput,
        (element) => element.getAttribute("value")
      );

      const partsGpRoInputValue = await page.$eval(
        po.whatIfTargetPartsGpInput,
        (element) => element.getAttribute("value")
      );

      const data = [
        {
          hrsPerRo: "",
          partsGp: "",
        },
        {
          hrsPerRo: "",
          partsGp: partsGpRoInputValue,
        },
        {
          hrsPerRo: hrsPerRoInputValue,
          partsGp: "",
        },
      ];
      const role = Deno.env.get("ROLE");
      if (role == "admin" || role?.toString().includes("user")) {
        for (let i = 0; i <= data.length - 1; i++) {
          await page.waitForSelector(po.editBtn);
          await page.click(po.editBtn);
          await page.waitForTimeout(8000);
          logger.info("edit button clicked");
          await page.waitForSelector(po.whatIfTargetHrsPerRONonEditable);
          const hrsPerRoInput = await page.$eval(
            po.whatIfTargetHrsPerRONonEditable,
            (element) => element.getAttribute("id")
          );
          const laborGpRoInput = await page.$eval(
            po.whatIfTargetPartsGpNonEditable,
            (element) => element.getAttribute("id")
          );
          await page.waitForTimeout(5000);
          if (
            hrsPerRoInput.toString() == "Target Hours Per RO-input" &&
            laborGpRoInput.toString() == "Target Parts Gross Profit %-input"
          ) {
            logger.info("hrs pr ro input || parts gp% is enable for editing");

            await page.waitForTimeout(2000);
            await page.click(po.whatIfGoalTargetHrsPerROInputEditable, {
              clickCount: 3,
            });
            await page.waitForTimeout(2000);
            await page.keyboard.press("Backspace");
            await page.type(
              po.whatIfGoalTargetHrsPerROInputEditable,
              `${data[i].hrsPerRo}`
            );
            await page.waitForTimeout(2000);
            await page.click(po.whatIfTargetPartsGpInputEditable, {
              clickCount: 3,
            });
            await page.waitForTimeout(2000);
            await page.keyboard.press("Backspace");
            await page.type(
              po.whatIfTargetPartsGpInputEditable,
              `${data[i].partsGp}`
            );
            await page.waitForTimeout(2000);
            await page.click(po.saveBtn);
            await page.waitForTimeout(25000);
            const inputCondition = [
              "both input null",
              "hrs per ro null",
              "labor gp% null",
            ];
            logger.info(`provide ${inputCondition[i]}`);

            await page
              .waitForSelector(po.chart, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info("edit button working properly");
              })
              .catch(() => {
                logger.error("edit button not working properly");
                errors.push("edit button not working properly");
              });
            await page.reload();
            await navigationPromise;
            await page.waitForTimeout(10000);
          } else {
            logger.error(
              "hrs pr ro input || labor gp% is not enable for editing"
            );
            errors.push(
              "hrs pr ro input || labor gp% is not enable for editing"
            );
          }
        }
      } else {
        const elements = [
          po.lastQtrHrsPerROInput,
          po.lastQtrPartsGpInput,
          po.whatIfTargetHrsPerROInput,
          po.whatIfTargetPartsGpInput,
        ];
        for (let i = 0; i <= data.length - 1; i++) {
          await page.waitForTimeout(2000);
          await page
            .waitForSelector(elements[i], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`Input field ${i + 1} is displayed properly`);
            })
            .catch(() => {
              logger.error(`Input field ${i + 1} is not displayed properly`);
              errors.push(`Input field ${i + 1} is not displayed properly`);
            });
          const hrsPerRoInput = await page.$eval(
            po.whatIfGoalTargetHrsPerROInputNonEditable,
            (element) => element.getAttribute("id")
          );
          const laborGpRoInput = await page.$eval(
            po.whatIfTargetPartsGpInputNonEditable,
            (element) => element.getAttribute("id")
          );
          if (
            hrsPerRoInput.toString() == "Target Hours Per RO-input-readonly" &&
            laborGpRoInput.toString() ==
              "Target Parts Gross Profit %-input-readonly"
          ) {
            logger.info("hrs pr ro input || labor gp% is enable for read only");

            await page
              .waitForSelector(po.chart, { visible: true, timeout: 4000 })
              .then(() => {
                logger.info("edit button working properly");
              })
              .catch(() => {
                logger.error("edit button not working properly");
                errors.push("edit button not working properly");
              });
            await page.reload();
            await navigationPromise;
            await page.waitForTimeout(10000);
          } else {
            logger.error(
              "hrs pr ro input || labor gp% is not enable for editing"
            );
            errors.push(
              "hrs pr ro input || labor gp% is not enable for editing"
            );
          }
        }
      }
    } else {
      logger.error("what if opportunity page title verify failed");
      errors.push("what if opportunity page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  CP Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOpportunityTest();
