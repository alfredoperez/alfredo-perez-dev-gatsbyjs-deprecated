'use strict';

var obsidian = require('obsidian');
var child_process = require('child_process');
var util = require('util');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_SETTINGS = {
    command_timeout: 5,
    template_folder: "",
    templates_pairs: [["", ""]],
    toggle_notice: false,
};
class TemplaterSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        // TODO: Remove this
        let notice_fragment = document.createDocumentFragment();
        let notice_div = notice_fragment.createEl("div");
        notice_div.innerHTML = `What? Templater is <b>evolving</b>!<br/>
The template syntax changed in this release, check out the new documentation for it on <a href="https://github.com/SilentVoid13/Templater#templater-obsidian-plugin">Templater's Github</a> or in the community plugins page.<br/>
Enjoy new features for Templater: new internal templates, user templates arguments, conditional statements and more.<br/>
Every already existing feature still exists of course, you just need to update the syntax in your templates files.<br/>
Thanks for using Templater! SilentVoid.<br/>
This message will self-destruct in the next update.`;
        new obsidian.Setting(containerEl)
            .setName("Templater Update")
            .setDesc(notice_fragment);
        let fragment = document.createDocumentFragment();
        let link = document.createElement("a");
        link.href = "https://github.com/SilentVoid13/Templater#internal-commands";
        link.text = "here";
        fragment.append("Click ");
        fragment.append(link);
        fragment.append(" to get a list of all the available internal variables / functions.");
        new obsidian.Setting(containerEl)
            .setName("Disables update Notice")
            .addToggle(toggle => {
            toggle.setValue(this.plugin.settings.toggle_notice)
                .onChange(toggle_notice => {
                this.plugin.settings.toggle_notice = toggle_notice;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Template folder location")
            .setDesc("Files in this folder will be available as templates.")
            .addText(text => {
            text.setPlaceholder("Example: folder 1/folder 2")
                .setValue(this.plugin.settings.template_folder)
                .onChange((new_folder) => {
                this.plugin.settings.template_folder = new_folder;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Timeout")
            .setDesc("Maximum timeout in seconds for a command.")
            .addText(text => {
            text.setPlaceholder("Timeout")
                .setValue(this.plugin.settings.command_timeout.toString())
                .onChange((new_value) => {
                let new_timeout = Number(new_value);
                if (isNaN(new_timeout)) {
                    this.plugin.log_error("Timeout must be a number");
                    return;
                }
                this.plugin.settings.command_timeout = new_timeout;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Internal Variables and Functions")
            .setDesc(fragment);
        let i = 1;
        this.plugin.settings.templates_pairs.forEach((template_pair) => {
            let div = containerEl.createEl('div');
            div.addClass("templater_div");
            let title = containerEl.createEl('h4', {
                text: 'User Function n°' + i,
            });
            title.addClass("templater_title");
            let setting = new obsidian.Setting(containerEl)
                .addExtraButton(extra => {
                extra.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                    if (index > -1) {
                        this.plugin.settings.templates_pairs.splice(index, 1);
                        // Force refresh
                        this.display();
                    }
                });
            })
                .addText(text => {
                let t = text.setPlaceholder('Function name')
                    .setValue(template_pair[0])
                    .onChange((new_value) => {
                    let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                    if (index > -1) {
                        this.plugin.settings.templates_pairs[index][0] = new_value;
                        this.plugin.saveSettings();
                    }
                });
                t.inputEl.addClass("templater_template");
                return t;
            })
                .addTextArea(text => {
                let t = text.setPlaceholder('System Command')
                    .setValue(template_pair[1])
                    .onChange((new_cmd) => {
                    let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                    if (index > -1) {
                        this.plugin.settings.templates_pairs[index][1] = new_cmd;
                        this.plugin.saveSettings();
                    }
                });
                t.inputEl.setAttr("rows", 4);
                t.inputEl.addClass("templater_cmd");
                return t;
            });
            setting.infoEl.remove();
            div.appendChild(title);
            div.appendChild(containerEl.lastChild);
            i += 1;
        });
        let div = containerEl.createEl('div');
        div.addClass("templater_div2");
        let setting = new obsidian.Setting(containerEl)
            .addButton(button => {
            let b = button.setButtonText("Add New User Command").onClick(() => {
                this.plugin.settings.templates_pairs.push(["", ""]);
                // Force refresh
                this.display();
            });
            b.buttonEl.addClass("templater_button");
            return b;
        });
        setting.infoEl.remove();
        div.appendChild(containerEl.lastChild);
    }
}

var OpenMode;
(function (OpenMode) {
    OpenMode[OpenMode["InsertTemplate"] = 0] = "InsertTemplate";
    OpenMode[OpenMode["CreateNoteTemplate"] = 1] = "CreateNoteTemplate";
})(OpenMode || (OpenMode = {}));
class TemplaterFuzzySuggestModal extends obsidian.FuzzySuggestModal {
    constructor(app, plugin) {
        super(app);
        this.app = app;
        this.plugin = plugin;
    }
    getItems() {
        let template_files = [];
        if (this.plugin.settings.template_folder === "") {
            let files = this.app.vault.getFiles();
            template_files = files;
        }
        else {
            let template_folder_str = obsidian.normalizePath(this.plugin.settings.template_folder);
            let template_folder = this.app.vault.getAbstractFileByPath(template_folder_str);
            if (!template_folder) {
                throw new Error(`${template_folder_str} folder doesn't exist`);
            }
            if (!(template_folder instanceof obsidian.TFolder)) {
                throw new Error(`${template_folder_str} is a file, not a folder`);
            }
            obsidian.Vault.recurseChildren(template_folder, (file) => {
                if (file instanceof obsidian.TFile) {
                    template_files.push(file);
                }
            });
            template_files.sort((a, b) => {
                return a.basename.localeCompare(b.basename);
            });
        }
        return template_files;
    }
    getItemText(item) {
        return item.basename;
    }
    onChooseItem(item, _evt) {
        switch (this.open_mode) {
            case OpenMode.InsertTemplate:
                this.plugin.parser.replace_templates_and_append(item);
                break;
            case OpenMode.CreateNoteTemplate:
                this.plugin.parser.create_new_note_from_template(item);
                break;
        }
    }
    insert_template() {
        this.open_mode = OpenMode.InsertTemplate;
        // If there is only one file in the templates directory, we don't open the modal
        try {
            let files = this.getItems();
            if (files.length == 1) {
                this.plugin.parser.replace_templates_and_append(files[0]);
            }
            else {
                this.open();
            }
        }
        catch (error) {
            this.plugin.log_error(error);
        }
    }
    create_new_note_from_template() {
        this.open_mode = OpenMode.CreateNoteTemplate;
        try {
            this.open();
        }
        catch (error) {
            this.plugin.log_error(error);
        }
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var eta_min = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports);}(commonjsGlobal,(function(e){function t(e){var n,r,i=new Error(e);return n=i,r=t.prototype,Object.setPrototypeOf?Object.setPrototypeOf(n,r):n.__proto__=r,i}function n(e,n,r){var i=n.slice(0,r).split(/\n/),a=i.length,o=i[a-1].length+1;throw t(e+=" at line "+a+" col "+o+":\n\n  "+n.split(/\n/)[a-1]+"\n  "+Array(o).join(" ")+"^")}t.prototype=Object.create(Error.prototype,{name:{value:"Eta Error",enumerable:!1}});var r=new Function("return this")().Promise;function i(e,t){for(var n in t)r=t,i=n,Object.prototype.hasOwnProperty.call(r,i)&&(e[n]=t[n]);var r,i;return e}function a(e,t,n,r){var i,a;return Array.isArray(t.autoTrim)?(i=t.autoTrim[1],a=t.autoTrim[0]):i=a=t.autoTrim,(n||!1===n)&&(i=n),(r||!1===r)&&(a=r),a||i?"slurp"===i&&"slurp"===a?e.trim():("_"===i||"slurp"===i?e=function(e){return String.prototype.trimLeft?e.trimLeft():e.replace(/^\s+/,"")}(e):"-"!==i&&"nl"!==i||(e=e.replace(/^(?:\r\n|\n|\r)/,"")),"_"===a||"slurp"===a?e=function(e){return String.prototype.trimRight?e.trimRight():e.replace(/\s+$/,"")}(e):"-"!==a&&"nl"!==a||(e=e.replace(/(?:\r\n|\n|\r)$/,"")),e):e}var o={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function s(e){return o[e]}var l=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,c=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,u=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;function p(e){return e.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&")}function f(e,t){var r=[],i=!1,o=0,s=t.parse;if(t.plugins)for(var f=0;f<t.plugins.length;f++){(T=t.plugins[f]).processTemplate&&(e=T.processTemplate(e,t));}function d(e,n){e&&(e=a(e,t,i,n))&&(e=e.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),r.push(e));}t.rmWhitespace&&(e=e.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")),l.lastIndex=0,c.lastIndex=0,u.lastIndex=0;for(var g,h=[s.exec,s.interpolate,s.raw].reduce((function(e,t){return e&&t?e+"|"+p(t):t?p(t):e}),""),m=new RegExp("([^]*?)"+p(t.tags[0])+"(-|_)?\\s*("+h+")?\\s*","g"),v=new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?"+p(t.tags[1])+")","g");g=m.exec(e);){o=g[0].length+g.index;var y=g[1],x=g[2],_=g[3]||"";d(y,x),v.lastIndex=o;for(var w=void 0,b=!1;w=v.exec(e);){if(w[1]){var E=e.slice(o,w.index);m.lastIndex=o=v.lastIndex,i=w[2],b={t:_===s.exec?"e":_===s.raw?"r":_===s.interpolate?"i":"",val:E};break}var I=w[0];if("/*"===I){var R=e.indexOf("*/",v.lastIndex);-1===R&&n("unclosed comment",e,w.index),v.lastIndex=R;}else if("'"===I){c.lastIndex=w.index,c.exec(e)?v.lastIndex=c.lastIndex:n("unclosed string",e,w.index);}else if('"'===I){u.lastIndex=w.index,u.exec(e)?v.lastIndex=u.lastIndex:n("unclosed string",e,w.index);}else if("`"===I){l.lastIndex=w.index,l.exec(e)?v.lastIndex=l.lastIndex:n("unclosed string",e,w.index);}}b?r.push(b):n("unclosed tag",e,g.index+y.length);}if(d(e.slice(o,e.length),!1),t.plugins)for(f=0;f<t.plugins.length;f++){var T;(T=t.plugins[f]).processAST&&(r=T.processAST(r,t));}return r}function d(e,t){var n=f(e,t),r="var tR='',__l,__lP"+(t.include?",include=E.include.bind(E)":"")+(t.includeFile?",includeFile=E.includeFile.bind(E)":"")+"\nfunction layout(p,d){__l=p;__lP=d}\n"+(t.globalAwait?"let prs = [];\n":"")+(t.useWith?"with("+t.varName+"||{}){":"")+function(e,t){var n,r=e.length,i="";if(t.globalAwait){for(n=0;n<r;n++){if("string"!=typeof(o=e[n]))if("r"===(s=o.t)||"i"===s)i+="prs.push("+(l=o.val||"")+");\n";}i+="let rst = await Promise.all(prs);\n";}var a=0;for(n=0;n<r;n++){var o;if("string"==typeof(o=e[n])){i+="tR+='"+o+"'\n";}else {var s=o.t,l=o.val||"";"r"===s?(t.globalAwait&&(l="rst["+a+"]"),t.filter&&(l="E.filter("+l+")"),i+="tR+="+l+"\n",a++):"i"===s?(t.globalAwait&&(l="rst["+a+"]"),t.filter&&(l="E.filter("+l+")"),t.autoEscape&&(l="E.e("+l+")"),i+="tR+="+l+"\n",a++):"e"===s&&(i+=l+"\n");}}return i}(n,t)+(t.includeFile?"if(__l)tR="+(t.async?"await ":"")+"includeFile(__l,Object.assign("+t.varName+",{body:tR},__lP))\n":t.include?"if(__l)tR="+(t.async?"await ":"")+"include(__l,Object.assign("+t.varName+",{body:tR},__lP))\n":"")+"if(cb){cb(null,tR)} return tR"+(t.useWith?"}":"");if(t.plugins)for(var i=0;i<t.plugins.length;i++){var a=t.plugins[i];a.processFnString&&(r=a.processFnString(r,t));}return r}var g=new(function(){function e(e){this.cache=e;}return e.prototype.define=function(e,t){this.cache[e]=t;},e.prototype.get=function(e){return this.cache[e]},e.prototype.remove=function(e){delete this.cache[e];},e.prototype.reset=function(){this.cache={};},e.prototype.load=function(e){i(this.cache,e);},e}())({});var h={async:!1,autoEscape:!0,autoTrim:[!1,"nl"],cache:!1,e:function(e){var t=String(e);return /[&<>"']/.test(t)?t.replace(/[&<>"']/g,s):t},include:function(e,n){var r=this.templates.get(e);if(!r)throw t('Could not fetch template "'+e+'"');return r(n,this)},parse:{exec:"",interpolate:"=",raw:"~"},plugins:[],rmWhitespace:!1,tags:["<%","%>"],templates:g,useWith:!1,varName:"it"};function m(e,t){var n={};return i(n,h),t&&i(n,t),e&&i(n,e),n}function v(e,n){var r=m(n||{}),i=r.async?function(){try{return new Function("return (async function(){}).constructor")()}catch(e){throw e instanceof SyntaxError?t("This environment doesn't support async/await"):e}}():Function;try{return new i(r.varName,"E","cb",d(e,r))}catch(n){throw n instanceof SyntaxError?t("Bad template syntax\n\n"+n.message+"\n"+Array(n.message.length+1).join("=")+"\n"+d(e,r)+"\n"):n}}function y(e,t){if(t.cache&&t.name&&t.templates.get(t.name))return t.templates.get(t.name);var n="function"==typeof e?e:v(e,t);return t.cache&&t.name&&t.templates.define(t.name,n),n}function x(e,n,i,a){var o=m(i||{});if(!o.async)return y(e,o)(n,o);if(!a){if("function"==typeof r)return new r((function(t,r){try{t(y(e,o)(n,o));}catch(e){r(e);}}));throw t("Please provide a callback function, this env doesn't support Promises")}try{y(e,o)(n,o,a);}catch(e){return a(e)}}e.compile=v,e.compileToString=d,e.config=h,e.configure=function(e){return i(h,e)},e.defaultConfig=h,e.getConfig=m,e.parse=f,e.render=x,e.renderAsync=function(e,t,n,r){return x(e,t,Object.assign({},n,{async:!0}),r)},e.templates=g,Object.defineProperty(e,"__esModule",{value:!0});}));
//# sourceMappingURL=eta.min.js.map
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class TParser {
    constructor(app) {
        this.app = app;
    }
}

class InternalModule extends TParser {
    constructor(app, plugin, file) {
        super(app);
        this.plugin = plugin;
        this.file = file;
        this.templates = new Map();
    }
    generateContext() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.generateTemplates();
            return Object.fromEntries(this.templates);
        });
    }
}

function get_date_string(date_format, days, moment_str, moment_format) {
    return window.moment(moment_str, moment_format).add(days, 'days').format(date_format);
}
const UNSUPPORTED_MOBILE_TEMPLATE = "Error_MobileUnsupportedTemplate";

class InternalModuleDate extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "date";
    }
    generateTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.templates.set("now", this.generate_now());
            this.templates.set("tomorrow", this.generate_tomorrow());
            this.templates.set("yesterday", this.generate_yesterday());
        });
    }
    generate_now() {
        return (format = "YYYY-MM-DD", offset, reference, reference_format) => {
            if (reference && !window.moment(reference, reference_format).isValid()) {
                throw new Error("Invalid title date format, try specifying one with the argument 'reference'");
            }
            return get_date_string(format, offset, reference, reference_format);
        };
    }
    generate_tomorrow() {
        return (format = "YYYY-MM-DD") => {
            return get_date_string(format, 1);
        };
    }
    generate_yesterday() {
        return (format = "YYYY-MM-DD") => {
            return get_date_string(format, -1);
        };
    }
}

const TP_FILE_CURSOR = "<% tp.file.cursor %>";
const DEPTH_LIMIT = 10;
class InternalModuleFile extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "file";
    }
    generateTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.templates.set("clipboard", this.generate_clipboard());
            this.templates.set("content", yield this.generate_content());
            this.templates.set("creation_date", this.generate_creation_date());
            // Hack to prevent empty output
            this.templates.set("cursor", TP_FILE_CURSOR);
            this.templates.set("folder", this.generate_folder());
            this.templates.set("include", this.generate_include());
            this.templates.set("last_modified_date", this.generate_last_modified_date());
            this.templates.set("path", this.generate_path());
            this.templates.set("rename", this.generate_rename());
            this.templates.set("selection", this.generate_selection());
            this.templates.set("tags", this.generate_tags());
            this.templates.set("title", this.generate_title());
        });
    }
    generate_clipboard() {
        return () => __awaiter(this, void 0, void 0, function* () {
            // TODO: Add mobile support
            if (this.app.isMobile) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            return yield navigator.clipboard.readText();
        });
    }
    generate_content() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.app.vault.read(this.file);
        });
    }
    generate_creation_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return get_date_string(format, undefined, this.file.stat.ctime);
        };
    }
    generate_folder() {
        return (relative = false) => {
            let parent = this.file.parent;
            let folder;
            if (relative) {
                folder = parent.path;
            }
            else {
                folder = parent.name;
            }
            return folder;
        };
    }
    generate_include() {
        return (include_filename) => __awaiter(this, void 0, void 0, function* () {
            let inc_file = this.app.metadataCache.getFirstLinkpathDest(obsidian.normalizePath(include_filename), "");
            if (!inc_file) {
                throw new Error(`File ${this.file} include doesn't exist`);
            }
            if (!(inc_file instanceof obsidian.TFile)) {
                throw new Error(`${this.file} is a folder, not a file`);
            }
            // TODO: Add mutex for this, this may currently lead to a race condition. 
            // While not very impactful, that could still be annoying.
            InternalModuleFile.depth += 1;
            if (InternalModuleFile.depth > DEPTH_LIMIT) {
                throw new Error("Reached inclusion depth limit (max = 10)");
            }
            let inc_file_content = yield this.app.vault.read(inc_file);
            let parsed_content = yield this.plugin.parser.parseTemplates(inc_file_content, this.file, ContextMode.USER_INTERNAL);
            InternalModuleFile.depth -= 1;
            return parsed_content;
        });
    }
    generate_last_modified_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return get_date_string(format, undefined, this.file.stat.mtime);
        };
    }
    generate_path() {
        return (relative = false) => {
            // TODO: Add mobile support
            if (this.app.isMobile) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            if (!(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
                throw new Error("app.vault is not a FileSystemAdapter instance");
            }
            let vault_path = this.app.vault.adapter.getBasePath();
            if (relative) {
                return this.file.path;
            }
            else {
                return `${vault_path}/${this.file.path}`;
            }
        };
    }
    generate_rename() {
        return (new_title) => __awaiter(this, void 0, void 0, function* () {
            let new_path = obsidian.normalizePath(`${this.file.parent.path}/${new_title}.${this.file.extension}`);
            yield this.app.fileManager.renameFile(this.file, new_path);
            return "";
        });
    }
    generate_selection() {
        return () => {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view == null) {
                throw new Error("Active view is null");
            }
            let editor = active_view.editor;
            return editor.getSelection();
        };
    }
    generate_tags() {
        let cache = this.app.metadataCache.getFileCache(this.file);
        return obsidian.getAllTags(cache);
    }
    generate_title() {
        return this.file.basename;
    }
}
InternalModuleFile.depth = 0;

class InternalModuleWeb extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "web";
    }
    generateTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.templates.set("daily_quote", this.generate_daily_quote());
            this.templates.set("random_picture", this.generate_random_picture());
            this.templates.set("get_request", this.generate_get_request());
        });
    }
    getRequest(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(url);
            if (!response.ok) {
                throw new Error("Error performing GET request");
            }
            return response;
        });
    }
    generate_daily_quote() {
        return () => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest("https://quotes.rest/qod");
            let json = yield response.json();
            let author = json.contents.quotes[0].author;
            let quote = json.contents.quotes[0].quote;
            let new_content = `> ${quote}\n> &mdash; <cite>${author}</cite>`;
            return new_content;
        });
    }
    generate_random_picture() {
        return (size = "1600x900", query) => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest(`https://source.unsplash.com/random/${size}?${query}`);
            let url = response.url;
            return `![tp.web.random_picture](${url})`;
        });
    }
    generate_get_request() {
        return (url) => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest(url);
            let json = yield response.json();
            return json;
        });
    }
}

