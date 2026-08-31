from flask import request, session
from datetime import date
from extensions import db
from models import User, Property, Unit, Lease, Payment, Notice, MaintenanceTicket, EndOfStay


def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return None

    return db.session.get(User, user_id)


def signup():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([name, email, password, role]):
        return {
            "error": "Name, email, password and role are required"
        }, 400

    if role not in ["landlord", "tenant"]:
        return {
            "error": "Role must be landlord or tenant"
        }, 400

    if User.query.filter_by(email=email).first():
        return {
            "error": "Email already registered"
        }, 409

    user = User(
        name=name,
        email=email,
        role=role
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    session["user_id"] = user.id

    return user.to_dict(), 201


def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {
            "error": "Email and password are required"
        }, 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return {
            "error": "Invalid email or password"
        }, 401

    session["user_id"] = user.id

    return user.to_dict(), 200


def check_session():
    user = get_current_user()

    if not user:
        return {
            "error": "Not logged in"
        }, 401

    return user.to_dict(), 200

def logout():
    session.clear()
    return {}, 204


def property_routes(app):

    @app.route("/property", methods=["POST"])
    def create_property():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {"error": "Only landlords can manage the property"}, 403

        existing_property = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if existing_property:
            return {"error": "Property already exists"}, 409

        data = request.get_json() or {}

        name = data.get("name")
        location = data.get("location")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        image_url = data.get("image_url")

        if not name or not location or latitude is None or longitude is None:
            return {
                "error": "Property name, location, latitude and longitude are required"
            }, 400

        PROPERTY = Property(
            name=name,
            location=location,
            latitude=latitude,
            longitude=longitude,
            image_url=image_url,
            landlord_id=user.id,
        )

        db.session.add(PROPERTY)
        db.session.commit()

        return PROPERTY.to_dict(), 201

    @app.route("/property", methods=["GET"])
    def get_property():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can view the property"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {
                "error": "Property not found",
                "debug_user_id": user.id,
                "debug_user_email": user.email,
                "debug_user_role": user.role
            }, 404
        
        return PROPERTY.to_dict(), 200

    @app.route("/property", methods=["PATCH"])
    def update_property():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can update the property"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        data = request.get_json() or {}

        if "name" in data:
            PROPERTY.name = data["name"]

        if "location" in data:
            PROPERTY.location = data["location"]

        if "latitude" in data:
            PROPERTY.latitude = data["latitude"]

        if "longitude" in data:
            PROPERTY.longitude = data["longitude"]

        if "image_url" in data:
            PROPERTY.image_url = data["image_url"]

        db.session.commit()

        return PROPERTY.to_dict(), 200

    @app.route("/property/tenants", methods=["GET"])
    def get_tenants():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can view tenants"
            }, 403

        tenants = User.query.filter_by(role="tenant").all()

        return {
            "tenants": [tenant.to_dict() for tenant in tenants]
        }, 200

    @app.route("/property/public", methods=["GET"])
    def get_public_property():
        PROPERTY = Property.query.first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        return PROPERTY.to_dict(), 200
        
    @app.route("/property/units", methods=["GET"])
    def get_units():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can manage units"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        return {
            "units": [
                unit.to_dict()
                for unit in PROPERTY.units
            ]
        }, 200


    @app.route("/property/units", methods=["POST"])
    def create_unit():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can create units"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        data = request.get_json() or {}

        unit_number = data.get("unit_number")
        monthly_rent = data.get("monthly_rent")

        if not unit_number or monthly_rent is None:
            return {
                "error": "Unit number and monthly rent are required"
            }, 400

        unit = Unit(
            unit_number=unit_number,
            monthly_rent=monthly_rent,
            property_id=PROPERTY.id
        )

        db.session.add(unit)
        db.session.commit()

        return unit.to_dict(), 201

    @app.route("/property/units/<int:id>", methods=["PATCH"])
    def update_unit(id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can update units"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        unit = Unit.query.filter_by(
            id=id,
            property_id=PROPERTY.id
        ).first()

        if not unit:
            return {"error": "Unit not found"}, 404

        data = request.get_json() or {}

        if "unit_number" in data:
            unit.unit_number = data["unit_number"]

        if "monthly_rent" in data:
            unit.monthly_rent = data["monthly_rent"]

        db.session.commit()

        return unit.to_dict(), 200


    @app.route("/property/units/<int:id>", methods=["DELETE"])
    def delete_unit(id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can delete units"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        unit = Unit.query.filter_by(
            id=id,
            property_id=PROPERTY.id
        ).first()

        if not unit:
            return {"error": "Unit not found"}, 404

        db.session.delete(unit)
        db.session.commit()

        return {}, 204

    @app.route("/property/units/<int:unit_id>/leases", methods=["POST"])
    def create_lease(unit_id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can create leases"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        unit = Unit.query.filter_by(
            id=unit_id,
            property_id=PROPERTY.id
        ).first()

        if not unit:
            return {"error": "Unit not found"}, 404

        data = request.get_json() or {}

        tenant_id = data.get("tenant_id")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not tenant_id or not start_date:
            return {
                "error": "Tenant and start date are required"
            }, 400

        try:
            start_date = date.fromisoformat(start_date)

            if end_date:
                end_date = date.fromisoformat(end_date)

        except ValueError:
            return {
                "error": "Dates must use YYYY-MM-DD format"
            }, 400

        tenant = User.query.filter_by(
            id=tenant_id,
            role="tenant"
        ).first()

        if not tenant:
            return {
                "error": "Tenant not found"
            }, 404

        lease = Lease(
            tenant_id=tenant.id,
            unit_id=unit.id,
            start_date=start_date,
            end_date=end_date,
            monthly_rent=unit.monthly_rent,
            status="active"
        )

        db.session.add(lease)
        db.session.commit()

        return lease.to_dict(), 201

    @app.route("/property/leases", methods=["GET"])
    def get_property_leases():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can view property leases"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        leases = (
            Lease.query
            .join(Unit)
            .filter(Unit.property_id == PROPERTY.id)
            .all()
        )

        return {
            "leases": [
                lease.to_dict()
                for lease in leases
            ]
        }, 200

    
