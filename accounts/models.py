# -*- coding: utf-8 -*-

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Administrateur"
        ENSEIGNANT = "ENSEIGNANT", "Enseignant"
        ELEVE = "ELEVE", "Eleve"
        PARENT = "PARENT", "Parent"

    email = models.EmailField(
        unique=True,
        verbose_name="Adresse email",
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.ELEVE,
        verbose_name="Role",
    )

    telephone = models.CharField(
        max_length=30,
        blank=True,
        verbose_name="Telephone",
    )

    photo = models.ImageField(
        upload_to="users/",
        blank=True,
        null=True,
        verbose_name="Photo",
    )

    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de creation",
    )

    date_modification = models.DateTimeField(
        auto_now=True,
        verbose_name="Derniere modification",
    )

    def __str__(self):
        nom = f"{self.first_name} {self.last_name}".strip()

        if nom:
            return f"{nom} - {self.email}"

        return self.email
