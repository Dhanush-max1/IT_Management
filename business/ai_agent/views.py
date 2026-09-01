import os

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from google import genai

from assets.models import Asset
from inventory.models import InventoryItem
from accounts.models import Employee
from assignments.models import Assignment
from repairs.models import RepairTicket


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ai_agent(request):

    prompt = request.data.get("prompt")

    if not prompt:
        return Response(
            {
                "success": False,
                "error": "Please enter the prompt"
            },
            status=400
        )

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return Response(
            {
                "success": False,
                "error": "Gemini API key not configured"
            },
            status=500
        )

    try:

        # =========================
        # ASSETS
        # =========================

        assets = Asset.objects.all()

        asset_data = [
            {
                "id": asset.id,
                "name": asset.name,
                "asset_type": asset.asset_type,
                "serial_number": asset.serial_number,
                "status": asset.status,
                "purchase_date": str(asset.purchase_date),
            }
            for asset in assets
        ]

        # =========================
        # INVENTORY
        # =========================

        inventory = InventoryItem.objects.all()

        inventory_data = [
            {
                "id": item.id,
                "item_name": item.item_name,
                "quantity": item.quantity,
                "threshold": item.threshold,
            }
            for item in inventory
        ]

        # =========================
        # EMPLOYEES
        # =========================

        employees = Employee.objects.select_related("user").all()

        employee_data = [
            {
                "id": employee.id,
                "username": employee.user.username,
                "employee_id": employee.employee_id,
                "department": employee.department,
                "phone": employee.phone,
            }
            for employee in employees
        ]

        # =========================
        # ASSIGNMENTS
        # =========================

        assignments = Assignment.objects.select_related(
            "employee__user",
            "asset"
        ).all()

        assignment_data = [
            {
                "id": assignment.id,
                "employee": assignment.employee.user.username,
                "employee_id": assignment.employee.employee_id,
                "asset": assignment.asset.name,
                "serial_number": assignment.asset.serial_number,
                "date_assigned": str(assignment.date_assigned),
                "date_returned": (
                    str(assignment.date_returned)
                    if assignment.date_returned
                    else None
                ),
                "status": assignment.status,
            }
            for assignment in assignments
        ]

        # =========================
        # REPAIR TICKETS
        # =========================

        repair_tickets = RepairTicket.objects.select_related(
            "asset",
            "employee__user"
        ).all()

        repair_data = [
            {
                "id": ticket.id,
                "asset": ticket.asset.name,
                "serial_number": ticket.asset.serial_number,
                "employee": ticket.employee.user.username,
                "employee_id": ticket.employee.employee_id,
                "issue": ticket.issue,
                "status": ticket.status,
                "assigned_technician": ticket.assigned_technician,
            }
            for ticket in repair_tickets
        ]

        # =========================
        # DATABASE CONTEXT
        # =========================

        database_context = f"""
You are an AI assistant for an IT Asset Management System.

Answer the user's question using ONLY the database information provided below.

If the requested information is not present in the database, clearly say that the information is not available.

Do not invent assets, employees, inventory items, assignments, or repair tickets.

DATABASE INFORMATION:

ASSETS:
{asset_data}

INVENTORY:
{inventory_data}

EMPLOYEES:
{employee_data}

ASSIGNMENTS:
{assignment_data}

REPAIR TICKETS:
{repair_data}

USER QUESTION:
{prompt}
"""

        # =========================
        # GEMINI
        # =========================

        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=database_context,
        )

        return Response(
            {
                "success": True,
                "reply": response.text,
            },
            status=200,
        )

    except Exception as e:

        print("AI AGENT ERROR:", repr(e))

        return Response(
            {
                "success": False,
                "error": str(e),
            },
            status=500,
        )