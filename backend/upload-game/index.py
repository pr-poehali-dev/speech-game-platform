"""Загрузка HTML-файла игры в базу данных"""
import json
import os
import base64
import re
import psycopg2


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
    html_content = base64.b64decode(content_b64).decode('utf-8', errors='replace')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO games (filename, title, description, emoji, content)
           VALUES (%s, %s, %s, %s, %s)
           ON CONFLICT (filename) DO UPDATE
           SET title=EXCLUDED.title, description=EXCLUDED.description,
               emoji=EXCLUDED.emoji, content=EXCLUDED.content""",
        (safe_name, title or safe_name, description, emoji, html_content)
    )
    conn.commit()
    cur.close()
    conn.close()

    print(f"[upload-game] saved to DB: {safe_name}")

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'filename': safe_name, 'title': title}, ensure_ascii=False),
    }
