import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0095] ${site.name} FixedOps Labor Overview Page Expand Collapse Link Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0095",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOverviewPageExpandCollapseLinkTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Overview Page Expand Collapse Link Test";
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

async function laborOverviewPageExpandCollapseLinkTest(baseURL: string) {
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
    await page.waitForSelector(ls.laborOverview);
    await page.click(ls.laborOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();
    if (title == "CP Labor Overview") {
      logger.info("CP Labor Overview title verify success");

      const laborExpandCollapse = await page.waitForSelector(ls.labor, {
        visible: true,
        timeout: 4000,
      });

      if (laborExpandCollapse) {
        logger.info("labor expand/collapse link visible");
        const elm = await page.$x(ls.laborEc);
        const cname = await page.evaluate((el) => el.className, elm[0]);

        if (cname.toString() == "MuiCollapse-root MuiCollapse-entered") {
          logger.info("labor expand collapse link working properly");
          const laborLi = await page.$x(ls.laborLi);
          for (let i = 1; i <= laborLi.length; i++) {
            await page
              .waitForXPath(ls.getLi(i), {
                visible: true,
                timeout: 1000,
              })
              .then(async () => {
                const el = await page.$x(ls.getLi(i));
                const li = await el[0].getProperty("textContent");
                logger.info(
                  `${li
                    .toString()
                    .replace(
                      "JSHandle:",
                      ""
                    )} link is visible under labor properly`
                );
              })
              .catch(async () => {
                const el = await page.$x(ls.getLi(i));
                const li = await el[0].getProperty("textContent");
                logger.info(
                  `${li
                    .toString()
                    .replace(
                      "JSHandle:",
                      ""
                    )} link is not visible under labor properly`
                );
                errors.push(
                  `${li
                    .toString()
                    .replace(
                      "JSHandle:",
                      ""
                    )} link is not visible under labor properly`
                );
              });
          }
        } else {
          logger.info("labor expand collapse link not working properly");
          errors.push("labor expand collapse link not working properly");
        }
      } else {
        logger.error("labor expand collapse link not visible");
        errors.push("labor expand collapse link not visible");
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborOverviewTest();
