"""
Фиксирует запуск / завершение игры.
POST / — начать сессию (открыли игру)
PATCH / — завершить сессию (закрыли, передать duration_seconds)
"""
import json, os
from datetime import datetime, timedelta
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def get_user_id(conn, token: str):
    if not token:
        return None
    with conn.cursor() as cur:
        cur.execute(
            "SELECT user_id FROM auth_sessions WHERE token = %s AND expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        return row[0] if row else None

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "POST")
    token = event.get("headers", {}).get("X-Auth-Token", "")
    body = json.loads(event.get("body") or "{}")

    conn = get_conn()
    user_id = get_user_id(conn, token)

    # POST — начать сессию (открыли игру)
    if method == "POST":
        filename = body.get("filename", "")
        title = body.get("title", "")
        emoji = body.get("emoji", "🎮")
        category = body.get("category", "")

        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO game_sessions (user_id, game_filename, game_title, game_emoji, category)
                   VALUES (%s, %s, %s, %s, %s) RETURNING id""",
                (user_id, filename, title, emoji, category)
            )
            session_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS,
                "body": json.dumps({"session_id": session_id})}

    # PATCH — завершить сессию (сохранить duration)
    if method == "PATCH":
        session_id = body.get("session_id")
        duration = int(body.get("duration_seconds", 0))

        if session_id:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE game_sessions SET duration_seconds = %s WHERE id = %s",
                    (duration, session_id)
                )
            conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS,
                "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}
