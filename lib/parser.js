var newline = /\r?\n|\r/g;

/**
 * Constructor
 */
function Parser(keywords) {
  if (!keywords) {
    keywords = ['gettext', '_', '_n'];
  }

  if (typeof keywords === 'string') {
    keywords = [keywords];
  }

  this.keywords = keywords;

  //this.pattern = new RegExp('\\{\\{(?:' + keywords.join('|') + ') "((?:\\\\.|[^"\\\\])*)" ?\\}\\}', 'gm');
  this.pattern = new RegExp('\\{\\{(?:' + keywords.join('|') + ') ((?:\\\\.|[^\\}\\\\])*)\\}\\}', 'gm');
  this.subpattern = /"((?:\\.|[^"\\])*)"/g;
}

/**
 * Given a Handlebars template string returns the list of i18n strings.
 *
 * @param {string} template The content of a HBS template.
 * @return {Object.<string, array>} The list of translatable strings and the lines on which they appear.
 */
Parser.prototype.parse = function (template) {
  var result = {},
    match;

  while ((match = this.pattern.exec(template)) !== null) {
    var helperargs = match[1];
    var line = template.substr(0, match.index).split(newline).length;
    // find all strings in args
    while ((match = this.subpattern.exec(helperargs)) !== null) {
      result[match[1]] = result[match[1]] || [];
      result[match[1]].push(line);
    }
  }

  return result;
};

module.exports = Parser;
