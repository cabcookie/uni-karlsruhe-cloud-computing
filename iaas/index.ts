#!/usr/bin/env node
import { App, Stack } from '@aws-cdk/core';
import { StaticWebsiteS3 } from './static-website-hosting';
// import { BackEndInfrastructure } from './load-balanced-backend-ec2';

export class UniKarlsruheStack extends Stack {
    constructor(app: App, id: string) {
        super(app, id);

        // Host a static website
        new StaticWebsiteS3(this, "StaticWebsiteS3")

        // new BackEndInfrastructure(this, "BackendInfrastructure")
    }
}

const app = new App();
new UniKarlsruheStack(app, 'UniKarlsruheStack');
app.synth();
