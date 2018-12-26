var path = require('path');
var shell = require("shelljs");
/**
 * 通用组件更新
 */
class GitImportPlugin{
    constructor(options){
        this.opts = {
            gitStock: options.gitStock,
            output: options.output
        }
        var pwd = this.pwd = shell.pwd().stdout;
        var airduct = require(path.resolve(pwd, "airduct.config"));
        this.gitImports = airduct.webpack.imports;
        this.gitImportDir = path.resolve(this.opts.output, `gitImportDir`);
        shell.rm('-rf', this.gitImportDir);
    }
    download(){
        this.downloadDir = path.resolve(this.pwd, `../temp_import_${+ new Date()}`);
        shell.exec(`git clone ${this.opts.gitStock} ${this.downloadDir}`)
    }
    copy(){
        shell.mkdir('-p', this.gitImportDir);
        this.gitImports.forEach((item) => {
            shell.exec(`cd ${this.downloadDir} && cp -rf ${item}/ ${this.gitImportDir}/${item}`);
        });
    }
    remove(){
        shell.rm('-rf',this.downloadDir);
    }
    apply(compiler) {
        compiler.plugin("entryOption",  (compilation, callback) => {
            console.log('[GitImportPlugin依赖]', JSON.stringify(this.gitImports));
            if(this.opts.gitStock && this.gitImports){
                this.download();
                this.copy();
                this.remove()
            }
            // callback();
        });
    }
}

module.exports = GitImportPlugin
