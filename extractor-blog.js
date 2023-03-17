/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable padded-blocks */
/* eslint-disable linebreak-style */


const utils = require('./extractor-util.js');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;


const domain = 'https://www.devotedcolumbus.com';


/**
 * returns ({void})
 */
async function extractBlogFullData() {
  const urlIndexList = await getBlogIndexUrl();

  const blogMainList = await getBlogPostUrls(urlIndexList);

  const blogDataCombined = await getBlogData(blogMainList);

  utils.exportData('blog-full-data', blogDataCombined, 'json');

}

/**
 * Extract blog single data instaed of full.
 * returns({void})
 */
async function extractBlogTestData() {
  const urlIndexList = await getBlogIndexUrl();
  console.log(urlIndexList);

  const blogMainList = await getBlogPostUrls([urlIndexList[0]]);
  console.log(blogMainList);

  const blogDataCombined = await getBlogData([blogMainList[0]]);

  console.log(JSON.stringify(blogDataCombined, null, 4));

  utils.exportData('blog-test-data', blogDataCombined, 'json');
}

/**
 * Extract blog urls from the wedding-blog-columbus
 * @return {{url:string[]}}
 */
async function getBlogIndexUrl() {

  const axios = require('axios');

  const html = await axios.get(`${domain}/inspirations/wedding-blog-columbus`);
  const dom = new JSDOM(html.data);
  const document = dom.window.document;

  const urls = [...document.querySelectorAll('div.d-button-box > a')] .filter((a) => a.textContent.trim().startsWith('View All Posts')).map((a) => a.href);
  return [...new Set(urls)];
}

/**
 * Get blog post urls
 * @param {string[]} urls
 * @return {{blogMainMainUrl, blogMainTitle, blogMainDescription, blogMainUrls}} dataList
 */
async function getBlogPostUrls(urls) {
  const axios = require('axios');

  const dataList = [];

  for (let index = 0; index < urls.length; index++) {
    const url = urls[index];

    const html = await axios.get(`${domain}${url}`);
    const dom = new JSDOM(html.data);
    const document = dom.window.document;

    const record = {};
    record.blogMainMainUrl = `${domain}${url}`;
    try {
      record.blogMainTitle = document.querySelector('body > div.d-container > div.d-sec > h1').textContent;
      record.blogMainDescription = document.querySelector('body > div.d-container > div.d-sec > p:nth-child(3)').textContent;
      record.blogMainUrls = [...document.querySelectorAll('body > div.d-container > div.d-blog-featured-category.white a')].map((el) => el.href);
      console.log(record);

    } catch (e) {
      console.error(e);
    }

    dataList.push(record);
    console.log(`TOTAL COMPLETED ${index} FROM ${urls.length} (url: ${url})`);
  }
  return dataList;

}

/**
 *
 * @param {{blogMainMainUrl, blogMainTitle, blogMainDescription, blogMainUrls}[]} blogMainList ,
 * @return {{blogMainMainUrl, blogMainTitle, blogMainDescription, blogDetails:[{title, richtext,author, date}]}}
 */
async function getBlogData(blogMainList) {

  const axios = require('axios');
  // let totals = blogMainList.map(x => x.blogMainUrls.length).reduce((accumulator, currentValue) => accumulator + currentValue);

  const promises = blogMainList.map(async (blogMainInfo) => {
    const {blogMainUrls, ...blogMainDataPart} = blogMainInfo;
    const data = {...blogMainDataPart, blogDetails: []};

    for (let index = 0; index < blogMainUrls.length; index++) {
      const url = blogMainUrls[index];

      const html = await axios.get(`${domain}${url}`);
      const dom = new JSDOM(html.data);
      const document = dom.window.document;

      const blogDetail = {};
      blogDetail.url = `${domain}${url}`;
      try {
        blogDetail.title = document.querySelector('body  h1').textContent;
        blogDetail.richtext = document.querySelector('div.rt-blog.w-richtext').textContent;
        blogDetail.author = document.querySelector('div[class="d-author"]').textContent;
        blogDetail.date = document.querySelector('body > div:nth-child(3) > p').textContent;

      } catch (e) {
        console.error(e);
      }
      data.blogDetails.push(blogDetail);
      console.log(`TOTAL COMPLETED ${index} FROM ${blogMainUrls.length} (url: ${url})`);
    }
    return data;

  });
  const result = await Promise.all(promises);
  const returnData = [].concat(...result);
  return returnData;
}


module.exports = {
  extractBlogFullData,
  extractBlogTestData,
};
