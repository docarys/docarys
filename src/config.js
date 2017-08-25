/*jslint node: true */
"use strict";

var chalk = require("chalk");
var fs = require("fs");
var path = require('path');
var yamljs = require('yamljs');

function Config(filename) {
    /** Filename to use */
    this.filename = filename ? filename : 'mydocs.yml';
    /** Running path */
    this.cwdPath = process.cwd();
    /** Module path */
    this.modulePath = __dirname;
    /** Full path to the config file, starting from current dir */
    this.cfgfile = path.resolve(this.cwdPath + '/' + this.filename);
    if (!fs.existsSync(this.cfgfile)) {
        console.error(chalk.red("Config file '" + this.cfgfile +"' does not exist.'"));
        process.exit(-1);
    }
    /** Variable context, resulting from the load of the YAML file */
    this.context = yamljs.load(this.fullpath);
    /** Full path where the source documents are stored */
    this.sourcePath = path.resolve(this.cwdPath + '/' + (this.context['sourceDir'] ? this.context['sourceDir'] : 'docs'));
    /** Full path where output should be stored */
    this.targetPath = path.resolve(this.cwdPath + '/' + (this.context['targetDir'] ? this.context['targetDir'] : 'build'));
    /** Path where the template is stored */
    this.templatePath = path.resolve(this.modulePath + '/' + (this.context['theme_dir'] ? this.context['theme_dir'] : 'default'));
    /** Template full path. 
     * By default, it uses the built-in "default". 
     * If "theme_dir" is specified, it looks at cwd  */
    this.templatePath = this.context['theme_dir'] ?
        this.templatePath = path.resolve(this.cwdPath + '/' + this.context['theme_dir']) // Custom path specified by config
        :
        path.resolve(this.modulePath + '/default'); // Default built-in theme in the module

    return {
        /** Configuration context */
        context: this.context,
        modulePath: this.modulePath,
        cwdPath: this.cwdPath,
        sourcePath: this.sourcePath,
        targetPath: this.targetPath,
        templatePath: this.templatePath,
    }
}

module.exports = Config;