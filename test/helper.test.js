before(function() {
    /** mydocs uses process.cwd to get path where the user spawns the command. We need to tweak it and move cwd to ./test, where all test files are stored */
    process.chdir('./test');
});