/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable padded-blocks */
/* eslint-disable linebreak-style */


const jsonexport = require('jsonexport');
const fs = require('fs');

module.exports = {
  exportData: exportData,
};

// eslint-disable-next-line require-jsdoc
function exportData(name, data, format) {

  if (format == 'csv') {
    // eslint-disable-next-line space-before-function-paren
    jsonexport(data, function (err, csv) {
      if (err) {
        console.error(err);
        throw err;
      }

      fs.writeFile(`./static/${name}.csv`, csv, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Object saved to ./static/${name}.csv file`);
      });
    });

  } if (format == 'json') {

    fs.writeFile(`./static/${name}.json`, JSON.stringify(data, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Object saved to ./static/${name}.json file`);
    });

  } else {
    throw new Error('no format specified or supported');
  }
}
