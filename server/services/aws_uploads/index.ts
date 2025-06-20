import AWS from "aws-sdk";
import { s3_bucket_name, aws_access_key, aws_secret_key } from "../../config/index";

AWS.config.update({
  accessKeyId: aws_access_key,
  secretAccessKey: aws_secret_key,
});

export const s3 = new AWS.S3();
export const bucketName = s3_bucket_name;
