from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("attendance", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql=[
                        "DROP TABLE IF EXISTS attendance_attendance;",
                        """
                        CREATE TABLE attendance_attendance (
                            id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                            date date NOT NULL,
                            status varchar(20) NOT NULL,
                            arrival_time time NULL,
                            reason text NOT NULL,
                            created_at datetime NOT NULL,
                            updated_at datetime NOT NULL,
                            student_id bigint NOT NULL
                                REFERENCES accounts_user (id)
                                DEFERRABLE INITIALLY DEFERRED
                        );
                        """,
                    ],
                    reverse_sql=["DROP TABLE IF EXISTS attendance_attendance;"],
                ),
            ],
            state_operations=[
                migrations.RemoveField(model_name="attendance", name="school_class"),
                migrations.RemoveField(model_name="attendance", name="justification"),
                migrations.RemoveField(model_name="attendance", name="recorded_by"),
                migrations.AlterField(
                    model_name="attendance",
                    name="student",
                    field=models.ForeignKey(
                        limit_choices_to={"role": "ELEVE"},
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="attendances",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                migrations.AlterField(
                    model_name="attendance",
                    name="status",
                    field=models.CharField(
                        choices=[
                            ("PRESENT", "Présent"),
                            ("ABSENT", "Absent"),
                            ("RETARD", "Retard"),
                            ("JUSTIFIE", "Absence justifiée"),
                        ],
                        default="PRESENT",
                        max_length=20,
                    ),
                ),
                migrations.AlterField(
                    model_name="attendance",
                    name="date",
                    field=models.DateField(),
                ),
                migrations.AlterField(
                    model_name="attendance",
                    name="arrival_time",
                    field=models.TimeField(blank=True, null=True),
                ),
                migrations.AlterField(
                    model_name="attendance",
                    name="reason",
                    field=models.TextField(blank=True),
                ),
                migrations.RemoveConstraint(
                    model_name="attendance",
                    name="unique_attendance_student_date",
                ),
                migrations.AlterUniqueTogether(
                    name="attendance",
                    unique_together={("student", "date")},
                ),
                migrations.AlterModelOptions(
                    name="attendance",
                    options={"ordering": ["-date", "student__last_name"]},
                ),
            ],
        ),
    ]
