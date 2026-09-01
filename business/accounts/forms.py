from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class RegisterForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class EForm(RegisterForm):
    pass

from django import forms
from django.contrib.auth.models import User
from .models import Employee


class EmployeeForm(forms.ModelForm):

    username = forms.CharField()
    password = forms.CharField(
        widget=forms.PasswordInput
    )


    class Meta:
        model = Employee
        fields = [
            'username',
            'password',
            'employee_id',
            'department',
            'phone'
        ]


    def save(self, commit=True):

        employee = super().save(commit=False)

        user = User.objects.create_user(
            username=self.cleaned_data['username'],
            password=self.cleaned_data['password']
        )

        employee.user = user

        if commit:
            employee.save()

        return employee