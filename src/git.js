/*jslint node: true */
"use strict";

var exec = require("child_process").execSync;
var spawn = require("child_process").spawnSync;
var md5 = require("md5");
var Stream = require("stream");
var os = require("os");

const projectContributorsCmd = "git log --all --format='{ \"user\": \"%aN\", \"email\": \"%cE\"},' | sort -u";
const fileContributorsCmd = "git log --all --format='{ \"user\": \"%aN\", \"email\": \"%cE\"},' $fileName | sort -u";
const fileLastCommitDateCmd = "git log -1 --format=%ci $fileName";
const hashShortCmd = "git log --pretty=format:'%h' -n 1";
const hashCmd = "git log --pretty=format:'%H' -n 1";
const currentBranchCmd = "git rev-parse --abbrev-ref HEAD";

function git() {

    /**
     * Determines the OS running docarys and Executes a git command in the given path. A valid Git repository should be present at the given cwd
     * @param {*} cmd Command to execute
     * @param {*} cwd Path where .git folder is located
     */
    function gitCommand(cmd, cwd) {
        switch(os.platform()){
            case "win32":
            return gitWinCommand(cmd, cwd);
            default:
            return gitUnixCommand(cmd, cwd);
        }
    }

     /**
     * Executes a git command in the given path, in a Windows OS. A valid Git repository should be present at the given cwd
     * @param {*} cmd Command to execute
     * @param {*} cwd Path where .git folder is located
     */
    function gitWinCommand(cmd, cwd) {
        //TODO Temporary patch to make docarys work on Windows.
        return "";
    }

    /**
     * Executes a git command in the given path, in a Unix OS. A valid Git repository should be present at the given cwd
     * @param {*} cmd Command to execute
     * @param {*} cwd Path where .git folder is located
     */
    function gitUnixCommand(cmd, cwd) {
        var result = exec(cmd, {
            cwd: cwd
        });

        return result.toString();
    }

    /**
     * Parses the JSON string sent back from the git command.
     * @param {*} gitOutput The output sent back from the Git command
     */
    function parse(gitOutput) {
        gitOutput = "[" + gitOutput.substr(0, gitOutput.length - 2) + "]";
        return JSON.parse(gitOutput);
    }

    /**
     * Builds the corresponding gravatar URL for the given e-mail, executing an MD5 function as expected by gravatar
     * @param {*} email Gravatar user e-mail
     */
    function gravatar(email) {
        return "https://www.gravatar.com/avatar/" + md5(email) + "?d=identicon";
    }

    /**
     * Adds the gravatar URL to contributors.
     * @param {*} contributors List of contributors
     */
    function addGravatar(contributors) {
        for (var i = 0; i < contributors.length; i++) {
            contributors[i].gravatar = gravatar(contributors[i].email);
        }

        return contributors;
    }

    return {
        /**
         * Checks if a path contains a valid Git repository
         * @param {*} cwd Path where .git folder is located
         */
        initialized: function(cwd) {
            try {
                gitCommand(hashCmd, cwd);
                return true;
            } catch(e) {
                return false;
            }
        },
        /**
         * Gets Git information for the given volder
         * @param {*} cwd Path where .git folder is located
         */
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
        /**
         * Checks if a path contains a valid Git repository
         * @param {*} file File to check
         * @param {*} cwd Path where .git folder is located
         */        
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