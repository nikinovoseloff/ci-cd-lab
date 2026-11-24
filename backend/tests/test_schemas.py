import pytest
from pydantic import ValidationError

from app.schemas import TaskCreate


def test_title_is_trimmed():
    assert TaskCreate(title="  buy milk  ").title == "buy milk"


def test_blank_title_rejected():
    with pytest.raises(ValidationError):
        TaskCreate(title="   ")


def test_too_long_title_rejected():
    with pytest.raises(ValidationError):
        TaskCreate(title="x" * 201)


def test_valid_title_accepted():
    assert TaskCreate(title="x" * 200).title == "x" * 200
