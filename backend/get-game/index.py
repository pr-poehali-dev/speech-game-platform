"""Получение HTML-содержимого игры по filename"""
import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    filename = (event.get('queryStringParameters') or {}).get('filename', '')
    if not filename:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'filename обязателен'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT content FROM games WHERE filename = %s", (filename,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'Игра не найдена'})}

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'text/html; charset=utf-8'},
        'body': row[0],
    }
