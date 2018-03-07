'use strict';

const app = require('../app').app;

const Storage = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
  keyFilename: './Flagship-90618a5e2e34.json'
});

function listFiles(bucketName) {

  // Lists files in the bucket
  storage
    .bucket(bucketName)
    .getFiles()
    .then(results => {
      const files = results[0];

      console.log('Files:');
      files.forEach(file => {
        console.log(file.name);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function listFilesByPrefix(bucketName, prefix, delimiter) {

  /**
   * This can be used to list all blobs in a "folder", e.g. "public/".
   *
   * The delimiter argument can be used to restrict the results to only the
   * "files" in the given "folder". Without the delimiter, the entire tree under
   * the prefix is returned. For example, given these blobs:
   *
   *   /a/1.txt
   *   /a/b/2.txt
   *
   * If you just specify prefix = '/a', you'll get back:
   *
   *   /a/1.txt
   *   /a/b/2.txt
   *
   * However, if you specify prefix='/a' and delimiter='/', you'll get back:
   *
   *   /a/1.txt
   */
  const options = {
    prefix: prefix,
  };

  if (delimiter) {
    options.delimiter = delimiter;
  }

  // Lists files in the bucket, filtered by a prefix
  storage
    .bucket(bucketName)
    .getFiles(options)
    .then(results => {
      const files = results[0];

      console.log('Files:');
      files.forEach(file => {
        console.log(file.name);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function uploadFile(bucketName, filename, callback) {

  // Uploads a local file to the bucket
  storage
    .bucket(bucketName)
    .upload(filename)
    .then(() => {
      console.log(`${filename} uploaded to ${bucketName}.`);
      callback();
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function downloadFile(bucketName, srcFilename, destFilename, callback) {
  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };

  // Downloads the file
  storage
    .bucket(bucketName)
    .file(srcFilename)
    .download(options)
    .then(() => {
      console.log(
        `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
      );
      callback();
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function deleteFile(bucketName, filename) {

  // Deletes the file from the bucket
  storage
    .bucket(bucketName)
    .file(filename)
    .delete()
    .then(() => {
      console.log(`gs://${bucketName}/${filename} deleted.`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function getMetadata(bucketName, filename) {

  // Gets the metadata for the file
  storage
    .bucket(bucketName)
    .file(filename)
    .getMetadata()
    .then(results => {
      const metadata = results[0];

      console.log(`File: ${metadata.name}`);
      console.log(`Bucket: ${metadata.bucket}`);
      console.log(`Storage class: ${metadata.storageClass}`);
      console.log(`Self link: ${metadata.selfLink}`);
      console.log(`ID: ${metadata.id}`);
      console.log(`Size: ${metadata.size}`);
      console.log(`Updated: ${metadata.updated}`);
      console.log(`Generation: ${metadata.generation}`);
      console.log(`Metageneration: ${metadata.metageneration}`);
      console.log(`Etag: ${metadata.etag}`);
      console.log(`Owner: ${metadata.owner}`);
      console.log(`Component count: ${metadata.component_count}`);
      console.log(`Crc32c: ${metadata.crc32c}`);
      console.log(`md5Hash: ${metadata.md5Hash}`);
      console.log(`Cache-control: ${metadata.cacheControl}`);
      console.log(`Content-type: ${metadata.contentType}`);
      console.log(`Content-disposition: ${metadata.contentDisposition}`);
      console.log(`Content-encoding: ${metadata.contentEncoding}`);
      console.log(`Content-language: ${metadata.contentLanguage}`);
      console.log(`Metadata: ${metadata.metadata}`);
      console.log(`Media link: ${metadata.mediaLink}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function moveFile(bucketName, srcFilename, destFilename) {

  // Moves the file within the bucket
  storage
    .bucket(bucketName)
    .file(srcFilename)
    .move(destFilename)
    .then(() => {
      console.log(
        `gs://${bucketName}/${srcFilename} moved to gs://${bucketName}/${
          destFilename
        }.`
      );
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function copyFile(srcBucketName, srcFilename, destBucketName, destFilename) {

  // Copies the file to the other bucket
  storage
    .bucket(srcBucketName)
    .file(srcFilename)
    .copy(storage.bucket(destBucketName).file(destFilename))
    .then(() => {
      console.log(
        `gs://${srcBucketName}/${srcFilename} copied to gs://${
          destBucketName
        }/${destFilename}.`
      );
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

module.exports = {listFiles,
  listFilesByPrefix,
  uploadFile,
  downloadFile,
  deleteFile,
  getMetadata,
  moveFile,
  copyFile
}

