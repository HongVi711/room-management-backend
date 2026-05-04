import puppeteer, { Browser } from "puppeteer-core";
const chromium = require("@sparticuz/chromium") as ChromiumType;

let browser: Browser | null = null;

type ChromiumType = {
  args: string[];
  defaultViewport: any;
  executablePath: () => Promise<string>;
  headless: boolean;
};

export const getBrowser = async (): Promise<Browser> => {
  if (browser) return browser;

  const isProd = process.env.NODE_ENV === "production";

  browser = await puppeteer.launch({
    args: isProd
      ? [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"]
      : [],

    executablePath: isProd
      ? await chromium.executablePath()
      : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

    headless: true,
  });

  return browser;
};
