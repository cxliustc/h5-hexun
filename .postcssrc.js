// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserlist" field in package.json
    "autoprefixer": {
      "browsers": ["iOS >= 7", "Android >= 4.1"]
    },
    "postcss-pxtorem": {
      "rootValue": 100,
      "propList": [
        "width",
        "height",
        "top",
        "left",
        "right",
        "bottom",
        "margin-top",
        "margin-bottom",
        "margin-left",
        "margin-right",
        "font-size",
        "padding-right",
        "padding-left",
        "padding-top",
        "padding-bottom",
        "padding",
        "margin",
        "line-height",
        "font",
        "font-size"
      ]
    }
  }
}