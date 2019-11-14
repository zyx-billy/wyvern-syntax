/* build_syntax.js
Performs the following steps:
  1. replace macros in yaml source
  2. convert from yaml into json
*/
const fs = require("fs");
const yaml = require("js-yaml");

const macro_filename = "src/macros.yaml";
const src_filename = "src/tmLanguage.yaml";
const dst_filename = "syntaxes/wyvern.tmLanguage.json";

fs.readFile(macro_filename, "utf8", function(error, input) {
  if (error) {
    console.error(error.message || String(error));
    process.exit(1);
  }

  var output = yaml.safeLoadAll(input);
  if (output.length === 0) {
    console.error("failed to parse macro file: " + macro_filename);
    process.exit(1);
  }
  output = output[0];
  
  console.log("Processing macros");
  var yaml_data = fs.readFileSync(src_filename, "utf8");
  for (const key in output) {
    yaml_data = yaml_data.replace(new RegExp("[$][$]" + key + "[$][$]", "g"), output[key]);
  }

  console.log("Converting to JSON");
  var json_data = yaml.loadAll(yaml_data)[0];
  fs.writeFileSync(dst_filename, Buffer.from(JSON.stringify(json_data, null, '  ')));
});