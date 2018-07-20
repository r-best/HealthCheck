# HealthCheck
AWS Lambda function designed to check the status of web services

## Lambda Setup

Simple, just create a Lambda and give it access to CloudWatch Logs and Amazon SNS.

## SNS Setup

The Lambda uses an SNS Topic to send alert messages to subscribed users whenever it finds a downed website. All you have to do is create a Topic and set its ARN as the Lambda's `TOPIC_ARN` environment variable.

> Don't forget to subscribe to the topic, or you won't get any of the messages!

## Deployment

Run the following commands and upload the resulting `lambda.zip` to the Lambda

```
npm install --prod
npm run build
```
