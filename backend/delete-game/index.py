"""Удаление игры из базы данных по имени файла. v2"""
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

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("DELETE FROM games WHERE filename = %s", (filename,))
    deleted = cur.rowcount
    conn.commit()
    cur.close()
    conn.close()

    print(f"[delete-game] deleted: {filename}, rows: {deleted}")

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'deleted': deleted > 0}, ensure_ascii=False),
    }