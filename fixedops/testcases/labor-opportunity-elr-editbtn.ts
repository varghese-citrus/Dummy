import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborOppertunityElrSelectors as wl } from "../selectors/labor-opportunity-elr.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsOpportunityElrPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0079] ${site.name} FixedOps Labor Opportunity Effective Labor Rate Page Edit Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0079",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOpportunityElrPageEditBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Effective Labor Rate Page Edit Button Test";
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

async function laborOpportunityElrPageEditBtnTest(baseURL: string) {
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

      const elrCompInputValue = await page.$eval(
        wl.whatIfGoalElrCompInput,
        (element) => element.getAttribute("value")
      );

      const elrMaintInputValue = await page.$eval(
        wl.whatIfGoalElrMaintInput,
        (element) => element.getAttribute("value")
      );

      const elrRepairInputValue = await page.$eval(
        wl.whatIfGoalElrRepairInput,
        (element) => element.getAttribute("value")
      );

      console.log(elrRepairInputValue);

      const data = [
        {
          elrComp: "",
          elrMaint: "",
          elrRepair: "",
        },
        {
          elrComp: "",
          elrMaint: elrMaintInputValue,
          elrRepair: elrRepairInputValue,
        },
        {
          elrComp: elrCompInputValue,
          elrMaint: "",
          elrRepair: elrRepairInputValue,
        },
        {
          elrComp: elrCompInputValue,
          elrMaint: elrMaintInputValue,
          elrRepair: "",
        },
      ];

      for (let i = 0; i <= data.length - 1; i++) {
        await page.waitForSelector(wl.editButton);
        await page.click(wl.editButton);
        await page.waitForTimeout(5000);

        const elrCompInput = await page.$eval(
          wl.whatIfGoalElrCompInputEditable,
          (element) => element.getAttribute("id")
        );

        const elrMaintInput = await page.$eval(
          wl.whatIfGoalElrMaintInputEditable,
          (element) => element.getAttribute("id")
        );

        const elrRepairInput = await page.$eval(
          wl.whatIfGoalElrRepairInputEditable,
          (element) => element.getAttribute("id")
        );

        if (
          elrCompInput.toString() == "Target ELR-Comp-input" &&
          elrMaintInput.toString() == "Target ELR-Maint-input" &&
          elrRepairInput.toString() == "Target ELR-Repair-input"
        ) {
          logger.info(
            "elr comp input || elr maint input || elr repair input is enable for editing"
          );

          //null check
          await page.waitForTimeout(2000);
          await page.click(wl.whatIfGoalElrCompInputEditable, {
            clickCount: 3,
          });
          await page.waitForTimeout(2000);
          await page.keyboard.press("Backspace");
          await page.type(
            wl.whatIfGoalElrCompInputEditable,
            `${data[i].elrComp}`
          );
          await page.waitForTimeout(2000);
          await page.click(wl.whatIfGoalElrMaintInputEditable, {
            clickCount: 3,
          });
          await page.waitForTimeout(2000);
          await page.keyboard.press("Backspace");
          await page.type(
            wl.whatIfGoalElrMaintInputEditable,
            `${data[i].elrMaint}`
          );
          await page.waitForTimeout(2000);

          await page.click(wl.whatIfGoalElrRepairInputEditable, {
            clickCount: 3,
          });
          await page.waitForTimeout(2000);
          await page.keyboard.press("Backspace");
          await page.type(
            wl.whatIfGoalElrRepairInputEditable,
            `${data[i].elrRepair}`
          );
          await page.waitForTimeout(2000);

          await page.click(wl.saveButton);
          await page.waitForTimeout(25000);

          const inputCondition = [
            "three input null",
            "elr comp null",
            "elr maint null",
            "elr repair null",
          ];

          logger.info(`provide ${inputCondition[i]}`);

          await page
            .waitForSelector(wl.chart, {
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
            "elr comp input || elr maint input || elr repair is not enable for editing"
          );
          errors.push(
            "elr comp input || elr maint input || elr repair is not enable for editing"
          );
        }
      }
    } else {
      logger.error(
        "“What If” Opportunity Effective Labor Rate title verify failed"
      );
      errors.push(
        "“What If” Opportunity Effective Labor Rate title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in  Labor Opportunity Effective Labor Rate Page: ${errors.join(
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
fixedOpsOpportunityElrPageTest();
