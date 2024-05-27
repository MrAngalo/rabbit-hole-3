import os
import requests
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request

API_URL = "https://tenor.googleapis.com/v2"


@csrf_exempt
@api_view(["GET"])
def posts(request: Request):
    query_params = request.query_params
    if len(query_params) == 0:
        return Response(
            {"error": "Invalid query parameters."}, status=status.HTTP_400_BAD_REQUEST
        )

    api_key = os.getenv("TENOR_API_V2")
    full_url = f"{API_URL}/posts/?key={api_key}&{query_params.urlencode()}"

    try:
        response = requests.get(full_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "Invalid query parameters."}, status=status.HTTP_400_BAD_REQUEST
        )

    return Response(response.json(), status=response.status_code)
