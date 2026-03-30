"""Получение списка игр из базы данных"""
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

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT filename, title, description, emoji FROM games ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    games = [
        {'filename': r[0], 'title': r[1], 'description': r[2], 'emoji': r[3]}
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'games': games}, ensure_ascii=False),
    }
