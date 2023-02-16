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
      name: `[AEC-FOCP-UI-FN-LD-0159] ${site.name} FixedOps Parts Overview Chart Names and Ids Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0159]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewChartNamesandIdsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Chart Names and Ids Test";
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

async function partsOverviewChartNamesandIdsTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    const chartDetails = [
      { id: 1049, name: "CP Parts Revenue" },
      { id: 952, name: "CP Parts Gross Profit" },
      { id: 966, name: "CP Parts Gross Profit Percentage" },
      { id: 953, name: "CP Parts Revenue Per RO" },
      { id: 916, name: "CP Parts Markup" },
      { id: 1143, name: "CP RO Count" },
      { id: 1318, name: "CP Hours Per RO - Parts Only" },
      { id: 1326, name: "CP RO Count - Parts Only" },
      { id: 1334, name: "CP Parts Markup - Repair and Competitive" },
    ];
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await navigationPromise;
    await page.waitForTimeout(4000);
    logger.info("parts menu clicked");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    logger.info("parts overview");
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Parts Overview") {
      logger.info("title verify success");
      for (let i = 0; i <= chartDetails.length - 1; i++) {
        const chartNameXpath = await page.$x(po.chartName(i + 1));
        const chartIdXpath = await page.$x(po.chartId(i + 1));
        await page.waitForTimeout(5000);
        const chartName: string = await (
          await chartNameXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);
        const chartId = await (
          await chartIdXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);
        const data = chartDetails[i];
        chartName == data.name && chartId == data.id
          ? logger.info(
              `chart name ${chartName} and number ${chartId} verify success`
            )
          : [
              logger.error(
                `chart name ${chartName} and number ${chartId} verify failed`
              ),
              errors.push(
                `chart name ${chartName} and number ${chartId} verify failed`
              ),
            ];
      }
    } else {
      logger.error("title verify failed");
      errors.push("title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Overview: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
