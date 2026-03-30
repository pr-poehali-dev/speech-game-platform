"""Получение списка игр из S3-хранилища"""
import json
import os
import boto3


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    response = s3.list_objects_v2(Bucket='files', Prefix='games/')
    objects = response.get('Contents') or []

    meta_keys = [o['Key'] for o in objects if o['Key'].endswith('.meta.json')]

    games = []
    key_id = os.environ['AWS_ACCESS_KEY_ID']
    for key in meta_keys:
        obj = s3.get_object(Bucket='files', Key=key)
        meta = json.loads(obj['Body'].read())
        game_file = key.replace('.meta.json', '')
        meta['url'] = f"https://cdn.poehali.dev/projects/{key_id}/bucket/{game_file}"
        games.append(meta)

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'games': games}, ensure_ascii=False),
    }
