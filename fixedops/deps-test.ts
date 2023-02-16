// Dependencies required during engineering/testing only (not in production)
import puppeteer from "https://deno.land/x/puppeteer@14.1.1/mod.ts";
export { puppeteer };
export * as testingAsserts from "https://deno.land/std@0.94.0/testing/asserts.ts";
export { config } from "https://deno.land/x/dotenv/mod.ts";
export type { Page } from "https://deno.land/x/puppeteer@14.1.1/vendor/puppeteer-core/puppeteer/common/Page.d.ts";
export type { Browser } from "https://deno.land/x/puppeteer@14.1.1/vendor/puppeteer-core/puppeteer/common/Browser.d.ts";
export * as log from "https://deno.land/std@0.151.0/log/mod.ts";
export * as Any from "https://deno.land/std@0.94.0/encoding/_yaml/utils.ts";
export * as path from "https://deno.land/std/path/mod.ts";
import Logger from "https://deno.land/x/logger@v1.0.0/logger.ts";
import * as XLSX from "https://deno.land/x/sheetjs/xlsx.mjs";
export { Logger, XLSX };
