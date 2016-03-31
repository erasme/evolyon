
def install_git():
  if not cmd_exists('git'):
      apt_install("build-essential git git-core")
      run("git config --global color.ui true")

def install_nodejs():
  run("source ~/.bashrc")

  if not cmd_exists('node'):
    with cd("/tmp"):
      # get nvm
      run("wget https://raw.githubusercontent.com/creationix/nvm/v0.13.1/install.sh")
      run("bash install.sh")

      # install node
      run("nvm install v0.10.26")
      run("nvm use v0.10.26")
      run("nvm alias default v0.10.26")

      # add to path
      run("echo . ~/.nvm/nvm.sh >> ~/.bashrc")
      run("source ~/.bashrc")

      # run("rm install.sh")


def apt(cmdline):
  if not cmd_exists('aptitude'):
        sudo("apt-get -y install aptitude")
  sudo("aptitude %s" % cmdline)

def apt_install(packages):
    apt("-y install %s" % packages)
