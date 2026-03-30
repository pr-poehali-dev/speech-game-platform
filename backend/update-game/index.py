"""Обновление метаданных игры (категория, название, описание, эмодзи)"""
import json
import os
import psycopg2

ADMIN_PASSWORD = "logodeti2024"


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    password = body.get('password', '')
    filename = body.get('filename', '').strip()

    if password != ADMIN_PASSWORD:
        return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Нет доступа'})}

    if not filename:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'filename обязателен'})}

    fields = {}
    if 'category' in body:
        fields['category'] = body['category']
    if 'title' in body:
        fields['title'] = body['title']
    if 'description' in body:
        fields['description'] = body['description']
    if 'emoji' in body:
        fields['emoji'] = body['emoji']

    if not fields:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Нет полей для обновления'})}

    set_clause = ', '.join(f"{k} = %s" for k in fields)
    values = list(fields.values()) + [filename]

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f"UPDATE games SET {set_clause} WHERE filename = %s", values)
    updated = cur.rowcount
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'updated': updated > 0}, ensure_ascii=False),
    }
