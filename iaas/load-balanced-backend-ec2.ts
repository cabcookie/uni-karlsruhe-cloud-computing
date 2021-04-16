#!/usr/bin/env node
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';

export class BackEndInfrastructure extends cdk.Stack {
    constructor(stack: cdk.Stack, id: string) {
        super(stack, id);
        
        const vpc = new ec2.Vpc(this, 'VPC');

        const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
            desiredCapacity: 2,
            minCapacity: 1,
            maxCapacity: 3,
            machineImage: new ec2.AmazonLinuxImage(),
        });

        const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
            vpc,
            internetFacing: true
        });

        const listener = lb.addListener('Listener', {
            port: 80,
        });

        listener.addTargets('Target', {
            port: 80,
            targets: [asg]
        });

        listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

        asg.scaleOnCpuUtilization("ScaleOnCPU", {
            targetUtilizationPercent: 20,
        });
    }
}
