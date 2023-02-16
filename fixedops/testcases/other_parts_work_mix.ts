import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { OtherpartsworkmixSelectors as opws } from "../selectors/other_parts_work_mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();
function fixedOpsotherpartsworkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0149] ${site.name} Fixedops Other Parts Work Mix Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0149",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await otherpartsworkmixTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Fixedops Other Parts Work Mix Test";
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

async function otherpartsworkmixTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(8000);
    await page.waitForSelector(opws.Parts);
    await page.click(opws.Parts);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(opws.other_parts_work_mix);
    await page.click(opws.other_parts_work_mix);
    logger.info("Other parts work mix Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    logger.info(actual_title);

    if (actual_title == "Parts Work Mix Other") {
      logger.info("Other parts work mix page is visible");
      const H_text = await page.$x(opws.heading_text);
      const Heading_text_displayed: string = await (
        await H_text[0].getProperty("textContent")
      ).jsonValue();
      Heading_text_displayed.replace(/(\r\n|\n|\r)/gm, "").trim() ==
      "Parts Work Mix  Other"
        ? logger.info("Other Parts Work Mix-heading text  is visible!!!")
        : [
            logger.error(
              "Other Parts Work Mix-heading text  is not visible!!!"
            ),
            errors.push(
              "Other Parts Work Mix-heading text  is  not visible!!!"
            ),
          ];
      const elements = [
        opws.Export_To_Excel,
        opws.Reset_Layout,
        opws.as_of_date_display,
        opws.ranking_per_row,
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
      const ranking_bar_display = await page.$x(opws.ranking_bar);
      ranking_bar_display != null
        ? logger.info("ranking bar with high and low indicators are present!!!")
        : [
            logger.error("ranking bar and indicators are  not  present!!!"),
            errors.push("ranking bar and indicators are  not  present!!!"),
          ];
      await page.waitForSelector(opws.type_listbox);
      await page.click(opws.type_listbox);
      logger.info("Type_listbox clicked !!!");
      await page.waitForTimeout(4000);
      for (let i = 2; i <= 6; i++) {
        const list = opws.type_list_items(i);
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
          logger.info(` list-items ${i} displays  properly`);
          await page
            .$eval(opws.data_table, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info("list-items  data table displays  properly");
            })
            .catch(() => {
              logger.error(
                "list-items   data tables are not displayed properly"
              );
              errors.push("list-items   data table are not displayed properly");
            });
        } else {
          logger.error("list-items  ${i} not displayed properly");
          errors.push("list-items ${i} not displayed properly");
        }
      }
      await page.waitForSelector(opws.workmix_listbox);
      await page.click(opws.workmix_listbox);
      logger.info("Workmix%_listbox clicked !!!");
      await page.waitForTimeout(6000);
      const workmixtablenegative = await page.$eval(opws.data_table, (elem) => {
        return elem.style.display !== "none";
      });
      await page.click(opws.workmix_listbox);
      await page.waitForTimeout(2000);
      await page.waitForSelector(opws.workmix_positive);
      await page.click(opws.workmix_positive);
      logger.info("Workmix%_positive clicked !!!");
      await page.waitForTimeout(6000);
      const workmixtablepositive = await page.$eval(opws.data_table, (elem) => {
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
      logger.error("Other parts work mix  page is not available!!!");
      errors.push("Other parts work mix  page is not available");
    }
    ts.assert(
      errors.length == 0,
      `Error in Other parts work mix  Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsotherpartsworkmixTest();