class InternalModuleFrontmatter extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "frontmatter";
    }
    generateTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            let cache = this.app.metadataCache.getFileCache(this.file);
            if (cache.frontmatter) {
                this.templates = new Map(Object.entries(cache.frontmatter));
            }
        });
    }
}

class InternalTemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }
    generateModules(f) {
        return __awaiter(this, void 0, void 0, function* () {
            let modules_map = new Map();
            let modules_array = new Array();
            modules_array.push(new InternalModuleDate(this.app, this.plugin, f));
            modules_array.push(new InternalModuleFile(this.app, this.plugin, f));
            modules_array.push(new InternalModuleWeb(this.app, this.plugin, f));
            modules_array.push(new InternalModuleFrontmatter(this.app, this.plugin, f));
            for (let mod of modules_array) {
                modules_map.set(mod.name, yield mod.generateContext());
            }
            return modules_map;
        });
    }
    generateContext(f) {
        return __awaiter(this, void 0, void 0, function* () {
            let modules = yield this.generateModules(f);
            return Object.assign({}, Object.fromEntries(modules));
        });
    }
}

class UserTemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.resolveCwd();
    }
    resolveCwd() {
        // TODO: Add mobile support
        if (this.app.isMobile || !(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
            this.cwd = "";
        }
        else {
            this.cwd = this.app.vault.adapter.getBasePath();
        }
    }
    generateUserTemplates(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_templates = new Map();
            const exec_promise = util.promisify(child_process.exec);
            for (let [template, cmd] of this.plugin.settings.templates_pairs) {
                if (template === "" || cmd === "") {
                    continue;
                }
                cmd = yield this.plugin.parser.parseTemplates(cmd, file, ContextMode.INTERNAL);
                user_templates.set(template, (user_args) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let process_env = Object.assign(Object.assign({}, process.env), user_args);
                        let cmd_options = {
                            timeout: this.plugin.settings.command_timeout * 1000,
                            cwd: this.cwd,
                            env: process_env,
                        };
                        let { stdout } = yield exec_promise(cmd, cmd_options);
                        return stdout;
                    }
                    catch (error) {
                        this.plugin.log_error(`Error with User Template ${template}`, error);
                    }
                }));
            }
            return user_templates;
        });
    }
    generateContext(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_templates = yield this.generateUserTemplates(file);
            return Object.fromEntries(user_templates);
        });
    }
}

var ContextMode;
(function (ContextMode) {
    ContextMode[ContextMode["USER"] = 0] = "USER";
    ContextMode[ContextMode["INTERNAL"] = 1] = "INTERNAL";
    ContextMode[ContextMode["USER_INTERNAL"] = 2] = "USER_INTERNAL";
    ContextMode[ContextMode["DYNAMIC"] = 3] = "DYNAMIC";
})(ContextMode || (ContextMode = {}));
class TemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.userTemplateParser = null;
        this.internalTemplateParser = new InternalTemplateParser(this.app, this.plugin);
        // TODO: Add mobile support
        if (!this.app.isMobile) {
            this.userTemplateParser = new UserTemplateParser(this.app, this.plugin);
        }
    }
    generateContext(file, context_mode = ContextMode.USER_INTERNAL) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = {};
            let internal_context = yield this.internalTemplateParser.generateContext(file);
            let user_context = {};
            switch (context_mode) {
                case ContextMode.USER:
                    if (this.userTemplateParser) {
                        user_context = yield this.userTemplateParser.generateContext(file);
                    }
                    context = {
                        user: Object.assign({}, user_context)
                    };
                    break;
                case ContextMode.INTERNAL:
                    context = internal_context;
                    break;
                case ContextMode.DYNAMIC:
                    if (this.userTemplateParser) {
                        user_context = yield this.userTemplateParser.generateContext(file);
                    }
                    context = {
                        dynamic: Object.assign(Object.assign({}, internal_context), { user: Object.assign({}, user_context) })
                    };
                    break;
                case ContextMode.USER_INTERNAL:
                    if (this.userTemplateParser) {
                        user_context = yield this.userTemplateParser.generateContext(file);
                    }
                    context = Object.assign(Object.assign({}, internal_context), { user: Object.assign({}, user_context) });
                    break;
            }
            return Object.assign({}, context);
        });
    }
    parseTemplates(content, file, context_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = yield this.generateContext(file, context_mode);
            try {
                content = (yield eta_min.renderAsync(content, context, {
                    varName: "tp",
                    parse: {
                        exec: "*",
                        interpolate: "~",
                        raw: "",
                    },
                    autoTrim: false,
                    globalAwait: true,
                }));
            }
            catch (error) {
                this.plugin.log_error("Template parsing error, aborting.", error);
            }
            return content;
        });
    }
    replace_in_active_file() {
        try {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("Active view is null");
            }
            this.replace_templates_and_overwrite_in_file(active_view.file);
        }
        catch (error) {
            this.plugin.log_error(error);
        }
    }
    create_new_note_from_template(template_file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let template_content = yield this.app.vault.read(template_file);
                let created_note = yield this.app.vault.create("Untitled.md", "");
                let content = yield this.plugin.parser.parseTemplates(template_content, created_note, ContextMode.USER_INTERNAL);
                yield this.app.vault.modify(created_note, content);
                let active_leaf = this.app.workspace.activeLeaf;
                if (!active_leaf) {
                    throw new Error("No active leaf");
                }
                yield active_leaf.openFile(created_note, { state: { mode: 'source' }, eState: { rename: 'all' } });
                yield this.jump_to_next_cursor_location();
            }
            catch (error) {
                this.plugin.log_error(error);
            }
        });
    }
    replace_templates_and_append(template_file) {
        return __awaiter(this, void 0, void 0, function* () {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("No active view, can't append templates.");
            }
            let editor = active_view.editor;
            let doc = editor.getDoc();
            let content = yield this.app.vault.read(template_file);
            content = yield this.parseTemplates(content, active_view.file, ContextMode.USER_INTERNAL);
            doc.replaceSelection(content);
            yield this.jump_to_next_cursor_location();
            editor.focus();
        });
    }
    replace_templates_and_overwrite_in_file(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = yield this.app.vault.read(file);
            let new_content = yield this.parseTemplates(content, file, ContextMode.USER_INTERNAL);
            if (new_content !== content) {
                yield this.app.vault.modify(file, new_content);
                if (this.app.workspace.getActiveFile() === file) {
                    yield this.jump_to_next_cursor_location();
                }
            }
        });
    }
    jump_to_next_cursor_location() {
        return __awaiter(this, void 0, void 0, function* () {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("No active view, can't append templates.");
            }
            let active_file = active_view.file;
            yield active_view.save();
            let content = yield this.app.vault.read(active_file);
            let pos = this.get_cursor_position(content);
            if (pos) {
                content = content.replace(new RegExp(TP_FILE_CURSOR), "");
                yield this.app.vault.modify(active_file, content);
                this.set_cursor_location(pos);
            }
        });
    }
    get_cursor_position(content) {
        let pos = null;
        let index = content.indexOf(TP_FILE_CURSOR);
        if (index !== -1) {
            let substr = content.substr(0, index);
            let l = 0;
            let offset = -1;
            let r = -1;
            for (; (r = substr.indexOf("\n", r + 1)) !== -1; l++, offset = r)
                ;
            offset += 1;
            let ch = content.substr(offset, index - offset).length;
            pos = { line: l, ch: ch };
        }
        return pos;
    }
    set_cursor_location(pos) {
        if (!pos) {
            return;
        }
        let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (active_view === null) {
            return;
        }
        let editor = active_view.editor;
        editor.focus();
        editor.setCursor(pos);
    }
}

class TemplaterPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            // TODO: Remove this
            if (!this.settings.toggle_notice) {
                let notice = new obsidian.Notice("", 15000);
                notice.noticeEl.innerHTML = `What? Templater is <b>evolving</b>!<br/>
	The template syntax changed in this release, check out the new documentation for it on <a href="https://github.com/SilentVoid13/Templater#templater-obsidian-plugin">Templater's Github</a> or in the community plugins page.<br/>
	Enjoy new features for Templater: new internal templates, user templates arguments, conditional statements and more.<br/>
	Every already existing feature still exists of course, you just need to update the syntax in your templates files.<br/>
	Thanks for using Templater! SilentVoid.<br/>
	You can also find this message in the settings of Templater. This message will self-destruct in the next update. You can disable this notice in the settings.`;
            }
            this.fuzzySuggest = new TemplaterFuzzySuggestModal(this.app, this);
            this.parser = new TemplateParser(this.app, this);
            this.registerMarkdownPostProcessor((el, ctx) => this.dynamic_templates_processor(el, ctx));
            this.addRibbonIcon('three-horizontal-bars', 'Templater', () => __awaiter(this, void 0, void 0, function* () {
                this.fuzzySuggest.insert_template();
            }));
            this.addCommand({
                id: "insert-templater",
                name: "Insert Template",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: 'e',
                    },
                ],
                callback: () => {
                    this.fuzzySuggest.insert_template();
                },
            });
            this.addCommand({
                id: "replace-in-file-templater",
                name: "Replace templates in the active file",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: 'r',
                    },
                ],
                callback: () => {
                    this.parser.replace_in_active_file();
                },
            });
            this.addCommand({
                id: "jump-to-next-cursor-location",
                name: "Jump to next cursor location",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: "Tab",
                    },
                ],
                callback: () => {
                    try {
                        this.parser.jump_to_next_cursor_location();
                    }
                    catch (error) {
                        this.log_error(error);
                    }
                }
            });
            this.addCommand({
                id: "create-new-note-from-template",
                name: "Create new note from template",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: "n",
                    },
                ],
                callback: () => {
                    this.fuzzySuggest.create_new_note_from_template();
                }
            });
            this.app.workspace.on("layout-ready", () => {
                // TODO: Find a way to not trigger this on files copy
                this.app.vault.on("create", (file) => __awaiter(this, void 0, void 0, function* () {
                    // TODO: find a better way to do this
                    // Currently, I have to wait for the daily note plugin to add the file content before replacing
                    // Not a problem with Calendar however since it creates the file with the existing content
                    yield delay(300);
                    // ! This could corrupt binary files
                    if (!(file instanceof obsidian.TFile) || file.extension !== "md") {
                        return;
                    }
                    this.parser.replace_templates_and_overwrite_in_file(file);
                }));
            });
            this.addSettingTab(new TemplaterSettingTab(this.app, this));
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    log_error(msg, error) {
        if (error) {
            console.error(msg, error);
            new obsidian.Notice(`Templater Error: ${msg}\nCheck console for more informations`);
        }
        else {
            new obsidian.Notice(`Templater Error: ${msg}`);
        }
    }
    dynamic_templates_processor(el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (el.textContent.contains("tp.dynamic")) {
                // TODO: This will not always be the active file, 
                // I need to use getFirstLinkpathDest and ctx to find the actual file
                let file = this.app.workspace.getActiveFile();
                let new_html = yield this.parser.parseTemplates(el.innerHTML, file, ContextMode.DYNAMIC);
                el.innerHTML = new_html;
            }
        });
    }
}

