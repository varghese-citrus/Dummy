import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsCpOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0035] ${site.name} FixedOps CP Summary Overview Page Expand Collapse Link Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0035",
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

    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("cp expand collapse link clicked!!!");
    await page.waitForTimeout(4000);

    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Summary Overview") {
      logger.info("CP Summary  Overview title verify success");

      const cp_expand_collapse = await page.waitForSelector(cps.cpsummary, {
        visible: true,
        timeout: 4000,
      });

      if (cp_expand_collapse != null) {
        logger.info("cp expand/collapse link visible!!!");

        const elm = await page.$x(cps.cpEc);
        const cname = await page.evaluate((el) => el.className, elm[0]);

        if (cname.toString() == "MuiCollapse-root MuiCollapse-entered") {
          logger.info("cp expand collapse link working properly");

          const cpsummaryLi = await page.$x(cps.cpLi);

          for (let i = 1; i <= cpsummaryLi.length; i++) {
            const el = await page.$x(cps.getLi(i));

            const li = await el[0].getProperty("textContent");

            const elmObj = await page.waitForXPath(cps.getLi(i), {
              visible: true,
              timeout: 1000,
            });

            elmObj != null
              ? logger.info(
                  `${li
                    .toString()
                    .replace(
                      "JSHandle:",
                      ""
                    )} link is visible under cp properly`
                )
              : [
                  logger.info(
                    `${li
                      .toString()
                      .replace(
                        "JSHandle:",
                        ""
                      )} link is not visible under cp properly`
                  ),
                  errors.push(
                    `${li
                      .toString()
                      .replace(
                        "JSHandle:",
                        ""
                      )} link is not visible under cp properly`
                  ),
                ];
          }
        } else {
          logger.info("cp expand collapse link not working properly");
          errors.push("cp expand collapse link not working properly");
        }
      } else {
        logger.error("cp expand collapse link not visible");
        errors.push("cp expand collapse link not visible");
      }
    } else {
      logger.error("cp overview page title verify failed");
      errors.push("cp overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in CP Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCpOverviewTest();
