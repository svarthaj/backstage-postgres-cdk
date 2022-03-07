import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Vpc, InstanceType, InstanceSize, InstanceClass } from 'aws-cdk-lib/aws-ec2';


export class CdkRdsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'BackstageVpc', {
      cidr: '10.192.0.0/16',
      maxAzs: 2,
      natGateways: 1,
      enableDnsHostnames: true,
      enableDnsSupport: true
    });

    const engine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_5 });
    
    const dbInstance = new DatabaseInstance(this, 'Backstage_Postgres_CDK', {
      engine,
      vpc,
      iamAuthentication: true,
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE3,
        InstanceSize.MICRO
      ),
      databaseName: 'backstage_postgress'
    });

    new CfnOutput(this, 'dbEndpoint', {
      value: dbInstance.instanceEndpoint.hostname,
    });
  }
}
