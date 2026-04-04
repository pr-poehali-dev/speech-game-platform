"""
Прогресс пользователя: журнал сессий, статистика по звукам, streak.
GET / — полная статистика (требует X-Auth-Token)
GET /report — текстовый отчёт для копирования
"""
import json, os
from datetime import datetime, timedelta, date
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

CATEGORY_LABELS = {
    "auto-ch": 'Автоматизация "Ч"',
    "auto-r":  'Автоматизация "Р"',
    "auto-rj": 'Автоматизация "Рь"',
    "auto-sch":'Автоматизация "Щ"',
    "auto-zh": 'Автоматизация "Ж"',
    "auto-s":  'Автоматизация "С"',
    "auto-sj": 'Автоматизация "Сь"',
    "auto-l":  'Автоматизация "Л"',
    "auto-lj": 'Автоматизация "Ль"',
    "auto-z":  'Автоматизация "З"',
    "auto-zj": 'Автоматизация "Зь"',
    "auto-sh": 'Автоматизация "Ш"',
    "auto-h":  'Автоматизация "Х"',
    "auto-g":  'Автоматизация "Г"',
    "auto-k":  'Автоматизация "К"',
    "diff-s-sj":  'Дифференциация "С-Сь"',
    "diff-s-z":   'Дифференциация "С-З"',
    "diff-z-zj":  'Дифференциация "З-Зь"',
    "diff-s-c":   'Дифференциация "С-Ц"',
    "diff-s-sh":  'Дифференциация "С-Ш"',
    "diff-sh-zh": 'Дифференциация "Ш-Ж"',
    "diff-z-zh":  'Дифференциация "З-Ж"',
    "diff-sj-sch":'Дифференциация "Сь-Щ"',
    "diff-ch-sch":'Дифференциация "Ч-Щ"',
    "diff-r-rj":  'Дифференциация "Р-Рь"',
    "diff-l-r":   'Дифференциация "Л-Р"',
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

def calc_streak(session_dates: list) -> int:
    if not session_dates:
        return 0
    unique_days = sorted(set(d.date() if isinstance(d, datetime) else d for d in session_dates), reverse=True)
    today = date.today()
    streak = 0
    expected = today
    for d in unique_days:
        if d == expected:
            streak += 1
            expected = expected - timedelta(days=1)
        elif d < expected:
            break
    return streak

def format_duration(seconds: int) -> str:
    if seconds < 60:
        return f"{seconds} сек"
    m = seconds // 60
    s = seconds % 60
    return f"{m} мин {s} сек" if s else f"{m} мин"

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    path = event.get("path", "/")
    token = event.get("headers", {}).get("X-Auth-Token", "")

    conn = get_conn()
    user_id = get_user_id(conn, token)

    if not user_id:
        conn.close()
        return {"statusCode": 401, "headers": CORS,
                "body": json.dumps({"error": "Требуется авторизация"})}

    with conn.cursor() as cur:
        # Все сессии пользователя
        cur.execute("""
            SELECT id, game_filename, game_title, game_emoji, category, started_at, duration_seconds
            FROM game_sessions
            WHERE user_id = %s
            ORDER BY started_at DESC
        """, (user_id,))
        rows = cur.fetchall()

    conn.close()

    sessions = [
        {
            "id": r[0],
            "filename": r[1],
            "title": r[2],
            "emoji": r[3],
            "category": r[4],
            "category_label": CATEGORY_LABELS.get(r[4], r[4]),
            "started_at": r[5].isoformat(),
            "duration_seconds": r[6] or 0,
        }
        for r in rows
    ]

    # Статистика по категориям
    cat_stats = {}
    for s in sessions:
        cat = s["category"]
        if cat not in cat_stats:
            cat_stats[cat] = {"category": cat, "label": s["category_label"], "sessions": 0, "total_seconds": 0, "games": set()}
        cat_stats[cat]["sessions"] += 1
        cat_stats[cat]["total_seconds"] += s["duration_seconds"]
        cat_stats[cat]["games"].add(s["filename"])

    categories = []
    for c in cat_stats.values():
        categories.append({
            "category": c["category"],
            "label": c["label"],
            "sessions": c["sessions"],
            "total_seconds": c["total_seconds"],
            "unique_games": len(c["games"]),
        })
    categories.sort(key=lambda x: x["sessions"], reverse=True)

    # Streak
    dates = [datetime.fromisoformat(s["started_at"]) for s in sessions]
    streak = calc_streak(dates)

    # Общая статистика
    total_sessions = len(sessions)
    total_seconds = sum(s["duration_seconds"] for s in sessions)
    unique_games = len(set(s["filename"] for s in sessions))
    unique_cats = len(cat_stats)

    # Отчёт
    if path.endswith("/report"):
        lines = ["📊 Отчёт по занятиям (ЛогоДети)", ""]
        lines.append(f"Всего занятий: {total_sessions}")
        lines.append(f"Уникальных игр: {unique_games}")
        lines.append(f"Проработано разделов: {unique_cats}")
        lines.append(f"Общее время: {format_duration(total_seconds)}")
        lines.append(f"Серия дней: {streak} 🔥")
        lines.append("")
        lines.append("📂 По разделам:")
        for c in categories:
            lines.append(f"  • {c['label']}: {c['sessions']} занятий, {format_duration(c['total_seconds'])}")
        lines.append("")
        lines.append("📋 Последние 20 занятий:")
        for s in sessions[:20]:
            dt = datetime.fromisoformat(s["started_at"]).strftime("%d.%m.%Y %H:%M")
            dur = format_duration(s["duration_seconds"])
            lines.append(f"  {s['emoji']} {s['title']} — {dt} ({dur})")
        return {"statusCode": 200, "headers": CORS,
                "body": json.dumps({"report": "\n".join(lines)})}

    return {"statusCode": 200, "headers": CORS, "body": json.dumps({
        "total_sessions": total_sessions,
        "total_seconds": total_seconds,
        "unique_games": unique_games,
        "unique_categories": unique_cats,
        "streak": streak,
        "categories": categories,
        "sessions": sessions[:100],
    })}
