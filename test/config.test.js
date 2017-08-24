/*jslint node: true */
"use strict";

var config = require('../src/config.js');
var expect = require('expect');
var path = require('path');

describe('Configuration', function () {
    it('Should load default file', function () {
        var cfg = new config();
        expect(cfg).toExist('Configuration object do not exist');
        expect(cfg.context).toExist('No configuration has been loaded from YAML file');
        expect(cfg.sourcePath).toBe(path.resolve(__dirname + '/docs'));
        expect(cfg.targetPath).toBe(path.resolve(__dirname + '/build'));
        expect(cfg.templatePath).toBe(cfg.modulePath + "/default");
    });
    it('Should load custom file and properties', function () {
        var cfg = new config('mydocs.custom.yml');
        expect(cfg).toExist('Configuration object do not exist');
        expect(cfg.context['site_name']).toBe('mydocs2', 'site_name should be "mydocs2" in file mydocs.custom.yml');
    });
    it('Should load pages if present', function() {
        var cfg = new config('mydocs.pagetree.yml');
        var pages = cfg.context['pages'];
        expect(pages).toExist('pages is set in mydocs.pagetree.yml file, but it has not been loaded');
        var page = pages[0];
        expect(page['Home']).toBe('index.md', 'Page Home should be "index.md"');
        page = pages[1];
        expect(page['Level 1']).toExist('Level 1 should present, containing child elements');
        var subpage = page['Level 1'][0];
        expect(subpage).toExist('Level 1 should contain a child');
        expect(subpage['Level 2']).toBe('level1/index.md');
    });
    it('Should change templateDir if specified', function () {
        var cfg = new config('mydocs.theme_dir.yml');
        expect(cfg.context['theme_dir']).toBe('custom', 'site_name should be "custom" in file mydocs.theme_dir.yml');
        expect(cfg.templatePath).toBe(cfg.cwdPath + "/custom");
    });
});