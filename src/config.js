/*jslint node: true */
"use strict";

var chalk = require("chalk");
var fs = require("fs");
var path = require('path');
var yamljs = require('yamljs');
var getInstalledPath = require("get-installed-path");

function Config(filename) {
    /** Filename to use */
    filename = filename ? filename : 'docarys.yml';
    /** Running path */
    var cwdPath = process.cwd();
    /** Module path */
    var modulePath = __dirname;
    /** Full path to the config file, starting from current dir */
    var cfgfile = path.resolve(path.join(cwdPath, filename));
    if (!fs.existsSync(cfgfile)) {
        console.error(chalk.red("Config file '" + cfgfile + "' does not exist.'"));
        process.exit(-1);
    }
    /** Variable context, resulting from the load of the YAML file */
    var context = yamljs.load(cfgfile);
    /** Full path where the source documents are stored */
    var sourcePath = path.resolve(path.join(cwdPath, (context['sourceDir'] ? context['sourceDir'] : 'docs')));
    /** Full path where output should be stored */
    var targetPath = path.resolve(path.join(cwdPath, (context['targetDir'] ? context['targetDir'] : 'build')));

    function resolveTheme() {
        if (context["theme_dir"]) {
            return path.resolve(path.join(cwdPath, context['theme_dir'])); // Custom path specified by config
        } else {
            var theme = context["theme"] ? "docarys-" + context["theme"] : "docarys-material";
            var themePath = path.join(getInstalledPath.sync(theme), "build");
            if (!fs.existsSync(themePath)) {
                console.log(chalk.red("Theme not found in '" + themePath + "'. Please install it: npm install -g " + theme));
                process.exit(-1);
            }

            return themePath;
        }
    }

    /** Template full path. 
     * By default, it uses the built-in "default". 
     * If "theme_dir" is specified, it looks at cwd  */
    var templatePath = resolveTheme();

    /** Checks if is possible to enable Git extensions */
    var enableGit = fs.existsSync(path.join(cwdPath, ".git"));

    return {
        /** Configuration context */
        context: context,
        cwdPath: cwdPath,
        enableGit: enableGit,
        modulePath: modulePath,
        sourcePath: sourcePath,
        targetPath: targetPath,
        templatePath: templatePath
    };
}

module.exports = Config;