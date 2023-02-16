import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborOppertunityHrsRoGpSelectors as ws } from "../selectors/labor-opportunity-hrsro-gp.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsOpportunityHrsRoGpPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0085] ${site.name} FixedOps Labor Opportunity Hrs Ro Gp Page Edit Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0085",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOpportunityHrsRoGpPageEditBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Hrs Ro Gp Page Edit Button Test";
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

async function laborOpportunityHrsRoGpPageEditBtnTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);

    await page.waitForSelector(ws.whatIf);
    await page.click(ws.whatIf);
    await navigationPromise;
    await page.waitForTimeout(20000);
    logger.info("what if opportunity link clicked!!!");

    const title = await page.title();

    if (title == "“What If” Opportunity Hrs Per RO & Labor GP%") {
      logger.info(
        "“What If” Opportunity Hrs Per RO & Labor GP% title verify success"
      );

      const hrsPerRoInputValue = await page.$eval(
        ws.whatIfGoalHrsPerRoInput,
        (element) => element.getAttribute("value")
      );

      const laborGpRoInputValue = await page.$eval(
        ws.whatIfGoalLaborGpInput,
        (element) => element.getAttribute("value")
      );

      const data = [
        {
          hrsPerRo: "",
          laborGp: "",
        },
        {
          hrsPerRo: "",
          laborGp: laborGpRoInputValue,
        },
        {
          hrsPerRo: hrsPerRoInputValue,
          laborGp: "",
        },
      ];
      const role = Deno.env.get("ROLE");
      if (role == "admin" || role?.toString().includes("user")) {
        for (let i = 0; i <= data.length - 1; i++) {
          await page.waitForSelector(ws.editButton);
          await page.click(ws.editButton);
          await page.waitForTimeout(5000);

          await page.waitForSelector(ws.whatIfGoalHrsPerRoInputNonEditable);
          const hrsPerRoInput = await page.$eval(
            ws.whatIfGoalHrsPerRoInputNonEditable,
            (element) => element.getAttribute("id")
          );

          const laborGpRoInput = await page.$eval(
            ws.whatIfGoalLaborGpInputNonEditable,
            (element) => element.getAttribute("id")
          );

          if (
            hrsPerRoInput.toString() == "Target Hours Per RO-input" &&
            laborGpRoInput.toString() == "Target Labor Gross Profit %-input"
          ) {
            logger.info("hrs pr ro input || labor gp% is enable for editing");

            await page.waitForTimeout(2000);
            await page.click(ws.whatIfGoalHrsPerRoInputEditable, {
              clickCount: 3,
            });
            await page.waitForTimeout(2000);
            await page.keyboard.press("Backspace");
            await page.type(
              ws.whatIfGoalHrsPerRoInputEditable,
              `${data[i].hrsPerRo}`
            );
            await page.waitForTimeout(2000);
            await page.click(ws.whatIfGoalLaborGpInputEditable, {
              clickCount: 3,
            });
            await page.waitForTimeout(2000);
            await page.keyboard.press("Backspace");
            await page.type(
              ws.whatIfGoalLaborGpInputEditable,
              `${data[i].laborGp}`
            );
            await page.waitForTimeout(2000);
            await page.click(ws.saveButton);
            await page.waitForTimeout(25000);

            const inputCondition = [
              "both input null",
              "hrs per ro null",
              "labor gp% null",
            ];
            logger.info(`provide ${inputCondition[i]}`);
            await page
              .waitForSelector(ws.chart, {
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
          ws.lastQtrBaselineHrsPerRoInput,
          ws.lastQtrBaselineLaborGpInput,
          ws.whatIfGoalHrsPerRoInput,
          ws.whatIfGoalLaborGpInput,
        ];
        for (let i = 0; i <= data.length - 1; i++) {
          await page.waitForTimeout(2000);

          const inputfields = await page.$eval(elements[i], (elem) => {
            return elem.style.display !== "none";
          });
          inputfields
            ? logger.info(`Input field ${i + 1} is displayed properly`)
            : [
                logger.error(`Input field ${i + 1} is not displayed properly`),
                errors.push(`Input field ${i + 1} is not displayed properly`),
              ];
          const hrsPerRoInput = await page.$eval(
            ws.whatIfGoalHrsPerRo,
            (element) => element.getAttribute("id")
          );

          const laborGpRoInput = await page.$eval(
            ws.whatIfGoalLaborGp,
            (element) => element.getAttribute("id")
          );

          if (
            hrsPerRoInput.toString() == "Target Hours Per RO-input-readonly" &&
            laborGpRoInput.toString() ==
              "Target Labor Gross Profit %-input-readonly"
          ) {
            logger.info("hrs pr ro input || labor gp% is enable for read only");
            await page
              .waitForSelector(ws.chart, {
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
      }
    } else {
      logger.error(
        "“What If” Opportunity Hrs Per RO & Labor GP% title verify failed"
      );
      errors.push(
        "“What If” Opportunity Hrs Per RO & Labor GP% title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Opportunity Hrs Ro Gp Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpportunityHrsRoGpPageTest();
