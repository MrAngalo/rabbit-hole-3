import os
from typing import List
import requests
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request

API_URL = "https://tenor.googleapis.com/v2"
API_KEY = os.getenv("TENOR_API_V2")
CLIENT_KEY = "internal"


@csrf_exempt
@api_view(["GET"])
def posts(request: Request):
    if not validateParams(request):
        return Response(
            {"error": "Invalid query parameters."}, status=status.HTTP_400_BAD_REQUEST
        )

    query_params = request.query_params
    full_url = f"{API_URL}/posts/?key={API_KEY}&{query_params.urlencode()}"

    try:
        response = requests.get(full_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "Invalid query parameters."}, status=status.HTTP_400_BAD_REQUEST
        )

    return Response(response.json(), status=response.status_code)


@csrf_exempt
@api_view(["GET"])
def search(request: Request):
    if not validateParams(request, ["limit"]):
        return Response(
            {"error": "Invalid query parameters."}, status=status.HTTP_400_BAD_REQUEST
        )

    query_params = request.query_params
    full_url = f"{API_URL}/search/?key={API_KEY}&{query_params.urlencode()}&limit=30"

    try:
        response = requests.get(full_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "Invalid query parameters."}, status=status.HTTP_400_BAD_REQUEST
        )

    return Response(response.json(), status=response.status_code)


def validateParams(request: Request, blacklist: List[str] = []) -> bool:
    query_params = request.query_params
    if len(query_params) == 0:
        return False

    if "key" in query_params:
        return False

    for item in blacklist:
        if item in query_params:
            return False

    return True
