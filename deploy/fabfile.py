#!/usr/bin/env python
# -*- coding: utf-8 -*-

from fabric.api import *
from fabric.contrib import files
import os

from settings import *

# create
RUN_DIR=os.path.join(HOME_DIR, "run")
LOG_DIR=os.path.join(HOME_DIR, "log")
REMOTE_REPO_DIR = os.path.join(HOME_DIR, APP_NAME)
OUT_LOG_FILE = os.path.join(LOG_DIR, 'out.log')
ERROR_LOG_FILE = os.path.join(LOG_DIR, 'error.log')

def uptime():
    """ Show number of active connections on the server """
    run('uptime')

def remote_info():
    """ Get name and info of remote host """
    run('uname -a')

def local_info():
    """ Get name and info of local host """
    local('uname -a')

def create_dirs():
    """ Create directory to store logs, PID, etc """
    run("mkdir -p %s"%RUN_DIR)
    run("mkdir -p %s"%LOG_DIR)

def update_code_from_git():
    """ Download latest version of the code from git """
    if not files.exists(REMOTE_REPO_DIR):
        with cd(HOME_DIR):
            run("git clone %s" % MAIN_GITHUB_REP )
    with cd(REMOTE_REPO_DIR):
        run("git pull")

def update_requirements():
    """ Update external dependencies on host """
    with cd(REMOTE_REPO_DIR):
        cmd = ['npm install']
        # cmd += ['--requirement %s' %  os.path.join(CODE_DIR,'requirements.txt')]
        run(' '.join(cmd))

def start():
    with cd(REMOTE_REPO_DIR):
        cmd = "export WEB_PORT=%s && forever start -o %s -e %s -a index.js -p %s"%( APP_PORT, OUT_LOG_FILE, ERROR_LOG_FILE, RUN_DIR)
        run(cmd)

def stop():
    with cd(REMOTE_REPO_DIR):
        cmd = "forever stop -l %s -a index.js -p %s"%(APP_PORT, RUN_DIR)
        run(cmd)

def restart():
    with cd(REMOTE_REPO_DIR):
        cmd = "forever restart -l %s -a index.js -p %s"%(APP_PORT, RUN_DIR)
        run(cmd)

def error_log():
    run("tail -200 %s"%ERROR_LOG_FILE)

def out_log():
    run("tail -200 %s"%OUT_LOG_FILE)

def init():
    """ Init setup of the project """
    pass

def deploy():
    """ Update the project """
    create_dirs()
    update_code_from_git()
    update_requirements()
    restart()
