# Donation API
This API is implemented in TypeScript with Node.js.
The whole application is intended to be deployed on AWS.

## Design
There are 4 functions: Create / List / Search / SendEmail, deployed on AWS Lambda.
Three of them are exposed to the public via API Gateway.
Data is persisted in DynamoDB. An event from donation created is sent to SQS.
If condition is met, an email is sent via SES.

## API Specification
The OpenAPI specification of the API can be viewed at [openapi3.yaml](openapi3.yaml).


## Endpoints
There are 3 endpoints for public access:

**POST** `/donations`

Create a donation by posting a JSON.

Required fields: `email`, `amount`

Optional field: `name`

**GET** `/donations`

Get a list of donations by an email.

Query string:
- `email` - (required)

**GET** `/donations/search`

Get a list of donations with pagination.

Query string:
- `limit` - (optional) Specify the maximum size of results; if not provided, a default value of 20 is applied.
- `email` - (optional) This query is needed when using pagination.
- `timestamp` - (optional) This query is need when using pagination.

## Database
The application uses DynamoDB as its database with 1 Table.

**Donation** - Primary key is (`email`, `timestamp0`).
`timestamp` is a reserved keyword in DynamoDB.

## Authentication
There is no authentication.

## Deployment
You can deploy most of the infrastructure on AWS using this [CloudFormation template](cf_template.yaml).
Note that this CF file must be applied in Singapore (ap-southeast-1) because default S3 buckets of Lambda functions and API Gateway are provided in this region.
You can deploy at other regions if you prepare your own S3 buckets.

Before applying this CF file, you need an email that has been verified in SES.
This email will be the one which sends a thankyou email to a donator who donates twice or more.
When you have this email prepared, apply the CF file.
Then you need to set API Gateway integrations for 3 endpoints
- **POST** `/donations` with Lambda named XXX-DonationCreate-XXX (Lambda Proxy - checked)
- **GET** `/donations` with Lambda named XXX-DonationList-XXX (Lambda Proxy - checked)
- **GET** `/donations/search` with Lambda named XXX-DonationSearch-XXX (Lambda Proxy - checked)

After you set these integrations, proceed to deploy the API and you will get a public URL.

## Logging
All Lambda function executions are logged in CloudWatch Logs by default.
Log group names are:
- /aws/lambda/XXX-DonationCreate-XXX
- /aws/lambda/XXX-DonationList-XXX
- /aws/lambda/XXX-DonationSearch-XXX
- /aws/lambda/XXX-DonationSendEmail-XXX

Additionally, error messages are logged directly from the application with `console.erorr`.
The format is `FnName Error: error_message`.

## Test
Automated tests are located at [test](test). DynamoDB in the deployment is required.
So, you must apply the CF file first.
You also need to build from TypeScript to JavaScript before running these tests.

### Build the source code
`npm run build`

### Run the tests
`npm run test`

An Express.js server can be run as well with limited functionalities.
### Run the server locally
`npm start`

## Postman
In case you need to run tests manually, a Postman collection is provided at [postman](postman).
These tests run against a deployment in the developer's AWS account.

## Scaling in production
If this API is used in production, you need to consider these points:
- A version of authentication must be integrated.
- You need to set DynamoDB read/write capacity units (RCU/WCU) appropriately.
Either use provision mode with auto-scaling or on-demand mode.
Other services are fully serverless and scalable by default.
- You need to take SES out of Sandbox mode, so that you can send emails to other people.
Currently, if a destination email is unverified, a verification email will be sent.
If a destination email is verified, a thankyou email will be sent.
In production, you always need to send a thankyou email without a verification email.
