module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        copy: {
            main: { // Copy the src in a min folder.
                expand: true,
                cwd: "../src/",
                src: [
                    "manifest.json",
                    "_locales/**",
                    "app/**",
                    "css/**",
                    "fonts/**",
                    "img/**",
                    "js/lib/*"
                ],
                dest: "../min/"
            }
        },

        concat: {
            mado: {
                src: ["../src/js/*.js", "../src/js/Editor/*.js", "../src/js/Topbar/*.js"],
                dest: "../min/js/mado.js"
            },
            moreAbout: {
                src: [
                    ["../src/js/more/CloseButtonManager.js", "../src/js/more/Localizer.js", "../src/js/more/about-onload.js"],
                ],
                dest: "../min/js/more/about.js"
            },
            moreSettings: {
                src: [
                    ["../src/js/more/CloseButtonManager.js", "../src/js/more/Localizer.js", "../src/js/more/SettingsManager.js", "../src/js/more/settings-onload.js"],
                ],
                dest: "../min/js/more/settings.js"
            },
            moreShortcuts: {
                src: [
                    ["../src/js/more/CloseButtonManager.js", "../src/js/more/Localizer.js", "../src/js/more/ShortcutsManager.js", "../src/js/more/shortcuts-onload.js"],
                ],
                dest: "../min/js/more/shortcuts.js"
            }
        },

        jshint: {
            beforeconcat: ["../src/js/*.js", "../src/js/Editor/*.js", "../src/js/Topbar/*.js", "../src/js/more/*.js"],
            afterconcat: ["../min/js/mado.js", "../min/js/more/*.js"]
        },

        uglify: {
            mado: {
                files: {
                    "../min/js/mado.js": ["../min/js/mado.js"],
                    "../min/js/more/about.js": ["../min/js/more/about.js"],
                    "../min/js/more/settings.js": ["../min/js/more/settings.js"],
                    "../min/js/more/shortcuts.js": ["../min/js/more/shortcuts.js"]
                }
            }
        },

        processhtml: {
            mado: {
                files: {
                    "../min/mado.html": ["../src/mado.html"],
                    "../min/more/about.html": ["../src/more/about.html"],
                    "../min/more/settings.html": ["../src/more/settings.html"],
                    "../min/more/shortcuts.html": ["../src/more/shortcuts.html"]
                }
            }
        },

        htmlclean: {
            deploy: {
                expand: true,
                cwd: "../min/",
                src: "**/*.html",
                dest: "../min/"
            }
        },

        usebanner: {
            html: {
                options: {
                    position: "top",
                    banner: "<!-- Copyright (c) 2015 Armand Grillet.\nSee the license in the \"About\" section for further information. -->",
                    linebreak: true
                },
                files: {
                    src: ["../min/*.html", "../min/more/*.html"]
                }
            },
            cssJsBanner: {
                options: {
                    position: "top",
                    banner: "/* Copyright (c) 2015 Armand Grillet.\nSee the license in the \"About\" section for further information. */",
                    linebreak: true
                },
                files: {
                    src: ["../min/css/*.css", "../min/css/more/*.css", "../min/css/themes/*.css", "../min/js/mado.js", "../min/js/more/*.js", "!../min/css/icons.css"]
                }
            },
            iconsBanner: {
                options: {
                    position: "top",
                    banner: "/* Copyright (c) 2015 Armand Grillet.\nSee the license in the \"About\" section for further information.\nGenerated via IcoMoon (http://icomoon.io/app/) */",
                    linebreak: true
                },
                files: {
                    src: ["../min/css/icons.css"]
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
