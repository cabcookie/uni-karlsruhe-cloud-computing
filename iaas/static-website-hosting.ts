#!/usr/bin/env node
import { CloudFrontWebDistribution, OriginAccessIdentity, SecurityPolicyProtocol, SSLMethod } from '@aws-cdk/aws-cloudfront';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core';

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 * 
 * This stack relies on getting the domain name from CDK context.
 * Add the following to cdk.json:
 * {
 *   "context": {
 *     "domain": "mystaticsite.com",
 *   }
 * }
 */
export class StaticWebsiteS3 extends Stack {
    constructor(stack: Stack, name: string) {
        super(stack, name);

        // S3 Bucket for static website 
        const siteBucket = new Bucket(this, "SiteBucket", {
            bucketName: "unikarlsruhe-site-bucket",
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            removalPolicy: RemovalPolicy.DESTROY,
        });
        new CfnOutput(this, "SiteBucketName", { value: siteBucket.bucketName });
        
        const siteDomain = this.node.tryGetContext("domain");
        const certificateArn = this.node.tryGetContext("certificateArn");
        
        // CloudFront distribution that provides HTTPS
        const oai = new OriginAccessIdentity(this, "OriginAccessIdentity");
        const distribution = new CloudFrontWebDistribution(this, "SiteDistribution", {
            originConfigs: [{
                s3OriginSource: {
                    s3BucketSource: siteBucket,
                    originAccessIdentity: oai,
                },
                behaviors: [{ isDefaultBehavior: true }],
            }],
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [siteDomain],
                sslMethod: SSLMethod.SNI,
                securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
            },
        });
        new CfnOutput(this, "SiteUrl", { value: `https://${siteDomain}` });

        // Deploy `./src` on your S3 Bucket
        new BucketDeployment(this, "DeployOnSiteBucket", {
            sources: [Source.asset("./src")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"],
        })
    }
}
