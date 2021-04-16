#!/usr/bin/env node
// import { HostedZone } from '@aws-cdk/aws-route53';
import { Bucket } from '@aws-cdk/aws-s3';
import { CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core';

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 * 
 * This stack relies on getting the domain name from CDK context and 
 * subdomains for the environments `test` and `prod` and the current domain
 * it should be deployed in.
 * Use 'cdk synth -c env=test'
 * and add the following to cdk.json:
 * {
 *   "context": {
 *     "domain": "mystaticsite.com",
 *     "subdomain-test": "xyz-test",
 *     "subdomain-prod": "xyz"
 *   }
 * }
 */
export class StaticWebsiteS3 extends Stack {
    constructor(stack: Stack, name: string) {
        super(stack, name);
        /**{
            env: {
                // Stack must be in us-east-1, because the ACM certificate for a
                // global CloudFront distribution must be requested in us-east-1.
                region: 'us-east-1'
            }
        });*/

        // const env = this.node.tryGetContext("env");
        // const domain = this.node.tryGetContext("domain");
        // const subdomain = this.node.tryGetContext(`subdomain-${env}`);
        // const siteDomain = `${subdomain}.${domain}`;

        // const zone = HostedZone.fromLookup(this, "Zone", { domainName: domain });
        // new CfnOutput(this, "SiteUrl", { value: `https://${siteDomain}` });

        // S3 Bucket for static website 
        const siteBucket = new Bucket(this, "SiteBucket", {
            bucketName: "unikarlsruhe-site-bucket",
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",

            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
            removalPolicy: RemovalPolicy.DESTROY,
        });
        new CfnOutput(this, "SiteBucketName", { value: siteBucket.bucketName });

    }
}
