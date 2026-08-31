from datetime import datetime
from extensions import db, bcrypt

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(120),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False
    )

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(
            self.password_hash,
            password
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
        }

class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    location = db.Column(
        db.String(255),
        nullable=False
    )

    latitude = db.Column(
        db.Float,
        nullable=False
    )

    longitude = db.Column(
        db.Float,
        nullable=False
    )

    image_url = db.Column(
        db.String(500),
        nullable=True
        )

    landlord_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    units = db.relationship(
        "Unit",
        backref="property",
        lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "landlord_id": self.landlord_id,
            "image_url": self.image_url,
        }

class Unit(db.Model):
    __tablename__ = "units"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    unit_number = db.Column(
        db.String(50),
        nullable=False
    )

    monthly_rent = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    property_id = db.Column(
        db.Integer,
        db.ForeignKey("properties.id"),
        nullable=False
    )

    def to_dict(self):
        active_lease = next(
            (
                lease
                for lease in self.leases
                if lease.status == "active"
            ),
            None
        )

        return {
            "id": self.id,
            "unit_number": self.unit_number,
            "monthly_rent": float(self.monthly_rent),
            "property_id": self.property_id,
            "status": "occupied" if active_lease else "vacant"
        }


class Lease(db.Model):
    __tablename__ = "leases"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    unit_id = db.Column(
        db.Integer,
        db.ForeignKey("units.id"),
        nullable=False
    )

    start_date = db.Column(
        db.Date,
        nullable=False
    )

    end_date = db.Column(
        db.Date,
        nullable=True
    )

    monthly_rent = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="active"
    )

    tenant = db.relationship(
        "User",
        backref="leases"
    )

    unit = db.relationship(
        "Unit",
        backref="leases"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "tenant_name": self.tenant.name if self.tenant else None,
            "unit_id": self.unit_id,
            "unit_number": self.unit.unit_number if self.unit else None,
            "start_date": self.start_date.isoformat(),
            "end_date": (
                self.end_date.isoformat()
                if self.end_date else None
            ),
            "monthly_rent": float(self.monthly_rent),
            "status": self.status
        }

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    lease_id = db.Column(
        db.Integer,
        db.ForeignKey("leases.id"),
        nullable=False
    )

    amount = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    payment_date = db.Column(
        db.Date,
        nullable=False
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="paid"
    )

    reference = db.Column(
        db.String(100),
        nullable=True
    )

    lease = db.relationship(
        "Lease",
        backref=db.backref(
            "payments",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "lease_id": self.lease_id,
            "amount": float(self.amount),
            "payment_date": self.payment_date.isoformat(),
            "status": self.status,
            "reference": self.reference
        }

class Notice(db.Model):
    __tablename__ = "notices"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    property_id = db.Column(
        db.Integer,
        db.ForeignKey("properties.id"),
        nullable=False
    )

    property = db.relationship(
        "Property",
        backref=db.backref(
            "notices",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "created_at": self.created_at.isoformat(),
            "property_id": self.property_id
        }

class MaintenanceTicket(db.Model):
    __tablename__ = "maintenance_tickets"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="pending"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    unit_id = db.Column(
        db.Integer,
        db.ForeignKey("units.id"),
        nullable=False
    )

    tenant = db.relationship(
        "User",
        backref=db.backref(
            "maintenance_tickets",
            lazy=True
        )
    )

    unit = db.relationship(
        "Unit",
        backref=db.backref(
            "maintenance_tickets",
            lazy=True
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "tenant_id": self.tenant_id,
            "tenant_name": self.tenant.name if self.tenant else None,
            "unit_id": self.unit_id,
            "unit_number": self.unit.unit_number if self.unit else None,
    }

class EndOfStay(db.Model):
    __tablename__ = "end_of_stays"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    lease_id = db.Column(
        db.Integer,
        db.ForeignKey("leases.id"),
        nullable=False
    )

    move_out_date = db.Column(
        db.Date,
        nullable=False
    )

    reason = db.Column(
        db.String(255),
        nullable=True
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="submitted"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    lease = db.relationship(
        "Lease",
        backref=db.backref(
            "end_of_stays",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "lease_id": self.lease_id,
            "move_out_date": self.move_out_date.isoformat(),
            "reason": self.reason,
            "notes": self.notes,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
