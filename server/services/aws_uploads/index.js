const aws = require("aws-sdk");
const { s3_bucket_name, aws_access_key, aws_secret_key } = require("../../config/index");

aws.config.update({
  accessKeyId: aws_access_key,
  secretAccessKey: aws_secret_key,
});
