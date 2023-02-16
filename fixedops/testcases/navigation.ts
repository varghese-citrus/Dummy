import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { NavigationSelectors as ns } from "../selectors/navigation.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsNavigationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0143] ${site.name} FixedOps Navigation Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0143]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await navigationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Navigation Test";
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

async function navigationTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(8000);
    const expand_collapse_link = await page.waitForSelector(ns.expandCollapse, {
      visible: true,
      timeout: 4000,
    });
    if (expand_collapse_link != null) {
      logger.info("expand link visible!!!");
      page.reload();
      await navigationPromise;
      await page.waitForTimeout(12000);
      await page.waitForSelector(ns.expandCollapse);
      await page.click(ns.expandCollapse);
      logger.info("expand collapse link clicked!!!");
      await page.waitForTimeout(4000);
      const role = Deno.env.get("ROLE");
      const ids = [ns.navLi_1, ns.navLi_2, ns.navLi_3, ns.navLi_4, ns.navLi_5];
      const nav = [
        "customer pay",
        "labor",
        "parts",
        "reference and setups",
        "armatus admin",
      ];
      for (let i = 0; i <= ids.length - 1; i++) {
        if (role == "admin") {
          const xpath = ids[i];
          const el = await page.$x(xpath);
          const attr = await page.evaluate(
            (el) => el.getAttribute("label"),
            el[0]
          );
          await page.waitForTimeout(5000);
          attr.toString().includes("expanded")
            ? logger.info(`expand collapse working properly under ${nav[i]}`)
            : [
                logger.error(
                  `expand collapse not working properly under ${nav[i]}`
                ),
                errors.push(
                  `expand collapse not working properly under ${nav[i]}`
                ),
              ];
        } else {
          if (i == 4) {
            continue;
          } else {
            const xpath = ids[i];
            const el = await page.$x(xpath);
            const attr = await page.evaluate(
              (el) => el.getAttribute("label"),
              el[0]
            );
            await page.waitForTimeout(5000);
            attr.toString().includes("expanded")
              ? logger.info(`expand collapse working properly under ${nav[i]}`)
              : [
                  logger.error(
                    `expand collapse not working properly under ${nav[i]}`
                  ),
                  errors.push(
                    `expand collapse not working properly under ${nav[i]}`
                  ),
                ];
          }
        }
      }
      const favorite_link = await page.waitForSelector(ns.favorites, {
        visible: true,
        timeout: 4000,
      });

      if (favorite_link != null) {
        await page.click(ns.favorites);
        await navigationPromise;
        await page.waitForTimeout(12000);
        const title = await page.title();
        title == "MyFavorites"
          ? logger.info("favorite navigation link working properly!!!")
          : [
              logger.error("favorite navigation link not working properly!!!"),
              errors.push("favorite navigation link not working properly!!!"),
            ];
      } else {
        logger.error("favorite navigation link is not present in the page!!!");
        errors.push("favorite navigation link is not present in the page!!!");
      }
      if (role == "admin") {
        await page.waitForTimeout(5000);
        await page
          .waitForSelector(ns.Armatus_Admin, { visible: true, timeout: 4000 })
          .then(() => {
            logger.info("Armatus drop down visible");
          })
          .catch(() => {
            logger.error("Armatus drop down  is not visible");
            errors.push("Armatus drop down  is not visible");
          });
        await page.waitForTimeout(5000);
      } else {
        logger.info("Role is not administrator!!!");
      }
      ts.assert(
        errors.length == 0,
        `Error in Parts wty Model Page:${errors.join("\n")}`
      );
    }
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsNavigationTest();