# tenant + lease
    @app.route("/my-lease", methods=["GET"])
    def get_my_lease():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "tenant":
            return {
                "error": "Only tenants can view their lease"
            }, 403

        lease = Lease.query.filter_by(
            tenant_id=user.id,
            status="active"
        ).first()

        if not lease:
            return {
                "error": "No active lease found"
            }, 404

        return lease.to_dict(), 200

    @app.route("/property/leases/<int:lease_id>", methods=["PATCH"])
    def update_lease(lease_id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can update leases"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        lease = (
            Lease.query
            .join(Unit)
            .filter(
                Lease.id == lease_id,
                Unit.property_id == PROPERTY.id
            )
            .first()
        )

        if not lease:
            return {"error": "Lease not found"}, 404

        data = request.get_json() or {}

        if "start_date" in data:
            try:
                lease.start_date = date.fromisoformat(
                    data["start_date"]
                )
            except ValueError:
                return {
                    "error": "Start date must use YYYY-MM-DD format"
                }, 400

        if "end_date" in data:
            try:
                lease.end_date = (
                    date.fromisoformat(data["end_date"])
                    if data["end_date"]
                    else None
                )
            except ValueError:
                return {
                    "error": "End date must use YYYY-MM-DD format"
                }, 400

        if "status" in data:
            if data["status"] not in ["active", "ended"]:
                return {
                    "error": "Status must be active or ended"
                }, 400

            lease.status = data["status"]

        db.session.commit()

        return lease.to_dict(), 200

    @app.route("/property/leases/<int:lease_id>", methods=["DELETE"])
    def delete_lease(lease_id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can delete leases"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        lease = (
            Lease.query
            .join(Unit)
            .filter(
                Lease.id == lease_id,
                Unit.property_id == PROPERTY.id
            )
            .first()
        )

        if not lease:
            return {"error": "Lease not found"}, 404

        db.session.delete(lease)
        db.session.commit()

        return {}, 204

