import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DetailSummerySelectors as de } from "../selectors/detail-summary.ts";
import { HomeSelectors as hs } from "../selectors/home.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDetailSummaryTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0041] ${site.name} FixedOps Detail Summary Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0041",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await detailSummaryPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Detail Summary Page Common Test";
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

async function detailSummaryPageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(15000);

    const role = Deno.env.get("ROLE");

    if (role?.includes("admin")) {
      const dataAsOfXpath = await page.$x(hs.dataAsOfXpath);
      const dataAsOf: string = await (
        await dataAsOfXpath[0].getProperty("textContent")
      ).jsonValue();

      const dataLoadMonth = dataAsOf.split(":")[1].split("/")[0].trim();

      await page.waitForSelector(de.armatusAdminLink);
      await page.click(de.armatusAdminLink);
      logger.info("armatus admin expand collapse link clicked");
      await page.waitForTimeout(4000);

      await page.waitForSelector(de.detailSummaryLink);
      await page.click(de.detailSummaryLink);
      await navigationPromise;
      await page.waitForTimeout(15000);
      logger.info("detail summery link clicked");

      const title = await page.title();

      if (title == "Detail Summary") {
        logger.info("detail summary title verify success");
        await page.waitForTimeout(2000);
        const heading = await page.$x(de.detailSummaryHeading);
        const pageHeading = await (
          await heading[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        if (pageHeading == "Detail Summary") {
          logger.info("detail summary heading verify success");

          await page
            .waitForSelector(de.curMonth, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info("current month display properly");
            })
            .catch(() => {
              logger.error("current month not display properly");
              errors.push("current month not display properly");
            });

          const curMonth = await page.$eval(
            de.curMonth,
            (element) => element.textContent
          );

          const actMonth = curMonth
            .toString()
            .split("-")[1]
            .split("-")[0]
            .trim();
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          monthNames[Number(dataLoadMonth) - 1] == actMonth
            ? logger.info("current month verify success")
            : [
                logger.error("current month verify failed"),
                errors.push("current month verify failed"),
              ];

          await page.waitForTimeout(2000);
          await page
            .waitForXPath(de.serviceDepartment, {
              visible: true,
              timeout: 2000,
            })
            .then(() => {
              logger.info("service department visible properly");
            })
            .catch(() => {
              logger.error("service department not visible properly");
              errors.push("service department not visible properly");
            });

          await page.waitForTimeout(2000);
          const dp = await page.$x(de.datePicker);
          await dp[0].click();
          await page.waitForTimeout(4000);
          const currentYear = new Date().getFullYear();
          const previousYear = currentYear - 1;
          const yr = await page.$x(de.getYear(previousYear));
          await yr[0].click();
          await page.waitForTimeout(4000);

          const mXpath = await page.$x(de.month);
          await mXpath[0].click();
          await page.waitForTimeout(4000);

          let i = 1;
          let num2;
          let flag = 0;

          do {
            num2 = await getRandomNumberBetween(1, 12);
            const mn = await page.$x(de.getMonth(num2));
            const mCls: string = await (
              await mn[0].getProperty("className")
            ).jsonValue();

            if (
              mCls ==
                "MuiTypography-root MuiPickersMonth-root MuiTypography-subtitle1" ||
              mCls ==
                "MuiTypography-root MuiPickersMonth-root MuiPickersMonth-monthSelected MuiTypography-h5 MuiTypography-colorPrimary"
            ) {
              await page.waitForTimeout(2000);
              flag = 1;
              await mn[0].click();
              await page.waitForTimeout(2000);
            } else {
              i++;
            }
            if (flag == 1) {
              break;
            }
          } while (i > 0);
          await page.waitForTimeout(5000);
          await page
            .$eval(de.table, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info("data table display properly");
            })
            .catch(() => {
              logger.error("data table not display properly");
              errors.push("data table not display properly");
            });
        } else {
          logger.error("detail summary heading verify failed");
          errors.push("detail summary heading verify failed");
        }
      } else {
        logger.error("detail summary title verify failed");
        errors.push("detail summary title verify failed");
      }
    } else {
      logger.warn(
        "role is not admin!,please provide admin as role for further testing"
      );
    }

    ts.assert(
      errors.length == 0,
      `Error in Detail Summary Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDetailSummaryTest();
