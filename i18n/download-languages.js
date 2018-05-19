const fs = require("fs");
const axios = require("axios");

// const makeFile = (data, lang) => {
//   const ret = data.reduce((a, b) => {
//     a[b.key] = b[lang];
//     return a;
//   }, {});
//   fs.writeFile(lang + '.json', JSON.stringify(ret, null, "  "), 'utf8', (error) => {
//     if (error) {
//       console.log(error);
//     }
//     else {
//       console.log("make " + lang + ".json");
//     }
//   });
// };
//
// axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQpLFQjpA8qgwfecomyxyUmqVVW99cgiKzHKqd7_FpbZblg3ivThx7q2KSHIvm7bTIcAcat0d08NDRc/pub?gid=0&single=true&output=tsv')
//   .then(function (response) {
//     if (response.data && response.data.length) {
//       const rows = response.data.split("\r\n").slice(1);
//       const data = rows.map(row => {
//         const cols = row.split("\t");
//         return {modified: cols[0], key: cols[1], ko: cols[2], en: cols[3]};
//       });
//       makeFile(data, "ko");
//       makeFile(data, "en");
//     }
//     else {
//       console.log("no data");
//     }
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
