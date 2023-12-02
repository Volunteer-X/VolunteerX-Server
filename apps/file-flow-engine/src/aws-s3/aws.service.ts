import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterSnowflake as Snowflake } from '@sapphire/snowflake';

@Injectable()
export class AWSService {
  s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  //   Create Presigned Url for upload
  async createPresignedUrl() {
    const Key = Snowflake.generate().toString();

    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET'),
      Key,
      ContentType: 'application/octet-stream',
      // ACL: 'bucket-owner-full-control',
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });

    return { Key, signedUrl };
  }
}
