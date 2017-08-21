/*jslint node: true */
"use strict";

var yamljs = require('yamljs');
var path = require('path');

function Config(filename) {
    /** Filename to use */
    this.filename = filename ? filename : 'mydocs.yml';
    /** Full path to the file, starting from current dir */
    this.fullpath = path.resolve(__dirname + '/' + this.filename);
    /** Variable context, resulting from the load of the YAML file */
    this.context = yamljs.load(this.fullpath);
    /** Full path where the source documents are stored */
    this.sourcePath = path.resolve(__dirname + '/' + (this.context['sourceDir'] ? this.context['sourceDir'] : 'docs'));
    /** Full path where output should be stored */
    this.targetPath = path.resolve(__dirname + '/' + (this.context['targetDir'] ? this.context['targetDir'] : 'build'));
    /** Path where the template is stored */
    this.templateDir = path.resolve(__dirname + '/' + (this.context['theme_dir'] ? this.context['theme_dir'] : 'default'));   
    /** Template full path */
    this.templatePath = path.resolve(__dirname + '/' + this.context['theme_dir']);

    return {
        /** Configuration context */
        context: this.context,
        sourcePath: this.sourcePath,
        targetPath: this.targetPath,
        templatePath: this.templatePath
    }
}

module.exports = Config;