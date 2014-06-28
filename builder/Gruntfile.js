module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        copy: {
            main: { // Copy the src in a min folder.
                expand: true,
                cwd: "../src/",
                src: [
                    "**",
                    "!js/*.js",
                    "!js/more/*.js"
                ],
                dest: "../min/",
            }
        },

        concat: { 
            mado: {
                src: ["../src/js/*.js"],
                dest: "../min/js/mado.js",
            },
            moreAbout: {
                src: [
                    ["../src/js/more/more-close-button.js", "../src/js/more/about-onload.js"],
                ],
                dest: "../min/js/more/about.js",
            },
            moreQanda: {
                src: [
                    ["../src/js/more/more-close-button.js", "../src/js/more/qanda-onload.js"],
                ],
                dest: "../min/js/more/qanda.js",
            },
            moreSettings: {
                src: [
                    ["../src/js/more/more-close-button.js", "../src/js/more/settings.js", "../src/js/more/settings-onload.js"],
                ],
                dest: "../min/js/more/settings.js",
            },
            moreShortcuts: {
                src: [
                    ["../src/js/more/more-close-button.js", "../src/js/more/shortcuts-onload.js"],
                ],
                dest: "../min/js/more/shortcuts.js",
            }
        },

        processhtml: {
            mado: {
                files: {
                    "../min/mado.html": ["../min/mado.html"]
                }
            },
            moreAbout: {
                files: {
                    "../min/more/about.html": ["../min/more/about.html"]
                }
            },
            moreQanda: {
                files: {
                    "../min/more/qanda.html": ["../min/more/qanda.html"]
                }
            },
            moreSettings: {
                files: {
                    "../min/more/settings.html": ["../min/more/settings.html"]
                }
            },
            moreShortcuts: {
                files: {
                    "../min/more/settings.html": ["../min/more/settings.html"]
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

        cssmin: {
            dist: {
                expand: true,
                cwd: "../min/",
                src: "**/*.css",
                dest: "../min/"
            }
        },

        /* Closure Compiler automatique. */
        
        usebanner: {
            html: {
                options: {
                    position: "top",
                    banner: "<!-- Property of A+A (juridically known as Allan Rope and Armand Grillet). ALL RIGHTS RESERVED.\nSee our Terms of Service in the \"About\" section for further information. -->",
                    linebreak: true
                },
                files: {
                    src: ["../min/*.html", "../min/more/*.html"]
                }
            },
            cssJsBanner: {
                options: {
                    position: "top",
                    banner: "/* Property of A+A (juridically known as Allan Rope and Armand Grillet). ALL RIGHTS RESERVED.\nSee our Terms of Service in the \"About\" section for further information. */",
                    linebreak: true
                },
                files: {
                    src: ["../min/css/*.css", "../min/css/more/*.css", "../min/css/themes/*.css", "../min/js/mado.js", "../min/js/more/*.js", "!../min/css/icons.css"]
                }
            },
            iconsBanner: {
                options: {
                    position: "top",
                    banner: "/* Property of A+A (juridically known as Allan Rope and Armand Grillet). ALL RIGHTS RESERVED.\nSee our Terms of Service in the \"About\" section for further information.\nGenerated via IcoMoon (http://icomoon.io/app/) */",
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
    grunt.loadNpmTasks("grunt-htmlclean");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.loadNpmTasks("grunt-yui-compressor");

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask("default", ["copy", "concat", "processhtml","htmlclean", "cssmin", "usebanner"]);

};