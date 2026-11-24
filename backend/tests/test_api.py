def test_health_ok(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "db": "ok"}


def test_health_reports_db_down(client, monkeypatch):
    monkeypatch.setattr("app.main.db_ok", lambda: False)
    r = client.get("/api/health")
    assert r.status_code == 503
    assert r.json() == {"status": "degraded", "db": "down"}


def test_create_and_list(client):
    created = client.post("/api/tasks", json={"title": "  first task  "})
    assert created.status_code == 201
    body = created.json()
    assert body["title"] == "first task"
    assert body["done"] is False

    listed = client.get("/api/tasks")
    assert listed.status_code == 200
    assert [t["id"] for t in listed.json()] == [body["id"]]


def test_toggle_and_delete(client):
    task_id = client.post("/api/tasks", json={"title": "task"}).json()["id"]

    patched = client.patch(f"/api/tasks/{task_id}", json={"done": True})
    assert patched.status_code == 200
    assert patched.json()["done"] is True

    assert client.delete(f"/api/tasks/{task_id}").status_code == 204
    assert client.delete(f"/api/tasks/{task_id}").status_code == 404


def test_missing_task_returns_404(client):
    assert client.patch("/api/tasks/999999", json={"done": True}).status_code == 404
    assert client.delete("/api/tasks/999999").status_code == 404


def test_blank_title_rejected(client):
    assert client.post("/api/tasks", json={"title": "   "}).status_code == 422


def test_malformed_json_rejected(client):
    r = client.post(
        "/api/tasks",
        content="{",
        headers={"Content-Type": "application/json"},
    )
    assert r.status_code == 422
