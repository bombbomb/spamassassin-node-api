FROM ubuntu:latest

# update apt-get
RUN apt-get -y update

# install node, npm, and upstart
RUN apt-get -y dist-upgrade
RUN apt-get -y install nodejs
RUN apt-get -y install npm
RUN apt-get -y install upstart

# pre install node module: forever
RUN npm install forever -g

# enable node access with 'node' keyword
RUN ln -s /usr/bin/nodejs /usr/bin/node

# enable caching of npm install
ADD package.json /tmp/package.json
RUN cd /tmp && npm install

# create app directory
ADD / /nodeapp

RUN rm -rf /nodeapp/node_modules
RUN cp -r /tmp/node_modules /nodeapp/node_modules

EXPOSE 80

CMD ["forever", "/nodeapp/index.js"]
