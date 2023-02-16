import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { partsoverviewSelectors as po } from "../selectors/parts-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0167] ${site.name} FixedOps Parts Overview Navbar Expand Collapse Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0167]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewNavbarExpandCollapseTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Navbar Expand Collapse Test";
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

async function partsOverviewNavbarExpandCollapseTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    const parts_expand_collapse = await page.waitForSelector(po.partsMenuLink, {
      visible: true,
      timeout: 4000,
    });

    if (parts_expand_collapse != null) {
      logger.info("parts expand/collapse link visible!!!");
      await page.click(po.partsMenuLink);
      await page.waitForTimeout(4000);
      const elm = await page.$x(po.partsNavbar);
      const cname = await page.evaluate((el) => el.className, elm[0]);
      if (cname.toString() == "MuiCollapse-root MuiCollapse-entered") {
        logger.info("parts expand collapse link working properly");
        const partsLi = await page.$x(po.partsLi);
        for (let i = 1; i <= partsLi.length; i++) {
          const el = await page.$x(po.getPartsLi(i));
          const li = await el[0].getProperty("textContent");
          const elmObj = await page.waitForXPath(po.getPartsLi(i), {
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
                  )} link is visible under parts properly`
              )
            : [
                logger.info(
                  `${li
                    .toString()
                    .replace(
                      "JSHandle:",
                      ""
                    )} link is not visible under parts properly`
                ),
                errors.push(
                  `${li
                    .toString()
                    .replace(
                      "JSHandle:",
                      ""
                    )} link is not visible under parts properly`
                ),
              ];
        }
      } else {
        logger.info("parts expand collapse link not working properly");
        errors.push("parts expand collapse link not working properly");
      }
    } else {
      logger.error("parts expand collapse link not visible");
      errors.push("parts expand collapse link not visible");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Overview: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
