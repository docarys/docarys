/*jslint node: true */
"use strict";

var chalk = require("chalk");
var fs = require("fs");
var path = require("path");
var yamljs = require("yamljs");
var getInstalledPath = require("get-installed-path");

function Config(filename) {
    /** Filename to use */
    filename = filename ? filename : "docarys.yml";
    /** Running path */
    var cwdPath = process.cwd();
    /** Module path */
    var modulePath = __dirname;
    /** Full path to the config file, starting from current dir */
    var cfgfile = path.resolve(path.join(cwdPath, filename));
    if (!fs.existsSync(cfgfile)) {
        console.error(chalk.red("Config file '" + cfgfile + "' does not exist."));
        process.exit(-1);
    }
    /** Variable context, resulting from the load of the YAML file */
    var context = yamljs.load(cfgfile);
    /** Full path where the source documents are stored */
    var sourcePath = path.resolve(path.join(cwdPath, (context.sourceDir ? context.sourceDir : "docs")));
    /** Full path where output should be stored */
    var targetPath = path.resolve(path.join(cwdPath, (context.targetDir ? context.targetDir : "build")));

    /** Setup default theme values if not specified by the user */
    if (!context.theme) {
        context.theme = {
            "name": "material",
            "language": "en"
        }
    }

    var theme = context.theme && context.theme.name ? "docarys-" + context.theme.name : "docarys-material";

    var themePath = path.join(getInstalledPath.sync(theme), "build");

    function resolveTheme() {
        if (context.theme && context.theme.custom_dir) {
            return path.resolve(path.join(cwdPath, context.theme.custom_dir)); // Custom path specified by config
        } else {
            if (!fs.existsSync(themePath)) {
                console.log(chalk.red("Theme not found in '" + themePath + "'. Please install it: npm install -g " + theme));
                process.exit(-1);
            }

            return themePath;
        }
    }

    function loadLanguage(lang) {
        if (!lang) {
            return {};
        }

        var langPath = path.join(themePath, "language");
        if (fs.existsSync(langPath)) {
            var defaultValues = require(path.join(langPath, "default.json"));
            var languageValues = require(path.join(langPath, lang + ".json"));
            return Object.assign(defaultValues, languageValues);
        }
    }

    /** Template full path. 
     * By default, it uses the built-in "default". 
     * If "theme_dir" is specified, it looks at cwd  */
    var templatePath = resolveTheme();

    var language = loadLanguage(context.theme.language);

    /** Checks if is possible to enable Git extensions */
    var enableGit = fs.existsSync(path.join(cwdPath, ".git"));

    return {
        /** Configuration context */
        context: context,
        cwdPath: cwdPath,
        language: language,
        enableGit: enableGit,
        modulePath: modulePath,
        sourcePath: sourcePath,
        targetPath: targetPath,
        templatePath: templatePath
    };
}

module.exports = Config;