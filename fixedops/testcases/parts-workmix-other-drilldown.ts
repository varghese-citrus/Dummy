import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsWorkmixOtherSelectors as po } from "../selectors/parts-workmix-other.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixOtherTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0201] ${site.name} FixedOps Parts Workmix Other Page Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0201",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixOtherPageDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Workmix Other Page Drill Down Test";
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

async function partsWorkmixOtherPageDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(po.parts);
    await page.click(po.parts);
    logger.info("parts expand collapse link clicked");
    await navigationPromise;
    await page.waitForTimeout(5000);
    await page.waitForSelector(po.partsWorkmixOtherLink);
    await page.click(po.partsWorkmixOtherLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("parts workmix other link clicked");

    const title = await page.title();

    if (title == "Parts Work Mix Other") {
      logger.info("Parts Work Mix Other title verify success");
      const toggleBtn = [
        po.tglBtn_1,
        po.tglBtn_2,
        po.tglBtn_3,
        po.tglBtn_4,
        po.tglBtn_5,
      ];
      logger.info("Parts Work Mix Other page title verify success");
      await page.waitForTimeout(4000);
      const element = [
        po.partsWorkmixOtherHeading,
        po.partsWorkmixOtherDataAsOf,
        po.partsWorkmixOtherResetBtn,
        po.partsWorkmixOtherDownloadIcon,
      ];
      const elementNames = [
        "heading",
        "data as of",
        "reset button",
        "download icon",
      ];

      for (let i = 0; i <= element.length - 1; i++) {
        await page.waitForTimeout(2000);
        await page
          .waitForXPath(element[i], {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info(
              `parts workmix other ${elementNames[i]} display properly`
            );
          })
          .catch(() => {
            logger.error(
              `parts workmix other ${elementNames[i]} not display properly`
            );
            errors.push(
              `parts workmix other ${elementNames[i]} not display properly`
            );
          });
        await page.waitForTimeout(2000);
      }

      await page
        .$eval(po.dataTable, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info(
            "data table display properly under parts workmix other page"
          );
        })
        .catch(() => {
          logger.error(
            "data table not display properly under parts workmix other page"
          );
          errors.push(
            "data table not display properly under parts workmix other page"
          );
        });
      await page.waitForTimeout(4000);
      await page.mouse.click(263, 297, { button: "left" });
      await navigationPromise;
      logger.info("row data clicked");
      await page.waitForTimeout(15000);

      const pageTitle = await page.title();
      if (pageTitle == "Parts Work Mix") {
        logger.info("enters into opcode summery");
        await page.waitForTimeout(2000);

        await page
          .$eval(po.dataTable, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info("data table display properly under opcode summery tab");
          })
          .catch(() => {
            logger.error(
              "data table not display properly under opcode summery tab"
            );
            errors.push(
              "data table not display properly under opcode summery tab"
            );
          });

        await page.mouse.click(348, 365, { button: "left" });
        await navigationPromise;
        logger.info("row data clicked");
        await page.waitForTimeout(20000);

        const attr = await page.$eval(po.opcodeDetailedViewTab, (element) =>
          element.getAttribute("aria-selected")
        );

        if (attr.toString() == "true") {
          logger.info("enters into opcode detail view");
          await page.waitForTimeout(5000);

          await page
            .$eval(po.dataTable, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info(
                "data table display properly under opcode detail view tab"
              );
            })
            .catch(() => {
              logger.error(
                "data table not display properly under opcode detail view tab"
              );
              errors.push(
                "data table not display properly under opcode detail view tab"
              );
            });

          await page.mouse.click(896, 360, { button: "left" });
          await navigationPromise;
          logger.info("row data clicked");
          await page.waitForTimeout(15000);

          let pageTitle = await page.title();
          await page.waitForTimeout(5000);
          if (pageTitle == "Search by Ro") {
            logger.info("Search by Ro title verify success");

            await page
              .$eval(po.repairOrderTable, (elem) => {
                return elem.style.display !== "none";
              })
              .then(() => {
                logger.info("repair order table visible properly");
              })
              .catch(() => {
                logger.error("repair order table not visible properly");
                errors.push("repair order table not visible properly");
              });
            await page.waitForTimeout(5000);
            let i = 1;
            let tglNum!: number;
            do {
              try {
                tglNum = await getRandomNumberBetween(0, 4);
                await page.waitForTimeout(2000);
                const btn = await page.waitForXPath(toggleBtn[tglNum], {
                  visible: true,
                  timeout: 2000,
                });

                if (btn) {
                  break;
                }
              } catch (error) {
                const errors: string[] = [];
                errors.push(error);
                const e = errors.find((x) => x === error);
                if (e) {
                  i++;
                }
              }
            } while (i > 0);
            await page.waitForTimeout(2000);
            const tglBtn = await page.$x(toggleBtn[tglNum]);
            await tglBtn[0].click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            pageTitle = await page.title();
            pageTitle == "Labor Work Mix"
              ? logger.info("parts workmix other drill down cycle success")
              : [
                  logger.error("parts workmix other drill down cycle failed"),
                  errors.push("parts workmix other drill down cycle failed"),
                ];
          } else {
            logger.warn("there is no row data for drill down!");
          }
        } else {
          logger.warn("there is no row data for drill down!");
        }
      } else {
        logger.warn("there is no row data for drill down!");
      }
    } else {
      logger.error("Parts Work Mix Other page title verify failed");
      errors.push("Parts Work Mix Other page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Workmix Other Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixOtherTest();
