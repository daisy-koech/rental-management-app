"""add mpesa payment fields

Revision ID: ca4ef25b94a7
Revises: 8e774c3841fe
Create Date: 2026-09-18
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "ca4ef25b94a7"
down_revision = "8e774c3841fe"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "payments",
        sa.Column(
            "payment_method",
            sa.String(length=30),
            nullable=False,
            server_default="manual"
        )
    )

    op.add_column(
        "payments",
        sa.Column(
            "phone_number",
            sa.String(length=20),
            nullable=True
        )
    )

    op.add_column(
        "payments",
        sa.Column(
            "checkout_request_id",
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(
        "payments",
        sa.Column(
            "merchant_request_id",
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(
        "payments",
        sa.Column(
            "mpesa_receipt_number",
            sa.String(length=100),
            nullable=True
        )
    )


def downgrade():
    op.drop_column(
        "payments",
        "mpesa_receipt_number"
    )

    op.drop_column(
        "payments",
        "merchant_request_id"
    )

    op.drop_column(
        "payments",
        "checkout_request_id"
    )

    op.drop_column(
        "payments",
        "phone_number"
    )

    op.drop_column(
        "payments",
        "payment_method"
    )