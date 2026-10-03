from django.contrib.auth import authenticate
from rest_framework import serializers

from apps.students.models import Student

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "telephone",
            "photo",
            "role",
            "date_creation",
            "is_staff",
        ]

        read_only_fields = [
            "id",
            "date_creation",
            "is_staff",
        ]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(
        write_only=True,
        required=False,
    )
    new_password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
    )
    new_password_confirmation = serializers.CharField(
        write_only=True,
        required=False,
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "telephone",
            "current_password",
            "new_password",
            "new_password_confirmation",
        ]

    def validate_username(self, value):
        if User.objects.filter(username=value).exclude(
            pk=self.instance.pk
        ).exists():
            raise serializers.ValidationError(
                "Ce nom d'utilisateur est déjà utilisé."
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(
            pk=self.instance.pk
        ).exists():
            raise serializers.ValidationError(
                "Cette adresse email est déjà utilisée."
            )
        return value.lower().strip()

    def validate(self, attrs):
        new_password = attrs.get("new_password")
        confirmation = attrs.get("new_password_confirmation")

        if new_password or confirmation:
            if not attrs.get("current_password"):
                raise serializers.ValidationError({
                    "current_password": (
                        "Le mot de passe actuel est obligatoire."
                    ),
                })
            if not self.instance.check_password(
                attrs["current_password"]
            ):
                raise serializers.ValidationError({
                    "current_password": (
                        "Le mot de passe actuel est incorrect."
                    ),
                })
            if new_password != confirmation:
                raise serializers.ValidationError({
                    "new_password_confirmation": (
                        "Les mots de passe ne correspondent pas."
                    ),
                })

        return attrs

    def update(self, instance, validated_data):
        validated_data.pop(
            "current_password",
            None,
        )
        new_password = validated_data.pop(
            "new_password",
            None,
        )
        validated_data.pop(
            "new_password_confirmation",
            None,
        )

        for field, value in validated_data.items():
            setattr(instance, field, value)

        if new_password:
            instance.set_password(new_password)

        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    password_confirmation = serializers.CharField(
        write_only=True,
    )

    class Meta:

        model = User

        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "telephone",
            "password",
            "password_confirmation",
        ]

    def validate_email(self, value):

        value = value.lower().strip()

        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Cette adresse email est déjà utilisée."
            )

        return value

    def validate(self, attrs):

        if (
            attrs["password"]
            != attrs["password_confirmation"]
        ):

            raise serializers.ValidationError(
                {
                    "password_confirmation":
                    "Les mots de passe ne correspondent pas."
                }
            )

        return attrs

    def create(self, validated_data):

        validated_data.pop(
            "password_confirmation"
        )

        password = validated_data.pop(
            "password"
        )

        user = User(
            **validated_data
        )

        user.role = User.Role.ELEVE

        user.set_password(
            password
        )

        user.save()

        return user


class LoginSerializer(serializers.Serializer):

    role = serializers.ChoiceField(
        choices=[
            User.Role.ADMIN,
            User.Role.ENSEIGNANT,
            User.Role.ELEVE,
        ],
        required=False,
    )

    username = serializers.CharField(required=False)
    password = serializers.CharField(
        required=False,
        write_only=True,
    )
    matricule = serializers.CharField(required=False)
    date_naissance = serializers.DateField(required=False)

    def validate(self, attrs):

        role = attrs.get("role")
        matricule = attrs.get("matricule", "").strip()
        date_naissance = attrs.get("date_naissance")

        if matricule or date_naissance:
            if not matricule or not date_naissance:
                raise serializers.ValidationError(
                    "Le matricule et la date de naissance sont obligatoires."
                )

            try:
                student = Student.objects.select_related("user").get(
                    matricule=matricule,
                    date_naissance=date_naissance,
                )
            except Student.DoesNotExist:
                raise serializers.ValidationError(
                    "Matricule ou date de naissance incorrect."
                )

            user = student.user

            if role and role != User.Role.ELEVE:
                raise serializers.ValidationError(
                    "Ces identifiants sont réservés aux élèves."
                )
        else:
            username = attrs.get("username", "").strip()
            password = attrs.get("password", "")

            if not username or not password:
                raise serializers.ValidationError(
                    "Le nom d'utilisateur et le mot de passe sont obligatoires."
                )

            user = authenticate(
                username=username,
                password=password,
            )

        if not user:
            raise serializers.ValidationError(
                "Nom d'utilisateur ou mot de passe incorrect."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "Ce compte est désactivé."
            )

        if (
            role == User.Role.ADMIN
            and (user.is_staff or user.is_superuser)
            and user.role != User.Role.ADMIN
        ):
            user.role = User.Role.ADMIN
            user.save(update_fields=["role"])

        if (
            role
            and user.role != role
            and not (
                role == User.Role.ADMIN
                and (user.is_staff or user.is_superuser)
            )
        ):
            raise serializers.ValidationError(
                "Ce compte ne correspond pas au profil sélectionné."
            )

        attrs["user"] = user

        return attrs
