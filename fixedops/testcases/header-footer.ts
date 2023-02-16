import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { HomeSelectors as hs } from "../selectors/home.ts";
import { LoginSelectors as lg } from "../selectors/login.ts";
import { HeaderFooterSelectors as hf } from "../selectors/header-footer.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsHeaderFooterTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0067] ${site.name} FixedOps Header Footer Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0067",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await headerFooterTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Header Footer Test";
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

async function headerFooterTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;

    await page
      .$$eval(hs.logo, (imgs) =>
        imgs
          .map((img) => img.getAttribute("src"))
          .includes("/images/logos/armatus-new-logo.png")
      )
      .then(() => {
        logger.info("Header logo is present");
      })
      .catch(() => {
        logger.error("Header logo is not preset");
        errors.push("Header logo is not preset");
      });
    await page.waitForTimeout(4000);
    await page
      .waitForSelector(hf.supportBtn, { visible: true, timeout: 4000 })
      .then(async () => {
        logger.info("support and feedback icon present");
        await page.click(hf.supportBtn);
        await page.waitForTimeout(5000);
        const sfTitle = await page.$eval(
          hf.sfTitle,
          (element) => element.textContent
        );
        sfTitle.toString() == "Support & Feedback"
          ? logger.info("Support & Feedback popup present")
          : [
              logger.error("Support & Feedback popup not present"),
              errors.push("Support & Feedback popup not present"),
            ];
        await page.waitForSelector(hf.sfCloseBtn);
        await page.click(hf.sfCloseBtn);
      })
      .catch(() => {
        logger.error("support and feedback icon not present");
        errors.push("support and feedback icon not present");
      });
    await page
      .$$eval(hf.footerLogo, (imgs) =>
        imgs
          .map((img) => img.getAttribute("src"))
          .includes("/images/logos/armatus-logo-footer.png")
      )
      .then(() => {
        logger.info("footer logo is present");
      })
      .catch(() => {
        logger.error("footer logo is not present");
        errors.push("footer logo is not present");
      });

    await page
      .waitForXPath(hf.appTitle, { visible: true, timeout: 4000 })
      .then(async () => {
        logger.info("fixedOps heading element visible properly");
        const [mainTitle] = await page.$x(hf.appTitle);
        const heading: string = await (
          await mainTitle.getProperty("textContent")
        ).jsonValue();
        heading.toString() == "Fixed Ops Performance Center"
          ? logger.info("FixedOps Heading verify success")
          : [
              logger.error("FixedOps Heading verify failed"),
              errors.push("FixedOps Heading verify failed"),
            ];
      })
      .catch(() => {
        logger.info("fixedOps heading element not visible properly");
        errors.push("fixedOps heading element not visible properly");
      });

    const role = Deno.env.get("ROLE");

    if (role?.includes("admin") || role?.includes("user")) {
      await page
        .waitForSelector(hs.notificationIcon, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("notification icon present");
        })
        .catch(() => {
          logger.error("notification icon not present");
          errors.push("notification icon not present");
        });
      await page.waitForTimeout(5000);
      await page
        .waitForSelector(hf.storeChangeButton)
        .then(async () => {
          await page.click(hf.storeChangeButton);
          await navigationPromise;
          await page.waitForTimeout(8000);

          const dropDown = await page.$x(hf.dD);
          await dropDown[0].click();
          await page.waitForTimeout(4000);

          const storeLi = await page.$x(hf.storeSelectLi);
          const num = await getRandomNumberBetween(1, storeLi.length);
          const store = await page.$x(hf.getStore(num));
          const storeName: string = await (
            await store[0].getProperty("textContent")
          ).jsonValue();
          await store[0].click();
          await page.waitForTimeout(5000);

          await page.click(lg.btnViewDashborad);
          await navigationPromise;
          await page.waitForTimeout(10000);

          const storeHeading = await page.$x(hf.changeStore);
          const stName: string = await (
            await storeHeading[0].getProperty("textContent")
          ).jsonValue();

          storeName.trim().includes(stName.trim())
            ? logger.info("change store success")
            : [
                logger.error("change store not success"),
                errors.push("change store not success"),
              ];
        })
        .catch(() => {
          logger.warn("store change not present due to single store");
        });

      const vXpath = await page.$x(hf.versionNavbar);
      const v: string = await (
        await vXpath[0].getProperty("textContent")
      ).jsonValue();

      const fXpath = await page.$x(hf.versionFooter);
      const copyRightTxt: string = await (
        await fXpath[0].getProperty("textContent")
      ).jsonValue();

      const tt = copyRightTxt
        .replace(
          "Copyright @ 2023 /Armatus Dealer Uplift / All Rights Reserved.",
          ""
        )
        .trim();
      const arr = [];
      arr.push(v);
      arr.push(copyRightTxt);
      arr.filter((e) => {
        e.includes(tt);
      })
        ? logger.info("version checked success")
        : [
            logger.error("version checked fail"),
            errors.push("version checked fail"),
          ];

      const date = new Date();
      const copyright = `Copyright @ ${date.getFullYear()} /Armatus Dealer Uplift / All Rights Reserved. ${v.trim()}`;
      console.log(copyRightTxt);
      console.log(copyright);
      arr.filter((e) => {
        e.includes(copyright);
      })
        ? logger.info("footer copyright verify success")
        : [
            logger.error("footer copyright verify fail"),
            errors.push("footer copyright verify fail"),
          ];
    } else {
      await page.waitForTimeout(5000);
      await page
        .waitForSelector(hf.storeChangeButton)
        .then(async () => {
          await page.click(hf.storeChangeButton);
          await navigationPromise;
          await page.waitForTimeout(8000);

          const dropDown = await page.$x(hf.dD);
          await dropDown[0].click();
          await page.waitForTimeout(4000);

          const storeLi = await page.$x(hf.storeSelectLi);
          const num = await getRandomNumberBetween(1, storeLi.length);
          const store = await page.$x(hf.getStore(num));
          const storeName: string = await (
            await store[0].getProperty("textContent")
          ).jsonValue();
          await store[0].click();
          await page.waitForTimeout(5000);

          await page.click(lg.btnViewDashborad);
          await navigationPromise;
          await page.waitForTimeout(10000);

          const storeHeading = await page.$x(hf.changeStore);
          const stName: string = await (
            await storeHeading[0].getProperty("textContent")
          ).jsonValue();

          storeName.trim().includes(stName.trim())
            ? logger.info("change store success")
            : [
                logger.error("change store not success"),
                errors.push("change store not success"),
              ];
        })
        .catch(() => {
          logger.warn(
            "store change not present due to single store || client have only one store access privilege"
          );
        });

      const vXpath = await page.$x(hf.versionNavbar);
      const v: string = await (
        await vXpath[0].getProperty("textContent")
      ).jsonValue();

      const fXpath = await page.$x(hf.versionFooter);
      const copyRightTxt: string = await (
        await fXpath[0].getProperty("textContent")
      ).jsonValue();

      const tt = copyRightTxt
        .replace(
          "Copyright @ 2022 /Armatus Dealer Uplift / All Rights Reserved.",
          ""
        )
        .trim();

      v.trim().includes(tt)
        ? logger.info("version checked success")
        : [
            logger.error("version checked fail"),
            errors.push("version checked fail"),
          ];
      const date = new Date();
      const copyright = `Copyright @ ${date.getFullYear()} /Armatus Dealer Uplift / All Rights Reserved. ${v.trim()}`;
      copyRightTxt.includes(copyright)
        ? logger.info("footer copyright verify success")
        : [
            logger.error("footer copyright verify fail"),
            errors.push("footer copyright verify fail"),
          ];
    }
    ts.assert(
      errors.length == 0,
      `Error in Header and Footer: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsHeaderFooterTest();
