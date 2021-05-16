const puppeteer = require('puppeteer');

const BASE_URL = 'https://en.avm.de/service/current-security-notifications/';
const TR_COUNT_SELECTOR = '#c91069 > div > div > div > table > tbody > tr';
const RELEASE_DATE = '#c91069 > div > div > div > table > tbody > tr:nth-child(INDEX1) > td:nth-child(1) > div.content-wrap > div > p > strong';
const NOTICE = '#c91069 > div > div > div > table > tbody > tr:nth-child(INDEX1) > td:nth-child(2) > div.content-wrap > p';
const relevantDate = new Date("2021-05-10"); // All notifications with a Date gt relevantDate are selected

const avm = {
  browser: null,
  page: null,

  initialize: async () => {
    try {
      avm.browser = await puppeteer.launch({
        headless: false
      });
  
      avm.page = await avm.browser.newPage();
    } catch (e) {
      throw new Error ("Initialisation of puppeteer browser failed: " + e);
    }
  },

  iterateNotifications: async () => {

    try {

      let results = [];
      await avm.page.goto(BASE_URL, { waitUntil: 'networkidle2'} );

      // Get size of the table to precess
      let trLength = await avm.page.evaluate((sel) => {
        return document.querySelectorAll(sel).length;
      }, TR_COUNT_SELECTOR);

      for (let i = 1; i <= trLength; i++) {
        var notifications = {};

        let dateSelector = RELEASE_DATE.replace("INDEX1", i);
        let noticeSelector = NOTICE.replace("INDEX1", i);

        let dateTdElement = await avm.page.evaluate((sel) => {
          let data = document.querySelector(sel);
          return data? data.innerHTML: null;
        }, dateSelector);
        let noticeTdElement = await avm.page.evaluate((sel) => {
          let data = document.querySelector(sel);
          return data? data.innerHTML: null;
        }, noticeSelector);

        if (dateTdElement != null)
          notifications.RealeaseDate = dateTdElement;
        if (noticeTdElement != null)
          notifications.Topic = noticeTdElement;

        if (!isEmpty(notifications) && convertedDate(notifications.RealeaseDate) > relevantDate)
          results.push(notifications);
      }

      return JSON.stringify(results); 

    } catch (e) {

      throw new Error ("Processing of notifications failed: " + e);

    }
  },

  close: async () => {
    try {
      await avm.page.waitFor(5000);
      await avm.browser.close();
    } catch (e) {
      throw new Error ("Close failed: " + e);
    }
  }
}

let isEmpty = obj => {
  return Object.keys(obj).length === 0;
}

let convertedDate = date => {
  var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  var cDate = new Date(date.replace(pattern,'$3-$2-$1'))
  return cDate;
}

module.exports = avm;