# landlord + payments
    @app.route("/property/payments", methods=["GET"])
    def get_property_payments():
        user = get_current_user()
        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {"error": "Only landlords can view property payments"}, 403

        PROPERTY = Property.query.filter_by (
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return{"error": "Property not found"}, 404

        payments = (
            Payment.query
            .join(Lease)
            .join(Unit)
            .filter(Unit.property_id == PROPERTY.id).all()
        )

        return {
            "payments": [
                payment.to_dict()
                for payment in payments
            ]
        }, 200

    @app.route("/property/payments", methods=["POST"])
    def create_property_payment():
        user = get_current_user()
        if not user:
            return {
                "error": "Unauthorized"
            }, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can create payments"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()


        if not PROPERTY:
            return {
                "error": "Property not found"
            }, 404

        data = request.get_json() or {}

        lease_id = data.get("lease_id")
        amount = data.get("amount")
        payment_date = data.get("payment_date")
        status = data.get("status", "paid")
        reference = data.get("reference")

        if not lease_id or amount is None or not payment_date:
            return {
                "error": "Lease, amount and payment date are required"
            }, 400

        lease = (
            Lease.query
            .join(Unit)
            .filter(
            Lease.id == lease_id,
            Unit.property_id == PROPERTY.id
            ).first()
        )

        if not lease:
            return {
                "error": "Lease not found"
            }, 404

        try:
            payment_date = date.fromisoformat(payment_date)
        except ValueError:
            return {
                "error": "Payment date must use YYYY-MM-DD format"
            }, 400

        payment = Payment(
            lease_id=lease.id,
            amount=amount,
            payment_date=payment_date,
            status=status,
            reference=reference
        )

        db.session.add(payment)
        db.session.commit()

        return payment.to_dict(), 201

    @app.route("/property/payments/<int:payment_id>", methods=["PATCH"])
    def update_property_payment(payment_id):
        user = get_current_user()

        if not user:
            return {
                "error": "Unauthorized"
            }, 401

        if user.role != "landlord":
            return {
               "error": "Only landlords can update payments"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {
                "error": "Property not found"
            }, 404

        payment = (
            Payment.query
            .join(Lease)
            .join(Unit)
            .filter(
                Payment.id == payment_id,
                Unit.property_id == PROPERTY.id
            )
            .first()
        )

        if not payment:
            return {
                "error": "Payment not found"
            }, 404

        data = request.get_json() or {}

        if "amount" in data:
            payment.amount = data["amount"]

        if "status" in data:
            payment.status = data["status"]

        if "payment_date" in data:
            try:
                payment.payment_date = date.fromisoformat(
                    data["payment_date"]
                )
            except ValueError:
                return {
                    "error": "Payment date must use YYYY-MM-DD format"
                }, 400

        if "reference" in data:
            payment.reference = data["reference"]

        db.session.commit()

        return payment.to_dict(), 200

# tenants + payments
    @app.route("/my-payments", methods=["GET"])
    def get_my_payments():
        user = get_current_user()

        if not user:
            return {
                "error": "Unauthorized"
            }, 401

        if user.role != "tenant":
            return {
                "error": "Only tenants can view their payments"
            }, 403

        payments = (
            Payment.query
            .join(Lease)
            .filter(
                Lease.tenant_id == user.id
            )
            .all()
        )

        return {
            "payments": [
                payment.to_dict()
                for payment in payments
            ]
        }, 200 
    
#landlords + notices
    @app.route("/property/notices", methods=["POST"])
    def create_notice():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can create notices"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        data = request.get_json() or {}

        title = data.get("title")
        message = data.get("message")

        if not title or not message:
            return {
                "error": "Title and message are required"
            }, 400

        notice = Notice(
            title=title,
            message=message,
            property_id=PROPERTY.id
        )

        db.session.add(notice)
        db.session.commit()

        return notice.to_dict(), 201

    @app.route("/property/notices", methods=["GET"])
    def get_property_notices():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can view property notices"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        notices = Notice.query.filter_by(
            property_id=PROPERTY.id
        ).order_by(
            Notice.created_at.desc()
        ).all()

        return {
            "notices": [
                notice.to_dict()
                for notice in notices
            ]
        }, 200

    @app.route("/property/notices/<int:notice_id>", methods=["PATCH"])
    def update_notice(notice_id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can update notices"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        notice = Notice.query.filter_by(
            id=notice_id,
            property_id=PROPERTY.id
        ).first()

        if not notice:
            return {"error": "Notice not found"}, 404

        data = request.get_json() or {}

        if "title" in data:
            notice.title = data["title"]

        if "message" in data:
            notice.message = data["message"]

        db.session.commit()

        return notice.to_dict(), 200

    @app.route("/property/notices/<int:notice_id>", methods=["DELETE"])
    def delete_notice(notice_id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can delete notices"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        notice = Notice.query.filter_by(
            id=notice_id,
            property_id=PROPERTY.id
        ).first()

        if not notice:
            return {"error": "Notice not found"}, 404

        db.session.delete(notice)
        db.session.commit()

        return {}, 204

# tenants + notices
    @app.route("/my-notices", methods=["GET"])
    def get_my_notices():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "tenant":
            return {
                "error": "Only tenants can view their notices"
            }, 403

        lease = Lease.query.filter_by(
            tenant_id=user.id,
            status="active"
        ).first()

        if not lease:
            return {
                "error": "No active lease found"
            }, 404

        property_id = lease.unit.property_id

        notices = Notice.query.filter_by(
            property_id=property_id
        ).order_by(
            Notice.created_at.desc()
        ).all()

        return {
            "notices": [
                notice.to_dict()
                for notice in notices
            ]
        }, 200

# tenants + maintenance tickets
    @app.route("/maintenance-tickets", methods=["POST"])
    def create_maintenance_ticket():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "tenant":
            return {
                "error": "Only tenants can create maintenance tickets"
            }, 403

        lease = Lease.query.filter_by(
            tenant_id=user.id,
            status="active"
        ).first()

        if not lease:
            return {
                "error": "No active lease found"
            }, 404

        data = request.get_json() or {}

        title = data.get("title")
        description = data.get("description")

        if not title or not description:
            return {
                "error": "Title and description are required"
            }, 400

        ticket = MaintenanceTicket(
            title=title,
            description=description,
            status="pending",
            tenant_id=user.id,
            unit_id=lease.unit_id
        )

        db.session.add(ticket)
        db.session.commit()

        return ticket.to_dict(), 201

    @app.route("/my-maintenance-tickets", methods=["GET"])
    def get_my_maintenance_tickets():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "tenant":
            return {
                "error": "Only tenants can view their maintenance tickets"
            }, 403

        tickets = MaintenanceTicket.query.filter_by(
            tenant_id=user.id
        ).order_by(
            MaintenanceTicket.created_at.desc()
        ).all()

        return {
            "tickets": [
                ticket.to_dict()
                for ticket in tickets
            ]
        }, 200

# landlord + maintenance tickets
    @app.route("/property/maintenance-tickets", methods=["GET"])
    def get_property_maintenance_tickets():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can view property maintenance tickets"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        tickets = (
            MaintenanceTicket.query
            .join(Unit, MaintenanceTicket.unit_id == Unit.id)
            .filter(Unit.property_id == PROPERTY.id)
            .order_by(MaintenanceTicket.created_at.desc())
            .all()
        )

        return {
            "tickets": [
                ticket.to_dict()
                for ticket in tickets
            ]
        }, 200

    @app.route("/property/maintenance-tickets/<int:ticket_id>", methods=["PATCH"])
    def update_maintenance_ticket(ticket_id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can update maintenance tickets"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        ticket = (
            MaintenanceTicket.query
            .join(Unit, MaintenanceTicket.unit_id == Unit.id)
            .filter(
                MaintenanceTicket.id == ticket_id,
                Unit.property_id == PROPERTY.id
            )
            .first()
        )

        if not ticket:
            return {"error": "Maintenance ticket not found"}, 404

        data = request.get_json() or {}

        if "status" in data:
            if data["status"] not in [
                "pending",
                "in_progress",
                "resolved"
            ]:
                return {
                    "error": "Status must be pending, in_progress, or resolved"
                }, 400

            ticket.status = data["status"]

        db.session.commit()

        return ticket.to_dict(), 200

