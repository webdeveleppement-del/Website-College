from rest_framework import serializers

from apps.accounts.models import User

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    account_first_name = serializers.CharField(write_only=True)
    account_last_name = serializers.CharField(write_only=True)
    account_email = serializers.EmailField(write_only=True)
    account_telephone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True,
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    telephone = serializers.CharField(
        source="user.telephone",
        read_only=True,
    )

    classe_name = serializers.CharField(
        source="classe.name",
        read_only=True,
    )

    class Meta:
        model = Student
        fields = [
            "id",
            "matricule",
            "first_name",
            "last_name",
            "email",
            "telephone",
            "date_naissance",
            "lieu_naissance",
            "sexe",
            "adresse",
            "classe",
            "classe_name",
            "date_inscription",
            "statut",
            "username",
            "password",
            "account_first_name",
            "account_last_name",
            "account_email",
            "account_telephone",
        ]
        read_only_fields = [
            "id",
            "date_inscription",
            "classe_name",
        ]

    def create(self, validated_data):
        username = validated_data.pop("username", "").strip()
        password = validated_data.pop("password", "")
        user_data = {
            "email": validated_data.pop("account_email"),
            "first_name": validated_data.pop("account_first_name"),
            "last_name": validated_data.pop("account_last_name"),
            "telephone": validated_data.pop("account_telephone", ""),
        }
        if not username or not password:
            raise serializers.ValidationError({
                "username": "Le nom d'utilisateur est obligatoire.",
                "password": "Le mot de passe est obligatoire.",
            })
        user = User(username=username, role=User.Role.ELEVE, **user_data)
        user.set_password(password)
        user.save()
        return Student.objects.create(user=user, **validated_data)
