resource "aws_s3_bucket" "bucket_host_website" {
    bucket = "bucket-host-website-rx"
    website {
        index_document = "index.html"
        error_document = "404.html"

        routing_rules = <<EOF
        [{
            "Condition": {
                "HttpErrorCodeReturnedEquals": "400"
            },
            "Redirect": {
                "ReplaceKeyWith": "404.html"
            }
        }]
    EOF
    }
    cors_rule {
        allowed_origins = ["*"]
        allowed_methods = ["GET", "HEAD", "POST", "DELETE", "PUT"]
        allowed_headers = ["*"]
        expose_headers  = ["Date", "ETag"]}
        policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": ["s3:GetObject"],
            "Effect": "Allow",
            "Resource": "arn:aws:s3:::bucket-host-website-rx/*",
            "Principal" : "*"
        }
    ]
}
EOF
}