# tenant + end of stay
    @app.route("/end-of-stay", methods=["POST"])
    def create_end_of_stay():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "tenant":
            return {
                "error": "Only tenants can submit an end of stay form"
            }, 403

        lease = Lease.query.filter_by(
            tenant_id=user.id,
            status="active"
        ).first()

        if not lease:
            return {
                "error": "No active lease found"
            }, 404

        existing_request = EndOfStay.query.filter_by(
            lease_id=lease.id
        ).first()

        if existing_request:
            return {
                "error": "An end of stay form has already been submitted"
            }, 409

        data = request.get_json() or {}

        move_out_date = data.get("move_out_date")
        reason = data.get("reason")
        notes = data.get("notes")

        if not move_out_date:
            return {
                "error": "Move-out date is required"
            }, 400

        try:
            move_out_date = date.fromisoformat(move_out_date)
        except ValueError:
            return {
                "error": "Move-out date must use YYYY-MM-DD format"
            }, 400

        end_of_stay = EndOfStay(
            lease_id=lease.id,
            move_out_date=move_out_date,
            reason=reason,
            notes=notes,
            status="submitted"
        )

        db.session.add(end_of_stay)
        db.session.commit()

        return end_of_stay.to_dict(), 201

    @app.route("/my-end-of-stay", methods=["GET"])
    def get_my_end_of_stay():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "tenant":
            return {
                "error": "Only tenants can view their end of stay form"
            }, 403

        lease = Lease.query.filter_by(
            tenant_id=user.id,
            status="active"
        ).first()

        if not lease:
            return {
                "error": "No active lease found"
            }, 404

        end_of_stay = EndOfStay.query.filter_by(
            lease_id=lease.id
        ).first()

        if not end_of_stay:
            return {
                "error": "No end of stay form found"
            }, 404

        return end_of_stay.to_dict(), 200

