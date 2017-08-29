/*jslint node: true */
"use strict";

var exec = require('child_process').execSync;
var md5 = require('md5');
var Stream = require('stream');

const projectContributorsCmd = "git log --all --format='{ \"user\": \"%aN\", \"email\": \"%cE\"},' | sort -u";
const fileContributorsCmd = "git log --all --format='{ \"user\": \"%aN\", \"email\": \"%cE\"},' $fileName | sort -u";
const fileLastCommitDateCmd = "git log -1 --format=%ci $fileName";
const hashShortCmd = "git log --pretty=format:'%h' -n 1";
const hashCmd = "git log --pretty=format:'%H' -n 1";
const currentBranchCmd = "git rev-parse --abbrev-ref HEAD";

function git() {

    function gitCommand(cmd, cwd) {
        var stream = new Stream();
        var result = exec(cmd, {
            cwd: cwd
        });

        return result.toString();
    }

    function parse(gitOutput) {
        gitOutput = "[" + gitOutput.substr(0, gitOutput.length - 2) + "]";
        return JSON.parse(gitOutput);
    }

    function addGravatar(contributors) {
        for (var i = 0; i < contributors.length; i++) {
            contributors[i].gravatar = gravatar(contributors[i].email);
        }

        return contributors;
    }

    function gravatar(email) {
        return "http://www.gravatar.com/avatar/" + md5(email) + "?d=identicon";
    }

    return {
        project: function(cwd) {
            if (!cwd) {
                cwd = __dirname;
            }
            // Project contributors
            var contributors = parse(gitCommand(projectContributorsCmd, cwd));
            addGravatar(contributors);
            // Hash
            var hash = gitCommand(hashCmd, cwd);
            var shortHash = gitCommand(hashShortCmd, cwd);
            var currentBranch = gitCommand(currentBranchCmd, cwd);
            return {
                branch: currentBranch,
                contributors: contributors,
                hash: hash,
                shortHash: shortHash                
            };
        },
        file: function(file, cwd) {
            if (!cwd) {
                cwd = __dirname;
            }
            // Contributors
            var cmd = fileContributorsCmd.replace("$fileName", file);
            var contributors = parse(gitCommand(cmd, cwd));
            addGravatar(contributors);
            // Date
            cmd = fileLastCommitDateCmd.replace("$fileName", file);
            var date = gitCommand(cmd, cwd);
            return {
                contributors: contributors,
                date: date
            };
        }
    };
}

module.exports = git;