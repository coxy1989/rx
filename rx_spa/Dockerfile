# DOCKERFILE for CI/CD - see .circleci/config.yml in the root of this repository

from node:dubnium-slim

# install pip
RUN apt-get update
RUN apt-get install -y python-pip
RUN pip install --upgrade pip
# install awscli
RUN pip install awscli --upgrade

