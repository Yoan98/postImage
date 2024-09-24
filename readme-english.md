# Project Name
post-image

## Introduction
A tool script used to upload multiple image resources to a cloud server and generate a JSON file with the returned URLs and filenames, making it convenient for front-end developers to copy the paths.

## Background
Originally developed for front-end projects where it was necessary to call a back-end API to upload images to a cloud server. This process required manual uploads, which was inconvenient. Therefore, this script was written to automatically upload multiple images to the cloud server.

## Prerequisites
You need to have a back-end API available that can handle uploading images to the cloud server.

## Installing Dependencies
Run `yarn` or `npm install`.

## Usage
1. Configure the `config.js` file with the relevant URLs and other information.
2. Place the images you want to upload in the `needPostImg` folder.
3. Execute `node upload.js`.
4. The script will generate aliases and corresponding paths in the `files.json` file based on the image names.
5. Run `node clear.js` to clear the images from the `needPostImg` folder.
