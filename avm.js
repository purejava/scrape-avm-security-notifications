const puppeteer = require('puppeteer');

const BASE_URL = 'https://en.avm.de/service/current-security-notifications/';
const TR_COUNT_SELECTOR = '#c91069 > div > div > div > table > tbody > tr';
const RELEASE_DATE = '#c91069 > div > div > div > table > tbody > tr:nth-child(INDEX1) > td:nth-child(1) > div.content-wrap > div > p > strong';
const NOTICE = '#c91069 > div > div > div > table > tbody > tr:nth-child(INDEX1) > td:nth-child(2) > div.content-wrap > p';
const NOTICE_DETAILS = '#c91069 > div > div > div > table > tbody > tr:nth-child(INDEX1) > td:nth-child(2) > div.content-wrap > div';
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
      const trLength = await avm.page.$$eval(TR_COUNT_SELECTOR, (el) => el.length);

      for (let i = 1; i <= trLength; i++) {
        let notification = {};

        let dateSelector = RELEASE_DATE.replace("INDEX1", i);
        let noticeSelector = NOTICE.replace("INDEX1", i);
        let detailSelector = NOTICE_DETAILS.replace("INDEX1", i);

        let dateTdElement = await avm.page.$eval(dateSelector, (el) => el.innerHTML);
        let noticeTdElement = await avm.page.$eval(noticeSelector, (el) => el.innerHTML);
        let detailsTdElement = await avm.page.$eval(detailSelector, (el) => el.innerHTML);

        if (dateTdElement != null)
          notification.RealeaseDate = dateTdElement;
        if (noticeTdElement != null)
          notification.Topic = noticeTdElement;
        if (detailsTdElement != null)
          notification.Details = detailsTdElement;

        if (!isEmpty(notification) && convertedDate(notification.RealeaseDate) > relevantDate)
          results.push(notification);
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
  let pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  let cDate = new Date(date.replace(pattern,'$3-$2-$1'))
  return cDate;
}

module.exports = avm;