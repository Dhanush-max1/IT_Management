from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib import messages

from rest_framework import viewsets, serializers
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Employee
from .forms import EmployeeForm, EForm
from .serializers import EmployeeSerializer


# =========================
# API - REGISTER
# =========================

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )

        return user


class RegisterView(CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]



class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]


# =========================
# API - Employee Data
# =========================

@api_view(["GET"])
def employee_data(request):
    employees = Employee.objects.select_related("user").all()

    data = []

    for employee in employees:
        data.append({
            "id": employee.id,
            "username": employee.user.username,
            "employee_id": employee.employee_id,
            "department": employee.department,
            "phone": employee.phone,
        })

    return Response({
        "count": employees.count(),
        "employees": data
    })


# =========================
# LOGIN
# =========================

def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")

            user = authenticate(
                username=username,
                password=password
            )

            if user is not None:
                login(request, user)
                messages.info(
                    request,
                    f"You are now logged in as {username}."
                )
                return redirect("dashboard")

            else:
                messages.error(
                    request,
                    "Invalid username or password."
                )

        else:
            messages.error(
                request,
                "Invalid username or password."
            )

    else:
        form = AuthenticationForm()

    return render(
        request,
        "accounts/login.html",
        {"form": form}
    )


# =========================
# LOGOUT
# =========================

def logout_view(request):
    logout(request)

    messages.info(
        request,
        "You have successfully logged out."
    )

    return redirect("login")


# =========================
# DASHBOARD
# =========================

@login_required(login_url="login")
def dashboard(request):
    return render(
        request,
        "accounts/dashboard.html"
    )


# =========================
# REGISTER
# =========================

def register_view(request):

    if request.method == "POST":

        form = UserCreationForm(request.POST)

        if form.is_valid():

            user = form.save()

            login(request, user)

            return redirect("dashboard")

    else:

        form = UserCreationForm()

    return render(
        request,
        "accounts/register.html",
        {"form": form}
    )


# =========================
# ADD EMPLOYEE
# =========================

def add_employee(request):

    if request.method == "POST":

        form = EForm(request.POST)

        if form.is_valid():

            form.save()

            return redirect("employee_list")

    else:

        form = EForm()

    return render(
        request,
        "accounts/add_employee.html",
        {"form": form}
    )


# =========================
# EMPLOYEE LIST
# =========================

def employee_list(request):

    employees = Employee.objects.all()

    return render(
        request,
        "accounts/employee_list.html",
        {
            "employees": employees
        }
    )


# =========================
# EDIT EMPLOYEE
# =========================

def edit_employee(request, id):

    employee = get_object_or_404(
        Employee,
        id=id
    )

    if request.method == "POST":

        form = EmployeeForm(
            request.POST,
            instance=employee
        )

        if form.is_valid():

            form.save()

            return redirect("employee_list")

    else:

        form = EmployeeForm(
            instance=employee
        )

    return render(
        request,
        "accounts/edit_employee.html",
        {
            "form": form
        }
    )


# =========================
# DELETE EMPLOYEE
# =========================

def delete_employee(request, id):

    employee = get_object_or_404(
        Employee,
        id=id
    )

    if request.method == "POST":

        employee.delete()

        return redirect("employee_list")

    return render(
        request,
        "accounts/delete_employee.html",
        {
            "employee": employee
        }
    )