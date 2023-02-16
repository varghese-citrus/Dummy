import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { FavoriteSelectors as fs } from "../selectors/favorite.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, dragAndDrop } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsFavoriteTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Favorite Page Drag Drop Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "DEMO-TEST",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await favoritePageDragDropTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Favorite Page Drag Drop Test";
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

async function favoritePageDragDropTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(fs.favoriteLink);
    await page.click(fs.favoriteLink);
    await navigationPromise;
    await page.waitForTimeout(10000);
    logger.info("favorite link clicked");
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "MyFavorites") {
      logger.info("My favorites page title verify success");

      const canvas = [fs.canvas_1, fs.canvas_2];
      const ids = [fs.addRemoveBtn_1, fs.addRemoveBtn_2];

      const [favHeading] = await page.$x(fs.favoriteHeading);
      await page.waitForTimeout(2000);
      const heading: string = await (
        await favHeading.getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(2000);
      if (heading == "My Favorites") {
        logger.info("heading verify success");

        await page
          .waitForXPath(fs.msgDiv, {
            visible: true,
            timeout: 4000,
          })
          .then(async () => {
            logger.info("info message element present");

            const [msgDiv] = await page.$x(fs.msgDiv);
            await page.waitForTimeout(2000);
            const msg: string = await (
              await msgDiv.getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);

            if (
              msg ==
              "There are no favorites added. Please click on  to add charts to favorites"
            ) {
              logger.info("info message verify success");
              await page.waitForTimeout(2000);

              await page.click(fs.laborLink);
              await page.waitForTimeout(4000);
              logger.info("labor nav link clicked");

              for (let i = 0; i <= canvas.length - 1; i++) {
                await page.waitForSelector(fs.laborOverviewLink);
                await page.click(fs.laborOverviewLink);
                await navigationPromise;
                await page.waitForTimeout(8000);
                logger.info("labor overview link clicked");

                let addRemBtn = await page.$x(ids[i]);
                await page.waitForTimeout(5000);

                const btnStatus: string = await (
                  await addRemBtn[0].getProperty("title")
                ).jsonValue();
                await page.waitForTimeout(2000);

                if (btnStatus.includes("Add to Favorites")) {
                  logger.info("add/remove button status verify success");
                  addRemBtn = await page.$x(ids[i]);
                  await addRemBtn[0].click();
                  await page.waitForTimeout(5000);
                  logger.info("add/remove button clicked");
                  await page.click(fs.favoriteLink);
                  await navigationPromise;
                  await page.waitForTimeout(10000);
                  logger.info("favorite link clicked");

                  const chart = await page.$eval(canvas[i], (elem) => {
                    return elem.style.display !== "none";
                  });
                  await page.waitForTimeout(5000);
                  chart
                    ? logger.info(`chart ${i + 1} added to favorite success`)
                    : [logger.info(`chart ${i + 1} added to favorite fail`)];
                } else {
                  logger.info("charts already added to favorite");
                }
              }

              await page.waitForTimeout(2000);

              let selector = await page.waitForSelector(canvas[0]);
              const defaultPositionElement_1 = await page.evaluate((el) => {
                const { x, y } = el.getBoundingClientRect();
                return { x, y };
              }, selector);

              await page.waitForTimeout(5000);

              await dragAndDrop(page, canvas[0], canvas[1]);
              await page.waitForTimeout(8000);

              selector = await page.waitForSelector(canvas[0]);
              const currentPosition = await page.evaluate((el) => {
                const { x, y } = el.getBoundingClientRect();
                return { x, y };
              }, selector);

              if (
                (currentPosition.x != defaultPositionElement_1.x &&
                  currentPosition.y != defaultPositionElement_1.y) ||
                (currentPosition.x == defaultPositionElement_1.x &&
                  currentPosition.y != defaultPositionElement_1.y) ||
                (currentPosition.x != defaultPositionElement_1.x &&
                  currentPosition.y == defaultPositionElement_1.y)
              ) {
                logger.info("graph dropped success");
                await page.waitForSelector(fs.resetBtn);
                await page.click(fs.resetBtn);
                await page.waitForTimeout(8000);
                logger.info("reset button clicked");
                selector = await page.waitForSelector(canvas[0]);
                const position = await page.evaluate((el) => {
                  const { x, y } = el.getBoundingClientRect();
                  return { x, y };
                }, selector);
                await page.waitForTimeout(5000);

                position.x == defaultPositionElement_1.x &&
                position.y == defaultPositionElement_1.y
                  ? logger.info(
                      "graphs drag and drop and reset button functionality working success"
                    )
                  : [
                      logger.error(
                        "graphs drag and and reset button functionality drop working fail"
                      ),
                      errors.push(
                        "graphs drag and drop and reset button functionality working fail"
                      ),
                    ];
                await page.waitForTimeout(5000);
              } else {
                logger.error("graph dropped fail");
                errors.push("graph dropped fail");
              }
            } else {
              logger.error("info message in favorite not as per expected");
              errors.push("info message in favorite not as per expected");
            }
          })
          .catch(async (error) => {
            const errs: string[] = [];
            errs.push(error);
            const e = errs.find((x) => x === error);

            if (e) {
              logger.info(
                "info message element not present,checking for chart already added to favorite"
              );

              await page.waitForTimeout(5000);

              await page.click(fs.laborLink);
              await page.waitForTimeout(4000);
              logger.info("labor nav link clicked");

              for (let i = 0; i <= canvas.length - 1; i++) {
                await page.waitForSelector(fs.laborOverviewLink);
                await page.click(fs.laborOverviewLink);
                await navigationPromise;
                await page.waitForTimeout(8000);
                logger.info("labor overview link clicked");

                let addRemBtn = await page.$x(ids[i]);
                await page.waitForTimeout(5000);

                const btnStatus: string = await (
                  await addRemBtn[0].getProperty("title")
                ).jsonValue();
                await page.waitForTimeout(2000);

                if (btnStatus.includes("Add to Favorites")) {
                  logger.info("add/remove button status verify success");
                  addRemBtn = await page.$x(ids[i]);
                  await addRemBtn[0].click();
                  await page.waitForTimeout(5000);
                  logger.info("add/remove button clicked");
                  await page.click(fs.favoriteLink);
                  await navigationPromise;
                  await page.waitForTimeout(10000);
                  logger.info("favorite link clicked");

                  const chart = await page.$eval(canvas[i], (elem) => {
                    return elem.style.display !== "none";
                  });
                  await page.waitForTimeout(5000);
                  chart
                    ? logger.info(`chart ${i + 1} added to favorite success`)
                    : [logger.info(`chart ${i + 1} added to favorite fail`)];
                } else {
                  logger.info("charts already added to favorite");
                }
              }

              await page.click(fs.favoriteLink);
              await navigationPromise;
              await page.waitForTimeout(15000);
              logger.info("favorite link clicked");

              let selector = await page.waitForSelector(canvas[0]);
              const defaultPositionElement_1 = await page.evaluate((el) => {
                const { x, y } = el.getBoundingClientRect();
                return { x, y };
              }, selector);

              await page.waitForTimeout(5000);

              await page.evaluate((element) => {
                element.scrollIntoView(
                  0,
                  parseInt(element.getBoundingClientRect().y)
                );
              }, selector);
              await page.waitForTimeout(5000);
              await dragAndDrop(page, canvas[0], canvas[1]);
              await page.waitForTimeout(8000);

              selector = await page.waitForSelector(canvas[0]);
              const currentPosition = await page.evaluate((el) => {
                const { x, y } = el.getBoundingClientRect();
                return { x, y };
              }, selector);

              await page.waitForTimeout(5000);

              if (
                (currentPosition.x != defaultPositionElement_1.x &&
                  currentPosition.y != defaultPositionElement_1.y) ||
                (currentPosition.x == defaultPositionElement_1.x &&
                  currentPosition.y != defaultPositionElement_1.y) ||
                (currentPosition.x != defaultPositionElement_1.x &&
                  currentPosition.y == defaultPositionElement_1.y)
              ) {
                logger.info("graph dropped success");
                await page.waitForSelector(fs.resetBtn);
                await page.click(fs.resetBtn);
                await page.waitForTimeout(8000);
                logger.info("reset button clicked");
                selector = await page.waitForSelector(canvas[0]);
                const position = await page.evaluate((el) => {
                  const { x, y } = el.getBoundingClientRect();
                  return { x, y };
                }, selector);
                await page.waitForTimeout(5000);

                position.x == defaultPositionElement_1.x &&
                position.y == defaultPositionElement_1.y
                  ? logger.info(
                      "graphs drag and drop and reset button functionality working success"
                    )
                  : [
                      logger.error(
                        "graphs drag and and reset button functionality drop working fail"
                      ),
                      errors.push(
                        "graphs drag and drop and reset button functionality working fail"
                      ),
                    ];
                await page.waitForTimeout(5000);
              } else {
                logger.error("graph dropped fail");
                errors.push("graph dropped fail");
              }
            } else {
              logger.error(
                "info message element not present,chart added to favorite fail"
              );
              errors.push(
                "info message element not present,chart added to favorite fail"
              );
            }
          });
      } else {
        logger.error("My favorite page heading verify failed");
        errors.push("My favorite page heading verify failed");
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in Favorite Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsFavoriteTest();
