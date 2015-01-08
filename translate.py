#!/bin/python
# -*- coding: utf-8 -*-

########### how to use? ##############
# in console. do this
# $ python translate.py src to_src
# it will translate src to to_src
# now it only translate to chinese
######################################

import sys
import os

trans_dict = {
    "Choose an image":"选择一张图片",
    "See the result here":"这里预览结果",
    "Unsaved changes":"未保存",
    "This document has unsaved changes. Do you want to save these changes before exiting?":"当前文档未保存，退出前是否保存?",
    "Type the image's URL":"输入图片的URL地址",
    "Type the URL":"输入URL地址",
    "Type a text (optional)":"输入标题（可选）",
    "Type a syntax (e.g. 'bold')":"输入语法（如：'bold'）",
    "Choose your galleries":"选择图片库",
    "Type an alt text":"输入描述",
    "No, don't save":"不保存",
    "Save and exit":"保存",
    "Save as":"另存于",
    "About Mado":"关于",
    "New":"新建",
    "Open":"打开",
    "Recent":"最近",
    "Export":"导出",
    "Print":"打印",
    "Settings":"设置",
    "Q&amp;A":"问答",
    "Shortcuts":"快捷键",
    "Cancel":"取消",
    "Ok":"确定",
    "Save":"保存",
    "Write here":"在这里写",
    "Syntax:":"语法:",
    "Classic shortcuts":"经典快捷键",
    "Create a new document.":"创建一个新文件",
    "Open an existing document.":"打开一个已存在的文件",
    "Save the document.":"保存当前文件",
    "Save the document as…":"另存当前文件",
    "Print the document.":"打印当前文件",
    "Open the quick help tool.":"打开快速帮助工具",
    "Insert a link.":"插入一个链接",
    "Close the window.":"关闭窗口",
    "Mado specific shortcuts":"Mado特有快捷键",
    "Switch the workspace view to the left.":"切换工作区至左边",
    "Switch the workspace view to the right.":"切换工作区至右边",
    "What is Mado?":"Mado是什么？",
    "Mado is a Markdown editor application. It works on Linux, Mac&nbsp;OS&nbsp;X and Windows. You can use it to take notes, write blog posts or edit documents.":"Mado是一个Markdown编辑器。它可以在Linux, Mac&nbsp;OS&nbsp;X and Windows。你可以用它来做笔记,写博客文章或编辑文档。",
    "Does Mado work offline?":"Mado可否离线工作？",
    "Yes, it does. Mado was designed to work offline just fine.":"是的，可以离线工作。Mado离线工作得很好。",
    "What does Mado know about me?":"Mado会知道我的什么信息？",
    "Mado knows things like how many users are using it but it never analyzes your documents.":"Mado只会知道多少人在使用它，并不会分析你的文档。",
    "What is the connection between Mado and Google Chrome?":"Mado和Google Chrome 有什么联系？",
    "Mado is an application based on Google Chrome. Some of its current limitations are due to Google Chrome features yet to come. Mado evolves with the navigator’s updates in order to maximize its potential.":"Mado是一个运行在Google Chrome 之上的应用程序。现有的某些局限性是由于Google Chrome的功能。Mado随着navigator的发展会最大限度地发挥其潜力",
}

from_path = sys.argv[1]
to_path = sys.argv[2]
cmd = "cp -rf %s %s" % (from_path,to_path)
os.system(cmd)

def sortfunc(x,y):
    return  cmp(y,x);


items = trans_dict.keys()
items.sort(sortfunc);

for parent,dirnames,filenames in os.walk(from_path):  #三个参数：分别返回1.父目录 2.所有文件夹名字（不含路径） 3.所有文件名字
    #for dirname in  dirnames:                         #输出文件夹信息
        #print "parent is:" + parent
        #print "dirname is" + dirname
    for filename in filenames:                        #输出文件信息
        #print "parent is:" + parent
        #print "filename is:" + filename
        #print "the full name of the file is:" + os.path.join(parent,filename) #输出文件路径信息
        from_file_path = os.path.join(parent,filename)
        to_file_path = os.path.join(parent.replace(from_path,to_path),filename)
        print from_file_path + " -> " + to_file_path
        if from_file_path[-3:]==".js" or from_file_path[-5:]==".html":
            f = open(from_file_path,"r")
            ftxt = f.read()
            f.close()
            t = open(to_file_path,"w")
            for k in items:
                ftxt = ftxt.replace(k,trans_dict[k])
            t.write(ftxt)
            t.close()

