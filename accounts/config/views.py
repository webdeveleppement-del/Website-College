from django.http import JsonResponse


def api_home(request):
    return JsonResponse(
        {
            "success": True,
            "name": "Gestion Ecole API",
            "version": "1.0.0",
            "status": "online",
            "message": "Backend Django opérationnel.",
        }
    )
