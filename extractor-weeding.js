/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable padded-blocks */
/* eslint-disable linebreak-style */

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const utils = require('./extractor-util');

const domain = 'https://www.devotedcolumbus.com';

module.exports = {

  extractVendorTestData,
  extractVendorFullData,


  extractVenuesTestData,
  extractVenuesFullData,
};

/**
 * Extract vendor single data instaed of full.
 * returns({void})
 */
async function extractVendorTestData() {
  const urlIndexList = await getVendorIndexUrls();
  // console.log(urlIndexList);

  const vendorUrlData = await getVendorMetaData([urlIndexList[0]]);
  console.log(vendorUrlData);

  const vendorDataCombined = await getVendorFinalData([vendorUrlData[0]]);

  console.log(JSON.stringify(vendorDataCombined, null, 4));

  utils.exportData('vendor-test-data', vendorDataCombined, 'json');
}

/**
 * Extract vendor single data instaed of full.
 * returns({void})
 */
async function extractVendorFullData() {
  const urlIndexList = await getVendorIndexUrls();
  // console.log(urlIndexList);

  const vendorUrlData = await getVendorMetaData(urlIndexList);
  // console.log(vendorUrlData);

  const vendorDataCombined = await getVendorFinalData(vendorUrlData);

  // console.log(JSON.stringify(vendorDataCombined, null, 4));

  utils.exportData('vendor-full-data', vendorDataCombined, 'json');
}

/**
 * Extract vendor urls from the wedding-vendor-columbus
 * @return {{url:string[]}}
 */
async function getVendorIndexUrls() {

  const axios = require('axios');

  const html = await axios.get(`${domain}/directory/vendors`);
  const dom = new JSDOM(html.data);
  const document = dom.window.document;

  const urls = [...document.querySelectorAll('body > div.d-sec.wide.white a')].map((el) => el.href);
  return [...new Set(urls)];
}

/**
 * Get vendor post urls
 * @param {string[]} urls
 * @return {{vendorMainUrl, vendorTitle, vendorDescription, vendorUrls}} dataList
 */
async function getVendorMetaData(urls) {
  const axios = require('axios');

  const dataList = [];
  const requests = urls.map((url) => axios.get(`${url}`));

  const responses = await Promise.all(requests);
  const htmls = responses.map((response) => response);

  for (let index = 0; index < urls.length; index++) {
    const html = htmls[index];
    const url = urls[index];
    const dom = new JSDOM(html.data);
    const document = dom.window.document;
    const record = parseVendorMetaData(url, document);
    dataList.push(record);
    console.log(`TOTAL VENDOR META DATA COMPLETED ${index} FROM ${urls.length} (url: ${url})`);
  }
  return dataList;

  // eslint-disable-next-line require-jsdoc
  function parseVendorMetaData(url, document) {
    const record = {};
    record.vendorMainUrl = `${url}`;
    try {
      record.vendorTitle = document.querySelector('body > div.d-container > div.d-sec > h1').textContent;
      record.vendorDescription = document.querySelector('body > div.d-container > div.d-sec > p:nth-child(3)').textContent;
      record.vendorUrls = [...document.querySelectorAll('body > div.d-container > div:nth-child(8) > div.c-category-wrapper.w-dyn-list > div > div')].filter((div) => div.style.display != 'none').map((div) => div.querySelector('a').href);

    } catch (e) {
      console.error(e);
    }
    return record;
  }
}

/**
 * Get vendor post urls
 * @param {{vendorMainUrl, vendorTitle, vendorDescription, vendorUrls}} vendorList
 * @param {*} data
 */
async function getVendorFinalData(vendorList) {

  const promises = vendorList.map(async (vendorInfo) => {
    const { vendorUrls, ...vendor } = vendorInfo;
    const data = { ...vendor, vendorDetails: [] };
    data.vendorDetails = await getDetailData(vendorUrls);
    return data;
  });
  const result = await Promise.all(promises);
  const returnData = [].concat(...result);
  return returnData;
}


/**
 * Extract  Venues Test Data.
 */
async function extractVenuesTestData() {
  const urls = await getVenuesMetaData();
  const data = await getDetailData([urls[0]]);
  utils.exportData('wedding-test-data', data, 'json');
}

/**
 * Extract  Venues Full Data.
 */
async function extractVenuesFullData() {
  const urls = await getVenuesMetaData();
  const data = await getDetailData(urls);
  utils.exportData('wedding-full-data', data, 'json');
}

/**
 * Get  Venues Urls
 * @return {{string:[]}} urls
 */
async function getVenuesMetaData() {

  const axios = require('axios');

  const html = await axios.get(`${domain}/directory/vendor/wedding-venues#`);
  const dom = new JSDOM(html.data);
  const document = dom.window.document;
  const pattern = /^\/wedding-vendors\/\w+/;

  const regUrl = new RegExp(pattern);

  const urls = [...document.querySelectorAll('a')].filter((x) => regUrl.test(x.href)).map((x) => x.href);
  // var urls =[...document.querySelectorAll("a")].map(x => x.href);
  return [...new Set(urls)];
}

// eslint-disable-next-line require-jsdoc
async function getDetailData(urls) {

  console.log('url:: ', urls[0]);

  const dataList = [];
  const axios = require('axios');
  const requests = urls.map((url) => axios.get(`${domain}${url}`));

  const responses = await Promise.all(requests);
  const htmls = responses.map((response) => response);

  for (let index = 0; index < htmls.length; index++) {
    const html = htmls[index];
    const url = urls[index];
    const dom = new JSDOM(html.data);
    const document = dom.window.document;
    const record = parseDetailData(url, document);
    dataList.push(record);
    console.log(`TOTAL COMPLETED ${index} FROM ${urls.length} (url: ${url})`);
  }

  return dataList;

  // eslint-disable-next-line require-jsdoc
  function parseDetailData(url, document) {
    const record = {};
    record.url = `${domain}${url}`;
    try {

      record.imgBanner = document.querySelector('body > div.d-home-slider.secondary > img').attributes.src.value;

      record.category = document.querySelector('body > div.d-sec.secondary-top > div.d-venue-categories > a:nth-child(1)').text;

      record.weedingVendor = document.querySelector('body > div.d-sec.secondary-top > h1').textContent;

      record.logoSrc = document.querySelector('body > div.d-sec.secondary-top > div.d-logo > img').src;

      const contactInfo = [...document.querySelectorAll('body > div.d-sec.secondary-top > p.p-vendor-info')].map((p) => p.textContent);

      record.phone = contactInfo.at(0);
      record.email = contactInfo.at(1);
      record.address = contactInfo.at(2);

      record.socialMedia = [...document.querySelectorAll('body > div.d-sec.secondary-top > div.d-social-icons a.l-social.w-inline-block')].filter((x) => !x.classList.contains('w-condition-invisible')).map((x) => x.href);

      record.facebookGroups = [...document.querySelectorAll('a.facebook-groups')].filter((x) => !x.classList.contains('w-condition-invisible')).map((x) => x.href);

      record.imageRight = [...document.querySelectorAll('body > div.d-sec.secondary-top > div.d-vendor-top-content > div:nth-child(2) > div:nth-child(3) > div > div.c-vendor-multi-image-list.w-dyn-items img')].map((el) => el.src);

      record.textLeft = [...document.querySelectorAll('p.p-vendor-description')].map((el) => el.textContent).join('\n ');

      record.vendorWebsite = document.querySelector('a[href=\'#Vendor-Contact\']').nextSibling.nextSibling.href;


    } catch (e) {
      console.error(e);
    }
    return record;
  }
}
