from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("grades", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("subjects", "0001_initial"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql=[
                        "DROP TABLE IF EXISTS grades_grade;",
                        "DROP TABLE IF EXISTS grades_evaluation;",
                        """
                        CREATE TABLE grades_grade (
                            id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                            value decimal NOT NULL,
                            coefficient decimal NOT NULL,
                            assessment varchar(150) NOT NULL,
                            comment text NOT NULL,
                            date date NOT NULL,
                            created_at datetime NOT NULL,
                            updated_at datetime NOT NULL,
                            student_id bigint NOT NULL
                                REFERENCES accounts_user (id)
                                DEFERRABLE INITIALLY DEFERRED,
                            subject_id bigint NOT NULL
                                REFERENCES subjects_subject (id)
                                DEFERRABLE INITIALLY DEFERRED,
                            teacher_id bigint NULL
                                REFERENCES accounts_user (id)
                                DEFERRABLE INITIALLY DEFERRED
                        );
                        """,
                    ],
                    reverse_sql=[
                        "DROP TABLE IF EXISTS grades_grade;",
                        "DROP TABLE IF EXISTS grades_evaluation;",
                    ],
                ),
            ],
            state_operations=[
                migrations.RemoveField(
                    model_name="grade",
                    name="evaluation",
                ),
                migrations.RemoveField(
                    model_name="grade",
                    name="score",
                ),
                migrations.RemoveField(
                    model_name="grade",
                    name="date_creation",
                ),
                migrations.RemoveField(
                    model_name="grade",
                    name="date_modification",
                ),
                migrations.DeleteModel(name="Evaluation"),
                migrations.AlterField(
                    model_name="grade",
                    name="student",
                    field=models.ForeignKey(
                        limit_choices_to={"role": "ELEVE"},
                        on_delete=models.deletion.CASCADE,
                        related_name="grades",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Élève",
                    ),
                ),
                migrations.AddField(
                    model_name="grade",
                    name="subject",
                    field=models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="grades",
                        to="subjects.subject",
                        verbose_name="Matière",
                    ),
                ),
                migrations.AddField(
                    model_name="grade",
                    name="teacher",
                    field=models.ForeignKey(
                        blank=True,
                        limit_choices_to={"role": "ENSEIGNANT"},
                        null=True,
                        on_delete=models.deletion.SET_NULL,
                        related_name="given_grades",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Enseignant",
                    ),
                ),
                migrations.AddField(
                    model_name="grade",
                    name="value",
                    field=models.DecimalField(
                        decimal_places=2,
                        max_digits=5,
                        verbose_name="Note",
                    ),
                ),
                migrations.AddField(
                    model_name="grade",
                    name="coefficient",
                    field=models.DecimalField(
                        decimal_places=2,
                        default=1,
                        max_digits=5,
                        verbose_name="Coefficient",
                    ),
                ),
                migrations.AddField(
                    model_name="grade",
                    name="assessment",
                    field=models.CharField(
                        blank=True,
                        max_length=150,
                        verbose_name="Évaluation",
                    ),
                ),
                migrations.AddField(
                    model_name="grade",
                    name="date",
                    field=models.DateField(
                        auto_now_add=True,
                        verbose_name="Date",
                    ),
                ),
                migrations.AddField(
                    model_name="grade",
                    name="created_at",
                    field=models.DateTimeField(
                        auto_now_add=True,
                        verbose_name="Créé le",
                    ),
                ),
                migrations.AddField(
                    model_name="grade",
                    name="updated_at",
                    field=models.DateTimeField(
                        auto_now=True,
                        verbose_name="Modifié le",
                    ),
                ),
                migrations.RemoveConstraint(
                    model_name="grade",
                    name="unique_grade_per_student_evaluation",
                ),
                migrations.AlterModelOptions(
                    name="grade",
                    options={
                        "ordering": ["-date", "-created_at"],
                        "verbose_name": "Note",
                        "verbose_name_plural": "Notes",
                    },
                ),
            ],
        ),
    ]
