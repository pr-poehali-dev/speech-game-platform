"""Загрузка HTML-файла игры в S3-хранилище"""
import json
import os
import base64
import boto3
import re


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    filename = body.get('filename', '').strip()
    title = body.get('title', '').strip()
    description = body.get('description', '').strip()
    emoji = body.get('emoji', '🎮').strip()
    content_b64 = body.get('content', '')

    if not filename or not content_b64:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'filename и content обязательны'})}

    safe_name = re.sub(r'[^a-zA-Z0-9_\-]', '_', filename.replace('.html', '')) + '.html'
    html_bytes = base64.b64decode(content_b64)
    print(f"[upload-game] filename={filename}, safe_name={safe_name}, content_len={len(html_bytes)}")

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    try:
        r1 = s3.put_object(
            Bucket='files',
            Key=f'games/{safe_name}',
            Body=html_bytes,
            ContentType='text/html; charset=utf-8',
        )
        print(f"[upload-game] html put OK: {r1.get('ResponseMetadata', {}).get('HTTPStatusCode')}")
    except Exception as e:
        print(f"[upload-game] html put ERROR: {e}")
        return {'statusCode': 500, 'headers': cors, 'body': json.dumps({'error': str(e)})}

    meta = {
        'filename': safe_name,
        'title': title or safe_name,
        'description': description,
        'emoji': emoji,
    }
    try:
        r2 = s3.put_object(
            Bucket='files',
            Key=f'games/{safe_name}.meta.json',
            Body=json.dumps(meta, ensure_ascii=False).encode(),
            ContentType='application/json',
        )
        print(f"[upload-game] meta put OK: {r2.get('ResponseMetadata', {}).get('HTTPStatusCode')}")
    except Exception as e:
        print(f"[upload-game] meta put ERROR: {e}")
        return {'statusCode': 500, 'headers': cors, 'body': json.dumps({'error': str(e)})}

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/games/{safe_name}"
    print(f"[upload-game] done, cdn_url={cdn_url}")

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'url': cdn_url, 'filename': safe_name, 'meta': meta}, ensure_ascii=False),
    }