from dotenv import load_dotenv
load_dotenv()

from app import app
from extensions import db
from models import (
    User,
    Property,
    Unit,
    Lease,
    Notice,
    MaintenanceTicket,
)


with app.app_context():

    # Existing users
    landlord = db.session.get(User, 2)
    marion = db.session.get(User, 1)
    peter = db.session.get(User, 3)

    if not landlord:
        raise Exception("Landlord with ID 2 not found")

    if not marion:
        raise Exception("Tenant with ID 1 not found")

    if not peter:
        raise Exception("Tenant with ID 3 not found")

    print(f"Using landlord: {landlord.name}")
    print(f"Using tenant: {marion.name}")
    print(f"Using tenant: {peter.name}")

    # Existing property
    property = Property.query.filter_by(
        landlord_id=landlord.id
    ).first()

    if not property:
        property = Property(
            name="Cedar Apartments",
            location="Elgon View, Eldoret, Kenya",
            latitude=0.5036,
            longitude=35.2789,
            landlord_id=landlord.id
        )

        db.session.add(property)
        db.session.commit()

        print("Created Cedar Apartments")
    else:
        print("Cedar Apartments already exists")

    # Existing units
    units = Unit.query.filter_by(
        property_id=property.id
    ).order_by(Unit.id).all()

    if len(units) < 2:
        raise Exception("At least 2 units expected")

    unit_1 = units[0]
    unit_2 = units[1]

    print(
        f"Using units {unit_1.unit_number} "
        f"and {unit_2.unit_number}"
    )

    # Marion's existing lease
    marion_lease = Lease.query.filter_by(
        tenant_id=marion.id,
        unit_id=unit_1.id
    ).first()

    if marion_lease:
        print(
            f"Marion's existing lease found "
            f"(Lease #{marion_lease.id})"
        )
    else:
        print(
            "WARNING: Marion's existing lease was not found. "
            "No new lease will be created."
        )

    # Notices
    existing_notice = Notice.query.filter_by(
        property_id=property.id
    ).first()

    if existing_notice:
        print(
            f"Notice already exists "
            f"(Notice #{existing_notice.id})"
        )
    else:
        notice = Notice(
            title="Welcome to Cedar Apartments",
            message=(
                "Please keep shared areas clean and report "
                "any maintenance issues through the tenant dashboard."
            ),
            property_id=property.id
        )

        db.session.add(notice)
        print("Created welcome notice")

    # Maintenance ticket
    existing_ticket = MaintenanceTicket.query.filter_by(
        tenant_id=marion.id,
        unit_id=unit_1.id
    ).first()

    if existing_ticket:
        print(
            f"Maintenance ticket already exists "
            f"(Ticket #{existing_ticket.id})"
        )
    else:
        ticket = MaintenanceTicket(
            title="Leaking bathroom tap",
            description=(
                "The bathroom tap is leaking and needs to be checked."
            ),
            status="pending",
            tenant_id=marion.id,
            unit_id=unit_1.id
        )

        db.session.add(ticket)
        print("Created maintenance ticket")

    db.session.commit()
    print("Seed completed successfully!")