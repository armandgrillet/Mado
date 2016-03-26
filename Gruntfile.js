module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        copy: {
            main: { // Copy everything in a min folder.
                expand: true,
                src: [
                    "manifest.json",
                    "_locales/**",
                    "css/**",
                    "fonts/**",
                    "img/**",
                    "js/background.js",
                    "js/lib/*"
                ],
                dest: "min/"
            }
        },

        concat: {
            mado: {
                src: ["js/onload.js", "js/Editor/*.js", "js/Topbar/*.js", "js/Window/*.js"],
                dest: "min/js/mado.js"
            },
            moreAbout: {
                src: [
                    ["js/more/CloseButtonManager.js", "js/more/Localizer.js", "js/more/about-onload.js"],
                ],
                dest: "min/js/more/about.js"
            },
            moreSettings: {
                src: [
                    ["js/more/CloseButtonManager.js", "js/more/Localizer.js", "js/more/SettingsManager.js", "js/more/settings-onload.js"],
                ],
                dest: "min/js/more/settings.js"
            },
            moreShortcuts: {
                src: [
                    ["js/more/CloseButtonManager.js", "js/more/Localizer.js", "js/more/ShortcutsManager.js", "js/more/shortcuts-onload.js"],
                ],
                dest: "min/js/more/shortcuts.js"
            }
        },

        jshint: {
            beforeconcat: ["js/onload.js", "js/Editor/*.js", "js/Topbar/*.js", "js/Window/*.js", "js/more/*.js"],
            afterconcat: ["min/js/mado.js", "min/js/more/*.js"]
        },

        uglify: {
            mado: {
                files: {
                    "min/js/mado.js": ["min/js/mado.js"],
                    "min/js/more/about.js": ["min/js/more/about.js"],
                    "min/js/more/settings.js": ["min/js/more/settings.js"],
                    "min/js/more/shortcuts.js": ["min/js/more/shortcuts.js"]
                }
            }
        },

        processhtml: {
            mado: {
                files: {
                    "min/mado.html": ["mado.html"],
                    "min/more/about.html": ["more/about.html"],
                    "min/more/settings.html": ["more/settings.html"],
                    "min/more/shortcuts.html": ["more/shortcuts.html"]
                }
            }
        },

        htmlclean: {
            deploy: {
                expand: true,
                cwd: "min/",
                src: "**/*.html",
                dest: "min/"
            }
        },

        usebanner: {
            html: {
                options: {
                    position: "top",
                    banner: "<!-- Copyright (c) 2016 Armand Grillet.\nSee the license in the \"About\" section for further information. -->",
                    linebreak: true
                },
                files: {
                    src: ["min/*.html", "min/more/*.html"]
                }
            },
            cssJsBanner: {
                options: {
                    position: "top",
                    banner: "/* Copyright (c) 2016 Armand Grillet.\nSee the license in the \"About\" section for further information. */",
                    linebreak: true
                },
                files: {
                    src: ["min/css/*.css", "min/css/more/*.css", "min/css/themes/*.css", "min/js/mado.js", "min/js/more/*.js", "!min/css/icons.css"]
                }
            },
            iconsBanner: {
                options: {
                    position: "top",
                    banner: "/* Copyright (c) 2016 Armand Grillet.\nSee the license in the \"About\" section for further information.\nGenerated via IcoMoon (http://icomoon.io/app/) */",
                    linebreak: true
                },
                files: {
                    src: ["min/css/icons.css"]
                }
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks("grunt-banner");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-htmlclean");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.loadNpmTasks("grunt-yui-compressor");

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask("default", ["copy", "concat", "jshint", "uglify", "processhtml", "htmlclean", "usebanner"]);
};
