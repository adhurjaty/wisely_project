"""create inventories table

Revision ID: 09d944100740
Revises: 4abee4438017
Create Date: 2020-07-17 11:18:48.842882

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = '09d944100740'
down_revision = '4abee4438017'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'inventories',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=False),
        sa.Column('num_parties', sa.Integer(), nullable=False)
    )


def downgrade():
    op.drop_table('inventories')