module.exports = TemplaterPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9TZXR0aW5ncy50cyIsInNyYy9UZW1wbGF0ZXJGdXp6eVN1Z2dlc3QudHMiLCJub2RlX21vZHVsZXMvZXRhL2Rpc3QvYnJvd3Nlci9ldGEubWluLmpzIiwic3JjL1RQYXJzZXIudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvSW50ZXJuYWxNb2R1bGUudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvSW50ZXJuYWxVdGlscy50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy9kYXRlL0ludGVybmFsTW9kdWxlRGF0ZS50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy9maWxlL0ludGVybmFsTW9kdWxlRmlsZS50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy93ZWIvSW50ZXJuYWxNb2R1bGVXZWIudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvZnJvbnRtYXR0ZXIvSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlci50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy9JbnRlcm5hbFRlbXBsYXRlUGFyc2VyLnRzIiwic3JjL1VzZXJUZW1wbGF0ZXMvVXNlclRlbXBsYXRlUGFyc2VyLnRzIiwic3JjL1RlbXBsYXRlUGFyc2VyLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSAnLi9tYWluJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFRlbXBsYXRlclNldHRpbmdzID0ge1xuXHRjb21tYW5kX3RpbWVvdXQ6IDUsXG5cdHRlbXBsYXRlX2ZvbGRlcjogXCJcIixcblx0dGVtcGxhdGVzX3BhaXJzOiBbW1wiXCIsIFwiXCJdXSxcblx0dG9nZ2xlX25vdGljZTogZmFsc2UsXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlclNldHRpbmdzIHtcblx0Y29tbWFuZF90aW1lb3V0OiBudW1iZXI7XG5cdHRlbXBsYXRlX2ZvbGRlcjogc3RyaW5nO1xuXHR0ZW1wbGF0ZXNfcGFpcnM6IEFycmF5PFtzdHJpbmcsIHN0cmluZ10+O1xuXHR0b2dnbGVfbm90aWNlOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XG5cdH1cblxuXHRkaXNwbGF5KCk6IHZvaWQge1xuXHRcdGxldCB7Y29udGFpbmVyRWx9ID0gdGhpcztcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xuXG5cdFx0Ly8gVE9ETzogUmVtb3ZlIHRoaXNcblx0XHRsZXQgbm90aWNlX2ZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGxldCBub3RpY2VfZGl2ID0gbm90aWNlX2ZyYWdtZW50LmNyZWF0ZUVsKFwiZGl2XCIpO1xuXHRcdG5vdGljZV9kaXYuaW5uZXJIVE1MID0gYFdoYXQ/IFRlbXBsYXRlciBpcyA8Yj5ldm9sdmluZzwvYj4hPGJyLz5cblRoZSB0ZW1wbGF0ZSBzeW50YXggY2hhbmdlZCBpbiB0aGlzIHJlbGVhc2UsIGNoZWNrIG91dCB0aGUgbmV3IGRvY3VtZW50YXRpb24gZm9yIGl0IG9uIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vU2lsZW50Vm9pZDEzL1RlbXBsYXRlciN0ZW1wbGF0ZXItb2JzaWRpYW4tcGx1Z2luXCI+VGVtcGxhdGVyJ3MgR2l0aHViPC9hPiBvciBpbiB0aGUgY29tbXVuaXR5IHBsdWdpbnMgcGFnZS48YnIvPlxuRW5qb3kgbmV3IGZlYXR1cmVzIGZvciBUZW1wbGF0ZXI6IG5ldyBpbnRlcm5hbCB0ZW1wbGF0ZXMsIHVzZXIgdGVtcGxhdGVzIGFyZ3VtZW50cywgY29uZGl0aW9uYWwgc3RhdGVtZW50cyBhbmQgbW9yZS48YnIvPlxuRXZlcnkgYWxyZWFkeSBleGlzdGluZyBmZWF0dXJlIHN0aWxsIGV4aXN0cyBvZiBjb3Vyc2UsIHlvdSBqdXN0IG5lZWQgdG8gdXBkYXRlIHRoZSBzeW50YXggaW4geW91ciB0ZW1wbGF0ZXMgZmlsZXMuPGJyLz5cblRoYW5rcyBmb3IgdXNpbmcgVGVtcGxhdGVyISBTaWxlbnRWb2lkLjxici8+XG5UaGlzIG1lc3NhZ2Ugd2lsbCBzZWxmLWRlc3RydWN0IGluIHRoZSBuZXh0IHVwZGF0ZS5gO1xuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJUZW1wbGF0ZXIgVXBkYXRlXCIpXG5cdFx0XHQuc2V0RGVzYyhub3RpY2VfZnJhZ21lbnQpO1xuXG5cdFx0bGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cdFx0bGluay5ocmVmID0gXCJodHRwczovL2dpdGh1Yi5jb20vU2lsZW50Vm9pZDEzL1RlbXBsYXRlciNpbnRlcm5hbC1jb21tYW5kc1wiO1xuXHRcdGxpbmsudGV4dCA9IFwiaGVyZVwiO1xuXHRcdGZyYWdtZW50LmFwcGVuZChcIkNsaWNrIFwiKTtcblx0XHRmcmFnbWVudC5hcHBlbmQobGluayk7XG5cdFx0ZnJhZ21lbnQuYXBwZW5kKFwiIHRvIGdldCBhIGxpc3Qgb2YgYWxsIHRoZSBhdmFpbGFibGUgaW50ZXJuYWwgdmFyaWFibGVzIC8gZnVuY3Rpb25zLlwiKTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJEaXNhYmxlcyB1cGRhdGUgTm90aWNlXCIpXG5cdFx0XHQuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB7XG5cdFx0XHRcdHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b2dnbGVfbm90aWNlKVxuXHRcdFx0XHRcdC5vbkNoYW5nZSh0b2dnbGVfbm90aWNlID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRvZ2dsZV9ub3RpY2UgPSB0b2dnbGVfbm90aWNlO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiVGVtcGxhdGUgZm9sZGVyIGxvY2F0aW9uXCIpXG5cdFx0XHQuc2V0RGVzYyhcIkZpbGVzIGluIHRoaXMgZm9sZGVyIHdpbGwgYmUgYXZhaWxhYmxlIGFzIHRlbXBsYXRlcy5cIilcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4ge1xuXHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyIDEvZm9sZGVyIDJcIilcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyKVxuXHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X2ZvbGRlcikgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyID0gbmV3X2ZvbGRlcjtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJUaW1lb3V0XCIpXG5cdFx0XHQuc2V0RGVzYyhcIk1heGltdW0gdGltZW91dCBpbiBzZWNvbmRzIGZvciBhIGNvbW1hbmQuXCIpXG5cdFx0XHQuYWRkVGV4dCh0ZXh0ID0+IHtcblx0XHRcdFx0dGV4dC5zZXRQbGFjZWhvbGRlcihcIlRpbWVvdXRcIilcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWFuZF90aW1lb3V0LnRvU3RyaW5nKCkpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKChuZXdfdmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdGxldCBuZXdfdGltZW91dCA9IE51bWJlcihuZXdfdmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKGlzTmFOKG5ld190aW1lb3V0KSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5sb2dfZXJyb3IoXCJUaW1lb3V0IG11c3QgYmUgYSBudW1iZXJcIik7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dCA9IG5ld190aW1lb3V0O1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIkludGVybmFsIFZhcmlhYmxlcyBhbmQgRnVuY3Rpb25zXCIpXG5cdFx0XHQuc2V0RGVzYyhmcmFnbWVudCk7XG5cblx0XHRsZXQgaSA9IDE7XG5cdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmZvckVhY2goKHRlbXBsYXRlX3BhaXIpID0+IHtcblx0XHRcdGxldCBkaXYgPSBjb250YWluZXJFbC5jcmVhdGVFbCgnZGl2Jyk7XG5cdFx0XHRkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfZGl2XCIpO1xuXG5cdFx0XHRsZXQgdGl0bGUgPSBjb250YWluZXJFbC5jcmVhdGVFbCgnaDQnLCB7XG5cdFx0XHRcdHRleHQ6ICdVc2VyIEZ1bmN0aW9uIG7CsCcgKyBpLFxuXHRcdFx0fSk7XG5cdFx0XHR0aXRsZS5hZGRDbGFzcyhcInRlbXBsYXRlcl90aXRsZVwiKTtcblxuXHRcdFx0bGV0IHNldHRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdFx0LmFkZEV4dHJhQnV0dG9uKGV4dHJhID0+IHtcblx0XHRcdFx0XHRleHRyYS5zZXRJY29uKFwiY3Jvc3NcIilcblx0XHRcdFx0XHRcdC5zZXRUb29sdGlwKFwiRGVsZXRlXCIpXG5cdFx0XHRcdFx0XHQub25DbGljaygoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGxldCBpbmRleCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5pbmRleE9mKHRlbXBsYXRlX3BhaXIpO1xuXHRcdFx0XHRcdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdC8vIEZvcmNlIHJlZnJlc2hcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmRpc3BsYXkoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0fSlcblx0XHRcdFx0LmFkZFRleHQodGV4dCA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgdCA9IHRleHQuc2V0UGxhY2Vob2xkZXIoJ0Z1bmN0aW9uIG5hbWUnKVxuXHRcdFx0XHRcdFx0LnNldFZhbHVlKHRlbXBsYXRlX3BhaXJbMF0pXG5cdFx0XHRcdFx0XHQub25DaGFuZ2UoKG5ld192YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRsZXQgaW5kZXggPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuaW5kZXhPZih0ZW1wbGF0ZV9wYWlyKTtcblx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnNbaW5kZXhdWzBdID0gbmV3X3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHQuaW5wdXRFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl90ZW1wbGF0ZVwiKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpXG5cdFx0XHRcdC5hZGRUZXh0QXJlYSh0ZXh0ID0+IHtcblx0XHRcdFx0XHRsZXQgdCA9IHRleHQuc2V0UGxhY2Vob2xkZXIoJ1N5c3RlbSBDb21tYW5kJylcblx0XHRcdFx0XHQuc2V0VmFsdWUodGVtcGxhdGVfcGFpclsxXSlcblx0XHRcdFx0XHQub25DaGFuZ2UoKG5ld19jbWQpID0+IHtcblx0XHRcdFx0XHRcdGxldCBpbmRleCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5pbmRleE9mKHRlbXBsYXRlX3BhaXIpO1xuXHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzW2luZGV4XVsxXSA9IG5ld19jbWQ7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0dC5pbnB1dEVsLnNldEF0dHIoXCJyb3dzXCIsIDQpO1xuXHRcdFx0XHRcdHQuaW5wdXRFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9jbWRcIik7XG5cblx0XHRcdFx0XHRyZXR1cm4gdDtcblx0XHRcdFx0fSk7XG5cblx0XHRcdHNldHRpbmcuaW5mb0VsLnJlbW92ZSgpO1xuXG5cdFx0XHRkaXYuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXHRcdFx0ZGl2LmFwcGVuZENoaWxkKGNvbnRhaW5lckVsLmxhc3RDaGlsZCk7XG5cblx0XHRcdGkrPTE7XG5cdFx0fSk7XG5cblx0XHRsZXQgZGl2ID0gY29udGFpbmVyRWwuY3JlYXRlRWwoJ2RpdicpO1xuXHRcdGRpdi5hZGRDbGFzcyhcInRlbXBsYXRlcl9kaXYyXCIpO1xuXG5cdFx0bGV0IHNldHRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5hZGRCdXR0b24oYnV0dG9uID0+IHtcblx0XHRcdFx0bGV0IGIgPSBidXR0b24uc2V0QnV0dG9uVGV4dChcIkFkZCBOZXcgVXNlciBDb21tYW5kXCIpLm9uQ2xpY2soKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5wdXNoKFtcIlwiLCBcIlwiXSk7XG5cdFx0XHRcdFx0Ly8gRm9yY2UgcmVmcmVzaFxuXHRcdFx0XHRcdHRoaXMuZGlzcGxheSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Yi5idXR0b25FbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9idXR0b25cIik7XG5cblx0XHRcdFx0cmV0dXJuIGI7XG5cdFx0XHR9KTtcblx0XHRzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuXHRcdGRpdi5hcHBlbmRDaGlsZChjb250YWluZXJFbC5sYXN0Q2hpbGQpO1xuXHR9XG59IiwiaW1wb3J0IHsgQXBwLCBGdXp6eVN1Z2dlc3RNb2RhbCwgVEZpbGUsIFRGb2xkZXIsIG5vcm1hbGl6ZVBhdGgsIFZhdWx0LCBUQWJzdHJhY3RGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gJy4vbWFpbic7XG5cbmV4cG9ydCBlbnVtIE9wZW5Nb2RlIHtcbiAgICBJbnNlcnRUZW1wbGF0ZSxcbiAgICBDcmVhdGVOb3RlVGVtcGxhdGUsXG59O1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVyRnV6enlTdWdnZXN0TW9kYWwgZXh0ZW5kcyBGdXp6eVN1Z2dlc3RNb2RhbDxURmlsZT4ge1xuICAgIGFwcDogQXBwO1xuICAgIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luO1xuICAgIG9wZW5fbW9kZTogT3Blbk1vZGU7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgIH1cblxuICAgIGdldEl0ZW1zKCk6IFRGaWxlW10ge1xuICAgICAgICBsZXQgdGVtcGxhdGVfZmlsZXM6IFRGaWxlW10gPSBbXTtcblxuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyID09PSBcIlwiKSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpO1xuICAgICAgICAgICAgdGVtcGxhdGVfZmlsZXMgPSBmaWxlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZV9mb2xkZXJfc3RyID0gbm9ybWFsaXplUGF0aCh0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZV9mb2xkZXIpO1xuXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGVfZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHRlbXBsYXRlX2ZvbGRlcl9zdHIpO1xuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZV9mb2xkZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGVtcGxhdGVfZm9sZGVyX3N0cn0gZm9sZGVyIGRvZXNuJ3QgZXhpc3RgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghICh0ZW1wbGF0ZV9mb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0ZW1wbGF0ZV9mb2xkZXJfc3RyfSBpcyBhIGZpbGUsIG5vdCBhIGZvbGRlcmApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBWYXVsdC5yZWN1cnNlQ2hpbGRyZW4odGVtcGxhdGVfZm9sZGVyLCAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVfZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGVtcGxhdGVfZmlsZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmJhc2VuYW1lLmxvY2FsZUNvbXBhcmUoYi5iYXNlbmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZV9maWxlcztcbiAgICB9XG5cbiAgICBnZXRJdGVtVGV4dChpdGVtOiBURmlsZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBpdGVtLmJhc2VuYW1lO1xuICAgIH1cblxuICAgIG9uQ2hvb3NlSXRlbShpdGVtOiBURmlsZSwgX2V2dDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoKHRoaXMub3Blbl9tb2RlKSB7XG4gICAgICAgICAgICBjYXNlIE9wZW5Nb2RlLkluc2VydFRlbXBsYXRlOlxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnBhcnNlci5yZXBsYWNlX3RlbXBsYXRlc19hbmRfYXBwZW5kKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5DcmVhdGVOb3RlVGVtcGxhdGU6XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucGFyc2VyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5zZXJ0X3RlbXBsYXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wZW5fbW9kZSA9IE9wZW5Nb2RlLkluc2VydFRlbXBsYXRlO1xuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIGZpbGUgaW4gdGhlIHRlbXBsYXRlcyBkaXJlY3RvcnksIHdlIGRvbid0IG9wZW4gdGhlIG1vZGFsXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSB0aGlzLmdldEl0ZW1zKCk7XG4gICAgICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5wYXJzZXIucmVwbGFjZV90ZW1wbGF0ZXNfYW5kX2FwcGVuZChmaWxlc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ubG9nX2Vycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKCkge1xuICAgICAgICB0aGlzLm9wZW5fbW9kZSA9IE9wZW5Nb2RlLkNyZWF0ZU5vdGVUZW1wbGF0ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmxvZ19lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KChlPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6ZXx8c2VsZikuRXRhPXt9KX0odGhpcywoZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlKXt2YXIgbixyLGk9bmV3IEVycm9yKGUpO3JldHVybiBuPWkscj10LnByb3RvdHlwZSxPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKG4scik6bi5fX3Byb3RvX189cixpfWZ1bmN0aW9uIG4oZSxuLHIpe3ZhciBpPW4uc2xpY2UoMCxyKS5zcGxpdCgvXFxuLyksYT1pLmxlbmd0aCxvPWlbYS0xXS5sZW5ndGgrMTt0aHJvdyB0KGUrPVwiIGF0IGxpbmUgXCIrYStcIiBjb2wgXCIrbytcIjpcXG5cXG4gIFwiK24uc3BsaXQoL1xcbi8pW2EtMV0rXCJcXG4gIFwiK0FycmF5KG8pLmpvaW4oXCIgXCIpK1wiXlwiKX10LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSx7bmFtZTp7dmFsdWU6XCJFdGEgRXJyb3JcIixlbnVtZXJhYmxlOiExfX0pO3ZhciByPW5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkuUHJvbWlzZTtmdW5jdGlvbiBpKGUsdCl7Zm9yKHZhciBuIGluIHQpcj10LGk9bixPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocixpKSYmKGVbbl09dFtuXSk7dmFyIHIsaTtyZXR1cm4gZX1mdW5jdGlvbiBhKGUsdCxuLHIpe3ZhciBpLGE7cmV0dXJuIEFycmF5LmlzQXJyYXkodC5hdXRvVHJpbSk/KGk9dC5hdXRvVHJpbVsxXSxhPXQuYXV0b1RyaW1bMF0pOmk9YT10LmF1dG9UcmltLChufHwhMT09PW4pJiYoaT1uKSwocnx8ITE9PT1yKSYmKGE9ciksYXx8aT9cInNsdXJwXCI9PT1pJiZcInNsdXJwXCI9PT1hP2UudHJpbSgpOihcIl9cIj09PWl8fFwic2x1cnBcIj09PWk/ZT1mdW5jdGlvbihlKXtyZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdD9lLnRyaW1MZWZ0KCk6ZS5yZXBsYWNlKC9eXFxzKy8sXCJcIil9KGUpOlwiLVwiIT09aSYmXCJubFwiIT09aXx8KGU9ZS5yZXBsYWNlKC9eKD86XFxyXFxufFxcbnxcXHIpLyxcIlwiKSksXCJfXCI9PT1hfHxcInNsdXJwXCI9PT1hP2U9ZnVuY3Rpb24oZSl7cmV0dXJuIFN0cmluZy5wcm90b3R5cGUudHJpbVJpZ2h0P2UudHJpbVJpZ2h0KCk6ZS5yZXBsYWNlKC9cXHMrJC8sXCJcIil9KGUpOlwiLVwiIT09YSYmXCJubFwiIT09YXx8KGU9ZS5yZXBsYWNlKC8oPzpcXHJcXG58XFxufFxccikkLyxcIlwiKSksZSk6ZX12YXIgbz17XCImXCI6XCImYW1wO1wiLFwiPFwiOlwiJmx0O1wiLFwiPlwiOlwiJmd0O1wiLCdcIic6XCImcXVvdDtcIixcIidcIjpcIiYjMzk7XCJ9O2Z1bmN0aW9uIHMoZSl7cmV0dXJuIG9bZV19dmFyIGw9L2AoPzpcXFxcW1xcc1xcU118XFwkeyg/Oltee31dfHsoPzpbXnt9XXx7W159XSp9KSp9KSp9fCg/IVxcJHspW15cXFxcYF0pKmAvZyxjPS8nKD86XFxcXFtcXHNcXHdcIidcXFxcYF18W15cXG5cXHInXFxcXF0pKj8nL2csdT0vXCIoPzpcXFxcW1xcc1xcd1wiJ1xcXFxgXXxbXlxcblxcclwiXFxcXF0pKj9cIi9nO2Z1bmN0aW9uIHAoZSl7cmV0dXJuIGUucmVwbGFjZSgvWy4qK1xcLT9eJHt9KCl8W1xcXVxcXFxdL2csXCJcXFxcJCZcIil9ZnVuY3Rpb24gZihlLHQpe3ZhciByPVtdLGk9ITEsbz0wLHM9dC5wYXJzZTtpZih0LnBsdWdpbnMpZm9yKHZhciBmPTA7Zjx0LnBsdWdpbnMubGVuZ3RoO2YrKyl7KFQ9dC5wbHVnaW5zW2ZdKS5wcm9jZXNzVGVtcGxhdGUmJihlPVQucHJvY2Vzc1RlbXBsYXRlKGUsdCkpfWZ1bmN0aW9uIGQoZSxuKXtlJiYoZT1hKGUsdCxpLG4pKSYmKGU9ZS5yZXBsYWNlKC9cXFxcfCcvZyxcIlxcXFwkJlwiKS5yZXBsYWNlKC9cXHJcXG58XFxufFxcci9nLFwiXFxcXG5cIiksci5wdXNoKGUpKX10LnJtV2hpdGVzcGFjZSYmKGU9ZS5yZXBsYWNlKC9bXFxyXFxuXSsvZyxcIlxcblwiKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSxcIlwiKSksbC5sYXN0SW5kZXg9MCxjLmxhc3RJbmRleD0wLHUubGFzdEluZGV4PTA7Zm9yKHZhciBnLGg9W3MuZXhlYyxzLmludGVycG9sYXRlLHMucmF3XS5yZWR1Y2UoKGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUmJnQ/ZStcInxcIitwKHQpOnQ/cCh0KTplfSksXCJcIiksbT1uZXcgUmVnRXhwKFwiKFteXSo/KVwiK3AodC50YWdzWzBdKStcIigtfF8pP1xcXFxzKihcIitoK1wiKT9cXFxccypcIixcImdcIiksdj1uZXcgUmVnRXhwKFwiJ3xcXFwifGB8XFxcXC9cXFxcKnwoXFxcXHMqKC18Xyk/XCIrcCh0LnRhZ3NbMV0pK1wiKVwiLFwiZ1wiKTtnPW0uZXhlYyhlKTspe289Z1swXS5sZW5ndGgrZy5pbmRleDt2YXIgeT1nWzFdLHg9Z1syXSxfPWdbM118fFwiXCI7ZCh5LHgpLHYubGFzdEluZGV4PW87Zm9yKHZhciB3PXZvaWQgMCxiPSExO3c9di5leGVjKGUpOyl7aWYod1sxXSl7dmFyIEU9ZS5zbGljZShvLHcuaW5kZXgpO20ubGFzdEluZGV4PW89di5sYXN0SW5kZXgsaT13WzJdLGI9e3Q6Xz09PXMuZXhlYz9cImVcIjpfPT09cy5yYXc/XCJyXCI6Xz09PXMuaW50ZXJwb2xhdGU/XCJpXCI6XCJcIix2YWw6RX07YnJlYWt9dmFyIEk9d1swXTtpZihcIi8qXCI9PT1JKXt2YXIgUj1lLmluZGV4T2YoXCIqL1wiLHYubGFzdEluZGV4KTstMT09PVImJm4oXCJ1bmNsb3NlZCBjb21tZW50XCIsZSx3LmluZGV4KSx2Lmxhc3RJbmRleD1SfWVsc2UgaWYoXCInXCI9PT1JKXtjLmxhc3RJbmRleD13LmluZGV4LGMuZXhlYyhlKT92Lmxhc3RJbmRleD1jLmxhc3RJbmRleDpuKFwidW5jbG9zZWQgc3RyaW5nXCIsZSx3LmluZGV4KX1lbHNlIGlmKCdcIic9PT1JKXt1Lmxhc3RJbmRleD13LmluZGV4LHUuZXhlYyhlKT92Lmxhc3RJbmRleD11Lmxhc3RJbmRleDpuKFwidW5jbG9zZWQgc3RyaW5nXCIsZSx3LmluZGV4KX1lbHNlIGlmKFwiYFwiPT09SSl7bC5sYXN0SW5kZXg9dy5pbmRleCxsLmV4ZWMoZSk/di5sYXN0SW5kZXg9bC5sYXN0SW5kZXg6bihcInVuY2xvc2VkIHN0cmluZ1wiLGUsdy5pbmRleCl9fWI/ci5wdXNoKGIpOm4oXCJ1bmNsb3NlZCB0YWdcIixlLGcuaW5kZXgreS5sZW5ndGgpfWlmKGQoZS5zbGljZShvLGUubGVuZ3RoKSwhMSksdC5wbHVnaW5zKWZvcihmPTA7Zjx0LnBsdWdpbnMubGVuZ3RoO2YrKyl7dmFyIFQ7KFQ9dC5wbHVnaW5zW2ZdKS5wcm9jZXNzQVNUJiYocj1ULnByb2Nlc3NBU1Qocix0KSl9cmV0dXJuIHJ9ZnVuY3Rpb24gZChlLHQpe3ZhciBuPWYoZSx0KSxyPVwidmFyIHRSPScnLF9fbCxfX2xQXCIrKHQuaW5jbHVkZT9cIixpbmNsdWRlPUUuaW5jbHVkZS5iaW5kKEUpXCI6XCJcIikrKHQuaW5jbHVkZUZpbGU/XCIsaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpXCI6XCJcIikrXCJcXG5mdW5jdGlvbiBsYXlvdXQocCxkKXtfX2w9cDtfX2xQPWR9XFxuXCIrKHQuZ2xvYmFsQXdhaXQ/XCJsZXQgcHJzID0gW107XFxuXCI6XCJcIikrKHQudXNlV2l0aD9cIndpdGgoXCIrdC52YXJOYW1lK1wifHx7fSl7XCI6XCJcIikrZnVuY3Rpb24oZSx0KXt2YXIgbixyPWUubGVuZ3RoLGk9XCJcIjtpZih0Lmdsb2JhbEF3YWl0KXtmb3Iobj0wO248cjtuKyspe2lmKFwic3RyaW5nXCIhPXR5cGVvZihvPWVbbl0pKWlmKFwiclwiPT09KHM9by50KXx8XCJpXCI9PT1zKWkrPVwicHJzLnB1c2goXCIrKGw9by52YWx8fFwiXCIpK1wiKTtcXG5cIn1pKz1cImxldCByc3QgPSBhd2FpdCBQcm9taXNlLmFsbChwcnMpO1xcblwifXZhciBhPTA7Zm9yKG49MDtuPHI7bisrKXt2YXIgbztpZihcInN0cmluZ1wiPT10eXBlb2Yobz1lW25dKSl7aSs9XCJ0Uis9J1wiK28rXCInXFxuXCJ9ZWxzZXt2YXIgcz1vLnQsbD1vLnZhbHx8XCJcIjtcInJcIj09PXM/KHQuZ2xvYmFsQXdhaXQmJihsPVwicnN0W1wiK2ErXCJdXCIpLHQuZmlsdGVyJiYobD1cIkUuZmlsdGVyKFwiK2wrXCIpXCIpLGkrPVwidFIrPVwiK2wrXCJcXG5cIixhKyspOlwiaVwiPT09cz8odC5nbG9iYWxBd2FpdCYmKGw9XCJyc3RbXCIrYStcIl1cIiksdC5maWx0ZXImJihsPVwiRS5maWx0ZXIoXCIrbCtcIilcIiksdC5hdXRvRXNjYXBlJiYobD1cIkUuZShcIitsK1wiKVwiKSxpKz1cInRSKz1cIitsK1wiXFxuXCIsYSsrKTpcImVcIj09PXMmJihpKz1sK1wiXFxuXCIpfX1yZXR1cm4gaX0obix0KSsodC5pbmNsdWRlRmlsZT9cImlmKF9fbCl0Uj1cIisodC5hc3luYz9cImF3YWl0IFwiOlwiXCIpK1wiaW5jbHVkZUZpbGUoX19sLE9iamVjdC5hc3NpZ24oXCIrdC52YXJOYW1lK1wiLHtib2R5OnRSfSxfX2xQKSlcXG5cIjp0LmluY2x1ZGU/XCJpZihfX2wpdFI9XCIrKHQuYXN5bmM/XCJhd2FpdCBcIjpcIlwiKStcImluY2x1ZGUoX19sLE9iamVjdC5hc3NpZ24oXCIrdC52YXJOYW1lK1wiLHtib2R5OnRSfSxfX2xQKSlcXG5cIjpcIlwiKStcImlmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSXCIrKHQudXNlV2l0aD9cIn1cIjpcIlwiKTtpZih0LnBsdWdpbnMpZm9yKHZhciBpPTA7aTx0LnBsdWdpbnMubGVuZ3RoO2krKyl7dmFyIGE9dC5wbHVnaW5zW2ldO2EucHJvY2Vzc0ZuU3RyaW5nJiYocj1hLnByb2Nlc3NGblN0cmluZyhyLHQpKX1yZXR1cm4gcn12YXIgZz1uZXcoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUpe3RoaXMuY2FjaGU9ZX1yZXR1cm4gZS5wcm90b3R5cGUuZGVmaW5lPWZ1bmN0aW9uKGUsdCl7dGhpcy5jYWNoZVtlXT10fSxlLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuY2FjaGVbZV19LGUucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihlKXtkZWxldGUgdGhpcy5jYWNoZVtlXX0sZS5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLmNhY2hlPXt9fSxlLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGUpe2kodGhpcy5jYWNoZSxlKX0sZX0oKSkoe30pO3ZhciBoPXthc3luYzohMSxhdXRvRXNjYXBlOiEwLGF1dG9UcmltOlshMSxcIm5sXCJdLGNhY2hlOiExLGU6ZnVuY3Rpb24oZSl7dmFyIHQ9U3RyaW5nKGUpO3JldHVybi9bJjw+XCInXS8udGVzdCh0KT90LnJlcGxhY2UoL1smPD5cIiddL2cscyk6dH0saW5jbHVkZTpmdW5jdGlvbihlLG4pe3ZhciByPXRoaXMudGVtcGxhdGVzLmdldChlKTtpZighcil0aHJvdyB0KCdDb3VsZCBub3QgZmV0Y2ggdGVtcGxhdGUgXCInK2UrJ1wiJyk7cmV0dXJuIHIobix0aGlzKX0scGFyc2U6e2V4ZWM6XCJcIixpbnRlcnBvbGF0ZTpcIj1cIixyYXc6XCJ+XCJ9LHBsdWdpbnM6W10scm1XaGl0ZXNwYWNlOiExLHRhZ3M6W1wiPCVcIixcIiU+XCJdLHRlbXBsYXRlczpnLHVzZVdpdGg6ITEsdmFyTmFtZTpcIml0XCJ9O2Z1bmN0aW9uIG0oZSx0KXt2YXIgbj17fTtyZXR1cm4gaShuLGgpLHQmJmkobix0KSxlJiZpKG4sZSksbn1mdW5jdGlvbiB2KGUsbil7dmFyIHI9bShufHx7fSksaT1yLmFzeW5jP2Z1bmN0aW9uKCl7dHJ5e3JldHVybiBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gKGFzeW5jIGZ1bmN0aW9uKCl7fSkuY29uc3RydWN0b3JcIikoKX1jYXRjaChlKXt0aHJvdyBlIGluc3RhbmNlb2YgU3ludGF4RXJyb3I/dChcIlRoaXMgZW52aXJvbm1lbnQgZG9lc24ndCBzdXBwb3J0IGFzeW5jL2F3YWl0XCIpOmV9fSgpOkZ1bmN0aW9uO3RyeXtyZXR1cm4gbmV3IGkoci52YXJOYW1lLFwiRVwiLFwiY2JcIixkKGUscikpfWNhdGNoKG4pe3Rocm93IG4gaW5zdGFuY2VvZiBTeW50YXhFcnJvcj90KFwiQmFkIHRlbXBsYXRlIHN5bnRheFxcblxcblwiK24ubWVzc2FnZStcIlxcblwiK0FycmF5KG4ubWVzc2FnZS5sZW5ndGgrMSkuam9pbihcIj1cIikrXCJcXG5cIitkKGUscikrXCJcXG5cIik6bn19ZnVuY3Rpb24geShlLHQpe2lmKHQuY2FjaGUmJnQubmFtZSYmdC50ZW1wbGF0ZXMuZ2V0KHQubmFtZSkpcmV0dXJuIHQudGVtcGxhdGVzLmdldCh0Lm5hbWUpO3ZhciBuPVwiZnVuY3Rpb25cIj09dHlwZW9mIGU/ZTp2KGUsdCk7cmV0dXJuIHQuY2FjaGUmJnQubmFtZSYmdC50ZW1wbGF0ZXMuZGVmaW5lKHQubmFtZSxuKSxufWZ1bmN0aW9uIHgoZSxuLGksYSl7dmFyIG89bShpfHx7fSk7aWYoIW8uYXN5bmMpcmV0dXJuIHkoZSxvKShuLG8pO2lmKCFhKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiByKXJldHVybiBuZXcgcigoZnVuY3Rpb24odCxyKXt0cnl7dCh5KGUsbykobixvKSl9Y2F0Y2goZSl7cihlKX19KSk7dGhyb3cgdChcIlBsZWFzZSBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24sIHRoaXMgZW52IGRvZXNuJ3Qgc3VwcG9ydCBQcm9taXNlc1wiKX10cnl7eShlLG8pKG4sbyxhKX1jYXRjaChlKXtyZXR1cm4gYShlKX19ZS5jb21waWxlPXYsZS5jb21waWxlVG9TdHJpbmc9ZCxlLmNvbmZpZz1oLGUuY29uZmlndXJlPWZ1bmN0aW9uKGUpe3JldHVybiBpKGgsZSl9LGUuZGVmYXVsdENvbmZpZz1oLGUuZ2V0Q29uZmlnPW0sZS5wYXJzZT1mLGUucmVuZGVyPXgsZS5yZW5kZXJBc3luYz1mdW5jdGlvbihlLHQsbixyKXtyZXR1cm4geChlLHQsT2JqZWN0LmFzc2lnbih7fSxuLHthc3luYzohMH0pLHIpfSxlLnRlbXBsYXRlcz1nLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXRhLm1pbi5qcy5tYXBcbiIsImltcG9ydCB7IEFwcCwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykgKTtcbn07XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHApIHt9XG4gICAgYWJzdHJhY3QgZ2VuZXJhdGVDb250ZXh0KGZpbGU6IFRGaWxlKTogUHJvbWlzZTxhbnk+O1xufSIsImltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IEFwcCwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFRQYXJzZXIgfSBmcm9tIFwiVFBhcnNlclwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW50ZXJuYWxNb2R1bGUgZXh0ZW5kcyBUUGFyc2VyIHtcbiAgICBwdWJsaWMgYWJzdHJhY3QgbmFtZTogc3RyaW5nO1xuICAgIHRlbXBsYXRlczogTWFwPHN0cmluZywgYW55PjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcm90ZWN0ZWQgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4sIHByb3RlY3RlZCBmaWxlOiBURmlsZSkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZW5lcmF0ZVRlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgYXN5bmMgZ2VuZXJhdGVDb250ZXh0KCkge1xuICAgICAgICBhd2FpdCB0aGlzLmdlbmVyYXRlVGVtcGxhdGVzKCk7XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXModGhpcy50ZW1wbGF0ZXMpO1xuICAgIH1cbn0iLCJleHBvcnQgZnVuY3Rpb24gZ2V0X2RhdGVfc3RyaW5nKGRhdGVfZm9ybWF0OiBzdHJpbmcsIGRheXM/OiBudW1iZXIsIG1vbWVudF9zdHI/OiBzdHJpbmcgfCBudW1iZXIsIG1vbWVudF9mb3JtYXQ/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gd2luZG93Lm1vbWVudChtb21lbnRfc3RyLCBtb21lbnRfZm9ybWF0KS5hZGQoZGF5cywgJ2RheXMnKS5mb3JtYXQoZGF0ZV9mb3JtYXQpO1xufVxuXG5leHBvcnQgY29uc3QgVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFID0gXCJFcnJvcl9Nb2JpbGVVbnN1cHBvcnRlZFRlbXBsYXRlXCI7IiwiaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi4vSW50ZXJuYWxNb2R1bGVcIjtcbmltcG9ydCB7IGdldF9kYXRlX3N0cmluZyB9IGZyb20gXCIuLi9JbnRlcm5hbFV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZURhdGUgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgbmFtZSA9IFwiZGF0ZVwiO1xuXG4gICAgYXN5bmMgZ2VuZXJhdGVUZW1wbGF0ZXMoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLnNldChcIm5vd1wiLCB0aGlzLmdlbmVyYXRlX25vdygpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwidG9tb3Jyb3dcIiwgdGhpcy5nZW5lcmF0ZV90b21vcnJvdygpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwieWVzdGVyZGF5XCIsIHRoaXMuZ2VuZXJhdGVfeWVzdGVyZGF5KCkpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX25vdygpIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERFwiLCBvZmZzZXQ/OiBudW1iZXIsIHJlZmVyZW5jZT86IHN0cmluZywgcmVmZXJlbmNlX2Zvcm1hdD86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSAmJiAhd2luZG93Lm1vbWVudChyZWZlcmVuY2UsIHJlZmVyZW5jZV9mb3JtYXQpLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGl0bGUgZGF0ZSBmb3JtYXQsIHRyeSBzcGVjaWZ5aW5nIG9uZSB3aXRoIHRoZSBhcmd1bWVudCAncmVmZXJlbmNlJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnZXRfZGF0ZV9zdHJpbmcoZm9ybWF0LCBvZmZzZXQsIHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV90b21vcnJvdygpIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERFwiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0X2RhdGVfc3RyaW5nKGZvcm1hdCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV95ZXN0ZXJkYXkoKSB7XG4gICAgICAgIHJldHVybiAoZm9ybWF0OiBzdHJpbmcgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGdldF9kYXRlX3N0cmluZyhmb3JtYXQsIC0xKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuaW1wb3J0IHsgZ2V0X2RhdGVfc3RyaW5nLCBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgfSBmcm9tIFwiLi4vSW50ZXJuYWxVdGlsc1wiO1xuXG5pbXBvcnQgeyBGaWxlU3lzdGVtQWRhcHRlciwgZ2V0QWxsVGFncywgTWFya2Rvd25WaWV3LCBub3JtYWxpemVQYXRoLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgQ29udGV4dE1vZGUgfSBmcm9tIFwiVGVtcGxhdGVQYXJzZXJcIjtcblxuZXhwb3J0IGNvbnN0IFRQX0ZJTEVfQ1VSU09SID0gXCI8JSB0cC5maWxlLmN1cnNvciAlPlwiO1xuXG5leHBvcnQgY29uc3QgREVQVEhfTElNSVQgPSAxMDtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlRmlsZSBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBuYW1lID0gXCJmaWxlXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZGVwdGg6IG51bWJlciA9IDA7XG5cbiAgICBhc3luYyBnZW5lcmF0ZVRlbXBsYXRlcygpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwiY2xpcGJvYXJkXCIsIHRoaXMuZ2VuZXJhdGVfY2xpcGJvYXJkKCkpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5zZXQoXCJjb250ZW50XCIsIGF3YWl0IHRoaXMuZ2VuZXJhdGVfY29udGVudCgpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwiY3JlYXRpb25fZGF0ZVwiLCB0aGlzLmdlbmVyYXRlX2NyZWF0aW9uX2RhdGUoKSk7XG4gICAgICAgIC8vIEhhY2sgdG8gcHJldmVudCBlbXB0eSBvdXRwdXRcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwiY3Vyc29yXCIsIFRQX0ZJTEVfQ1VSU09SKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwiZm9sZGVyXCIsIHRoaXMuZ2VuZXJhdGVfZm9sZGVyKCkpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5zZXQoXCJpbmNsdWRlXCIsIHRoaXMuZ2VuZXJhdGVfaW5jbHVkZSgpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwibGFzdF9tb2RpZmllZF9kYXRlXCIsIHRoaXMuZ2VuZXJhdGVfbGFzdF9tb2RpZmllZF9kYXRlKCkpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5zZXQoXCJwYXRoXCIsIHRoaXMuZ2VuZXJhdGVfcGF0aCgpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwicmVuYW1lXCIsIHRoaXMuZ2VuZXJhdGVfcmVuYW1lKCkpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5zZXQoXCJzZWxlY3Rpb25cIiwgdGhpcy5nZW5lcmF0ZV9zZWxlY3Rpb24oKSk7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLnNldChcInRhZ3NcIiwgdGhpcy5nZW5lcmF0ZV90YWdzKCkpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5zZXQoXCJ0aXRsZVwiLCB0aGlzLmdlbmVyYXRlX3RpdGxlKCkpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NsaXBib2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE86IEFkZCBtb2JpbGUgc3VwcG9ydFxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9jb250ZW50KCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0aGlzLmZpbGUpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NyZWF0aW9uX2RhdGUoKSB7XG4gICAgICAgIHJldHVybiAoZm9ybWF0OiBzdHJpbmcgPSBcIllZWVktTU0tREQgSEg6bW1cIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGdldF9kYXRlX3N0cmluZyhmb3JtYXQsIHVuZGVmaW5lZCwgdGhpcy5maWxlLnN0YXQuY3RpbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZm9sZGVyKCkge1xuICAgICAgICByZXR1cm4gKHJlbGF0aXZlOiBib29sZWFuID0gZmFsc2UpID0+IHtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLmZpbGUucGFyZW50O1xuICAgICAgICAgICAgbGV0IGZvbGRlcjtcblxuICAgICAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICAgICAgZm9sZGVyID0gcGFyZW50LnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb2xkZXIgPSBwYXJlbnQubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZvbGRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2luY2x1ZGUoKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAoaW5jbHVkZV9maWxlbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgaW5jX2ZpbGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KG5vcm1hbGl6ZVBhdGgoaW5jbHVkZV9maWxlbmFtZSksIFwiXCIpO1xuICAgICAgICAgICAgaWYgKCFpbmNfZmlsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmlsZSAke3RoaXMuZmlsZX0gaW5jbHVkZSBkb2Vzbid0IGV4aXN0YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShpbmNfZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmZpbGV9IGlzIGEgZm9sZGVyLCBub3QgYSBmaWxlYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE86IEFkZCBtdXRleCBmb3IgdGhpcywgdGhpcyBtYXkgY3VycmVudGx5IGxlYWQgdG8gYSByYWNlIGNvbmRpdGlvbi4gXG4gICAgICAgICAgICAvLyBXaGlsZSBub3QgdmVyeSBpbXBhY3RmdWwsIHRoYXQgY291bGQgc3RpbGwgYmUgYW5ub3lpbmcuXG4gICAgICAgICAgICBJbnRlcm5hbE1vZHVsZUZpbGUuZGVwdGggKz0gMTtcbiAgICAgICAgICAgIGlmIChJbnRlcm5hbE1vZHVsZUZpbGUuZGVwdGggPiBERVBUSF9MSU1JVCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlJlYWNoZWQgaW5jbHVzaW9uIGRlcHRoIGxpbWl0IChtYXggPSAxMClcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpbmNfZmlsZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChpbmNfZmlsZSk7XG4gICAgICAgICAgICBsZXQgcGFyc2VkX2NvbnRlbnQgPSBhd2FpdCB0aGlzLnBsdWdpbi5wYXJzZXIucGFyc2VUZW1wbGF0ZXMoaW5jX2ZpbGVfY29udGVudCwgdGhpcy5maWxlLCBDb250ZXh0TW9kZS5VU0VSX0lOVEVSTkFMKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgSW50ZXJuYWxNb2R1bGVGaWxlLmRlcHRoIC09IDE7XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlZF9jb250ZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfbGFzdF9tb2RpZmllZF9kYXRlKCkge1xuICAgICAgICByZXR1cm4gKGZvcm1hdDogc3RyaW5nID0gXCJZWVlZLU1NLUREIEhIOm1tXCIpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRfZGF0ZV9zdHJpbmcoZm9ybWF0LCB1bmRlZmluZWQsIHRoaXMuZmlsZS5zdGF0Lm10aW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3BhdGgoKSB7XG4gICAgICAgIHJldHVybiAocmVsYXRpdmU6IGJvb2xlYW4gPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEodGhpcy5hcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2YXVsdF9wYXRoID0gdGhpcy5hcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuXG4gICAgICAgICAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlLnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dmF1bHRfcGF0aH0vJHt0aGlzLmZpbGUucGF0aH1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcmVuYW1lKCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKG5ld190aXRsZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3X3BhdGggPSBub3JtYWxpemVQYXRoKGAke3RoaXMuZmlsZS5wYXJlbnQucGF0aH0vJHtuZXdfdGl0bGV9LiR7dGhpcy5maWxlLmV4dGVuc2lvbn1gKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnJlbmFtZUZpbGUodGhpcy5maWxlLCBuZXdfcGF0aCk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3NlbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjdGl2ZSB2aWV3IGlzIG51bGxcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgICAgICByZXR1cm4gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfdGFncygpIHtcbiAgICAgICAgbGV0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUodGhpcy5maWxlKTtcbiAgICAgICAgcmV0dXJuIGdldEFsbFRhZ3MoY2FjaGUpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3RpdGxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlLmJhc2VuYW1lO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVXZWIgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgbmFtZSA9IFwid2ViXCI7XG5cbiAgICBhc3luYyBnZW5lcmF0ZVRlbXBsYXRlcygpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwiZGFpbHlfcXVvdGVcIiwgdGhpcy5nZW5lcmF0ZV9kYWlseV9xdW90ZSgpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwicmFuZG9tX3BpY3R1cmVcIiwgdGhpcy5nZW5lcmF0ZV9yYW5kb21fcGljdHVyZSgpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuc2V0KFwiZ2V0X3JlcXVlc3RcIiwgdGhpcy5nZW5lcmF0ZV9nZXRfcmVxdWVzdCgpKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRSZXF1ZXN0KHVybDogc3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBwZXJmb3JtaW5nIEdFVCByZXF1ZXN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9kYWlseV9xdW90ZSgpIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdChcImh0dHBzOi8vcXVvdGVzLnJlc3QvcW9kXCIpO1xuICAgICAgICAgICAgbGV0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICAgICAgICAgIGxldCBhdXRob3IgPSBqc29uLmNvbnRlbnRzLnF1b3Rlc1swXS5hdXRob3I7XG4gICAgICAgICAgICBsZXQgcXVvdGUgPSBqc29uLmNvbnRlbnRzLnF1b3Rlc1swXS5xdW90ZTtcbiAgICAgICAgICAgIGxldCBuZXdfY29udGVudCA9IGA+ICR7cXVvdGV9XFxuPiAmbWRhc2g7IDxjaXRlPiR7YXV0aG9yfTwvY2l0ZT5gO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3X2NvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9yYW5kb21fcGljdHVyZSgpIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIChzaXplOiBzdHJpbmcgPSBcIjE2MDB4OTAwXCIsIHF1ZXJ5Pzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldFJlcXVlc3QoYGh0dHBzOi8vc291cmNlLnVuc3BsYXNoLmNvbS9yYW5kb20vJHtzaXplfT8ke3F1ZXJ5fWApO1xuICAgICAgICAgICAgbGV0IHVybCA9IHJlc3BvbnNlLnVybDtcbiAgICAgICAgICAgIHJldHVybiBgIVt0cC53ZWIucmFuZG9tX3BpY3R1cmVdKCR7dXJsfSlgOyAgIFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZ2V0X3JlcXVlc3QoKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdCh1cmwpO1xuICAgICAgICAgICAgbGV0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlciBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBuYW1lID0gXCJmcm9udG1hdHRlclwiO1xuXG4gICAgYXN5bmMgZ2VuZXJhdGVUZW1wbGF0ZXMoKSB7XG4gICAgICAgIGxldCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKHRoaXMuZmlsZSlcbiAgICAgICAgaWYgKGNhY2hlLmZyb250bWF0dGVyKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoY2FjaGUuZnJvbnRtYXR0ZXIpKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBBcHAsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IEludGVybmFsTW9kdWxlRGF0ZSB9IGZyb20gXCIuL2RhdGUvSW50ZXJuYWxNb2R1bGVEYXRlXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZUZpbGUgfSBmcm9tIFwiLi9maWxlL0ludGVybmFsTW9kdWxlRmlsZVwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVXZWIgfSBmcm9tIFwiLi93ZWIvSW50ZXJuYWxNb2R1bGVXZWJcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlRnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi9mcm9udG1hdHRlci9JbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBUUGFyc2VyIH0gZnJvbSBcIlRQYXJzZXJcIjtcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsVGVtcGxhdGVQYXJzZXIgZXh0ZW5kcyBUUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlTW9kdWxlcyhmOiBURmlsZSkge1xuICAgICAgICBsZXQgbW9kdWxlc19tYXA6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKCk7XG4gICAgICAgIGxldCBtb2R1bGVzX2FycmF5OiBBcnJheTxJbnRlcm5hbE1vZHVsZT4gPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgbW9kdWxlc19hcnJheS5wdXNoKG5ldyBJbnRlcm5hbE1vZHVsZURhdGUodGhpcy5hcHAsIHRoaXMucGx1Z2luLCBmKSk7XG4gICAgICAgIG1vZHVsZXNfYXJyYXkucHVzaChuZXcgSW50ZXJuYWxNb2R1bGVGaWxlKHRoaXMuYXBwLCB0aGlzLnBsdWdpbiwgZikpO1xuICAgICAgICBtb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlV2ViKHRoaXMuYXBwLCB0aGlzLnBsdWdpbiwgZikpO1xuICAgICAgICBtb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRnJvbnRtYXR0ZXIodGhpcy5hcHAsIHRoaXMucGx1Z2luLCBmKSk7XG5cbiAgICAgICAgZm9yIChsZXQgbW9kIG9mIG1vZHVsZXNfYXJyYXkpIHtcbiAgICAgICAgICAgIG1vZHVsZXNfbWFwLnNldChtb2QubmFtZSwgYXdhaXQgbW9kLmdlbmVyYXRlQ29udGV4dCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2R1bGVzX21hcDtcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZUNvbnRleHQoZjogVEZpbGUpIHtcbiAgICAgICBsZXQgbW9kdWxlcyA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVNb2R1bGVzKGYpO1xuXG4gICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKG1vZHVsZXMpLFxuICAgICAgIH07XG4gICAgfVxufSIsImltcG9ydCB7IEFwcCwgRmlsZVN5c3RlbUFkYXB0ZXIsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGV4ZWMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIjtcblxuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgQ29udGV4dE1vZGUgfSBmcm9tIFwiVGVtcGxhdGVQYXJzZXJcIjtcbmltcG9ydCB7IFRQYXJzZXIgfSBmcm9tIFwiVFBhcnNlclwiO1xuXG5leHBvcnQgY2xhc3MgVXNlclRlbXBsYXRlUGFyc2VyIGV4dGVuZHMgVFBhcnNlciB7XG4gICAgY3dkOiBzdHJpbmc7XG4gICAgY21kX29wdGlvbnM6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMucmVzb2x2ZUN3ZCgpOyAgICAgICAgXG4gICAgfVxuXG4gICAgcmVzb2x2ZUN3ZCgpIHtcbiAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgIGlmICh0aGlzLmFwcC5pc01vYmlsZSB8fCAhKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgaW5zdGFuY2VvZiBGaWxlU3lzdGVtQWRhcHRlcikpIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gdGhpcy5hcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVVc2VyVGVtcGxhdGVzKGZpbGU6IFRGaWxlKSB7XG4gICAgICAgIGxldCB1c2VyX3RlbXBsYXRlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgZXhlY19wcm9taXNlID0gcHJvbWlzaWZ5KGV4ZWMpO1xuXG4gICAgICAgIGZvciAobGV0IFt0ZW1wbGF0ZSwgY21kXSBvZiB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMpIHtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSA9PT0gXCJcIiB8fCBjbWQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY21kID0gYXdhaXQgdGhpcy5wbHVnaW4ucGFyc2VyLnBhcnNlVGVtcGxhdGVzKGNtZCwgZmlsZSwgQ29udGV4dE1vZGUuSU5URVJOQUwpO1xuXG4gICAgICAgICAgICB1c2VyX3RlbXBsYXRlcy5zZXQodGVtcGxhdGUsIGFzeW5jICh1c2VyX2FyZ3M/OiBhbnkpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9jZXNzX2VudiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4udXNlcl9hcmdzLFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBjbWRfb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dCAqIDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjd2Q6IHRoaXMuY3dkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW52OiBwcm9jZXNzX2VudixcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQge3N0ZG91dH0gPSBhd2FpdCBleGVjX3Byb21pc2UoY21kLCBjbWRfb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGRvdXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmxvZ19lcnJvcihgRXJyb3Igd2l0aCBVc2VyIFRlbXBsYXRlICR7dGVtcGxhdGV9YCwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVzZXJfdGVtcGxhdGVzO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlQ29udGV4dChmaWxlOiBURmlsZSkge1xuICAgICAgICBsZXQgdXNlcl90ZW1wbGF0ZXMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlVXNlclRlbXBsYXRlcyhmaWxlKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyh1c2VyX3RlbXBsYXRlcyk7XG4gICAgfVxufSIsImltcG9ydCB7IEFwcCwgRWRpdG9yUG9zaXRpb24sIE1hcmtkb3duVmlldywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCAqIGFzIEV0YSBmcm9tIFwiZXRhXCI7XG5cbmltcG9ydCB7IEludGVybmFsVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi9JbnRlcm5hbFRlbXBsYXRlcy9JbnRlcm5hbFRlbXBsYXRlUGFyc2VyXCI7XG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IFVzZXJUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL1VzZXJUZW1wbGF0ZXMvVXNlclRlbXBsYXRlUGFyc2VyXCI7XG5pbXBvcnQgeyBUUGFyc2VyIH0gZnJvbSBcIlRQYXJzZXJcIjtcbmltcG9ydCB7IFRQX0ZJTEVfQ1VSU09SIH0gZnJvbSBcIkludGVybmFsVGVtcGxhdGVzL2ZpbGUvSW50ZXJuYWxNb2R1bGVGaWxlXCI7XG5cbmV4cG9ydCBlbnVtIENvbnRleHRNb2RlIHtcbiAgICBVU0VSLFxuICAgIElOVEVSTkFMLFxuICAgIFVTRVJfSU5URVJOQUwsXG4gICAgRFlOQU1JQyxcbn07XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciBleHRlbmRzIFRQYXJzZXIge1xuICAgIHB1YmxpYyBpbnRlcm5hbFRlbXBsYXRlUGFyc2VyOiBJbnRlcm5hbFRlbXBsYXRlUGFyc2VyO1xuXHRwdWJsaWMgdXNlclRlbXBsYXRlUGFyc2VyOiBVc2VyVGVtcGxhdGVQYXJzZXIgPSBudWxsO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxUZW1wbGF0ZVBhcnNlciA9IG5ldyBJbnRlcm5hbFRlbXBsYXRlUGFyc2VyKHRoaXMuYXBwLCB0aGlzLnBsdWdpbik7XG4gICAgICAgIC8vIFRPRE86IEFkZCBtb2JpbGUgc3VwcG9ydFxuICAgICAgICBpZiAoIXRoaXMuYXBwLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJUZW1wbGF0ZVBhcnNlciA9IG5ldyBVc2VyVGVtcGxhdGVQYXJzZXIodGhpcy5hcHAsIHRoaXMucGx1Z2luKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlQ29udGV4dChmaWxlOiBURmlsZSwgY29udGV4dF9tb2RlOiBDb250ZXh0TW9kZSA9IENvbnRleHRNb2RlLlVTRVJfSU5URVJOQUwpIHtcbiAgICAgICAgbGV0IGNvbnRleHQgPSB7fTtcbiAgICAgICAgbGV0IGludGVybmFsX2NvbnRleHQgPSBhd2FpdCB0aGlzLmludGVybmFsVGVtcGxhdGVQYXJzZXIuZ2VuZXJhdGVDb250ZXh0KGZpbGUpO1xuICAgICAgICBsZXQgdXNlcl9jb250ZXh0ID0ge31cblxuICAgICAgICBzd2l0Y2ggKGNvbnRleHRfbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBDb250ZXh0TW9kZS5VU0VSOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJUZW1wbGF0ZVBhcnNlcikge1xuICAgICAgICAgICAgICAgICAgICB1c2VyX2NvbnRleHQgPSBhd2FpdCB0aGlzLnVzZXJUZW1wbGF0ZVBhcnNlci5nZW5lcmF0ZUNvbnRleHQoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnVzZXJfY29udGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ29udGV4dE1vZGUuSU5URVJOQUw6XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGludGVybmFsX2NvbnRleHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENvbnRleHRNb2RlLkRZTkFNSUM6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlclRlbXBsYXRlUGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJfY29udGV4dCA9IGF3YWl0IHRoaXMudXNlclRlbXBsYXRlUGFyc2VyLmdlbmVyYXRlQ29udGV4dChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uaW50ZXJuYWxfY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi51c2VyX2NvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENvbnRleHRNb2RlLlVTRVJfSU5URVJOQUw6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlclRlbXBsYXRlUGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJfY29udGV4dCA9IGF3YWl0IHRoaXMudXNlclRlbXBsYXRlUGFyc2VyLmdlbmVyYXRlQ29udGV4dChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uaW50ZXJuYWxfY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4udXNlcl9jb250ZXh0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmNvbnRleHRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBwYXJzZVRlbXBsYXRlcyhjb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlLCBjb250ZXh0X21vZGU6IENvbnRleHRNb2RlKSB7XG4gICAgICAgIGxldCBjb250ZXh0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUNvbnRleHQoZmlsZSwgY29udGV4dF9tb2RlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29udGVudCA9IGF3YWl0IEV0YS5yZW5kZXJBc3luYyhjb250ZW50LCBjb250ZXh0LCB7XG4gICAgICAgICAgICAgICAgdmFyTmFtZTogXCJ0cFwiLFxuICAgICAgICAgICAgICAgIHBhcnNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGV4ZWM6IFwiKlwiLFxuICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0ZTogXCJ+XCIsXG4gICAgICAgICAgICAgICAgICAgIHJhdzogXCJcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGF1dG9UcmltOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBnbG9iYWxBd2FpdDogdHJ1ZSxcbiAgICAgICAgICAgIH0pIGFzIHN0cmluZztcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ubG9nX2Vycm9yKFwiVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuXCIsIGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIHJlcGxhY2VfaW5fYWN0aXZlX2ZpbGUoKTogdm9pZCB7XG5cdFx0dHJ5IHtcblx0XHRcdGxldCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cdFx0XHRpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQWN0aXZlIHZpZXcgaXMgbnVsbFwiKTtcblx0XHRcdH1cblx0XHRcdHRoaXMucmVwbGFjZV90ZW1wbGF0ZXNfYW5kX292ZXJ3cml0ZV9pbl9maWxlKGFjdGl2ZV92aWV3LmZpbGUpO1xuXHRcdH1cblx0XHRjYXRjaChlcnJvcikge1xuXHRcdFx0dGhpcy5wbHVnaW4ubG9nX2Vycm9yKGVycm9yKTtcblx0XHR9XG5cdH1cblxuICAgIGFzeW5jIGNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKHRlbXBsYXRlX2ZpbGU6IFRGaWxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgdGVtcGxhdGVfY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGVtcGxhdGVfZmlsZSk7XG4gICAgICAgICAgICBsZXQgY3JlYXRlZF9ub3RlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKFwiVW50aXRsZWQubWRcIiwgXCJcIik7XG4gICAgICAgICAgICBsZXQgY29udGVudCA9IGF3YWl0IHRoaXMucGx1Z2luLnBhcnNlci5wYXJzZVRlbXBsYXRlcyh0ZW1wbGF0ZV9jb250ZW50LCBjcmVhdGVkX25vdGUsIENvbnRleHRNb2RlLlVTRVJfSU5URVJOQUwpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGNyZWF0ZWRfbm90ZSwgY29udGVudCk7XG5cbiAgICAgICAgICAgIGxldCBhY3RpdmVfbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xuICAgICAgICAgICAgaWYgKCFhY3RpdmVfbGVhZikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFjdGl2ZSBsZWFmXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgYWN0aXZlX2xlYWYub3BlbkZpbGUoY3JlYXRlZF9ub3RlLCB7c3RhdGU6IHttb2RlOiAnc291cmNlJ30sIGVTdGF0ZToge3JlbmFtZTogJ2FsbCd9fSk7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpO1xuICAgICAgICB9XG5cdFx0Y2F0Y2goZXJyb3IpIHtcblx0XHRcdHRoaXMucGx1Z2luLmxvZ19lcnJvcihlcnJvcik7XG5cdFx0fVxuICAgIH1cblxuICAgIGFzeW5jIHJlcGxhY2VfdGVtcGxhdGVzX2FuZF9hcHBlbmQodGVtcGxhdGVfZmlsZTogVEZpbGUpIHtcbiAgICAgICAgbGV0IGFjdGl2ZV92aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKGFjdGl2ZV92aWV3ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY3RpdmUgdmlldywgY2FuJ3QgYXBwZW5kIHRlbXBsYXRlcy5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWRpdG9yID0gYWN0aXZlX3ZpZXcuZWRpdG9yO1xuICAgICAgICBsZXQgZG9jID0gZWRpdG9yLmdldERvYygpO1xuXG4gICAgICAgIGxldCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0ZW1wbGF0ZV9maWxlKTtcbiAgICAgICAgY29udGVudCA9IGF3YWl0IHRoaXMucGFyc2VUZW1wbGF0ZXMoY29udGVudCwgYWN0aXZlX3ZpZXcuZmlsZSwgQ29udGV4dE1vZGUuVVNFUl9JTlRFUk5BTCk7XG4gICAgICAgIFxuICAgICAgICBkb2MucmVwbGFjZVNlbGVjdGlvbihjb250ZW50KTtcblxuICAgICAgICBhd2FpdCB0aGlzLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICAgICAgZWRpdG9yLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVwbGFjZV90ZW1wbGF0ZXNfYW5kX292ZXJ3cml0ZV9pbl9maWxlKGZpbGU6IFRGaWxlKSB7XG4gICAgICAgIGxldCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgbGV0IG5ld19jb250ZW50ID0gYXdhaXQgdGhpcy5wYXJzZVRlbXBsYXRlcyhjb250ZW50LCBmaWxlLCBDb250ZXh0TW9kZS5VU0VSX0lOVEVSTkFMKTtcblxuICAgICAgICBpZiAobmV3X2NvbnRlbnQgIT09IGNvbnRlbnQpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCBuZXdfY29udGVudCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpID09PSBmaWxlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBqdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCkge1xuICAgICAgICBsZXQgYWN0aXZlX3ZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFjdGl2ZSB2aWV3LCBjYW4ndCBhcHBlbmQgdGVtcGxhdGVzLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYWN0aXZlX2ZpbGUgPSBhY3RpdmVfdmlldy5maWxlO1xuICAgICAgICBhd2FpdCBhY3RpdmVfdmlldy5zYXZlKCk7XG5cbiAgICAgICAgbGV0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGFjdGl2ZV9maWxlKTtcblxuICAgICAgICBsZXQgcG9zID0gdGhpcy5nZXRfY3Vyc29yX3Bvc2l0aW9uKGNvbnRlbnQpO1xuICAgICAgICBpZiAocG9zKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKG5ldyBSZWdFeHAoVFBfRklMRV9DVVJTT1IpLCBcIlwiKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShhY3RpdmVfZmlsZSwgY29udGVudCk7XG4gICAgICAgICAgICB0aGlzLnNldF9jdXJzb3JfbG9jYXRpb24ocG9zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldF9jdXJzb3JfcG9zaXRpb24oY29udGVudDogc3RyaW5nKTogRWRpdG9yUG9zaXRpb24ge1xuICAgICAgICBsZXQgcG9zOiBFZGl0b3JQb3NpdGlvbiA9IG51bGw7XG4gICAgICAgIGxldCBpbmRleCA9IGNvbnRlbnQuaW5kZXhPZihUUF9GSUxFX0NVUlNPUik7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgbGV0IHN1YnN0ciA9IGNvbnRlbnQuc3Vic3RyKDAsIGluZGV4KTtcblxuICAgICAgICAgICAgbGV0IGwgPSAwO1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IC0xO1xuICAgICAgICAgICAgbGV0IHIgPSAtMTtcbiAgICAgICAgICAgIGZvciAoOyAociA9IHN1YnN0ci5pbmRleE9mKFwiXFxuXCIsIHIrMSkpICE9PSAtMSA7IGwrKywgb2Zmc2V0PXIpO1xuICAgICAgICAgICAgb2Zmc2V0ICs9IDE7XG5cbiAgICAgICAgICAgIGxldCBjaCA9IGNvbnRlbnQuc3Vic3RyKG9mZnNldCwgaW5kZXgtb2Zmc2V0KS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHBvcyA9IHtsaW5lOiBsLCBjaDogY2h9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuXG4gICAgc2V0X2N1cnNvcl9sb2NhdGlvbihwb3M6IEVkaXRvclBvc2l0aW9uKSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0aXZlX3ZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZWRpdG9yID0gYWN0aXZlX3ZpZXcuZWRpdG9yO1xuXG4gICAgICAgIGVkaXRvci5mb2N1cygpO1xuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHBvcyk7XG4gICAgfVxufSIsImltcG9ydCB7IE1hcmtkb3duVmlldywgTm90aWNlLCBQbHVnaW4sIFRBYnN0cmFjdEZpbGUsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuaW1wb3J0IHsgREVGQVVMVF9TRVRUSU5HUywgVGVtcGxhdGVyU2V0dGluZ3MsIFRlbXBsYXRlclNldHRpbmdUYWIgfSBmcm9tICdTZXR0aW5ncyc7XHJcbmltcG9ydCB7IFRlbXBsYXRlckZ1enp5U3VnZ2VzdE1vZGFsIH0gZnJvbSAnVGVtcGxhdGVyRnV6enlTdWdnZXN0JztcclxuaW1wb3J0IHsgQ29udGV4dE1vZGUsIFRlbXBsYXRlUGFyc2VyIH0gZnJvbSAnVGVtcGxhdGVQYXJzZXInO1xyXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gJ1RQYXJzZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuXHRwdWJsaWMgZnV6enlTdWdnZXN0OiBUZW1wbGF0ZXJGdXp6eVN1Z2dlc3RNb2RhbDtcclxuXHRwdWJsaWMgc2V0dGluZ3M6IFRlbXBsYXRlclNldHRpbmdzOyBcclxuXHRwdWJsaWMgcGFyc2VyOiBUZW1wbGF0ZVBhcnNlclxyXG5cclxuXHRhc3luYyBvbmxvYWQoKSB7XHJcblx0XHRhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG5cclxuXHRcdC8vIFRPRE86IFJlbW92ZSB0aGlzXHJcblx0XHRpZiAoIXRoaXMuc2V0dGluZ3MudG9nZ2xlX25vdGljZSkge1xyXG5cdFx0XHRsZXQgbm90aWNlID0gbmV3IE5vdGljZShcIlwiLCAxNTAwMCk7XHJcblx0XHRcdG5vdGljZS5ub3RpY2VFbC5pbm5lckhUTUwgPSBgV2hhdD8gVGVtcGxhdGVyIGlzIDxiPmV2b2x2aW5nPC9iPiE8YnIvPlxyXG5cdFRoZSB0ZW1wbGF0ZSBzeW50YXggY2hhbmdlZCBpbiB0aGlzIHJlbGVhc2UsIGNoZWNrIG91dCB0aGUgbmV3IGRvY3VtZW50YXRpb24gZm9yIGl0IG9uIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vU2lsZW50Vm9pZDEzL1RlbXBsYXRlciN0ZW1wbGF0ZXItb2JzaWRpYW4tcGx1Z2luXCI+VGVtcGxhdGVyJ3MgR2l0aHViPC9hPiBvciBpbiB0aGUgY29tbXVuaXR5IHBsdWdpbnMgcGFnZS48YnIvPlxyXG5cdEVuam95IG5ldyBmZWF0dXJlcyBmb3IgVGVtcGxhdGVyOiBuZXcgaW50ZXJuYWwgdGVtcGxhdGVzLCB1c2VyIHRlbXBsYXRlcyBhcmd1bWVudHMsIGNvbmRpdGlvbmFsIHN0YXRlbWVudHMgYW5kIG1vcmUuPGJyLz5cclxuXHRFdmVyeSBhbHJlYWR5IGV4aXN0aW5nIGZlYXR1cmUgc3RpbGwgZXhpc3RzIG9mIGNvdXJzZSwgeW91IGp1c3QgbmVlZCB0byB1cGRhdGUgdGhlIHN5bnRheCBpbiB5b3VyIHRlbXBsYXRlcyBmaWxlcy48YnIvPlxyXG5cdFRoYW5rcyBmb3IgdXNpbmcgVGVtcGxhdGVyISBTaWxlbnRWb2lkLjxici8+XHJcblx0WW91IGNhbiBhbHNvIGZpbmQgdGhpcyBtZXNzYWdlIGluIHRoZSBzZXR0aW5ncyBvZiBUZW1wbGF0ZXIuIFRoaXMgbWVzc2FnZSB3aWxsIHNlbGYtZGVzdHJ1Y3QgaW4gdGhlIG5leHQgdXBkYXRlLiBZb3UgY2FuIGRpc2FibGUgdGhpcyBub3RpY2UgaW4gdGhlIHNldHRpbmdzLmA7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5mdXp6eVN1Z2dlc3QgPSBuZXcgVGVtcGxhdGVyRnV6enlTdWdnZXN0TW9kYWwodGhpcy5hcHAsIHRoaXMpO1xyXG5cdFx0dGhpcy5wYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIodGhpcy5hcHAsIHRoaXMpO1xyXG5cclxuXHRcdHRoaXMucmVnaXN0ZXJNYXJrZG93blBvc3RQcm9jZXNzb3IoKGVsLCBjdHgpID0+IHRoaXMuZHluYW1pY190ZW1wbGF0ZXNfcHJvY2Vzc29yKGVsLCBjdHgpKTtcclxuXHJcblx0XHR0aGlzLmFkZFJpYmJvbkljb24oJ3RocmVlLWhvcml6b250YWwtYmFycycsICdUZW1wbGF0ZXInLCBhc3luYyAoKSA9PiB7XHJcblx0XHRcdHRoaXMuZnV6enlTdWdnZXN0Lmluc2VydF90ZW1wbGF0ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6IFwiaW5zZXJ0LXRlbXBsYXRlclwiLFxyXG5cdFx0XHRuYW1lOiBcIkluc2VydCBUZW1wbGF0ZVwiLFxyXG5cdFx0XHRob3RrZXlzOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bW9kaWZpZXJzOiBbXCJBbHRcIl0sXHJcblx0XHRcdFx0XHRrZXk6ICdlJyxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdLFxyXG5cdFx0XHRjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZnV6enlTdWdnZXN0Lmluc2VydF90ZW1wbGF0ZSgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6IFwicmVwbGFjZS1pbi1maWxlLXRlbXBsYXRlclwiLFxyXG4gICAgICAgICAgICBuYW1lOiBcIlJlcGxhY2UgdGVtcGxhdGVzIGluIHRoZSBhY3RpdmUgZmlsZVwiLFxyXG4gICAgICAgICAgICBob3RrZXlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMucGFyc2VyLnJlcGxhY2VfaW5fYWN0aXZlX2ZpbGUoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogXCJqdW1wLXRvLW5leHQtY3Vyc29yLWxvY2F0aW9uXCIsXHJcblx0XHRcdG5hbWU6IFwiSnVtcCB0byBuZXh0IGN1cnNvciBsb2NhdGlvblwiLFxyXG5cdFx0XHRob3RrZXlzOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bW9kaWZpZXJzOiBbXCJBbHRcIl0sXHJcblx0XHRcdFx0XHRrZXk6IFwiVGFiXCIsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XSxcclxuXHRcdFx0Y2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5wYXJzZXIuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaChlcnJvcikge1xyXG5cdFx0XHRcdFx0dGhpcy5sb2dfZXJyb3IoZXJyb3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6IFwiY3JlYXRlLW5ldy1ub3RlLWZyb20tdGVtcGxhdGVcIixcclxuXHRcdFx0bmFtZTogXCJDcmVhdGUgbmV3IG5vdGUgZnJvbSB0ZW1wbGF0ZVwiLFxyXG5cdFx0XHRob3RrZXlzOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bW9kaWZpZXJzOiBbXCJBbHRcIl0sXHJcblx0XHRcdFx0XHRrZXk6IFwiblwiLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdF0sXHJcblx0XHRcdGNhbGxiYWNrOiAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5mdXp6eVN1Z2dlc3QuY3JlYXRlX25ld19ub3RlX2Zyb21fdGVtcGxhdGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LXJlYWR5XCIsICgpID0+IHtcclxuXHRcdFx0Ly8gVE9ETzogRmluZCBhIHdheSB0byBub3QgdHJpZ2dlciB0aGlzIG9uIGZpbGVzIGNvcHlcclxuXHRcdFx0dGhpcy5hcHAudmF1bHQub24oXCJjcmVhdGVcIiwgYXN5bmMgKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcclxuXHRcdFx0XHQvLyBUT0RPOiBmaW5kIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzXHJcblx0XHRcdFx0Ly8gQ3VycmVudGx5LCBJIGhhdmUgdG8gd2FpdCBmb3IgdGhlIGRhaWx5IG5vdGUgcGx1Z2luIHRvIGFkZCB0aGUgZmlsZSBjb250ZW50IGJlZm9yZSByZXBsYWNpbmdcclxuXHRcdFx0XHQvLyBOb3QgYSBwcm9ibGVtIHdpdGggQ2FsZW5kYXIgaG93ZXZlciBzaW5jZSBpdCBjcmVhdGVzIHRoZSBmaWxlIHdpdGggdGhlIGV4aXN0aW5nIGNvbnRlbnRcclxuXHRcdFx0XHRhd2FpdCBkZWxheSgzMDApO1xyXG5cdFx0XHRcdC8vICEgVGhpcyBjb3VsZCBjb3JydXB0IGJpbmFyeSBmaWxlc1xyXG5cdFx0XHRcdGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgfHwgZmlsZS5leHRlbnNpb24gIT09IFwibWRcIikge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnBhcnNlci5yZXBsYWNlX3RlbXBsYXRlc19hbmRfb3ZlcndyaXRlX2luX2ZpbGUoZmlsZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBUZW1wbGF0ZXJTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBzYXZlU2V0dGluZ3MoKSB7XHJcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgbG9hZFNldHRpbmdzKCkge1xyXG5cdFx0dGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcblx0fVx0XHJcblxyXG5cdGxvZ19lcnJvcihtc2c6IHN0cmluZywgZXJyb3I/OiBzdHJpbmcpIHtcclxuXHRcdGlmIChlcnJvcikge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZywgZXJyb3IpO1xyXG5cdFx0XHRuZXcgTm90aWNlKGBUZW1wbGF0ZXIgRXJyb3I6ICR7bXNnfVxcbkNoZWNrIGNvbnNvbGUgZm9yIG1vcmUgaW5mb3JtYXRpb25zYCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bmV3IE5vdGljZShgVGVtcGxhdGVyIEVycm9yOiAke21zZ31gKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGR5bmFtaWNfdGVtcGxhdGVzX3Byb2Nlc3NvcihlbDogSFRNTEVsZW1lbnQsIGN0eDogYW55KSB7XHJcblx0XHRpZiAoZWwudGV4dENvbnRlbnQuY29udGFpbnMoXCJ0cC5keW5hbWljXCIpKSB7XHJcblx0XHRcdC8vIFRPRE86IFRoaXMgd2lsbCBub3QgYWx3YXlzIGJlIHRoZSBhY3RpdmUgZmlsZSwgXHJcblx0XHRcdC8vIEkgbmVlZCB0byB1c2UgZ2V0Rmlyc3RMaW5rcGF0aERlc3QgYW5kIGN0eCB0byBmaW5kIHRoZSBhY3R1YWwgZmlsZVxyXG5cdFx0XHRsZXQgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XHJcblxyXG5cdFx0XHRsZXQgbmV3X2h0bWwgPSBhd2FpdCB0aGlzLnBhcnNlci5wYXJzZVRlbXBsYXRlcyhcclxuXHRcdFx0XHRlbC5pbm5lckhUTUwsIFxyXG5cdFx0XHRcdGZpbGUsIFxyXG5cdFx0XHRcdENvbnRleHRNb2RlLkRZTkFNSUNcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdGVsLmlubmVySFRNTCA9IG5ld19odG1sO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiXSwibmFtZXMiOlsiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJGdXp6eVN1Z2dlc3RNb2RhbCIsIm5vcm1hbGl6ZVBhdGgiLCJURm9sZGVyIiwiVmF1bHQiLCJURmlsZSIsInRoaXMiLCJGaWxlU3lzdGVtQWRhcHRlciIsIk1hcmtkb3duVmlldyIsImdldEFsbFRhZ3MiLCJwcm9taXNpZnkiLCJleGVjIiwiRXRhLnJlbmRl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QUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsb0VBQW9FLENBQUMsQ0FBQyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUFFLENBQUMsQ0FBQyx3Q0FBd0MsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLHNDQUFxQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBSyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLCtCQUErQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLHlDQUF5QyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUMsOENBQThDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNB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
