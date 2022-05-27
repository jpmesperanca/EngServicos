FROM python:3.8

#From https://gist.github.com/MichalZalecki/4a87880bbe7a3a5428b5aebebaa5cd97
ARG USER_NAME="main"
ARG USER_PASSWORD="main"

ENV USER_NAME $USER_NAME
ENV USER_PASSWORD $USER_PASSWORD
ENV CONTAINER_IMAGE_VER=v1.0.0
ENV PATH "$PATH:/home/main/.local/bin:/home/main/.ebcli-virtual-env/executables"

RUN echo $USER_NAME
RUN echo $USER_PASSWORD
RUN echo $CONTAINER_IMAGE_VER

# install the tooks i wish to use
RUN apt-get update && \
  apt-get install -y sudo \
  vim \
  curl \
  git-core \
  groff \
  locales \
  zsh \
  wget \
  zip \
  # set up locale
  && locale-gen en_US.UTF-8 \
  # add a user (--disabled-password: the user won't be able to use the account until the password is set)
  && adduser --quiet --disabled-password --shell /bin/zsh --home /home/$USER_NAME --gecos "User" $USER_NAME \
  # update the password
  && echo "${USER_NAME}:${USER_PASSWORD}" | chpasswd && usermod -aG sudo $USER_NAME


# AWS CLI
#RUN sh -c "$(curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip)"
#RUN sh -c "unzip awscliv2.zip"
#RUN sh -c "./aws/install"

RUN sh -c "/usr/local/bin/python -m pip install --upgrade pip"
RUN sh -c "pip install virtualenv"
RUN sh -c "git clone https://github.com/aws/aws-elastic-beanstalk-cli-setup.git"


# the user we're applying this too (otherwise it most likely install for root)
USER $USER_NAME
# terminal colors with xterm
ENV TERM xterm
# set the zsh theme
ENV ZSH_THEME robbyrussell

RUN sh -c "python /aws-elastic-beanstalk-cli-setup/scripts/ebcli_installer.py"

# run the installation script  
#  RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"


# start zsh
CMD [ "zsh" ]
