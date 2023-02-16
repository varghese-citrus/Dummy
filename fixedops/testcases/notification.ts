import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { HeaderFooterSelectors as hs } from "../selectors/header-footer.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsNotificationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Notification Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[DEMO-TEST]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await notificationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Notification Test";
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

async function notificationTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(12000);
    const notificationIcon = await page.waitForSelector(hs.notificationIcon, {
      visible: true,
      timeout: 4000,
    });
    await page.waitForTimeout(4000);
    if (notificationIcon != null) {
      logger.info("notification icon present");
      const notCnt = await page.$x(hs.notificationCount);
      const count: string = await (
        await notCnt[0].getProperty("textContent")
      ).jsonValue();
      if (Number(count) >= 1) {
        await page.click(hs.notificationIcon);
        const notificationPopup = await page.waitForSelector(
          hs.notificationPopup,
          {
            visible: true,
            timeout: 4000,
          }
        );
        await page.waitForTimeout(5000);
        if (notificationPopup != null) {
          logger.info("notification popup present");
          await page.waitForTimeout(5000);
          await page
            .waitForXPath(hs.errMsgSpan1)
            .then(async () => {
              const msgSpan1 = await page.$x(hs.errMsgSpan1);
              const notificationMsg: string = await (
                await msgSpan1[0].getProperty("textContent")
              ).jsonValue();

              if (notificationMsg.includes("Unmapped Opcodes found")) {
                const fixBtn1 = await page.$x(hs.fixBtn1);
                await fixBtn1[0].click();
                await page.waitForTimeout(12000);
                const title = await page.title();

                title == "Opcode Categorizations"
                  ? logger.info("unmapped opcodes fix navigation success")
                  : [
                      logger.error("unmapped opcodes fix navigation failed"),
                      errors.push("unmapped opcodes fix navigation failed"),
                    ];
              } else {
                const fixBtn1 = await page.$x(hs.fixBtn1);
                await fixBtn1[0].click();
                await page.waitForTimeout(12000);
                const title = await page.title();

                title == "Pay Types"
                  ? logger.info("unmapped pay types fix navigation success")
                  : [
                      logger.error("unmapped pay types fix navigation failed"),
                      errors.push("unmapped pay types fix navigation failed"),
                    ];
              }
            })
            .catch(() => {
              logger.warn("error message span 1 not found");
            });
          await page
            .waitForXPath(hs.errMsgSpan2)
            .then(async () => {
              const msgSpan1 = await page.$x(hs.errMsgSpan2);
              const notificationMsg: string = await (
                await msgSpan1[0].getProperty("textContent")
              ).jsonValue();

              if (notificationMsg.includes("Unmapped Opcodes found")) {
                const fixBtn2 = await page.$x(hs.fixBtn2);
                await fixBtn2[0].click();
                await page.waitForTimeout(12000);
                const title = await page.title();

                title == "Opcode Categorizations"
                  ? logger.info("unmapped opcodes fix navigation success")
                  : [
                      logger.error("unmapped opcodes fix navigation failed"),
                      errors.push("unmapped opcodes fix navigation failed"),
                    ];
              } else {
                const fixBtn2 = await page.$x(hs.fixBtn2);
                await fixBtn2[0].click();
                await page.waitForTimeout(12000);
                const title = await page.title();

                title == "Pay Types"
                  ? logger.info("unmapped pay types fix navigation success")
                  : [
                      logger.error("unmapped pay types fix navigation failed"),
                      errors.push("unmapped pay types fix navigation failed"),
                    ];
              }
            })
            .catch(() => {
              logger.warn("error message span 2 not found");
            });
        } else {
          logger.error("notification popup not present");
          errors.push("notification popup not present");
        }
      } else {
        logger.warn("there is no notification");
      }
    } else {
      logger.error("notification icon not present");
      errors.push("notification icon not present");
    }
    ts.assert(
      errors.length == 0,
      `Error in notification test: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsNotificationTest();
