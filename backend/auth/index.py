"""
Auth: регистрация, вход, получение профиля, выход.
POST /register — создать аккаунт
POST /login    — войти, получить токен
GET  /me       — профиль + подписка (по токену)
POST /logout   — выйти
"""
import json, os, hashlib, secrets
from datetime import datetime, timedelta
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token() -> str:
    return secrets.token_hex(32)

def get_user_by_token(conn, token: str):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT u.id, u.email, u.name, u.role, u.created_at,
                   s.plan, s.expires_at, s.is_active
            FROM auth_sessions AS a
            JOIN users AS u ON u.id = a.user_id
            LEFT JOIN subscriptions AS s ON s.user_id = u.id AND s.is_active = TRUE
            WHERE a.token = %s AND a.expires_at > NOW()
            ORDER BY s.expires_at DESC NULLS LAST
            LIMIT 1
        """, (token,))
        return cur.fetchone()

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    token = event.get("headers", {}).get("X-Auth-Token", "")

    conn = get_conn()

    try:
        # POST /register
        if method == "POST" and path.endswith("/register"):
            body = json.loads(event.get("body") or "{}")
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""
            name = (body.get("name") or "").strip()

            if not email or not password or len(password) < 6:
                return {"statusCode": 400, "headers": CORS,
                        "body": json.dumps({"error": "Укажите email и пароль (минимум 6 символов)"})}

            with conn.cursor() as cur:
                cur.execute("SELECT id FROM users WHERE email = %s", (email,))
                if cur.fetchone():
                    conn.close()
                    return {"statusCode": 409, "headers": CORS,
                            "body": json.dumps({"error": "Этот email уже зарегистрирован"})}

                cur.execute(
                    "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
                    (email, hash_password(password), name)
                )
                user_id = cur.fetchone()[0]

                # Бесплатная подписка на 14 дней
                cur.execute(
                    "INSERT INTO subscriptions (user_id, plan, expires_at) VALUES (%s, 'trial', %s)",
                    (user_id, datetime.now() + timedelta(days=14))
                )

                new_token = make_token()
                cur.execute(
                    "INSERT INTO auth_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                    (user_id, new_token, datetime.now() + timedelta(days=30))
                )
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": CORS,
                    "body": json.dumps({"token": new_token, "user_id": user_id})}

        # POST /login
        if method == "POST" and path.endswith("/login"):
            body = json.loads(event.get("body") or "{}")
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""

            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id FROM users WHERE email = %s AND password_hash = %s",
                    (email, hash_password(password))
                )
                row = cur.fetchone()
                if not row:
                    conn.close()
                    return {"statusCode": 401, "headers": CORS,
                            "body": json.dumps({"error": "Неверный email или пароль"})}
                user_id = row[0]

                new_token = make_token()
                cur.execute(
                    "INSERT INTO auth_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                    (user_id, new_token, datetime.now() + timedelta(days=30))
                )
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": CORS,
                    "body": json.dumps({"token": new_token, "user_id": user_id})}

        # GET /me
        if method == "GET" and path.endswith("/me"):
            if not token:
                conn.close()
                return {"statusCode": 401, "headers": CORS,
                        "body": json.dumps({"error": "Требуется авторизация"})}

            row = get_user_by_token(conn, token)
            conn.close()
            if not row:
                return {"statusCode": 401, "headers": CORS,
                        "body": json.dumps({"error": "Сессия истекла, войдите снова"})}

            user_id, email, name, role, created_at, plan, expires_at, is_active = row
            sub_days_left = None
            if expires_at:
                delta = expires_at - datetime.now()
                sub_days_left = max(0, delta.days)

            return {"statusCode": 200, "headers": CORS, "body": json.dumps({
                "id": user_id,
                "email": email,
                "name": name,
                "role": role,
                "plan": plan or "free",
                "subscription_expires_at": expires_at.isoformat() if expires_at else None,
                "subscription_days_left": sub_days_left,
                "subscription_active": bool(is_active and (sub_days_left is None or sub_days_left > 0)),
                "created_at": created_at.isoformat(),
            })}

        # POST /logout
        if method == "POST" and path.endswith("/logout"):
            if token:
                with conn.cursor() as cur:
                    cur.execute("UPDATE auth_sessions SET expires_at = NOW() WHERE token = %s", (token,))
                conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        conn.close()
        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}

    except Exception as e:
        conn.close()
        raise e
