/*jslint node: true */
"use strict";

var chalk = require("chalk");
var fs = require("fs");
var path = require('path');
var yamljs = require('yamljs');
var getInstalledPath = require("get-installed-path");

function Config(filename) {
    /** Filename to use */
    filename = filename ? filename : 'mydocs.yml';
    /** Running path */
    var cwdPath = process.cwd();
    /** Module path */
    var modulePath = __dirname;
    /** Full path to the config file, starting from current dir */
    var cfgfile = path.resolve(cwdPath + '/' + filename);
    if (!fs.existsSync(cfgfile)) {
        console.error(chalk.red("Config file '" + cfgfile + "' does not exist.'"));
        process.exit(-1);
    }
    /** Variable context, resulting from the load of the YAML file */
    var context = yamljs.load(cfgfile);
    /** Full path where the source documents are stored */
    var sourcePath = path.resolve(cwdPath + '/' + (context['sourceDir'] ? context['sourceDir'] : 'docs'));
    /** Full path where output should be stored */
    var targetPath = path.resolve(cwdPath + '/' + (context['targetDir'] ? context['targetDir'] : 'build'));
    /** Template full path. 
     * By default, it uses the built-in "default". 
     * If "theme_dir" is specified, it looks at cwd  */
    var templatePath = resolveTheme();

    function resolveTheme() {
        if (context["theme_dir"]) {
            return path.resolve(cwdPath + '/' + context['theme_dir']) // Custom path specified by config
        } else {
            var theme = context["theme"] ? context["theme"] : "mydocs-material";
            var themePath = getInstalledPath.sync(theme) + "/build";
            if (!fs.existsSync(themePath)) {
                console.log(chalk.red("Theme not found. Please install it: npm install -g " + theme));
                process.exit(-1);
            }

            return themePath;
        }
    }

    return {
        /** Configuration context */
        context: context,
        modulePath: modulePath,
        cwdPath: cwdPath,
        sourcePath: sourcePath,
        targetPath: targetPath,
        templatePath: templatePath
    };
}

module.exports = Config;