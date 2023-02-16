import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { OtherlabourworkmixSelectors as olws } from "../selectors/other_labor_work_mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsOtherLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0148] ${site.name} Other Labor Work Mix Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0148",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await otherLaborWorkMixTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Other Labor Work Mix Test";
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

async function otherLaborWorkMixTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(8000);
    await page.waitForSelector(olws.Labor);
    await page.click(olws.Labor);
    logger.info("Labour Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(olws.other_labor_work_mix);
    await page.click(olws.other_labor_work_mix);
    logger.info("Other labor work mix Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    logger.info(actual_title);

    if (actual_title == "Labor Work Mix Other") {
      logger.info("Other labor work mix page is visible");
      const H_text = await page.$x(olws.heading_text);
      const Heading_text_displayed: string = await (
        await H_text[0].getProperty("textContent")
      ).jsonValue();
      Heading_text_displayed.replace(/(\r\n|\n|\r)/gm, "").trim() ==
      "Labor Work Mix  Other"
        ? logger.info("Other Labor Work Mix-heading text  is visible!!!")
        : [
            logger.error("Other Labor Work Mix-heading text  is visible!!!"),
            errors.push(
              "Other Labor Work Mix-heading text  is  not visible!!!"
            ),
          ];

      const elements = [
        olws.Export_To_Excel,
        olws.Reset_Layout,
        olws.as_of_date_display,
        olws.ranking_per_row,
      ];

      const elementsNames = [
        "download icon",
        "reset layout button",
        "data as of",
        "ranking per row",
      ];

      for (let i = 0; i < elements.length; i++) {
        await page
          .waitForXPath(elements[i], { visible: true, timeout: 4000 })
          .then(() => {
            logger.info(`${elementsNames[i]} visible properly`);
          })
          .catch(() => {
            logger.error(`${elementsNames[i]} not visible properly`);
            errors.push(`${elementsNames[i]} not visible properly`);
          });
      }
      await page.waitForSelector(olws.type_listbox);
      await page.click(olws.type_listbox);
      logger.info("Type_listbox clicked !!!");
      await page.waitForTimeout(4000);
      for (let i = 2; i <= 6; i++) {
        const list = olws.type_list_items(i);
        const item = await page.$x(list);
        const cname = await page.evaluate((item) => item.className, item[0]);
        await page.waitForTimeout(15000);
        if (
          cname
            .toString()
            .includes(
              "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
            )
        ) {
          logger.info(`list-items ${i} displays  properly`);
          await page
            .$eval(olws.data_table, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info("list-items  data table displays  properly");
            })
            .catch(() => {
              logger.error(
                "list-items   data tables are not displayed properly"
              );
              errors.push("list-items  data table are not displayed properly");
            });
        } else {
          logger.error("list-items  ${i} not displayed properly");
          errors.push("list-items ${i} not displayed properly");
        }
      }
      await page.waitForSelector(olws.workmix_listbox);
      await page.click(olws.workmix_listbox);
      logger.info("Workmix%_listbox clicked");
      await page.waitForTimeout(6000);
      const workmixtablenegative = await page.$eval(olws.data_table, (elem) => {
        return elem.style.display !== "none";
      });
      await page.click(olws.workmix_listbox);
      await page.waitForTimeout(2000);
      await page.waitForSelector(olws.workmix_positive);
      await page.click(olws.workmix_positive);
      logger.info("Workmix%_positive clicked");
      await page.waitForTimeout(6000);
      const workmixtablepositive = await page.$eval(olws.data_table, (elem) => {
        return elem.style.display !== "none";
      });
      workmixtablenegative && workmixtablepositive
        ? logger.info(
            "work mix for positive and negative percentage loaded properly"
          )
        : [
            logger.error(
              "work mix for positive and negative percentage are not loaded properly"
            ),
            errors.push(
              "work mix for positive and negative percentage are not loaded properly"
            ),
          ];
    } else {
      logger.error("Other labor work mix  page is not available!!!");
      errors.push("Other labor work mix  page is not available");
    }
    ts.assert(
      errors.length == 0,
      `Error in Other labor work mix  Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOtherLaborWorkMixTest();
