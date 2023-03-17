/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable padded-blocks */

const extractorBlog = require('./extractor-blog.js');

const extractorWedding = require('./extractor-weeding.js');

const { Command } = require('commander');
const program = new Command();

program
  .name('pull data https://www.devotedcolumbus.com')
  .description('Pull data and exported to json')
  .version('0.0.1');

program.command('venues-test-data')
  .description('Pull a single venues data from urls')
  .option('-f, --format <type>', 'format json', 'json')
  .action(async (opts) => {
    if (opts.format == 'json') {
      await extractorWedding.extractVenuesTestData();
    } else {
      console.log('this operation only support json at the moment');
    }
  });

program.command('venues-full-data')
  .description('Pull venues data from urls')
  .option('-f, --format <type>', 'format json', 'json')
  .action(async (opts) => {
    if (opts.format == 'json') {
      await extractorWedding.extractVenuesFullData();
    } else {
      console.log('this operation only support json at the moment');
    }
  });

program.command('vendor-test-data')
  .description('Pull single vendor posts data [ONLY SUPPORT JSON]')
  .option('-f, --format <type>', 'format json', 'json')
  .action(async (opts) => {
    if (opts.format == 'json') {
      await extractorWedding.extractVendorTestData();
    } else {
      console.log('this operation only support json at the moment');
    }
  });

program.command('vendor-full-data')
  .description('Pull full vendor posts data [ONLY SUPPORT JSON]')
  .option('-f, --format <type>', 'format json', 'json')
  .action(async (opts) => {
    if (opts.format == 'json') {
      await extractorWedding.extractVendorFullData();
    } else {
      console.log('this operation only support json at the moment');
    }
  });

program.command('blog-test-data')
  .description('Pull single blog posts data [ONLY SUPPORT JSON]')
  .option('-f, --format <type>', 'format json', 'json')
  .action(async (opts) => {
    if (opts.format == 'json') {
      await extractorBlog.extractBlogTestData();
    } else {
      console.log('this operation only support json at the moment');
    }
  });

program.command('blog-full-data')
  .description('Pull all posts from all the blog pages [ONLY SUPPORT JSON]')
  .option('-f, --format <type>', 'format json', 'json')
  .action(async (opts) => {
    if (opts.format == 'json') {
      await extractorBlog.extractBlogFullData();
    } else {
      console.log('this operation only support json at the moment');
    }
  });


program.parse();