# landlord + end of stay
    @app.route("/property/end-of-stay", methods=["GET"])
    def get_property_end_of_stay():
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can view end of stay forms"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        end_of_stays = (
            EndOfStay.query
            .join(Lease, EndOfStay.lease_id == Lease.id)
            .join(Unit, Lease.unit_id == Unit.id)
            .filter(Unit.property_id == PROPERTY.id)
            .order_by(EndOfStay.created_at.desc())
            .all()
        )

        return {
            "end_of_stays": [
                end_of_stay.to_dict()
                for end_of_stay in end_of_stays
            ]
        }, 200

    @app.route("/property/end-of-stay/<int:end_of_stay_id>", methods=["PATCH"])
    def update_end_of_stay(end_of_stay_id):
        user = get_current_user()

        if not user:
            return {"error": "Unauthorized"}, 401

        if user.role != "landlord":
            return {
                "error": "Only landlords can update end of stay forms"
            }, 403

        PROPERTY = Property.query.filter_by(
            landlord_id=user.id
        ).first()

        if not PROPERTY:
            return {"error": "Property not found"}, 404

        end_of_stay = (
            EndOfStay.query
            .join(Lease, EndOfStay.lease_id == Lease.id)
            .join(Unit, Lease.unit_id == Unit.id)
            .filter(
                EndOfStay.id == end_of_stay_id,
                Unit.property_id == PROPERTY.id
            )
            .first()
        )

        if not end_of_stay:
            return {
                "error": "End of stay form not found"
            }, 404

        data = request.get_json() or {}

        if "status" not in data:
            return {
                "error": "Status is required"
            }, 400

        if data["status"] not in [
            "submitted",
            "reviewed",
            "completed"
        ]:
            return {
                "error": "Status must be submitted, reviewed, or completed"
            }, 400

        end_of_stay.status = data["status"]

        db.session.commit()

        return end_of_stay.to_dict(), 200


def register_routes(app):
    app.add_url_rule(
        "/signup",
        view_func=signup,
        methods=["POST"]
    )

    app.add_url_rule(
        "/login",
        view_func=login,
        methods=["POST"]
    )

    app.add_url_rule(
        "/check-session",
        view_func=check_session,
        methods=["GET"]
    )

    app.add_url_rule(
        "/logout",
        view_func=logout,
        methods=["DELETE"]
    )
    property_routes(app)




