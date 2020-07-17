"""create reservations table

Revision ID: 4abee4438017
Revises: 
Create Date: 2020-07-17 11:18:17.131955

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = '4abee4438017'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'reservations',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('email', sa.String(100)),
        sa.Column('time', sa.DateTime(), nullable=False),
        sa.Column('party_size', sa.Integer(), nullable=False)
    )


def downgrade():
    op.drop_table('reservations')
